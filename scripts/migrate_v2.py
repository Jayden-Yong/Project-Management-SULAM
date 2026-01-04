
import os
import sys

# Add parent directory to path to allow importing api modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from api.database import engine

def migrate():
    """
    Manually add new columns to the 'event' table.
    Safe to run even if columns exist (checks not implemented here, but SQL errors will just be logged if duplicate).
    """
    print("🚀 Starting Database Migration...")
    
    commands = [
        # Add locationCategory
        'ALTER TABLE event ADD COLUMN "locationCategory" VARCHAR DEFAULT \'Other\';',
        
        # Add private fields
        'ALTER TABLE event ADD COLUMN "whatsappLink" VARCHAR;',
        'ALTER TABLE event ADD COLUMN "welcomeMessage" VARCHAR;'
    ]

    with engine.connect() as conn:
        for cmd in commands:
            try:
                print(f"Executing: {cmd}")
                conn.execute(text(cmd))
                conn.commit()
                print("✅ Success")
            except Exception as e:
                print(f"⚠️ Note: {e}")
                # Using rollback in case of error to keep connection clean
                conn.rollback()

    print("🏁 Migration Completed.")

if __name__ == "__main__":
    migrate()
