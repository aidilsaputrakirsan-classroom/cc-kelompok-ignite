from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime
import re

# ================= ITEM (Kompatibilitas Modul Sebelumnya) =================

class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Laptop"])
    description: Optional[str] = Field(None, examples=["Laptop untuk cloud computing"])
    price: float = Field(..., gt=0, examples=[15000000])
    quantity: int = Field(0, ge=0, examples=[10])


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ItemListResponse(BaseModel):
    total: int
    items: list[ItemResponse]


# ================= PRODUCT (Produk Makanan UMKM) =================

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Amplang Balikpapan"])
    description: Optional[str] = Field(None, examples=["Amplang gurih khas Balikpapan"])
    category: str = Field(default="makanan", examples=["makanan", "minuman", "snack"])
    price: float = Field(..., gt=0, examples=[25000])
    stock: int = Field(0, ge=0, examples=[100])
    image_url: Optional[str] = Field(None, examples=["https://example.com/amplang.jpg"])
    is_available: bool = Field(default=True)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    is_available: Optional[bool] = None


class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    total: int
    products: list[ProductResponse]


class ProductStatsResponse(BaseModel):
    total_products: int
    total_stock: int
    total_available: int
    categories: dict  # {'makanan': 5, 'minuman': 3, ...}
    total_value: float  # Total harga stock (price * stock)


# ================= CART ITEM =================

class CartItemCreate(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(1, gt=0, examples=[1, 2, 5])


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0, examples=[1, 2, 5])


class CartItemResponse(BaseModel):
    id: int
    cart_id: int
    product_id: int
    quantity: int
    price: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ================= CART =================

class CartResponse(BaseModel):
    id: int
    user_id: int
    items: list[CartItemResponse] = []
    total_items: int = 0  # Jumlah item
    total_price: float = 0  # Total harga
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    @staticmethod
    def from_orm_with_calculations(cart):
        """Custom method untuk menghitung total dari items."""
        total_items = sum(item.quantity for item in cart.items) if hasattr(cart, 'items') else 0
        total_price = sum(item.quantity * item.price for item in cart.items) if hasattr(cart, 'items') else 0
        
        return {
            "id": cart.id,
            "user_id": cart.user_id,
            "items": [CartItemResponse.from_orm(item) for item in cart.items] if hasattr(cart, 'items') else [],
            "total_items": total_items,
            "total_price": total_price,
            "created_at": cart.created_at,
            "updated_at": cart.updated_at,
        }


# ================= AUTH =================

class UserCreate(BaseModel):
    email: EmailStr  # validasi email otomatis
    name: str = Field(..., min_length=2, max_length=100, examples=["Andini"])
    password: str = Field(..., min_length=8, examples=["Password123"])
    role: str = Field(default="customer", examples=["customer", "admin"])

    @field_validator("password")
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password minimal 8 karakter")
        
        if not re.search(r"\d", value):
            raise ValueError("Password harus mengandung angka")

        return value


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse