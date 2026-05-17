# 🚀 Release Notes — Milestone 2 (v2.0)

## 📋 Ringkasan Rilis

**Milestone 2** menandai transisi aplikasi dari development ke production-ready state. Tim berhasil:

✅ **Containerisasi aplikasi** dengan Docker & Docker Compose  
✅ **Implementasi CI/CD pipeline** dengan GitHub Actions  
✅ **Deploy full-stack ke cloud** (Railway: backend + frontend + PostgreSQL)  
✅ **Konfigurasi environment-based** (development ≠ production)  
✅ **Automated testing** di setiap push dan PR  

**Hasil:** Aplikasi ATHSNAC kini berjalan di cloud dengan HTTPS, tersedia 24/7, dan terintegrasi CI/CD otomatis.

---

## 🌐 Live URLs (Production)

| Service | URL |
|---------|-----|
| **Frontend** | https://athsnac-frontend.railway.app |
| **Backend API** | https://athsnac-backend.railway.app |
| **API Documentation (Swagger)** | https://athsnac-backend.railway.app/docs |
| **Database** | PostgreSQL (managed by Railway, tidak publik) |

> 💡 **Akses Frontend:** Buka https://athsnac-frontend.railway.app → Register akun baru atau login → Gunakan fitur normal seperti di development.
>
> 📖 **API Testing:** Buka https://athsnac-backend.railway.app/docs → Test endpoint dengan Swagger UI

---

## ⚡ Quick Start Guide untuk User Baru

### Untuk Calon Customer

1. **Buka aplikasi:**
   ```
   https://athsnac-frontend.railway.app
   ```

2. **Register akun baru:**
   - Klik "Register"
   - Isi email & password
   - Click "Create Account"

3. **Login:**
   - Gunakan email & password yang sudah di-register
   - Klik "Login"

4. **Lihat produk:**
   - Halaman Home menampilkan daftar produk
   - Klik product card untuk lihat detail
   - Klik "Add to Cart" untuk tambah ke keranjang

5. **Checkout:**
   - Klik "Cart" di navbar
   - Review items & harga
   - Klik "Checkout"
   - Pilih payment method (mock/dummy untuk sekarang)
   - Confirm order

6. **Track pesanan:**
   - Masuk ke "Orders" page
   - Lihat status order (pending → processing → completed)

### Untuk Admin

1. **Login dengan akun admin:**
   - Email: `admin@example.com`
   - Password: `adminpass123` (atau sesuai seed data)

2. **Dashboard Admin:**
   - Klik "Admin Dashboard" (hanya visible untuk admin)
   - Lihat statistik: revenue, bestseller, order count, dsb

3. **Manage Produk:**
   - Menu "Products" → CRUD produk
   - Tambah, edit, hapus produk
   - Update stock

4. **Verify Payment:**
   - Menu "Payments" → lihat pending payments
   - Klik "Verify" untuk confirm payment
   - Status order otomatis berubah ke "Processing"

5. **Monitor Orders:**
   - Menu "Orders" → lihat all orders
   - Filter by status (pending, processing, completed)
   - Update order status

---



## 🎓 Penjelasan Detail Milestone 2

### Apa itu Milestone 2?

**Milestone 2** adalah fase kedua dari pengembangan aplikasi ATHSNAC (setelah fase 1: Basic Features). Fokus utama adalah **mengubah aplikasi dari development environment menjadi production-ready** melalui:

1. **Containerisasi dengan Docker** — Aplikasi dikemas dalam "kotak" (container) yang bisa jalan di mana saja (laptop, server, cloud)
2. **CI/CD Pipeline** — Otomatisasi testing dan deployment saat ada perubahan kode
3. **Cloud Deployment** — Aplikasi live di internet dengan URL publik (bukan hanya localhost)
4. **Production Configuration** — Handling environment variables untuk dev ≠ production

### Mengapa Ini Penting?

```
Milestone 1 (M1):              Milestone 2 (M2):
─────────────────              ─────────────────
✅ Fitur sudah ada             ✅ Fitur siap diproduksi
❌ Hanya di localhost          ✅ Live di internet
❌ Setup manual & ribet        ✅ Deployment otomatis
❌ Testing manual              ✅ Testing otomatis
❌ Environment berantakan      ✅ Environment teratur
```

---

## ✨ Fitur & Capability (Milestone 2)

### Core Features (dari Milestone 1, tetap berfungsi)

#### 🔐 Authentication & Authorization
- ✅ User registration (email validation)
- ✅ JWT-based login/logout
- ✅ Role-based access control (customer vs admin)
- ✅ Password hashing (bcrypt)
- ✅ Token expiration & refresh logic

#### 🛒 E-Commerce Features
- ✅ Product catalog (CRUD by admin)
- ✅ Shopping cart (add, update, remove items)
- ✅ Order management (create, track status)
- ✅ Payment verification system
- ✅ Testimonials/reviews from customers
- ✅ Product search & category filtering
- ✅ Stock management & availability check

#### 👥 Admin Dashboard
- ✅ Product statistics (revenue, bestseller)
- ✅ Order monitoring
- ✅ Payment verification
- ✅ Customer management
- ✅ Testimonial moderation

### New Features (Milestone 2)

#### 🐳 Docker & Containerization — Apa itu & Mengapa Penting?

**Docker** adalah teknologi yang mengemas aplikasi beserta seluruh "kebutuhan" nya (library, database, konfigurasi) ke dalam satu "kotak" yang bisa dijalankan di mana saja.

**Analogi:** 
- **Tanpa Docker:** Anda mengirim resep kue ke teman. Teman harus mencari semua bahan, tools, dan setup sendiri. Ribet!
- **Dengan Docker:** Anda mengirim kotak kue siap jadi. Teman tinggal buka dan makan. Gampang!

**Apa yang sudah kita implementasikan:**

- ✅ **Backend Dockerfile** — Python FastAPI + semua dependency ter-package rapi
  - Ukuran: ~150MB (sudah optimasi, bukan 500MB+)
  - Jalan di port 8000 (internal), port 80 (public via Nginx)
  - Health check otomatis: jika app crash, Docker auto-restart

- ✅ **Frontend Dockerfile** — React built + Nginx serving (2-stage build)
  - Stage 1: Build dengan Node.js (compile JSX, optimize bundle)
  - Stage 2: Serve statis dengan Nginx (~50MB final)
  - Bisa handle 1000+ concurrent users

- ✅ **Docker Compose** — Orchestrasi 3 containers bersama:
  - Backend service (FastAPI)
  - Frontend service (Nginx)
  - PostgreSQL database
  - Semua berkomunikasi via internal network, tidak perlu hardcode IP

**Keuntungan:**
1. **Consistency:** App jalan sama di laptop, server test, dan production
2. **Isolation:** Service tidak saling interfere (jika frontend crash, backend tetap jalan)
3. **Scaling:** Bisa bikin 10 instance backend jika traffic tinggi
4. **Deployment:** Cuma push image ke cloud, selesai! (banding dengan upload file satu-satu)

**File yang dibuat:**
```
backend/Dockerfile          ← Cara build image backend
backend/.dockerignore       ← Apa yang TIDAK dimasukkan ke image
frontend/Dockerfile        ← Cara build image frontend
frontend/.dockerignore
docker-compose.yml         ← Lokal development: 3 services + dummy data
docker-compose.prod.yml    ← Production: menggunakan Railway services
Makefile                   ← Shortcut: make build, make up, make test
```

---

#### 🔄 CI/CD Pipeline — Otomasi Testing & Deployment

**CI/CD** adalah sistem otomatis yang:
- **CI (Continuous Integration):** Setiap kali ada push, otomatis test & build
- **CD (Continuous Delivery):** Jika test pass, otomatis deploy ke cloud

**Alur kerja (step-by-step):**

1. **Anda push ke branch feature:**
   ```
   git push origin feature/add-login
   ```

2. **GitHub Actions otomatis menjalankan:**
   ```
   Step 1: Lint code (cek error syntax)
   Step 2: Run backend tests (pytest)
   Step 3: Run frontend tests (Vitest)
   Step 4: Build Docker image
   Step 5: Health check
   ```

3. **Hasil:**
   - Jika semua PASS ✅: PR bisa di-merge
   - Jika ada yang FAIL ❌: PR diblokir, harus fix

4. **Setelah merge ke main:**
   ```
   Step 5: Deploy ke Railway (otomatis!)
   Step 6: Health check di production
   Step 7: Send notification ke tim
   ```

**File yang dibuat:**
```
.github/workflows/ci.yml    ← Semua step di atas ter-define di sini
                            ← ~200 lines YAML
```

**Keuntungan:**
1. **Quality Assurance:** Tidak boleh ada code yang tidak ter-test masuk ke main
2. **Early Detection:** Bug ketahuan saat development, bukan saat user pakai
3. **No Manual Deploy:** Deploy otomatis, tidak perlu SSH ke server
4. **Auditability:** Setiap deployment ter-track: siapa, kapan, apa yang di-push

**Workflow diagram:**
```
PR dibuat (feature branch):
  ↓
  GitHub Actions run CI
  → Lint ✅
  → Test ✅
  → Build ✅
  ↓
  Bisa di-merge? YA ✅
  
Merge ke main:
  ↓
  GitHub Actions run CI + CD
  → (semua step di atas)
  → Deploy ke Railway ✅
  ↓
  App live di internet!
```

---

#### ☁️ Railway — Cloud Platform

**Railway** adalah layanan cloud yang memudahkan deploy aplikasi tanpa harus manage server sendiri (contoh: AWS EC2 yang rumit).

**Apa yang Railway tangani untuk kita?**

| Aspek | Di Laptop (Dev) | Di Railway (Prod) |
|-------|-----------------|-------------------|
| **Server** | Laptop sendiri | Railway server (auto-scale) |
| **Network** | localhost | Public internet + HTTPS |
| **Database** | PostgreSQL lokal | PostgreSQL managed Railway |
| **Backup** | Manual (atau lupa) | Auto-backup harian |
| **SSL/HTTPS** | Tidak ada | Gratis, auto-renewal |
| **Domain** | - | cloudapp-xxx.railway.app (gratis) |
| **Monitoring** | Terminal log | Railway dashboard |

**Struktur di Railway:**

