# ☁️ ATHSNAC — UMKM E-Commerce Platform

![CI Pipeline](https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ignite/actions/workflows/ci.yml/badge.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Last Updated](https://img.shields.io/badge/updated-2026--06-blue)

> Platform e-commerce cloud-native untuk digitalisasi bisnis UMKM RAZ'Q Balikpapan. Dibangun dengan arsitektur microservices sebagai proyek mata kuliah Komputasi Awan — Institut Teknologi Kalimantan.

---

## 📖 Daftar Isi

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Architecture Diagram (Microservices)](#️-arsitektur-sistem)
- [Architecture Evolution](#-architecture-evolution--journey)
- [Tech Stack](#️-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Getting Started](#-getting-started)
- [Docker & Docker Compose](#-docker--docker-compose)
- [API Documentation](#-dokumentasi-api)
- [Security Features](#-security-features)
- [Monitoring & Observability](#-monitoring--observability)
- [Deployment](#-deployment)
- [Documentation Links](#-dokumentasi)
- [Git Workflow](#-git-workflow--development-process)
- [DevOps Workflow](#-devops-workflow-guide)
- [Team Information](#-tim)
- [Roadmap](#-roadmap)

---

## 📌 Project Overview

**ATHSNAC** adalah platform e-commerce cloud-native yang dirancang untuk mendigitalisasi bisnis UMKM RAZ'Q Balikpapan. Platform ini memudahkan UMKM dalam:

- 📦 Mengelola katalog produk (Amplang, keripik pisang, abon, dan camilan lainnya)
- 💳 Menerima pesanan dan pembayaran online
- 📊 Melacak inventory dan status pesanan real-time
- ⭐ Menerima ulasan dan rating dari pelanggan

**Target Pengguna:**
- 👥 **Pelanggan:** Pembeli online yang ingin membeli produk UMKM
- 🔐 **Admin:** Tim UMKM untuk mengelola katalog, pesanan, dan pembayaran

---

## 🌐 Live Demo

**Aplikasi sudah live di internet! Akses production deployment:**

| Service | URL | Status |
|---------|-----|--------|
| 🎨 **Frontend** | [https://athsnac-frontend.up.railway.app](https://athsnac-frontend.up.railway.app) | ✅ Live |
| 🔧 **Backend API** | [https://athsnac-backend.up.railway.app](https://athsnac-backend.up.railway.app) | ✅ Live |
| 📚 **API Documentation** | [https://athsnac-backend.up.railway.app/docs](https://athsnac-backend.up.railway.app/docs) | ✅ Swagger UI |
| 💚 **Health Check** | [https://athsnac-backend.up.railway.app/health](https://athsnac-backend.up.railway.app/health) | ✅ API Status |

**Quick Access:**
1. Buka Frontend URL di atas
2. **Register** akun baru (role: Customer) atau login sebagai admin
3. Jelajahi katalog produk, tambah ke keranjang, checkout, dan lihat riwayat pesanan

**Testing API:**
- Gunakan **Swagger UI** untuk test endpoint interaktif
- Atau gunakan tools: Postman, curl, atau Insomnia

---

## 🏗️ Arsitektur Sistem

Proyek ATHSNAC menggunakan arsitektur **microservices** yang memisahkan setiap layanan secara independen dengan database per service, API Gateway sebagai entry point, dan monitoring/observability terintegrasi.

### Diagram 1: Microservices Architecture (Final)

```mermaid
flowchart TD
    USER["👤 User / Browser"] --> GW["🚪 API Gateway\nNginx — Port 80"]

    GW -->|"/auth/*"| AUTH["🔐 Auth Service\nFastAPI — Port 8001"]
    GW -->|"/items/*"| ITEM["📦 Item Service\nFastAPI — Port 8002"]
    GW -->|"/"| FE["⚛️ Frontend\nReact + Vite — Port 3000"]

    AUTH --> ADB[("🗄️ auth_db\nPostgreSQL")]
    ITEM --> IDB[("🗄️ item_db\nPostgreSQL")]
    ITEM -.->|"HTTP GET /verify\nToken Verification"| AUTH

    style USER fill:#e1f5ff
    style GW fill:#fff3e0
    style AUTH fill:#f3e5f5
    style ITEM fill:#f3e5f5
    style FE fill:#fce4ec
    style ADB fill:#e8f5e9
    style IDB fill:#e8f5e9
```

### Diagram 2: Overall Three-Tier Architecture

```mermaid
graph TB
    subgraph "🖥️ Frontend Layer (React + Vite)"
        Customer["👥 Customer Interface\n- CustomerHome\n- ShopPage\n- CartPage\n- OrdersPage"]
        Admin["🔐 Admin Dashboard\n- AdminDashboard\n- AdminProducts\n- AdminOrders\n- AdminPayments"]
        Auth["🔑 Auth Pages\n- LoginPage\n- RegisterPage\n- ProtectedRoute"]
    end

    subgraph "⚙️ Backend Layer (FastAPI + Python)"
        Routes["🛣️ Routes/Endpoints\nmain.py"]
        Schemas["📋 Data Validation\nschemas.py\nPydantic"]
        Auth_Service["🔐 Auth Service\nauth.py\nJWT + bcrypt"]
        CRUD["🔄 Business Logic\ncrud.py\nCRUD Ops"]
    end

    subgraph "💾 Data Layer (PostgreSQL)"
        Models["📊 SQLAlchemy Models\nmodels.py\nORM"]
        Database["🗄️ PostgreSQL Database\nUsers | Products | Orders\nCarts | Payments | Testimonials"]
    end

    subgraph "🔌 Services"
        API_Service["API Service Layer\nservices/api.js\nFetch Wrapper"]
    end

    Customer -->|HTTP GET/POST/PUT/DELETE| API_Service
    Admin -->|HTTP with JWT Token| API_Service
    Auth -->|Auth Requests| API_Service

    API_Service -->|REST API Calls| Routes
    Routes -->|Validate Input| Schemas
    Routes -->|Auth Check| Auth_Service
    Routes -->|Execute Logic| CRUD

    CRUD -->|ORM Queries| Models
    Models -->|SQL| Database

    Database -->|Result Set| Models
    Models -->|Python Objects| CRUD
    CRUD -->|JSON Response| Routes
    Routes -->|HTTP 200/201/400/401| API_Service
    API_Service -->|Update State| Customer
    API_Service -->|Update State| Admin

    style Customer fill:#e1f5e1
    style Admin fill:#ffe1e1
    style Auth fill:#e1e5ff
    style Routes fill:#fff4e1
    style Schemas fill:#ffe1f5
    style Auth_Service fill:#e1fff5
    style CRUD fill:#f5e1ff
    style Models fill:#ffe1e1
    style Database fill:#e1e1ff
    style API_Service fill:#fff9e1
```

### Diagram 3: Backend API Endpoints by Module

```mermaid
graph TD
    API["FastAPI Backend\n:8000"]

    subgraph Auth["🔑 Authentication"]
        Login["POST /auth/login"]
        Register["POST /auth/register"]
        GetMe["GET /auth/me"]
    end

    subgraph Products["🛍️ Products Module"]
        ListProd["GET /products"]
        CreateProd["POST /products\nAdmin Only"]
        DetailProd["GET /products/{id}"]
        UpdateProd["PUT /products/{id}\nAdmin Only"]
        DeleteProd["DELETE /products/{id}\nAdmin Only"]
        StatsProd["GET /products/stats\nAdmin Only"]
    end

    subgraph Cart["🛒 Shopping Cart"]
        ViewCart["GET /cart"]
        AddCart["POST /cart/items"]
        UpdateCart["PUT /cart/items/{id}"]
        DeleteCart["DELETE /cart/items/{id}"]
    end

    subgraph Orders["📦 Orders"]
        CreateOrder["POST /orders"]
        ListOrder["GET /orders"]
        AdminOrders["GET /orders/admin/all\nAdmin Only"]
        UpdateOrder["PUT /orders/{id}\nAdmin Only"]
    end

    subgraph Payments["💳 Payments"]
        CreatePay["POST /payments"]
        ListPay["GET /payments"]
        VerifyPay["PUT /payments/{id}\nAdmin Only"]
    end

    subgraph Testimonials["⭐ Testimonials"]
        CreateTest["POST /testimonials"]
        ListTest["GET /testimonials"]
        UpdateTest["PUT /testimonials/{id}"]
        ToggleTest["PUT /testimonials/{id}/toggle-visibility\nAdmin Only"]
    end

    API --> Auth
    API --> Products
    API --> Cart
    API --> Orders
    API --> Payments
    API --> Testimonials

    Auth -->|validate & create token| DB[(PostgreSQL\nusers)]
    Products -..->|CRUD operations| DB[(PostgreSQL\nproducts)]
    Cart -..->|store cart| DB[(PostgreSQL\ncart_items)]
    Orders -..->|track orders| DB[(PostgreSQL\norders)]
    Payments -..->|validate payments| DB[(PostgreSQL\npayments)]
    Testimonials -..->|manage reviews| DB[(PostgreSQL\ntestimonials)]

    style API fill:#fff9e1
    style Auth fill:#e1e5ff
    style Products fill:#e1f5e1
    style Cart fill:#fff4e1
    style Orders fill:#ffe1f5
    style Payments fill:#e1fff5
    style Testimonials fill:#ffe1e1
    style DB fill:#e1e1ff
```

### Diagram 4: Entity Relationship Diagram (ERD)

![ERD ATHSNAC](./docs/images/erd%20cc.drawio.png)

**📊 Daftar Tabel & Penjelasan:**

| Tabel | Deskripsi | Field Utama |
|-------|-----------|-------------|
| **USER** | Menyimpan data pengguna (customer & admin) | id, email, name, password_hash, role, phone, address |
| **PRODUCT** | Katalog produk UMKM | id, name, description, category, price, stock, image_url |
| **CART** | Keranjang belanja per user | id, user_id, status |
| **CARTITEM** | Item dalam keranjang | id, cart_id, product_id, quantity, price_at_time, subtotal |
| **ORDER** | Pesanan yang ditempatkan customer | id, user_id, order_code, receipt_name, total_amount, status |
| **ORDERITEM** | Item dalam order | id, order_id, product_id, quantity, price_at_time, subtotal |
| **PAYMENT** | Metode pembayaran & verifikasi | id, order_id, payment_method, amount, payment_status, verified_by |
| **TESTIMONIAL** | Review/rating produk dari customer | id, product_id, user_id, order_id, rating, comment, is_visible |

> - **Frontend (React + Vite)** berjalan di port **5173** (dev) / **3000** (Docker) dengan hot-reload development server
> - **Backend (FastAPI + Uvicorn)** berjalan di port **8000** dengan auto-documentation Swagger UI
> - **Database (PostgreSQL)** di port **5432** dengan SQLAlchemy ORM untuk abstraksi query
> - **JWT Authentication** memastikan setiap request authenticated dan ter-validasi role-nya
> - **Separation of Concerns** memisahkan routing, validasi, business logic, dan data access dalam file terpisah

---

## 📈 Architecture Evolution / Journey

Proyek ATHSNAC berevolusi dari aplikasi monolith sederhana menjadi platform microservices production-ready sepanjang semester:

| Phase | Modul | Arsitektur | Pencapaian Utama |
|-------|-------|-----------|-----------------|
| **Foundation** | 1–4 | Monolith (FastAPI + React + PostgreSQL) | REST API, CRUD, JWT Auth, React UI |
| **Containerization** | 5–7 | Docker Compose (3 containers) | Docker image, multi-service compose |
| **CI/CD & Cloud** | 9–11 | GitHub Actions + Railway deployment | Automated test & deploy pipeline |
| **Microservices** | 12 | Auth Service + Item Service + Gateway | Database per service, Nginx routing |
| **Reliability** | 13 | Retry, Circuit Breaker, Graceful Degradation | Fault tolerance antar service |
| **Observability** | 14 | Structured Logging + Metrics + Correlation ID | Full observability stack |
| **Security & Polish** | 15 | Rate Limiting + Input Validation + Secret Audit | Production-ready security hardening |

---

## 🛠️ Tech Stack

| Layer | Teknologi | Versi | Fungsi |
|-------|-----------|-------|--------|
| **Frontend** | React + Vite | 18 / 5 | Single Page Application |
| **Backend** | FastAPI (Python) | 0.115+ | REST API microservices |
| **Database** | PostgreSQL | 15 (Alpine) | Relational database (per service) |
| **Gateway** | Nginx | Alpine | Reverse proxy + rate limiting |
| **Auth** | JWT (python-jose) | — | Token-based authentication |
| **Auth** | passlib + bcrypt | — | Password hashing |
| **Validation** | Pydantic v2 | v2 | Input/output validation & schemas |
| **ORM** | SQLAlchemy | — | Database abstraction layer |
| **Container** | Docker + Docker Compose | — | Containerization & orchestration |
| **CI/CD** | GitHub Actions | — | Automated test + deploy |
| **Cloud** | Railway | — | PaaS deployment |
| **HTTP Client** | Fetch API | — | Frontend-to-backend communication |

---

## ✨ Fitur Utama

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
- ✅ **Rate Limiting** — API Gateway membatasi request (5 req/s auth, 20 req/s API)
- ✅ **Input Validation** — Semua input divalidasi ketat dengan Pydantic

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

## 🚀 Getting Started

### Prasyarat

**🔴 Wajib Diinstall:**
- **Docker & Docker Compose** ← Cara termudah, semua otomatis
  - Download dari [docker.com](https://www.docker.com/products/docker-desktop)
  - Verifikasi: `docker --version` dan `docker compose --version`
- **Python 3.10+**: Diperlukan untuk menjalankan modul FastAPI, SQLAlchemy, dan async logic
- **PostgreSQL 12+**: ⚠️ **WAJIB** untuk menjalankan tanpa Docker
- **Node.js 18+ (include npm)**: Diperlukan untuk build dan dependency management frontend React
- **Git**: Untuk manajemen versi dan kolaborasi tim

**ℹ️ Verifikasi Instalasi:**
```bash
python --version
psql --version
node --version
npm --version
git --version
```

---

## 🚀 Cara Menjalankan

### Opsi A — Docker Compose (Direkomendasikan)

> ✅ **Paling mudah** — Tidak perlu setup PostgreSQL, backend, atau frontend secara manual.

```bash
# 1. Clone repository
git clone https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ignite.git
cd cc-kelompok-ignite

# 2. Salin environment file
cp .env.prod.example .env
# Edit .env — isi nilai yang sesuai

# 3. Jalankan semua services
docker compose up -d

# 4. Tunggu ~10 detik untuk services startup, lalu verifikasi
docker compose ps
curl http://localhost/health
```

✅ Aplikasi siap:
- **Frontend**: http://localhost:3000
- **Backend API (via Gateway)**: http://localhost
- **Auth Health**: http://localhost/auth/health
- **Item Health**: http://localhost/items/health
- **PostgreSQL**: localhost:5432

---

### Opsi B — Tanpa Docker (Manual)

> ⚠️ Memerlukan 3 terminal. Pastikan PostgreSQL sudah berjalan.

#### 1. Clone Repository

```bash
git clone https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ignite.git
cd cc-kelompok-ignite
```

#### 2. Setup & Jalankan Auth Service

```bash
cd services/auth-service

# Buat dan aktifkan virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variables
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
set SECRET_KEY=dev-secret-key-change-me-in-production

# Jalankan Auth Service
uvicorn main:app --reload --port 8001
```

✅ Auth Service: `http://localhost:8001`

#### 3. Setup & Jalankan Item Service

Buka terminal baru:

```bash
cd services/item-service

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/item_db
set AUTH_SERVICE_URL=http://localhost:8001

uvicorn main:app --reload --port 8002
```

✅ Item Service: `http://localhost:8002`

#### 4. Jalankan Frontend

Buka terminal baru:

```bash
cd frontend

# Salin environment file
cp .env.example .env
# Pastikan berisi: VITE_API_URL=http://localhost:8001

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

✅ Frontend: `http://localhost:5173`

#### 5. Verifikasi

Buka `http://localhost:5173` — halaman **Login** akan tampil:
1. Registrasi akun baru (role: Customer)
2. Login dengan email & password yang baru didaftar
3. Cek Swagger UI Auth: `http://localhost:8001/docs`
4. Cek Swagger UI Item: `http://localhost:8002/docs`

---

## 🐳 Docker & Docker Compose

### Quick Start

```bash
# Clone & masuk ke direktori
git clone https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ignite.git
cd cc-kelompok-ignite

# Jalankan semua services (backend, frontend, gateway, postgres)
docker compose up -d

# Verifikasi semua services berjalan
docker compose ps
```

### Docker Compose Commands

```bash
# Lihat status semua services
docker compose ps

# Lihat logs real-time
docker compose logs -f

# Lihat logs service tertentu
docker compose logs -f auth-service
docker compose logs -f item-service
docker compose logs -f gateway
docker compose logs -f frontend

# Jalankan services di background
docker compose up -d

# Stop semua services (data tetap tersimpan)
docker compose down

# Stop services & hapus semua data/volumes
docker compose down -v

# Restart semua services
docker compose restart

# Rebuild images & jalankan ulang
docker compose up -d --build
```

### Docker Hub Image Reference

| Service | Image | Versi | Fungsi |
|---------|-------|-------|--------|
| **Backend** | `python:3.11-slim` | 3.11 | FastAPI + SQLAlchemy |
| **Frontend** | `node:18-alpine` | 18 | React + Vite build |
| **Database** | `postgres:15-alpine` | 15 | PostgreSQL dengan Alpine |
| **Nginx** | `nginx:alpine` | Alpine | Reverse proxy & rate limiting |

**Custom Images (dari Dockerfile lokal):**
- `athsnac-backend:latest` — dibangun dari `backend/Dockerfile`
- `athsnac-frontend:latest` — dibangun dari `frontend/Dockerfile`

### Container Ports

| Container | Port Eksternal | Fungsi |
|-----------|---------------|--------|
| Gateway (Nginx) | 80 | Entry point semua request |
| Frontend | 3000 | React application |
| Auth Service | 8001 | Authentication & JWT |
| Item Service | 8002 | Inventory management |
| Auth Database | 5434 | PostgreSQL auth_db |
| Item Database | 5435 | PostgreSQL item_db |

### Environment Setup untuk Docker

Buat file `.env` di root project (salin dari `.env.prod.example`):

```env
# Database
POSTGRES_USER=athsnac_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=athsnac_db
DATABASE_URL=postgresql://athsnac_user:your_secure_password_here@db:5432/athsnac_db

# Backend
SECRET_KEY=your_super_secret_key_generate_with_openssl_rand_hex_32
DEBUG=False

# Frontend (via Gateway di Docker)
VITE_API_URL=http://localhost
```

> ⚠️ **PENTING**: Jangan pernah commit file `.env` ke Git! File `.env.prod.example` hanya berisi placeholder.

---

## 📡 Dokumentasi API

Dokumentasi lengkap tersedia di: [`docs/api-documentation.md`](docs/api-documentation.md) dan [`docs/api-contract.md`](docs/api-contract.md)

### Base URL

```
# Lokal (via Docker Gateway)
http://localhost

# Lokal (langsung ke service)
http://localhost:8001    ← Auth Service
http://localhost:8002    ← Item Service

# Production
https://athsnac-backend.up.railway.app
```

### 📊 Tabel Ringkasan Endpoint

| Modul | Method | Endpoint | Deskripsi | Auth |
|:------|:-------|:---------|:----------|:-----|
| SYSTEM | `GET` | `/` | Root endpoint (Identitas aplikasi) | ❌ |
| SYSTEM | `GET` | `/health` | Health check (Status server & versi) | ❌ |
| SYSTEM | `GET` | `/team` | Informasi profil anggota Tim Ignite | ❌ |
| AUTH | `POST` | `/auth/register` | Registrasi akun baru (Admin/Customer) | ❌ |
| AUTH | `POST` | `/auth/login` | Login untuk mendapatkan JWT Token | ❌ |
| AUTH | `GET` | `/auth/me` | Ambil profil user yang sedang login | ✅ |
| AUTH | `GET` | `/auth/verify` | Verifikasi token (internal antar service) | ✅ |
| AUTH | `GET` | `/auth/health` | Health check Auth Service | ❌ |
| AUTH | `GET` | `/auth/metrics` | Metrics Auth Service | ❌ |
| PRODUCTS | `POST` | `/products` | Buat produk baru (Admin Only) | ✅ Admin |
| PRODUCTS | `GET` | `/products` | Daftar produk (+ search & filter) | ❌ |
| PRODUCTS | `GET` | `/products/stats` | Statistik inventori & total nilai stok | ✅ Admin |
| PRODUCTS | `GET` | `/products/{id}` | Detail produk spesifik | ❌ |
| PRODUCTS | `PUT` | `/products/{id}` | Update data/stok produk (Admin Only) | ✅ Admin |
| PRODUCTS | `DELETE` | `/products/{id}` | Hapus produk secara permanen | ✅ Admin |
| ITEMS | `GET` | `/items` | List items per user (microservice) | ✅ |
| ITEMS | `POST` | `/items` | Buat item baru (microservice) | ✅ |
| ITEMS | `PUT` | `/items/{id}` | Update item (microservice) | ✅ |
| ITEMS | `DELETE` | `/items/{id}` | Hapus item (microservice) | ✅ |
| ITEMS | `GET` | `/items/health` | Health check Item Service | ❌ |
| ITEMS | `GET` | `/items/metrics` | Metrics Item Service | ❌ |
| CART | `GET` | `/cart` | Lihat isi keranjang belanja aktif | ✅ |
| CART | `POST` | `/cart/items` | Tambah produk ke keranjang | ✅ |
| CART | `PUT` | `/cart/items/{id}` | Update kuantitas item di keranjang | ✅ |
| CART | `DELETE` | `/cart/items/{id}` | Hapus item dari keranjang | ✅ |
| ORDERS | `POST` | `/orders` | Checkout/Buat pesanan baru | ✅ |
| ORDERS | `GET` | `/orders` | Riwayat pesanan milik customer | ✅ |
| ORDERS | `GET` | `/orders/admin/all` | Lihat semua pesanan masuk (Admin Only) | ✅ Admin |
| ORDERS | `PUT` | `/orders/{id}` | Update status pengiriman (Admin Only) | ✅ Admin |
| PAYMENTS | `POST` | `/payments` | Upload bukti pembayaran | ✅ |
| PAYMENTS | `GET` | `/payments` | Daftar pembayaran (Isolasi User/Admin) | ✅ |
| PAYMENTS | `PUT` | `/payments/{id}` | Verifikasi pembayaran oleh Admin | ✅ Admin |
| TESTIMONIALS | `POST` | `/testimonials` | Buat ulasan produk | ✅ |
| TESTIMONIALS | `GET` | `/testimonials` | Daftar testimoni publik | ❌ |
| TESTIMONIALS | `PUT` | `/testimonials/{id}` | Update ulasan (Pemilik Only) | ✅ |
| TESTIMONIALS | `PUT` | `/testimonials/{id}/toggle-visibility` | Sembunyikan/Tampilkan ulasan (Admin) | ✅ Admin |

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
│  3. AKSES DATA (setiap request ke endpoint terproteksi)     │
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

### Contoh Response Login

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

---

## 🔑 Authentication Detail

ATHSNAC menggunakan **JWT (JSON Web Token)** untuk autentikasi dan otorisasi.

**JWT terdiri dari 3 bagian:** `header.payload.signature`
- **Header**: Tipe token dan algoritma hashing
- **Payload**: Data user (id, email, role) — dapat di-decode tapi tidak dapat diubah
- **Signature**: Tanda tangan digital yang membuktikan token valid

**Token Properties:**
- Tipe: Bearer token
- Durasi: 60 menit (configurable via `TOKEN_EXPIRE_MINUTES`)
- Format: JWT dengan 3 bagian

### Role-Based Access Control (RBAC)

| Endpoint | Role Diizinkan | Deskripsi |
|----------|----------------|-----------|
| `POST /products` | `admin` | Hanya admin dapat membuat produk baru |
| `PUT /products/{id}` | `admin` | Hanya admin dapat mengubah produk |
| `DELETE /products/{id}` | `admin` | Hanya admin dapat menghapus produk |
| `GET /products/stats` | `admin` | Hanya admin dapat lihat statistik |
| `GET /orders/admin/all` | `admin` | Hanya admin dapat lihat semua pesanan |
| `PUT /orders/{id}` | `admin` | Hanya admin dapat ubah status pesanan |
| `PUT /payments/{id}` | `admin` | Hanya admin dapat verifikasi pembayaran |
| `PUT /testimonials/{id}/toggle-visibility` | `admin` | Hanya admin dapat moderasi testimoni |

---

## 🔐 Security Features

| Fitur | Implementasi | Status |
|-------|-------------|--------|
| JWT Authentication | Token dengan expiry 60 menit | ✅ |
| Password Hashing | bcrypt — tidak pernah plain-text | ✅ |
| Rate Limiting | Nginx: 5 req/s auth, 20 req/s API | ✅ |
| Input Validation | Pydantic v2 — semua endpoint | ✅ |
| CORS | Dikonfigurasi per environment | ✅ |
| Secret Management | Semua credential via environment variables | ✅ |
| Database Isolation | Database terpisah per service | ✅ |
| OWASP A01 | Items difilter by `owner_id` | ✅ |
| OWASP A02 | bcrypt hashing + env vars | ✅ |
| OWASP A03 | SQLAlchemy ORM + Pydantic validation | ✅ |
| OWASP A07 | JWT expiry + rate limiting login | ✅ |
| OWASP A09 | Structured logging dengan correlation ID | ✅ |

### Rate Limiting (Nginx Gateway)

| Zone | Rate | Burst | Target |
|------|------|-------|--------|
| `auth_limit` | 5 req/s | 10 | Login/register — mencegah brute force |
| `api_limit` | 20 req/s | 30 | CRUD operations — penggunaan normal |
| `general_limit` | 30 req/s | 50 | Frontend dan route lainnya |

---

## 📊 Monitoring & Observability

### Health Check Endpoints

```bash
# Gateway
curl http://localhost/health

# Auth Service
curl http://localhost/auth/health

# Item Service
curl http://localhost/items/health
```

### Metrics Endpoints

```bash
# Auth Service Metrics
curl http://localhost/auth/metrics

# Item Service Metrics
curl http://localhost/items/metrics
```

Metrics yang tersedia per service:
- `total_requests` — Total jumlah request diterima
- `total_errors` — Total error yang terjadi
- `error_rate_percent` — Persentase error
- `status_code_distribution` — Distribusi HTTP status code
- `avg_latency_ms` — Rata-rata latensi
- `p50_latency_ms` — Latensi P50 (median)
- `p95_latency_ms` — Latensi P95
- `p99_latency_ms` — Latensi P99

### Structured Logging

Setiap request dicatat dalam format JSON dengan field:
- `timestamp` — Waktu request
- `method` — HTTP method (GET, POST, dll)
- `endpoint` — URL endpoint
- `status_code` — HTTP response code
- `duration_ms` — Lama proses request
- `correlation_id` — ID unik untuk tracing antar service

```bash
# Lihat structured logs
docker compose logs auth-service --tail=20
docker compose logs item-service --tail=20

# Monitor real-time
docker compose logs -f
```

### Correlation ID Tracing

Setiap request memiliki `correlation_id` unik yang diteruskan antar service, sehingga dapat di-trace end-to-end:

```bash
# Lakukan request
curl http://localhost/items -H "Authorization: Bearer TOKEN"

# Cari correlation_id yang sama di log kedua service
docker compose logs auth-service | grep "9bc39dc6"
docker compose logs item-service | grep "9bc39dc6"
```

Lihat panduan lengkap: [`docs/operations-guide.md`](docs/operations-guide.md)

---

## 🚀 Deployment

Proyek ini di-deploy ke **Railway** (PaaS — Platform as a Service).

| Environment | URL |
|------------|-----|
| Frontend Production | https://athsnac-frontend.up.railway.app |
| Backend API Production | https://athsnac-backend.up.railway.app |

**Environment Variables Wajib di Production:**

| Variable | Keterangan |
|----------|-----------|
| `DATABASE_URL` | URL koneksi PostgreSQL production |
| `SECRET_KEY` | Random string min 32 karakter (gunakan `openssl rand -hex 32`) |
| `TOKEN_EXPIRE_MINUTES` | Durasi token JWT (default: 30) |
| `VITE_API_URL` | URL backend API untuk frontend |
| `POSTGRES_PASSWORD` | Password database (berbeda dari development) |

Panduan deployment lengkap: [`docs/deployment-guide.md`](docs/deployment-guide.md)

---

## 📁 Struktur Proyek

```
cc-kelompok-ignite/
├── backend/                       ← Monolith backend (Milestone 1 & 2)
│   ├── main.py                    ← Entry point, router, CORS, semua endpoint
│   ├── auth.py                    ← JWT utilities: buat token, verifikasi, hash password
│   ├── database.py                ← Koneksi PostgreSQL via SQLAlchemy
│   ├── models.py                  ← SQLAlchemy models
│   ├── schemas.py                 ← Pydantic schemas: validasi request/response
│   ├── crud.py                    ← Fungsi CRUD items & user
│   ├── requirements.txt           ← Daftar dependencies Python
│   ├── Dockerfile                 ← Konfigurasi Docker image backend
│   └── .env.example               ← ✅ Template konfigurasi
├── services/                      ← Microservices (Milestone 3)
│   ├── auth-service/              ← Auth Service FastAPI :8001
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── item-service/              ← Item Service FastAPI :8002
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   ├── auth_client.py         ← Client untuk verifikasi token ke Auth Service
│   │   ├── requirements.txt
│   │   └── Dockerfile
│   ├── gateway/                   ← Nginx API Gateway :80
│   │   └── nginx.conf
│   └── shared/                    ← Shared utilities
├── frontend/
│   ├── src/
│   │   ├── App.jsx                ← Root component & routing
│   │   ├── main.jsx               ← Entry point React
│   │   ├── components/            ← Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── CustomerNav.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   ├── ItemList.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── [Customer Pages]/  ← CustomerHome, ShopPage, CartPage, dll
│   │   │   └── [Admin Pages]/     ← AdminDashboard, AdminProducts, dll
│   │   └── services/
│   │       └── api.js             ← Centralized HTTP wrapper & token management
│   ├── .env.example               ← ✅ Template konfigurasi frontend
│   ├── package.json
│   └── vite.config.js
├── docs/                          ← Seluruh dokumentasi proyek
│   ├── architecture.md
│   ├── api-contract.md
│   ├── api-documentation.md
│   ├── deployment-guide.md
│   ├── operations-guide.md
│   ├── release-notes-m3.md
│   ├── reliability-testing.md
│   ├── testing-guide.md
│   └── images/
├── tests/                         ← Test suite
├── .github/                       ← GitHub Actions CI/CD
├── docker-compose.yml             ← Production compose
├── docker-compose.dev.yml         ← Development compose
├── Makefile                       ← Automation commands
├── .env.prod.example              ← ✅ Template environment variables
└── README.md                      ← Dokumentasi proyek (file ini)
```

---

## 📚 Dokumentasi

Seluruh dokumen hasil pengujian, referensi proyek, dan panduan teknis tersedia di folder `docs/`:

### 🧪 Quality Assurance & Testing Documentation

| File | Deskripsi | Status |
|------|-----------|--------|
| [production-test.md](docs/production-test.md) | Hasil production smoke testing — 8 test scenarios, security checks, deployment verification | ✅ Complete |
| [auth-test-results.md](docs/auth-test-results.md) | Hasil pengujian autentikasi & JWT authentication — 19/19 test cases | ✅ Complete |
| [api-test-results.md](docs/api-test-results.md) | Hasil pengujian lengkap semua endpoint API dengan request/response examples | ✅ Complete |
| [ui-test-results.md](docs/ui-test-results.md) | Hasil testing UI React — 10 test cases untuk customer & admin features | ✅ Complete |
| [reliability-testing.md](docs/reliability-testing.md) | Hasil pengujian reliability — retry, circuit breaker, graceful degradation | ✅ Complete |
| [image-comparison.md](docs/image-comparison.md) | Perbandingan ukuran Docker images (Alpine vs Full) dan optimization tips | ✅ Complete |

### 📖 Development & Architecture Documentation

| File | Deskripsi | Status |
|------|-----------|--------|
| [architecture.md](docs/architecture.md) | Dokumentasi arsitektur microservices lengkap dengan diagram | ✅ Complete |
| [api-contract.md](docs/api-contract.md) | Kontrak API resmi — format request/response semua endpoint | ✅ Complete |
| [api-documentation.md](docs/api-documentation.md) | Dokumentasi lengkap semua REST API endpoints dengan curl examples | ✅ Complete |
| [deployment-guide.md](docs/deployment-guide.md) | Panduan step-by-step deploy ke Railway, environment variables, troubleshooting | ✅ Complete |
| [operations-guide.md](docs/operations-guide.md) | Panduan operasional: health check, log monitoring, metrics, troubleshooting | ✅ Complete |
| [database-schema.md](docs/database-schema.md) | Skema tabel database PostgreSQL dengan ERD, relationships, dan field descriptions | ✅ Complete |
| [docker-architecture.md](docs/docker-architecture.md) | Arsitektur Docker & Docker Compose, layering, dan deployment strategy | ✅ Complete |
| [docker-cheatsheet.md](docs/docker-cheatsheet.md) | Referensi perintah Docker dan Docker Compose yang sering digunakan | ✅ Complete |
| [setup-guide.md](docs/setup-guide.md) | Panduan setup lengkap dari clone repository hingga running semua services | ✅ Complete |
| [git-workflow.md](docs/git-workflow.md) | Git workflow, branch naming conventions, PR process, dan merge strategy | ✅ Complete |

### 📋 Project Management & Release Notes

| File | Deskripsi | Status |
|------|-----------|--------|
| [release-notes-m3.md](docs/release-notes-m3.md) | Release notes Milestone 3 (v3.0.0) — Final release untuk UAS | ✅ Complete |
| [release-notes-m2.md](docs/release-notes-m2.md) | Release notes Milestone 2 — CI/CD & Cloud Deployment | ✅ Complete |
| [retrospective-m1.md](docs/retrospective-m1.md) | Retrospective meeting Milestone 1 — lessons learned & improvements | ✅ Complete |
| [uts-demo-script.md](docs/uts-demo-script.md) | Script demo untuk UTS presentation — feature walkthrough & testing checklist | ✅ Complete |

---

## 📋 Git Workflow & Development Process

### Branch Protection & PR Workflow
- ❌ **Direct push ke `main`**: Tidak diizinkan
- ✅ **Cara yang benar:**
  1. Buat feature branch: `git checkout -b feature/nama-fitur`
  2. Commit perubahan: `git commit -m "..."`
  3. Push ke branch: `git push origin feature/nama-fitur`
  4. Buat Pull Request di GitHub
  5. Tunggu review + 1 approval minimal
  6. Merge via "Squash and Merge" → history tetap bersih

### CODEOWNERS & Reviewer
- Reviewer otomatis ditambah per area code:
  - `/backend/` → @andinipermatadewanti
  - `/frontend/` → @10231074-sketch
  - `docker-compose.yml` → @10231050
  - `/docs/` → @desnitadwip

### Merge Strategy
- **Squash and Merge** = gabung semua commit jadi 1 saat merge
- Manfaat: history `main` rapi, mudah di-read, tidak berantakan

---

# 📘 DevOps Workflow Guide

### `make lint`
Menjalankan linter untuk memeriksa kualitas kode Python.

```bash
make lint
```

- Menggunakan **flake8** untuk style checking (max line length: 100)
- Mengecualikan folder: `.git`, `__pycache__`, `.venv`, `node_modules`

---

### `make test`
Menjalankan test suite menggunakan pytest.

```bash
make test
```

- Menjalankan semua test di folder `tests/`
- Output verbose (`-v`) dengan short traceback

> ⚠️ **Catatan:** Pastikan test files ada di folder `tests/` sebelum menjalankan.

---

### `make pr-check`
Menjalankan **full pipeline check** sebelum PR disubmit — wajib lolos sebelum merge.

```bash
make pr-check
```

Pipeline yang dijalankan secara berurutan:
1. 🐳 `docker-build` — Build Docker image (`app:latest`)
2. 🧪 `test` — Jalankan seluruh test suite

---

### `make build`
Meng-install semua dependency dari `requirements.txt`.

```bash
make build
```

---

### `make clean`
Membersihkan semua build artifacts dan cache.

```bash
make clean
```

File/folder yang dihapus: `__pycache__/`, `*.pyc`, `.pytest_cache/`, `*.egg-info/`

---

## 👥 Tim

| Nama | NIM | Peran | Kontribusi Utama |
|------|-----|-------|-----------------|
| Andini Permata Dewanti | 10231014 | Lead Backend | Auth Service, Item Service, API design, database schema |
| Putri Rahmawati | 10231074 | Lead Frontend | React UI (customer & admin), komponen reusable, UX flow |
| Krishandy Dhanysa Pratama | 10231050 | Lead DevOps | Docker, Nginx Gateway, Railway deployment, CI/CD pipeline |
| Desnita Dwi Putri | 10231030 | Lead QA & Docs | Testing, dokumentasi, operations guide, release notes |

---

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ✅ |
| 3 | React Frontend | ✅ |
| 4 | Full-Stack Integration + Auth | ✅ |
| 5–7 | Docker & Compose | ✅ |
| 8 | UTS Demo (Milestone 1) | ✅ |
| 9–11 | CI/CD Pipeline & Cloud Deployment | ✅ |
| 12 | Microservices Decomposition | ✅ |
| 13 | Reliability Engineering | ✅ |
| 14 | Observability & Monitoring | ✅ |
| 15 | Security Hardening & Final Polish | ✅ |
| 16 | UAS Demo (Milestone 3) | ⬜ |

---