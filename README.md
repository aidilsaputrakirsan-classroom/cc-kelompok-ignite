# ☁️ Cloud App - [RAZ'Q App — UMKM E-Commerce Platform]

## 📌 Deskripsi Proyek

RAZ'Q App (E-Commerce UMKM RAZ'Q) adalah platform e-commerce berbasis website yang dirancang untuk mendigitalisasikan proses bisnis UMKM RAZ'Q Balikpapan. UMKM ini memproduksi makanan khas Balikpapan seperti Amplang, keripik pisang, abon, dan camilan lainnya. Aplikasi ini mengatasi kendala pemasaran dan visibilitas usaha, serta mempermudah pengelolaan transaksi dan stok produk yang sebelumnya menghadapi tantangan kompleksitas pada aplikasi pihak ketiga.

## 📖 Daftar Isi
- [☁️ Cloud App - \[RAZ'Q App — UMKM E-Commerce Platform\]](#️-cloud-app---razq-app--umkm-e-commerce-platform)
  - [📌 Deskripsi Proyek](#-deskripsi-proyek)
  - [📖 Daftar Isi](#-daftar-isi)
  - [Fitur Utama](#fitur-utama)
    - [Manajemen Produk \& Katalog](#manajemen-produk--katalog)
    - [Manajemen Pesanan \& Pembayaran](#manajemen-pesanan--pembayaran)
    - [Manajemen Admin](#manajemen-admin)
    - [Fitur Sistem](#fitur-sistem)
    - [Fitur Berdasarkan Role](#fitur-berdasarkan-role)
  - [👥 Tim](#-tim)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Arsitektur Sistem](#️-arsitektur-sistem)
  - [🚀 Getting Started](#-getting-started)
    - [Prasyarat](#prasyarat)
    - [Backend](#backend)
    - [Frontend](#frontend)
    - [Verifikasi](#verifikasi)
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
    - [Langkah 1: Siapkan Database PostgreSQL](#langkah-1-siapkan-database-postgresql)
    - [Langkah 2: Buat File Konfigurasi `.env`](#langkah-2-buat-file-konfigurasi-env)
    - [Langkah 3: Install Dependencies](#langkah-3-install-dependencies)
    - [Langkah 4: Buat `database.py` — Koneksi ke Database](#langkah-4-buat-databasepy--koneksi-ke-database)
    - [Langkah 5: Buat `models.py` — Definisi Tabel Database](#langkah-5-buat-modelspy--definisi-tabel-database)
    - [Langkah 6: Buat `schemas.py` — Validasi Data dengan Pydantic](#langkah-6-buat-schemaspy--validasi-data-dengan-pydantic)
    - [Langkah 7: Buat `crud.py` — Business Logic](#langkah-7-buat-crudpy--business-logic)
    - [Langkah 8: Update `main.py` — Router \& Endpoints](#langkah-8-update-mainpy--router--endpoints)
    - [Langkah 9: Jalankan \& Test](#langkah-9-jalankan--test)
  - [📡 Dokumentasi API](#-dokumentasi-api)
    - [Base URL](#base-url)
    - [Autentikasi](#autentikasi)
    - [Format Response](#format-response)
    - [`GET /health` — Health Check](#get-health--health-check)
    - [`POST /items` — Buat Item Baru](#post-items--buat-item-baru)
    - [`GET /items` — Ambil Semua Item](#get-items--ambil-semua-item)
    - [`GET /items/stats` — Statistik Inventori](#get-itemsstats--statistik-inventori)
    - [`GET /items/{item_id}` — Ambil Item Berdasarkan ID](#get-itemsitem_id--ambil-item-berdasarkan-id)
    - [`PUT /items/{item_id}` — Update Item](#put-itemsitem_id--update-item)
    - [`DELETE /items/{item_id}` — Hapus Item](#delete-itemsitem_id--hapus-item)
    - [`GET /team` — Informasi Tim](#get-team--informasi-tim)
  - [📊 Ringkasan Endpoint](#-ringkasan-endpoint)
  - [🚀 Cara Menjalankan](#-cara-menjalankan)
    - [1. Clone repository](#1-clone-repository)
    - [2. Setup environment](#2-setup-environment)
    - [3. Install dependencies \& jalankan server](#3-install-dependencies--jalankan-server)
    - [4. Buka dokumentasi interaktif](#4-buka-dokumentasi-interaktif)
  - [🏗️ Panduan Membangun Frontend React](#️-panduan-membangun-frontend-react)
  - [📚 Dasar Teori](#-dasar-teori-2)
    - [1. React](#1-react)
    - [2. Props dan State](#2-props-dan-state)
    - [3. Fetch API](#3-fetch-api)
    - [4. Separation of Concerns pada Frontend](#4-separation-of-concerns-pada-frontend)
  - [🖥️ Panduan Membangun Frontend React](#️-panduan-membangun-frontend-react-1)
    - [Langkah 1: Membuat Struktur Folder](#langkah-1-membuat-struktur-folder)
    - [Langkah 2: Membuat API Service Layer — `api.js`](#langkah-2-membuat-api-service-layer--apijs)
    - [Langkah 3: Membuat Komponen `Header.jsx`](#langkah-3-membuat-komponen-headerjsx)
    - [Langkah 4: Membuat Komponen `SearchBar.jsx`](#langkah-4-membuat-komponen-searchbarjsx)
    - [Langkah 5: Membuat Komponen `ItemForm.jsx`](#langkah-5-membuat-komponen-itemformjsx)
    - [Langkah 6: Membuat Komponen `ItemCard.jsx`](#langkah-6-membuat-komponen-itemcardjsx)
    - [Langkah 7: Membuat Komponen `ItemList.jsx`](#langkah-7-membuat-komponen-itemlistjsx)
    - [Langkah 8: Membangun Komponen Utama — `App.jsx`](#langkah-8-membangun-komponen-utama--appjsx)
    - [Langkah 9: Memperbarui `App.css` dan `main.jsx`](#langkah-9-memperbarui-appcss-dan-mainjsx)
    - [Langkah 10: Mengatur Environment Variable](#langkah-10-mengatur-environment-variable)
    - [Langkah 11: Menjalankan Aplikasi](#langkah-11-menjalankan-aplikasi)
    - [Langkah 12: Pengujian dan Commit](#langkah-12-pengujian-dan-commit)
  - [✅ Fitur UI yang Dibangun](#-fitur-ui-yang-dibangun)
  - [🚀 Cara Menjalankan](#-cara-menjalankan-1)
  - [📅 Roadmap](#-roadmap)
---
## Fitur Utama

### Manajemen Produk & Katalog  
- ✅ **Katalog Penjualan** – Menampilkan daftar produk secara lengkap dengan gambar, harga, dan spesifikasi detail  
- ✅ **Informasi Produk Spesifik** – Menyajikan informasi produk sesuai jenis dan kategori untuk memudahkan pencarian  
- ✅ **Fitur Home & About** – Menyediakan informasi umum, visi misi, sejarah, dan profil identitas UMKM RAZ'Q   

### Manajemen Pesanan & Pembayaran 
- ✅ **Keranjang Belanja (Cart)** – Membantu pelanggan mengelola daftar barang sebelum melanjutkan ke proses pembayaran  
- ✅ **Sistem Pemesanan Online** – Pelanggan dapat melakukan pemesanan produk langsung melalui website setelah login  
- ✅ **Multi-Metode Pembayaran** – Mendukung pembayaran tunai di outlet atau digital melalui QRIS/Transfer dengan fitur unggah bukti verifikasi

### Manajemen Admin  
- ✅ **Dashboard Admin** – Panel utama bagi pengelola untuk manajemen produk, stok, dan pesanan  
- ✅ **Manajemen Stok (Inventory)** – Admin dapat mengupdate jumlah, memantau ketersediaan secara real-time, hingga menghapus produk 
-  ✅ **Verifikasi Pembayaran** – Fasilitas bagi admin untuk memeriksa bukti pembayaran digital dan mengubah status pembelian pelanggan

### Fitur Sistem  
- ✅ **Authentication** – Login & registrasi untuk user dan admin  

### Fitur Berdasarkan Role  
**Pelanggan**
- ✅ Melihat profil, kontak, dan katalog produk UMKM tanpa login wajib
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
| Andini Permata Dewanti | 102310314 | Lead Backend |
| Putri Rahmawati | 10231074 | Lead Frontend |
| Krishandy Dhanysa Pratama | 10231050 | Lead DevOps |
| Desnita Dwi Putri | 10231030 | Lead QA & Docs |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi | Penjelasan |
|------------|----------|------------|
| **FastAPI** | Backend REST API | Framework Python berbasis asynchronous yang digunakan untuk membangun REST API dengan performa tinggi dan dokumentasi otomatis (Swagger). |
| **React 18** | Frontend SPA | Library JavaScript untuk membangun Single Page Application (SPA) yang responsif dan modular menggunakan component-based architecture. |
| **Vite** | Build Tool | Development server dan build tool untuk frontend React dengan hot-reload cepat. Berjalan di port 5173. |
| **Fetch API** | HTTP Client | API bawaan JavaScript untuk melakukan HTTP request (GET/POST/PUT/DELETE) dari frontend ke backend. |
| **PostgreSQL** | Database | Sistem manajemen basis data relasional (RDBMS) yang digunakan untuk menyimpan data user, produk, pesanan, dan transaksi secara terstruktur. |
| **Docker** | Containerization | Digunakan untuk mengemas aplikasi beserta dependensinya ke dalam container agar environment konsisten di berbagai sistem. |
| **GitHub Actions** | CI/CD | Digunakan untuk otomatisasi proses build, testing, dan deployment setiap terjadi perubahan pada repository. |
| **Railway / Render** | Cloud Deployment | Platform cloud yang digunakan untuk hosting backend dan database agar aplikasi dapat diakses secara online. |
| **SQLAlchemy** | ORM | Translasi Python object ↔ SQL |
| **Pydantic v2** | Validasi | Validasi request body & response schema |
| **Uvicorn** | Server | ASGI server untuk menjalankan FastAPI |
| **python-dotenv** | Config | Membaca variabel dari file `.env` |

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

**Alur data saat client melakukan request ke Backend:**

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

**Alur data di sisi Frontend React (Modul 3):**

```
User Action (klik tombol / isi form)
      │
      ▼
App.jsx  ──►  services/api.js  ──►  HTTP Request  ──►  FastAPI Backend
 State          fetch() wrapper       GET/POST/PUT/DELETE    (port 8000)
      │
      │  Response JSON
      ▼
setItems() / setTotalItems()  ──►  Re-render komponen  ──►  UI terupdate
```

**Komponen Tree Frontend:**
```
App (state: items, editingItem, searchQuery, loading, isConnected)
 ├── Header        (props: totalItems, isConnected)
 ├── ItemForm      (props: onSubmit, editingItem, onCancelEdit)
 ├── SearchBar     (props: onSearch)
 └── ItemList      (props: items, onEdit, onDelete, loading)
      └── ItemCard (props: item, onEdit, onDelete)
```

> 📌 Diagram ini akan berkembang setiap minggu — mulai dari monolith sederhana hingga arsitektur microservices di fase akhir (Minggu 12–14).

---

## 🚀 Getting Started

### Prasyarat
- **Python 3.10+**: Diperlukan untuk menjalankan modul FastAPI dan asynchronous logic.
- **Node.js 18+**: Diperlukan untuk kompilasi aset React dan manajemen package (NPM).
- **Git**: Untuk manajemen versi dan kolaborasi antar anggota tim.

> ⚠️ **Perlu 2 terminal berjalan bersamaan** — satu untuk backend, satu untuk frontend.

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env — isi DATABASE_URL dengan password PostgreSQL Anda
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend tersedia di `http://localhost:8000`  
Dokumentasi API (Swagger UI): `http://localhost:8000/docs`

### Frontend
```bash
cd frontend
cp .env.example .env
# Pastikan VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

Frontend tersedia di `http://localhost:5173`

### Verifikasi
Buka `http://localhost:5173` — Header harus menampilkan badge **🟢 API Connected**.

---

## 📁 Struktur Proyek

```
cloud-team-ignite/
├── backend/
│   ├── main.py                    ← Entry point, FastAPI router & semua endpoint
│   ├── database.py                ← Koneksi PostgreSQL via SQLAlchemy
│   ├── models.py                  ← SQLAlchemy models (definisi tabel database)
│   ├── schemas.py                 ← Pydantic schemas (validasi request/response)
│   ├── crud.py                    ← Fungsi CRUD (business logic & query database)
│   ├── requirements.txt           ← Daftar dependencies Python
│   ├── .env                       ← ⛔ RAHASIA — berisi password, jangan di-commit!
│   └── .env.example               ← ✅ Template konfigurasi — ini yang di-commit
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ← Root component, state management CRUD
│   │   ├── App.css                ← Global styling & CSS reset
│   │   ├── main.jsx               ← Entry point React
│   │   ├── components/
│   │   │   ├── Header.jsx         ← Judul, badge total item & status koneksi API
│   │   │   ├── SearchBar.jsx      ← Input pencarian dengan tombol Clear
│   │   │   ├── ItemForm.jsx       ← Form create/edit item dengan validasi
│   │   │   ├── ItemList.jsx       ← Grid container daftar item + empty state
│   │   │   └── ItemCard.jsx       ← Card per item + tombol Edit & Hapus
│   │   └── services/
│   │       └── api.js             ← Semua fungsi fetch ke backend API
│   ├── .env                       ← ⛔ RAHASIA — berisi VITE_API_URL, jangan di-commit!
│   ├── .env.example               ← ✅ Template konfigurasi frontend — ini yang di-commit
│   ├── index.html
│   ├── package.json               ← Dependencies & scripts Node.js
│   └── vite.config.js             ← Konfigurasi Vite bundler
├── docs/
│   ├── api-test-results.md        ← Dokumentasi hasil testing endpoint API
│   ├── ui-test-results.md         ← Dokumentasi hasil testing UI React (Modul 3)
│   ├── database-schema.md         ← Schema tabel database
│   └── member-[NAMA].md           ← File verifikasi masing-masing anggota
├── .gitignore                     ← Daftar file yang tidak di-commit (termasuk .env)
└── README.md                      ← Dokumentasi proyek
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

Contoh tabel `items` di PostgreSQL:

| id | name | price | quantity | created_at |
|---|---|---|---|---|
| 1 | Laptop | 15000000 | 5 | 2026-02-09 10:30:00 |
| 2 | Mouse Wireless | 250000 | 20 | 2026-02-09 10:31:00 |
| 3 | Keyboard Mechanical | 1200000 | 8 | 2026-02-09 10:32:00 |

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

Contoh tabel `items` di PostgreSQL:

| id | name | price | quantity | created_at |
|---|---|---|---|---|
| 1 | Laptop | 15000000 | 5 | 2026-02-09 10:30:00 |
| 2 | Mouse Wireless | 250000 | 20 | 2026-02-09 10:31:00 |
| 3 | Keyboard Mechanical | 1200000 | 8 | 2026-02-09 10:32:00 |

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

### Langkah 1: Siapkan Database PostgreSQL

Sebelum menulis kode, database harus sudah dibuat terlebih dahulu.

**1a. Login ke PostgreSQL:**
```bash
# Mac/Linux
psql -U postgres

# Windows (buka Command Prompt sebagai Administrator)
psql -U postgres
```

**1b. Buat database baru:**
```sql
CREATE DATABASE cloudapp;

-- Verifikasi — pastikan 'cloudapp' muncul di daftar
\l

-- Keluar dari psql
\q
```

> 💡 Bisa juga menggunakan **pgAdmin** (GUI): klik kanan Databases → Create → Database → isi nama `cloudapp`.

---

### Langkah 2: Buat File Konfigurasi `.env`

File `.env` menyimpan informasi sensitif seperti password database. File ini **TIDAK boleh di-commit ke Git**.

**Buat file `backend/.env`:**
```
DATABASE_URL=postgresql://postgres:PASSWORD_ANDA@localhost:5432/cloudapp
```

> ⚠️ Ganti `PASSWORD_ANDA` dengan password PostgreSQL yang Anda buat saat instalasi.

**Buat file `backend/.env.example`** *(file ini yang di-commit sebagai template untuk tim)*:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/cloudapp
```

**Pastikan `.env` ada di `.gitignore`:**
```bash
cat .gitignore | grep .env
# Harus muncul baris: .env
```

---

### Langkah 3: Install Dependencies

**Update `backend/requirements.txt`:**
```
fastapi==0.115.0
uvicorn==0.30.0
sqlalchemy==2.0.35
psycopg2-binary==2.9.9
python-dotenv==1.0.1
pydantic[email]==2.9.0
```

**Install semua dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

---

### Langkah 4: Buat `database.py` — Koneksi ke Database

File ini bertanggung jawab membuat koneksi ke PostgreSQL dan menyediakan *session* untuk setiap request.

**Cara kerjanya:**
1. Membaca `DATABASE_URL` dari file `.env`
2. Membuat `engine` — koneksi utama ke database
3. Membuat `SessionLocal` — factory untuk membuat session
4. Fungsi `get_db()` digunakan sebagai *dependency injection* di setiap endpoint

```python
# backend/database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL tidak ditemukan di .env!")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

> 💡 `yield` di dalam `get_db()` memastikan session selalu ditutup setelah request selesai, bahkan jika terjadi error.

---

### Langkah 5: Buat `models.py` — Definisi Tabel Database

Model SQLAlchemy mendefinisikan struktur tabel di database. Setiap *class* = satu tabel, setiap atribut = satu kolom.

```python
# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

class Item(Base):
    __tablename__ = "items"

    id          = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price       = Column(Float, nullable=False)
    quantity    = Column(Integer, nullable=False, default=0)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())
```

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | Integer | Primary key, auto-increment |
| `name` | String(100) | Nama item, wajib diisi |
| `description` | Text | Deskripsi opsional |
| `price` | Float | Harga, wajib diisi |
| `quantity` | Integer | Jumlah stok, default 0 |
| `created_at` | DateTime | Otomatis diisi saat data dibuat |
| `updated_at` | DateTime | Otomatis diperbarui saat data diubah |

> 💡 **Kenapa pakai ORM, bukan SQL langsung?**  
> Dengan ORM, kita cukup menulis `db.add(Item(...))` alih-alih `INSERT INTO items VALUES (...)`. Kode lebih bersih, lebih aman dari SQL injection, dan portable ke database lain.

---

### Langkah 6: Buat `schemas.py` — Validasi Data dengan Pydantic

Schema Pydantic memisahkan struktur data untuk *request* (data masuk) dan *response* (data keluar). Ini penting agar client tidak bisa mengirim field yang tidak seharusnya (seperti `id` atau `created_at`).

```python
# backend/schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Laptop"])
    description: Optional[str] = Field(None, examples=["Laptop untuk cloud computing"])
    price: float = Field(..., gt=0, examples=[15000000])
    quantity: int = Field(0, ge=0, examples=[10])

class ItemCreate(ItemBase):
    pass  # Mewarisi semua field dari ItemBase

class ItemUpdate(BaseModel):
    # Semua field opsional — user boleh update sebagian saja
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)

class ItemResponse(ItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Agar bisa convert dari SQLAlchemy model

class ItemListResponse(BaseModel):
    total: int
    items: list[ItemResponse]
```

**Aturan validasi Pydantic:**

| Aturan | Artinya |
|---|---|
| `Field(...)` | Wajib diisi (required) |
| `Field(None)` | Opsional, default `None` |
| `min_length=1` | Minimal 1 karakter |
| `gt=0` | Harus lebih besar dari 0 |
| `ge=0` | Harus lebih besar atau sama dengan 0 |

---

### Langkah 7: Buat `crud.py` — Business Logic

File ini berisi semua operasi database (Create, Read, Update, Delete). Memisahkan logika ini dari `main.py` membuat kode lebih mudah di-test dan di-maintain.

```python
# backend/crud.py
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item
from schemas import ItemCreate, ItemUpdate

def create_item(db: Session, item_data: ItemCreate):
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_items(db: Session, skip: int = 0, limit: int = 20, search: str = None):
    query = db.query(Item)
    if search:
        query = query.filter(
            or_(Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%"))
        )
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {"total": total, "items": items}

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()

def update_item(db: Session, item_id: int, item_data: ItemUpdate):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        return None
    update_data = item_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        return False
    db.delete(db_item)
    db.commit()
    return True
```

> 💡 `exclude_unset=True` pada `model_dump()` memastikan hanya field yang benar-benar dikirim user yang ter-update (partial update), bukan semua field sekaligus.

---

### Langkah 8: Update `main.py` — Router & Endpoints

File ini menyatukan semua komponen: mendaftarkan endpoint, mengatur CORS, dan menginisialisasi tabel database.

```python
# backend/main.py
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db
from models import Base
from schemas import ItemCreate, ItemUpdate, ItemResponse, ItemListResponse
import crud

Base.metadata.create_all(bind=engine)  # Buat tabel jika belum ada

app = FastAPI(
    title="Cloud App API",
    description="REST API untuk mata kuliah Komputasi Awan — SI ITK",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "0.2.0"}

@app.post("/items", response_model=ItemResponse, status_code=201)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item_data=item)

@app.get("/items", response_model=ItemListResponse)
def list_items(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db),
):
    return crud.get_items(db=db, skip=skip, limit=limit, search=search)

@app.get("/items/stats")
def items_stats(db: Session = Depends(get_db)):
    from models import Item
    items = db.query(Item).all()
    if not items:
        return {"total_items": 0, "total_value": 0, "most_expensive": None, "cheapest": None}
    most_expensive = max(items, key=lambda x: x.price)
    cheapest = min(items, key=lambda x: x.price)
    return {
        "total_items": len(items),
        "total_value": round(sum(i.price * i.quantity for i in items), 2),
        "most_expensive": {"name": most_expensive.name, "price": most_expensive.price},
        "cheapest": {"name": cheapest.name, "price": cheapest.price},
    }

@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db=db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return item

@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    updated = crud.update_item(db=db, item_id=item_id, item_data=item)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return updated

@app.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    success = crud.delete_item(db=db, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Item dengan id={item_id} tidak ditemukan")
    return None

@app.get("/team")
def team_info():
    return {
        "team": "cloud-team-ignore",
        "members": [
            {"name": "Andini Permata Dewanti", "nim": "102310314", "role": "Lead Backend"},
            {"name": "Putri Rahmawati", "nim": "10231074", "role": "Lead Frontend"},
            {"name": "Krishandy Dhanysa Pratama", "nim": "10231050", "role": "Lead DevOps"},
            {"name": "Desnita Dwi Putri", "nim": "10231030", "role": "Lead QA & Docs"},
        ],
    }
```

> ⚠️ **Perhatian urutan endpoint!** `GET /items/stats` harus didaftarkan **sebelum** `GET /items/{item_id}`. Jika urutannya terbalik, FastAPI akan menganggap `stats` sebagai `item_id` dan mengembalikan error 422.

---

### Langkah 9: Jalankan & Test

```bash
cd backend
uvicorn main:app --reload --port 8000
```

| URL | Keterangan |
|---|---|
| `http://localhost:8000` | Base URL API |
| `http://localhost:8000/docs` | Swagger UI — dokumentasi interaktif |
| `http://localhost:8000/redoc` | ReDoc — dokumentasi alternatif |

**Urutan testing di Swagger UI (`/docs`):**

1. `POST /items` — Buat 3 item berbeda
2. `GET /items` — Pastikan `total: 3`
3. `GET /items/1` — Ambil item pertama
4. `PUT /items/1` — Update salah satu field (contoh: harga)
5. `GET /items/1` — Verifikasi perubahan tersimpan
6. `GET /items?search=laptop` — Pastikan filter berfungsi
7. `GET /items/stats` — Cek statistik inventori
8. `DELETE /items/1` — Hapus item
9. `GET /items/1` — Harus mengembalikan `404 Not Found`

✅ Jika semua langkah berhasil, backend CRUD lengkap dengan database sudah berjalan!

---

## 📡 Dokumentasi API

### Base URL

```
http://localhost:8000
```

### Autentikasi

Saat ini API tidak memerlukan autentikasi (akan ditambahkan di modul selanjutnya).

### Format Response

Semua response menggunakan format JSON dengan `Content-Type: application/json`.

---

### `GET /health` — Health Check

Mengecek apakah server API sedang berjalan.

**Request:**
```
GET /health
```

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "version": "0.2.0"
}
```

---

### `POST /items` — Buat Item Baru

Menambahkan item baru ke inventori.

**Request:**
```
POST /items
Content-Type: application/json
```

**Request Body:**
```json
{"name": "Laptop", "price": 15000000, "description": "Laptop untuk cloud computing", "quantity": 5}
```

| Field | Tipe | Wajib | Validasi | Keterangan |
|---|---|---|---|---|
| `name` | string | ✅ Ya | 1–100 karakter | Nama item |
| `description` | string | ❌ Tidak | — | Deskripsi opsional |
| `price` | float | ✅ Ya | > 0 | Harga dalam Rupiah |
| `quantity` | integer | ❌ Tidak | ≥ 0, default: 0 | Jumlah stok |

**Contoh Testing — Item 1 (Laptop):**

Request body:
```json
{"name": "Laptop", "price": 15000000, "description": "Laptop untuk cloud computing", "quantity": 5}
```
Response `201 Created`:
```json
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 15000000,
  "quantity": 5,
  "id": 8,
  "created_at": "2026-03-03T43:53.807688+07:00",
  "updated_at": null
}
```

**Contoh Testing — Item 2 (Mouse Wireless):**

Request body:
```json
{"name": "Mouse Wireless", "price": 250000, "description": "Mouse bluetooth", "quantity": 20}
```
Response `201 Created`:
```json
{
  "name": "Mouse Wireless",
  "description": "Mouse bluetooth",
  "price": 250000,
  "quantity": 20,
  "id": 9,
  "created_at": "2026-03-03T44:17.213007+07:00",
  "updated_at": null
}
```

**Contoh Testing — Item 3 (Keyboard Mechanical):**

Request body:
```json
{"name": "Keyboard Mechanical", "price": 1200000, "description": "Keyboard untuk coding", "quantity": 8}
```
Response `201 Created`:
```json
{
  "name": "Keyboard Mechanical",
  "description": "Keyboard untuk coding",
  "price": 1200000,
  "quantity": 8,
  "id": 10,
  "created_at": "2026-03-03T44:33.615783+07:00",
  "updated_at": null
}
```

**Response `422 Unprocessable Entity`** (validasi gagal):
```json
{
  "detail": [
    {
      "loc": ["body", "price"],
      "msg": "Input should be greater than 0",
      "type": "greater_than"
    }
  ]
}
```

**📌 Analisis Output:**
Jika request berhasil, server mengembalikan status `201 Created` beserta data item yang baru saja disimpan ke database. Output mencakup semua field yang dikirim ditambah tiga field yang diisi otomatis oleh server: `id` (nomor urut unik dari database), `created_at` (waktu penyimpanan dengan timezone `+07:00`), dan `updated_at` (bernilai `null` karena item belum pernah diubah). Jika ada field yang tidak memenuhi validasi — misalnya `price` bernilai negatif atau `name` kosong — server langsung menolak dengan `422` tanpa menyentuh database sama sekali.

---

### `GET /items` — Ambil Semua Item

Mengambil daftar seluruh item dengan dukungan pagination dan pencarian.

**Request:**
```
GET /items
GET /items?skip=0&limit=20
GET /items?search=laptop
```

**Query Parameters:**

| Parameter | Tipe | Default | Validasi | Keterangan |
|---|---|---|---|---|
| `skip` | integer | `0` | ≥ 0 | Jumlah data yang dilewati (untuk pagination) |
| `limit` | integer | `20` | 1–100 | Jumlah data per halaman |
| `search` | string | — | — | Kata kunci pencarian berdasarkan nama/deskripsi |

**Contoh Testing — GET semua item (`GET /items?skip=0&limit=20`):**

Response `200 OK`:
```json
{
  "total": 3,
  "items": [
    {
      "name": "Keyboard Mechanical",
      "description": "Keyboard untuk coding",
      "price": 1200000,
      "quantity": 8,
      "id": 10,
      "created_at": "2026-03-03T44:37.855782+07:00",
      "updated_at": null
    },
    {
      "name": "Mouse Wireless",
      "description": "Mouse bluetooth",
      "price": 250000,
      "quantity": 20,
      "id": 9,
      "created_at": "2026-03-03T44:17.213007+07:00",
      "updated_at": null
    },
    {
      "name": "Laptop",
      "description": "Laptop untuk cloud computing",
      "price": 15000000,
      "quantity": 5,
      "id": 8,
      "created_at": "2026-03-03T43:53.807688+07:00",
      "updated_at": null
    }
  ]
}
```

**Contoh Testing — Search (`GET /items?search=laptop`):**

Response `200 OK`:
```json
{
  "total": 1,
  "items": [
    {
      "name": "Laptop",
      "description": "Laptop untuk cloud computing",
      "price": 15000000,
      "quantity": 5,
      "id": 8,
      "created_at": "2026-03-03T43:55.807049+07:00",
      "updated_at": "2026-03-03T50:12.100793+07:00"
    }
  ]
}
```

> 💡 Field `total` menunjukkan jumlah seluruh data yang cocok dengan filter, bukan jumlah data di halaman ini. Berguna untuk menghitung total halaman di frontend.


**📌 Analisis Output:**
Server mengembalikan objek JSON dengan dua field utama: `total` (jumlah seluruh item yang cocok dengan filter) dan `items` (array berisi data item sesuai parameter `skip` dan `limit`). Urutan item mengikuti urutan masuk ke database — item yang paling baru ditambahkan muncul di posisi paling atas. Ketika menggunakan parameter `search`, server melakukan pencarian *case-insensitive* di field `name` dan `description` sekaligus, sehingga `search=laptop` akan mencocokkan "Laptop", "laptop", maupun "LAPTOP". Jika tidak ada item yang cocok, `items` akan berupa array kosong `[]` dengan `total: 0`.

---

### `GET /items/stats` — Statistik Inventori

Mengembalikan ringkasan statistik dari seluruh item di inventori.

**Request:**
```
GET /items/stats
```

**Contoh Testing — setelah item id=8 (Laptop) dihapus, tersisa 2 item:**

Response `200 OK`:
```json
{
  "total_items": 2,
  "total_value": 14600000,
  "most_expensive": {
    "name": "Keyboard Mechanical",
    "price": 1200000
  },
  "cheapest": {
    "name": "Mouse Wireless",
    "price": 250000
  }
}
```

**Response `200 OK`** (inventori kosong):
```json
{
  "total_items": 0,
  "total_value": 0,
  "most_expensive": null,
  "cheapest": null
}
```

**Penjelasan setiap field response:**

| Field | Tipe | Keterangan |
|---|---|---|
| `total_items` | integer | Jumlah seluruh item di inventori |
| `total_value` | float | Total nilai inventori, dihitung dari `SUM(price × quantity)` |
| `most_expensive` | object \| null | Item dengan `price` tertinggi |
| `most_expensive.name` | string | Nama item termahal |
| `most_expensive.price` | float | Harga item termahal |
| `cheapest` | object \| null | Item dengan `price` terendah |
| `cheapest.name` | string | Nama item termurah |
| `cheapest.price` | float | Harga item termurah |

> ⚠️ **Catatan urutan endpoint:** `GET /items/stats` harus didaftarkan di `main.py` **sebelum** `GET /items/{item_id}`, karena FastAPI memproses route secara berurutan dari atas ke bawah.


**📌 Analisis Output:**
Server menghitung statistik secara real-time dari seluruh data yang ada di tabel `items` saat endpoint dipanggil. `total_items` adalah jumlah baris di tabel, `total_value` dihitung dari `SUM(price × quantity)` untuk setiap item — sehingga item dengan stok banyak berkontribusi lebih besar ke total nilai. `most_expensive` dan `cheapest` hanya membandingkan berdasarkan `price` per satuan, bukan total nilai. Pada contoh testing di atas, setelah Laptop (`id=8`) dihapus, nilai `most_expensive` berubah menjadi Keyboard Mechanical karena Laptop tidak lagi ada di database. Jika inventori kosong, semua field mengembalikan `0` atau `null`.

---

### `GET /items/{item_id}` — Ambil Item Berdasarkan ID

Mengambil detail satu item berdasarkan ID-nya.

**Request:**
```
GET /items/{item_id}
```

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `item_id` | integer | ID unik item yang ingin diambil |

**Contoh Testing — GET item id=8 (Laptop, sebelum diupdate):**

Response `200 OK`:
```json
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 15000000,
  "quantity": 5,
  "id": 8,
  "created_at": "2026-03-03T43:33.897688+07:00",
  "updated_at": null
}
```

**Contoh Testing — GET item id=9 (Mouse Wireless):**

Response `200 OK`:
```json
{
  "name": "Mouse Wireless",
  "description": "Mouse bluetooth",
  "price": 250000,
  "quantity": 20,
  "id": 9,
  "created_at": "2026-03-03T44:17.213007+07:00",
  "updated_at": null
}
```

**Contoh Testing — GET item id=10 (Keyboard Mechanical):**

Response `200 OK`:
```json
{
  "name": "Keyboard Mechanical",
  "description": "Keyboard untuk coding",
  "price": 1200000,
  "quantity": 8,
  "id": 10,
  "created_at": "2026-03-03T44:37.853782+07:00",
  "updated_at": null
}
```

**Contoh Testing — GET item id=8 setelah diupdate:**

Response `200 OK`:
```json
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 14000000,
  "quantity": 5,
  "id": 8,
  "created_at": "2026-03-03T43:33.897688+07:00",
  "updated_at": "2026-03-03T50:12.100795+07:00"
}
```

**Response `404 Not Found`** (ID tidak ditemukan):
```json
{
  "detail": "Item dengan id=8 tidak ditemukan"
}
```

**📌 Analisis Output:**
Jika item ditemukan, server mengembalikan seluruh data item sesuai kondisi terkini di database. Perhatikan bahwa field `updated_at` awalnya bernilai `null` (artinya item belum pernah dimodifikasi sejak dibuat), namun setelah dilakukan `PUT`, field ini terisi dengan timestamp waktu perubahan terakhir. Jika ID yang diminta tidak ada di database, server mengembalikan `404` dengan pesan `"Item dengan id={id} tidak ditemukan"` — bukan array kosong, karena ini bukan kasus "tidak ada hasil", melainkan "resource tidak ditemukan".

---

### `PUT /items/{item_id}` — Update Item

Memperbarui data item yang sudah ada. Mendukung **partial update** — hanya field yang dikirim yang akan diperbarui.

**Request:**
```
PUT /items/{item_id}
Content-Type: application/json
```

**Request Body** *(semua field opsional)*:
```json
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 14000000,
  "quantity": 5
}
```

| Field | Tipe | Wajib | Validasi | Keterangan |
|---|---|---|---|---|
| `name` | string | ❌ Tidak | 1–100 karakter | Nama baru item |
| `description` | string | ❌ Tidak | — | Deskripsi baru |
| `price` | float | ❌ Tidak | > 0 | Harga baru |
| `quantity` | integer | ❌ Tidak | ≥ 0 | Jumlah stok baru |

> 💡 Jika hanya mengirim `{"price": 14000000}`, maka hanya field `price` yang berubah. Field lain tetap seperti semula.

**Contoh Testing — PUT item id=8 (update harga Laptop menjadi 14000000):**

Response `200 OK`:
```json
{
  "name": "Laptop",
  "description": "Laptop untuk cloud computing",
  "price": 14000000,
  "quantity": 5,
  "id": 8,
  "created_at": "2026-03-03T43:55.807049+07:00",
  "updated_at": "2026-03-03T50:13.100793+07:00"
}
```

**Response `404 Not Found`:**
```json
{
  "detail": "Item dengan id=8 tidak ditemukan"
}
```

**Response `422 Unprocessable Entity`** (validasi gagal):
```json
{
  "detail": [
    {
      "loc": ["body", "quantity"],
      "msg": "Input should be greater than or equal to 0",
      "type": "greater_than_equal"
    }
  ]
}
```

**📌 Analisis Output:**
Server menerapkan *partial update* — hanya field yang dikirim dalam request body yang akan berubah di database, field lain tetap seperti semula. Buktinya terlihat pada output: meskipun request hanya mengubah `price` menjadi `14000000`, field `name`, `description`, dan `quantity` tetap sama. Field `updated_at` yang sebelumnya `null` kini terisi timestamp, menandakan ada perubahan yang tersimpan. Jika mengirim field dengan nilai tidak valid (misalnya `quantity: -1`), server menolak seluruh request dengan `422` tanpa mengubah data apapun di database.

---

### `DELETE /items/{item_id}` — Hapus Item

Menghapus item dari inventori secara permanen berdasarkan ID.

**Request:**
```
DELETE /items/{item_id}
```

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `item_id` | integer | ID item yang ingin dihapus |

**Contoh Testing — DELETE item id=8 (Laptop):**

Response `204 No Content`:
```
(response body kosong)
```

Response headers aktual:
```
access-control-allow-credentials: true
access-control-allow-origin: http://localhost:8000
content-type: application/json
date: Tue, 03 Mar 2026 02:53:53 GMT
server: uvicorn
vary: Origin
```

**Response `404 Not Found`** (jika ID tidak ada):
```json
{
  "detail": "Item dengan id=8 tidak ditemukan"
}
```

> 💡 Status code `204` artinya request berhasil tetapi server tidak mengembalikan data apapun. Setelah DELETE berhasil, pemanggilan `GET /items/8` akan mengembalikan `404 Not Found`.


**📌 Analisis Output:**
Berbeda dengan endpoint lain, `DELETE` yang berhasil tidak mengembalikan body apapun — hanya status code `204 No Content`. Ini adalah konvensi REST yang benar: tidak ada yang perlu dikembalikan karena datanya sudah tidak ada. Yang perlu diperhatikan dari response headers adalah kehadiran `access-control-allow-credentials: true` dan `vary: Origin` yang menandakan CORS middleware aktif dan berfungsi, memperbolehkan frontend dari origin berbeda mengakses endpoint ini. Penghapusan bersifat permanen — tidak ada fitur *undo* atau *soft delete* pada implementasi ini.

---

### `GET /team` — Informasi Tim

Mengembalikan daftar anggota tim pengembang.

**Request:**
```
GET /team
```

**Response `200 OK`:**
```json
{
  "team": "cloud-team-ignore",
  "members": [
    {
      "name": "Andini Permata Dewanti",
      "nim": "102310314",
      "role": "Lead Backend"
    },
    {
      "name": "Putri Rahmawati",
      "nim": "10231074",
      "role": "Lead Frontend"
    },
    {
      "name": "Krishandy Dhanysa Pratama",
      "nim": "10231050",
      "role": "Lead DevOps"
    },
    {
      "name": "Desnita Dwi Putri",
      "nim": "10231030",
      "role": "Lead QA & Docs"
    }
  ]
}
```
Response headers aktual:
```
content-length: 321
content-type: application/json
date: Sun, 08 Mar 2026 03:19:54 GMT
server: uvicorn
```

**📌 Analisis Output:**
Server mengembalikan objek JSON berisi field `team` (nama tim) dan `members` (array anggota tim). Data ini bersifat statis — di-*hardcode* langsung di `main.py` dan tidak terhubung ke database. Endpoint ini berfungsi sebagai identitas proyek, berguna untuk memverifikasi bahwa server yang berjalan adalah milik tim yang benar. `content-length: 321` pada response headers menunjukkan ukuran response body dalam byte.

---

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

### 4. Buka dokumentasi interaktif

```
http://localhost:8000/docs
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

## 🖥️ Panduan Membangun Frontend React

### Langkah 1: Membuat Struktur Folder

```bash
cd cloud-team-XX/frontend/src
mkdir -p components services
```

Perintah ini membuat dua folder baru di dalam direktori `src/`:
- `components/` — tempat menyimpan semua file komponen tampilan
- `services/` — tempat menyimpan file `api.js`

---

### Langkah 2: Membuat API Service Layer — `api.js`

File: `frontend/src/services/api.js`

File ini berisi semua fungsi untuk berkomunikasi dengan backend. Setiap komponen yang membutuhkan data dari backend akan memanggil fungsi dari file ini, bukan menulis kode fetch secara langsung di dalam komponen.

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ==================== GET ====================

export async function fetchItems(search = "", skip = 0, limit = 20) {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    params.append("skip", skip)
    params.append("limit", limit)

    const response = await fetch(`${API_URL}/items?${params}`)
    if (!response.ok) throw new Error("Gagal mengambil data items")
    return response.json()
}

export async function fetchItem(id) {
    const response = await fetch(`${API_URL}/items/${id}`)
    if (!response.ok) throw new Error(`Item ${id} tidak ditemukan`)
    return response.json()
}

// ==================== POST ====================

export async function createItem(itemData) {
    const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Gagal membuat item")
    }
    return response.json()
}

// ==================== PUT ====================

export async function updateItem(id, itemData) {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || "Gagal mengupdate item")
    }
    return response.json()
}

// ==================== DELETE ====================

export async function deleteItem(id) {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: "DELETE",
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.detail || `Gagal menghapus item ${id}`)
    }

    return true
}

// ==================== HEALTH ====================

export async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`)
        const data = await response.json()
        return data.status === "healthy"
    } catch {
        return false
    }
}
```

> 💡 **Mengapa variabel harus diawali `VITE_`?**  
> Vite memiliki aturan keamanan: hanya variabel yang diawali `VITE_` yang dapat diakses oleh kode JavaScript di browser. Variabel tanpa awalan `VITE_` tidak akan tersedia dan nilainya akan menjadi `undefined`. Aturan ini mencegah data sensitif seperti password database terbaca oleh pengguna melalui browser.

---

### Langkah 3: Membuat Komponen `Header.jsx`

File: `frontend/src/components/Header.jsx`

Komponen ini menampilkan bagian atas halaman yang berisi judul aplikasi, jumlah item saat ini, dan status koneksi ke backend.

```jsx
function Header({ totalItems, isConnected }) {
    return (
        <header style={styles.header}>
            <div>
                <h1 style={styles.title}>☁️ Cloud App</h1>
                <p style={styles.subtitle}>Komputasi Awan — SI ITK</p>
            </div>
            <div style={styles.stats}>
                <span style={styles.badge}>
                    {totalItems} items
                </span>
                <span style={{
                    ...styles.status,
                    backgroundColor: isConnected ? "#E2EFDA" : "#FBE5D6",
                    color: isConnected ? "#548235" : "#C00000",
                }}>
                    {isConnected ? "🟢 API Connected" : "🔴 API Disconnected"}
                </span>
            </div>
        </header>
    )
}

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 2rem",
        backgroundColor: "#1F4E79",
        color: "white",
        borderRadius: "12px",
        marginBottom: "1.5rem",
    },
    title: {
        margin: 0,
        fontSize: "1.8rem",
    },
    subtitle: {
        margin: "0.25rem 0 0 0",
        fontSize: "0.9rem",
        opacity: 0.8,
    },
    stats: {
        display: "flex",
        gap: "0.75rem",
        alignItems: "center",
    },
    badge: {
        backgroundColor: "rgba(255,255,255,0.2)",
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        fontSize: "0.85rem",
    },
    status: {
        padding: "0.4rem 0.8rem",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "bold",
    },
}

export default Header
```

**Penjelasan kode:**

- `{ totalItems, isConnected }` — cara mengambil props dari komponen induk. Penulisan ini setara dengan `props.totalItems` dan `props.isConnected`, namun lebih ringkas.
- `isConnected ? "🟢 ..." : "🔴 ..."` — ekspresi kondisional. Jika `isConnected` bernilai `true`, tampilkan teks pertama; jika `false`, tampilkan teks kedua.
- `{...styles.status, backgroundColor: ...}` — menyalin semua properti dari `styles.status`, kemudian mengganti nilai `backgroundColor` dan `color` sesuai kondisi yang berlaku saat itu.

---

### Langkah 4: Membuat Komponen `SearchBar.jsx`

File: `frontend/src/components/SearchBar.jsx`

Komponen ini menyediakan kolom pencarian. Pengguna dapat mengetik kata kunci, menekan tombol Cari, dan daftar item akan difilter. Tombol Clear tersedia untuk menghapus pencarian dan menampilkan semua item kembali.

```jsx
import { useState } from "react"

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(query)
    }

    const handleClear = () => {
        setQuery("")
        onSearch("")
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                placeholder="Cari item berdasarkan nama atau deskripsi..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.input}
            />
            <button type="submit" style={styles.btnSearch}>
                🔍 Cari
            </button>
            {query && (
                <button type="button" onClick={handleClear} style={styles.btnClear}>
                    ✕ Clear
                </button>
            )}
        </form>
    )
}

const styles = {
    form: {
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    input: {
        flex: 1,
        padding: "0.75rem 1rem",
        fontSize: "1rem",
        border: "2px solid #ddd",
        borderRadius: "8px",
        outline: "none",
    },
    btnSearch: {
        padding: "0.75rem 1.25rem",
        backgroundColor: "#2E75B6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    btnClear: {
        padding: "0.75rem 1rem",
        backgroundColor: "#f0f0f0",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
}

export default SearchBar
```

**Penjelasan kode:**

- `value={query}` dan `onChange={...}` — pola ini disebut *controlled input*. React menjadi pengendali nilai kolom input. Tanpa atribut `value`, tampilan kolom tidak akan berubah saat `handleClear` dipanggil meskipun state sudah dikosongkan.
- `type="button"` pada tombol Clear — setiap tombol di dalam elemen `<form>` secara default bertipe `submit`. Tanpa `type="button"`, tombol Clear akan memicu pengiriman form, bukan menjalankan fungsi `handleClear`.
- `{query && (...)}` — React hanya merender elemen jika kondisi sebelum `&&` bernilai `true`. Jika `query` kosong, tombol Clear tidak akan ditampilkan sama sekali.

---

### Langkah 5: Membuat Komponen `ItemForm.jsx`

File: `frontend/src/components/ItemForm.jsx`

Komponen ini menangani dua fungsi sekaligus: **menambah item baru** dan **mengedit item yang sudah ada**. Perilaku form berubah secara otomatis sesuai nilai `editingItem` yang diterima dari `App.jsx`.

```jsx
import { useState, useEffect } from "react"

function ItemForm({ onSubmit, editingItem, onCancelEdit }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        quantity: "0",
    })
    const [error, setError] = useState("")

    // Jika editingItem berubah, isi form dengan datanya
    useEffect(() => {
        if (editingItem) {
            setFormData({
                name: editingItem.name,
                description: editingItem.description || "",
                price: String(editingItem.price),
                quantity: String(editingItem.quantity),
            })
        } else {
            setFormData({ name: "", description: "", price: "", quantity: "0" })
        }
        setError("")
    }, [editingItem])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Validasi
        if (!formData.name.trim()) {
            setError("Nama item wajib diisi")
            return
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError("Harga harus lebih dari 0")
            return
        }

        const itemData = {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity) || 0,
        }

        try {
            await onSubmit(itemData, editingItem?.id)
            // Reset form setelah berhasil
            setFormData({ name: "", description: "", price: "", quantity: "0" })
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>
                {editingItem ? "✏️ Edit Item" : "➕ Tambah Item Baru"}
            </h2>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.row}>
                    <div style={styles.field}>
                        <label style={styles.label}>Nama Item *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Contoh: Laptop"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Harga (Rp) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Contoh: 15000000"
                            min="0"
                            step="any"
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.row}>
                    <div style={styles.field}>
                        <label style={styles.label}>Deskripsi</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Opsional"
                            style={styles.input}
                        />
                    </div>
                    <div style={{ ...styles.field, maxWidth: "150px" }}>
                        <label style={styles.label}>Jumlah Stok</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="0"
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.actions}>
                    <button type="submit" style={styles.btnSubmit}>
                        {editingItem ? "💾 Update Item" : "➕ Tambah Item"}
                    </button>
                    {editingItem && (
                        <button type="button" onClick={onCancelEdit} style={styles.btnCancel}>
                            ✕ Batal Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: "#f8f9fa",
        padding: "1.5rem",
        borderRadius: "12px",
        border: "2px solid #e0e0e0",
        marginBottom: "1.5rem",
    },
    title: {
        margin: "0 0 1rem 0",
        color: "#1F4E79",
        fontSize: "1.2rem",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
    },
    row: {
        display: "flex",
        gap: "1rem",
    },
    field: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: "bold",
        color: "#555",
    },
    input: {
        padding: "0.6rem 0.8rem",
        border: "2px solid #ddd",
        borderRadius: "6px",
        fontSize: "0.95rem",
        outline: "none",
    },
    actions: {
        display: "flex",
        gap: "0.75rem",
        marginTop: "0.5rem",
    },
    btnSubmit: {
        padding: "0.7rem 1.5rem",
        backgroundColor: "#548235",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: "bold",
    },
    btnCancel: {
        padding: "0.7rem 1.5rem",
        backgroundColor: "#e0e0e0",
        color: "#333",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.95rem",
    },
    error: {
        backgroundColor: "#FBE5D6",
        color: "#C00000",
        padding: "0.6rem 1rem",
        borderRadius: "6px",
        marginBottom: "0.75rem",
        fontSize: "0.9rem",
    },
}

export default ItemForm
```

**Penjelasan kode:**

- `useEffect(() => { ... }, [editingItem])` — nilai di dalam tanda kurung siku `[editingItem]` menentukan kapan `useEffect` dijalankan ulang. Artinya: setiap kali `editingItem` berubah nilainya, kode di dalam `useEffect` akan dieksekusi. Inilah cara form mengetahui bahwa pengguna baru saja memilih sebuah item untuk diedit.
- `setFormData((prev) => ({ ...prev, [name]: value }))` — `prev` adalah nilai state sebelumnya. `[name]` adalah nama kolom yang diperbarui, misalnya `"price"`. Cara ini memastikan hanya kolom yang berubah yang diperbarui; kolom lainnya tetap memiliki nilai semula.
- `editingItem?.id` — tanda `?.` disebut *optional chaining*. Artinya: ambil nilai `id` dari `editingItem` jika `editingItem` tidak bernilai `null` atau `undefined`. Jika `editingItem` adalah `null` (mode tambah), ekspresi ini menghasilkan `undefined` tanpa menyebabkan error.

---

### Langkah 6: Membuat Komponen `ItemCard.jsx`

File: `frontend/src/components/ItemCard.jsx`

Komponen ini menampilkan satu item dalam bentuk kartu yang berisi nama, harga, deskripsi, jumlah stok, tanggal dibuat, serta tombol Edit dan Hapus.

```jsx
function ItemCard({ item, onEdit, onDelete }) {
    const formatRupiah = (num) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "-"
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h3 style={styles.name}>{item.name}</h3>
                <span style={styles.price}>{formatRupiah(item.price)}</span>
            </div>

            {item.description && (
                <p style={styles.description}>{item.description}</p>
            )}

            <div style={styles.meta}>
                <span style={styles.quantity}>📦 Stok: {item.quantity}</span>
                <span style={styles.date}>🕐 {formatDate(item.created_at)}</span>
            </div>

            <div style={styles.actions}>
                <button onClick={() => onEdit(item)} style={styles.btnEdit}>
                    ✏️ Edit
                </button>
                <button onClick={() => onDelete(item.id)} style={styles.btnDelete}>
                    🗑️ Hapus
                </button>
            </div>
        </div>
    )
}

const styles = {
    card: {
        backgroundColor: "white",
        padding: "1.25rem",
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "0.5rem",
    },
    name: {
        margin: 0,
        fontSize: "1.1rem",
        color: "#1F4E79",
    },
    price: {
        fontWeight: "bold",
        color: "#548235",
        fontSize: "1rem",
        whiteSpace: "nowrap",
    },
    description: {
        color: "#666",
        fontSize: "0.9rem",
        margin: "0.25rem 0 0.75rem 0",
    },
    meta: {
        display: "flex",
        gap: "1rem",
        fontSize: "0.8rem",
        color: "#888",
        marginBottom: "0.75rem",
    },
    quantity: {},
    date: {},
    actions: {
        display: "flex",
        gap: "0.5rem",
        borderTop: "1px solid #f0f0f0",
        paddingTop: "0.75rem",
    },
    btnEdit: {
        flex: 1,
        padding: "0.5rem",
        backgroundColor: "#DEEBF7",
        color: "#1F4E79",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "bold",
    },
    btnDelete: {
        flex: 1,
        padding: "0.5rem",
        backgroundColor: "#FBE5D6",
        color: "#C00000",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "bold",
    },
}

export default ItemCard
```

**Penjelasan kode:**

- `onClick={() => onEdit(item)}` — penulisan `() =>` di depan fungsi diperlukan agar fungsi tidak langsung dieksekusi saat komponen dirender. Jika ditulis `onClick={onEdit(item)}` tanpa `() =>`, fungsi `onEdit` akan dipanggil saat halaman dimuat, bukan saat tombol ditekan oleh pengguna.
- `{item.description && (...)}` — jika `item.description` bernilai kosong atau `null`, blok JSX di dalamnya tidak akan dirender. Ini mencegah munculnya elemen `<p>` yang kosong pada kartu item.

---

### Langkah 7: Membuat Komponen `ItemList.jsx`

File: `frontend/src/components/ItemList.jsx`

Komponen ini bertanggung jawab menampilkan seluruh daftar item. Sebelum menampilkan item, komponen ini memeriksa dua kondisi terlebih dahulu: apakah data masih dimuat dari backend, dan apakah daftar item kosong.

```jsx
import ItemCard from "./ItemCard"

function ItemList({ items, onEdit, onDelete, loading }) {
  if (loading) {
    return <p style={styles.message}>⏳ Memuat data...</p>
  }

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>📭</p>
        <p style={styles.emptyText}>Belum ada item.</p>
        <p style={styles.emptyHint}>
          Gunakan form di atas untuk menambahkan item pertama.
        </p>
      </div>
    )
  }

  return (
    <div style={styles.grid}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "1rem",
  },
  message: {
    textAlign: "center",
    color: "#888",
    padding: "2rem",
    fontSize: "1.1rem",
  },
  empty: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "2px dashed #ddd",
  },
  emptyIcon: {
    fontSize: "3rem",
    margin: "0 0 0.5rem 0",
  },
  emptyText: {
    fontSize: "1.1rem",
    color: "#555",
    margin: "0 0 0.25rem 0",
  },
  emptyHint: {
    fontSize: "0.9rem",
    color: "#888",
    margin: 0,
  },
}

export default ItemList
```

**Penjelasan kode:**

- Komponen ini menggunakan pola **early return**: memeriksa kondisi satu per satu dari atas. Jika kondisi terpenuhi, komponen langsung mengembalikan tampilan yang sesuai tanpa memproses kondisi berikutnya. Pola ini lebih mudah dibaca dibandingkan menggunakan percabangan `if-else` di dalam JSX.
- `key={item.id}` — atribut `key` digunakan oleh React untuk mengidentifikasi setiap elemen dalam daftar. Dengan `key`, React hanya memperbarui elemen yang berubah saat ada penambahan atau penghapusan, tanpa merender ulang seluruh daftar. Gunakan nilai yang unik dan tetap seperti `id`, bukan nomor urut array yang nilainya dapat berubah.

---

### Langkah 8: Membangun Komponen Utama — `App.jsx`

File: `frontend/src/App.jsx` (ganti seluruh isinya)

`App.jsx` adalah komponen induk yang menjadi pusat kendali seluruh aplikasi. Semua data (state) disimpan di sini, dan semua fungsi aksi (tambah, edit, hapus, cari) didefinisikan di sini sebelum diteruskan ke komponen anak melalui props.

```jsx
import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import { fetchItems, createItem, updateItem, deleteItem, checkHealth } from "./services/api"

function App() {
  // ==================== STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== STATE SORTING ====================
  const [sortBy, setSortBy] = useState("latest")

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== ON MOUNT ====================
  useEffect(() => {
    checkHealth().then(setIsConnected)
    loadItems()
  }, [loadItems])

  // ==================== HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    if (editId) {
      await updateItem(editId, itemData)
      setEditingItem(null)
    } else {
      await createItem(itemData)
    }
    loadItems(searchQuery)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return

    try {
      await deleteItem(id)
      loadItems(searchQuery)
    } catch (err) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  // ==================== SORTING FUNCTION ====================
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }

    if (sortBy === "price") {
      return a.price - b.price
    }

    if (sortBy === "latest") {
      return b.id - a.id
    }

    return 0
  })

  // ==================== RENDER ====================
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <Header totalItems={totalItems} isConnected={isConnected} />

        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        <SearchBar onSearch={handleSearch} />

        {/* DROPDOWN SORTING */}
        <div style={styles.sortContainer}>
          <label style={styles.sortLabel}>Urutkan berdasarkan:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="name">Nama</option>
            <option value="price">Harga</option>
            <option value="latest">Terbaru</option>
          </select>
        </div>

        <ItemList
          items={sortedItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  sortContainer: {
    margin: "1rem 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  sortLabel: {
    fontWeight: "500",
  },

  sortSelect: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
}

export default App
```

**Penjelasan kode:**

- `useCallback` — tanpa `useCallback`, fungsi `loadItems` akan dibuat ulang setiap kali `App` dirender. Karena `loadItems` terdaftar sebagai dependency di `useEffect`, React akan menganggap ada perubahan dan menjalankan `useEffect` kembali. Hal ini memicu pengambilan data, yang mengubah state, yang memicu render ulang, dan seterusnya tanpa berhenti. `useCallback` mencegah hal tersebut dengan memastikan referensi fungsi tetap sama selama tidak ada perubahan pada dependency-nya.
- `finally { setLoading(false) }` — blok `finally` selalu dijalankan setelah blok `try` maupun `catch`, apapun hasilnya. Ini memastikan indikator loading selalu dimatikan, termasuk saat terjadi error, sehingga tampilan tidak tertahan di layar loading.
- `items.find((i) => i.id === id)` — mencari objek item berdasarkan id di dalam array state. Nama item yang ditemukan kemudian ditampilkan pada dialog konfirmasi penghapusan sehingga pengguna dapat memverifikasi item mana yang akan dihapus.

---

### Langkah 9: Memperbarui `App.css` dan `main.jsx`

**File: `frontend/src/App.css`** (ganti seluruh isinya)

```css
/* Reset default Vite styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

input:focus {
  border-color: #2E75B6 !important;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  transition: all 0.15s;
}
```

**File: `frontend/src/main.jsx`** (pastikan baris import App.css tersedia)

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

---

### Langkah 10: Mengatur Environment Variable

**Buat file `frontend/.env`** — file ini tidak boleh di-commit ke Git:
```
VITE_API_URL=http://localhost:8000
```

**Buat file `frontend/.env.example`** — file ini yang di-commit sebagai referensi untuk anggota tim:
```
VITE_API_URL=http://localhost:8000
```

**Periksa file `.gitignore`** di root project — pastikan kedua baris berikut sudah ada:
```
backend/.env
frontend/.env
```

> 💡 **Mengapa perlu file `.env.example`?**  
> File `.env` tidak boleh di-commit karena dapat berisi informasi sensitif. Anggota tim yang baru bergabung memerlukan panduan untuk mengetahui variabel apa yang perlu dikonfigurasi. File `.env.example` berperan sebagai panduan tersebut. Anggota tim cukup menyalin file ini menjadi `.env` dan mengisi nilainya sesuai konfigurasi masing-masing.

---

### Langkah 11: Menjalankan Aplikasi

Buka **dua terminal** secara bersamaan:

**Terminal 1 — Menjalankan Backend:**
```bash
cd cloud-team-XX/backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Menjalankan Frontend:**
```bash
cd cloud-team-XX/frontend
cp .env.example .env
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.  
Jika Header menampilkan **🟢 API Connected**, kedua layanan berjalan dengan benar.

---

### Langkah 12: Pengujian dan Commit

Lakukan pengujian seluruh fitur secara berurutan:

| No | Fitur yang Diuji | Cara Menguji | Hasil yang Diharapkan |
|---|---|---|---|
| 1 | Status koneksi API | Buka `localhost:5173` | Badge **🟢 API Connected** tampil di Header |
| 2 | Menampilkan data | Lihat daftar tanpa melakukan aksi | Item dari Modul 2 tampil secara otomatis |
| 3 | Menambah item | Isi form → klik Tambah Item | Jumlah item di Header bertambah satu |
| 4 | Verifikasi penambahan | Lihat daftar setelah menambah | Item baru langsung tampil tanpa perlu refresh |
| 5 | Memulai edit | Klik tombol ✏️ Edit pada salah satu item | Form beralih ke mode "✏️ Edit Item", semua kolom terisi data lama |
| 6 | Menyimpan hasil edit | Ubah harga → klik Update Item | Data di daftar diperbarui, form kembali kosong |
| 7 | Pencarian item | Ketik kata kunci di SearchBar → klik Cari | Daftar hanya menampilkan item yang sesuai |
| 8 | Memulai penghapusan | Klik tombol 🗑️ Hapus pada salah satu item | Dialog konfirmasi tampil beserta nama item |
| 9 | Mengonfirmasi penghapusan | Klik OK pada dialog | Item hilang dari daftar secara otomatis |
| 10 | Tampilan kosong | Hapus seluruh item yang ada | Tampilan 📭 "Belum ada item." muncul |

**Setelah seluruh pengujian berhasil, lakukan commit:**
```bash
git add frontend/
git commit -m "feat: add React CRUD frontend with component architecture

- Add api.js: centralized API service layer
- Add Header component: title, stats, API status
- Add SearchBar component: search with clear
- Add ItemForm component: create/edit with validation
- Add ItemCard component: display item with edit/delete
- Add ItemList component: grid layout with empty state
- Update App.jsx: state management, CRUD handlers"

git push origin main
```

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

## 🚀 Cara Menjalankan

> ⚠️ Backend harus sudah berjalan di port 8000 sebelum menjalankan frontend.

```bash
# Terminal 1 — Backend
cd cloud-team-XX/backend
uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd cloud-team-XX/frontend
cp .env.example .env
npm install
npm run dev
```

| URL | Keterangan |
|---|---|
| `http://localhost:5173` | Aplikasi Frontend React |
| `http://localhost:8000/docs` | Dokumentasi API (Swagger UI) |
| `http://localhost:8000/health` | Memeriksa status backend |

---

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration | ⬜ |
| 5-7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9-11 | CI/CD Pipeline | ⬜ |
| 12-14 | Microservices | ⬜ |
| 15-16 | Final & UAS | ⬜ |