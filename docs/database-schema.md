# Database Schema — ATHSNAC App

**Mata Kuliah:** Komputasi Awan
**Program Studi:** Sistem Informasi — Institut Teknologi Kalimantan
**Modul:** 2 — Backend REST API
**Database:** PostgreSQL
**ORM:** SQLAlchemy 2.0
**Validasi:** Pydantic v2
**File Schema:** `backend/schemas.py`

---

## Daftar Tabel

| No | Nama Tabel     | Deskripsi                                    |
|----|----------------|----------------------------------------------|
| 1  | `users`        | Data akun pengguna (customer & admin)        |
| 2  | `products`     | Data produk makanan UMKM                     |
| 3  | `carts`        | Keranjang belanja milik user                 |
| 4  | `cart_items`   | Item yang ada di dalam keranjang             |
| 5  | `orders`       | Pesanan yang dibuat customer                 |
| 6  | `order_items`  | Item dalam setiap pesanan                    |
| 7  | `payments`     | Data pembayaran per pesanan                  |
| 8  | `testimonials` | Review & rating produk dari customer         |

---

## 1. Tabel `users`

Menyimpan data akun pengguna aplikasi, baik customer maupun admin.
**Pydantic Schema:** `UserCreate`, `UserResponse`

| Kolom           | Tipe Data                    | Constraint              | Default      | Deskripsi                                  |
|-----------------|------------------------------|-------------------------|--------------|--------------------------------------------|
| `id`            | `INTEGER`                    | PRIMARY KEY, NOT NULL   | Auto-increment | Identitas unik user                      |
| `email`         | `VARCHAR(255)`               | UNIQUE, NOT NULL, INDEX | —            | Email valid, divalidasi oleh `EmailStr`    |
| `name`          | `VARCHAR(100)`               | NOT NULL                | —            | Nama lengkap, min 2 karakter               |
| `password_hash` | `VARCHAR(255)`               | NOT NULL                | —            | Hash bcrypt dari password asli             |
| `phone`         | `VARCHAR(20)`                | NULLABLE                | `NULL`       | Nomor telepon, maks 20 karakter            |
| `address`       | `TEXT`                       | NULLABLE                | `NULL`       | Alamat default user                        |
| `role`          | `VARCHAR(20)`                | NOT NULL                | `customer`   | Nilai: `customer` atau `admin`             |
| `is_active`     | `BOOLEAN`                    | NOT NULL                | `true`       | Status aktif akun                          |
| `created_at`    | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                | `now()`      | Waktu akun dibuat, otomatis diisi server   |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                | `NULL`       | Waktu terakhir profil diupdate             |

**Validasi Pydantic (`UserCreate`):**

| Field      | Validasi                                                             |
|------------|----------------------------------------------------------------------|
| `email`    | `EmailStr` — harus format email valid                                |
| `name`     | `min_length=2`, `max_length=100`                                     |
| `password` | `min_length=8`, harus mengandung angka (`field_validator`)           |
| `phone`    | `max_length=20`, opsional                                            |
| `role`     | Default `customer`                                                   |

**DDL SQL:**
```sql
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    name          VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    address       TEXT,
    role          VARCHAR(20) NOT NULL DEFAULT 'customer',
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ
);
CREATE UNIQUE INDEX ix_users_email ON users(email);
```

---

## 2. Tabel `products`

Menyimpan data produk makanan UMKM yang dijual di ATHSNAC.
**Pydantic Schema:** `ProductBase`, `ProductCreate`, `ProductUpdate`, `ProductResponse`, `ProductStatsResponse`

