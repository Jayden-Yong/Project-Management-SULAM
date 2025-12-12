from sqlmodel import create_engine, Session
from config import settings

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in environment")

# Engine Creation
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, 
    echo=settings.DEBUG,
    connect_args={
        "keepalives": 1,
    }
)

def get_session():
    """Dependency to provide a database session for a request."""
    with Session(engine) as session:
        yield session
