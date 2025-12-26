from sqlmodel import Session, create_engine

from config import settings

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL is not set. Check your backend/.env or Render environment.")

# =============================================================================
# DATABASE ENGINE (SQLAlchemy/SQLModel)
# =============================================================================

# Optimized for Supabase Transaction Pooler (Port 6543)
# We use NullPool because Supabase handles the pooling on their end.
# Keeping a client-side pool open can cause timeouts/disconnects.
from sqlalchemy.pool import NullPool

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # Checks if connection is alive before using it
    echo=settings.DEBUG,     # Logs SQL queries in Dev mode
    poolclass=NullPool,      # Disable SQLAlchemy pooling (Client-side)
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