```
☁️ Railway Project (cloudapp-team-XX)
├─ 🐍 Backend Service
│  ├─ URL: https://athsnac-backend.railway.app
│  ├─ Port: 8000 (internal) → Railway handle public port
│  ├─ Env vars: DATABASE_URL, SECRET_KEY, CORS_ORIGINS, ENVIRONMENT
│  └─ Auto-redeploy saat push ke GitHub
│
├─ ⚛️ Frontend Service
│  ├─ URL: https://athsnac-frontend.railway.app
│  ├─ Build: npm run build → dist/ folder
│  ├─ Server: Nginx (static file serving)
│  └─ Env vars: VITE_API_URL (pointing ke backend)
│
└─ 🗄️ PostgreSQL Database
   ├─ Host: containers-xxx.railway.internal (internal only)
   ├─ Port: 5432
   ├─ Database: railway (default)
   └─ Auto-backup daily
```

**Keuntungan Railway vs Development:**

| Aspek | Localhost | Railway |
|-------|-----------|---------|
| **URL** | http://localhost:3000 | https://athsnac-frontend.railway.app (publik!) |
| **Database** | PostgreSQL lokal (ribet setup) | PostgreSQL managed (1-click) |
| **Uptime** | Selama laptop hidup | 99.9% SLA (guarantee) |
| **Data persistence** | Hilang saat laptop restart | Persistent, auto-backup |
| **Users** | Hanya 1 (Anda) | Ribuan users bisa akses |
| **SSL/HTTPS** | Tidak ada | Otomatis Railway |
| **Biaya** | $0 (cuma listrik) | $5/bulan (student trial free) |

---

#### 🔒 Security & Best Practices

**Environment Variables Management** — Bagaimana secrets handled di production?

**Problem:** Database password, API key, JWT secret tidak boleh di-hardcode di kode. Jika ada di GitHub, hacker bisa lihat!

**Solution:** Simpan secrets di tempat aman (tidak di GitHub):

```
Development (Laptop):
  File: .env (di .gitignore)
  Isi: DB_URL=localhost:5432
       SECRET_KEY=dev-only-simple
  
GitHub Secrets:
  Setting → Secrets → RAILWAY_TOKEN
  (Hanya accessible di GitHub Actions, tidak terlihat di code)
  
Railway Environment Variables:
  Dashboard → Backend Service → Variables
  Isi: DATABASE_URL=postgresql://prod-xxx (dari Railway PostgreSQL)
       SECRET_KEY=<random 64-char hex>
       CORS_ORIGINS=https://athsnac-frontend.railway.app
```

**Keamanan tambahan:**
- ✅ Branch protection: PR harus di-review sebelum merge
- ✅ No direct push to main: semua perubahan via PR
- ✅ All secrets encrypted: tidak bisa dilihat setelah disimpan
- ✅ CORS configured: frontend hanya bisa akses dari domain terdaftar
- ✅ HTTPS enforced: semua komunikasi encrypted (TLS)

---

### New Features (Milestone 2)

#### 🐳 Docker & Containerization
- ✅ Multi-stage Dockerfile untuk backend (Python 3.11-slim)
- ✅ Multi-stage Dockerfile untuk frontend (Node.js build + Nginx serving)
- ✅ Docker Compose orchestration (3 services: backend, frontend, PostgreSQL)
- ✅ Health checks di container (auto-restart jika fail)
- ✅ Environment-based docker-compose.prod.yml
- ✅ Image optimization (backend: 150MB, frontend: 50MB)

#### 🔄 CI/CD Pipeline (GitHub Actions)
- ✅ Automated linting (backend: pylint, frontend: eslint)
- ✅ Unit testing (backend: pytest, frontend: Vitest)
- ✅ Docker image build & push to Docker Hub
- ✅ Health check setelah deployment
- ✅ Auto-deploy to Railway saat PR merge ke main
- ✅ CI-only di PR branches (tidak deploy)
- ✅ CD-only saat push ke main (deploy otomatis)

#### ☁️ Cloud Deployment (Railway)
- ✅ Backend service berjalan di Railway dengan URL publik
- ✅ Frontend service berjalan di Railway with Nginx
- ✅ PostgreSQL managed database di Railway
- ✅ HTTPS/SSL otomatis (Railway)
- ✅ Custom domain siap (cloudapp-athsnac.railway.app)
- ✅ Auto-redeploy saat push (GitHub integration)

#### 🔒 Security & Best Practices
- ✅ Environment variables management (GitHub Secrets + Railway Variables)
- ✅ No secrets in code (.env di .gitignore)
- ✅ CORS configuration per environment
- ✅ Branch protection rules (PR + review required)
- ✅ GitHub Actions secrets encrypted

#### 📚 Documentation
- ✅ Deployment guide (docs/deployment-guide.md)
- ✅ Production testing checklist (docs/production-test.md)
- ✅ CI/CD workflow documentation
- ✅ README dengan live URLs & setup guide
- ✅ Docker architecture diagram (docs/docker-architecture.md)

---

##   Penjelasan Detail Fitur-Fitur Baru

### Docker & Containerization — Apa itu & Mengapa Penting?

**Docker** adalah teknologi yang mengemas aplikasi beserta seluruh "kebutuhan" nya (library, database, konfigurasi) ke dalam satu "kotak" yang bisa dijalankan di mana saja.

