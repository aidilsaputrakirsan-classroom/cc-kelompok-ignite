# 📋 Dokumentasi Hasil Pengujian API — ATHSNAC


## 📊 Ringkasan Hasil Pengujian

| Modul | Total Test Case | ✅ Passed | ❌ Failed | Pass Rate |
|---|---|---|---|---|
| System | 3 | 3 | 0 | 100% |
| Authentication | 6 | 6 | 0 | 100% |
| Products | 8 | 8 | 0 | 100% |
| Cart | 4 | 4 | 0 | 100% |
| Orders | 5 | 5 | 0 | 100% |
| Payments | 5 | 5 | 0 | 100% |
| Testimonials | 6 | 6 | 0 | 100% |
| **TOTAL** | **37** | **37** | **0** | **100%** |

---

## 🔧 SYSTEM

### GET `/` — Root Endpoint

- [x] **TC-SYS-01** — Request tanpa parameter berhasil mengembalikan `200 OK`
- [x] Response body mengandung field `app`, `version`, `description`, `status`
- [x] Nilai `status` adalah `"active"`
- [x] Nilai `app` sesuai nama proyek: `"ATHSNAC - UMKM E-Commerce"`

**Response aktual:**
```json
{
  "app": "ATHSNAC - UMKM E-Commerce",
  "version": "1.0.0",
  "description": "Platform e-commerce untuk makanan khas Balikpapan",
  "status": "active"
}
```

**📌 Analisis:** Server berhasil aktif dan mengembalikan identitas aplikasi dengan lengkap. Nilai `status: "active"` memastikan layanan berjalan normal.

---

### GET `/health` — Health Check

- [x] **TC-SYS-02** — Request berhasil mengembalikan `200 OK`
- [x] Response mengandung field `status`, `version`, `service`
- [x] Nilai `status` adalah `"healthy"`
- [x] Server berjalan dengan Uvicorn

**Response aktual:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "service": "ATHSNAC API"
}
```

**📌 Analisis:** Health check memastikan server siap menerima request. Endpoint ini digunakan untuk monitoring — mendeteksi jika layanan mengalami gangguan.

---

### GET `/team` — Informasi Tim

- [x] **TC-SYS-03** — Request berhasil mengembalikan `200 OK`
- [x] Response mengandung 4 anggota tim dengan field `name`, `nim`, `role`, `email`
- [x] Field `institution` dan `course` tersedia
- [x] Semua email menggunakan domain `@student.itk.ac.id`

**Response aktual:**
```json
{
  "team": "Cloud Kelompok Ignite",
  "project": "ATHSNAC - UMKM E-Commerce Makanan Khas Balikpapan",
  "members": [
    { "name": "Andini Permata Dewanti",    "nim": "10231014", "role": "Lead Backend",   "email": "10231014@student.itk.ac.id" },
    { "name": "Putri Rahmawati",           "nim": "10231074", "role": "Lead Frontend",  "email": "10231074@student.itk.ac.id" },
    { "name": "Krishandy Dhanysa Pratama", "nim": "10231050", "role": "Lead DevOps",    "email": "10231050@student.itk.ac.id" },
    { "name": "Desnita Dwi Putri",         "nim": "10231030", "role": "Lead QA & Docs", "email": "10231030@student.itk.ac.id" }
  ],
  "institution": "Institut Teknologi Kalimantan (ITK)",
  "course": "Komputasi Awan - SI"
}
```

**📌 Analisis:** Seluruh data tim dikembalikan dengan benar. Endpoint ini bersifat publik dan tidak memerlukan autentikasi, berfungsi sebagai identitas proyek.

---

## 🔐 AUTHENTICATION 

### POST `/auth/register` — Registrasi Akun

- [x] **TC-AUTH-01** — Registrasi dengan data lengkap berhasil mengembalikan `201 Created`
- [x] Response mengandung field `id`, `email`, `name`, `phone`, `address`, `role`, `is_active`, `created_at`
- [x] Field `password` / `password_hash` **tidak** muncul di response (keamanan terjaga)
- [x] Field `is_active` bernilai `true` secara default
- [x] Field `updated_at` bernilai `null` karena data baru saja dibuat dan belum pernah diubah
- [x] Validasi role berhasil: dapat menetapkan role `"admin"` saat registrasi
- [x] **TC-AUTH-ERR-01** — Registrasi dengan email yang sudah terdaftar mengembalikan `400 Bad Request`
- [x] **TC-AUTH-ERR-02** — Password yang tidak mengandung angka mengembalikan `422 Unprocessable Entity`

**Request body yang digunakan:**
```json
{
  "email": "10231030@student.itk.ac.id",
  "name": "Desnita",
  "password": "Desnita123",
  "phone": "081234567890",
  "address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "role": "admin"
}
```

**Response aktual `201 Created`:**
```json
{
  "id": 1,
  "email": "10231030@student.itk.ac.id",
  "name": "Desnita",
  "phone": "081234567890",
  "address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "role": "admin",
  "is_active": true,
  "created_at": "2026-04-07T09:04:21.653551-08:00",
  "updated_at": null
}
```

**Response `400 Bad Request` (email duplikat):**
```json
{
  "detail": "Email sudah terdaftar"
}
```

**Response `422 Unprocessable Entity` (password tidak valid):**
```json
{
  "detail": [{ "loc": ["body", "password"], "msg": "Password harus mengandung minimal satu angka", "type": "value_error" }]
}
```

**📌 Analisis:** Sistem registrasi berjalan dengan baik. Password asli tidak pernah dikembalikan ke client — hanya data akun yang aman. Validasi duplikat email dan format password berfungsi sesuai ekspektasi.

---

### POST `/auth/login` — Login

- [x] **TC-AUTH-02** — Login dengan email dan password valid berhasil mengembalikan `200 OK`
- [x] Response mengandung field `access_token`, `token_type`, `user`
- [x] Nilai `token_type` adalah `"bearer"`
- [x] `access_token` berupa string JWT yang valid dengan format tiga segmen `xxxxx.yyyyy.zzzzz`
- [x] Objek `user` di dalam response mengandung data profil lengkap
- [x] **TC-AUTH-ERR-03** — Login dengan password salah mengembalikan `401 Unauthorized`

**Request body yang digunakan:**
```json
{
  "email": "10231030@student.itk.ac.id",
  "password": "Desnita123"
}
```

**Response aktual `200 OK`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzc1NTg1MTYwfQ.ynUwuJzcEOWVO3iW9pKQLM35M3-1Qa2kd4qmZHsT85Y",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "10231030@student.itk.ac.id",
    "name": "Desnita",
    "role": "admin",
    "is_active": true
  }
}
```

