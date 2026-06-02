from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

# ================= PRODUCT =================


class ProductBase(BaseModel):
    name: str = Field(
        ..., min_length=1, max_length=100, examples=["Amplang Balikpapan"]
    )

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


# ================= CREATE =================


class ProductCreate(ProductBase):
    pass


# ================= UPDATE =================


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


# ================= RESPONSE =================


class ProductResponse(ProductBase):
    id: int

    owner_id: int

    created_at: datetime

    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ================= LIST RESPONSE =================


class ProductListResponse(BaseModel):
    total: int
    products: list[ProductResponse]


# ================= STATS RESPONSE =================


class ItemStatsDetail(BaseModel):
    """Model untuk item termahal/termurah"""

    id: int
    name: str
    price: float
    stock: int
    category: str

    class Config:
        from_attributes = True


class ItemStatsResponse(BaseModel):
    """
    Response model untuk stats endpoint.
    Memberikan overview statistik inventory:
    - total_items: jumlah total items
    - total_value: nilai total inventory (price * stock)
    - most_expensive: item dengan harga paling tinggi
    - cheapest: item dengan harga paling rendah
    """

    total_items: int = Field(..., ge=0, description="Total jumlah item")
    total_value: float = Field(
        ..., ge=0, description="Total nilai inventory (price × stock)"
    )
    most_expensive: Optional[ItemStatsDetail] = Field(
        None, description="Item dengan harga paling tinggi"
    )
    cheapest: Optional[ItemStatsDetail] = Field(
        None, description="Item dengan harga paling rendah"
    )