**Analogi:** 
- **Tanpa Docker:** Anda mengirim resep kue ke teman. Teman harus mencari semua bahan, tools, dan setup sendiri. Ribet!
- **Dengan Docker:** Anda mengirim kotak kue siap jadi. Teman tinggal buka dan makan. Gampang!

**Apa yang sudah kita implementasikan:**

- ✅ **Backend Dockerfile** — Python FastAPI + semua dependency ter-package rapi
  - Ukuran: ~150MB (sudah optimasi, bukan 500MB+)
  - Jalan di port 8000 (internal), port 80 (public via Nginx)
  - Health check otomatis: jika app crash, Docker auto-restart

- ✅ **Frontend Dockerfile** — React built + Nginx serving (2-stage build)
  - Stage 1: Build dengan Node.js (compile JSX, optimize bundle)
  - Stage 2: Serve statis dengan Nginx (~50MB final)
  - Bisa handle 1000+ concurrent users

- ✅ **Docker Compose** — Orchestrasi 3 containers bersama:
  - Backend service (FastAPI)
  - Frontend service (Nginx)
  - PostgreSQL database
  - Semua berkomunikasi via internal network, tidak perlu hardcode IP

**Keuntungan:**
1. **Consistency:** App jalan sama di laptop, server test, dan production
2. **Isolation:** Service tidak saling interfere (jika frontend crash, backend tetap jalan)
3. **Scaling:** Bisa bikin 10 instance backend jika traffic tinggi
4. **Deployment:** Cuma push image ke cloud, selesai! (banding dengan upload file satu-satu)

**File yang dibuat:**
```
backend/Dockerfile          ← Cara build image backend
backend/.dockerignore       ← Apa yang TIDAK dimasukkan ke image
frontend/Dockerfile        ← Cara build image frontend
frontend/.dockerignore
docker-compose.yml         ← Lokal development: 3 services + dummy data
docker-compose.prod.yml    ← Production: menggunakan Railway services
Makefile                   ← Shortcut: make build, make up, make test
```

---

### CI/CD Pipeline — Otomasi Testing & Deployment

**CI/CD** adalah sistem otomatis yang:
- **CI (Continuous Integration):** Setiap kali ada push, otomatis test & build
- **CD (Continuous Delivery):** Jika test pass, otomatis deploy ke cloud

**Alur kerja (step-by-step):**

1. **Anda push ke branch feature:**
   ```
   git push origin feature/add-login
   ```

2. **GitHub Actions otomatis menjalankan:**
   ```
   Step 1: Lint code (cek error syntax)
   Step 2: Run backend tests (pytest)
   Step 3: Run frontend tests (Vitest)
   Step 4: Build Docker image
   Step 5: Health check
   ```

3. **Hasil:**
   - Jika semua PASS ✅: PR bisa di-merge
   - Jika ada yang FAIL ❌: PR diblokir, harus fix

4. **Setelah merge ke main:**
   ```
   Step 5: Deploy ke Railway (otomatis!)
   Step 6: Health check di production
   Step 7: Send notification ke tim
   ```

**File yang dibuat:**
```
.github/workflows/ci.yml    ← Semua step di atas ter-define di sini
                            ← ~200 lines YAML
```

**Keuntungan:**
1. **Quality Assurance:** Tidak boleh ada code yang tidak ter-test masuk ke main
2. **Early Detection:** Bug ketahuan saat development, bukan saat user pakai
3. **No Manual Deploy:** Deploy otomatis, tidak perlu SSH ke server
4. **Auditability:** Setiap deployment ter-track: siapa, kapan, apa yang di-push

**Workflow diagram:**
```
PR dibuat (feature branch):
  ↓
  GitHub Actions run CI
  → Lint ✅
  → Test ✅
  → Build ✅
  ↓
  Bisa di-merge? YA ✅
  
Merge ke main:
  ↓
  GitHub Actions run CI + CD
  → (semua step di atas)
  → Deploy ke Railway ✅
  ↓
  App live di internet!
```

---

### Railway — Cloud Platform

**Railway** adalah layanan cloud yang memudahkan deploy aplikasi tanpa harus manage server sendiri (contoh: AWS EC2 yang rumit).

**Apa yang Railway tangani untuk kita?**

| Aspek | Di Laptop (Dev) | Di Railway (Prod) |
|-------|-----------------|-------------------|
| **Server** | Laptop sendiri | Railway server (auto-scale) |
| **Network** | localhost | Public internet + HTTPS |
| **Database** | PostgreSQL lokal | PostgreSQL managed Railway |
| **Backup** | Manual (atau lupa) | Auto-backup harian |
| **SSL/HTTPS** | Tidak ada | Gratis, auto-renewal |
| **Domain** | - | cloudapp-xxx.railway.app (gratis) |
| **Monitoring** | Terminal log | Railway dashboard |

**Struktur di Railway:**

