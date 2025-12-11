import uuid
from typing import Optional
from datetime import date  # <--- NEW IMPORT
from enum import Enum      # <--- NEW IMPORT
from sqlmodel import SQLModel, Field

# ==========================================
# Enums (For Validation - Part C)
# ==========================================

class EventStatus(str, Enum):
    UPCOMING = "upcoming"
    COMPLETED = "completed"

class RegistrationStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"

# ==========================================
# Database Tables
# ==========================================

class Event(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str
    date: date  # <--- FIXED (Part B): Used specific date type
    location: str
    category: str
    maxVolunteers: int
    currentVolunteers: int = Field(default=0)
    description: str
    organizerId: str
    organizerName: str
    imageUrl: Optional[str] = None
    status: str = Field(default=EventStatus.UPCOMING)

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
# Request Models
# ==========================================

class BookmarkRequest(SQLModel):
    eventId: str

class JoinRequest(SQLModel):
    userId: str
    userName: Optional[str] = "Student"
    userAvatar: Optional[str] = ""

# NEW: Specific models for validation (Part C)
class UpdateEventStatusRequest(SQLModel):
    status: EventStatus

class UpdateRegistrationStatusRequest(SQLModel):
    status: RegistrationStatus
