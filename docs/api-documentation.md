# 📚 API Documentation — ATHSNAC

Dokumentasi lengkap semua endpoint API ATHSNAC untuk developer. Panduan penggunaan endpoint dengan format request/response, parameter, dan contoh curl command.

---

## 🔧 System

### GET `/` — Root Endpoint

**Description:** Mendapatkan informasi identitas aplikasi

- **Method:** `GET`
- **URL:** `http://localhost:8000/`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK`

**Response Body:**
```json
{
  "app": "ATHSNAC - UMKM E-Commerce",
  "version": "1.0.0",
  "description": "Platform e-commerce untuk makanan khas Balikpapan",
  "status": "active"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/
```

---

### GET `/health` — Health Check

**Description:** Melakukan health check pada server API

- **Method:** `GET`
- **URL:** `http://localhost:8000/health`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK`

**Response Body:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "ATHSNAC API"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/health
```

---

### GET `/team` — Informasi Tim Proyek

**Description:** Mendapatkan informasi lengkap tim yang mengembangkan aplikasi

- **Method:** `GET`
- **URL:** `http://localhost:8000/team`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK`

**Response Body:**
```json
{
  "team": "Cloud Kelompok Ignite",
  "project": "ATHSNAC - UMKM E-Commerce Makanan Khas Balikpapan",
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
    }
  ],
  "institution": "Institut Teknologi Kalimantan (ITK)",
  "course": "Komputasi Awan - SI"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/team
```

---

## 🔐 Authentication

### POST `/auth/register` — Registrasi Akun Baru

**Description:** Membuat akun pengguna baru di sistem

- **Method:** `POST`
- **URL:** `http://localhost:8000/auth/register`
- **Auth Required:** ❌ No
- **Response Code:** `201 Created` | `400 Bad Request` | `422 Unprocessable Entity`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "Nama User",
  "password": "Password123",
  "phone": "081234567890",
  "address": "Jl. Contoh No. 1",
  "role": "customer"
}
```

**Body Parameters:**
- `email` (string, required) — Email unik pengguna, format valid
- `name` (string, required) — Nama lengkap pengguna
- `password` (string, required) — Password minimal 6 karakter, mengandung angka dan huruf
- `phone` (string, required) — Nomor telepon
- `address` (string, required) — Alamat lengkap
- `role` (string, optional) — Role user: `"customer"` atau `"admin"` (default: `"customer"`)

**Response Body (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Nama User",
  "phone": "081234567890",
  "address": "Jl. Contoh No. 1",
  "role": "customer",
  "is_active": true,
  "created_at": "2026-04-07T09:04:21.653551-08:00",
  "updated_at": null
}
```

**Error Response (400 Bad Request - Email duplikat):**
```json
{
  "detail": "Email sudah terdaftar"
}
```

**Error Response (422 Unprocessable Entity - Password tidak valid):**
```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "Password harus mengandung minimal satu angka",
      "type": "value_error"
    }
  ]
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "Nama User",
    "password": "Password123",
    "phone": "081234567890",
    "address": "Jl. Contoh No. 1",
    "role": "customer"
  }'
```

---

### POST `/auth/login` — Login & Dapatkan Token

**Description:** Melakukan login dan mendapatkan JWT access token

- **Method:** `POST`
- **URL:** `http://localhost:8000/auth/login`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK` | `401 Unauthorized`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Body Parameters:**
- `email` (string, required) — Email pengguna terdaftar
- `password` (string, required) — Password akun

**Response Body (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTg1MTYwfQ.ynUwuJzcEOWVO3iW9pKQLM35M3-1Qa2kd4qmZHsT85Y",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Nama User",
    "role": "customer",
    "is_active": true
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Login gagal: email atau password salah"
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

---

### GET `/auth/me` — Profil User yang Login

**Description:** Mendapatkan profil data user yang sedang login

- **Method:** `GET`
- **URL:** `http://localhost:8000/auth/me`
- **Auth Required:** ✅ Yes (Bearer Token)
- **Response Code:** `200 OK` | `401 Unauthorized`

**Headers Required:**
```
Authorization: Bearer <access_token>
```