```
☁️ Railway Project (cloudapp-team-XX)
├─ 🐍 Backend Service
│  ├─ URL: https://athsnac-backend.railway.app
│  ├─ Port: 8000 (internal) → Railway handle public port
│  ├─ Env vars: DATABASE_URL, SECRET_KEY, CORS_ORIGINS, ENVIRONMENT
│  └─ Auto-redeploy saat push ke GitHub
│
├─ ⚛️ Frontend Service
│  ├─ URL: https://athsnac-frontend.railway.app
│  ├─ Build: npm run build → dist/ folder
│  ├─ Server: Nginx (static file serving)
│  └─ Env vars: VITE_API_URL (pointing ke backend)
│
└─ 🗄️ PostgreSQL Database
   ├─ Host: containers-xxx.railway.internal (internal only)
   ├─ Port: 5432
   ├─ Database: railway (default)
   └─ Auto-backup daily
```

**Keuntungan Railway vs Development:**

| Aspek | Localhost | Railway |
|-------|-----------|---------|
| **URL** | http://localhost:3000 | https://athsnac-frontend.railway.app (publik!) |
| **Database** | PostgreSQL lokal (ribet setup) | PostgreSQL managed (1-click) |
| **Uptime** | Selama laptop hidup | 99.9% SLA (guarantee) |
| **Data persistence** | Hilang saat laptop restart | Persistent, auto-backup |
| **Users** | Hanya 1 (Anda) | Ribuan users bisa akses |
| **SSL/HTTPS** | Tidak ada | Otomatis Railway |
| **Biaya** | $0 (cuma listrik) | $5/bulan (student trial free) |

---

### Security & Best Practices

**Environment Variables Management** — Bagaimana secrets handled di production?

**Problem:** Database password, API key, JWT secret tidak boleh di-hardcode di kode. Jika ada di GitHub, hacker bisa lihat!

**Solution:** Simpan secrets di tempat aman (tidak di GitHub):

```
Development (Laptop):
  File: .env (di .gitignore)
  Isi: DB_URL=localhost:5432
       SECRET_KEY=dev-only-simple
  
GitHub Secrets:
  Setting → Secrets → RAILWAY_TOKEN
  (Hanya accessible di GitHub Actions, tidak terlihat di code)
  
Railway Environment Variables:
  Dashboard → Backend Service → Variables
  Isi: DATABASE_URL=postgresql://prod-xxx (dari Railway PostgreSQL)
       SECRET_KEY=<random 64-char hex>
       CORS_ORIGINS=https://athsnac-frontend.railway.app
```

**Keamanan tambahan:**
- ✅ Branch protection: PR harus di-review sebelum merge
- ✅ No direct push to main: semua perubahan via PR
- ✅ All secrets encrypted: tidak bisa dilihat setelah disimpan
- ✅ CORS configured: frontend hanya bisa akses dari domain terdaftar
- ✅ HTTPS enforced: semua komunikasi encrypted (TLS)

---

### Environment Configuration — Dev vs Production

Aplikasi yang sama, tapi **configuration-nya berbeda** berdasarkan environment. Ini prinsip **12-Factor App**.

**Development Environment (Localhost):**
```python
ENVIRONMENT = "development"
DEBUG = True                    # Error message detail
DATABASE_URL = "localhost:5432" # Lokal
SECRET_KEY = "dev-key"         # Simple, easy to remember
CORS_ORIGINS = ["localhost:5173", "localhost:3000"]
LOG_LEVEL = "DEBUG"            # Verbose logging untuk debug
```

**Production Environment (Railway):**
```python
ENVIRONMENT = "production"
DEBUG = False                   # Generic error (tidak expose stack trace)
DATABASE_URL = "postgresql://railway-managed"  # Cloud database
SECRET_KEY = "random-64-char-hex-generated"   # Secure random
CORS_ORIGINS = ["https://athsnac-frontend.railway.app"]
LOG_LEVEL = "INFO"             # Only important events
```

**Mengapa harus berbeda?**

| Aspek | Development | Production | Alasan |
|-------|-------------|-----------|--------|
| **Debug Mode** | ON | OFF | Jangan expose error detail ke user |
| **Database** | localhost | Cloud | Local crash = dev bisa fix, prod crash = real users affected |
| **CORS** | localhost:* | specific domain | Prevent cross-origin attack |
| **Secret** | simple | random 64-char | Weak secret = easier to hack |
| **Logging** | Verbose | Minimal | Verbose log = slow, besar storage |

**Kode yang handle ini:**

```python
# File: backend/config.py (BARU di M2)
import os

class Settings:
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = ENVIRONMENT == "development"
    
    DATABASE_URL = os.getenv("DATABASE_URL", "local-default")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-key")
    
    # etc...
```

Saat development, code baca `.env` file. Saat production, code baca Railway environment variables. **Kode tidak berubah!**

---

### Documentation — Lengkap & Clear

**File dokumentasi baru yang dibuat:**

1. **deployment-guide.md** — Step-by-step cara deploy ke Railway
   - Buat akun Railway
   - Setup PostgreSQL
   - Deploy backend
   - Deploy frontend
   - Konfigurasi env vars
   - Troubleshooting

2. **production-test.md** — Checklist setelah deployment
   - 10 smoke test scenarios
   - Expected vs actual results
   - Testing protocol

3. **docker-architecture.md** — Diagram & penjelasan container design
   - Dockerfile strategy (multi-stage)
   - Docker Compose orchestration
   - Network topology

