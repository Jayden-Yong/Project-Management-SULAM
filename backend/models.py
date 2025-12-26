import uuid
from datetime import date
from enum import Enum
from typing import Optional, List

from sqlmodel import Field, SQLModel, UniqueConstraint

# =============================================================================
# DOMAIN ENUMS
# =============================================================================

class EventStatus(str, Enum):
    """
    Life cycle states for a SULAM event.
    'upcoming' -> Created but not yet ended.
    'completed' -> Event finished, reviews can be submitted.
    """
    UPCOMING = "upcoming"
    COMPLETED = "completed"

class RegistrationStatus(str, Enum):
    """
    States for a volunteer's application to an event.
    """
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"

# =============================================================================
# DATABASE TABLES (SQLModel)
# =============================================================================

class Event(SQLModel, table=True):
    """
    Core model representing a volunteering activity or event.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str = Field(index=True)
    date: date = Field(index=True)
    location: str
    category: str = Field(index=True)
    maxVolunteers: int
    currentVolunteers: int = Field(default=0)
    description: str
    organizerId: str = Field(index=True)
    organizerName: str
    
    # Optional image banner (URL to cloud storage)
    imageUrl: Optional[str] = Field(default=None) 
    
    # Store list of tasks as a plain string (newline separated)
    tasks: str = Field(default="")
    
    status: str = Field(default=EventStatus.UPCOMING, index=True)

class Registration(SQLModel, table=True):
    """
    Many-to-Many link between Users and Events.
    Uses 'Snapshot' pattern for user details to avoid redundant lookups.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    eventId: str = Field(index=True, foreign_key="event.id")
    userId: str = Field(index=True)
    status: str = Field(default=RegistrationStatus.PENDING, index=True)
    joinedAt: str # ISO Date string
    
    # Cached user details for performance
    userName: Optional[str] = Field(default="Student Volunteer")
    userAvatar: Optional[str] = Field(default=None)

    # Database-level constraint to prevent someone joining the same event twice
    __table_args__ = (UniqueConstraint("userId", "eventId", name="unique_registration"),)

class Feedback(SQLModel, table=True):
    """
    Reviews and ratings left by students after completing an event.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    eventId: str = Field(index=True, foreign_key="event.id")
    userId: str = Field(index=True)
    rating: int = Field(ge=1, le=5) # Enforce 1-5 star range
    comment: str

class Bookmark(SQLModel, table=True):
    """
    User's personal 'Saved for Later' list.
    Only stores pointers to avoid duplication.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    userId: str = Field(index=True)
    eventId: str = Field(index=True, foreign_key="event.id")

# =============================================================================
# DATA TRANSFER OBJECTS (DTOs & Views)
# =============================================================================

class EventReadWithStats(Event):
    """
    Data view for the Organizer Dashboard, including computed stats.
    """
    avgRating: float = 0.0
    feedbackCount: int = 0

class BookmarkRequest(SQLModel):
    """Payload for toggling a bookmark."""
    eventId: str

class JoinRequest(SQLModel):
    """Payload for applying to an event."""
    userId: str
    userName: Optional[str] = "Student"
    userAvatar: Optional[str] = ""

class UpdateEventStatusRequest(SQLModel):
    """Payload for concluding an event."""
    status: EventStatus

class UpdateRegistrationStatusRequest(SQLModel):
    """Payload for confirming/rejecting a volunteer."""
    status: RegistrationStatus

class UpdateFeedbackRequest(SQLModel):
    """Payload for editing a review."""
    rating: int = Field(ge=1, le=5)
    comment: str
