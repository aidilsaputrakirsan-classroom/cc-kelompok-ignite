# ✅ PERUBAHAN ROLE-BASED ACCESS CONTROL

Dokumentasi perubahan yang dilakukan untuk memastikan hak akses yang tepat untuk setiap role.

---

## 📋 RINGKASAN PERUBAHAN

Semua perubahan fokus pada **Role-Based Access Control (RBAC)** untuk memastikan:
- **ADMIN**: Hanya bisa manage (lihat semua order, verifikasi bayar, kelola produk, stats)
- **CUSTOMER**: Hanya bisa belanja (browse, cart, order, bayar, review)

---

## 📝 DETAIL PERUBAHAN

### 1. **auth.py** - Tambah Dependency `get_current_customer`

**File**: `/backend/auth.py`

**Perubahan**:
- Tambah fungsi `get_current_customer()` untuk memastikan user dengan role "customer" saja
- Mirip dengan `get_current_admin()`, tapi untuk memvalidasi role = "customer"

```python
def get_current_customer(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Pastikan user yang login adalah customer (bukan admin).
    Case-insensitive check: akan accept "customer", "Customer", "CUSTOMER", dll
    """
    if current_user.role.lower() != "customer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya customer yang dapat mengakses endpoint ini",
        )
    
    return current_user
```

**Impact**: Sekarang bisa membatasi endpoint hanya untuk customer

---

### 2. **main.py** - Update Import

**File**: `/backend/main.py` (Line 18)

**Perubahan**:
```python
# Sebelum:
from auth import create_access_token, get_current_user, get_current_admin

# Sesudah:
from auth import create_access_token, get_current_user, get_current_admin, get_current_customer
```

**Impact**: Sekarang `get_current_customer` tersedia di main.py

---

### 3. **main.py** - Cart Endpoints (CUSTOMER ONLY)

**File**: `/backend/main.py` (Lines 266-362)

**Perubahan**:
Semua cart endpoint diubah dari `get_current_user` menjadi `get_current_customer`:
- ✅ `GET /cart` - View keranjang
- ✅ `POST /cart/items` - Add to cart
- ✅ `PUT /cart/items/{item_id}` - Update quantity
- ✅ `DELETE /cart/items/{item_id}` - Remove from cart

**Sebelum**:
```python
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # ❌ Bisa siapa saja
):
```

**Sesudah**:
```python
def get_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),  # ✅ Hanya customer
):
```

**Impact**: Admin tidak bisa akses cart endpoints lagi

---

### 4. **main.py** - Order Creation (CUSTOMER ONLY)

**File**: `/backend/main.py` (Line 365)

**Perubahan**:
`POST /orders` - Create order, dijatah hanya untuk customer

```python
# Sebelum:
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # ❌ Bisa siapa saja
):

# Sesudah:
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),  # ✅ Hanya customer
):
```

**Impact**: Admin tidak bisa membuat order (hanya bisa manage order existing)

---

### 5. **main.py** - Payment Creation (CUSTOMER ONLY)

**File**: `/backend/main.py` (Line 483)

**Perubahan**:
`POST /payments` - Create payment, dijatah hanya untuk customer

```python
# Sebelum:
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # ❌ Bisa siapa saja
):

# Sesudah:
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),  # ✅ Hanya customer
):
```

**Sekaligus, validasi payment disederhanakan**:
```python
# Sebelum:
if order.user_id != current_user.id and current_user.role != "admin":
    raise HTTPException(...)

# Sesudah (lebih clean):
if order.user_id != current_user.id:
    raise HTTPException(...)  # Sudah pasti customer, tidak perlu check role
```

**Impact**: Admin tidak bisa buat payment record (hanya bisa verify)

---

### 6. **main.py** - Get Payments (FILTER BY ROLE)

**File**: `/backend/main.py` (Line 506)

**Perubahan**:
`GET /payments` - Update untuk filter berdasarkan role

