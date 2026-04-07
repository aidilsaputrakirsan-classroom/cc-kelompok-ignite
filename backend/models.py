from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    """Model untuk tabel 'users'."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)  # Perbaikan: password_hash (sesuai ERD)
    phone = Column(String(20), nullable=True)  # Nomor telepon user
    address = Column(Text, nullable=True)  # Alamat default user
    role = Column(String(20), default="customer", nullable=False)  # admin atau customer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # Track perubahan profil user


class Product(Base):
    """Model untuk tabel 'products' - Produk makanan UMKM."""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, default="makanan")  # makanan, minuman, snack, dll
    slug = Column(String(100), nullable=True, unique=True)  # Perbaikan: Tambah slug (sesuai ERD)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False, default=0)
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)  # Perbaikan: is_active (bukan is_available)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Cart(Base):
    """Model untuk tabel 'carts' - Keranjang belanja user."""
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(20), default="active", nullable=False)  # Perbaikan: Tambah status (sesuai ERD)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship ke CartItems
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    """Model untuk tabel 'cart_items' - Item dalam keranjang belanja."""
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price_at_time = Column(Float, nullable=False)  # Perbaikan: Sesuai ERD (price_at_time)
    subtotal = Column(Float, nullable=False)  # Perbaikan: Tambah subtotal (sesuai ERD)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship ke Cart
    cart = relationship("Cart", back_populates="items")


class Order(Base):
    """Model untuk tabel 'orders' - Pesanan dari customer."""
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    order_code = Column(String(50), unique=True, nullable=False, index=True)  # Perbaikan: order_code (bukan order_number)
    receipt_name = Column(String(100), nullable=False)  # Perbaikan: Tambah receipt_name (sesuai ERD)
    recipient_phone = Column(String(20), nullable=False)  # Perbaikan: recipient_phone (bukan ordering_phone)
    shipping_address = Column(Text, nullable=False)  # Perbaikan: shipping_address (bukan ordering_address)
    notes = Column(Text, nullable=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String(20), default="pending", nullable=False)  # pending, processing, shipped, delivered, cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    """Model untuk tabel 'order_items' - Item dalam pesanan."""
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    price_at_time = Column(Float, nullable=False)  # Harga saat order dibuat
    subtotal = Column(Float, nullable=False)  # Perbaikan: Tambah subtotal (sesuai ERD)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product", backref="order_items")


class Payment(Base):
    """Model untuk tabel 'payments' - Pembayaran untuk pesanan."""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    payment_method = Column(String(50), nullable=False)  # credit_card, bank_transfer, e_wallet, cash
    amount = Column(Float, nullable=False)
    payment_status = Column(String(20), default="pending", nullable=False)  # pending, completed, failed, refunded
    proof_url = Column(String(255), nullable=True)  # URL bukti transfer/receipt
    paid_at = Column(DateTime(timezone=True), nullable=True)  # Perbaikan: Tambah paid_at (sesuai ERD)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Perbaikan: INT (user_id), bukan String
    verified_at = Column(DateTime(timezone=True), nullable=True)  # Perbaikan: Tambah verified_at (sesuai ERD)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="payments")
    verified_admin = relationship("User", foreign_keys=[verified_by])


class Testimonial(Base):
    """Model untuk tabel 'testimonials' - Review/rating produk dari customer."""
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=True)  # Perbaikan: Tambah order_id (sesuai ERD)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)  # Perbaikan: INT (user_id admin), bukan String
    verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    order = relationship("Order", backref="testimonials")  # Perbaikan: Tambah relasi ke Order
    product = relationship("Product", backref="testimonials")
    user = relationship("User", foreign_keys=[user_id], backref="testimonials_given")
    verified_admin = relationship("User", foreign_keys=[verified_by])