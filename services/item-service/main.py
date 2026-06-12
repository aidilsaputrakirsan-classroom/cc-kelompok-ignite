"""
Item Service — Handles inventory management.
Berkomunikasi dengan Auth Service untuk verifikasi token.
"""

import os
import logging
import shutil
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import engine
from models import Base
from schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse,
    ItemStatsResponse,
)
from auth_client import verify_token_with_auth_service, auth_circuit
from database import get_db, SessionLocal
from sqlalchemy.orm import Session
from models import Product
from sqlalchemy import text
from logging_config import setup_logging
from logging_middleware import RequestLoggingMiddleware
from metrics import metrics
setup_logging()
logger = logging.getLogger(__name__)

from fastapi import FastAPI

# ==================== FASTAPI APP ====================

app = FastAPI(
    title="Item Service",
    description="Inventory microservice — CRUD items with authentication",
    version="2.1.0",
)

app.add_middleware(RequestLoggingMiddleware)

# ==================== UPLOAD DIRECTORY ====================

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount folder direktori untuk serve gambar secara statis
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
# ==================== AUTH DEPENDENCY ====================


def get_current_user(user_data: dict = Depends(verify_token_with_auth_service)):
    return user_data


# ==================== DATABASE ====================

# Try to create tables, but don't fail if database is not available (for testing)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")
    print("This is normal during testing with mock database")


# ==================== CORS ====================

allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")

origins_list = [
    origin.strip() for origin in allowed_origins.split(",") if origin.strip()
]

cors_origins = ["*"] if origins_list == ["*"] else origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== HEALTH CHECK ====================


@app.get("/health")
async def health_check():
    """Health check dengan dependency status."""
    # Check Auth Service
    auth_status = auth_circuit.get_status()

    # Check database
    db_status = "connected"
    try:
        db = next(get_db())
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        db_status = "disconnected"

    overall = "healthy"
    if auth_status["state"] != "CLOSED":
        overall = "degraded"
    if db_status != "connected":
        overall = "unhealthy"

    return {
        "status": overall,
        "service": "item-service",
        "version": "2.1.0",
        "dependencies": {
            "auth-service": {
                "status": "available" if auth_status["state"] == "CLOSED" else "unavailable",
                "circuit_breaker": auth_status,
            },
            "database": {
                "status": db_status,
            },
        },
    }


# ==================== IMAGE UPLOAD ====================


@app.post("/upload-image", tags=["Items"])
async def upload_image(file: UploadFile = File(...)):
    """
    Upload file gambar dan simpan ke dalam server.
    Mengembalikan URL relatif untuk disimpan ke DB.
    """
    try:
        # Validasi ekstensi
        ext = file.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png", "webp"]:
            raise HTTPException(
                status_code=400,
                detail="Format file tidak didukung (harus JPG/PNG/WEBP)",
            )

        # Membuat nama file unik
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, unique_filename)

        # Simpan file
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Mengembalikan url rute mount kita
        return {"url": f"/uploads/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/items/metrics")
async def get_metrics():
    return {
        "service": "item-service",
        **metrics.get_metrics(),
    }

@app.post("/items", response_model=ProductResponse, status_code=201)
def create_item(
    item_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Simpan item baru ke database PostgreSQL.
    """
    now = datetime.utcnow()

    new_item = Product(
        name=item_data.name,
        description=item_data.description,
        category=item_data.category,
        slug=item_data.slug,
        price=item_data.price,
        stock=item_data.stock,
        image_url=item_data.image_url,
        is_active=item_data.is_active,
        owner_id=current_user["user_id"],
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# ==================== GET ITEMS ====================


@app.get("/items", response_model=ProductListResponse)
def get_items(
    search: str = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Ambil daftar item milik user dari database.
    """
    query = db.query(Product).filter(Product.owner_id == current_user["user_id"])

    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {
        "total": total,
        "products": items,
    }


# ==================== GET ITEMS STATS ====================


@app.get("/items/stats", response_model=ItemStatsResponse)
def get_items_stats(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Endpoint untuk mendapatkan statistik inventory pemilik dari database.
    """
    user_items = db.query(Product).filter(Product.owner_id == current_user["user_id"]).all()

    if not user_items:
        return {
            "total_items": 0,
            "total_value": 0.0,
            "most_expensive": None,
            "cheapest": None,
        }

    total_items = len(user_items)
    total_value = sum(item.price * item.stock for item in user_items)

    most_expensive = max(user_items, key=lambda x: x.price)
    cheapest = min(user_items, key=lambda x: x.price)

    return {
        "total_items": total_items,
        "total_value": total_value,
        "most_expensive": {
            "id": most_expensive.id,
            "name": most_expensive.name,
            "price": most_expensive.price,
            "stock": most_expensive.stock,
            "category": most_expensive.category,
        },
        "cheapest": {
            "id": cheapest.id,
            "name": cheapest.name,
            "price": cheapest.price,
            "stock": cheapest.stock,
            "category": cheapest.category,
        },
    }


# ==================== GET ITEM BY ID ====================


@app.get("/items/{item_id}", response_model=ProductResponse)
def get_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Ambil satu item spesifik dari database.
    """
    item = db.query(Product).filter(
        Product.id == item_id, 
        Product.owner_id == current_user["user_id"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    return item


# ==================== UPDATE ITEM ====================


@app.put("/items/{item_id}", response_model=ProductResponse)
def update_item(
    item_id: int,
    updated_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Update item di database.
    """
    item = db.query(Product).filter(
        Product.id == item_id, 
        Product.owner_id == current_user["user_id"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    update_fields = updated_data.model_dump(exclude_unset=True)
    for key, value in update_fields.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


# ==================== DELETE ITEM ====================


@app.delete("/items/{item_id}", status_code=204)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Hapus item dari database.
    """
    item = db.query(Product).filter(
        Product.id == item_id, 
        Product.owner_id == current_user["user_id"]
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(item)
    db.commit()

    return None
