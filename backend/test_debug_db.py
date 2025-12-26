import sys
import os

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select, func
from database import engine
from models import Event, Registration
from config import settings

def test_connection():
    print(f"--- DATABASE DEBUG ---")
    print(f"DATABASE_URL Configured: {'Yes' if settings.DATABASE_URL else 'NO'}")
    
    if not settings.DATABASE_URL:
        print("CRITICAL: DATABASE_URL is missing.")
        return

    try:
        with Session(engine) as session:
            # 1. Test Event Count
            event_count = session.exec(select(func.count(Event.id))).one()
            print(f"Total Events Found: {event_count}")
            
            if event_count > 0:
                first_event = session.exec(select(Event).limit(1)).first()
                print(f"Sample Event: {first_event.title} (Status: {first_event.status})")
            
            # 2. Test Registration Count
            reg_count = session.exec(select(func.count(Registration.id))).one()
            print(f"Total Registrations: {reg_count}")

            # 3. Test Upcoming Events
            upcoming = session.exec(select(func.count(Event.id)).where(Event.status == 'upcoming')).one()
            print(f"Upcoming Events: {upcoming}")

    except Exception as e:
        print(f"CONNECTION ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_connection()