**Response Body (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "Nama User",
  "phone": "081234567890",
  "address": "Jl. Contoh No. 1",
  "role": "customer",
  "is_active": true,
  "created_at": "2026-04-07T09:04:21.653551-08:00",
  "updated_at": null
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Not authenticated"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTg1MTYwfQ.ynUwuJzcEOWVO3iW9pKQLM35M3-1Qa2kd4qmZHsT85Y"
```

---

## 📦 Products

### GET `/products` — Daftar Produk

**Description:** Mendapatkan daftar semua produk dengan pagination, search, dan filter kategori

- **Method:** `GET`
- **URL:** `http://localhost:8000/products`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK`

**Query Parameters:**
- `skip` (int, default: 0) — Jumlah data yang dilewatkan (untuk pagination)
- `limit` (int, default: 10) — Jumlah data per halaman
- `search` (string, optional) — Cari berdasarkan nama produk
- `category` (string, optional) — Filter berdasarkan kategori produk

**Response Body (200 OK):**
```json
{
  "total": 5,
  "products": [
    {
      "id": 1,
      "name": "Amplang Balikpapan",
      "description": "Amplang gurih khas Balikpapan",
      "category": "makanan",
      "slug": "amplang-balikpapan",
      "price": 25000,
      "stock": 100,
      "image_url": "https://example.com/amplang.jpg",
      "is_active": true,
      "created_at": "2026-04-07T09:11:31.635275-08:00",
      "updated_at": null
    }
  ]
}
```

**Curl Command (dengan filter):**
```bash
curl -X GET "http://localhost:8000/products?skip=0&limit=10&search=amplang&category=makanan"
```

**Curl Command (tanpa parameter):**
```bash
curl -X GET "http://localhost:8000/products"
```

---

### POST `/products` — Buat Produk Baru

**Description:** Membuat produk baru di sistem (hanya admin)

- **Method:** `POST`
- **URL:** `http://localhost:8000/products`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `201 Created` | `401 Unauthorized` | `403 Forbidden`

**Headers Required:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 100,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true
}
```

**Body Parameters:**
- `name` (string, required) — Nama produk
- `description` (string, required) — Deskripsi produk
- `category` (string, required) — Kategori produk
- `slug` (string, required) — Slug URL-friendly untuk produk
- `price` (integer, required) — Harga produk dalam Rupiah
- `stock` (integer, required) — Jumlah stok produk
- `image_url` (string, optional) — URL gambar produk
- `is_active` (boolean, optional) — Status aktif produk (default: true)

**Response Body (201 Created):**
```json
{
  "id": 1,
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 100,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true,
  "created_at": "2026-04-07T09:11:31.635275-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "Amplang Balikpapan",
    "description": "Amplang gurih khas Balikpapan",
    "category": "makanan",
    "slug": "amplang-balikpapan",
    "price": 25000,
    "stock": 100,
    "image_url": "https://example.com/amplang.jpg",
    "is_active": true
  }'
```

---

### GET `/products/stats` — Statistik Produk

**Description:** Mendapatkan statistik inventori produk (hanya admin)

- **Method:** `GET`
- **URL:** `http://localhost:8000/products/stats`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `200 OK` | `401 Unauthorized`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Response Body (200 OK):**
```json
{
  "total_products": 5,
  "total_stock": 500,
  "total_available": 5,
  "categories": {
    "makanan": 3,
    "minuman": 2
  },
  "total_value": 12500000
}
```

**Response Fields:**
- `total_products` — Jumlah total produk
- `total_stock` — Jumlah total stok semua produk
- `total_available` — Jumlah produk yang tersedia (stock > 0)
- `categories` — Breakdown jumlah produk per kategori
- `total_value` — Total nilai inventori (price × stock per produk)

**Curl Command:**
```bash
curl -X GET http://localhost:8000/products/stats \
  -H "Authorization: Bearer <admin_token>"
```

---

### GET `/products/{product_id}` — Detail Produk

**Description:** Mendapatkan detail lengkap satu produk berdasarkan ID

