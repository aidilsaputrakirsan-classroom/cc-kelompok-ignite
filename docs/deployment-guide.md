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

> ⚠️ **JANGAN di-commit ke GitHub! Simpan di GitHub Secrets saja.**

---

## 🚀 Deployment Steps Summary

### Automatic Deployment (via GitHub Actions)

Setelah Rails configuration complete, automatic deployment:

```
1. Push to main branch
   ↓
2. GitHub Actions CI pipeline runs:
   - Lint code
   - Run tests
   - Build Docker images
   ↓
3. If CI pass:
   - Deploy backend ke Railway
   - Deploy frontend ke Railway
   ↓
4. Health check
   ↓
5. Notification ke tim
```

**Workflow file:** `.github/workflows/ci.yml`

### Manual Deployment (if needed)

```bash
# Login ke Railway
railway login

# Klik service
railway up

# Rebuild image
railway up --build
```

---

## 🔧 Troubleshooting

### Problem 1: "502 Bad Gateway"

**Symptoms:** Frontend returns 502 error

**Check:**
```
1. Railway dashboard → Backend service
2. Check Deployments tab:
   - Status: Success atau Failed?
   - Build logs ada error?
3. Check Variables:
   - DATABASE_URL correct?
   - PORT set to 8000?
4. Check health endpoint:
   curl https://cc-kelompok-ignite-production.up.railway.app/health
```

**Solution:**
```
- Jika build failed: Check backend/Dockerfile syntax
- Jika health endpoint 502: Database might be down
- Restart service: Dashboard → More → Restart
```

---

### Problem 2: "CORS Error" di Browser Console

**Symptoms:** 
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...'
has been blocked by CORS policy
```

**Check:**
```
1. Railway Backend → Variables
2. Verify CORS_ORIGINS =correct frontend URL
3. Exact match required: https://aware-warmth-production-ebd3.up.railway.app
```

**Solution:**
```
1. Update CORS_ORIGINS di Railway variables
2. Wait ~2 minutes (Railway auto-redeploy)
3. Hard refresh browser: Ctrl+Shift+R
4. Check browser F12 → Network tab (see request headers)
```

---

### Problem 3: "Database Connection Refused"

**Symptoms:**
```
ERROR: connect() failed (Errno 111)
cannot connect to PostgreSQL
```

**Check:**
```
1. Railway dashboard → PostgreSQL service
2. Status: Online atau Offline?
3. DATABASE_URL format correct?
```

**Solution:**
```
- If status Offline: Restart PostgreSQL service
- If format wrong: Copy DATABASE_URL dari Railway again
- Test local: psql postgresql://user:pass@host:5432/railway
```

---

### Problem 4: "Frontend Blank Page"

**Symptoms:**
```
Page loads pero nothing visible
Console F12 shows: Failed to fetch / 404
```

**Check:**
```
1. VITE_API_URL di frontend/.env.production correct?
2. Should be: https://cc-kelompok-ignite-production.up.railway.app
3. Check backend health: https://.../ health (200 OK?)
```

**Solution:**
```
1. Update frontend/.env.production
2. Run: npm run build
3. git add . && git commit && git push
4. Wait for CD pipeline (auto-deploy)
5. Hard refresh: Ctrl+Shift+R
```

---

### Problem 5: "Logs showing 'ModuleNotFoundError'"

**Symptoms:**
```
backend-xxx ModuleNotFoundError: No module named 'fastapi'
```

**Check:**
```
1. backend/requirements.txt ada semua dependency?
2. Dockerfile COPY requirements.txt correct?
3. RUN pip install -r requirements.txt di Dockerfile?
```

**Solution:**
```
1. Add missing module ke requirements.txt
2. Commit & push
3. Railway auto-rebuild
```

---

## 📊 Monitoring & Maintenance

### Daily Checks

```
✅ Check Railway dashboard
✅ Verify both services (backend + frontend) status = "Running"
✅ Spot check: Open frontend → test login
✅ Check PostgreSQL status
✅ Review error logs (if any)
```

### Weekly Tasks

```
✅ Review deployment history
✅ Check database size (approaching limit?)
✅ Monitor response times
✅ Review failed CI pipelines (if any)
```

### Monthly Tasks

```
✅ Database backup verification
✅ Update dependencies (pip, npm)
✅ Performance analysis
✅ Security audit (secrets rotation)
```

### Backup Strategy

**Automatic:**
- Railway backs up PostgreSQL daily
- Retention: Last 7 days

**Manual Backup:**
```bash
# Export database
pg_dump postgresql://user:pass@host:port/db > backup.sql

# Keep in secure location (GitHub? Google Drive?)
```

---

## 🔄 Rollback Procedure

Jika production version punya critical bug:

### Quick Rollback (30 seconds)

1. Go to Railway dashboard
2. Service → Deployments
3. Click previous successful deployment
4. Click **Redeploy**

Aplikasi instant rollback ke versi sebelumnya.

### Code Rollback

```bash
# Jika mau rollback code juga
git revert <commit-hash>
git push origin main
# CD pipeline auto-deploy versi baru (yang reverted)
```

---

## 📈 Performance Tips

### Database Query Optimization
```
✅ Use indexes untuk frequently queried columns
✅ Avoid SELECT * (specify columns needed)
✅ Use pagination untuk large datasets
✅ Monitor slow queries (Railway logs)
```

### Frontend Optimization
```
✅ Build size monitoring (npm run build → check dist/ size)
✅ Image optimization (compress sebelum upload)
✅ Lazy loading untuk heavy components
✅ Cache API responses di frontend (where applicable)
```

### Backend Optimization
```
✅ Add caching layer (Redis, if needed)
✅ Connection pooling di database
✅ API rate limiting (prevent abuse)
✅ Log levels: INFO in production (not DEBUG)
```

---

## 🔐 Security Checklist

- ✅ HTTPS/SSL active (Railway otomatis)
- ✅ Secrets dalam environment variables (bukan hardcoded)
- ✅ JWT token expiry set (60 minutes)
- ✅ CORS configured (specific origins, not *)
- ✅ Database password strong (Railway generated)
- ✅ Branch protection active (PR required)
- ✅ GitHub Secrets encrypted
- ✅ Admin credentials not default
