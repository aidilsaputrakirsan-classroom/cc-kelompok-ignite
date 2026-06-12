# 🚀 Deployment Guide
---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Railway Setup](#railway-setup)
3. [Environment Variables](#environment-variables)
4. [Deployment Steps](#deployment-steps)
5. [Troubleshooting](#troubleshooting)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 📦 Prerequisites

Sebelum deployment, pastikan:

- [ ] Akun Railway (sign up via GitHub) — https://railway.app/
- [ ] GitHub repository dengan CI/CD workflow configured
- [ ] Docker images sudah built & pushed to Docker Hub
- [ ] All environment variables documented
- [ ] Database backup strategy planned
- [ ] Team access ke Railway dashboard

### Railway Free Tier Benefits
```
✅ $5/bulan free credit (trial)
✅ Unlimited projects
✅ PostgreSQL managed database
✅ HTTPS/SSL otomatis
✅ Auto-scaling
✅ Daily backups
```

---

## ⚙️ Railway Setup — Step by Step

### Step 1: Create Railway Project

1. Login ke https://railway.app/dashboard
2. Klik **New Project**
3. Pilih **Empty Project**
4. Beri nama: `cc-kelompok-ignite` atau sesuai tim

```
✅ Project created: cc-kelompok-ignite
```

---

### Step 2: Add PostgreSQL Database

1. Di dalam project, klik **+ Add Service**
2. Pilih **Database** → **PostgreSQL**
3. Railway otomatis membuat PostgreSQL instance
4. Tunggu ~30 detik hingga selesai

**Konfigurasi DB:**
- Username: `postgres` (default)
- Port: `5432` (internal)
- Backup: Otomatis harian
- Storage: 1GB free (cukup untuk development)

```
✅ PostgreSQL created
✅ CONNECTION STRING generated automatically
```

**Copy CONNECTION STRING:**
- Tab **Variables**
- Catat: `DATABASE_URL`
- Format: `postgresql://user:pass@host:port/database`

---

### Step 3: Deploy Backend Service

1. Di project, klik **+ Add Service**
2. Pilih **GitHub Repo**
3. Connect ke GitHub repository Anda
4. Select branch: `main`
5. **Configure:**
   - Service name: `backend`
   - Root Directory: `/backend` (PENTING!)
   - Builder: `Dockerfile`
   - Port: `8000`

6. Klik **Deploy** (Railway build image dari Dockerfile)

**Monitor deployment:**
```
Klik service → Deployments tab
Status: In Progress → Success (5-10 menit)
```

```
✅ Backend deployed
✅ URL generated: https://cc-kelompok-ignite-production.up.railway.app
```

---

### Step 4: Configure Backend Environment Variables

1. Klik service **Backend**
2. Tab **Variables**
3. Tambahkan:

| Variable | Value | Keterangan |
|----------|-------|-----------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Reference ke PostgreSQL |
| `SECRET_KEY` | `<generate random>` | Gunakan: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `CORS_ORIGINS` | `https://aware-warmth-production-ebd3.up.railway.app` | URL frontend (after deployed) |
| `ENVIRONMENT` | `production` | Production mode |
| `LOG_LEVEL` | `INFO` | Production logging level |

4. Klik **Save** → Railway auto-redeploy

**Verifikasi:**
```bash
curl https://cc-kelompok-ignite-production.up.railway.app/health

Expected response:
{
  "status": "healthy",
  "database": "connected"
}
```

```
✅ Backend environment configured
✅ Health check PASS
```

---

### Step 5: Deploy Frontend Service

1. Di project, klik **+ Add Service**
2. Pilih **GitHub Repo** (same repo)
3. **Configure:**
   - Service name: `frontend`
   - Root Directory: `/frontend`
   - Builder: `Dockerfile`
   - Port: `3000` (or let Railway auto-assign)

4. Klik **Deploy**

**Monitor:**
```
Deployments tab → Status: Success (5-10 menit)
```

```
✅ Frontend deployed
✅ URL generated: https://aware-warmth-production-ebd3.up.railway.app
```

---

### Step 6: Configure Frontend Environment Variables

1. Klik service **Frontend**
2. Tab **Variables**
3. Tambahkan:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://cc-kelompok-ignite-production.up.railway.app` |
| `NODE_ENV` | `production` |

4. Klik **Save** → Railway auto-redeploy

**Verifikasi:**
```
Open: https://aware-warmth-production-ebd3.up.railway.app
Expected: Login page loads, no CORS errors
```

```
✅ Frontend environment configured
✅ Frontend loads successfully
```

---

### Step 7: Update Backend CORS_ORIGINS

Now that frontend deployed, update backend CORS:

1. Klik service **Backend**
2. Tab **Variables**
3. Update `CORS_ORIGINS` = `https://aware-warmth-production-ebd3.up.railway.app`
4. **Save** → Railway auto-redeploy

```
✅ Backend CORS updated
✅ Frontend ↔ Backend komunikasi OK
```

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

**Database Connection:**
```
DATABASE_URL=postgresql://postgres:XXXXX@containers-xxx.railway.internal:5432/railway
```
> Generated otomatis dari PostgreSQL service

**Authentication & Security:**
```
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6  (64 chars random hex)
CORS_ORIGINS=https://aware-warmth-production-ebd3.up.railway.app
ENVIRONMENT=production
```

**Optional:**
```
LOG_LEVEL=INFO
DEBUG=false
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend Environment Variables

```
VITE_API_URL=https://cc-kelompok-ignite-production.up.railway.app
NODE_ENV=production
```

### GitHub Secrets (untuk CD Pipeline)

```
RAILWAY_TOKEN=<token dari railway.app/account/tokens>
```

Dokumen ini menjelaskan proses deployment aplikasi ATHSNACK mulai dari arsitektur monolithic yang di-deploy menggunakan Railway hingga implementasi microservices menggunakan Docker Compose.

ATHSNACK telah melalui beberapa tahapan pengembangan:

| Version | Architecture  | Deployment Platform |
| ------- | ------------- | ------------------- |
| v1.0.0  | Monolith      | Local Development   |
| v2.0.0  | Monolith      | Railway             |
| v3.0.0  | Microservices | Docker Compose      |

---

# 🏗️ Architecture Overview

## Monolith Architecture (v1.0.0 – v2.0.0)

```text
Frontend (React)
        │
        ▼
Backend (FastAPI)
        │
        ▼
PostgreSQL
```

Seluruh fitur aplikasi berjalan dalam satu backend service yang terhubung ke satu database PostgreSQL.

---

## Microservices Architecture (v3.0.0)

```text
                Browser
                   │
                   ▼
              API Gateway
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
 Auth Service            Item Service
      │                         │
      ▼                         ▼
   auth_db                  item_db
```

Pada versi final, aplikasi dipisahkan menjadi beberapa service independen:

* Auth Service
* Item Service
* API Gateway
* Database per Service

---

# ☁️ Monolith Deployment (Railway)

## Services

| Service  | Platform           |
| -------- | ------------------ |
| Frontend | Railway            |
| Backend  | Railway            |
| Database | Railway PostgreSQL |

---

## Railway Setup

### Prerequisites

* Akun Railway
* Repository GitHub
* Dockerfile Backend
* Dockerfile Frontend

---

## Backend Environment Variables

```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
CORS_ORIGINS=https://frontend-url
ENVIRONMENT=production
```

---

## Frontend Environment Variables

```env
VITE_API_URL=https://backend-url
NODE_ENV=production
```

---

## Deployment Steps

### Backend

Push source code:

```bash
git push origin main
```

Railway akan:

* Build Docker Image
* Deploy Backend
* Connect ke PostgreSQL

---

### Frontend

Push source code:

```bash
git push origin main
```

Railway akan:

* Build React Application
* Deploy Frontend

---

## Verification

Health Check:

```bash
curl https://backend-url/health
```

Expected Response:

```json
{
  "status":"healthy"
}
```

---

# 🐳 Microservices Deployment (Current Architecture)

## Services

| Service       | Port |
| ------------- | ---- |
| Gateway       | 80   |
| Frontend      | 3000 |
| Auth Service  | 8001 |
| Item Service  | 8002 |
| Auth Database | 5434 |
| Item Database | 5435 |

---

# 📦 Prerequisites

Pastikan telah menginstall:

## Docker

```bash
docker --version
```

## Docker Compose

```bash
docker compose version
```

---

# ⚙️ Build Services

Build seluruh service:

```bash
docker compose build
```

---

# ▶️ Start Services

Menjalankan seluruh service:

```bash
docker compose up -d
```

---

# 🔍 Verify Containers

```bash
docker compose ps
```

Expected:

```text
auth-db         healthy
item-db         healthy
auth-service    healthy
item-service    healthy
frontend        healthy
gateway         healthy
```

---

# 🔐 Environment Variables

## Auth Service

```env
DATABASE_URL=postgresql://postgres:postgres@auth-db:5432/auth_db
SECRET_KEY=dev-secret-key
TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost,http://localhost:5173
```

---

## Item Service

```env
DATABASE_URL=postgresql://postgres:postgres@item-db:5432/item_db
AUTH_SERVICE_URL=http://auth-service:8001
CORS_ORIGINS=http://localhost,http://localhost:5173
```

---

# ❤️ Health Check Verification

## Gateway

```bash
curl http://localhost/health
```

---

## Auth Service

```bash
curl http://localhost/auth/health
```

Expected:

```json
{
  "service":"auth-service",
  "status":"healthy"
}
```

---

## Item Service

```bash
curl http://localhost/items/health
```

Expected:

```json
{
  "service":"item-service",
  "status":"healthy"
}
```

---

# 🧪 Functional Verification

## Register User

```bash
curl -X POST http://localhost/auth/register \
-H "Content-Type: application/json" \
-d "{\"email\":\"test@example.com\",\"password\":\"12345678\",\"name\":\"Test User\"}"
```

Expected:

```json
{
  "id":1,
  "email":"test@example.com"
}
```

---

## Login User

```bash
curl -X POST http://localhost/auth/login \
-H "Content-Type: application/json" \
-d "{\"email\":\"test@example.com\",\"password\":\"12345678\"}"
```

Expected:

```json
{
  "access_token":"..."
}
```

Simpan token untuk pengujian berikutnya.

---

## Verify Token

```bash
curl http://localhost/auth/verify \
-H "Authorization: Bearer TOKEN"
```

Expected:

```json
{
  "user_id":1,
  "email":"test@example.com"
}
```

---

## Create Item

```bash
curl -X POST http://localhost/items \
-H "Authorization: Bearer TOKEN" \
-H "Content-Type: application/json" \
-d "{\"name\":\"Laptop\",\"price\":15000000,\"quantity\":5}"
```

Expected:

```json
{
  "id":1,
  "name":"Laptop"
}
```

---

# 📊 Observability Verification

## Metrics Endpoint

### Auth Service

```bash
curl http://localhost/auth/metrics
```

### Item Service

```bash
curl http://localhost/items/metrics
```

Informasi yang tersedia:

* Total Requests
* Total Errors
* Error Rate
* Endpoint Statistics
* Latency Statistics

---

## Structured Logging

Melihat log Auth Service:

```bash
docker compose logs auth-service --tail=20
```

Melihat log Item Service:

```bash
docker compose logs item-service --tail=20
```

Log menampilkan:

* Timestamp
* HTTP Method
* Endpoint
* Status Code
* Duration
* Correlation ID

---

## Correlation ID Tracing

Lakukan request:

```bash
curl http://localhost/items \
-H "Authorization: Bearer TOKEN"
```

Kemudian cek log:

```bash
docker compose logs auth-service --tail=20
```

Cari field:

```json
{
  "correlation_id":"xxxx-xxxx"
}
```

Correlation ID digunakan untuk melakukan tracing request antar service.

---

# 🔄 Restart Procedure

Restart seluruh service:

```bash
docker compose restart
```

---

Restart Auth Service:

```bash
docker compose restart auth-service
```

---

Restart Item Service:

```bash
docker compose restart item-service
```

---

Restart Gateway:

```bash
docker compose restart gateway
```

---

Verifikasi:

```bash
docker compose ps
```

Pastikan seluruh service kembali healthy.

---

# ⏹️ Shutdown Procedure

Stop seluruh service:

```bash
docker compose down
```

---

Stop dan hapus volume:

```bash
docker compose down -v
```

---

# 🔧 Troubleshooting

## Auth Service Unhealthy

Pemeriksaan:

```bash
docker compose logs auth-service
```

Solusi:

```bash
docker compose restart auth-service
```

---

## Item Service Unhealthy

Pemeriksaan:

```bash
docker compose logs item-service
```

Solusi:

```bash
docker compose restart item-service
```

---

## Database Connection Error

Pemeriksaan:

```bash
docker compose logs auth-db

docker compose logs item-db
```

---

## Invalid or Expired Token

Gejala:

```json
{
  "detail":"Invalid or expired token"
}
```

Solusi:

* Login ulang
* Gunakan token baru
* Pastikan Auth Service aktif

---

## Port Already Allocated

Contoh:

```text
Bind for 0.0.0.0:5434 failed
```

Pemeriksaan:

```bash
docker ps
```

Solusi:

```bash
docker stop <container-id>
```

---

# 📈 Deployment Evolution Summary

| Version | Deployment Model             |
| ------- | ---------------------------- |
| v1.0.0  | Monolith                     |
| v2.0.0  | Railway Deployment           |
| v3.0.0  | Docker Compose Microservices |

---

# ✅ Deployment Status

ATHSNACK berhasil di-deploy menggunakan dua pendekatan berbeda selama proses pengembangan:

### Monolith Deployment

* Railway
* PostgreSQL
* Frontend React
* Backend FastAPI

### Microservices Deployment

* Docker Compose
* Auth Service
* Item Service
* API Gateway
* Database per Service

Fitur yang telah berhasil diimplementasikan:

✅ Containerization

✅ Railway Deployment

✅ Docker Compose Deployment

✅ API Gateway

✅ JWT Authentication

✅ Reliability Engineering

✅ Structured Logging

✅ Correlation ID Tracing

✅ Metrics Monitoring

✅ Health Check Monitoring

✅ Security Hardening

Do
