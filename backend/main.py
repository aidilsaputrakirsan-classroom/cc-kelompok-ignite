import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db
from models import Base, User
from schemas import (
    UserCreate, UserResponse, LoginRequest, TokenResponse,
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse, ProductStatsResponse,
    CartItemCreate, CartItemUpdate, CartItemResponse, CartResponse,
    OrderCreate, OrderItemResponse, OrderResponse, OrderListResponse,
    PaymentCreate, PaymentUpdate, PaymentResponse, PaymentListResponse,
    TestimonialCreate, TestimonialResponse, TestimonialListResponse,
)
from auth import create_access_token, get_current_user, get_current_admin
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
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
origins_list = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "ATHSNACK API"
    }


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

@app.post("/auth/register", response_model=UserResponse, status_code=201, tags=["Authentication"])
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Registrasi user baru.
    
    - **email**: Email unik (akan digunakan untuk login)
    - **name**: Nama lengkap
    - **password**: Minimal 8 karakter (harus mengandung angka)
    - **role**: "customer" (default) atau "admin"
    """
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


# ==================== 3. PRODUCT ENDPOINTS ====================

@app.get("/products", response_model=ProductListResponse, tags=["Products"])
def list_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    category: str = Query(None),
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


# ==================== 4. CART ENDPOINTS ====================

@app.get("/cart", response_model=CartResponse, tags=["Cart"])
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Melihat isi keranjang belanja.
    
    **Membutuhkan autentikasi sebagai customer.**
    """
    cart = crud.get_or_create_cart(db=db, user_id=current_user.id)
    
    # Hitung total dari items
    total_items = sum(item.quantity for item in cart.items) if cart.items else 0
    total_price = sum(item.quantity * item.price for item in cart.items) if cart.items else 0
    
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
    current_user: User = Depends(get_current_user),
):
    """
    Menambahkan produk ke keranjang belanja.
    
    - **product_id**: ID produk yang ingin ditambahkan
    - **quantity**: Jumlah produk (default: 1)
    
    Jika produk sudah ada di cart, quantity akan ditambah.
    
    **Membutuhkan autentikasi.**
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
    current_user: User = Depends(get_current_user),
):
    """
    Mengubah jumlah item di keranjang.
    
    - **item_id**: ID item di cart
    - **quantity**: Jumlah baru (harus > 0)
    
    **Membutuhkan autentikasi.**
    """
    updated = crud.update_cart_item(db=db, item_id=item_id, item_data=item_data)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Item {item_id} tidak ditemukan di cart")
    return updated


@app.delete("/cart/items/{item_id}", status_code=204, tags=["Cart"])
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Menghapus item dari keranjang belanja.
    
    - **item_id**: ID item di cart yang ingin dihapus
    
    **Membutuhkan autentikasi.**
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
    current_user: User = Depends(get_current_user),
):
    """
    Buat pesanan baru.
    
    **Membutuhkan autentikasi.**
    
    - **items**: Daftar product yang dipesan (minimal 1 item)
    - **ordering_address**: Alamat pengiriman
    - **ordering_phone**: Nomor telepon penerima
    - **notes**: Catatan pesanan (optional)
    """
    try:
        return crud.create_order(db=db, user_id=current_user.id, order_data=order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


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
    current_user: User = Depends(get_current_user),
):
    """
    Buat record pembayaran baru.
    
    **Membutuhkan autentikasi.**
    
    - **order_id**: ID order yang dibayar
    - **payment_method**: Metode pembayaran (credit_card, bank_transfer, e_wallet, cash)
    - **amount**: Jumlah pembayaran
    - **proof_url**: URL bukti pembayaran (optional)
    """
    # Validasi order ada dan milik user
    order = crud.get_order(db=db, order_id=payment.order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {payment.order_id} tidak ditemukan")
    
    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Anda tidak memiliki akses ke order ini")
    
    return crud.create_payment(db=db, payment_data=payment)


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
    """
    return crud.get_payments(db=db, order_id=order_id, skip=skip, limit=limit)


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
    
    Status yang valid: pending, completed, failed, refunded
    """
    updated = crud.update_payment_status(
        db=db, 
        payment_id=payment_id, 
        payment_status=payment_status,
        verified_by=current_user.email
    )
    if not updated:
        raise HTTPException(status_code=404, detail=f"Payment {payment_id} tidak ditemukan")
    return updated


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
    current_user: User = Depends(get_current_user),
):
    """
    Buat review/testimonial produk baru.
    
    **Membutuhkan autentikasi.**
    
    - **product_id**: ID produk yang di-review
    - **rating**: Rating 1-5 bintang
    - **comment**: Komentar/review (optional)
    """
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
    Ambil daftar testimonials dengan filter product atau user.
    
    - **product_id**: Filter testimonials untuk produk tertentu
    - **user_id**: Filter testimonials dari user tertentu
    """
    return crud.get_testimonials(db=db, product_id=product_id, user_id=user_id, skip=skip, limit=limit)


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


@app.put("/testimonials/{testimonial_id}/verify", response_model=TestimonialResponse, tags=["Testimonials"])
def verify_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    """
    Verify testimonial oleh admin (menandakan testimonial valid).
    
    **Membutuhkan autentikasi admin.**
    """
    updated = crud.verify_testimonial(
        db=db, 
        testimonial_id=testimonial_id, 
        admin_email=current_user.email
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
    return None