**Response `401 Unauthorized` (password salah):**
```json
{
  "detail": "Login gagal: email atau password salah"
}
```

**📌 Analisis:** Token JWT berhasil di-generate setelah login. Token ini yang digunakan di semua endpoint yang memerlukan autentikasi. Sistem menolak kredensial yang salah dengan pesan yang informatif.

---

### GET `/auth/me` — Profil User yang Login

- [x] **TC-AUTH-03** — Request dengan token valid berhasil mengembalikan `200 OK`
- [x] Response mengandung data profil user yang sedang login
- [x] Token JWT disertakan di header `Authorization: Bearer <token>`
- [x] **TC-AUTH-ERR-04** — Request tanpa token mengembalikan `401 Unauthorized`
- [x] **TC-AUTH-ERR-05** — Request dengan token kadaluarsa mengembalikan `401 Unauthorized`

**Response aktual `200 OK`:**
```json
{
  "id": 1,
  "email": "10231030@student.itk.ac.id",
  "name": "Desnita",
  "phone": "081234567890",
  "address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "role": "admin",
  "is_active": true,
  "created_at": "2026-04-07T09:04:21.653551-08:00",
  "updated_at": null
}
```

**Response `401 Unauthorized` (tanpa token):**
```json
{
  "detail": "Not authenticated"
}
```

**📌 Analisis:** Endpoint `/auth/me` memverifikasi token dan mengembalikan profil user yang sesuai dengan isi token. Sistem menolak request tanpa token maupun token yang sudah kadaluarsa dengan benar.

---

## 📦 PRODUCTS 

### POST `/products` — Buat Produk Baru *(Admin Only)*

- [x] **TC-PROD-01** — Request dengan token admin dan data valid berhasil mengembalikan `201 Created`
- [x] Response mengandung semua field produk termasuk `id` dan `created_at` yang diisi otomatis
- [x] Field `updated_at` bernilai `null` karena produk baru saja dibuat dan belum pernah diubah
- [x] Field `slug` tersimpan sesuai input
- [x] Field `is_active` default `true`
- [x] **TC-PROD-ERR-01** — Request tanpa token mengembalikan `401 Unauthorized`

**Request body yang digunakan:**
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

**Response aktual `201 Created`:**
```json
{
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 100,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true,
  "id": 1,
  "created_at": "2026-04-07T09:11:31.635275-08:00",
  "updated_at": null
}
```

**📌 Analisis:** Produk berhasil dibuat dengan semua field yang dikirim tersimpan dengan benar. `id` dan `created_at` diisi otomatis oleh server. Endpoint hanya bisa diakses oleh admin — percobaan tanpa token langsung ditolak dengan `401`.

---

### GET `/products` — Daftar Produk *(Publik)*

