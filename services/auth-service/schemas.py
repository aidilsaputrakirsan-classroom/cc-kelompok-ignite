"""Pydantic schemas for Auth Service."""

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, Literal
from datetime import datetime
import re

# =====================
# USER REGISTER
# =====================


class UserCreate(BaseModel):
    email: EmailStr

    name: str = Field(..., min_length=2, max_length=100, examples=["Andini"])

    password: str = Field(..., min_length=8, examples=["Password123"])

    phone: Optional[str] = Field(None, max_length=20, examples=["081234567890"])

    address: Optional[str] = Field(None, examples=["Jl. Ahmad Yani No. 123"])

    role: Literal["customer", "admin"] = "customer"

    @field_validator("name")
    def validate_name(cls, value):
        if not value.strip():
            raise ValueError("Nama tidak boleh kosong")
        return value.strip()

    @field_validator("phone")
    def validate_phone(cls, value):
        if value and not re.fullmatch(r"^\d{10,15}$", value):
            raise ValueError("Nomor telepon tidak valid")
        return value

    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password minimal 8 karakter")

        if not re.search(r"\d", value):
            raise ValueError("Password harus mengandung angka")

        return value


# =====================
# USER RESPONSE
# =====================


class UserResponse(BaseModel):
    id: int
    email: str
    name: str

    phone: Optional[str] = None
    address: Optional[str] = None

    role: str
    is_active: bool

    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# =====================
# LOGIN
# =====================


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =====================
# JWT TOKEN RESPONSE
# =====================


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# =====================
# VERIFY TOKEN RESPONSE
# =====================


class TokenVerifyResponse(BaseModel):
    user_id: int
    email: str
    name: str
    role: str