| Kolom         | Tipe Data                    | Constraint              | Default    | Deskripsi                                        |
|---------------|------------------------------|-------------------------|------------|--------------------------------------------------|
| `id`          | `INTEGER`                    | PRIMARY KEY, NOT NULL   | Auto-increment | Identitas unik produk                        |
| `name`        | `VARCHAR(100)`               | NOT NULL, INDEX         | —          | Nama produk, min 1 karakter                      |
| `slug`        | `VARCHAR(100)`               | UNIQUE, NULLABLE        | `NULL`     | URL-friendly, contoh: `amplang-balikpapan`       |
| `description` | `TEXT`                       | NULLABLE                | `NULL`     | Deskripsi detail produk                          |
| `category`    | `VARCHAR(50)`                | NOT NULL                | `makanan`  | Kategori: `makanan`, `minuman`, `snack`, dll      |
| `price`       | `FLOAT`                      | NOT NULL                | —          | Harga produk, harus > 0                          |
| `stock`       | `INTEGER`                    | NOT NULL                | `0`        | Jumlah stok, tidak boleh negatif                 |
| `image_url`   | `VARCHAR(255)`               | NULLABLE                | `NULL`     | URL gambar produk                                |
| `is_active`   | `BOOLEAN`                    | NOT NULL                | `true`     | Status produk tampil atau disembunyikan          |
| `created_at`  | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                | `now()`    | Waktu produk dibuat                              |
| `updated_at`  | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                | `NULL`     | Waktu terakhir produk diupdate                   |

**Validasi Pydantic (`ProductCreate`):**

| Field       | Validasi                                         |
|-------------|--------------------------------------------------|
| `name`      | `min_length=1`, `max_length=100`                 |
| `price`     | `gt=0` — harus lebih besar dari 0                |
| `stock`     | `ge=0` — tidak boleh negatif                     |
| `slug`      | Opsional, unique jika diisi                      |
| `is_active` | Default `true`                                   |

**Response Statistik (`ProductStatsResponse`):**

| Field              | Tipe     | Deskripsi                              |
|--------------------|----------|----------------------------------------|
| `total_products`   | `int`    | Total jumlah produk                    |
| `total_stock`      | `int`    | Total stok semua produk                |
| `total_available`  | `int`    | Jumlah produk dengan `is_active=true`  |
| `categories`       | `dict`   | Jumlah produk per kategori             |
| `total_value`      | `float`  | Total nilai stok (`price × stock`)     |

**DDL SQL:**
```sql
CREATE TABLE products (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE,
    description TEXT,
    category    VARCHAR(50) NOT NULL DEFAULT 'makanan',
    price       FLOAT NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    image_url   VARCHAR(255),
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);
CREATE INDEX ix_products_name ON products(name);
```

---

## 3. Tabel `carts`

Menyimpan keranjang belanja milik setiap user.
**Pydantic Schema:** `CartResponse`

| Kolom        | Tipe Data                    | Constraint                        | Default   | Deskripsi                               |
|--------------|------------------------------|-----------------------------------|-----------|-----------------------------------------|
| `id`         | `INTEGER`                    | PRIMARY KEY, NOT NULL             | Auto-increment | Identitas unik cart                |
| `user_id`    | `INTEGER`                    | FK → `users.id`, NOT NULL, INDEX  | —         | Pemilik keranjang                       |
| `status`     | `VARCHAR(20)`                | NOT NULL                          | `active`  | Status: `active` atau `checked_out`     |
| `created_at` | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                          | `now()`   | Waktu keranjang dibuat                  |
| `updated_at` | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                          | `NULL`    | Waktu terakhir diupdate                 |

**Field Kalkulasi di `CartResponse` (dihitung saat runtime, tidak disimpan di DB):**

| Field          | Tipe      | Deskripsi                                  |
|----------------|-----------|--------------------------------------------|
| `total_items`  | `int`     | Total jumlah item (sum of `quantity`)       |
| `total_price`  | `float`   | Total harga (sum of `subtotal` tiap item)  |

**DDL SQL:**
```sql
CREATE TABLE carts (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status     VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX ix_carts_user_id ON carts(user_id);
```

---

## 4. Tabel `cart_items`

Menyimpan item-item yang ada di dalam keranjang belanja.
**Pydantic Schema:** `CartItemCreate`, `CartItemUpdate`, `CartItemResponse`