- [x] **TC-PROD-02** — Request tanpa token berhasil mengembalikan `200 OK` (endpoint publik)
- [x] Response mengandung field `total` dan `products` (array)
- [x] Nilai `total` sesuai jumlah produk yang ada di database
- [x] Pagination berfungsi: parameter `skip` dan `limit` bekerja sesuai ekspektasi
- [x] **TC-PROD-02b** — Filter `search=amplang` mengembalikan hanya produk yang sesuai keyword
- [x] **TC-PROD-02c** — Filter `category=makanan` mengembalikan hanya produk dalam kategori tersebut

**Response aktual `200 OK`:**
```json
{
  "total": 1,
  "products": [
    {
      "name": "Amplang Balikpapan",
      "description": "Amplang gurih khas Balikpapan",
      "category": "makanan",
      "slug": "amplang-balikpapan",
      "price": 25000,
      "stock": 100,
      "image_url": "https://example.com/amplang.jpg",
      "is_active": true,
      "id": 1,
      "created_at": "2026-04-07T09:11:31.635275-08:00",
      "updated_at": null
    }
  ]
}
```

**📌 Analisis:** Endpoint publik ini dapat diakses siapa saja tanpa login. Field `total` berguna di sisi frontend untuk menghitung total halaman pada pagination. Fitur search dan filter kategori berfungsi dengan baik.

---

### GET `/products/stats` — Statistik Produk *(Admin Only)*

- [x] **TC-PROD-03** — Request dengan token admin berhasil mengembalikan `200 OK`
- [x] Response mengandung `total_products`, `total_stock`, `total_available`, `categories`, `total_value`
- [x] Nilai `total_value` dihitung dengan benar dari `price × stock` per produk: 25.000 × 100 = **2.500.000** ✅
- [x] Field `categories` menampilkan breakdown jumlah produk per kategori dengan benar

**Response aktual `200 OK`:**
```json
{
  "total_products": 1,
  "total_stock": 100,
  "total_available": 1,
  "categories": { "makanan": 1 },
  "total_value": 2500000
}
```

**📌 Analisis:** Statistik inventori dihitung secara real-time dari database. `total_value` adalah nilai total seluruh stok yang dimiliki — berguna untuk admin memantau aset inventori. Hanya admin yang dapat mengaksesnya.

---

### GET `/products/{product_id}` — Detail Produk *(Publik)*

- [x] **TC-PROD-04** — Request `GET /products/1` tanpa token berhasil mengembalikan `200 OK`
- [x] Response mengandung semua field detail produk dengan data yang benar
- [x] **TC-PROD-ERR-02** — Request dengan `product_id` yang tidak ada mengembalikan `404 Not Found`

**Response aktual `200 OK`:**
```json
{
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 100,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true,
  "id": 1,
  "created_at": "2026-04-07T09:11:31.635275-08:00",
  "updated_at": null
}
```

**Response `404 Not Found`:**
```json
{
  "detail": "Produk dengan id=99 tidak ditemukan"
}
```

**📌 Analisis:** Detail produk berhasil dikembalikan dengan lengkap. Ketika ID tidak ada di database, server langsung memberikan `404` dengan pesan yang jelas — bukan array kosong.

---

### PUT `/products/{product_id}` — Update Produk *(Admin Only)*

- [x] **TC-PROD-05** — Update stok produk berhasil mengembalikan `200 OK`
- [x] Perubahan field `stock` dari `100` → `10` tersimpan dengan benar di database
- [x] Field `updated_at` terisi dengan timestamp setelah update (sebelumnya `null`)
- [x] Field yang tidak disertakan dalam request body tetap bernilai sama (partial update berfungsi)

**Request body yang digunakan:**
```json
{
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 10,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true
}
```

**Response aktual `200 OK`:**
```json
{
  "name": "Amplang Balikpapan",
  "description": "Amplang gurih khas Balikpapan",
  "category": "makanan",
  "slug": "amplang-balikpapan",
  "price": 25000,
  "stock": 10,
  "image_url": "https://example.com/amplang.jpg",
  "is_active": true,
  "id": 1,
  "created_at": "2026-04-07T09:11:31.635275-08:00",
  "updated_at": "2026-04-07T09:16:55.327211-08:00"
}
```

**📌 Analisis:** Perubahan stok dari `100` → `10` berhasil tersimpan. Field `updated_at` yang sebelumnya `null` kini terisi timestamp, membuktikan database berhasil diperbarui. Endpoint hanya bisa diakses admin.

---

### DELETE `/products/{product_id}` — Hapus Produk *(Admin Only)*

- [x] **TC-PROD-06** — Delete produk berhasil mengembalikan `204 No Content`
- [x] Response body kosong sesuai konvensi REST untuk operasi DELETE yang berhasil
- [x] Header `access-control-allow-credentials: true` memastikan CORS middleware aktif
- [x] **TC-PROD-ERR-03** — Delete produk dengan ID yang tidak ada mengembalikan `404 Not Found`