- **Method:** `GET`
- **URL:** `http://localhost:8000/products/{product_id}`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK` | `404 Not Found`

**Path Parameters:**
- `product_id` (integer, required) — ID produk

**Response Body (200 OK):**
```json
{
  "id": 1,
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 100,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true,
  "created_at": "2026-04-07T09:11:31.635275-08:00",
  "updated_at": null
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Produk dengan id=99 tidak ditemukan"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/products/1
```

---

### PUT `/products/{product_id}` — Update Produk

**Description:** Mengupdate data produk (hanya admin)

- **Method:** `PUT`
- **URL:** `http://localhost:8000/products/{product_id}`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `200 OK` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameters:**
- `product_id` (integer, required) — ID produk yang akan diupdate

**Request Body:** (update fields yang ingin diubah)
```json
{
  "stock": 50,
  "price": 30000
}
```

**Response Body (200 OK):**
```json
{
  "id": 1,
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 30000,
  "stock": 50,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true,
  "created_at": "2026-04-07T09:11:31.635275-08:00",
  "updated_at": "2026-04-07T09:16:55.327211-08:00"
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8000/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "stock": 50,
    "price": 30000
  }'
```

---

### DELETE `/products/{product_id}` — Hapus Produk

**Description:** Menghapus produk dari sistem (hanya admin)

- **Method:** `DELETE`
- **URL:** `http://localhost:8000/products/{product_id}`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `204 No Content` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Path Parameters:**
- `product_id` (integer, required) — ID produk yang akan dihapus

**Response Body:** (kosong untuk response 204)

**Curl Command:**
```bash
curl -X DELETE http://localhost:8000/products/1 \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🛒 Cart

### GET `/cart` — Lihat Keranjang Belanja

**Description:** Mendapatkan isi keranjang belanja customer yang sedang login

- **Method:** `GET`
- **URL:** `http://localhost:8000/cart`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `200 OK` | `401 Unauthorized`

**Headers Required:**
```
Authorization: Bearer <customer_token>
```

**Response Body (200 OK):**
```json
{
  "id": 2,
  "user_id": 2,
  "status": "active",
  "items": [
    {
      "id": 2,
      "cart_id": 2,
      "product_id": 2,
      "quantity": 10,
      "price_at_time": 20000,
      "subtotal": 200000,
      "created_at": "2026-04-07T10:21:34.360300-08:00",
      "updated_at": null
    }
  ],
  "total_items": 1,
  "total_price": 200000,
  "created_at": "2026-04-07T10:20:00.000000-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/cart \
  -H "Authorization: Bearer <customer_token>"
```

---

### POST `/cart/items` — Tambah Produk ke Keranjang

**Description:** Menambahkan produk baru ke keranjang belanja

- **Method:** `POST`
- **URL:** `http://localhost:8000/cart/items`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `201 Created` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 2,
  "quantity": 10
}
```

**Body Parameters:**
- `product_id` (integer, required) — ID produk yang akan ditambahkan
- `quantity` (integer, required) — Jumlah kuantitas produk

**Response Body (201 Created):**
```json
{
  "id": 2,
  "cart_id": 2,
  "product_id": 2,
  "quantity": 10,
  "price_at_time": 20000,
  "subtotal": 200000,
  "created_at": "2026-04-07T10:21:34.360300-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "product_id": 2,
    "quantity": 10
  }'
```

---

### PUT `/cart/items/{item_id}` — Update Quantity Item

**Description:** Mengupdate jumlah kuantitas item di keranjang

- **Method:** `PUT`
- **URL:** `http://localhost:8000/cart/items/{item_id}`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `200 OK` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Path Parameters:**
- `item_id` (integer, required) — ID item di keranjang yang akan diupdate

**Request Body:**
```json
{
  "quantity": 20
}
```

**Body Parameters:**
- `quantity` (integer, required) — Jumlah kuantitas baru

**Response Body (200 OK):**
```json
{
  "id": 2,
  "cart_id": 2,
  "product_id": 2,
  "quantity": 20,
  "price_at_time": 20000,
  "subtotal": 400000,
  "created_at": "2026-04-07T10:21:34.360300-08:00",
  "updated_at": "2026-04-07T10:22:46.314312-08:00"
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8000/cart/items/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "quantity": 20
  }'
```

