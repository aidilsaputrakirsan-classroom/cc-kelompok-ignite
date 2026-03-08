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
  - [📁 Struktur Proyek](#-struktur-proyek-1)
  - [🏗️ Panduan Membangun REST API dari Nol](#️-panduan-membangun-rest-api-dari-nol)
    - [Langkah 1: Siapkan Database PostgreSQL](#langkah-1-siapkan-database-postgresql)
    - [Langkah 2: Buat File Konfigurasi `.env`](#langkah-2-buat-file-konfigurasi-env)
    - [Langkah 3: Install Dependencies](#langkah-3-install-dependencies)
    - [Langkah 4: Buat `database.py` — Koneksi ke Database](#langkah-4-buat-databasepy--koneksi-ke-database)
    - [Langkah 5: Buat `models.py` — Definisi Tabel Database](#langkah-5-buat-modelspy--definisi-tabel-database)
    - [Langkah 6: Buat `schemas.py` — Validasi Data dengan Pydantic](#langkah-6-buat-schemaspy--validasi-data-dengan-pydantic)
    - [Langkah 7: Buat `crud.py` — Business Logic](#langkah-7-buat-crudpy--business-logic)
    - [Langkah 8: Update `main.py` — Router \& Endpoints](#langkah-8-update-mainpy--router--endpoints)
    - [Langkah 9: Jalankan \& Test](#langkah-9-jalankan--test)
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
| **React** | Frontend SPA | Library JavaScript untuk membangun Single Page Application (SPA) yang responsif dan modular menggunakan component-based architecture. |
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

---

## 🚀 Getting Started

### Prasyarat
- **Python 3.10+**: Diperlukan untuk menjalankan modul FastAPI dan asynchronous logic.
- **Node.js 18+**: Diperlukan untuk kompilasi aset React dan manajemen package (NPM).
- **Git**: Untuk manajemen versi dan kolaborasi antar anggota tim.

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend akan berjalan di:

http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di:

http://localhost:5173

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
│   │   ├── App.jsx                ← Komponen utama React + integrasi API
│   │   └── main.jsx               ← Entry point React
│   ├── index.html
│   ├── package.json               ← Dependencies & scripts Node.js
│   └── vite.config.js             ← Konfigurasi Vite bundler
├── docs/
│   ├── api-test-results.md        ← (Lead Frontend) Dokumentasi hasil testing endpoint
│   ├── database-schema.md         ← (Lead CI/CD) Schema tabel database
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

## 📁 Struktur Proyek

```
cloud-team-ignite/
├── backend/
│   ├── main.py              ← Entry point, FastAPI router & endpoints
│   ├── database.py          ← Koneksi PostgreSQL via SQLAlchemy
│   ├── models.py            ← SQLAlchemy models (definisi tabel)
│   ├── schemas.py           ← Pydantic schemas (validasi request/response)
│   ├── crud.py              ← Fungsi CRUD (business logic)
│   ├── requirements.txt     ← Daftar dependencies Python
│   ├── .env                 ← ⛔ RAHASIA — jangan di-commit!
│   └── .env.example         ← ✅ Template .env — ini yang di-commit
├── frontend/
│   └── ...
├── docs/
│   └── ...
├── .gitignore
└── README.md
```

---

## 🏗️ Panduan Membangun REST API dari Nol



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
            {"name": "Nama 1", "nim": "NIM1", "role": "Lead Backend"},
            {"name": "Nama 2", "nim": "NIM2", "role": "Lead Frontend"},
            {"name": "Nama 3", "nim": "NIM3", "role": "Lead DevOps"},
            {"name": "Nama 4", "nim": "NIM4", "role": "Lead QA & Docs"},
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

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ⬜ |
| 4 | Full-Stack Integration | ⬜ |
| 5-7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9-11 | CI/CD Pipeline | ⬜ |
| 12-14 | Microservices | ⬜ |
| 15-16 | Final & UAS | ⬜ |