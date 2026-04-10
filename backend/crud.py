from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import User, Product, Cart, CartItem, Order, OrderItem, Payment, Testimonial
from schemas import UserCreate, ProductCreate, ProductUpdate, CartItemCreate, CartItemUpdate, OrderCreate, OrderItemCreate, PaymentCreate, TestimonialCreate
from auth import hash_password, verify_password
from sqlalchemy import func
from datetime import datetime
import uuid


# ==================== USER CRUD ====================

def create_user(db: Session, user_data: UserCreate) -> User:
    """Buat user baru dengan password yang di-hash."""
    # Cek apakah email sudah terdaftar
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        return None  # Email sudah dipakai

    db_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),  # Perbaikan: password_hash
        phone=user_data.phone,
        address=user_data.address,
        role=user_data.role if hasattr(user_data, 'role') else "customer",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Autentikasi user: cek email & password."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password_hash):  # Perbaikan: password_hash
        return None
    return user


def get_users(db: Session, skip: int = 0, limit: int = 100, search: str = None, role: str = "customer"):
    """Ambil daftar user dengan pagination dan filter role."""
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
        
    if search:
        query = query.filter(
            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%")
            )
        )
        
    total = query.count()
    users = query.order_by(User.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "users": users}


# ==================== PRODUCT CRUD ====================

def create_product(db: Session, product_data: ProductCreate) -> Product:
    """Buat produk baru di database."""
    db_product = Product(**product_data.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_products(db: Session, skip: int = 0, limit: int = 20, search: str = None, category: str = None):
    """
    Ambil daftar produk dengan pagination dan filter.
    - skip: jumlah data yang di-skip
    - limit: jumlah data per halaman
    - search: cari berdasarkan nama atau deskripsi
    - category: filter berdasarkan kategori
    """
    query = db.query(Product)
    
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%")
            )
        )
    
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    
    total = query.count()
    products = query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "products": products}


def get_product(db: Session, product_id: int) -> Product | None:
    """Ambil satu produk berdasarkan ID."""
    return db.query(Product).filter(Product.id == product_id).first()


def update_product(db: Session, product_id: int, product_data: ProductUpdate) -> Product | None:
    """
    Update produk berdasarkan ID.
    Hanya update field yang dikirim.
    """
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        return None
    
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int) -> bool:
    """Hapus produk berdasarkan ID."""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    
    if not db_product:
        return False
    
    db.delete(db_product)
    db.commit()
    return True


def get_product_stats(db: Session):
    """Dapatkan statistik produk untuk dashboard admin."""
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_stock = db.query(func.sum(Product.stock)).scalar() or 0
    total_available = db.query(func.count(Product.id)).filter(Product.is_active == True).scalar() or 0  # Perbaikan: is_active
    
    # Hitung per kategori
    categories_raw = db.query(
        Product.category,
        func.count(Product.id).label("count")
    ).group_by(Product.category).all()
    categories = {cat: count for cat, count in categories_raw} if categories_raw else {}
    
    # Total nilai stock (price * stock)
    total_value = db.query(func.sum(Product.price * Product.stock)).scalar() or 0
    
    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "total_available": total_available,
        "categories": categories,
        "total_value": float(total_value)
    }


# ==================== CART CRUD ====================

def get_or_create_cart(db: Session, user_id: int) -> Cart:
    """Dapatkan cart user, jika tidak ada maka buat baru."""
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    return cart


def get_cart(db: Session, user_id: int) -> Cart | None:
    """Ambil cart user berdasarkan user_id."""
    return db.query(Cart).filter(Cart.user_id == user_id).first()