---

### DELETE `/cart/items/{item_id}` — Hapus Item dari Keranjang

**Description:** Menghapus item dari keranjang belanja

- **Method:** `DELETE`
- **URL:** `http://localhost:8000/cart/items/{item_id}`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `204 No Content` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <customer_token>
```

**Path Parameters:**
- `item_id` (integer, required) — ID item yang akan dihapus dari keranjang

**Response Body:** (kosong untuk response 204)

**Curl Command:**
```bash
curl -X DELETE http://localhost:8000/cart/items/2 \
  -H "Authorization: Bearer <customer_token>"
```

---

## 📋 Orders

### POST `/orders` — Buat Pesanan Baru

**Description:** Membuat pesanan baru dari produk-produk yang dipilih

- **Method:** `POST`
- **URL:** `http://localhost:8000/orders`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `201 Created` | `401 Unauthorized` | `400 Bad Request`

**Headers Required:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    { "product_id": 2, "quantity": 1 }
  ],
  "receipt_name": "Andini Permata",
  "recipient_phone": "081234567890",
  "shipping_address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "notes": "Antar sebelum jam 5 sore"
}
```

**Body Parameters:**
- `items` (array, required) — Daftar produk yang dipesan, masing-masing dengan:
  - `product_id` (integer) — ID produk
  - `quantity` (integer) — Jumlah produk
- `receipt_name` (string, required) — Nama penerima
- `recipient_phone` (string, required) — Nomor telepon penerima
- `shipping_address` (string, required) — Alamat pengiriman lengkap
- `notes` (string, optional) — Catatan khusus untuk pesanan

**Response Body (201 Created):**
```json
{
  "id": 2,
  "user_id": 2,
  "order_code": "ORD-20260407-80508FEA",
  "receipt_name": "Andini Permata",
  "recipient_phone": "081234567890",
  "shipping_address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "notes": "Antar sebelum jam 5 sore",
  "total_amount": 20000,
  "status": "pending",
  "items": [
    {
      "id": 2,
      "order_id": 2,
      "product_id": 2,
      "quantity": 1,
      "price_at_time": 20000,
      "subtotal": 20000,
      "created_at": "2026-04-07T10:26:21.970590-08:00",
      "updated_at": null
    }
  ],
  "created_at": "2026-04-07T10:26:21.970590-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "items": [{ "product_id": 2, "quantity": 1 }],
    "receipt_name": "Andini Permata",
    "recipient_phone": "081234567890",
    "shipping_address": "Jl. Ahmad Yani No. 123, Balikpapan",
    "notes": "Antar sebelum jam 5 sore"
  }'
```

---

### GET `/orders` — Daftar Pesanan Milik Customer

**Description:** Mendapatkan daftar semua pesanan milik customer yang sedang login

- **Method:** `GET`
- **URL:** `http://localhost:8000/orders`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `200 OK` | `401 Unauthorized`

**Headers Required:**
```
Authorization: Bearer <customer_token>
```

**Query Parameters:**
- `skip` (int, default: 0) — Jumlah data yang dilewatkan (untuk pagination)
- `limit` (int, default: 10) — Jumlah data per halaman

**Response Body (200 OK):**
```json
{
  "total": 2,
  "orders": [
    {
      "id": 2,
      "user_id": 2,
      "order_code": "ORD-20260407-80508FEA",
      "receipt_name": "Andini Permata",
      "recipient_phone": "081234567890",
      "shipping_address": "Jl. Ahmad Yani No. 123, Balikpapan",
      "notes": "Antar sebelum jam 5 sore",
      "total_amount": 20000,
      "status": "pending",
      "items": [
        {
          "product_id": 2,
          "quantity": 1,
          "price_at_time": 20000,
          "subtotal": 20000
        }
      ],
      "created_at": "2026-04-07T10:26:21.970590-08:00",
      "updated_at": null
    }
  ]
}
```

**Curl Command:**
```bash
curl -X GET "http://localhost:8000/orders?skip=0&limit=10" \
  -H "Authorization: Bearer <customer_token>"
```

---

### GET `/orders/admin/all` — Semua Pesanan (Admin Only)

