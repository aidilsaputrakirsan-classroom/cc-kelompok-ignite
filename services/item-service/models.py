from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Text,
    Boolean,
)
from sqlalchemy.sql import func

from database import Base


class Product(Base):
    """
    Model produk UMKM ATHSNACK.
    Data disimpan di item_db.
    """

    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    name = Column(String(100), nullable=False, index=True)

    description = Column(Text, nullable=True)

    category = Column(
        String(50),
        nullable=False,
        default="makanan",
        index=True,
    )

    slug = Column(String(100), nullable=True, unique=True)

    price = Column(Float, nullable=False)

    stock = Column(Integer, nullable=False, default=0)

    image_url = Column(String(255), nullable=True)

    is_active = Column(Boolean, default=True)

    owner_id = Column(Integer, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
