from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item, User, Product, Cart, CartItem
from schemas import ItemCreate, ItemUpdate, UserCreate, ProductCreate, ProductUpdate, CartItemCreate, CartItemUpdate
from auth import hash_password, verify_password
from sqlalchemy import func


def create_item(db: Session, item_data: ItemCreate) -> Item:
    """Buat item baru di database."""
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip: int = 0, limit: int = 20, search: str = None, min_price: float = None, max_price: float = None):
    """
    Ambil daftar items dengan pagination, search, dan filter harga.
    - skip: jumlah data yang di-skip (untuk pagination)
    - limit: jumlah data per halaman
    - search: cari berdasarkan nama atau deskripsi
    - min_price: filter harga minimum
    - max_price: filter harga maksimum
    """
    query = db.query(Item)
    
    if search:
        query = query.filter(
            or_(
                Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%")
            )
        )
    
    if min_price is not None:
        query = query.filter(Item.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Item.price <= max_price)
    
    total = query.count()
    items = query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()
    
    return {"total": total, "items": items}


def get_item(db: Session, item_id: int) -> Item | None:
    """Ambil satu item berdasarkan ID."""
    return db.query(Item).filter(Item.id == item_id).first()


def update_item(db: Session, item_id: int, item_data: ItemUpdate) -> Item | None:
    """
    Update item berdasarkan ID.
    Hanya update field yang dikirim (bukan None).
    """
    db_item = db.query(Item).filter(Item.id == item_id).first()
    
    if not db_item:
        return None
    
    # Hanya update field yang dikirim (exclude_unset=True)
    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int) -> bool:
    """Hapus item berdasarkan ID. Return True jika berhasil."""
    db_item = db.query(Item).filter(Item.id == item_id).first()
    
    if not db_item:
        return False
    
    db.delete(db_item)
    db.commit()
    return True

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
        hashed_password=hash_password(user_data.password),
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
    if not verify_password(password, user.hashed_password):
        return None
    return user


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
    total_available = db.query(func.count(Product.id)).filter(Product.is_available == True).scalar() or 0
    
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
        db.commit()
        db.refresh(existing_item)
        return existing_item
    else:
        # Buat item baru
        cart_item = CartItem(
            cart_id=cart_id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            price=product.price
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