# 📋 RAZ'Q App - Tim Development Setup Guide

Panduan lengkap untuk setup development environment dan testing database.

---

## **1. Prerequisites**

Pastikan sudah install di komputer Anda:

- **Git** → https://git-scm.com/download/win
- **Docker Desktop** → https://www.docker.com/products/docker-desktop
  - Includes: Docker + Docker Compose
- **Python 3.10+** → https://www.python.org/downloads/
- **Node.js 18+** (untuk frontend) → https://nodejs.org/

**Verifikasi install:**
```bash
docker --version
docker-compose --version
python --version
node --version
```

---

## **2. Clone & Setup Repository**

### Step 1: Clone dari GitHub Classroom
```bash
git clone https://github.com/aidilsaputrakirsan-classroom/cc-kelompok-ignite.git
cd cc-kelompok-ignite
```

### Step 2: Buat file `.env` dari template
```bash
cp backend/.env.example backend/.env
```

**Isi `.env`** (sesuaikan dengan lokal Anda):
```env
DATABASE_URL=postgresql://postgres:andin123@localhost:5432/cloudapp
SECRET_KEY=670bf616568fd448e61e627212941e5957919a6459ff10a115979780b15952bb
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## **3. Start PostgreSQL dengan Docker**

### Option A: Docker Compose (Recommended ✅)

**Pertama kali setup:**
```bash
# Di folder root cc-kelompok-ignite/
docker-compose up -d
```

**Verifikasi database running:**
```bash
docker-compose ps
```

Output seharusnya:
```
NAME       IMAGE          STATUS       PORTS
razq_db    postgres:12    Up 2 minutes 0.0.0.0:5432->5432/tcp
```

**Stop database:**
```bash
docker-compose down
```

**Reset database (hapus semua data):**
```bash
docker-compose down -v  # -v = hapus volume/data
docker-compose up -d
```

---

### Option B: PostgreSQL Lokal (jika sudah install)

**Connection String:**
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/yourdb
```

---

## **4. Setup Backend & Virtual Environment**

### Step 1: Buat virtual environment
```bash
cd backend
python -m venv venv
```

### Step 2: Activate virtual environment
```bash
# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### Step 3: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Initialize database
```bash
python reset_db.py
```

Output success:
```
✅ Database sudah di-reset!
✅ 2 admin accounts sudah dibuat
```

---

## **5. Start Backend Server**

```bash
uvicorn main:app --reload
```

**Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

Buka browser: http://localhost:8000/docs (Swagger UI)

---

## **6. Setup Frontend (React)**

### Step 1: Install dependencies
```bash
cd frontend
npm install
```

### Step 2: Start development server
```bash
npm run dev
```

**Output:**
```
VITE v5.0.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## **7. Testing Database & API**

### Test 1: Swagger UI (Recommended)
```
1. Buka http://localhost:8000/docs
2. Click "Authorize" → masukkan token (login dulu)
3. Test semua endpoints di interface
```

### Test 2: Test dengan cURL

**1. Register user:**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@student.itk.ac.id",
    "password": "TestPass123",
    "name": "Test User"
  }'
```

**2. Login & dapatkan token:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@student.itk.ac.id",
    "password": "TestPass123"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

**3. Gunakan token untuk akses admin endpoints:**
```bash
curl -X POST "http://localhost:8000/products" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kue Tradisional",
    "price": 50000,
    "stock": 100,
    "category": "Makanan"
  }'
```

---

## **8. Testing Credentials**

Setelah `reset_db.py`, ada 2 admin account siap pakai:

```
📧 Email: admin@student.itk.ac.id
🔑 Password: Admin123456

📧 Email: admin2@student.itk.ac.id
🔑 Password: Admin123456
```

**Setup test customer:**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@student.itk.ac.id",
    "password": "Customer123",
    "name": "Customer Test"
  }'
```

---

## **9. Database Connection (untuk database GUI tools)**

**pgAdmin** (web-based):
```
Host: localhost
Port: 5432
Username: postgres
Password: andin123
Database: cloudapp
```

**DBeaver** (desktop app):
```
Server: localhost
Port: 5432
Username: postgres
Password: andin123
```

---

## **10. Common Issues & Troubleshooting**

### ❌ Error: "Connection refused" pada port 5432
```bash
# Solusi:
docker-compose ps
# Jika tidak running:
docker-compose up -d
```

### ❌ Error: "psycopg2: missing libpq"
```bash
# Solusi:
pip install psycopg2-binary
```

### ❌ Error: "ModuleNotFoundError" saat jalankan main.py
```bash
# Solusi:
# 1. Pastikan di folder backend/
# 2. Pastikan virtual environment aktif
source venv/bin/activate  # atau venv\Scripts\activate di Windows
pip install -r requirements.txt
```

### ❌ Error: "Secret key not found" atau environment variable tidak loaded
```bash
# Solusi:
# 1. Pastikan file .env ada di backend/ folder
# 2. Restart uvicorn server
# 3. Cek isi .env tidak ada typo
```

### ❌ Reset database / hapus semua data
```bash
# Dengan Docker:
docker-compose down -v
docker-compose up -d
python reset_db.py

# Tanpa Docker:
# Hapus database di pgAdmin, recreate, jalankan reset_db.py
```

---

## **11. Development Workflow**

### Daily Setup
```bash
# 1. Masuk folder project
cd cc-kelompok-ignite

# 2. Start Docker (jika belum running)
docker-compose up -d

# 3. Backend
cd backend
source venv/bin/activate  # atau venv\Scripts\activate
uvicorn main:app --reload

# 4. Frontend (di terminal baru)
cd frontend
npm run dev

# 5. Database tools (optional)
# Buka pgAdmin di http://localhost:8080
```

### After Pull from Git
```bash
# 1. Update dependencies (jika ada perubahan di requirements.txt)
pip install -r requirements.txt

# 2. Reset database (jika ada migration baru)
python reset_db.py

# 3. Restart uvicorn server
# (Tekan Ctrl+C, jalankan lagi: uvicorn main:app --reload)
```

---

## **12. API Documentation**

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Backend README:** `backend/BACKEND_README.md`

---

## **13. Laporan Issue**

Jika ada masalah:

1. **Cek error di terminal** (catat exact error message)
2. **Baca Troubleshooting section** di atas
3. **Laporkan ke Lead Backend**:
   - Exact error message
   - Step-by-step apa yang Anda lakukan
   - OS dan versi software (python, docker, node, dll)

---

## **14. Production Checklist**

Sebelum deploy ke production:

- [ ] Update `SECRET_KEY` di production `.env`
- [ ] Change `ALLOWED_ORIGINS` ke domain production
- [ ] Update `DATABASE_URL` ke production database
- [ ] Disable `--reload` flag di uvicorn
- [ ] Setup HTTPS/SSL certificate
- [ ] Review security checklist di `backend/BACKEND_README.md`

---

**Last Update:** April 2026  
**Lead Backend:** Andini Permata Dewanti (10231014)  
**Status:** ✅ Production Ready
