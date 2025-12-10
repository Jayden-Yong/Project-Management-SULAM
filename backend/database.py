from sqlmodel import create_engine, Session
from config import settings

# Setup the connection string (Fixes postgres:// issue for Supabase)
connection_string = settings.DATABASE_URL
if connection_string and connection_string.startswith("postgres://"):
    connection_string = connection_string.replace("postgres://", "postgresql://", 1)

# Create the engine
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session