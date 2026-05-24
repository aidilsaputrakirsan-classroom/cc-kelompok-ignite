"""Database connection for Auth Service."""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables dari .env
load_dotenv()

# Ambil DATABASE_URL dari environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Fallback SQLite untuk testing / GitHub Actions
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./auth_test.db"

# Create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args=(
        {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
    ),
)

# Session database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
Base = declarative_base()


def get_db():
    """
    Dependency untuk mendapatkan database session.
    Akan otomatis close setelah request selesai.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