def add_to_cart(db: Session, cart_id: int, item_data: CartItemCreate) -> CartItem | None:
    """Tambah item ke cart. Jika item sudah ada, update quantitynya."""
    # Cek apakah produk ada
    product = db.query(Product).filter(Product.id == item_data.product_id).first()
    if not product:
        return None
    
    # Cek apakah item sudah ada di cart
    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart_id,
        CartItem.product_id == item_data.product_id
    ).first()
    
    if existing_item:
        # Update quantity jika sudah ada
        existing_item.quantity += item_data.quantity
        existing_item.subtotal = existing_item.price_at_time * existing_item.quantity  # Perbaikan: Tambah subtotal
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # Buat item baru
        subtotal = product.price * item_data.quantity  # Perbaikan: Hitung subtotal
        cart_item = CartItem(
            cart_id=cart_id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            price_at_time=product.price,  # Perbaikan: price_at_time
            subtotal=subtotal  # Perbaikan: Tambah subtotal
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item


def update_cart_item(db: Session, item_id: int, item_data: CartItemUpdate) -> CartItem | None:
    """Update quantity item di cart."""
    db_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    
    if not db_item:
        return None
    
    db_item.quantity = item_data.quantity
    db.commit()
    db.refresh(db_item)
    return db_item


def remove_from_cart(db: Session, item_id: int) -> bool:
    """Hapus item dari cart."""
    db_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True


def get_cart_items(db: Session, cart_id: int):
    """Ambil semua items di dalam cart."""
    return db.query(CartItem).filter(CartItem.cart_id == cart_id).all()


def clear_cart(db: Session, cart_id: int) -> bool:
    """Hapus semua items dari cart."""
    items = db.query(CartItem).filter(CartItem.cart_id == cart_id).all()
    for item in items:
        db.delete(item)
    db.commit()
    return True


# ==================== ORDER CRUD ====================

def create_order(db: Session, user_id: int, order_data: OrderCreate) -> Order:
    """Buat order baru dari cart atau data pemesanan."""
    # Generate order_code unik (Perbaikan: order_code bukan order_number)
    order_code = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
    
    # Hitung total amount dari items
    total_amount = 0.0
    order_items = []
    
    for item_data in order_data.items:
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if not product:
            raise ValueError(f"Product {item_data.product_id} tidak ditemukan")
        
        if product.stock < item_data.quantity:
            raise ValueError(f"Stock {product.name} tidak cukup")
        
        # Kurangi stock
        product.stock -= item_data.quantity
        
        # Hitung total dan subtotal
        item_subtotal = product.price * item_data.quantity  # Perbaikan: Tambah subtotal
        total_amount += item_subtotal
        
        # Simpan order item
        order_items.append(OrderItem(
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            price_at_time=product.price,
            subtotal=item_subtotal  # Perbaikan: Tambah subtotal
        ))
    
    # Buat order (Perbaikan: order_code, shipping_address, recipient_phone, receipt_name)
    db_order = Order(
        user_id=user_id,
        order_code=order_code,
        receipt_name=order_data.receipt_name,
        recipient_phone=order_data.recipient_phone,
        shipping_address=order_data.shipping_address,
        notes=order_data.notes,
        total_amount=total_amount,
        status="pending"
    )
    
    # Add items ke order
    db_order.items = order_items
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    return db_order


def get_orders(db: Session, user_id: int = None, skip: int = 0, limit: int = 20):
    """Ambil daftar orders dengan filter user dan pagination."""
    query = db.query(Order)
    
    if user_id:
        query = query.filter(Order.user_id == user_id)
    
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "orders": orders}


def get_order(db: Session, order_id: int) -> Order | None:
    """Ambil satu order berdasarkan ID."""
    return db.query(Order).filter(Order.id == order_id).first()


def get_order_by_code(db: Session, order_code: str) -> Order | None:  # Perbaikan: order_code (bukan order_number)
    """Ambil order berdasarkan order_code."""
    return db.query(Order).filter(Order.order_code == order_code).first()


def update_order_status(db: Session, order_id: int, status: str) -> Order | None:
    """Update status order."""
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db_order.status = status
        db_order.updated_at = datetime.now()
        db.commit()
        db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int) -> bool:
    """Hapus order dan items-nya."""
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return True
    return False


# ==================== PAYMENT CRUD ====================