**Description:** Mendapatkan daftar semua pesanan dari seluruh customer (hanya admin)

- **Method:** `GET`
- **URL:** `http://localhost:8000/orders/admin/all`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `200 OK` | `401 Unauthorized`

**Headers Required:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `skip` (int, default: 0) — Jumlah data yang dilewatkan (untuk pagination)
- `limit` (int, default: 10) — Jumlah data per halaman

**Response Body (200 OK):**
```json
{
  "total": 5,
  "orders": [
    {
      "id": 1,
      "user_id": 3,
      "order_code": "ORD-20260407-A1B2C3D4",
      "receipt_name": "Customer A",
      "total_amount": 50000,
      "status": "pending",
      "created_at": "2026-04-07T10:26:00.000000-08:00",
      "updated_at": null
    },
    {
      "id": 2,
      "user_id": 2,
      "order_code": "ORD-20260407-80508FEA",
      "receipt_name": "Andini Permata",
      "total_amount": 20000,
      "status": "pending",
      "created_at": "2026-04-07T10:26:21.970590-08:00",
      "updated_at": null
    }
  ]
}
```

**Curl Command:**
```bash
curl -X GET "http://localhost:8000/orders/admin/all?skip=0&limit=10" \
  -H "Authorization: Bearer <admin_token>"
```

---

### GET `/orders/{order_id}` — Detail Pesanan Spesifik

**Description:** Mendapatkan detail lengkap satu pesanan berdasarkan ID

- **Method:** `GET`
- **URL:** `http://localhost:8000/orders/{order_id}`
- **Auth Required:** ✅ Yes (Token Customer atau Admin)
- **Response Code:** `200 OK` | `401 Unauthorized` | `403 Forbidden` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `order_id` (integer, required) — ID pesanan

**Response Body (200 OK):**
```json
{
  "id": 2,
  "user_id": 2,
  "order_code": "ORD-20260407-80508FEA",
  "receipt_name": "Andini Permata",
  "recipient_phone": "081234567890",
  "shipping_address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "notes": "Antar sebelum jam 5 sore",
  "total_amount": 20000,
  "status": "pending",
  "items": [
    {
      "product_id": 2,
      "quantity": 1,
      "price_at_time": 20000,
      "subtotal": 20000
    }
  ],
  "created_at": "2026-04-07T10:26:21.970590-08:00",
  "updated_at": null
}
```

**Error Response (403 Forbidden - Akses ditolak):**
```json
{
  "detail": "Anda tidak memiliki akses ke pesanan ini"
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/orders/2 \
  -H "Authorization: Bearer <token>"
```

---

### PUT `/orders/{order_id}` — Update Status Pesanan (Admin Only)

**Description:** Mengupdate status pesanan (hanya admin)

- **Method:** `PUT`
- **URL:** `http://localhost:8000/orders/{order_id}`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `200 OK` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameters:**
- `order_id` (integer, required) — ID pesanan yang akan diupdate

**Request Body:**
```json
{
  "status": "completed"
}
```

**Body Parameters:**
- `status` (string, required) — Status baru pesanan (contoh: `"pending"`, `"processing"`, `"completed"`, `"cancelled"`)

**Response Body (200 OK):**
```json
{
  "id": 2,
  "user_id": 2,
  "order_code": "ORD-20260407-80508FEA",
  "receipt_name": "Andini Permata",
  "total_amount": 20000,
  "status": "completed",
  "created_at": "2026-04-07T10:26:21.970590-08:00",
  "updated_at": "2026-04-07T10:30:00.000000-08:00"
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8000/orders/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"status": "completed"}'
```

---

## 💳 Payments

### POST `/payments` — Buat Payment Record

**Description:** Mencatat pembayaran untuk sebuah pesanan

- **Method:** `POST`
- **URL:** `http://localhost:8000/payments`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `201 Created` | `401 Unauthorized` | `400 Bad Request`