| Kolom           | Tipe Data                    | Constraint                        | Default | Deskripsi                                   |
|-----------------|------------------------------|-----------------------------------|---------|---------------------------------------------|
| `id`            | `INTEGER`                    | PRIMARY KEY, NOT NULL             | Auto-increment | Identitas unik cart item           |
| `cart_id`       | `INTEGER`                    | FK → `carts.id`, NOT NULL, INDEX  | —       | Keranjang yang memuat item ini              |
| `product_id`    | `INTEGER`                    | FK → `products.id`, NOT NULL      | —       | Produk yang dimasukkan ke keranjang         |
| `quantity`      | `INTEGER`                    | NOT NULL                          | `1`     | Jumlah produk, harus > 0                    |
| `price_at_time` | `FLOAT`                      | NOT NULL                          | —       | Harga produk pada saat ditambahkan ke cart  |
| `subtotal`      | `FLOAT`                      | NOT NULL                          | —       | Hasil kalkulasi: `price_at_time × quantity` |
| `created_at`    | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                          | `now()` | Waktu item ditambahkan ke keranjang         |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                          | `NULL`  | Waktu terakhir quantity diupdate            |

**Validasi Pydantic (`CartItemCreate`):**

| Field        | Validasi              |
|--------------|-----------------------|
| `product_id` | `gt=0`               |
| `quantity`   | `gt=0`, default `1`  |

**DDL SQL:**
```sql
CREATE TABLE cart_items (
    id             SERIAL PRIMARY KEY,
    cart_id        INTEGER NOT NULL REFERENCES carts(id),
    product_id     INTEGER NOT NULL REFERENCES products(id),
    quantity       INTEGER NOT NULL DEFAULT 1,
    price_at_time  FLOAT NOT NULL,
    subtotal       FLOAT NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ
);
CREATE INDEX ix_cart_items_cart_id ON cart_items(cart_id);
```

---

## 5. Tabel `orders`

Menyimpan data pesanan yang dibuat oleh customer.
**Pydantic Schema:** `OrderCreate`, `OrderUpdate`, `OrderResponse`, `OrderListResponse`

