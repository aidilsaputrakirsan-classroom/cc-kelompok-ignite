import os
import shutil
import uuid
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from sqlalchemy import text

from database import engine, get_db
from models import Base, User, OrderItem, Product, Payment
from schemas import (
    UserCreate, UserResponse, UserListResponse, LoginRequest, TokenResponse,
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse, ProductStatsResponse,
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
    OrderCreate, OrderItemCreate, OrderItemResponse, OrderResponse, OrderListResponse,
    PaymentCreate, PaymentUpdate, PaymentResponse, PaymentListResponse,
    TestimonialCreate, TestimonialResponse, TestimonialListResponse,
)
from auth import create_access_token, get_current_user, get_current_admin, get_current_customer
import crud

load_dotenv()

# Buat semua tabel
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ATHSNACK API - UMKM E-Commerce",
    description="REST API untuk UMKM Makanan Khas Balikpapan | Cloud Computing Project",
    version="1.0.0",
)

# ==================== CORS ====================
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
origins_list = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]

if origins_list == ["*"]:
    cors_origins = ["*"]
else:
    cors_origins = origins_list

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup direktori uploads
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# Mount folder direktori 
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ==================== 1. ROOT & HEALTH CHECK ====================

@app.get("/", tags=["System"])
def root():
    """Root endpoint - Sistem backend aktif."""
    return {
        "app": "ATHSNACK - UMKM E-Commerce",
        "version": "1.0.0",
        "description": "Platform e-commerce untuk makanan khas Balikpapan",
        "status": "active"
    }


@app.get("/health", tags=["System"])
def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint - cek status backend dan database.
    """

    health = {
        "status": "healthy",
        "service": "ATHSNACK API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

    try:
        # cek koneksi database
        db.execute(text("SELECT 1"))
        health["database"] = "connected"

    except Exception as e:
        health["status"] = "unhealthy"
        health["database"] = f"error: {str(e)}"

    status_code = 200 if health["status"] == "healthy" else 503

    return JSONResponse(
        content=health,
        status_code=status_code
    )

@app.get("/team", tags=["System"])
def team_info():
    """Informasi tim pengembang."""
    return {
        "team": "Cloud Kelompok Ignite",
        "project": "ATHSNACK - UMKM E-Commerce Makanan Khas Balikpapan",
        "members": [
            {
                "name": "Andini Permata Dewanti",
                "nim": "10231014",
                "role": "Lead Backend",
                "email": "10231014@student.itk.ac.id"
            },
            {
                "name": "Putri Rahmawati",
                "nim": "10231074",
                "role": "Lead Frontend",
                "email": "10231074@student.itk.ac.id"
            },
            {
                "name": "Krishandy Dhanysa Pratama",
                "nim": "10231050",
                "role": "Lead DevOps",
                "email": "10231050@student.itk.ac.id"
            },
            {
                "name": "Desnita Dwi Putri",
                "nim": "10231030",
                "role": "Lead QA & Docs",
                "email": "10231030@student.itk.ac.id"
            },
        ],
        "institution": "Institut Teknologi Kalimantan (ITK)",
        "course": "Komputasi Awan - SI",
    }


# ==================== 2. AUTH ENDPOINTS (PUBLIC) ====================

@app.post("/upload-image", tags=["System"])
def upload_image(file: UploadFile = File(...)):
    """
    Upload file gambar dan simpan ke dalam server backend.
    Mengembalikan URL relatif untuk disimpan ke DB.
    """
    try:
        # Validasi ekstensi
        ext = file.filename.split(".")[-1].lower()
        if ext not in ["jpg", "jpeg", "png", "webp"]:
            raise HTTPException(status_code=400, detail="Format file tidak didukung (harus JPG/PNG/WEBP)")
            
        # Membuat nama file unik
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Simpan file secara nyata
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Mengembalikan url rute mount backend kita
        return {"url": f"/uploads/{unique_filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/auth/register", response_model=UserResponse, status_code=201, tags=["Authentication"])
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registrasi user baru sebagai CUSTOMER.
    
    Customer harus mendaftar melalui form ini. Admin account sudah disediakan di database.
    
    - **email**: Email unik (akan digunakan untuk login)
    - **name**: Nama lengkap
    - **password**: Minimal 8 karakter (harus mengandung angka)
    """
    # Force role menjadi "customer" - admin tidak bisa register via form
    user_data.role = "customer"
    
    user = crud.create_user(db=db, user_data=user_data)
    if not user:
        raise HTTPException(
            status_code=400,
            detail="Registrasi gagal: email sudah digunakan"
        )
    return user