**Headers Required:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "order_id": 2,
  "amount": 20000,
  "payment_method": "transfer",
  "reference_number": "TRF-123456789"
}
```

**Body Parameters:**
- `order_id` (integer, required) — ID pesanan yang dibayar
- `amount` (integer, required) — Jumlah pembayaran dalam Rupiah
- `payment_method` (string, required) — Metode pembayaran (contoh: `"transfer"`, `"cash"`, `"ovo"`)
- `reference_number` (string, optional) — Nomor referensi/bukti pembayaran

**Response Body (201 Created):**
```json
{
  "id": 3,
  "order_id": 2,
  "user_id": 2,
  "amount": 20000,
  "payment_method": "transfer",
  "reference_number": "TRF-123456789",
  "status": "pending",
  "created_at": "2026-04-07T10:28:00.000000-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "order_id": 2,
    "amount": 20000,
    "payment_method": "transfer",
    "reference_number": "TRF-123456789"
  }'
```

---

### GET `/payments/{payment_id}` — Detail Pembayaran

**Description:** Mendapatkan detail pembayaran berdasarkan ID

- **Method:** `GET`
- **URL:** `http://localhost:8000/payments/{payment_id}`
- **Auth Required:** ✅ Yes (Token Customer atau Admin)
- **Response Code:** `200 OK` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `payment_id` (integer, required) — ID pembayaran

**Response Body (200 OK):**
```json
{
  "id": 3,
  "order_id": 2,
  "user_id": 2,
  "amount": 20000,
  "payment_method": "transfer",
  "reference_number": "TRF-123456789",
  "status": "pending",
  "created_at": "2026-04-07T10:28:00.000000-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X GET http://localhost:8000/payments/3 \
  -H "Authorization: Bearer <token>"
```

---

### PUT `/payments/{payment_id}` — Update Status Pembayaran (Admin Only)

**Description:** Mengupdate status pembayaran (hanya admin)

- **Method:** `PUT`
- **URL:** `http://localhost:8000/payments/{payment_id}`
- **Auth Required:** ✅ Yes (Admin Token)
- **Response Code:** `200 OK` | `401 Unauthorized` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameters:**
- `payment_id` (integer, required) — ID pembayaran yang akan diupdate

**Request Body:**
```json
{
  "status": "verified"
}
```

**Body Parameters:**
- `status` (string, required) — Status pembayaran (contoh: `"pending"`, `"verified"`, `"failed"`)

**Response Body (200 OK):**
```json
{
  "id": 3,
  "order_id": 2,
  "user_id": 2,
  "amount": 20000,
  "payment_method": "transfer",
  "reference_number": "TRF-123456789",
  "status": "verified",
  "created_at": "2026-04-07T10:28:00.000000-08:00",
  "updated_at": "2026-04-07T10:35:00.000000-08:00"
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8000/payments/3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"status": "verified"}'
```

---

## 🗣️ Testimonials

### GET `/testimonials` — Daftar Testimonial

**Description:** Mendapatkan daftar testimonial dari customer

- **Method:** `GET`
- **URL:** `http://localhost:8000/testimonials`
- **Auth Required:** ❌ No
- **Response Code:** `200 OK`

**Query Parameters:**
- `skip` (int, default: 0) — Jumlah data yang dilewatkan
- `limit` (int, default: 10) — Jumlah data per halaman

**Response Body (200 OK):**
```json
{
  "total": 3,
  "testimonials": [
    {
      "id": 1,
      "user_id": 2,
      "rating": 5,
      "comment": "Produk bagus dan pengiriman cepat!",
      "is_published": true,
      "created_at": "2026-04-07T11:00:00.000000-08:00",
      "updated_at": null
    }
  ]
}
```

**Curl Command:**
```bash
curl -X GET "http://localhost:8000/testimonials?skip=0&limit=10"
```

---

### POST `/testimonials` — Buat Testimonial Baru

**Description:** Membuat testimonial/review produk (customer)

- **Method:** `POST`
- **URL:** `http://localhost:8000/testimonials`
- **Auth Required:** ✅ Yes (Customer Token)
- **Response Code:** `201 Created` | `401 Unauthorized`

**Headers Required:**
```
Authorization: Bearer <customer_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Produk bagus dan pengiriman cepat!"
}
```

**Body Parameters:**
- `rating` (integer, required) — Rating dari 1-5
- `comment` (string, required) — Komentar testimonial

