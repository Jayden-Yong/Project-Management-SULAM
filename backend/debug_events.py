from sqlmodel import Session, select
import datetime
from database import engine
from models import Event

def debug_events():
    with Session(engine) as session:
        events = session.exec(select(Event)).all()
        print(f"\n--- Total Events: {len(events)} ---")
        for event in events:
            print(f"ID: {event.id} | Title: {event.title} | Status: {event.status} | Date: {event.date} | Today: {datetime.date.today()}")
            is_past = event.date < datetime.date.today()
            print(f"   -> Is Past? {is_past}")
            print(f"   -> Visible in UPCOMING? {event.status == 'upcoming'}")
            print("-" * 30)

if __name__ == "__main__":
    debug_events()
