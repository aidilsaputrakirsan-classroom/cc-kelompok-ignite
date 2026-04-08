# ☁️ Cloud App - [ATHSNACK— UMKM E-Commerce Platform]

## 📌 Deskripsi Proyek

ATHSNACK (E-Commerce UMKM RAZ'Q) adalah platform e-commerce berbasis website yang dirancang untuk mendigitalisasikan proses bisnis UMKM RAZ'Q Balikpapan. UMKM ini memproduksi makanan khas Balikpapan seperti Amplang, keripik pisang, abon, dan camilan lainnya. Aplikasi ini mengatasi kendala pemasaran dan visibilitas usaha, serta mempermudah pengelolaan transaksi dan stok produk yang sebelumnya menghadapi tantangan kompleksitas pada aplikasi pihak ketiga.

## 📖 Daftar Isi
- [☁️ Cloud App - \[ATHSNACK— UMKM E-Commerce Platform\]](#️-cloud-app---athsnack-umkm-e-commerce-platform)
  - [📌 Deskripsi Proyek](#-deskripsi-proyek)
  - [📖 Daftar Isi](#-daftar-isi)
  - [Fitur Utama](#fitur-utama)
    - [🛒 Manajemen Produk \& Katalog](#-manajemen-produk--katalog)
    - [🧺 Keranjang Belanja](#-keranjang-belanja)
    - [📦 Manajemen Pesanan](#-manajemen-pesanan)
    - [💳 Pembayaran](#-pembayaran)
    - [⭐ Testimoni \& Ulasan](#-testimoni--ulasan)
    - [🔐 Sistem \& Keamanan](#-sistem--keamanan)
    - [Fitur Berdasarkan Role](#fitur-berdasarkan-role)
  - [👥 Tim](#-tim)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
  - [🚀 Getting Started](#-getting-started)
    - [Prasyarat](#prasyarat)
  - [🚀 Cara Menjalankan](#-cara-menjalankan)
    - [1. Clone repository](#1-clone-repository)
    - [2. Jalankan Backend](#2-jalankan-backend)
    - [3. Jalankan Frontend](#3-jalankan-frontend)
    - [4. Verifikasi](#4-verifikasi)
  - [📁 Struktur Proyek](#-struktur-proyek)
  - [📚 Dasar Teori](#-dasar-teori)
    - [1. API (Application Programming Interface)](#1-api-application-programming-interface)
    - [2. REST (Representational State Transfer)](#2-rest-representational-state-transfer)
    - [3. HTTP Methods \& CRUD](#3-http-methods--crud)
    - [4. HTTP Status Codes](#4-http-status-codes)
    - [5. Database Relasional \& PostgreSQL](#5-database-relasional--postgresql)
    - [6. ORM — SQLAlchemy](#6-orm--sqlalchemy)
    - [7. Pydantic — Validasi Data](#7-pydantic--validasi-data)
    - [8. FastAPI](#8-fastapi)
    - [9. Arsitektur Aplikasi](#9-arsitektur-aplikasi)
  - [🏗️ Panduan Membangun REST API](#️-panduan-membangun-rest-api)
  - [📚 Dasar Teori](#-dasar-teori-1)
    - [1. API (Application Programming Interface)](#1-api-application-programming-interface-1)
    - [2. REST (Representational State Transfer)](#2-rest-representational-state-transfer-1)
    - [3. HTTP Methods \& CRUD](#3-http-methods--crud-1)
    - [4. HTTP Status Codes](#4-http-status-codes-1)
    - [5. Database Relasional \& PostgreSQL](#5-database-relasional--postgresql-1)
    - [6. ORM — SQLAlchemy](#6-orm--sqlalchemy-1)
    - [7. Pydantic — Validasi Data](#7-pydantic--validasi-data-1)
    - [8. FastAPI](#8-fastapi-1)
    - [9. Arsitektur Aplikasi](#9-arsitektur-aplikasi-1)
  - [📡 Dokumentasi API](#-dokumentasi-api)
    - [Base URL](#base-url)
  - [📊 Ringkasan Endpoint](#-ringkasan-endpoint)
  - [🚀 Cara Menjalankan](#-cara-menjalankan-1)
    - [1. Clone repository](#1-clone-repository-1)
    - [2. Setup environment](#2-setup-environment)
    - [3. Install dependencies \& jalankan server](#3-install-dependencies--jalankan-server)
  - [🏗️ Panduan Membangun Frontend React](#️-panduan-membangun-frontend-react)
  - [📚 Dasar Teori](#-dasar-teori-2)
    - [1. React](#1-react)
    - [2. Props dan State](#2-props-dan-state)
    - [3. Fetch API](#3-fetch-api)
    - [4. Separation of Concerns pada Frontend](#4-separation-of-concerns-pada-frontend)
  - [✅ Fitur UI yang Dibangun](#-fitur-ui-yang-dibangun)
  - [📊 Daftar Endpoint API](#-daftar-endpoint-api)
    - [Endpoint Autentikasi (Publik)](#endpoint-autentikasi-publik)
    - [Endpoint Item (Membutuhkan Token)](#endpoint-item-membutuhkan-token)
    - [Endpoint Lainnya (Publik)](#endpoint-lainnya-publik)
    - [Kode Status yang Digunakan](#kode-status-yang-digunakan)
    - [Alur Autentikasi](#alur-autentikasi)
    - [Contoh Response Login](#contoh-response-login)
  - [📂 Dokumentasi](#-dokumentasi)
    - [Ringkasan Hasil Pengujian](#ringkasan-hasil-pengujian)
  - [📅 Roadmap](#-roadmap)
---
## Fitur Utama
 
### 🛒 Manajemen Produk & Katalog
- ✅ **Katalog Produk** — Daftar produk lengkap dengan gambar, harga, kategori, dan stok real-time
- ✅ **Filter & Pencarian** — Cari produk berdasarkan nama, deskripsi, atau kategori
- ✅ **Statistik Inventori** — Dashboard admin dengan total produk, total nilai stok, dan breakdown per kategori
- ✅ **CRUD Produk** — Admin dapat menambah, mengubah, dan menghapus produk
 
### 🧺 Keranjang Belanja
- ✅ **Keranjang Aktif** — Setiap pelanggan memiliki keranjang belanja yang persisten
- ✅ **Snapshot Harga** — Harga produk saat ditambahkan ke keranjang tersimpan otomatis
- ✅ **Update Quantity** — Ubah jumlah item tanpa menghapus dari keranjang
 
### 📦 Manajemen Pesanan
- ✅ **Pemesanan Online** — Buat pesanan langsung dari aplikasi dengan kode order unik
- ✅ **Riwayat Pesanan** — Pelanggan dapat melihat semua pesanan mereka
- ✅ **Manajemen Status** — Admin dapat mengubah status pesanan dari `pending` hingga `delivered`
- ✅ **Dashboard Admin** — Admin dapat melihat semua pesanan dari seluruh pelanggan
 
### 💳 Pembayaran
- ✅ **Multi-Metode** — Mendukung `credit_card`, `bank_transfer`, `e_wallet`, `cash`
- ✅ **Upload Bukti** — Pelanggan dapat mengunggah URL bukti pembayaran
- ✅ **Verifikasi Admin** — Admin memverifikasi pembayaran dan mengubah status
- ✅ **Riwayat Pembayaran** — Tersedia untuk pelanggan dan admin
 
### ⭐ Testimoni & Ulasan
- ✅ **Rating & Komentar** — Pelanggan dapat memberikan rating bintang 1-5 dan komentar
- ✅ **Verifikasi Pembelian** — Testimoni terhubung ke order untuk membuktikan pembelian nyata
- ✅ **Moderasi Admin** — Admin dapat menyembunyikan/menampilkan testimoni
- ✅ **Filter Publik** — Hanya testimoni yang `is_visible = true` yang tampil ke publik
 
### 🔐 Sistem & Keamanan
- ✅ **JWT Authentication** — Login & registrasi dengan token berbatas waktu (60 menit)
- ✅ **Role-Based Access** — Pembatasan akses berdasarkan role `customer` dan `admin`
- ✅ **Password Hashing** — Password disimpan sebagai hash bcrypt, tidak pernah plain-text
 
---

### Fitur Berdasarkan Role  
**Pelanggan**
- ✅ Melihat profil, kontak, dan katalog produk UMKM
- ✅ Melakukan registrasi akun dan login ke sistem
- ✅ Menambahkan barang ke keranjang dan melakukan pemesanan produk
- ✅ Melakukan pembayaran via QRIS dan mengunggah bukti transaksi
- ✅ Menambahkan testimoni atau ulasan produk

**Admin**
- ✅ Login ke Dashboard admin dengan hak akses kontrol penuh
- ✅ Mengelola data akun admin dan melihat data pelanggan
- ✅ Menambah, mengubah, dan menghapus produk di katalog
- ✅ Memantau stok barang dan mendapatkan notifikasi jika stok hampir habis
- ✅ Memverifikasi pembayaran dan mengubah status pembelian pelanggan

---

## 👥 Tim

| Nama | NIM | Peran |
|------|-----|-------|
| Andini Permata Dewanti | 10231014 | Lead Backend |
| Putri Rahmawati | 10231074 | Lead Frontend |
| Krishandy Dhanysa Pratama | 10231050 | Lead DevOps |
| Desnita Dwi Putri | 10231030 | Lead QA & Docs |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi | Penjelasan |
|---|---|---|
| **FastAPI** | Backend REST API | Framework Python berbasis asynchronous untuk membangun REST API dengan performa tinggi dan dokumentasi otomatis via Swagger UI. |
| **Uvicorn** | Server | ASGI server untuk menjalankan FastAPI. |
| **SQLAlchemy** | ORM | Menerjemahkan Python object ke SQL dan sebaliknya, sehingga tidak perlu menulis query SQL secara manual. |
| **Pydantic v2** | Validasi Data | Memvalidasi format data request dan response serta mendefinisikan schema API. |
| **python-jose** | JWT | Membuat dan memverifikasi JWT token untuk sistem autentikasi. |
| **passlib + bcrypt** | Keamanan Password | Mengubah password menjadi hash bcrypt sebelum disimpan ke database, sehingga password asli tidak pernah tersimpan. |
| **python-dotenv** | Konfigurasi | Membaca variabel sensitif (password, secret key) dari file `.env` agar tidak ter-commit ke Git. |
| **React 18** | Frontend | Library JavaScript untuk membangun antarmuka pengguna berbasis komponen yang responsif dan modular. |
| **Vite** | Build Tool | Development server dan build tool untuk frontend React dengan hot-reload cepat. Berjalan di port 5173. |
| **Fetch API** | HTTP Client | API bawaan JavaScript untuk mengirim request HTTP (GET/POST/PUT/DELETE) dari frontend ke backend. |
| **PostgreSQL** | Database | Sistem manajemen basis data relasional untuk menyimpan data user dan item inventori secara terstruktur. |
| **Docker** | Containerization | Mengemas aplikasi beserta seluruh dependensinya ke dalam container agar environment berjalan konsisten di berbagai sistem. |
| **GitHub Actions** | CI/CD | Mengotomatisasi proses build, testing, dan deployment setiap ada perubahan yang di-push ke repository. |
| **Railway / Render** | Cloud Deployment | Platform cloud untuk hosting backend dan database agar aplikasi dapat diakses secara online. |
 

---
 
## 🏗️ Arsitektur Sistem
 
Proyek ini menggunakan arsitektur **three-tier** yang memisahkan tampilan, logika bisnis, dan penyimpanan data secara bersih.
 
```
┌─────────────────────┐        HTTP/JSON        ┌──────────────────────┐        SQL        ┌─────────────────────┐
│                     │  ──── GET /items ──►  │                      │  ── SELECT * ──►  │                     │
│   React Frontend    │                        │   FastAPI Backend    │                   │     PostgreSQL       │
│   (Vite :5173)      │  ◄─── JSON Response ── │   (Uvicorn :8000)   │  ◄── Rows/Data ── │   (DB: cloudapp)    │
│                     │                        │                      │                   │                     │
└─────────────────────┘                        └──────────────────────┘                   └─────────────────────┘
       Browser                                        Server                                    Database
```
 
**Alur data saat client melakukan request:**
 
```
Browser / Postman
      │
      │  HTTP Request (GET /items)
      ▼
main.py  ──►  schemas.py  ──►  crud.py  ──►  models.py  ──►  database.py  ──►  PostgreSQL
  Router         Validasi        Logika         ORM Model        Koneksi           Data
      │
      │  HTTP Response (JSON)
      ▼
Browser / Postman
```
 
> 📌 Diagram ini akan berkembang setiap minggu — mulai dari monolith sederhana hingga arsitektur microservices di fase akhir (Minggu 12–14).
 
**Alur data di sisi Frontend:**
 
```
User Action (klik/isi form)
      │
      ▼
App.jsx  ──►  services/api.js  ──►  HTTP Request  ──►  FastAPI Backend
 State          fetch() wrapper       GET/POST/PUT/DELETE    (port 8000)
      │
      │  Response JSON
      ▼
setItems() / setTotalItems()  ──►  Re-render komponen  ──►  UI terupdate
```
 
**Komponen Tree Frontend (dengan autentikasi):**
```
App (state: items, editingItem, searchQuery, user, isAuthenticated)
 ├── [jika belum login]
 │    └── LoginPage   (props: onLogin, onRegister)
 │
 └── [jika sudah login]
      ├── Header      (props: totalItems, isConnected, user, onLogout)
      ├── ItemForm    (props: onSubmit, editingItem, onCancelEdit)
      ├── SearchBar   (props: onSearch)
      └── ItemList    (props: items, onEdit, onDelete, loading)
           └── ItemCard (props: item, onEdit, onDelete)
```
 
---

## 🚀 Getting Started

### Prasyarat
- **Python 3.10+**: Diperlukan untuk menjalankan modul FastAPI dan asynchronous logic.
- **Node.js 18+**: Diperlukan untuk kompilasi aset React dan manajemen package (NPM).
- **Git**: Untuk manajemen versi dan kolaborasi antar anggota tim.

## 🚀 Cara Menjalankan
 
> ⚠️ **Perlu 2 terminal berjalan bersamaan** — satu untuk backend, satu untuk frontend.
 
### 1. Clone repository
 
```bash
git clone https://github.com/aidilsaputrakirsan-classroom/cloud-team-XX.git
cd cloud-team-XX
```
 
### 2. Jalankan Backend
 
```bash
cd backend
cp .env.example .env
# Edit .env — isi password PostgreSQL Anda
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
 
Backend tersedia di `http://localhost:8000`  
Dokumentasi API (Swagger UI): `http://localhost:8000/docs`
 
### 3. Jalankan Frontend
 
Buka terminal **baru** (jangan tutup terminal backend):
 
```bash
cd frontend
cp .env.example .env
# Pastikan VITE_API_URL=http://localhost:8000
npm install
npm run dev
```
 
Frontend tersedia di `http://localhost:5173`
 
### 4. Verifikasi
 
Buka `http://localhost:5173` — halaman **Login** akan tampil. Lakukan registrasi akun baru, kemudian login untuk mengakses aplikasi.
 
---

## 📁 Struktur Proyek

```
cloud-team-ignite/
├── backend/
│   ├── main.py                    ← Entry point, router, CORS, semua endpoint
│   ├── auth.py                    ← JWT utilities: buat token, verifikasi, hash password
│   ├── database.py                ← Koneksi PostgreSQL via SQLAlchemy
│   ├── models.py                  ← SQLAlchemy models: tabel items & users
│   ├── schemas.py                 ← Pydantic schemas: validasi request/response + auth
│   ├── crud.py                    ← Fungsi CRUD items & user (create, authenticate)
│   ├── requirements.txt           ← Daftar dependencies Python
│   ├── .env                       ← ⛔ RAHASIA — berisi password & secret, jangan di-commit!
│   └── .env.example               ← ✅ Template konfigurasi — ini yang di-commit
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ← Root component, state management CRUD
│   │   ├── App.css                ← Global styling & CSS reset
│   │   ├── main.jsx               ← Entry point React
│   │   ├── components/
│   │   │   ├── Header.jsx         ← Judul, badge total item, info user & tombol Logout
│   │   │   ├── LoginPage.jsx      ← Halaman login & register dengan tab switch
│   │   │   ├── SearchBar.jsx      ← Input pencarian dengan clear button
│   │   │   ├── ItemForm.jsx       ← Form create/edit item dengan validasi
│   │   │   ├── ItemList.jsx       ← Grid container daftar item + empty state
│   │   │   └── ItemCard.jsx       ← Card per item + tombol Edit & Hapus
│   │   └── services/
│   │       └── api.js             ← Semua fungsi fetch ke backend API
│   ├── .env                       ← ⛔ RAHASIA — berisi VITE_API_URL
│   ├── .env.example               ← ✅ Template konfigurasi frontend
│   ├── index.html
│   ├── package.json               ← Dependencies & scripts Node.js
│   └── vite.config.js             ← Konfigurasi Vite bundler
├── backend/
│   ├── Dockerfile                 ← Konfigurasi Docker image backend
│   ├── .dockerignore              ← Daftar file yang tidak masuk ke Docker image
│   └── ...
├── docs/
│   ├── api-test-results.md        ← (Lead QA & Docs) Dokumentasi hasil testing endpoint API
│   ├── ui-test-results.md         ← (Lead QA & Docs) Dokumentasi hasil testing UI React
│   ├── auth-test-results.md       ← (Lead QA & Docs) Dokumentasi hasil testing autentikasi JWT
│   ├── image-comparison.md        ← (Lead QA & Docs) Perbandingan ukuran Docker image
│   ├── docker-cheatsheet.md       ← (Lead Frontend) Referensi perintah Docker
│   ├── database-schema.md         ← (Lead DevOps) Skema tabel database PostgreSQL
│   └── member-[NAMA].md           ← File verifikasi masing-masing anggota
├── .gitignore                     ← Daftar file yang tidak di-commit (termasuk .env)
└── README.md                      ← Dokumentasi proyek (file ini)
```

---

## 📚 Dasar Teori

Sebelum memulai implementasi, penting untuk memahami konsep-konsep dasar yang menjadi fondasi dari proyek ini.

---

### 1. API (Application Programming Interface)

**API** adalah "kontrak" atau antarmuka yang mendefinisikan bagaimana dua perangkat lunak berkomunikasi satu sama lain. Dalam konteks web, API memungkinkan frontend (browser/aplikasi mobile) berbicara dengan backend (server) melalui protokol HTTP.

> 💡 **Analogi:** API seperti **pelayan di restoran**. Kamu (frontend/client) memesan makanan lewat pelayan (API), pelayan menyampaikan pesanan ke dapur (backend/server), lalu membawa makanan (response) kembali ke mejamu. Kamu tidak perlu tahu cara memasak — cukup tahu cara memesan.

---

### 2. REST (Representational State Transfer)

**REST** adalah gaya arsitektur desain API yang menggunakan HTTP sebagai protokol komunikasi. REST mengorganisasi data sebagai *resources* yang bisa diakses melalui URL yang konsisten dan mudah diprediksi.

**Prinsip utama REST:**

| Prinsip | Penjelasan |
|---|---|
| **Client-Server** | Frontend dan backend dipisahkan dan dapat dikembangkan secara independen |
| **Stateless** | Setiap request berdiri sendiri — server tidak menyimpan informasi tentang request sebelumnya |
| **Uniform Interface** | URL yang konsisten dan dapat diprediksi untuk setiap resource |
| **Resource-Based** | Setiap "hal" (item, user, order) adalah sebuah resource dengan URL uniknya sendiri |

---

### 3. HTTP Methods & CRUD

REST API menggunakan **HTTP Methods** untuk mendefinisikan jenis operasi yang dilakukan pada sebuah resource. Setiap method berkorespondensi dengan satu operasi **CRUD**:

| HTTP Method | Operasi CRUD | Contoh Endpoint | Deskripsi |
|---|---|---|---|
| `GET` | **R**ead | `GET /items` | Ambil semua items |
| `GET` | **R**ead | `GET /items/1` | Ambil item dengan id=1 |
| `POST` | **C**reate | `POST /items` | Buat item baru |
| `PUT` | **U**pdate | `PUT /items/1` | Update seluruh data item id=1 |
| `DELETE` | **D**elete | `DELETE /items/1` | Hapus item id=1 |

---

### 4. HTTP Status Codes

Server selalu mengembalikan **status code** di setiap response untuk memberitahu client apakah request berhasil atau gagal dan mengapa.

| Kode | Nama | Kapan Digunakan |
|---|---|---|
| `200` | OK | Request berhasil (GET, PUT) |
| `201` | Created | Resource baru berhasil dibuat (POST) |
| `204` | No Content | Berhasil tetapi tidak ada data dikembalikan (DELETE) |
| `400` | Bad Request | Data yang dikirim tidak valid |
| `404` | Not Found | Resource tidak ditemukan di server |
| `422` | Unprocessable Entity | Validasi gagal — format data salah (default FastAPI) |
| `500` | Internal Server Error | Terjadi kesalahan di sisi server |

---

### 5. Database Relasional & PostgreSQL

**Database relasional** menyimpan data dalam bentuk **tabel** yang saling terhubung satu sama lain — mirip seperti spreadsheet Excel, tetapi jauh lebih powerful dan handal.

**PostgreSQL** dipilih dalam proyek ini karena:
- Open-source dan gratis
- Sangat *reliable* dan sudah terbukti di lingkungan produksi
- Mendukung tipe data yang kaya (JSON, Array, UUID, dll.)
- Didukung oleh hampir semua cloud provider (Railway, Render, AWS RDS, Supabase)
- Cocok untuk arsitektur microservices di fase selanjutnya
---

### 6. ORM — SQLAlchemy

**ORM (Object-Relational Mapping)** adalah teknik yang memungkinkan kita berinteraksi dengan database menggunakan objek Python, tanpa harus menulis SQL secara manual.

**Perbandingan tanpa ORM vs dengan ORM:**

| Tanpa ORM (Raw SQL) | Dengan ORM (SQLAlchemy) |
|---|---|
| `cursor.execute("INSERT INTO items (name, price) VALUES (%s, %s)", ("Laptop", 15000000))` | `db.add(Item(name="Laptop", price=15000000))` |
| Harus menulis SQL manual | Menggunakan Python object — lebih intuitif |
| Rentan SQL Injection jika tidak hati-hati | Aman dari SQL Injection secara default |
| Tidak portable antar database | Bisa pindah database tanpa mengubah kode |

**Cara kerja SQLAlchemy:**
```
Python Object  →  SQLAlchemy ORM  →  SQL Query  →  PostgreSQL
Item(name="Laptop")  →  translasi otomatis  →  INSERT INTO items...  →  data tersimpan
```

---

### 7. Pydantic — Validasi Data

**Pydantic** adalah library validasi data Python yang digunakan FastAPI sebagai *schema* untuk:
- Memvalidasi data yang masuk dari client (request body)
- Mendefinisikan format data yang dikembalikan ke client (response)
- Auto-generate dokumentasi API di Swagger UI

Contoh: jika client mengirim `price: -500` atau `price: "lima ratus"`, Pydantic langsung menolak dan mengembalikan `422 Unprocessable Entity` dengan pesan error yang jelas — sebelum request bahkan sampai ke database.

---

### 8. FastAPI

**FastAPI** adalah framework Python modern untuk membangun REST API dengan cepat dan mudah. Keunggulannya:

| Fitur | Keterangan |
|---|---|
| **Kecepatan** | Salah satu framework Python tercepat (setara NodeJS & Go) |
| **Auto-dokumentasi** | Swagger UI (`/docs`) dan ReDoc (`/redoc`) otomatis ter-generate |
| **Validasi otomatis** | Terintegrasi dengan Pydantic untuk validasi request/response |
| **Dependency Injection** | Sistem `Depends()` yang elegan untuk koneksi database, auth, dll. |
| **Type hints** | Memanfaatkan type hints Python untuk validasi dan dokumentasi |

---

### 9. Arsitektur Aplikasi

Proyek ini menggunakan pola **Separation of Concerns** — setiap file punya satu tanggung jawab yang spesifik:

```
Request dari client
       ↓
main.py          ← Menerima request, menentukan endpoint yang dipanggil
       ↓
schemas.py       ← Memvalidasi data request (Pydantic)
       ↓
crud.py          ← Menjalankan logika bisnis (CRUD operations)
       ↓
models.py        ← Mendefinisikan struktur tabel (SQLAlchemy)
       ↓
database.py      ← Mengelola koneksi ke PostgreSQL
       ↓
PostgreSQL       ← Menyimpan & mengambil data
       ↑
(alur balik: data dikembalikan ke client sebagai JSON)
```

> 💡 **Kenapa dipisah jadi banyak file?** Ketika proyek berkembang menjadi microservices (fase Minggu 12–14), struktur ini membuat kode lebih mudah dibaca, di-test, dan di-maintain oleh seluruh anggota tim.

---

## 🏗️ Panduan Membangun REST API

## 📚 Dasar Teori

Sebelum memulai implementasi, penting untuk memahami konsep-konsep dasar yang menjadi fondasi dari proyek ini.

---

### 1. API (Application Programming Interface)

**API** adalah "kontrak" atau antarmuka yang mendefinisikan bagaimana dua perangkat lunak berkomunikasi satu sama lain. Dalam konteks web, API memungkinkan frontend (browser/aplikasi mobile) berbicara dengan backend (server) melalui protokol HTTP.

> 💡 **Analogi:** API seperti **pelayan di restoran**. Kamu (frontend/client) memesan makanan lewat pelayan (API), pelayan menyampaikan pesanan ke dapur (backend/server), lalu membawa makanan (response) kembali ke mejamu. Kamu tidak perlu tahu cara memasak — cukup tahu cara memesan.

---

### 2. REST (Representational State Transfer)

**REST** adalah gaya arsitektur desain API yang menggunakan HTTP sebagai protokol komunikasi. REST mengorganisasi data sebagai *resources* yang bisa diakses melalui URL yang konsisten dan mudah diprediksi.

**Prinsip utama REST:**

| Prinsip | Penjelasan |
|---|---|
| **Client-Server** | Frontend dan backend dipisahkan dan dapat dikembangkan secara independen |
| **Stateless** | Setiap request berdiri sendiri — server tidak menyimpan informasi tentang request sebelumnya |
| **Uniform Interface** | URL yang konsisten dan dapat diprediksi untuk setiap resource |
| **Resource-Based** | Setiap "hal" (item, user, order) adalah sebuah resource dengan URL uniknya sendiri |

---

### 3. HTTP Methods & CRUD

REST API menggunakan **HTTP Methods** untuk mendefinisikan jenis operasi yang dilakukan pada sebuah resource. Setiap method berkorespondensi dengan satu operasi **CRUD**:

| HTTP Method | Operasi CRUD | Contoh Endpoint | Deskripsi |
|---|---|---|---|
| `GET` | **R**ead | `GET /items` | Ambil semua items |
| `GET` | **R**ead | `GET /items/1` | Ambil item dengan id=1 |
| `POST` | **C**reate | `POST /items` | Buat item baru |
| `PUT` | **U**pdate | `PUT /items/1` | Update seluruh data item id=1 |
| `DELETE` | **D**elete | `DELETE /items/1` | Hapus item id=1 |

---

### 4. HTTP Status Codes

Server selalu mengembalikan **status code** di setiap response untuk memberitahu client apakah request berhasil atau gagal dan mengapa.

| Kode | Nama | Kapan Digunakan |
|---|---|---|
| `200` | OK | Request berhasil (GET, PUT) |
| `201` | Created | Resource baru berhasil dibuat (POST) |
| `204` | No Content | Berhasil tetapi tidak ada data dikembalikan (DELETE) |
| `400` | Bad Request | Data yang dikirim tidak valid |
| `404` | Not Found | Resource tidak ditemukan di server |
| `422` | Unprocessable Entity | Validasi gagal — format data salah (default FastAPI) |
| `500` | Internal Server Error | Terjadi kesalahan di sisi server |

---

### 5. Database Relasional & PostgreSQL

**Database relasional** menyimpan data dalam bentuk **tabel** yang saling terhubung satu sama lain — mirip seperti spreadsheet Excel, tetapi jauh lebih powerful dan handal.

**PostgreSQL** dipilih dalam proyek ini karena:
- Open-source dan gratis
- Sangat *reliable* dan sudah terbukti di lingkungan produksi
- Mendukung tipe data yang kaya (JSON, Array, UUID, dll.)
- Didukung oleh hampir semua cloud provider (Railway, Render, AWS RDS, Supabase)
- Cocok untuk arsitektur microservices di fase selanjutnya
---

### 6. ORM — SQLAlchemy

**ORM (Object-Relational Mapping)** adalah teknik yang memungkinkan kita berinteraksi dengan database menggunakan objek Python, tanpa harus menulis SQL secara manual.

**Perbandingan tanpa ORM vs dengan ORM:**

| Tanpa ORM (Raw SQL) | Dengan ORM (SQLAlchemy) |
|---|---|
| `cursor.execute("INSERT INTO items (name, price) VALUES (%s, %s)", ("Laptop", 15000000))` | `db.add(Item(name="Laptop", price=15000000))` |
| Harus menulis SQL manual | Menggunakan Python object — lebih intuitif |
| Rentan SQL Injection jika tidak hati-hati | Aman dari SQL Injection secara default |
| Tidak portable antar database | Bisa pindah database tanpa mengubah kode |

**Cara kerja SQLAlchemy:**
```
Python Object  →  SQLAlchemy ORM  →  SQL Query  →  PostgreSQL
Item(name="Laptop")  →  translasi otomatis  →  INSERT INTO items...  →  data tersimpan
```

---

### 7. Pydantic — Validasi Data

**Pydantic** adalah library validasi data Python yang digunakan FastAPI sebagai *schema* untuk:
- Memvalidasi data yang masuk dari client (request body)
- Mendefinisikan format data yang dikembalikan ke client (response)
- Auto-generate dokumentasi API di Swagger UI

Contoh: jika client mengirim `price: -500` atau `price: "lima ratus"`, Pydantic langsung menolak dan mengembalikan `422 Unprocessable Entity` dengan pesan error yang jelas — sebelum request bahkan sampai ke database.

---

### 8. FastAPI

**FastAPI** adalah framework Python modern untuk membangun REST API dengan cepat dan mudah. Keunggulannya:

| Fitur | Keterangan |
|---|---|
| **Kecepatan** | Salah satu framework Python tercepat (setara NodeJS & Go) |
| **Auto-dokumentasi** | Swagger UI (`/docs`) dan ReDoc (`/redoc`) otomatis ter-generate |
| **Validasi otomatis** | Terintegrasi dengan Pydantic untuk validasi request/response |
| **Dependency Injection** | Sistem `Depends()` yang elegan untuk koneksi database, auth, dll. |
| **Type hints** | Memanfaatkan type hints Python untuk validasi dan dokumentasi |

---

### 9. Arsitektur Aplikasi
Proyek ini menggunakan pola **Separation of Concerns** — setiap file punya satu tanggung jawab yang spesifik:
 
```
Request dari client
       ↓
main.py          ← Menerima request, menentukan endpoint yang dipanggil
       ↓
schemas.py       ← Memvalidasi data request (Pydantic)
       ↓
crud.py          ← Menjalankan logika bisnis (CRUD operations)
       ↓
models.py        ← Mendefinisikan struktur tabel (SQLAlchemy)
       ↓
database.py      ← Mengelola koneksi ke PostgreSQL
       ↓
PostgreSQL       ← Menyimpan & mengambil data
       ↑
(alur balik: data dikembalikan ke client sebagai JSON)
```
 
> 💡 **Kenapa dipisah jadi banyak file?** Ketika proyek berkembang menjadi microservices (fase Minggu 12–14), struktur ini membuat kode lebih mudah dibaca, di-test, dan di-maintain oleh seluruh anggota tim.
 
---

## 📡 Dokumentasi API

### Base URL

```
http://localhost:8000
```
## 📊 Ringkasan Endpoint

| Method | Endpoint | Deskripsi | Status Sukses | Status Error |
|--------|----------|-----------|---------------|--------------|
| `GET` | `/health` | Health check server | `200` | — |
| `POST` | `/items` | Buat item baru | `201` | `422` |
| `GET` | `/items` | Ambil semua item (+ pagination & search) | `200` | — |
| `GET` | `/items/stats` | Statistik inventori | `200` | — |
| `GET` | `/items/{id}` | Ambil item by ID | `200` | `404` |
| `PUT` | `/items/{id}` | Update item (partial) | `200` | `404`, `422` |
| `DELETE` | `/items/{id}` | Hapus item | `204` | `404` |
| `GET` | `/team` | Info anggota tim | `200` | — |

---

## 🚀 Cara Menjalankan

### 1. Clone repository

```bash
git clone https://github.com/itk-si-cloud/cloud-team-ignite.git
cd cloud-team-ignite
```

### 2. Setup environment

```bash
cd backend
cp .env.example .env
# Edit .env — isi password PostgreSQL Anda
```

### 3. Install dependencies & jalankan server

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
---
## 🏗️ Panduan Membangun Frontend React
## 📚 Dasar Teori

### 1. React

**React** adalah library JavaScript untuk membangun tampilan antarmuka pengguna (UI). React bekerja dengan cara memecah halaman menjadi bagian-bagian kecil yang disebut **komponen**. Setiap komponen memiliki tugas dan tanggung jawabnya masing-masing dan dapat digunakan ulang di berbagai tempat.

> 💡 **Analogi:** Halaman web seperti sebuah bangunan. Komponen adalah bagian-bagian bangunan tersebut terdapat bagian atap, dinding, pintu, dan jendela. Jika pintu perlu diganti, cukup ganti bagian pintu saja tanpa harus merombak seluruh bangunan.

**Konsep utama React yang digunakan dalam proyek ini:**

| Konsep | Penjelasan | Digunakan di |
|---|---|---|
| **Component** | Fungsi JavaScript yang menghasilkan tampilan (JSX) | Semua file `.jsx` |
| **Props** | Data yang dikirim dari komponen induk ke komponen anak — bersifat hanya-baca | Semua komponen |
| **State** | Data yang dapat berubah di dalam komponen — setiap perubahan memperbarui tampilan | `App.jsx` |
| **JSX** | Sintaks penulisan HTML di dalam file JavaScript | Semua komponen |
| **useState** | Hook untuk menyimpan dan mengubah data di dalam komponen | `App.jsx`, `ItemForm.jsx`, `SearchBar.jsx` |
| **useEffect** | Hook untuk menjalankan kode tertentu saat komponen pertama dimuat atau saat data tertentu berubah | `App.jsx`, `ItemForm.jsx` |
| **useCallback** | Hook untuk mencegah sebuah fungsi dibuat ulang setiap kali komponen dirender | `App.jsx` |

---

### 2. Props dan State

| Aspek | Props | State |
|---|---|---|
| **Sumber data** | Dikirim dari komponen induk | Dibuat dan dikelola di dalam komponen itu sendiri |
| **Dapat diubah?** | ❌ Tidak dapat diubah oleh komponen penerima | ✅ Dapat diubah menggunakan fungsi dari `useState` |
| **Efek perubahan** | Jika induk memperbarui props, komponen anak ikut diperbarui | Jika state berubah, tampilan komponen tersebut diperbarui |
| **Analogi** | Instruksi yang diberikan atasan kepada karyawan | Catatan kerja milik karyawan itu sendiri |

---

### 3. Fetch API

**Fetch API** adalah fitur bawaan JavaScript untuk mengirim permintaan HTTP ke server. Tidak diperlukan instalasi library tambahan untuk menggunakannya.

**Jenis permintaan yang digunakan dalam proyek ini:**

| Tujuan | Method HTTP | Contoh penggunaan |
|---|---|---|
| Mengambil semua item | `GET` | `await fetch("/items")` |
| Menambah item baru | `POST` | `fetch("/items", { method: "POST", body: ... })` |
| Memperbarui item | `PUT` | `fetch("/items/8", { method: "PUT", body: ... })` |
| Menghapus item | `DELETE` | `fetch("/items/8", { method: "DELETE" })` |
| Memeriksa status backend | `GET` | `await fetch("/health")` |

**Alasan semua fungsi fetch dipusatkan di `api.js`:**  
Jika alamat backend berubah di kemudian hari (misalnya saat deployment ke cloud), perubahan hanya perlu dilakukan di satu tempat, yaitu di `api.js`. Tidak perlu mengubah kode di setiap komponen secara satu per satu.

---

### 4. Separation of Concerns pada Frontend

Prinsip **Separation of Concerns** berarti setiap file hanya memiliki satu tanggung jawab yang spesifik. Prinsip yang sama diterapkan pada backend (pemisahan `main.py`, `crud.py`, `models.py`) juga berlaku pada frontend.

| File | Tanggung Jawab |
|---|---|
| `App.jsx` | Menyimpan semua data (state) dan mendefinisikan semua fungsi aksi CRUD |
| `Header.jsx` | Menampilkan judul, jumlah item, dan status koneksi API |
| `ItemForm.jsx` | Mengelola input form untuk mode tambah dan mode edit |
| `SearchBar.jsx` | Mengelola kolom pencarian dan tombol Clear |
| `ItemList.jsx` | Menampilkan daftar item, status loading, dan tampilan saat data kosong |
| `ItemCard.jsx` | Menampilkan satu item beserta tombol Edit dan Hapus |
| `services/api.js` | Menyediakan fungsi-fungsi komunikasi HTTP ke backend |

> 💡 Dengan pemisahan ini, apabila terjadi kesalahan pada tampilan form, pengembang cukup membuka `ItemForm.jsx` tanpa perlu memeriksa seluruh kode aplikasi.

---

## ✅ Fitur UI yang Dibangun

| Fitur | Komponen | Cara Kerja |
|---|---|---|
| **Status koneksi API** | `Header.jsx` | `checkHealth()` dipanggil saat halaman dibuka → hasilnya ditampilkan sebagai badge 🟢/🔴 |
| **Total item real-time** | `Header.jsx` | Setiap `loadItems()` berjalan, `data.total` diperbarui dan dikirim ke Header |
| **Menambah item** | `ItemForm.jsx` | Form dikirim → `createItem()` → `POST /items` |
| **Mengedit item** | `ItemForm.jsx` | Klik Edit → form terisi otomatis melalui `useEffect` → kirim → `PUT /items/:id` |
| **Menghapus item** | `ItemCard.jsx` | Klik Hapus → dialog konfirmasi → `deleteItem()` → `DELETE /items/:id` |
| **Mencari item** | `SearchBar.jsx` | Kata kunci diteruskan ke `loadItems(keyword)` → `GET /items?search=keyword` |
| **Sorting** | `App.jsx` | Dropdown untuk mengurutkan berdasarkan: Terbaru / Nama / Harga |
| **Tampilan kosong** | `ItemList.jsx` | Ditampilkan jika `items.length === 0` setelah pemuatan selesai |
| **Tampilan loading** | `ItemList.jsx` | Ditampilkan selama `loading === true` |
| **Format Rupiah** | `ItemCard.jsx` | `Intl.NumberFormat("id-ID")` mengonversi angka menjadi format "Rp15.000.000" |
| **Format tanggal** | `ItemCard.jsx` | `toLocaleDateString("id-ID")` mengonversi tanggal menjadi format "10 Mar 2026" |

---
## 📊 Daftar Endpoint API
 
Seluruh endpoint yang tersedia pada aplikasi Cloud App. Endpoint yang ditandai ✅ pada kolom Auth membutuhkan token JWT untuk dapat diakses.
 
> ✅ = Membutuhkan token JWT di header: `Authorization: Bearer <token>`  
> ❌ = Dapat diakses tanpa token (endpoint publik)
 
### Endpoint Autentikasi (Publik)
 
| Method | Endpoint | Deskripsi | Request Body | Status Sukses | Status Error |
|--------|----------|-----------|--------------|---------------|--------------|
| `POST` | `/auth/register` | Mendaftarkan akun baru | `{ email, name, password }` | `201 Created` | `400` email duplikat, `422` validasi gagal |
| `POST` | `/auth/login` | Login dan mendapatkan token | `{ email, password }` | `200 OK` + token | `401` email/password salah |
| `GET` | `/auth/me` | Melihat profil akun yang sedang aktif | — | `200 OK` | `401` token tidak valid |
 
### Endpoint Item (Membutuhkan Token)
 
| Method | Endpoint | Deskripsi | Request | Status Sukses | Status Error |
|--------|----------|-----------|---------|---------------|--------------|
| `POST` | `/items` | Menambahkan item baru ke inventori | Body: `{ name, price, description?, quantity? }` | `201 Created` | `401`, `422` |
| `GET` | `/items` | Mengambil daftar semua item | Query: `search?`, `skip?`, `limit?` | `200 OK` | `401` |
| `GET` | `/items/stats` | Melihat statistik inventori | — | `200 OK` | `401` |
| `GET` | `/items/{id}` | Mengambil detail satu item berdasarkan ID | Path: `id` | `200 OK` | `401`, `404` |
| `PUT` | `/items/{id}` | Memperbarui data item (hanya field yang dikirim yang berubah) | Path: `id`, Body: field yang ingin diubah | `200 OK` | `401`, `404`, `422` |
| `DELETE` | `/items/{id}` | Menghapus item dari inventori | Path: `id` | `204 No Content` | `401`, `404` |
 
### Endpoint Lainnya (Publik)
 
| Method | Endpoint | Deskripsi | Status Sukses |
|--------|----------|-----------|---------------|
| `GET` | `/health` | Memeriksa apakah server berjalan normal | `200 OK` |
| `GET` | `/team` | Menampilkan informasi anggota tim | `200 OK` |
 
### Kode Status yang Digunakan
 
| Kode | Artinya | Kapan Muncul |
|---|---|---|
| `200 OK` | Permintaan berhasil | GET, PUT yang berhasil |
| `201 Created` | Data baru berhasil dibuat | POST register, POST items |
| `204 No Content` | Berhasil, tidak ada data dikembalikan | DELETE yang berhasil |
| `400 Bad Request` | Data ditolak karena konflik | Email sudah terdaftar |
| `401 Unauthorized` | Tidak memiliki akses | Token tidak ada, token tidak valid, login gagal |
| `404 Not Found` | Data tidak ditemukan | ID item tidak ada di database |
| `422 Unprocessable Entity` | Format data tidak sesuai aturan | Field wajib kosong, harga negatif, password terlalu pendek |
 
---
 
### Alur Autentikasi
 
```
┌─────────────────────────────────────────────────────────────┐
│  1. REGISTER                                                │
│     POST /auth/register                                     │
│     Body: { email, name, password }                         │
│           ↓                                                 │
│     Password di-hash dengan bcrypt → disimpan ke database   │
│     Response: data akun (tanpa password)  →  201 Created    │
├─────────────────────────────────────────────────────────────┤
│  2. LOGIN                                                   │
│     POST /auth/login                                        │
│     Body: { email, password }                               │
│           ↓                                                 │
│     Server verifikasi password → buat JWT token             │
│     Response: { access_token, token_type, user }  → 200 OK  │
├─────────────────────────────────────────────────────────────┤
│  3. AKSES DATA (setiap request ke /items)                   │
│     Header: Authorization: Bearer <access_token>            │
│           ↓                                                 │
│     Server verifikasi token → proses request → kirim data   │
│     Tanpa token → 401 Unauthorized                          │
├─────────────────────────────────────────────────────────────┤
│  4. LOGOUT                                                  │
│     Token dihapus dari memori browser                       │
│     Tampilan kembali ke halaman login                       │
└─────────────────────────────────────────────────────────────┘
```
 
---
 
### Contoh Response Login
 
Setelah login berhasil, server mengembalikan data berikut:
 
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "10231030@student.itk.ac.id",
    "name": "Desnita Dwi Putri",
    "is_active": true,
    "created_at": "2026-03-17T08:00:00+07:00"
  }
}
```
 
Nilai `access_token` inilah yang perlu disertakan di setiap permintaan ke endpoint `/items`.
 
---
 
## 📂 Dokumentasi
 
Seluruh dokumen hasil pengujian dan referensi proyek tersedia di folder `docs/`:
 
| File | Dibuat oleh | Keterangan |
|---|---|---|
| `docs/api-test-results.md` | Lead QA & Docs | Hasil pengujian endpoint API via Swagger UI |
| `docs/ui-test-results.md` | Lead QA & Docs | Hasil pengujian 10 test case UI React via browser |
| `docs/auth-test-results.md` | Lead QA & Docs | Hasil pengujian test case alur autentikasi JWT |
| `docs/database-schema.md` | Lead DevOps | Skema tabel database PostgreSQL |
| `docs/setup-guide.md` | Lead DevOps | Panduan setup lengkap dari clone hingga running |
| `docs/member-[NAMA].md` | Masing-masing anggota | File verifikasi kontribusi per anggota |
| `docs/images/` | Lead QA & Docs | Screenshot hasil pengujian API dan UI |
 
### Ringkasan Hasil Pengujian
 
**API Testing (Swagger UI)**
 
| Total Test Case | Passed | Failed | Pass Rate |
|---|---|---|---|
| 14 | ✅ 14 | ❌ 0 | **100%** |
 
**UI Testing (Browser)**
 
| Total Test Case | Passed | Failed | Pass Rate |
|---|---|---|---|
| 10 | ✅ 10 | ❌ 0 | **100%** |
 
**Auth Testing (JWT End-to-End)**
 
| Total Test Case | Passed | Failed | Pass Rate |
|---|---|---|---|
| 20 | ✅ 20 | ❌ 0 | **100%** |
 
---

---
 ## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration | ✅ |
| 5-7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9-11 | CI/CD Pipeline | ⬜ |
| 12-14 | Microservices | ⬜ |
| 15-16 | Final & UAS | ⬜ |