**Response Body (201 Created):**
```json
{
  "id": 1,
  "user_id": 2,
  "rating": 5,
  "comment": "Produk bagus dan pengiriman cepat!",
  "is_published": false,
  "created_at": "2026-04-07T11:00:00.000000-08:00",
  "updated_at": null
}
```

**Curl Command:**
```bash
curl -X POST http://localhost:8000/testimonials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <customer_token>" \
  -d '{
    "rating": 5,
    "comment": "Produk bagus dan pengiriman cepat!"
  }'
```

---

### PUT `/testimonials/{testimonial_id}` — Update Testimonial

**Description:** Mengupdate testimonial milik customer

- **Method:** `PUT`
- **URL:** `http://localhost:8000/testimonials/{testimonial_id}`
- **Auth Required:** ✅ Yes (Customer Token atau Admin)
- **Response Code:** `200 OK` | `401 Unauthorized` | `403 Forbidden` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters:**
- `testimonial_id` (integer, required) — ID testimonial

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Produk bagus, harga sedikit mahal"
}
```

**Response Body (200 OK):**
```json
{
  "id": 1,
  "user_id": 2,
  "rating": 4,
  "comment": "Produk bagus, harga sedikit mahal",
  "is_published": true,
  "created_at": "2026-04-07T11:00:00.000000-08:00",
  "updated_at": "2026-04-07T11:05:00.000000-08:00"
}
```

**Curl Command:**
```bash
curl -X PUT http://localhost:8000/testimonials/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "rating": 4,
    "comment": "Produk bagus, harga sedikit mahal"
  }'
```

---

### DELETE `/testimonials/{testimonial_id}` — Hapus Testimonial

**Description:** Menghapus testimonial (customer atau admin)

- **Method:** `DELETE`
- **URL:** `http://localhost:8000/testimonials/{testimonial_id}`
- **Auth Required:** ✅ Yes (Customer Token atau Admin)
- **Response Code:** `204 No Content` | `401 Unauthorized` | `403 Forbidden` | `404 Not Found`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `testimonial_id` (integer, required) — ID testimonial yang akan dihapus

**Response Body:** (kosong untuk response 204)

**Curl Command:**
```bash
curl -X DELETE http://localhost:8000/testimonials/1 \
  -H "Authorization: Bearer <token>"
```

---

## 🔑 Authentication Notes

### Token Usage

Semua endpoint yang memerlukan autentikasi menggunakan **Bearer Token JWT** di header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Admin vs Customer

- **Admin endpoints** — Hanya bisa diakses oleh user dengan role `"admin"`
- **Customer endpoints** — Hanya bisa diakses oleh user dengan role `"customer"`
- **Public endpoints** — Tidak memerlukan token

### Token Expiration

- Token memiliki masa berlaku tertentu
- Request dengan token kadaluarsa akan mendapat response `401 Unauthorized`
- Lakukan login ulang untuk mendapatkan token baru

---

## ⚠️ Error Responses

Semua endpoint dapat mengembalikan error response dengan struktur:

```json
{
  "detail": "Pesan error deskriptif"
}
```

### Common Error Codes

| Code | Deskripsi |
|------|-----------|
| `400 Bad Request` | Request body tidak valid atau data sudah ada |
| `401 Unauthorized` | Token tidak ada atau tidak valid |
| `403 Forbidden` | User tidak memiliki akses (role tidak sesuai) |
| `404 Not Found` | Resource yang dicari tidak ditemukan |
| `422 Unprocessable Entity` | Validasi field request gagal |
| `500 Internal Server Error` | Error di sisi server |

---

## 📝 Catatan Penting

1. **Base URL** — Ganti `http://localhost:8000` dengan URL API production jika diperlukan
2. **CORS** — API mendukung CORS untuk request dari frontend
3. **Rate Limiting** — Tidak ada pembatasan rate saat ini, namun akan ditambahkan pada production
4. **Timezone** — Semua timestamp menggunakan timezone server (UTC-8 / PST)
5. **Pagination** — Default `limit=10` dan `skip=0`, maksimal `limit=100`

---