```python
# Sebelum:
def list_payments(
    ...
    current_user: User = Depends(get_current_user),
):
    return crud.get_payments(db=db, order_id=order_id, skip=skip, limit=limit)
    # ❌ Tidak ada filter, bisa lihat semua payment

# Sesudah:
def list_payments(
    ...
    current_user: User = Depends(get_current_user),
):
    # ✅ Filter berdasarkan role
    user_id = current_user.id if current_user.role.lower() == "customer" else None
    
    return crud.get_payments(db=db, order_id=order_id, user_id=user_id, skip=skip, limit=limit)
```

**Impact**:
- Customer hanya bisa lihat payment mereka sendiri
- Admin bisa lihat semua payment

---

### 7. **crud.py** - Update get_payments Function

**File**: `/backend/crud.py` (Line 356)

**Perubahan**:
Tambah parameter `user_id` untuk filter berdasarkan customer

```python
# Sebelum:
def get_payments(db: Session, order_id: int = None, skip: int = 0, limit: int = 20):
    query = db.query(Payment)
    if order_id:
        query = query.filter(Payment.order_id == order_id)
    # ❌ Tidak ada user filter

# Sesudah:
def get_payments(db: Session, order_id: int = None, user_id: int = None, skip: int = 0, limit: int = 20):
    query = db.query(Payment)
    
    if order_id:
        query = query.filter(Payment.order_id == order_id)
    
    # ✅ Jika user_id dikirim (customer), filter payment untuk order milik user
    # Jika user_id None (admin), get all payments
    if user_id is not None:
        query = query.join(Order).filter(Order.user_id == user_id)
    
    ...
```

**Impact**: Backend sekarang bisa filter payment berdasarkan user

---

### 8. **main.py** - Testimonial Creation (CUSTOMER ONLY)

**File**: `/backend/main.py` (Line 592)

**Perubahan**:
`POST /testimonials` - Create review, dijatah hanya untuk customer

```python
# Sebelum:
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # ❌ Bisa siapa saja
):

# Sesudah:
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_customer),  # ✅ Hanya customer
):
```

**Impact**: Admin tidak bisa tulis review (hanya customer)

---

### 9. **main.py** - Update Orders Description

**File**: `/backend/main.py` (Line 388)

**Perubahan**:
Update docstring untuk clarify bahwa endpoint ini untuk setiap user melihat order mereka sendiri

**Sebelum**:
```
Ambil daftar order milik user.
```

**Sesudah**:
```
Ambil daftar order milik user.

- Customer akan melihat order mereka sendiri
- Admin akan melihat order milik mereka sendiri (jika mereka pernah belanja)

*Untuk admin melihat SEMUA order dari semua customer, gunakan `/orders/admin/all`*
```

---

## 🎯 ENDPOINT PERMISSION MATRIX - AFTER CHANGES

### CART ENDPOINTS
| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| GET /cart | ❌ | ✅ | ❌ |
| POST /cart/items | ❌ | ✅ | ❌ |
| PUT /cart/items/{id} | ❌ | ✅ | ❌ |
| DELETE /cart/items/{id} | ❌ | ✅ | ❌ |

### ORDER ENDPOINTS
| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| POST /orders | ❌ | ✅ | ❌ |
| GET /orders | ❌ | ✅* | ❌ |
| GET /orders/admin/all | ❌ | ❌ | ✅ |
| GET /orders/{id} | ❌ | ✅* | ✅ |
| PUT /orders/{id} | ❌ | ❌ | ✅ |
| DELETE /orders/{id} | ❌ | ❌ | ✅ |

### PAYMENT ENDPOINTS
| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| POST /payments | ❌ | ✅ | ❌ |
| GET /payments | ❌ | ✅* | ✅ |
| GET /payments/{id} | ❌ | ✅* | ✅ |
| PUT /payments/{id} | ❌ | ❌ | ✅ |
| DELETE /payments/{id} | ❌ | ❌ | ✅ |

