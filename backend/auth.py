import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from dotenv import load_dotenv
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models import User

load_dotenv()


# ==================== KONFIGURASI ====================

SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key-for-development")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Gunakan HTTPBearer (BUKAN OAuth2)
security = HTTPBearer()

print("SECRET_KEY YANG DIPAKAI:", SECRET_KEY)
# ==================== PASSWORD ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# ==================== JWT TOKEN ====================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

print("SECRET_KEY YANG DIPAKAI:", SECRET_KEY)

def decode_token(token: str) -> dict:
    try:
        print("TOKEN MASUK:", token)
        print("SECRET_KEY:", SECRET_KEY)

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        print("PAYLOAD:", payload)
        return payload

    except JWTError as e:
        print("JWT ERROR:", str(e)) 
        raise HTTPException(
            status_code=401,
            detail="Token tidak valid atau sudah expired",
        )


# ==================== DEPENDENCY ====================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Ambil user dari JWT token (Authorization: Bearer <token>)
    """
    token = credentials.credentials  # ambil token dari header

    payload = decode_token(token)
    user_id = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token tidak valid",
        )

    # pastikan integer
    try:
        user_id = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Format token tidak valid",
        )

    user = db.query(User).filter(User.id == user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User tidak ditemukan",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akun tidak aktif",
        )

    return user