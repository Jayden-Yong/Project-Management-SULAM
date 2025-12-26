import datetime
import os
import asyncio
import httpx
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from sqlmodel import Session, col, func, select, or_, and_

from auth import get_current_user, get_current_organizer
from config import settings
from database import engine, get_session
from models import (
    Bookmark,
    BookmarkRequest,
    Event,
    EventReadWithStats,
    EventStatus,
    Feedback,
    JoinRequest,
    Registration,
    RegistrationStatus,
    UpdateEventStatusRequest,
    UpdateFeedbackRequest,
    UpdateRegistrationStatusRequest,
)

# =============================================================================
# APP INITIALIZATION
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    Includes the self-ping 'Keep-Awake' task for Render Free Tier.
    """
    async def ping_self():
        url = os.environ.get("RENDER_EXTERNAL_URL") or f"http://localhost:{settings.PORT}"
        async with httpx.AsyncClient() as client:
            while True:
                try:
                    await client.get(url)
                    if settings.DEBUG: print(f"Keep-awake ping to {url} successful")
                except Exception as e:
                    print(f"Keep-awake ping to {url} failed: {e}")
                await asyncio.sleep(600) # 10 minutes

    # Start background task
    bg_task = asyncio.create_task(ping_self())
    yield
    # Cleanup on shutdown
    bg_task.cancel()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# =============================================================================
# HELPER LOGIC
# =============================================================================

def calculate_badges_logic(completed_count: int):
    """Determines earned badges based on event completion count."""
    badges = []
    if completed_count >= 1:
        badges.append({"id": "starter", "name": "First Step", "icon": "🌱", "description": "Completed your first event"})
    if completed_count >= 3:
        badges.append({"id": "regular", "name": "Community Regular", "icon": "⭐", "description": "Completed 3 events"})
    if completed_count >= 10:
        badges.append({"id": "expert", "name": "SULAM Expert", "icon": "🏆", "description": "Completed 10 events"})
    return badges

# =============================================================================
# PUBLIC ROUTES (Events & Health)
# =============================================================================

@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "SULAM API is live", "environment": settings.ENVIRONMENT}

@app.get("/events", response_model=List[Event], tags=["Events"])
async def get_events(
    organizerId: Optional[str] = None, 
    status: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,    
    limit: int = 100, 
    session: Session = Depends(get_session)
):
    """
    Fetch events with filtering. Includes 'Lazy Auto-Update' to mark
    past upcoming events as completed.
    """
    # 1. Background cleanup: Mark expired upcoming events as completed
    try:
        today = datetime.date.today()
        past_events = session.exec(
            select(Event).where(Event.status == EventStatus.UPCOMING, Event.date < today)
        ).all()
        if past_events:
            for e in past_events: e.status = EventStatus.COMPLETED
            session.commit()
    except Exception as e:
        if settings.DEBUG: print(f"Lazy Update Failed: {e}")
        session.rollback()

    # 2. Build Query
    query = select(Event)
    if organizerId:
        query = query.where(Event.organizerId == organizerId)
    
    if status == EventStatus.COMPLETED:
        query = query.where(or_(Event.status == EventStatus.COMPLETED, 
                               and_(Event.status == EventStatus.UPCOMING, Event.date < datetime.date.today())))
    elif status == EventStatus.UPCOMING:
        query = query.where(Event.status == EventStatus.UPCOMING)
    elif status:
        query = query.where(Event.status == status)

    if category and category != 'All':
        query = query.where(Event.category == category)
    if search:
        query = query.where(col(Event.title).ilike(f"%{search}%"))
    
    return session.exec(query.offset(skip).limit(limit)).all()

@app.get("/events/{event_id}", response_model=Event, tags=["Events"])
async def get_event_by_id(event_id: str, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# =============================================================================
# ORGANIZER ROUTES (Event Management)
# =============================================================================

@app.post("/events", response_model=Event, tags=["Organizer"])
async def create_event(
    event: Event, 
    session: Session = Depends(get_session),
    current_organizer: dict = Depends(get_current_organizer) 
):
    event.organizerId = current_organizer.get("sub")
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@app.put("/events/{event_id}", response_model=Event, tags=["Organizer"])
async def update_event_details(
    event_id: str,
    event_update: Event, 
    session: Session = Depends(get_session),
    current_organizer: dict = Depends(get_current_organizer) 
):
    db_event = session.get(Event, event_id)
    if not db_event: raise HTTPException(status_code=404, detail="Event not found")
    if db_event.organizerId != current_organizer.get("sub"):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Efficient update
    update_data = event_update.model_dump(exclude_unset=True, exclude={"id", "organizerId", "currentVolunteers"})
    for key, value in update_data.items():
        setattr(db_event, key, value)
        
    session.add(db_event)
    session.commit()
    session.refresh(db_event)
    return db_event

@app.patch("/events/{event_id}", response_model=Event, tags=["Organizer"])
async def update_event_status(
    event_id: str, 
    payload: UpdateEventStatusRequest, 
    session: Session = Depends(get_session),
    current_organizer: dict = Depends(get_current_organizer)
):
    event = session.get(Event, event_id)
    if not event or event.organizerId != current_organizer.get("sub"):
        raise HTTPException(status_code=404, detail="Event not found or unauthorized")
    
    event.status = payload.status
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@app.get("/organizers/dashboard", response_model=List[EventReadWithStats], tags=["Organizer"])
async def get_organizer_dashboard_stats(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_organizer)
):
    """Dashboard view with aggregated review stats."""
    organizer_id = current_user.get("sub")
    query = (
        select(Event, func.coalesce(func.avg(Feedback.rating), 0.0).label("avgRating"), func.count(Feedback.id).label("feedbackCount"))
        .outerjoin(Feedback, Event.id == Feedback.eventId)
        .where(Event.organizerId == organizer_id)
        .group_by(Event.id)
    )
    results = session.exec(query).all()
    
    output = []
    for event, avg, count in results:
        data = EventReadWithStats.model_validate(event)
        data.avgRating, data.feedbackCount = round(avg, 1), count
        output.append(data)
    return output

# =============================================================================
# VOLUNTEER ROUTES (Join & Engagement)
# =============================================================================

@app.post("/events/{event_id}/join", tags=["Volunteer"])
async def join_event(
    event_id: str, 
    payload: JoinRequest, 
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    """Apply to join an event. Restricted to the authenticated user."""
    if payload.userId != current_user.get("sub"):
        raise HTTPException(status_code=403, detail="Auth ID mismatch")

    # Guard against race conditions
    event = session.exec(select(Event).where(Event.id == event_id).with_for_update()).one_or_none()
    if not event: raise HTTPException(status_code=404, detail="Event not found")

    existing = session.exec(select(Registration).where(Registration.eventId == event_id, Registration.userId == payload.userId)).first()
    if existing: raise HTTPException(status_code=400, detail="Already applied")
    
    new_reg = Registration(
        eventId=event_id, userId=payload.userId, joinedAt=datetime.date.today().isoformat(),
        userName=payload.userName, userAvatar=payload.userAvatar
    )
    session.add(new_reg)
    session.commit()
    return new_reg

@app.patch("/registrations/{registration_id}", tags=["Organizer"])
async def update_registration_status(
    registration_id: str, 
    payload: UpdateRegistrationStatusRequest,
    session: Session = Depends(get_session),
    current_organizer: dict = Depends(get_current_organizer)
):
    """Approve/Reject a volunteer. Atomically updates event capacity."""
    reg = session.get(Registration, registration_id)
    if not reg: raise HTTPException(status_code=404, detail="Not found")
    
    event = session.exec(select(Event).where(Event.id == reg.eventId).with_for_update()).one_or_none()
    if event.organizerId != current_organizer.get("sub"): raise HTTPException(status_code=403)
    
    old_status, new_status = reg.status, payload.status
    if new_status == RegistrationStatus.CONFIRMED and old_status != RegistrationStatus.CONFIRMED:
        if event.currentVolunteers >= event.maxVolunteers: raise HTTPException(status_code=400, detail="Full")
        event.currentVolunteers += 1
    elif old_status == RegistrationStatus.CONFIRMED and new_status != RegistrationStatus.CONFIRMED:
        event.currentVolunteers = max(0, event.currentVolunteers - 1)

    reg.status = new_status
    session.add_all([reg, event])
    session.commit()
    return reg

@app.get("/users/{user_id}/registrations", tags=["Volunteer"])
async def get_user_registrations(
    user_id: str, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)
):
    if user_id != current_user.get("sub"): raise HTTPException(status_code=403)
    regs = session.exec(select(Registration).where(Registration.userId == user_id)).all()
    
    enriched = []
    for r in regs:
        event = session.get(Event, r.eventId)
        has_fb = session.exec(select(Feedback).where(Feedback.eventId == r.eventId, Feedback.userId == user_id)).first() is not None
        d = r.model_dump()
        if event:
            d.update({"eventTitle": event.title, "eventDate": event.date.isoformat(), "eventStatus": event.status})
        d["hasFeedback"] = has_fb
        enriched.append(d)
    return enriched

# --- Bookmarks & Feedback ---

@app.get("/users/{user_id}/bookmarks", tags=["Volunteer"])
async def get_user_bookmarks(user_id: str, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    if user_id != current_user.get("sub"): raise HTTPException(status_code=403)
    return [b.eventId for b in session.exec(select(Bookmark).where(Bookmark.userId == user_id)).all()]

@app.post("/users/{user_id}/bookmarks", tags=["Volunteer"])
async def toggle_bookmark(user_id: str, body: BookmarkRequest, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    if user_id != current_user.get("sub"): raise HTTPException(status_code=403)
    existing = session.exec(select(Bookmark).where(Bookmark.userId == user_id, Bookmark.eventId == body.eventId)).first()
    if existing: session.delete(existing)
    else: session.add(Bookmark(userId=user_id, eventId=body.eventId))
    session.commit()
    return [b.eventId for b in session.exec(select(Bookmark).where(Bookmark.userId == user_id)).all()]

@app.get("/users/me/bookmarks/events", response_model=List[Event], tags=["Volunteer"])
async def get_my_bookmarked_events(session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    return session.exec(select(Event).join(Bookmark, Bookmark.eventId == Event.id).where(Bookmark.userId == current_user.get("sub"))).all()

@app.post("/feedbacks", tags=["Volunteer"])
async def submit_feedback(feedback: Feedback, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    if feedback.userId != current_user.get("sub"): raise HTTPException(status_code=403)
    session.add(feedback); session.commit()
    return {"status": "success"}

@app.get("/users/{user_id}/badges", tags=["Volunteer"])
async def get_user_badges(user_id: str, session: Session = Depends(get_session)):
    count = len(session.exec(select(Registration).join(Event, Registration.eventId == Event.id).where(Registration.userId == user_id, Registration.status == RegistrationStatus.CONFIRMED, Event.status == "completed")).all())
    return calculate_badges_logic(count)

@app.get("/events/{event_id}/registrations", tags=["Organizer"])
async def get_event_registrations(event_id: str, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    return session.exec(select(Registration).where(Registration.eventId == event_id)).all()

@app.get("/events/{event_id}/rating", tags=["Events"])
async def get_event_rating(event_id: str, session: Session = Depends(get_session)):
    fbs = session.exec(select(Feedback).where(Feedback.eventId == event_id)).all()
    return {"average": round(sum(f.rating for f in fbs) / len(fbs), 1) if fbs else 0}

@app.get("/feedbacks", tags=["Events"])
async def get_feedbacks(userId: Optional[str] = None, eventId: Optional[str] = None, session: Session = Depends(get_session)):
    query = select(Feedback)
    if userId: query = query.where(Feedback.userId == userId)
    if eventId: query = query.where(Feedback.eventId == eventId)
    return session.exec(query).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
