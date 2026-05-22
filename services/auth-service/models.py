"""User model for Auth Service."""

from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """
    Model user untuk Auth Service.
    Service ini hanya menangani autentikasi dan data user.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Basic user info
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)

    # Authentication
    password_hash = Column(String(255), nullable=False)

    # Additional profile data
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)

    # Authorization / status
    role = Column(String(20), default="customer", nullable=False)
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