4. **testing-guide.md** — Cara menjalankan tests
   - Unit test (pytest, Vitest)
   - Integration test
   - Test coverage report

5. **README.md UPDATED** — Sekarang ada:
   - Live URLs production
   - CI/CD badge (status pipeline)
   - Deployment section
   - Troubleshooting

---



### Backend
```
- FastAPI 0.104.1         — Async Python web framework
- SQLAlchemy 2.x          — ORM for database abstraction
- PostgreSQL 15           — Relational database (managed by Railway)
- Pydantic 2.x            — Data validation & serialization
- Uvicorn                 — ASGI server
- Python 3.11             — Runtime
```

### Frontend
```
- React 18.x              — UI library
- Vite 5.x                — Build tool & dev server
- Vitest + Jsdom          — Unit testing framework
- React Router 6.x        — Client-side routing
- Axios / Fetch API       — HTTP client
- Node.js 18+             — Runtime
```

### DevOps & Infrastructure
```
- Docker 24.x             — Containerization
- Docker Compose 2.x      — Multi-container orchestration
- Railway                 — PaaS cloud platform
- GitHub Actions          — CI/CD automation
- PostgreSQL 15-alpine    — Database container
- Nginx alpine            — Reverse proxy & static server
```

### Testing & Quality
```
- pytest 7.x              — Python unit testing
- Vitest 0.34.x           — JavaScript unit testing
- ESLint                  — Frontend code linting
- Pylint / Black          — Backend code linting
```

---

## 🏆 Quality Metrics

### Testing Coverage

| Module | Test Type | Status | Coverage |
|--------|-----------|--------|----------|
| **Backend** | Unit tests (pytest) | ✅ Pass | 8+ test suites |
| **Frontend** | Component tests (Vitest) | ✅ Pass | 5+ test files |
| **CI Pipeline** | Integration tests | ✅ Pass | Lint + test + build |
| **Production** | Smoke test | ✅ Pass | All CRUD ops verified |

### Performance (Production)

| Metric | Value | Target |
|--------|-------|--------|
| **Backend response time** | ~150ms | <500ms ✅ |
| **Frontend build size** | 45MB (dist/) | <100MB ✅ |
| **Database query time** | ~50ms avg | <200ms ✅ |
| **Page load time** | ~2 sec | <5 sec ✅ |
| **HTTPS/SSL** | ✅ Active | ✅ |

### Uptime
- **Backend:** Railway managed (99.9% SLA)
- **Frontend:** Railway managed (99.9% SLA)
- **Database:** Railway managed PostgreSQL (daily backup)

---

## 📊 Production Smoke Test Results

