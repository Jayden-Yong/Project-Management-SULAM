import uuid
from typing import Optional
from datetime import date
from enum import Enum
from sqlmodel import SQLModel, Field
from pydantic import field_validator

# ==========================================
# Enums (For Validation)
# ==========================================

class EventStatus(str, Enum):
    UPCOMING = "upcoming"
    COMPLETED = "completed"

class RegistrationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"

# ==========================================
# Database Tables (Stored in DB)
# ==========================================

class Event(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str
    date: date
    location: str
    category: str
    maxVolunteers: int
    currentVolunteers: int = Field(default=0)
    description: str
    organizerId: str
    organizerName: str
    imageUrl: Optional[str] = Field(default=None, sa_column_kwargs={"type_": "TEXT"}) # Explicitly use TEXT for large strings
    status: str = Field(default=EventStatus.UPCOMING)

    # --- PERFORMANCE FIX: Validate Image Size ---
    @field_validator("imageUrl")
    @classmethod
    def validate_image_size(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v) > 3_000_000:  # Limit to ~3MB (approx 2MB image base64 encoded)
            raise ValueError("Image size is too large. Please use a smaller image (under 2MB).")
        return v

class Registration(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    eventId: str = Field(index=True)
    userId: str = Field(index=True)
    status: str = Field(default=RegistrationStatus.PENDING)
    joinedAt: str
    userName: Optional[str] = "Student Volunteer"
    userAvatar: Optional[str] = None

class Feedback(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    eventId: str = Field(index=True)
    userId: str = Field(index=True)
    rating: int
    comment: str

class Bookmark(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    userId: str = Field(index=True)
    eventId: str = Field(index=True)

# ==========================================
# Request Models (Body payloads)
# ==========================================

class BookmarkRequest(SQLModel):
    eventId: str

class JoinRequest(SQLModel):
    userId: str
    userName: Optional[str] = "Student"
    userAvatar: Optional[str] = ""

class UpdateEventStatusRequest(SQLModel):
    status: EventStatus

class UpdateRegistrationStatusRequest(SQLModel):
    status: RegistrationStatus