def create_payment(db: Session, payment_data: PaymentCreate) -> Payment:
    """Buat record pembayaran baru."""
    # Perbaikan: Tidak perlu receipt_id (bukan di ERD)
    db_payment = Payment(
        order_id=payment_data.order_id,
        payment_method=payment_data.payment_method,
        amount=payment_data.amount,
        proof_url=payment_data.proof_url,
        paid_at=payment_data.paid_at,  # Perbaikan: Tambah paid_at
        payment_status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment


def get_payments(db: Session, order_id: int = None, user_id: int = None, skip: int = 0, limit: int = 20):
    """Ambil daftar payments dengan filter order/user dan pagination."""
    query = db.query(Payment)
    
    if order_id:
        query = query.filter(Payment.order_id == order_id)
    
    # Jika user_id dikirim, filter payment yang terikat dengan order milik user (untuk customer)
    # Jika user_id tidak dikirim (None), get all payments (untuk admin)
    if user_id is not None:
        query = query.join(Order).filter(Order.user_id == user_id)
    
    total = query.count()
    payments = query.order_by(Payment.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "payments": payments}


def get_payment(db: Session, payment_id: int) -> Payment | None:
    """Ambil satu payment berdasarkan ID."""
    return db.query(Payment).filter(Payment.id == payment_id).first()


def update_payment_status(db: Session, payment_id: int, payment_status: str, verified_by: int = None, verified_at: datetime = None) -> Payment | None:  # Perbaikan: verified_by INT
    """Update status pembayaran dan verify."""
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if db_payment:
        db_payment.payment_status = payment_status
        if verified_by is not None:  # Perbaikan: verified_by INT
            db_payment.verified_by = verified_by
        if verified_at:  # Perbaikan: Tambah verified_at
            db_payment.verified_at = verified_at
        if payment_status == "completed":
            db_payment.paid_at = datetime.now()  # Set paid_at saat completed
        db_payment.updated_at = datetime.now()
        db.commit()
        db.refresh(db_payment)
    return db_payment


def delete_payment(db: Session, payment_id: int) -> bool:
    """Hapus record pembayaran."""
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if db_payment:
        db.delete(db_payment)
        db.commit()
        return True
    return False


# ==================== TESTIMONIAL CRUD ====================

def create_testimonial(db: Session, user_id: int, testimonial_data: TestimonialCreate) -> Testimonial:
    """Buat testimonial/review produk baru."""
    db_testimonial = Testimonial(
        order_id=testimonial_data.order_id,  # Restore: order_id (relasi ke order)
        product_id=testimonial_data.product_id,
        user_id=user_id,
        rating=testimonial_data.rating,
        comment=testimonial_data.comment,
        is_visible=True  # Default: visible, bisa di-hide oleh admin
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


def get_testimonials(db: Session, product_id: int = None, user_id: int = None, skip: int = 0, limit: int = 20, visible_only: bool = False):
    """Ambil daftar testimonials dengan filter product/user dan pagination.
    
    Args:
        visible_only: Jika True, hanya tampilkan testimonial dengan is_visible=True
    """
    # Menggunakan query join agar mendapatkan Nama User dan Nama Produk (Perbaikan: Tambah user_name, product_name)
    query = db.query(
        Testimonial.id,
        Testimonial.order_id,
        Testimonial.product_id,
        Testimonial.user_id,
        User.name.label("user_name"),
        Product.name.label("product_name"),
        Testimonial.rating,
        Testimonial.comment,
        Testimonial.is_visible,
        Testimonial.created_at,
        Testimonial.updated_at
    ).join(User, Testimonial.user_id == User.id).join(Product, Testimonial.product_id == Product.id)
    
    if product_id:
        query = query.filter(Testimonial.product_id == product_id)
    
    if user_id:
        query = query.filter(Testimonial.user_id == user_id)
    
    if visible_only:
        query = query.filter(Testimonial.is_visible == True)
    
    total = query.count()
    testimonials = query.order_by(Testimonial.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "testimonials": testimonials}


def get_testimonial(db: Session, testimonial_id: int) -> Testimonial | None:
    """Ambil satu testimonial berdasarkan ID."""
    return db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()


def update_testimonial(db: Session, testimonial_id: int, rating: int = None, comment: str = None) -> Testimonial | None:
    """Update testimonial."""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if db_testimonial:
        if rating is not None:
            db_testimonial.rating = rating
        if comment is not None:
            db_testimonial.comment = comment
        db_testimonial.updated_at = datetime.now()
        db.commit()
        db.refresh(db_testimonial)
    return db_testimonial


def toggle_testimonial_visibility(db: Session, testimonial_id: int) -> Testimonial | None:
    """Toggle visibility testimonial (admin control - hide/show)."""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if db_testimonial:
        db_testimonial.is_visible = not db_testimonial.is_visible  # Toggle true/false
        db_testimonial.updated_at = datetime.now()
        db.commit()
        db.refresh(db_testimonial)
    return db_testimonial



def delete_testimonial(db: Session, testimonial_id: int) -> bool:
    """Hapus testimonial."""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if db_testimonial:
        db.delete(db_testimonial)
        db.commit()
        return True
    return False