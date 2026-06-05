"""
Item Service — Handles inventory management.
Berkomunikasi dengan Auth Service untuk verifikasi token.
"""

import os
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

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
from database import get_db
from sqlalchemy import text

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


# ==================== FASTAPI APP ====================

app = FastAPI(
    title="Item Service",
    description="Inventory microservice — CRUD items with authentication",
    version="2.1.0",
)


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


# ==================== FAKE DATABASE ====================

fake_items_db = []
item_id_counter = 1


# ==================== CREATE ITEM ====================


@app.post("/items", response_model=ProductResponse, status_code=201)
def create_item(
    item: ProductCreate,
    current_user: dict = Depends(get_current_user),
):
    global item_id_counter

    now = datetime.utcnow()

    new_item = {
        "id": item_id_counter,
        "name": item.name,
        "description": item.description,
        "category": item.category,
        "slug": item.slug,
        "price": item.price,
        "stock": item.stock,
        "image_url": item.image_url,
        "is_active": item.is_active,
        "owner_id": current_user["user_id"],
        "created_at": now,
        "updated_at": now,
    }

    fake_items_db.append(new_item)
    item_id_counter += 1

    return new_item


# ==================== GET ITEMS ====================


@app.get("/items", response_model=ProductListResponse)
def get_items(
    search: str = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
):
    filtered = [
        item for item in fake_items_db if item["owner_id"] == current_user["user_id"]
    ]

    if search:
        filtered = [item for item in filtered if search.lower() in item["name"].lower()]

    total = len(filtered)
    items = filtered[skip : skip + limit]

    return {
        "total": total,
        "products": items,
    }


# ==================== GET ITEMS STATS ====================


@app.get("/items/stats", response_model=ItemStatsResponse)
def get_items_stats(
    current_user: dict = Depends(get_current_user),
):
    """
    Endpoint untuk mendapatkan statistik inventory pemilik.

    Returns:
    - total_items: Jumlah total item
    - total_value: Total nilai inventory (price × stock)
    - most_expensive: Item dengan harga tertinggi
    - cheapest: Item dengan harga termurah
    """
    # Filter items milik user
    user_items = [
        item for item in fake_items_db if item["owner_id"] == current_user["user_id"]
    ]

    # Jika tidak ada items
    if not user_items:
        return {
            "total_items": 0,
            "total_value": 0.0,
            "most_expensive": None,
            "cheapest": None,
        }

    # Hitung total items dan total value
    total_items = len(user_items)
    total_value = sum(item["price"] * item["stock"] for item in user_items)

    # Cari item termahal
    most_expensive = max(user_items, key=lambda x: x["price"])

    # Cari item termurah
    cheapest = min(user_items, key=lambda x: x["price"])

    return {
        "total_items": total_items,
        "total_value": total_value,
        "most_expensive": {
            "id": most_expensive["id"],
            "name": most_expensive["name"],
            "price": most_expensive["price"],
            "stock": most_expensive["stock"],
            "category": most_expensive["category"],
        },
        "cheapest": {
            "id": cheapest["id"],
            "name": cheapest["name"],
            "price": cheapest["price"],
            "stock": cheapest["stock"],
            "category": cheapest["category"],
        },
    }


# ==================== GET ITEM BY ID ====================


@app.get("/items/{item_id}", response_model=ProductResponse)
def get_item(
    item_id: int,
    current_user: dict = Depends(get_current_user),
):
    for item in fake_items_db:
        if item["id"] == item_id and item["owner_id"] == current_user["user_id"]:
            return item

    raise HTTPException(status_code=404, detail="Item not found")


# ==================== UPDATE ITEM ====================


@app.put("/items/{item_id}", response_model=ProductResponse)
def update_item(
    item_id: int,
    updated_data: ProductUpdate,
    current_user: dict = Depends(get_current_user),
):
    for item in fake_items_db:
        if item["id"] == item_id and item["owner_id"] == current_user["user_id"]:

            update_fields = updated_data.model_dump(exclude_unset=True)

            item.update(update_fields)

            return item

    raise HTTPException(status_code=404, detail="Item not found")


# ==================== DELETE ITEM ====================


@app.delete("/items/{item_id}", status_code=204)
def delete_item(
    item_id: int,
    current_user: dict = Depends(get_current_user),
):
    global fake_items_db

    existing_item = next(
        (
            item
            for item in fake_items_db
            if (item["id"] == item_id and item["owner_id"] == current_user["user_id"])
        ),
        None,
    )

    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")

    fake_items_db = [
        item
        for item in fake_items_db
        if not (item["id"] == item_id and item["owner_id"] == current_user["user_id"])
    ]

    return None
