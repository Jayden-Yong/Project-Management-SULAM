from sqlmodel import SQLModel
from database import engine
# Import all models so SQLModel knows what to drop
from models import Event, Registration, Feedback, Bookmark

def wipe_database():
    print("🗑️  Wiping database...")
    try:
        # This creates a transaction to drop everything safely
        SQLModel.metadata.drop_all(engine)
        print("✅ Tables dropped successfully.")
        
        # Verify it's clean by trying to create tables immediately
        SQLModel.metadata.create_all(engine)
        print("✅ Tables recreated successfully.")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    wipe_database()