| Kolom              | Tipe Data                    | Constraint                        | Default   | Deskripsi                                             |
|--------------------|------------------------------|-----------------------------------|-----------|-------------------------------------------------------|
| `id`               | `INTEGER`                    | PRIMARY KEY, NOT NULL             | Auto-increment | Identitas unik order                           |
| `user_id`          | `INTEGER`                    | FK → `users.id`, NOT NULL, INDEX  | —         | Customer yang membuat pesanan                         |
| `order_code`       | `VARCHAR(50)`                | UNIQUE, NOT NULL, INDEX           | —         | Kode unik pesanan, contoh: `ORD-20260408-001`         |
| `receipt_name`     | `VARCHAR(100)`               | NOT NULL                          | —         | Nama penerima paket, min 2 karakter                   |
| `recipient_phone`  | `VARCHAR(20)`                | NOT NULL                          | —         | Nomor HP penerima, min 10 karakter                    |
| `shipping_address` | `TEXT`                       | NOT NULL                          | —         | Alamat pengiriman lengkap, min 5 karakter             |
| `notes`            | `TEXT`                       | NULLABLE                          | `NULL`    | Catatan tambahan untuk pesanan                        |
| `total_amount`     | `FLOAT`                      | NOT NULL                          | —         | Total harga seluruh item dalam pesanan                |
| `status`           | `VARCHAR(20)`                | NOT NULL                          | `pending` | Status: `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| `created_at`       | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                          | `now()`   | Waktu pesanan dibuat                                  |
| `updated_at`       | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                          | `NULL`    | Waktu terakhir status diupdate                        |

**Validasi Pydantic (`OrderCreate`):**

| Field              | Validasi                           |
|--------------------|------------------------------------|
| `items`            | `min_items=1` — minimal 1 produk   |
| `receipt_name`     | `min_length=2`, `max_length=100`   |
| `recipient_phone`  | `min_length=10`, `max_length=20`   |
| `shipping_address` | `min_length=5`                     |

**DDL SQL:**
```sql
CREATE TABLE orders (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_code       VARCHAR(50) UNIQUE NOT NULL,
    receipt_name     VARCHAR(100) NOT NULL,
    recipient_phone  VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    notes            TEXT,
    total_amount     FLOAT NOT NULL,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    updated_at       TIMESTAMPTZ
);
CREATE INDEX ix_orders_order_code ON orders(order_code);
CREATE INDEX ix_orders_user_id    ON orders(user_id);
```

---

## 6. Tabel `order_items`

Menyimpan detail produk dalam setiap pesanan.
**Pydantic Schema:** `OrderItemCreate`, `OrderItemResponse`

| Kolom           | Tipe Data                    | Constraint                         | Default | Deskripsi                                    |
|-----------------|------------------------------|------------------------------------|---------|----------------------------------------------|
| `id`            | `INTEGER`                    | PRIMARY KEY, NOT NULL              | Auto-increment | Identitas unik order item           |
| `order_id`      | `INTEGER`                    | FK → `orders.id`, NOT NULL, INDEX  | —       | Pesanan yang memuat item ini                 |
| `product_id`    | `INTEGER`                    | FK → `products.id`, NOT NULL       | —       | Produk yang dipesan                          |
| `quantity`      | `INTEGER`                    | NOT NULL                           | `1`     | Jumlah produk yang dipesan, harus > 0        |
| `price_at_time` | `FLOAT`                      | NOT NULL                           | —       | Harga produk saat order dibuat               |
| `subtotal`      | `FLOAT`                      | NOT NULL                           | —       | Hasil kalkulasi: `price_at_time × quantity`  |
| `created_at`    | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                           | `now()` | Waktu item order dibuat                      |
| `updated_at`    | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                           | `NULL`  | Waktu terakhir diupdate                      |

**Validasi Pydantic (`OrderItemCreate`):**

| Field        | Validasi              |
|--------------|-----------------------|
| `product_id` | `gt=0`               |
| `quantity`   | `gt=0`, default `1`  |

**DDL SQL:**
```sql
CREATE TABLE order_items (
    id             SERIAL PRIMARY KEY,
    order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id     INTEGER NOT NULL REFERENCES products(id),
    quantity       INTEGER NOT NULL DEFAULT 1,
    price_at_time  FLOAT NOT NULL,
    subtotal       FLOAT NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ
);
CREATE INDEX ix_order_items_order_id ON order_items(order_id);
```

---

## 7. Tabel `payments`

Menyimpan data pembayaran untuk setiap pesanan.
**Pydantic Schema:** `PaymentCreate`, `PaymentUpdate`, `PaymentResponse`, `PaymentListResponse`

| Kolom            | Tipe Data                    | Constraint                         | Default   | Deskripsi                                             |
|------------------|------------------------------|------------------------------------|-----------|-------------------------------------------------------|
| `id`             | `INTEGER`                    | PRIMARY KEY, NOT NULL              | Auto-increment | Identitas unik pembayaran                     |
| `order_id`       | `INTEGER`                    | FK → `orders.id`, NOT NULL, INDEX  | —         | Pesanan yang dibayar                                  |
| `payment_method` | `VARCHAR(50)`                | NOT NULL                           | —         | Metode: `bank_transfer`, `e_wallet`, `cash`, `credit_card` |
| `amount`         | `FLOAT`                      | NOT NULL                           | —         | Jumlah yang dibayarkan, harus > 0                     |
| `payment_status` | `VARCHAR(20)`                | NOT NULL                           | `pending` | Status: `pending`, `completed`, `failed`, `refunded`  |
| `proof_url`      | `VARCHAR(255)`               | NULLABLE                           | `NULL`    | URL bukti transfer / screenshot pembayaran            |
| `paid_at`        | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                           | `NULL`    | Waktu pembayaran dikonfirmasi                         |
| `verified_by`    | `INTEGER`                    | FK → `users.id`, NULLABLE          | `NULL`    | ID admin yang memverifikasi pembayaran                |
| `verified_at`    | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                           | `NULL`    | Waktu pembayaran diverifikasi oleh admin              |
| `created_at`     | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                           | `now()`   | Waktu record pembayaran dibuat                        |
| `updated_at`     | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                           | `NULL`    | Waktu terakhir data pembayaran diupdate               |

**Validasi Pydantic (`PaymentCreate`):**

| Field            | Validasi                                                       |
|------------------|----------------------------------------------------------------|
| `order_id`       | `gt=0`                                                         |
| `amount`         | `gt=0`                                                         |
| `payment_method` | Contoh nilai: `bank_transfer`, `e_wallet`, `cash`, `credit_card` |

**DDL SQL:**
```sql
CREATE TABLE payments (
    id             SERIAL PRIMARY KEY,
    order_id       INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount         FLOAT NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    proof_url      VARCHAR(255),
    paid_at        TIMESTAMPTZ,
    verified_by    INTEGER REFERENCES users(id),
    verified_at    TIMESTAMPTZ,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ
);
CREATE INDEX ix_payments_order_id ON payments(order_id);
```

---

## 8. Tabel `testimonials`

Menyimpan review dan rating produk dari customer yang telah melakukan pembelian.
**Pydantic Schema:** `TestimonialCreate`, `TestimonialResponse`, `TestimonialListResponse`

| Kolom        | Tipe Data                    | Constraint                          | Default | Deskripsi                                   |
|--------------|------------------------------|-------------------------------------|---------|---------------------------------------------|
| `id`         | `INTEGER`                    | PRIMARY KEY, NOT NULL               | Auto-increment | Identitas unik testimonial         |
| `order_id`   | `INTEGER`                    | FK → `orders.id`, NULLABLE          | `NULL`  | Pesanan yang menjadi dasar review (opsional)|
| `product_id` | `INTEGER`                    | FK → `products.id`, NOT NULL, INDEX | —       | Produk yang diulas                          |
| `user_id`    | `INTEGER`                    | FK → `users.id`, NOT NULL, INDEX    | —       | Customer yang menulis review                |
| `rating`     | `INTEGER`                    | NOT NULL, CHECK (1–5)               | —       | Nilai bintang: 1 hingga 5                   |
| `comment`    | `TEXT`                       | NULLABLE                            | `NULL`  | Komentar ulasan, maks 500 karakter          |
| `is_visible` | `BOOLEAN`                    | NOT NULL                            | `true`  | Kontrol apakah testimonial ditampilkan      |
| `created_at` | `TIMESTAMP WITH TIME ZONE`   | NOT NULL                            | `now()` | Waktu testimonial dibuat                    |
| `updated_at` | `TIMESTAMP WITH TIME ZONE`   | NULLABLE                            | `NULL`  | Waktu terakhir diupdate                     |

**Validasi Pydantic (`TestimonialCreate`):**

| Field      | Validasi                        |
|------------|---------------------------------|
| `rating`   | `ge=1`, `le=5` — hanya nilai 1–5 |
| `comment`  | `max_length=500`, opsional      |
| `order_id` | `gt=0`, opsional                |

**DDL SQL:**
```sql
CREATE TABLE testimonials (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment    TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
CREATE INDEX ix_testimonials_product_id ON testimonials(product_id);
CREATE INDEX ix_testimonials_user_id    ON testimonials(user_id);
```

---

## Relasi Antar Tabel

```
users ──────────┬──── carts            (1 user → banyak cart)
                ├──── orders           (1 user → banyak order)
                ├──── testimonials     (1 user → banyak testimonial)
                └──── payments         (verified_by: admin memverifikasi)

products ───────┬──── cart_items       (1 produk → banyak cart item)
                ├──── order_items      (1 produk → banyak order item)
                └──── testimonials     (1 produk → banyak testimonial)

carts ──────────└──── cart_items       (1 cart → banyak item)

orders ─────────┬──── order_items      (1 order → banyak item)
                ├──── payments         (1 order → banyak pembayaran)
                └──── testimonials     (1 order → banyak testimonial)
```

---

## Koneksi Database

**File:** `backend/database.py`

| Konfigurasi   | Nilai                                                         |
|---------------|---------------------------------------------------------------|
| Driver        | `psycopg2-binary`                                             |
| ORM           | SQLAlchemy 2.0                                                |
| Format URL    | `postgresql://<user>:<password>@<host>:<port>/<dbname>`       |
| Contoh URL    | `postgresql://postgres:password@localhost:5432/cloudapp`      |

Konfigurasi disimpan di file `.env` **(tidak di-commit ke Git):**
```
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/cloudapp
```

---