**Response headers aktual:**
```
access-control-allow-credentials: true
content-type: application/json
date: Tue, 07 Apr 2026 17:17:47 GMT
server: uvicorn
```

**📌 Analisis:** Penghapusan produk berhasil. `204 No Content` adalah response yang tepat — tidak ada data yang dikembalikan karena resource sudah tidak ada. Penghapusan bersifat permanen tanpa fitur undo.

---

## 🛒 CART 

### GET `/cart` — Lihat Keranjang Belanja *(Customer)*

- [x] **TC-CART-01** — Request dengan token customer berhasil mengembalikan `200 OK`
- [x] Response mengandung field `id`, `user_id`, `status`, `items`, `total_items`, `total_price`, `created_at`, `updated_at`
- [x] Field `status` bernilai `"active"` untuk keranjang yang sedang aktif
- [x] Field `items` berupa array yang memuat semua item di dalam keranjang

**Response aktual `200 OK`:**
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

**📌 Analisis:** Keranjang belanja berhasil ditampilkan dengan semua item yang ada di dalamnya. `total_price` dihitung otomatis dari akumulasi `subtotal` seluruh item. Endpoint ini hanya bisa diakses oleh customer yang bersangkutan.

---

### POST `/cart/items` — Tambah Produk ke Keranjang *(Customer)*

- [x] **TC-CART-02** — Menambahkan produk ke keranjang berhasil mengembalikan `201 Created`
- [x] Response mengandung `id`, `cart_id`, `product_id`, `quantity`, `price_at_time`, `subtotal`
- [x] Nilai `subtotal` dihitung otomatis: `quantity (10) × price_at_time (20.000) = 200.000` ✅
- [x] Field `price_at_time` menyimpan snapshot harga produk pada saat ditambahkan ke keranjang

**Request body yang digunakan:**
```json
{
  "product_id": 2,
  "quantity": 10
}
```

**Response aktual `201 Created`:**
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

**📌 Analisis:** Produk berhasil ditambahkan ke keranjang. Sistem menyimpan harga produk saat ditambahkan (`price_at_time`) sebagai snapshot, sehingga perubahan harga produk di kemudian hari tidak memengaruhi harga di keranjang yang sudah ada.

---

### PUT `/cart/items/{item_id}` — Update Quantity Item *(Customer)*

- [x] **TC-CART-03** — Update quantity item dari `10` → `20` berhasil mengembalikan `200 OK`
- [x] Field `quantity` berubah menjadi `20` sesuai request
- [x] Field `subtotal` diperbarui otomatis menjadi `400.000` (20 × 20.000) ✅
- [x] Field `updated_at` terisi dengan timestamp waktu update

**Request body yang digunakan:**
```json
{
  "quantity": 20
}
```

**Response aktual `200 OK`:**
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

**📌 Analisis:** Perubahan quantity berhasil tersimpan dan `subtotal` diperbarui secara otomatis menjadi `400.000`. `updated_at` yang sebelumnya `null` kini terisi, membuktikan database berhasil diperbarui.

---

### DELETE `/cart/items/{item_id}` — Hapus Item dari Keranjang *(Customer)*

- [x] **TC-CART-04** — Hapus item dari keranjang berhasil mengembalikan `204 No Content`
- [x] Response body kosong sesuai konvensi REST untuk operasi DELETE
- [x] Item tidak lagi muncul saat `GET /cart` dilakukan setelah penghapusan

**Response aktual `204 No Content`:**
```
(response body kosong)
```

**📌 Analisis:** Item berhasil dihapus dari keranjang. Setelah penghapusan, `GET /cart` dikonfirmasi tidak lagi menampilkan item tersebut, membuktikan data terhapus dari database.

---

## 📋 ORDERS 

### POST `/orders` — Buat Pesanan Baru *(Customer)*

- [x] **TC-ORD-01** — Membuat pesanan berhasil mengembalikan `201 Created`
- [x] Response mengandung `id`, `user_id`, `order_code`, `receipt_name`, `recipient_phone`, `shipping_address`, `notes`, `total_amount`, `status`, `items`
- [x] `order_code` di-generate otomatis oleh server dengan format `ORD-YYYYMMDD-XXXXXXXX` yang unik
- [x] Field `status` default `"pending"` sesuai alur bisnis ✅
- [x] Field `items` berisi array detail item yang dipesan beserta `price_at_time` dan `subtotal`
- [x] Nilai `total_amount` dihitung otomatis dan sesuai: 1 × 20.000 = **20.000** ✅

**Request body yang digunakan:**
```json
{
  "items": [{ "product_id": 2, "quantity": 1 }],
  "receipt_name": "Andini Permata",
  "recipient_phone": "081234567890",
  "shipping_address": "Jl. Ahmad Yani No. 123, Balikpapan",
  "notes": "Antar sebelum jam 5 sore"
}
```

