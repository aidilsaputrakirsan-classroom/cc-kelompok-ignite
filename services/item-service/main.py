"""
Item Service — Handles inventory management.
Berkomunikasi dengan Auth Service untuk verifikasi token.
"""

import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from schemas import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from auth_client import verify_token_with_auth_service

# ==================== AUTH DEPENDENCY ====================


def get_current_user(user_data: dict = Depends(verify_token_with_auth_service)):
    return user_data


# ==================== DATABASE ====================

Base.metadata.create_all(bind=engine)


# ==================== FASTAPI APP ====================

app = FastAPI(
    title="Item Service",
    description="Inventory microservice — CRUD items with authentication",
    version="2.0.0",
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
def health_check():
    return {
        "status": "healthy",
        "service": "item-service",
        "version": "2.0.0",
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
        "owner_id": current_user["id"],
        "created_at": None,
        "updated_at": None,
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
        item for item in fake_items_db if item["owner_id"] == current_user["id"]
    ]

    if search:
        filtered = [item for item in filtered if search.lower() in item["name"].lower()]

    total = len(filtered)
    items = filtered[skip : skip + limit]

    return {
        "total": total,
        "products": items,
    }


# ==================== GET ITEM BY ID ====================


@app.get("/items/{item_id}", response_model=ProductResponse)
def get_item(
    item_id: int,
    current_user: dict = Depends(get_current_user),
):
    for item in fake_items_db:
        if item["id"] == item_id and item["owner_id"] == current_user["id"]:
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
        if item["id"] == item_id and item["owner_id"] == current_user["id"]:

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
            if (item["id"] == item_id and item["owner_id"] == current_user["id"])
        ),
        None,
    )

    if not existing_item:
        raise HTTPException(status_code=404, detail="Item not found")

    fake_items_db = [
        item
        for item in fake_items_db
        if not (item["id"] == item_id and item["owner_id"] == current_user["id"])
    ]

    return None
