from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional, Literal
from datetime import datetime
import re


# ================= PRODUCT (Produk Makanan UMKM) =================

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Amplang Balikpapan"])
    description: Optional[str] = Field(None, examples=["Amplang gurih khas Balikpapan"])
    category: str = Field(default="makanan", examples=["makanan", "minuman", "snack"])
    slug: Optional[str] = Field(None, examples=["amplang-balikpapan"])
    price: float = Field(..., gt=0, examples=[25000])
    stock: int = Field(0, ge=0, examples=[100])
    image_url: Optional[str] = Field(None, examples=["https://example.com/amplang.jpg"])
    is_active: bool = Field(default=True)

    @field_validator("name")
    def validate_name(cls, value):
        if not value.strip():
            raise ValueError("Nama produk tidak boleh kosong")
        return value.strip()

    @field_validator("category")
    def normalize_category(cls, value):
        if not value or not value.strip():
            return "makanan"
        return value.lower().strip()

    @field_validator("slug")
    def normalize_slug(cls, value):
        if value:
            return value.lower().replace(" ", "-")
        return value


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    category: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("name")
    def validate_name(cls, value):
        if value is not None and not value.strip():
            raise ValueError("Nama produk tidak boleh kosong")
        return value.strip() if value else value

    @field_validator("category")
    def normalize_category(cls, value):
        if value:
            return value.lower().strip()
        return value

    @field_validator("slug")
    def normalize_slug(cls, value):
        if value:
            return value.lower().replace(" ", "-")
        return value


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
    categories: dict
    total_value: float


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
    price_at_time: float
    subtotal: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ================= CART =================

class CartResponse(BaseModel):
    id: int
    user_id: int
    status: str = "active"
    items: list[CartItemResponse] = []
    total_items: int = 0
    total_price: float = 0
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

    @staticmethod
    def from_orm_with_calculations(cart):
        total_items = (
            sum(item.quantity for item in cart.items)
            if hasattr(cart, 'items')
            else 0
        )

        total_price = (
            sum(item.subtotal for item in cart.items)
            if hasattr(cart, 'items')
            else 0
        )

        return {
            "id": cart.id,
            "user_id": cart.user_id,
            "status": cart.status,
            "items": [
                CartItemResponse.model_validate(item)
                for item in cart.items
            ] if hasattr(cart, 'items') else [],
            "total_items": total_items,
            "total_price": total_price,
            "created_at": cart.created_at,
            "updated_at": cart.updated_at,
        }


# ================= AUTH =================

class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=2, max_length=100, examples=["Andini"])
    password: str = Field(..., min_length=8, examples=["Password123"])
    phone: Optional[str] = Field(None, max_length=20, examples=["081234567890"])
    address: Optional[str] = Field(None, examples=["Jl. Ahmad Yani No. 123, Balikpapan"])
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


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserListResponse(BaseModel):
    total: int
    users: list[UserResponse]


# ================= ORDER =================

class OrderItemCreate(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(1, gt=0, examples=[1, 2, 5])


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price_at_time: float
    subtotal: float
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: list[OrderItemCreate] = Field(..., min_length=1)
    receipt_name: str = Field(..., min_length=2, max_length=100, examples=["Andini Permata"])
    recipient_phone: str = Field(..., min_length=10, max_length=20, examples=["081234567890"])
    shipping_address: str = Field(..., min_length=5, examples=["Jl. Ahmad Yani No. 123, Balikpapan"])
    notes: Optional[str] = Field(None, examples=["Antar sebelum jam 5 sore"])

    @field_validator("receipt_name")
    def validate_receipt_name(cls, value):
        if not value.strip():
            raise ValueError("Nama penerima tidak boleh kosong")
        return value.strip()


class OrderUpdate(BaseModel):
    status: Optional[
        Literal[
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled"
        ]
    ] = None

    receipt_name: Optional[str] = None
    recipient_phone: Optional[str] = None
    shipping_address: Optional[str] = None
    notes: Optional[str] = None


class OrderResponse(BaseModel):
    id: int
    user_id: int
    order_code: str
    receipt_name: str
    recipient_phone: str
    shipping_address: str
    notes: Optional[str] = None
    total_amount: float
    status: str
    items: list[OrderItemResponse] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    total: int
    orders: list[OrderResponse]


# ================= PAYMENT =================

class PaymentCreate(BaseModel):
    order_id: int = Field(..., gt=0)

    payment_method: Literal[
        "credit_card",
        "bank_transfer",
        "e_wallet",
        "cash"
    ]

    amount: float = Field(
        ...,
        gt=0,
        description="Jumlah pembayaran harus sesuai dengan total_amount order"
    )

    proof_url: Optional[str] = Field(
        None,
        examples=["https://example.com/receipt.jpg"]
    )


class PaymentUpdate(BaseModel):
    payment_status: Literal[
        "pending",
        "completed",
        "failed",
        "refunded"
    ]

    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None


class PaymentResponse(BaseModel):
    id: int
    order_id: int
    payment_method: str
    amount: float
    payment_status: str
    proof_url: Optional[str] = None
    paid_at: Optional[datetime] = None
    verified_by: Optional[int] = None
    verified_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PaymentListResponse(BaseModel):
    total: int
    payments: list[PaymentResponse]


# ================= TESTIMONIAL =================

class TestimonialCreate(BaseModel):
    order_id: Optional[int] = Field(None, gt=0)
    product_id: int = Field(..., gt=0)
    rating: int = Field(..., ge=1, le=5, examples=[5, 4, 3])

    comment: Optional[str] = Field(
        None,
        max_length=500,
        examples=["Produk sangat enak dan berkualitas!"]
    )

    @field_validator("comment")
    def validate_comment(cls, value):
        if value is not None and not value.strip():
            raise ValueError("Komentar tidak boleh kosong")
        return value.strip() if value else value


class TestimonialResponse(BaseModel):
    id: int
    order_id: Optional[int] = None
    product_id: int
    user_id: int
    user_name: Optional[str] = None
    product_name: Optional[str] = None
    rating: int
    comment: Optional[str] = None
    is_visible: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TestimonialListResponse(BaseModel):
    total: int
    testimonials: list[TestimonialResponse]

# ================= TEST ITEM (UNTUK PYTEST) =================

class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)

    @field_validator("name")
    def validate_name(cls, value):
        if not value.strip():
            raise ValueError("Nama item tidak boleh kosong")
        return value.strip()