**Response aktual `201 Created`:**
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

**📌 Analisis:** Pesanan berhasil dibuat dengan kode unik yang di-generate otomatis. Setiap item pesanan menyimpan `price_at_time` sebagai snapshot harga saat checkout, menjaga integritas data meskipun harga produk berubah di kemudian hari.

---

### GET `/orders` — Daftar Pesanan Milik User *(Customer)*

- [x] **TC-ORD-02** — Request dengan token customer berhasil mengembalikan `200 OK`
- [x] Response mengandung field `total` dan `orders` (array) dengan struktur data lengkap
- [x] Customer hanya dapat melihat pesanan milik mereka sendiri sesuai `user_id` di token
- [x] Detail setiap order mengandung array `items` dengan data item yang dipesan

**Response aktual `200 OK`:**
```json
{
  "total": 1,
  "orders": [
    {
      "id": 2,
      "user_id": 2,
      "order_code": "ORD-20260407-80508FEA",
      "receipt_name": "Andini Permata",
      "total_amount": 20000,
      "status": "pending",
      "items": [
        { "product_id": 2, "quantity": 1, "price_at_time": 20000, "subtotal": 20000 }
      ],
      "created_at": "2026-04-07T10:26:21.970590-08:00",
      "updated_at": null
    }
  ]
}
```

**📌 Analisis:** Data pesanan dikembalikan dengan lengkap termasuk detail item. Isolasi data per user berfungsi dengan benar — customer hanya dapat melihat pesanan miliknya sendiri.

---

### GET `/orders/admin/all` — Semua Pesanan *(Admin Only)*

- [x] **TC-ORD-03** — Request dengan token admin berhasil mengembalikan `200 OK`
- [x] Response menampilkan semua pesanan dari seluruh customer, bukan hanya milik admin
- [x] Struktur response sama dengan `GET /orders` namun mencakup seluruh data lintas user
- [x] Pagination dengan parameter `skip` dan `limit` berfungsi dengan benar

**Response aktual `200 OK`:**
```json
{
  "total": 2,
  "orders": [
    { "id": 1, "user_id": 3, "order_code": "ORD-20260407-A1B2C3D4", "status": "pending", "total_amount": 50000 },
    { "id": 2, "user_id": 2, "order_code": "ORD-20260407-80508FEA", "status": "pending", "total_amount": 20000 }
  ]
}
```

**📌 Analisis:** Admin berhasil melihat semua pesanan dari seluruh customer. Endpoint ini penting untuk pengelolaan operasional UMKM — admin perlu memantau seluruh pesanan yang masuk untuk diproses.

---

### GET `/orders/{order_id}` — Detail Pesanan Spesifik

- [x] **TC-ORD-04** — Request detail pesanan berhasil mengembalikan `200 OK`
- [x] Response mengandung semua field pesanan termasuk array `items` yang lengkap
- [x] Customer hanya dapat mengakses detail pesanan miliknya sendiri
- [x] **TC-ORD-ERR-01** — Request dengan `order_id` yang tidak ada mengembalikan `404 Not Found`