@app.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login dan dapatkan JWT token.
    
    Token berlaku selama 60 menit (default).
    Gunakan token di header: `Authorization: Bearer <token>`
    """
    user = crud.authenticate_user(db=db, email=login_data.email, password=login_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Login gagal: email atau password salah"
        )

    token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@app.get("/auth/me", response_model=UserResponse, tags=["Authentication"])
def get_me(current_user: User = Depends(get_current_user)):
    """Ambil profil user yang sedang login. **Membutuhkan autentikasi.**"""
    return current_user


@app.get("/users", response_model=UserListResponse, tags=["System"])
def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: str = Query(None),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Ambil daftar pelanggan (hanya admin).
    """
    return crud.get_users(db=db, skip=skip, limit=limit, search=search)


# ==================== 3. PRODUCT ENDPOINTS ====================

@app.get("/products", response_model=ProductListResponse, tags=["Products"])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    category: str = Query(None, description="Filter kategori (case insensitive)"),
    db: Session = Depends(get_db),
):
    """
    Ambil daftar produk dengan filter.
    
    - **skip**: Jumlah data yang di-skip (untuk pagination)
    - **limit**: Jumlah data per halaman (1-100)
    - **search**: Cari berdasarkan nama atau deskripsi produk
    - **category**: Filter berdasarkan kategori (makanan, minuman, snack, dll)
    
    *Endpoint ini bisa diakses oleh siapa saja (tanpa login)*
    """
    result = crud.get_products(db=db, skip=skip, limit=limit, search=search, category=category)
    return {"total": result["total"], "products": result["products"]}


@app.get("/products/stats", response_model=ProductStatsResponse, tags=["Products"])
def product_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Dapatkan statistik produk untuk dashboard admin.
    
    Menampilkan:
    - Total jumlah produk
    - Total stock
    - Produk yang tersedia
    - Breakdown per kategori
    - Total nilai inventory (price × stock)
    
    **Hanya admin yang dapat mengakses endpoint ini.**
    """
    return crud.get_product_stats(db)


@app.get("/products/{product_id}", response_model=ProductResponse, tags=["Products"])
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Ambil detail satu produk.
    
    *Endpoint ini bisa diakses oleh siapa saja (tanpa login)*
    """
    product = crud.get_product(db=db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail=f"Produk {product_id} tidak ditemukan")
    return product