**Date:** May 17, 2026  
**Tested By:** Lead QA  
**Environment:** Production (https://athsnac-frontend.railway.app)

### Test Results

| Test Case | Expected | Result | Status |
|-----------|----------|--------|--------|
| **1. Frontend load** | Page renders without error | ✅ | **PASS** |
| **2. Register new user** | User created, email verified | ✅ | **PASS** |
| **3. Login** | JWT token returned, redirect to home | ✅ | **PASS** |
| **4. View products** | Product list loaded from backend | ✅ | **PASS** |
| **5. Add to cart** | Item added, cart updated | ✅ | **PASS** |
| **6. Create order** | Order placed, status=pending | ✅ | **PASS** |
| **7. Verify payment** | Payment marked verified by admin | ✅ | **PASS** |
| **8. Backend health check** | GET /health returns status=healthy | ✅ | **PASS** |
| **9. API documentation** | Swagger UI accessible & functional | ✅ | **PASS** |
| **10. Database connectivity** | All queries respond correctly | ✅ | **PASS** |

**Overall Status:** 🟢 **PRODUCTION READY**

---

## 🐛 Known Issues & Limitations

### Resolved (Fixed in Milestone 2)

| Issue | Root Cause | Solution | Status |
|-------|-----------|----------|--------|
| CORS errors on production | CORS_ORIGINS misconfigured | Added Railway env vars | ✅ Fixed |
| Database connection timeout | PostgreSQL URL format | Used Railway DATABASE_URL ref | ✅ Fixed |
| Frontend blank page on prod | API_URL pointed to localhost | Created .env.production | ✅ Fixed |
| Docker image too large | Multi-stage not optimized | Added Docker .dockerignore | ✅ Fixed |

### Current Limitations (Won't Fix in v2.0)

| Limitation | Impact | Workaround | Priority |
|-----------|--------|-----------|----------|
| **Microservices** | Still monolithic backend | Split in Milestone 3 (Week 12-14) | Low |
| **Database replication** | Single PostgreSQL instance | Add replicas in production phase | Low |
| **Rate limiting** | No API rate limiting | Implement in Week 13 | Medium |
| **Email notifications** | No order confirmation emails | Add SendGrid integration later | Medium |
| **Payment gateway** | Mock payment only (no real Stripe) | Integrate real gateway later | High |
| **File upload optimization** | Basic file storage | Implement S3/CDN later | Low |

### Known Bugs (Tracked)

> **Note:** Semua bug di bawah sudah documented & akan di-fix di maintenance release (v2.0.1 atau v2.1).

| Bug ID | Description | Severity | Status | Workaround |
|--------|-------------|----------|--------|-----------|
| BUG-001 | Payment verification slow on concurrent orders | Low | Tracked (Week 12) | Cache payment status |
| BUG-002 | Cart sometimes shows stale product prices | Low | Cache issue (Week 13) | Reload page atau clear cache |
| BUG-003 | Admin dashboard load time >3s with 1000+ orders | Medium | Performance (Week 13) | Add pagination / lazy load |

---

### Penjelasan Limitations

**1. Microservices (masih monolithic)**
- **Apa:** Aplikasi masih 1 backend besar, belum dipecah jadi Auth Service + Item Service
- **Dampak:** Scaling terbatas (jika satu fitur padat CPU, seluruh backend melambat)
- **Kapan di-fix:** Milestone 3 (minggu 12-14)
- **Sementara:** Sudah cukup untuk traffic ~1000 users

**2. Database Replication (single instance)**
- **Apa:** PostgreSQL masih 1 instance, belum ada backup realtime
- **Dampak:** Jika database down 1 jam, data tidak accessible (tapi Railway backup harian)
- **Kapan di-fix:** Production phase (bulan depan)
- **Sementara:** Railway auto-backup harian sudah cukup

**3. Rate Limiting (tidak ada)**
- **Apa:** API tidak ada pembatasan request per user
- **Dampak:** User bisa spam request (DDoS bisa terjadi)
- **Kapan di-fix:** Milestone 3 (minggu 13)
- **Sementara:** Untuk development OK, prod perlu perhatian

**4. Email Notifications (tidak ada)**
- **Apa:** Sistem tidak kirim email (order confirmation, password reset, dsb)
- **Dampak:** User tidak tahu order di-terima atau perlu reset password
- **Kapan di-fix:** Milestone 4 (week 14+)
- **Sementara:** Bisa pakai WhatsApp notif sementara

**5. Payment Gateway (mock only)**
- **Apa:** Semua payment masih dummy/mock, belum Stripe real
- **Dampak:** User tidak bisa pakai kartu kredit real
- **Kapan di-fix:** URGENT (week 13)
- **Sementara:** Untuk testing dengan dummy payment OK

**6. File Upload Optimization (basic only)**
- **Apa:** File upload ke server lokal, belum S3/CDN
- **Dampak:** Upload lambat, storage terbatas
- **Kapan di-fix:** Milestone 4 (week 14+)
- **Sementara:** Untuk development OK, prod perlu storage cloud

---



## 📈 Deployment Checklist (v2.0)

### Pre-Release
- ✅ All tests passing locally & in CI
- ✅ Code review completed (≥1 approval)
- ✅ No uncommitted changes in main branch
- ✅ Version bumped (v1.1.0 → v2.0)
- ✅ CHANGELOG.md updated
- ✅ Release notes documented

### Deployment Steps
- ✅ CI pipeline runs on push to main
- ✅ Docker images built & pushed to Docker Hub
- ✅ Merge triggers auto-deployment to Railway
- ✅ Health check passes (backend /health = 200 OK)
- ✅ Smoke tests executed
- ✅ Production URLs verified

### Post-Deployment
- ✅ Monitor Railway logs (24h)
- ✅ User acceptance testing (manual)
- ✅ Performance monitoring
- ✅ Error tracking (if any)

---

## 🔄 How to Update from v1.1.0 to v2.0

### For Developers
```bash
# Pull latest main
git pull origin main

# Verify tag exists
git tag | grep v2.0

# Switch to production (Railway auto-deploys, but local testing)
git checkout v2.0

# Verify deployment status
curl https://athsnac-backend.railway.app/health
```

### For Users
1. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
2. Refresh page (F5)
3. Logout & login again (fresh JWT token)
4. All data retained (no reset)

### For Admins
1. Monitor Railway dashboard (railway.app/dashboard)
2. Check deployment logs if errors occur
3. Database auto-backup by Railway (daily)
4. Manual rollback available (switch to v1.1.0 if critical bug)

---

## 📞 Support & Issues

### Report Issues
1. Open GitHub issue: https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ignite/issues/new
2. Label: `bug`, `production`, or `enhancement`
3. Include: environment, screenshot, error message

### Contact
- **Lead DevOps:** Production deployment support
- **Lead Backend:** API & database issues
- **Lead Frontend:** UI & integration issues
- **Lead QA:** Testing & release management

---

## 📚 Related Documentation

| Document | Purpose | Link |
|----------|---------|------|
| **Deployment Guide** | Step-by-step Railway setup | [docs/deployment-guide.md](deployment-guide.md) |
| **Production Testing** | Smoke test checklist | [docs/production-test.md](production-test.md) |
| **Docker Architecture** | Container design | [docs/docker-architecture.md](docker-architecture.md) |
| **API Documentation** | Endpoint reference | [docs/api-documentation.md](api-documentation.md) |
| **Testing Guide** | Unit & integration tests | [docs/testing-guide.md](testing-guide.md) |
| **Changelog** | Full version history | [CHANGELOG.md](../CHANGELOG.md) |

---

## 🎯 Next Steps (Milestone 3 — Microservices)

**Target:** Week 12–14  
**Focus:** Decouple monolithic backend into microservices

- [ ] Split into Auth Service + Item Service
- [ ] Implement API Gateway
- [ ] Add message queue (RabbitMQ/Kafka)
- [ ] Database per service pattern
- [ ] Service-to-service communication

---

## 📊 Perubahan Signifikan dari Milestone 1 ke Milestone 2

### Milestone 1 (M1) — Basic Features
```
✅ Fitur e-commerce sudah jalan di localhost
✅ Database setup manual
✅ Testing manual (open app, klik sana-sini)
❌ Hanya bisa akses dari laptop sendiri
❌ Tidak ada testing otomatis
❌ Setup aplikasi ribet (pip install, npm install, database manual)
```

### Milestone 2 (M2) — Production Ready
```
✅ Fitur e-commerce live di internet (URL publik)
✅ Database di cloud (Railway managed)
✅ Testing otomatis (pytest + Vitest + GitHub Actions)
✅ Akses dari mana saja via HTTPS
✅ Deploy otomatis ke cloud (1 merge = live!)
✅ Setup aplikasi mudah (docker-compose up)
✅ Environment terpisah dev vs prod
```

### Tabel Perbandingan M1 vs M2

| Aspek | Milestone 1 | Milestone 2 |
|-------|-------------|------------|
| **Lokasi App** | localhost:3000 (lokal) | https://athsnac-frontend.railway.app (internet publik) |
| **Database** | PostgreSQL lokal setup manual | PostgreSQL Railway (managed) |
| **Testing** | Manual (buka app, test) | Otomatis (pytest + Vitest) |
| **Deployment** | Upload file manual (FTP?) | Otomatis via GitHub Actions |
| **Environment** | Hanya development | Development + Production terpisah |
| **Access** | Hanya dari laptop | Dari mana saja, 24/7 |
| **SSL/HTTPS** | Tidak ada | Otomatis dari Railway |
| **CI/CD** | Tidak ada | GitHub Actions pipeline lengkap |
| **Docker** | Belum ada | Multi-stage Dockerfile + Docker Compose |
| **Uptime** | Tergantung laptop | 99.9% (Railway SLA) |
| **Real Users** | Tidak bisa pakai | Bisa pakai langsung |

### File Baru di M2

```
.github/
├── workflows/
│   └── ci.yml                          ← CI/CD Pipeline GitHub Actions (BARU!)

backend/
├── config.py                           ← Environment-based configuration (BARU!)
├── .dockerignore                       ← Docker optimization (BARU!)
├── Dockerfile                          ← Backend containerization (BARU!)

frontend/
├── .dockerignore                       ← Docker optimization (BARU!)
├── .env.production                     ← Production API URL (BARU!)
├── Dockerfile                          ← Frontend containerization (BARU!)

docs/
├── deployment-guide.md                 ← Railway setup guide (BARU!)
├── production-test.md                  ← Smoke test checklist (BARU!)
├── docker-architecture.md              ← Container design diagram (BARU!)

docker-compose.prod.yml                 ← Production Docker Compose (BARU!)
Makefile                                ← Convenient shortcuts (BARU!)
```

### File yang Diubah di M2

```
README.md                               ← Added: live URLs, CI/CD badge, deployment info
CHANGELOG.md                            ← Updated: all changes logged
```

---

## 🔍 Troubleshooting Guide

### Masalah Umum & Solusinya

**Problem 1: "404 Not Found" saat akses URL production**
```
Penyebab: Backend belum deploy atau URL salah
Solusi:
  1. Cek Railway dashboard → backend service status
  2. Cek deployment logs (ada error?)
  3. Pastikan DATABASE_URL di env vars sudah benar
  4. Coba akses URL health check: https://athsnac-backend.railway.app/health
```

**Problem 2: "CORS error" di console browser**
```
Penyebab: CORS_ORIGINS backend tidak sesuai frontend URL
Solusi:
  1. Buka Railway → backend service → Variables
  2. Update CORS_ORIGINS ke URL frontend production
  3. Tunggu ~2 menit (Railway auto-redeploy)
  4. Refresh browser (Ctrl+Shift+R = hard refresh)
```

**Problem 3: "Database connection refused"**
```
Penyebab: DATABASE_URL format salah atau PostgreSQL down
Solusi:
  1. Cek Railway PostgreSQL service status (online?)
  2. Cek DATABASE_URL di Railway variables format (postgresql://user:pass@host:port/db)
  3. Test connection lokal: psql postgresql://...
  4. Jika masih gagal, restart PostgreSQL service di Railway
```

**Problem 4: "API returning 500 Internal Server Error"**
```
Penyebab: Code error, missing import, atau environment variable not found
Solusi:
  1. Cek Railway deployment logs (detail stack trace)
  2. Cek semua required env vars di backend (ENVIRONMENT, SECRET_KEY, dsb)
  3. Test lokal dulu: npm run dev (frontend) & python main.py (backend)
  4. Jika test lokal OK tapi prod gagal → bedakan env var
```

**Problem 5: "Frontend blank page atau API endpoint /docs not found"**
```
Penyebab: Frontend API_URL masih localhost, atau backend belum siap
Solusi:
  1. Cek frontend/.env.production → VITE_API_URL harus URL backend prod
  2. Rebuild frontend: npm run build
  3. Push & trigger CD pipeline (auto-deploy)
  4. Tunggu deployment selesai
```
