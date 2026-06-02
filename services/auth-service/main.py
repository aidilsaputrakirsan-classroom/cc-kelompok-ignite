"""
Auth Service — Handles authentication and user management.
Microservice untuk:
- Register user
- Login user (JWT)
- Verify token (dipakai service lain)
"""

import os
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import jwt

from database import engine, get_db, Base
from models import User
from schemas import (
    UserCreate,
    UserResponse,
    LoginRequest,
    TokenResponse,
    TokenVerifyResponse,
)

# =========================
# INIT DB
# =========================
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ATHSNACK Auth Service",
    description="Microservice untuk autentikasi user (register, login, verify JWT)",
    version="1.0.0",
)

# =========================
# CORS
# =========================
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# SECURITY
# =========================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES", "60"))


# =========================
# JWT FUNCTIONS
# =========================
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# =========================
# HEALTH CHECK
# =========================
@app.get("/health")
def health():
    return {"service": "auth-service", "status": "healthy"}


# =========================
# REGISTER
# =========================
@app.post("/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    new_user = User(
        email=user.email,
        name=user.name,
        password_hash=pwd_context.hash(user.password),
        role="customer",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# =========================
# LOGIN
# =========================
@app.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not pwd_context.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_access_token(
        {"sub": str(user.id), "email": user.email, "role": user.role, "name": user.name}
    )

    return TokenResponse(access_token=token, user=user)


# =========================
# VERIFY TOKEN (UNTUK MICROSERVICE LAIN)
# =========================
@app.get("/verify", response_model=TokenVerifyResponse)
def verify_token(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = authorization.split(" ")[1]
    payload = decode_token(token)

    return TokenVerifyResponse(
        user_id=int(payload["sub"]), 
        email=payload["email"], 
        role=payload["role"],
        name=payload["name"]
    )
