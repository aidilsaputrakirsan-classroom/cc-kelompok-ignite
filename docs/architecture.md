# Dokumentasi Arsitektur Microservices - ATHSNACK
---

## Daftar Isi

1. [Gambaran Arsitektur](#gambaran-arsitektur)
2. [Layanan & Port](#layanan--port)
3. [Alur Komunikasi Antar Layanan](#alur-komunikasi-antar-layanan)
4. [Kontrak API](#kontrak-api)
5. [Menjalankan Secara Lokal](#menjalankan-secara-lokal)
6. [Panduan Debugging](#panduan-debugging)
7. [Solusi Masalah](#solusi-masalah)

---

## Gambaran Arsitektur

### Diagram Sistem

```mermaid
graph TB
    Client["👤 Client/Browser<br/>(Pelanggan)"]
    
    subgraph "Pintu Masuk"
        Gateway["🔌 API Gateway<br/>(Nginx Port 80)"]
    end
    
    subgraph "Layanan Aplikasi"
        AuthSvc["🔐 Layanan Autentikasi<br/>(Port 8001)"]
        ItemSvc["📦 Layanan Inventaris<br/>(Port 8002)"]
    end
    
    subgraph "Penyimpanan Data"
        AuthDB["🗄️ PostgreSQL<br/>(auth_db)"]
        ItemDB["🗄️ PostgreSQL<br/>(item_db)"]
    end
    
    subgraph "Interface Pengguna"
        FE["⚛️ Aplikasi React<br/>(Port 3000)"]
    end
    
    Client -->|HTTP| Gateway
    Gateway -->|/auth/*| AuthSvc
    Gateway -->|/items/*| ItemSvc
    Gateway -->|/| FE
    
    AuthSvc -->|Simpan/Ambil| AuthDB
    ItemSvc -->|Simpan/Ambil| ItemDB
    ItemSvc -->|Verifikasi Token| AuthSvc
    FE -->|Panggil API| Gateway
    
    style Client fill:#e1f5ff
    style Gateway fill:#fff3e0
    style AuthSvc fill:#f3e5f5
    style ItemSvc fill:#f3e5f5
    style AuthDB fill:#e8f5e9
    style ItemDB fill:#e8f5e9
    style FE fill:#fce4ec
```

### Ciri-Ciri Arsitektur

- **Pola Desain**: Database Terpisah per Layanan (Keamanan Data)
- **Komunikasi**: REST API melalui Gateway Nginx
- **Penemuan Layanan**: Networking Docker Compose
- **Autentikasi**: JWT Token (Layanan Autentikasi validasi, Layanan Inventaris verifikasi)
- **CORS**: Diaktifkan di semua layanan
- **Cek Kesehatan**: Pemeriksaan kesiapan PostgreSQL sebelum startup

---

## Layanan & Port

### Daftar Layanan

| Layanan | Port | Tipe | Database | Bahasa | Fungsi |
|---------|------|------|----------|--------|--------|
| **Layanan Autentikasi** | 8001 | Microservice | auth_db | Python/FastAPI | Login, registrasi & pembuatan JWT |
| **Layanan Inventaris** | 8002 | Microservice | item_db | Python/FastAPI | Kelola barang (CRUD) |
| **API Gateway** | 80 | Reverse Proxy | - | Nginx | Arahkan request ke layanan yang tepat |
| **Frontend** | 3000 | Aplikasi Web | - | React/Vite | Tampilan & Interface |
| **auth-db** | 5432* | Database | - | PostgreSQL | Penyimpanan data user |
| **item-db** | 5432* | Database | - | PostgreSQL | Penyimpanan data barang |

*Port database hanya untuk komunikasi internal di Docker network

### Kredensial Database (Hanya untuk Development)

```
Host: localhost (saat menjalankan lokal)
User: postgres
Password: postgres
Databases: auth_db, item_db
```

**⚠️ PENTING**: Ubah kredensial ini saat production (sistem live)!

---

## Alur Komunikasi Antar Layanan

### Skenario 1: User Mendaftar (Register)

```
Langkah 1: User buka browser → http://localhost/auth/register
           ↓
Langkah 2: Browser kirim form ke Gateway (port 80)
           ↓
Langkah 3: Gateway lihat URL "/auth/*" → teruskan ke Layanan Autentikasi (port 8001)
           ↓
Langkah 4: Layanan Autentikasi terima → validasi email, hash password
           ↓
Langkah 5: Layanan Autentikasi simpan ke auth-db
           ↓
Langkah 6: Layanan Autentikasi buat JWT Token (seperti "kartu anggota")
           ↓
Langkah 7: Kirim token kembali ke browser
```

**Contoh JWT Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

### Skenario 2: User Membuat Produk/Barang

```
Langkah 1: User (sudah login) klik "Buat Produk"
           ↓
Langkah 2: Browser kirim data + JWT token ke Gateway
           POST /items
           Header: Authorization: Bearer <TOKEN>
           ↓
Langkah 3: Gateway teruskan ke Layanan Inventaris (port 8002)
           ↓
Langkah 4: Layanan Inventaris terima token, tapi perlu verifikasi!
           "Apakah token ini valid?"
           ↓
Langkah 5: Layanan Inventaris PANGGIL Layanan Autentikasi
           GET http://auth-service:8001/verify
           Header: Authorization: Bearer <TOKEN>
           ↓
Langkah 6: Layanan Autentikasi jawab: "Iya, token valid. User ID = 1"
           ↓
Langkah 7: Layanan Inventaris OK, simpan produk ke item-db
           ↓
Langkah 8: Kirim produk yang sudah dibuat kembali
```

**Poin Penting:** Layanan Inventaris tidak percaya langsung ke token. Layanan Inventaris SELALU verifikasi ke Layanan Autentikasi dulu. Ini untuk keamanan.

---

### Komunikasi Antar Layanan

- **URL Layanan Autentikasi** (dari perspektif Layanan Inventaris):
  - Docker: `http://auth-service:8001`
  - Development lokal: `http://localhost:8001`

---

## Kontrak API

### Layanan Autentikasi

**URL dasar (via Gateway):** `http://localhost/auth`  
**URL langsung (jika berjalan sendiri):** `http://localhost:8001`

---

#### 1. Cek Kesehatan Sistem

```http
GET /health
```

**Jawaban (200 OK):**
```json
{
  "service": "auth-service",
  "status": "healthy"
}
```

---

#### 2. Pendaftaran User Baru

```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepass123"
}
```

**Jawaban Sukses (201 Dibuat):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "customer",
  "created_at": "2026-05-23T10:00:00",
  "updated_at": "2026-05-23T10:00:00"
}
```

**Jawaban Gagal (400):**
```json
{
  "detail": "Email sudah terdaftar"
}
```

---

#### 3. Login User

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Jawaban Sukses (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Jawaban Gagal (401):**
```json
{
  "detail": "Email atau password salah"
}
```

---

#### 4. Verifikasi Token (Untuk Layanan Lain)

```http
GET /verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Jawaban Sukses (200 OK):**
```json
{
  "user_id": 1,
  "email": "user@example.com",
  "role": "customer"
}
```

**Jawaban Gagal (401):**
```json
{
  "detail": "Format token tidak valid" | "Token kadaluarsa" | "Token tidak valid"
}
```

---

### Layanan Inventaris (Kelola Barang - CRUD)

**URL dasar (via Gateway):** `http://localhost/items`  
**URL langsung (jika berjalan sendiri):** `http://localhost:8002/items`

**Header yang Diperlukan:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

#### 1. Cek Kesehatan Sistem

```http
GET /health
```

**Jawaban (200 OK):**
```json
{
  "status": "healthy",
  "service": "item-service",
  "version": "2.0.0"
}
```

---

#### 2. Buat Barang Baru

```http
POST /items
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "name": "Tahu Goreng",
  "description": "Tahu goreng renyah dari Balikpapan",
  "category": "snacks",
  "slug": "tahu-goreng",
  "price": 25000,
  "stock": 50,
  "image_url": "https://example.com/tahu-goreng.jpg",
  "is_active": true
}
```

**Jawaban Sukses (201 Dibuat):**
```json
{
  "id": 1,
  "name": "Tahu Goreng",
  "description": "Tahu goreng renyah dari Balikpapan",
  "category": "snacks",
  "slug": "tahu-goreng",
  "price": 25000,
  "stock": 50,
  "image_url": "https://example.com/tahu-goreng.jpg",
  "is_active": true,
  "owner_id": 1,
  "created_at": null,
  "updated_at": null
}
```

**Jawaban Gagal (401):**
```json
{
  "detail": "Token tidak valid" | "Token kadaluarsa"
}
```

---

#### 3. Ambil Semua Barang

```http
GET /items?search=tahu&skip=0&limit=20
Authorization: Bearer <TOKEN>
```

**Parameter Query:**
- `search` (opsional): Cari barang berdasarkan nama
- `skip` (default: 0): Lewati berapa item
- `limit` (default: 20, max: 100): Tampilkan berapa item

**Jawaban Sukses (200 OK):**
```json
{
  "total": 1,
  "products": [
    {
      "id": 1,
      "name": "Tahu Goreng",
      "description": "Tahu goreng renyah dari Balikpapan",
      "category": "snacks",
      "slug": "tahu-goreng",
      "price": 25000,
      "stock": 50,
      "image_url": "https://example.com/tahu-goreng.jpg",
      "is_active": true,
      "owner_id": 1,
      "created_at": null,
      "updated_at": null
    }
  ]
}
```

---

#### 4. Ambil Barang Berdasarkan ID

```http
GET /items/1
Authorization: Bearer <TOKEN>
```

**Jawaban Sukses (200 OK):**
```json
{
  "id": 1,
  "name": "Tahu Goreng",
  "description": "Tahu goreng renyah dari Balikpapan",
  "category": "snacks",
  "slug": "tahu-goreng",
  "price": 25000,
  "stock": 50,
  "image_url": "https://example.com/tahu-goreng.jpg",
  "is_active": true,
  "owner_id": 1,
  "created_at": null,
  "updated_at": null
}
```

**Jawaban Gagal (404):**
```json
{
  "detail": "Barang tidak ditemukan"
}
```

---

#### 5. Ubah Barang

```http
PUT /items/1
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "price": 30000,
  "stock": 45
}
```

**Jawaban Sukses (200 OK):**
```json
{
  "id": 1,
  "name": "Tahu Goreng",
  "description": "Tahu goreng renyah dari Balikpapan",
  "category": "snacks",
  "slug": "tahu-goreng",
  "price": 30000,
  "stock": 45,
  "image_url": "https://example.com/tahu-goreng.jpg",
  "is_active": true,
  "owner_id": 1,
  "created_at": null,
  "updated_at": null
}
```

---

#### 6. Hapus Barang

```http
DELETE /items/1
Authorization: Bearer <TOKEN>
```

**Jawaban Sukses (204 Tidak Ada Konten)**

**Jawaban Gagal (404):**
```json
{
  "detail": "Barang tidak ditemukan"
}
```

---

## Menjalankan Secara Lokal

### Opsi 1: Docker Compose (Paling Mudah & Direkomendasikan)

Docker seperti "paket lengkap siap pakai". Semua layanan, database, sudah dikemas rapi dalam satu bundle.

#### Persyaratan

- Docker & Docker Compose sudah terinstall
- Python 3.9+ (jika perlu script khusus)
- Git

#### Langkah-Langkah Setup

```bash
# 1. Buka Terminal/PowerShell
cd c:\Users\ASUS\cc-kelompok-ignite

# 2. Jalankan docker compose (akan download & setup semuanya)
docker-compose up --build

# Tunggu sampai semua layanan siap (lihat: "healthy" atau "started")
```

**Output yang Normal:**
```
auth-db is healthy ✓
item-db is healthy ✓
auth-service started ✓
item-service started ✓
frontend started ✓
gateway started ✓
```

**Sekarang bisa akses:**
- Gateway: http://localhost (port 80)
- Frontend: http://localhost:3000
- Layanan Autentikasi: http://localhost:8001
- Layanan Inventaris: http://localhost:8002

#### Verifikasi Layanan

```bash
# Lihat semua container yang berjalan
docker ps

# Lihat log layanan tertentu
docker-compose logs auth-service
docker-compose logs item-service

# Cek kesehatan
curl http://localhost/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

---

### Opsi 2: Setup Manual (Jika Tidak Mau Pakai Docker)

Ini lebih ribet, tapi lebih "hands-on" untuk belajar.

#### Persyaratan

- Python 3.9+
- PostgreSQL 16+
- Node.js 18+
- Virtual environment (venv/conda)

#### Setup Layanan Autentikasi

```bash
# 1. Pergi ke folder layanan autentikasi
cd services/auth-service

# 2. Buat virtual environment (seperti "ruangan Python terisolasi")
python -m venv venv

# 3. Aktifkan virtual environment
venv\Scripts\activate   # Windows PowerShell
# atau
source venv/bin/activate  # Mac/Linux

# 4. Install dependency (library yang dibutuhkan)
pip install -r requirements.txt

# 5. Buat database
createdb auth_db
# atau gunakan psql:
psql -U postgres -c "CREATE DATABASE auth_db;"

# 6. Set variabel lingkungan
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/auth_db
set SECRET_KEY=dev-secret-key
set CORS_ORIGINS=http://localhost,http://localhost:5173,http://localhost:3000

# 7. Jalankan layanan
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

#### Setup Layanan Inventaris (Terminal Baru)

```bash
# 1. Pergi ke folder layanan inventaris
cd services/item-service

# 2. Buat virtual environment
python -m venv venv

# 3. Aktifkan
venv\Scripts\activate

# 4. Install dependency
pip install -r requirements.txt

# 5. Buat database
createdb item_db

# 6. Set variabel lingkungan
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/item_db
set AUTH_SERVICE_URL=http://localhost:8001
set CORS_ORIGINS=http://localhost,http://localhost:5173,http://localhost:3000

# 7. Jalankan layanan
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
```

#### Setup Frontend (Terminal Baru)

```bash
# 1. Pergi ke folder frontend
cd frontend

# 2. Install dependency
npm install

# 3. Set variabel lingkungan
set VITE_API_URL=http://localhost

# 4. Jalankan development server
npm run dev

# Frontend berjalan di http://localhost:5173
```

---

## Panduan Debugging

### Debug Layanan Autentikasi

#### Setup Debugging VSCode

**File: `.vscode/launch.json`**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Auth Service",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "main:app",
        "--host", "0.0.0.0",
        "--port", "8001",
        "--reload"
      ],
      "cwd": "${workspaceFolder}/services/auth-service",
      "jinja": true,
      "justMyCode": true,
      "env": {
        "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/auth_db",
        "SECRET_KEY": "dev-secret-key",
        "PYTHONUNBUFFERED": "1"
      }
    }
  ]
}
```

**Cara Pakai:**
1. Set breakpoint di `services/auth-service/main.py` (klik nomor baris)
2. Tekan `F5` atau klik "Run & Debug"
3. Pilih "Auth Service"
4. Jalankan step-by-step dan lihat variable

---

#### Logging & Debug

```python
# Di file: services/auth-service/main.py

import logging

logger = logging.getLogger(__name__)

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    logger.debug(f"Percobaan login untuk email: {data.email}")
    
    user = db.query(User).filter(User.email == data.email).first()
    
    if not user:
        logger.warning(f"User tidak ditemukan: {data.email}")
        raise HTTPException(status_code=401, detail="Kredensial tidak valid")
    
    logger.info(f"User {data.email} berhasil login")
    # ... kode selanjutnya
```

**Lihat log di Docker:**
```bash
docker-compose logs -f auth-service
```

---

### Debug Layanan Inventaris

#### Test Cepat

```bash
# 1. Daftar user & dapatkan token
curl -X POST http://localhost:8001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# 2. Login & copy token
TOKEN=$(curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.access_token')

# 3. Coba buat barang
curl -X POST http://localhost:8002/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "price": 50000,
    "stock": 10,
    "category": "snacks",
    "is_active": true
  }'
```

Jika ada error, lihat response-nya. Dokumentasi sudah tunjukkan error apa yang mungkin.

---

#### Debug Lokal

```bash
# 1. Aktifkan virtual environment
cd services/item-service
source venv/bin/activate  # atau venv\Scripts\activate di Windows

# 2. Jalankan dengan debug mode
uvicorn main:app --host 0.0.0.0 --port 8002 --reload --log-level debug

# 3. Di terminal lain, test endpoint
curl -X GET http://localhost:8002/health
```

---

### Debug Frontend

#### Setup Debugging React di VSCode

**File: `.vscode/launch.json`**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/frontend",
      "sourceMaps": true
    }
  ]
}
```

**Cara Pakai:**
1. Jalankan frontend: `npm run dev`
2. Tekan `F5` untuk attach debugger
3. Set breakpoint di React components
4. Jalankan action di browser, debugger akan berhenti

---

#### Shortcut Browser DevTools

```bash
# Chrome DevTools
Ctrl+Shift+I      # Buka DevTools
Ctrl+Shift+C      # Inspect elemen
F12               # Toggle DevTools
Ctrl+Shift+J      # Tab Console
```

---

## Skenario Debugging Umum

### Skenario 1: Verifikasi Token Gagal

**Tanda-Tanda:**
```
401 Unauthorized: "Token tidak valid" | "Token kadaluarsa"
```

**Solusi:**

```bash
# 1. Cek format token
# Token harus: "Bearer <token>"

# 2. Verifikasi token di Layanan Autentikasi
curl -X GET http://localhost:8001/verify \
  -H "Authorization: Bearer $TOKEN"

# 3. Cek expiry token
# Token default kadaluarsa setelah 60 menit

# 4. Pastikan SECRET_KEY sama di semua layanan
# Layanan Autentikasi: services/auth-service/.env
# Layanan Inventaris: services/item-service/.env
```

---

### Skenario 2: Koneksi Database Gagal

**Tanda-Tanda:**
```
Error: could not connect to server: Connection refused
  Is the server running on host "localhost" (127.0.0.1) and accepting TCP/IP connections on port 5432?
```

**Solusi:**

```bash
# 1. Cek apakah PostgreSQL jalan
# macOS:
brew services list | grep postgres

# Linux:
sudo systemctl status postgresql

# Windows:
sc query postgresql-x64-16

# 2. Cek database ada atau tidak
psql -U postgres -l | grep -E "auth_db|item_db"

# 3. Buat database yang hilang
psql -U postgres -c "CREATE DATABASE auth_db;"
psql -U postgres -c "CREATE DATABASE item_db;"

# 4. Verifikasi connection string
# Format: postgresql://user:password@host:port/dbname
# Contoh: postgresql://postgres:postgres@localhost:5432/auth_db
```

---

### Skenario 3: Layanan Tidak Bisa Komunikasi

**Tanda-Tanda:**
```
Layanan Inventaris tidak bisa jangkau Layanan Autentikasi
Error: Connection refused at http://localhost:8001
```

**Solusi:**

```bash
# 1. Cek apakah Layanan Autentikasi jalan
curl http://localhost:8001/health

# 2. Di Docker: Gunakan nama service bukan localhost
# ❌ Salah:
# AUTH_SERVICE_URL=http://localhost:8001

# ✓ Benar:
# AUTH_SERVICE_URL=http://auth-service:8001

# 3. Cek network
docker network ls
docker network inspect cc-kelompok-ignite_default

# 4. Lihat log layanan
docker-compose logs auth-service
```

---

### Skenario 4: Error CORS

**Tanda-Tanda:**
```
Access to XMLHttpRequest at 'http://localhost/items' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solusi:**

```bash
# 1. Cek konfigurasi CORS di layanan
# File: services/auth-service/main.py
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# 2. Update variabel lingkungan
set CORS_ORIGINS=http://localhost,http://localhost:5173,http://localhost:3000

# 3. Verifikasi header Gateway
# File: services/gateway/nginx.conf
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;

# 4. Restart layanan
docker-compose restart
```

---

## Perintah Debug Berguna

```bash
# Lihat semua container yang jalan
docker ps

# Masuk ke container & buka bash
docker-compose exec auth-service bash
docker-compose exec item-service bash
docker-compose exec auth-db psql -U postgres

# Lihat log (50 baris terakhir)
docker-compose logs --tail=50 auth-service

# Lihat log real-time
docker-compose logs -f item-service

# Build ulang layanan tertentu
docker-compose up --build auth-service

# Hapus semua container & volume
docker-compose down -v

# Test endpoint dengan output verbose
curl -v http://localhost:8001/health
```

---

## Debug Database

```bash
# Hubungkan ke database auth
docker-compose exec auth-db psql -U postgres -d auth_db

# Perintah SQL berguna
SELECT * FROM users;  -- Lihat semua user
SELECT * FROM users WHERE email = 'test@example.com';

# Cek ukuran database
SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database;

# Keluar dari psql
\q
```

---

## Solusi Masalah

### Layanan Tidak Mau Jalan

```bash
# 1. Lihat log Docker
docker-compose logs auth-service

# 2. Verifikasi port tersedia
# Linux/Mac:
lsof -i :8001
lsof -i :8002

# Windows (PowerShell):
netstat -ano | findstr :8001

# 3. Matikan proses yang memakai port
# Linux/Mac:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F

# 4. Build ulang layanan
docker-compose up --build
```

---

### Database Connection Pool Habis

```
sqlalchemy.exc.TimeoutError: QueuePool limit of size 5 overflow 10 reached
```

**Solusi:**

```python
# File: services/*/database.py
from sqlalchemy.pool import QueuePool

engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,      # Naikkan dari default 5
    max_overflow=20,   # Naikkan dari default 10
)
```

---

### Masalah Memory/Performance

```bash
# Monitor penggunaan resource container
docker stats

# Batasi memory layanan
# Tambahkan di docker-compose.yml:
services:
  auth-service:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

---

## Referensi Cepat

### Perintah Test Cepat

```bash
# Cek kesehatan semua layanan
curl http://localhost/health
curl http://localhost:8001/health
curl http://localhost:8002/health

# Daftarkan user baru
curl -X POST http://localhost:8001/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "password123"
  }'

# Login & dapatkan token
curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Buat barang (ganti TOKEN)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X POST http://localhost:8002/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Barang Sample",
    "price": 50000,
    "stock": 10,
    "category": "snacks",
    "slug": "barang-sample",
    "is_active": true
  }'
```