@app.post("/products/{product_id}/order-now", response_model=OrderResponse, status_code=201, tags=["Products"])
def order_product_now(
    product_id: int,
    quantity: int = Query(1, ge=1),
    receipt_name: str = Query(..., min_length=2, max_length=100),
    recipient_phone: str = Query(..., min_length=10, max_length=20),
    shipping_address: str = Query(..., min_length=5),
    notes: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    PESAN SEKARANG - Buat order langsung dari detail produk.
    
    **Membutuhkan autentikasi sebagai customer.**
    
    Alur: Detail Produk > Pesan Sekarang > Checkout > Konfirmasi > Payment > Testimonial
    
    - **product_id**: ID produk yang ingin dipesan
    - **quantity**: Jumlah produk (default: 1)
    - **receipt_name**: Nama penerima
    - **recipient_phone**: Nomor telepon penerima
    - **shipping_address**: Alamat pengiriman
    - **notes**: Catatan pesanan (optional)
    """
    try:
        # Buat order dengan single item
        order_data = OrderCreate(
            items=[OrderItemCreate(product_id=product_id, quantity=quantity)],
            receipt_name=receipt_name,
            recipient_phone=recipient_phone,
            shipping_address=shipping_address,
            notes=notes
        )
        return crud.create_order(db=db, user_id=current_user.id, order_data=order_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/products", response_model=ProductResponse, status_code=201, tags=["Products"])
def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Buat produk baru.
    
    **Hanya admin yang dapat mengakses endpoint ini.**
    Membutuhkan:
    - Authorization header dengan JWT token
    - User dengan role 'admin'
    """
    return crud.create_product(db=db, product_data=product_data)


@app.put("/products/{product_id}", response_model=ProductResponse, tags=["Products"])
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Update produk.
    
    **Hanya admin yang dapat mengakses endpoint ini.**
    """
    updated = crud.update_product(db=db, product_id=product_id, product_data=product_data)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Produk {product_id} tidak ditemukan")
    return updated


@app.delete("/products/{product_id}", status_code=204, tags=["Products"])
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Hapus produk.
    
    **Hanya admin yang dapat mengakses endpoint ini.**
    """
    success = crud.delete_product(db=db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Produk {product_id} tidak ditemukan")
    return None

@app.get("/products/categories", tags=["Products"])
def get_categories(db: Session = Depends(get_db)):
    """
    Ambil daftar kategori produk yang tersedia.
    
    *Endpoint ini bisa diakses oleh siapa saja*
    """
    categories = db.query(Product.category).distinct().all()
    
    # hasil query berupa tuple → ubah ke list biasa
    category_list = [c[0] for c in categories if c[0]]
    
    return {
        "total": len(category_list),
        "categories": category_list
    }

# ==================== 4. CART ENDPOINTS ====================

@app.get("/cart", response_model=CartResponse, tags=["Cart"])
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Melihat isi keranjang belanja.
    
    **Membutuhkan autentikasi sebagai customer.**
    """
    cart = crud.get_or_create_cart(db=db, user_id=current_user.id)
    
    # Hitung total dari items
    total_items = sum(item.quantity for item in cart.items) if cart.items else 0
    total_price = sum(item.subtotal for item in cart.items) if cart.items else 0
    
    return {
        "id": cart.id,
        "user_id": cart.user_id,
        "items": cart.items,
        "total_items": total_items,
        "total_price": total_price,
        "created_at": cart.created_at,
        "updated_at": cart.updated_at,
    }


@app.post("/cart/items", response_model=CartItemResponse, status_code=201, tags=["Cart"])
def add_to_cart(
    item_data: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Menambahkan produk ke keranjang belanja.
    
    - **product_id**: ID produk yang ingin ditambahkan
    - **quantity**: Jumlah produk (default: 1)
    
    Jika produk sudah ada di cart, quantity akan ditambah.
    
    **Membutuhkan autentikasi sebagai customer.**
    """
    # Dapatkan atau buat cart untuk user
    cart = crud.get_or_create_cart(db=db, user_id=current_user.id)
    
    # Tambah item ke cart
    cart_item = crud.add_to_cart(db=db, cart_id=cart.id, item_data=item_data)
    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail=f"Produk {item_data.product_id} tidak ditemukan"
        )
    
    return cart_item


@app.put("/cart/items/{item_id}", response_model=CartItemResponse, tags=["Cart"])
def update_cart_item(
    item_id: int,
    item_data: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Mengubah jumlah item di keranjang.
    
    - **item_id**: ID item di cart
    - **quantity**: Jumlah baru (harus > 0)
    
    **Membutuhkan autentikasi sebagai customer.**
    """
    updated = crud.update_cart_item(db=db, item_id=item_id, item_data=item_data)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Item {item_id} tidak ditemukan di cart")
    return updated


@app.delete("/cart/items/{item_id}", status_code=204, tags=["Cart"])
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Menghapus item dari keranjang belanja.
    
    - **item_id**: ID item di cart yang ingin dihapus
    
    **Membutuhkan autentikasi sebagai customer.**
    """
    success = crud.remove_from_cart(db=db, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Item {item_id} tidak ditemukan di cart")
    return None


# ==================== 5. ORDER ENDPOINTS ====================

@app.post("/orders", response_model=OrderResponse, status_code=201, tags=["Orders"])
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Buat pesanan baru.
    
    **Membutuhkan autentikasi sebagai customer.**
    
    - **items**: Daftar product yang dipesan (minimal 1 item)
    - **receipt_name**: Nama penerima (Perbaikan: sesuai ERD)
    - **recipient_phone**: Nomor telepon penerima (Perbaikan: sesuai ERD)
    - **shipping_address**: Alamat pengiriman (Perbaikan: sesuai ERD)
    - **notes**: Catatan pesanan (optional)
    """
    try:
        # Validate items tidak kosong
        if not order.items or len(order.items) == 0:
            raise ValueError("Pesanan harus berisi minimal 1 produk")
        
        result = crud.create_order(db=db, user_id=current_user.id, order_data=order)
        return result
    except ValueError as e:
        print(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in create_order: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal membuat pesanan: {str(e)}")


@app.get("/orders", response_model=OrderListResponse, tags=["Orders"])
def list_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ambil daftar order milik user.
    
    **Membutuhkan autentikasi.**
    
    - Customer akan melihat order mereka sendiri
    - Admin akan melihat order milik mereka sendiri (jika mereka pernah belanja)
    
    *Untuk admin melihat SEMUA order dari semua customer, gunakan `/orders/admin/all`*
    
    - **skip**: Jumlah data yang di-skip (untuk pagination)
    - **limit**: Jumlah data per halaman (max 100)
    """
    return crud.get_orders(db=db, user_id=current_user.id, skip=skip, limit=limit)


@app.get("/orders/admin/all", response_model=OrderListResponse, tags=["Orders"])
def list_all_orders_admin(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Ambil daftar semua order (hanya admin).
    
    **Membutuhkan autentikasi admin.**
    """
    return crud.get_orders(db=db, skip=skip, limit=limit)


@app.get("/orders/{order_id}", response_model=OrderResponse, tags=["Orders"])
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ambil detail pesanan spesifik.
    
    **Membutuhkan autentikasi.**
    """
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} tidak ditemukan")
    
    # Validasi: hanya pemilik atau admin bisa lihat
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
    
    return order


@app.get("/orders/{order_id}/items", tags=["Orders"])
def get_order_items(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ambil daftar items dalam order dengan detail produk.
    
    **Membutuhkan autentikasi.**
    
    Response berisi:
    - item details (quantity, price, subtotal)
    - product details (name, image, price)
    """
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} tidak ditemukan")
    
    # Validasi: hanya pemilik atau admin bisa lihat
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
    
    # Get order items dengan product details
    items = db.query(OrderItem, Product).join(Product).filter(OrderItem.order_id == order_id).all()
    
    result = []
    for item, product in items:
        result.append({
            "item_id": item.id,
            "product_id": item.product_id,
            "product_name": product.name,
            "product_image": product.image_url,
            "quantity": item.quantity,
            "price_at_time": item.price_at_time,
            "subtotal": item.subtotal,
        })
    
    return {
        "order_id": order_id,
        "total_items": len(result),
        "items": result
    }


@app.put("/orders/{order_id}", response_model=OrderResponse, tags=["Orders"])
def update_order_status(
    order_id: int,
    status: str = Query(..., examples=["pending", "processing", "shipped", "delivered", "cancelled"]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Update status pesanan (hanya admin).
    
    **Membutuhkan autentikasi admin.**
    
    Status yang valid: pending, processing, shipped, delivered, cancelled
    """
    updated = crud.update_order_status(db=db, order_id=order_id, status=status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Order {order_id} tidak ditemukan")
    return updated


@app.put("/orders/{order_id}/confirm", response_model=OrderResponse, tags=["Orders"])
def confirm_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    KONFIRMASI PESANAN - Ubah status dari 'pending' ke 'processing'.
    
    **Membutuhkan autentikasi sebagai customer.**
    
    Alur: Order dibuat (pending) > Konfirmasi Pesanan (processing) > Payment > Delivered > Testimonial
    
    Customer melakukan konfirmasi sebelum melanjutkan ke payment.
    """
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} tidak ditemukan")
    
    # Validasi: hanya pemilik order bisa konfirmasi
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
    
    # Validasi: hanya order dengan status 'pending' yang bisa dikonfirmasi
    if order.status != "pending":
        raise HTTPException(status_code=400, detail=f"Order hanya bisa dikonfirmasi dari status 'pending', status saat ini: {order.status}")
    
    # Update status ke 'processing'
    updated = crud.update_order_status(db=db, order_id=order_id, status="processing")
    return updated


@app.put("/orders/{order_id}/complete-payment", response_model=OrderResponse, tags=["Orders"])
def complete_payment_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    PEMBAYARAN SELESAI - Ubah status dari 'processing' ke 'delivered' setelah payment sukses.
    
    **Membutuhkan autentikasi sebagai customer.**
    
    Alur: Processing > Payment Sukses > Delivered > Bisa Testimonial
    
    Call endpoint ini setelah payment berhasil, sehingga customer bisa menambahkan testimonial.
    """
    order = crud.get_order(db=db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} tidak ditemukan")
    
    # Validasi: hanya pemilik order bisa complete payment
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
    
    # Validasi: hanya order dengan status 'processing' atau 'shipped' yang bisa di-complete
    if order.status not in ["processing", "shipped"]:
        raise HTTPException(status_code=400, detail=f"Order hanya bisa di-complete dari status 'processing' atau 'shipped', status saat ini: {order.status}")
    
    # Update status ke 'delivered'
    updated = crud.update_order_status(db=db, order_id=order_id, status="delivered")
    return updated


@app.delete("/orders/{order_id}", status_code=204, tags=["Orders"])
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Hapus pesanan (hanya admin).
    
    **Membutuhkan autentikasi admin.**
    """
    success = crud.delete_order(db=db, order_id=order_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Order {order_id} tidak ditemukan")
    return None


# ==================== 6. PAYMENT ENDPOINTS ====================

@app.post("/payments", response_model=PaymentResponse, status_code=201, tags=["Payments"])
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Buat record pembayaran baru.
    
    **Membutuhkan autentikasi sebagai customer.**
    
    Alur: Order dibuat (pending) > Dikonfirmasi (processing) > Buat Payment (pending) > Admin verifikasi > Marked as delivered > Testimonial
    
    - **order_id**: ID order yang dibayar
    - **payment_method**: Metode pembayaran (credit_card, bank_transfer, e_wallet, cash)
    - **amount**: Jumlah pembayaran (harus sesuai total_amount order)
    - **proof_url**: URL bukti pembayaran (optional - screenshot transfer/receipt)
    
    **Catatan**: paid_at akan diset otomatis oleh admin saat verifikasi pembayaran.
    """
    try:
        # Validasi order ada dan milik customer
        order = crud.get_order(db=db, order_id=payment.order_id)
        if not order:
            raise HTTPException(status_code=404, detail=f"Order {payment.order_id} tidak ditemukan")
        
        # Customer hanya bisa bayar order milik mereka sendiri
        if order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
        
        # Validasi order status - hanya pending atau processing yang bisa dibayar
        if order.status not in ["pending", "processing"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Order dengan status '{order.status}' tidak bisa dibayar. Status harus 'pending' atau 'processing'."
            )
        
        # Validasi amount match dengan total_amount order
        if abs(payment.amount - order.total_amount) > 0.01:  # tolerance for floating point
            raise HTTPException(
                status_code=400, 
                detail=f"Jumlah pembayaran tidak sesuai. Expected: Rp {order.total_amount}, Got: Rp {payment.amount}"
            )
        
        # Validasi tidak boleh ada payment yang sudah 'completed' untuk order ini
        from models import Payment as PaymentModel
        existing_completed = db.query(PaymentModel).filter(
            PaymentModel.order_id == payment.order_id,
            PaymentModel.payment_status == "completed"
        ).first()
        if existing_completed:
            raise HTTPException(
                status_code=400, 
                detail="Order ini sudah memiliki pembayaran yang terkonfirmasi. Tidak bisa membuat pembayaran baru."
            )
        
        result = crud.create_payment(db=db, payment_data=payment)
        print(f"✓ Payment dibuat: {result.id} untuk order {payment.order_id} sebesar Rp {payment.amount}")
        return result
    except HTTPException:
        raise
    except Exception as e:
        print(f"✗ Error saat create payment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal membuat pembayaran: {str(e)}")


@app.get("/payments", response_model=PaymentListResponse, tags=["Payments"])
def list_payments(
    order_id: int = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ambil daftar pembayaran.
    
    **Membutuhkan autentikasi.**
    
    - Customer hanya bisa lihat payment untuk order mereka sendiri
    - Admin bisa lihat semua payment
    """
    # Jika customer, filter untuk hanya order/payment mereka sendiri
    # Jika admin, bisa lihat semua
    user_id = current_user.id if current_user.role.lower() == "customer" else None
    
    return crud.get_payments(db=db, order_id=order_id, user_id=user_id, skip=skip, limit=limit)


@app.get("/payments/{payment_id}", response_model=PaymentResponse, tags=["Payments"])
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Ambil detail pembayaran spesifik.
    
    **Membutuhkan autentikasi.**
    """
    payment = crud.get_payment(db=db, payment_id=payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail=f"Payment {payment_id} tidak ditemukan")
    
    # Validasi akses
    if payment.order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke payment ini")
    
    return payment


@app.put("/payments/{payment_id}", response_model=PaymentResponse, tags=["Payments"])
def update_payment_status(
    payment_id: int,
    payment_status: str = Query(..., examples=["pending", "completed", "failed", "refunded"]),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Update status pembayaran (hanya admin).
    
    **Membutuhkan autentikasi admin.**
    
    Admin dapat:
    - **completed**: Verifikasi pembayaran ✓ (customer bisa mark order as delivered)
    - **failed**: Pembayaran ditolak ✗
    - **refunded**: Pembayaran dikembalikan
    
    Status yang valid: pending, completed, failed, refunded
    """
    try:
        # Get payment untuk validasi
        from models import Payment as PaymentModel
        payment = db.query(PaymentModel).filter(PaymentModel.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail=f"Payment {payment_id} tidak ditemukan")
        
        # Validasi status transition
        valid_status = ["pending", "completed", "failed", "refunded"]
        if payment_status not in valid_status:
            raise HTTPException(status_code=400, detail=f"Status tidak valid. Valid: {', '.join(valid_status)}")
        
        # Validasi transisi status
        if payment.payment_status == "completed" and payment_status != "refunded":
            raise HTTPException(status_code=400, detail="Payment yang sudah 'completed' hanya bisa di-refund")
        
        # Update payment
        updated = crud.update_payment_status(
            db=db, 
            payment_id=payment_id, 
            payment_status=payment_status,
            verified_by=current_user.id,
            verified_at=datetime.now()
        )
        
        if updated.payment_status == "completed":
            print(f"✓ Payment {payment_id} verified sebagai 'completed' oleh admin {current_user.id}")
        
        return updated
    except HTTPException:
        raise
    except Exception as e:
        print(f"✗ Error saat update payment status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Gagal update payment: {str(e)}")


@app.delete("/payments/{payment_id}", status_code=204, tags=["Payments"])
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Hapus record pembayaran (hanya admin).
    
    **Membutuhkan autentikasi admin.**
    """
    success = crud.delete_payment(db=db, payment_id=payment_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Payment {payment_id} tidak ditemukan")
    return None


# ==================== 7. TESTIMONIAL ENDPOINTS ====================

@app.post("/testimonials", response_model=TestimonialResponse, status_code=201, tags=["Testimonials"])
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),
):
    """
    Buat review/testimonial produk baru.
    
    **Membutuhkan autentikasi sebagai customer.**
    
    Alur: Order Delivered > Bisa Menambahkan Testimonial
    
    - **product_id**: ID produk yang di-review (required)
    - **order_id**: ID order (required jika ingin link dengan pesanan tertentu)
    - **rating**: Rating 1-5 bintang (required)
    - **comment**: Komentar/review (optional)
    
    Validasi: Jika order_id dikirim, order harus sudah 'delivered'. Jika tidak ada order_id, testimonial bisa dibuat langsung untuk produk.
    """
    # Validasi: jika order_id ada, order harus sudah delivered dan milik customer
    if testimonial.order_id:
        order = crud.get_order(db=db, order_id=testimonial.order_id)
        if not order:
            raise HTTPException(status_code=404, detail=f"Order {testimonial.order_id} tidak ditemukan")
        
        # Validasi: order harus milik customer
        if order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
        
        # Validasi: order harus sudah delivered
        if order.status != "delivered":
            raise HTTPException(status_code=400, detail=f"Testimonial hanya bisa dibuat setelah order 'delivered'. Status saat ini: {order.status}")
    
    return crud.create_testimonial(db=db, user_id=current_user.id, testimonial_data=testimonial)


@app.get("/testimonials", response_model=TestimonialListResponse, tags=["Testimonials"])
def list_testimonials(
    product_id: int = Query(None),
    user_id: int = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Ambil daftar testimonials publik dengan filter product atau user.
    
    - **product_id**: Filter testimonials untuk produk tertentu
    - **user_id**: Filter testimonials dari user tertentu
    - Hanya menampilkan testimonial dengan is_visible=True
    """
    return crud.get_testimonials(db=db, product_id=product_id, user_id=user_id, skip=skip, limit=limit, visible_only=True)


@app.get("/admin/testimonials", response_model=TestimonialListResponse, tags=["System"])
def list_all_testimonials(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin),
):
    """
    Ambil seluruh daftar testimonials (untuk Admin).
    Termasuk yang disembunyikan (is_visible=False).
    """
    return crud.get_testimonials(db=db, skip=skip, limit=limit, visible_only=False)


@app.get("/testimonials/{testimonial_id}", response_model=TestimonialResponse, tags=["Testimonials"])
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
):
    """
    Ambil detail testimonial spesifik.
    """
    testimonial = crud.get_testimonial(db=db, testimonial_id=testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail=f"Testimonial {testimonial_id} tidak ditemukan")
    return testimonial


@app.put("/testimonials/{testimonial_id}", response_model=TestimonialResponse, tags=["Testimonials"])
def update_testimonial(
    testimonial_id: int,
    rating: int = Query(None, ge=1, le=5),
    comment: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update testimonial milik user sendiri.
    
    **Membutuhkan autentikasi.**
    """
    testimonial = crud.get_testimonial(db=db, testimonial_id=testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail=f"Testimonial {testimonial_id} tidak ditemukan")
    
    # Validasi: hanya pemilik atau admin bisa edit
    if testimonial.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses untuk edit testimonial ini")
    
    updated = crud.update_testimonial(
        db=db, 
        testimonial_id=testimonial_id, 
        rating=rating,
        comment=comment
    )
    return updated


@app.put("/testimonials/{testimonial_id}/toggle-visibility", response_model=TestimonialResponse, tags=["Testimonials"])
def toggle_testimonial_visibility(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Toggle visibility testimonial (admin control - hide/show testimonial dari tampilan).
    
    **Membutuhkan autentikasi admin.**
    
    Menampilkan/menyembunyikan testimonial dari daftar publik.
    """
    updated = crud.toggle_testimonial_visibility(
        db=db, 
        testimonial_id=testimonial_id
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Testimonial {testimonial_id} tidak ditemukan")
    return updated


@app.delete("/testimonials/{testimonial_id}", status_code=204, tags=["Testimonials"])
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Hapus testimonial milik user sendiri.
    
    **Membutuhkan autentikasi.**
    """
    testimonial = crud.get_testimonial(db=db, testimonial_id=testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail=f"Testimonial {testimonial_id} tidak ditemukan")
    
    # Validasi: hanya pemilik atau admin bisa hapus
    if testimonial.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses untuk hapus testimonial ini")
    
    success = crud.delete_testimonial(db=db, testimonial_id=testimonial_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Testimonial {testimonial_id} tidak ditemukan")
    
    return None