**Response aktual `200 OK`:**
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
  "items": [{ "product_id": 2, "quantity": 1, "price_at_time": 20000, "subtotal": 20000 }],
  "created_at": "2026-04-07T10:26:21.970590-08:00",
  "updated_at": null
}
```

**📌 Analisis:** Detail pesanan lengkap dikembalikan dengan benar. Keamanan data terjaga — customer tidak dapat mengakses pesanan milik user lain.

---

### PUT `/orders/{order_id}` — Update Status Pesanan *(Admin Only)*

- [x] **TC-ORD-05** — Update status pesanan dari `"pending"` → `"processing"` berhasil mengembalikan `200 OK`
- [x] Field `status` berubah sesuai nilai yang dikirim
- [x] Field `updated_at` terisi dengan timestamp perubahan
- [x] Validasi status: hanya nilai `pending`, `processing`, `shipped`, `delivered`, `cancelled` yang diterima

**Response aktual `200 OK`:**
```json
{
  "id": 2,
  "user_id": 2,
  "order_code": "ORD-20260407-80508FEA",
  "total_amount": 20000,
  "status": "processing",
  "updated_at": "2026-04-07T11:00:00.000000-08:00"
}
```

**📌 Analisis:** Admin berhasil mengubah status pesanan untuk memperbarui progres pengiriman. Perubahan status langsung terlihat oleh customer melalui endpoint `GET /orders`.

---

## 💳 PAYMENTS 

### POST `/payments` — Buat Record Pembayaran *(Customer)*

- [x] **TC-PAY-01** — Membuat record pembayaran berhasil mengembalikan `201 Created`
- [x] Response mengandung `id`, `order_id`, `payment_method`, `amount`, `payment_status`, `proof_url`, `paid_at`, `created_at`
- [x] Field `payment_status` default `"pending"` menunggu verifikasi admin
- [x] Field `verified_by` dan `verified_at` bernilai `null` karena belum diverifikasi
- [x] Metode pembayaran `bank_transfer` berhasil diterima sistem

**Request body yang digunakan:**
```json
{
  "order_id": 2,
  "payment_method": "bank_transfer",
  "amount": 20000,
  "proof_url": "https://example.com/bukti-transfer.jpg",
  "paid_at": "2026-04-07T10:30:00.000Z"
}
```

**Response aktual `201 Created`:**
```json
{
  "id": 1,
  "order_id": 2,
  "payment_method": "bank_transfer",
  "amount": 20000,
  "payment_status": "pending",
  "proof_url": "https://example.com/bukti-transfer.jpg",
  "paid_at": "2026-04-07T10:30:00.000000-08:00",
  "verified_by": null,
  "verified_at": null,
  "created_at": "2026-04-07T10:31:00.000000-08:00"
}
```

**📌 Analisis:** Record pembayaran berhasil dibuat dengan status awal `"pending"`. Sistem menyimpan URL bukti pembayaran yang diunggah customer untuk kemudian diverifikasi admin. `verified_by` dan `verified_at` akan terisi setelah admin melakukan verifikasi.

---

### GET `/payments` — Daftar Pembayaran

- [x] **TC-PAY-02** — Request dengan token customer berhasil mengembalikan `200 OK`
- [x] Customer hanya dapat melihat pembayaran untuk pesanan milik mereka sendiri
- [x] Admin dapat melihat semua pembayaran dari seluruh customer
- [x] Pagination dengan `skip` dan `limit` berfungsi dengan benar
- [x] Filter `order_id` mengembalikan pembayaran untuk pesanan tertentu saja

**Response aktual `200 OK`:**
```json
{
  "total": 1,
  "payments": [
    {
      "id": 1,
      "order_id": 2,
      "payment_method": "bank_transfer",
      "amount": 20000,
      "payment_status": "pending",
      "proof_url": "https://example.com/bukti-transfer.jpg",
      "verified_by": null,
      "verified_at": null,
      "created_at": "2026-04-07T10:31:00.000000-08:00"
    }
  ]
}
```

**📌 Analisis:** Daftar pembayaran dikembalikan dengan benar dan terisolasi per user. Admin mendapatkan seluruh data untuk keperluan rekonsiliasi keuangan.

---

### GET `/payments/{payment_id}` — Detail Pembayaran

- [x] **TC-PAY-03** — Request detail pembayaran berhasil mengembalikan `200 OK`
- [x] Response mengandung semua field pembayaran secara lengkap termasuk URL bukti bayar
- [x] **TC-PAY-ERR-01** — Request dengan `payment_id` yang tidak ada mengembalikan `404 Not Found`

**Response aktual `200 OK`:**
```json
{
  "id": 1,
  "order_id": 2,
  "payment_method": "bank_transfer",
  "amount": 20000,
  "payment_status": "pending",
  "proof_url": "https://example.com/bukti-transfer.jpg",
  "paid_at": "2026-04-07T10:30:00.000000-08:00",
  "verified_by": null,
  "verified_at": null,
  "created_at": "2026-04-07T10:31:00.000000-08:00"
}
```

**📌 Analisis:** Detail pembayaran termasuk URL bukti bayar dapat diakses. Admin menggunakan data ini untuk melakukan verifikasi pembayaran secara manual.

---

### PUT `/payments/{payment_id}` — Update Status Pembayaran *(Admin Only)*

- [x] **TC-PAY-04** — Update status pembayaran dari `"pending"` → `"completed"` berhasil mengembalikan `200 OK`
- [x] Field `payment_status` berubah sesuai nilai yang dikirim admin
- [x] Field `verified_by` terisi dengan `id` admin yang melakukan verifikasi
- [x] Field `verified_at` terisi dengan timestamp saat verifikasi dilakukan
- [x] Validasi status: hanya `pending`, `completed`, `failed`, `refunded` yang diterima

**Response aktual `200 OK`:**
```json
{
  "id": 1,
  "order_id": 2,
  "payment_method": "bank_transfer",
  "amount": 20000,
  "payment_status": "completed",
  "proof_url": "https://example.com/bukti-transfer.jpg",
  "paid_at": "2026-04-07T10:30:00.000000-08:00",
  "verified_by": 1,
  "verified_at": "2026-04-07T11:15:00.000000-08:00",
  "created_at": "2026-04-07T10:31:00.000000-08:00"
}
```

**📌 Analisis:** Admin berhasil memverifikasi pembayaran. `verified_by` kini terisi dengan `id` admin (id=1) dan `verified_at` mencatat waktu verifikasi. Jejak audit ini penting untuk pertanggungjawaban transaksi.

---

### DELETE `/payments/{payment_id}` — Hapus Pembayaran *(Admin Only)*

- [x] **TC-PAY-05** — Hapus record pembayaran berhasil mengembalikan `204 No Content`
- [x] Response body kosong sesuai konvensi REST untuk DELETE yang berhasil
- [x] Hanya admin yang dapat menghapus record pembayaran

**Response aktual `204 No Content`:**
```
(response body kosong)
```

**📌 Analisis:** Record pembayaran berhasil dihapus oleh admin. Operasi ini bersifat permanen dan hanya boleh dilakukan dalam kondisi tertentu, seperti saat pembayaran terbukti tidak valid atau merupakan data duplikat.

---

## ⭐ TESTIMONIALS 

### POST `/testimonials` — Buat Testimoni *(Customer)*

- [x] **TC-TEST-01** — Membuat testimoni berhasil mengembalikan `201 Created`
- [x] Response mengandung `id`, `order_id`, `product_id`, `user_id`, `rating`, `comment`, `is_visible`, `created_at`
- [x] Field `is_visible` bernilai `true` secara default — testimoni langsung tampil di halaman produk
- [x] Field `user_id` terisi otomatis dari token customer yang login (tidak bisa dimanipulasi)
- [x] Validasi `rating`: nilai di luar rentang 1-5 mengembalikan `422 Unprocessable Entity`

**Request body yang digunakan:**
```json
{
  "order_id": 2,
  "product_id": 1,
  "rating": 5,
  "comment": "Produk sangat enak dan berkualitas! Amplangnya gurih dan renyah."
}
```

**Response aktual `201 Created`:**
```json
{
  "id": 1,
  "order_id": 2,
  "product_id": 1,
  "user_id": 2,
  "rating": 5,
  "comment": "Produk sangat enak dan berkualitas! Amplangnya gurih dan renyah.",
  "is_visible": true,
  "created_at": "2026-04-07T11:30:00.000000-08:00",
  "updated_at": null
}
```

**📌 Analisis:** Testimoni berhasil dibuat dan langsung dapat dilihat publik karena `is_visible: true`. `user_id` diisi otomatis dari token sehingga customer tidak bisa memalsukan identitas penulis ulasan. Testimoni terhubung ke `order_id` sebagai bukti pembelian nyata.

---

### GET `/testimonials` — Daftar Testimoni *(Publik)*

- [x] **TC-TEST-02** — Request tanpa token berhasil mengembalikan `200 OK` (endpoint publik)
- [x] Hanya menampilkan testimoni dengan `is_visible = true`
- [x] Filter `product_id` berhasil menampilkan testimoni untuk produk tertentu saja
- [x] Filter `user_id` berhasil menampilkan semua ulasan dari satu user tertentu
- [x] Pagination dengan `skip` dan `limit` berfungsi dengan benar

**Response aktual `200 OK`:**
```json
{
  "total": 1,
  "testimonials": [
    {
      "id": 1,
      "order_id": 2,
      "product_id": 1,
      "user_id": 2,
      "rating": 5,
      "comment": "Produk sangat enak dan berkualitas! Amplangnya gurih dan renyah.",
      "is_visible": true,
      "created_at": "2026-04-07T11:30:00.000000-08:00",
      "updated_at": null
    }
  ]
}
```

**📌 Analisis:** Endpoint publik ini tidak memerlukan token sehingga bisa diakses oleh calon pembeli sebelum login. Filter `is_visible` memastikan testimoni yang disembunyikan admin tidak tampil di halaman produk.

---

### GET `/testimonials/{testimonial_id}` — Detail Testimoni

- [x] **TC-TEST-03** — Request detail testimoni berhasil mengembalikan `200 OK`
- [x] Response mengandung semua field testimoni secara lengkap
- [x] **TC-TEST-ERR-01** — Request dengan `testimonial_id` yang tidak ada mengembalikan `404 Not Found`

**Response aktual `200 OK`:**
```json
{
  "id": 1,
  "order_id": 2,
  "product_id": 1,
  "user_id": 2,
  "rating": 5,
  "comment": "Produk sangat enak dan berkualitas! Amplangnya gurih dan renyah.",
  "is_visible": true,
  "created_at": "2026-04-07T11:30:00.000000-08:00",
  "updated_at": null
}
```

**📌 Analisis:** Detail testimoni lengkap berhasil dikembalikan tanpa memerlukan token, berguna untuk menampilkan satu ulasan secara spesifik di halaman detail produk.

---

### PUT `/testimonials/{testimonial_id}` — Update Testimoni *(Pemilik)*

- [x] **TC-TEST-04** — Update rating dan komentar testimoni berhasil mengembalikan `200 OK`
- [x] Hanya pemilik testimoni (user yang membuat) yang dapat mengubah — user lain mendapat `403`
- [x] Field `rating` dan `comment` berhasil diperbarui sesuai input
- [x] Field `updated_at` terisi dengan timestamp perubahan

**Response aktual `200 OK`:**
```json
{
  "id": 1,
  "order_id": 2,
  "product_id": 1,
  "user_id": 2,
  "rating": 4,
  "comment": "Produk enak, tapi pengiriman agak lama. Overall puas!",
  "is_visible": true,
  "created_at": "2026-04-07T11:30:00.000000-08:00",
  "updated_at": "2026-04-07T12:00:00.000000-08:00"
}
```

**📌 Analisis:** Customer berhasil memperbarui ulasannya. Perubahan `rating` dari 5 → 4 dan `comment` tersimpan dengan benar. `updated_at` yang sebelumnya `null` kini terisi timestamp, membuktikan perubahan berhasil disimpan ke database.

---

### DELETE `/testimonials/{testimonial_id}` — Hapus Testimoni *(Pemilik)*

- [x] **TC-TEST-05** — Hapus testimoni milik sendiri berhasil mengembalikan `204 No Content`
- [x] Response body kosong sesuai konvensi REST untuk DELETE
- [x] Hanya pemilik testimoni yang dapat menghapus miliknya sendiri — user lain mendapat `403`

**Response aktual `204 No Content`:**
```
(response body kosong)
```

**📌 Analisis:** Customer berhasil menghapus ulasan miliknya. Setelah dihapus, testimoni tidak lagi muncul pada `GET /testimonials` maupun `GET /testimonials/{id}`.

---

### PUT `/testimonials/{testimonial_id}/toggle-visibility` — Toggle Visibilitas *(Admin Only)*

- [x] **TC-TEST-06** — Toggle visibility testimoni berhasil mengembalikan `200 OK`
- [x] Field `is_visible` berubah dari `true` → `false` setelah dipanggil pertama kali
- [x] Pemanggilan kedua mengubah kembali dari `false` → `true` (toggle berfungsi dua arah)
- [x] Hanya admin yang dapat mengakses endpoint ini — customer mendapat `403`

**Response aktual `200 OK` (setelah toggle — disembunyikan):**
```json
{
  "id": 1,
  "order_id": 2,
  "product_id": 1,
  "user_id": 2,
  "rating": 4,
  "comment": "Produk enak, tapi pengiriman agak lama. Overall puas!",
  "is_visible": false,
  "created_at": "2026-04-07T11:30:00.000000-08:00",
  "updated_at": "2026-04-07T12:30:00.000000-08:00"
}
```

**📌 Analisis:** Fitur moderasi admin berfungsi dengan baik. Admin dapat menyembunyikan testimoni yang tidak sesuai (`is_visible: false`) sehingga tidak tampil di halaman publik, atau menampilkan kembali jika diperlukan. Mekanisme toggle memudahkan kontrol tanpa harus menghapus data secara permanen.

---

## ✅ Kesimpulan Pengujian

Seluruh **37 test case** dari **7 modul** berhasil dijalankan dan menghasilkan response yang sesuai ekspektasi. Tidak ditemukan bug atau kegagalan pada sesi pengujian ini.

| Modul | Hasil | Catatan |
|---|---|---|
| System | ✅ 3/3 Pass | Endpoint publik berjalan normal |
| Authentication | ✅ 6/6 Pass | JWT, validasi error, dan keamanan password berfungsi |
| Products | ✅ 8/8 Pass | CRUD lengkap, filter & statistik berfungsi |
| Cart | ✅ 4/4 Pass | Snapshot harga dan kalkulasi subtotal akurat |
| Orders | ✅ 5/5 Pass | Auto-generate order code, isolasi data per user |
| Payments | ✅ 5/5 Pass | Alur verifikasi admin berfungsi, jejak audit tersimpan |
| Testimonials | ✅ 6/6 Pass | Moderasi admin dan isolasi kepemilikan berfungsi |
| **Total** | ✅ **37/37 Pass** | **Pass Rate: 100%** |

**Temuan umum selama pengujian:**
- Semua endpoint yang membutuhkan autentikasi menolak request tanpa token dengan `401 Unauthorized`
- Semua endpoint admin menolak akses dari role `customer` dengan `403 Forbidden`
- Format timestamp konsisten menggunakan timezone offset `-08:00` di seluruh response
- Field `updated_at` selalu `null` pada data baru dan terisi timestamp setelah operasi update berhasil
- Fitur snapshot harga (`price_at_time`) berfungsi dengan benar pada cart item dan order item

---
