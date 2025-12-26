from sqlmodel import Session, create_engine

from config import settings

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Check your backend/.env or Render environment.")

# =============================================================================
# DATABASE ENGINE (SQLAlchemy/SQLModel)
# =============================================================================

# Optimized for Supabase (specifically for the Free Tier connection limits)
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # Checks if connection is alive before using it
    echo=settings.DEBUG,     # Logs SQL queries in Dev mode
    pool_size=5,             # Managed connections (Baseline)
    max_overflow=10,         # Extra connections during high traffic
    pool_timeout=30,         # Timeout if connection pool is full
    pool_recycle=1800,       # Reset connections every 30 mins to avoid stale sessions
    connect_args={
        "keepalives": 1,     # Keeps TCP connection active
    }
)

def get_session():
    """
    FastAPI Dependency: Yields a database session that automatically 
    closes after the request is finished.
    """
    with Session(engine) as session:
        yield session