### TESTIMONIAL ENDPOINTS
| Endpoint | Guest | Customer | Admin |
|----------|:-----:|:--------:|:-----:|
| POST /testimonials | ❌ | ✅ | ❌ |
| GET /testimonials | ✅ | ✅ | ✅ |
| PUT /testimonials/{id} | ❌ | ✅* | ✅ |
| PUT /testimonials/{id}/toggle | ❌ | ❌ | ✅ |
| DELETE /testimonials/{id} | ❌ | ✅* | ✅ |

**Legend**: ✅* = Hanya bisa akses milik sendiri

---

## 🔒 SECURITY IMPROVEMENTS

### Sebelum Perubahan ❌
- Admin bisa akses cart (belanja)
- Admin bisa create order (belanja)
- Admin bisa create payment (bayar)
- Admin bisa tulis review
- Customer bisa lihat semua payment

### Sesudah Perubahan ✅
- Admin TIDAK bisa akses cart (hanya manage)
- Admin TIDAK bisa create order
- Admin TIDAK bisa create payment (hanya verify)
- Admin TIDAK bisa tulis review
- Customer hanya bisa lihat payment mereka sendiri
- Validasi lebih ketat per endpoint

---

## 📊 SUMMARY OF CAPABILITIES

### 👤 CUSTOMER (Sekarang)
- ✅ Registrasi & Login
- ✅ Browse & cari produk
- ✅ Lihat detail produk
- ✅ Manage cart (add/edit/remove)
- ✅ Create order
- ✅ Create payment (untuk order mereka)
- ✅ Track order status
- ✅ Lihat payment mereka (tidak semua payment)
- ✅ Tulis & edit review
- ✅ Lihat profil sendiri

### 👨‍💼 ADMIN (Sekarang)
- ✅ Registrasi & Login
- ✅ Lihat semua order
- ✅ Update order status
- ✅ Verify payment & update status
- ✅ Manage produk (create/update/delete)
- ✅ Lihat stats produk & inventory
- ✅ Hide/delete testimonial
- ✅ Lihat profil sendiri

---

## 🧪 TESTING CHECKLIST

Untuk memverifikasi perubahan bekerja dengan baik:

### Test Admin Access
- [ ] Admin login ✓
- [ ] Admin akses GET /cart → ❌ Forbidden
- [ ] Admin POST /cart/items → ❌ Forbidden
- [ ] Admin POST /orders → ❌ Forbidden
- [ ] Admin POST /payments → ❌ Forbidden
- [ ] Admin POST /testimonials → ❌ Forbidden
- [ ] Admin GET /orders/admin/all → ✅ OK
- [ ] Admin PUT /orders/{id} → ✅ OK
- [ ] Admin PUT /payments/{id} → ✅ OK

### Test Customer Access
- [ ] Customer login ✓
- [ ] Customer GET /cart → ✅ OK
- [ ] Customer POST /cart/items → ✅ OK
- [ ] Customer POST /orders → ✅ OK
- [ ] Customer POST /payments → ✅ OK
- [ ] Customer POST /testimonials → ✅ OK
- [ ] Customer GET /payments → ✅ OH (hanya milik mereka)
- [ ] Customer GET /orders → ✅ OK (hanya milik mereka)
- [ ] Customer PUT /orders/{id} → ❌ Forbidden
- [ ] Customer PUT /payments/{id} → ❌ Forbidden

---

## 📌 NOTES

1. **Cart**: Hanya customer yang punya cart, admin tidak perlu
2. **Order**: Admin create via customer account (jika ada), tapi tidak bisa via admin account
3. **Payment**: Customer create & submit, admin verify & update status
4. **Testimonial**: Customer tulis, admin moderate (hide/delete)
5. **Filter Logic**: 
   - Customer: filter own data
   - Admin: access all data (except cart/order creation)

---

## 🔄 BACKWARD COMPATIBILITY

- Semua perubahan adalah **breaking changes** untuk existing admin users
- Admin yang sebelumnya bisa belanja, sekarang tidak bisa (hanya bisa manage)
- Ini adalah **intentional** sesuai dengan requirement role separation

---

**Last Updated**: 7 April 2026  
**Status**: ✅ Completed  
**Testing**: Ready for QA
