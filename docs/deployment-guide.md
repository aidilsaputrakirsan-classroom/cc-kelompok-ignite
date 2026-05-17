# 📦 Deployment Guide

> Branch: `feature/deploy-workflow-improve`  
> Lead DevOps — Tugas 11, Modul 11

---

## Daftar Isi

- [Arsitektur Deployment](#arsitektur-deployment)
- [Cara Deploy](#cara-deploy)
- [Health Check](#health-check)
- [Rollback Manual](#rollback-manual)
- [Troubleshooting](#troubleshooting)

---

## Arsitektur Deployment

```
git push → main
    │
    ▼
CI Pipeline (ci.yml)         ← Harus PASS dulu
    │  lint + test + build
    ▼
CD Pipeline (cd.yml)         ← Otomatis jalan setelah CI pass
    ├── deploy-backend  ──┐
    ├── deploy-frontend ──┤  (paralel)
    │                     │
    ▼                     ▼
health-check              ← Verifikasi /health endpoint
    │
    ▼
notify-deploy             ← Summary di log Actions
```

Semua secrets (token, URL) disimpan di **GitHub → Settings → Secrets and variables → Actions**. Tidak ada credentials di kode.

---

## Cara Deploy

### Deploy Otomatis (Normal)

Cukup merge PR ke `main` — CD pipeline akan jalan otomatis.

```bash
# Pastikan CI pass dulu, lalu merge di GitHub
# CD pipeline otomatis trigger setelah merge
```

### Deploy Manual (Emergency)

Jika perlu deploy tanpa PR, bisa trigger manual dari GitHub:

1. Buka repository → tab **Actions**
2. Pilih workflow **CD Pipeline**
3. Klik **Run workflow** → pilih branch `main` → klik **Run workflow**

---

## Health Check

Setelah deploy, pipeline otomatis memanggil endpoint `/health` backend:

```
GET https://<BACKEND_URL>/health
```

Response yang diharapkan:
```json
{
  "status": "healthy",
  "service": "backend"
}
```

Pipeline melakukan **retry hingga 5x** dengan jeda 15 detik sebelum dinyatakan gagal. Jika gagal, workflow berhenti dan alert muncul di GitHub Actions.

---

## Rollback Manual

> ⚠️ Lakukan rollback jika health check gagal atau ada bug kritis di production.

### Langkah 1 — Identifikasi Commit yang Stabil

```bash
# Lihat history commit di main
git log --oneline main | head -10

# Contoh output:
# a1b2c3d chore: update config (BERMASALAH)
# 9f8e7d6 feat: add item categories      ← target rollback
# 5c4b3a2 fix: fix login bug
```

### Langkah 2 — Buat Revert Commit

**Cara aman (direkomendasikan) — Revert:**

```bash
git checkout main
git pull origin main

# Revert commit bermasalah (buat commit baru yang membalik perubahan)
git revert a1b2c3d --no-edit

# Push → otomatis trigger CD pipeline dengan kode yang sudah di-revert
git push origin main
```

**Cara cepat (jika revert tidak memungkinkan) — Reset:**

```bash
# ⚠️ HATI-HATI: force push mengubah history!
# Gunakan HANYA jika revert tidak bisa dilakukan dan situasi darurat

git checkout main
git pull origin main
git reset --hard 9f8e7d6   # SHA commit yang stabil

# Force push — pastikan koordinasi dengan seluruh tim dulu!
git push --force-with-lease origin main
```

> 💡 **Gunakan `--force-with-lease`**, bukan `--force`. Lebih aman karena akan gagal jika ada commit lain yang belum kamu pull.

### Langkah 3 — Verifikasi Rollback

Setelah push, tunggu CD pipeline selesai (~3-5 menit), lalu:

```bash
# Cek health endpoint secara manual
curl https://<BACKEND_URL>/health

# Ekspektasi:
# {"status": "healthy", "service": "backend"}
```

Atau buka tab **Actions** di GitHub dan pastikan CD pipeline hijau.

### Langkah 4 — Laporan Insiden

Setelah production stabil, buat laporan singkat di channel tim:

```
[INCIDENT REPORT]
- Waktu mulai  : ...
- Waktu selesai: ...
- Root cause   : ...
- Tindakan     : Revert commit <SHA>
- Status       : ✅ Resolved
```

---

## Troubleshooting

### Health check gagal terus padahal app jalan

Kemungkinan penyebab:
- Endpoint `/health` belum ada di backend → tambahkan route `/health`
- Backend butuh waktu lebih lama untuk startup → naikkan `sleep` di workflow
- Environment variable tidak terset → cek Secrets di GitHub Settings

### `RAILWAY_TOKEN` invalid

```
Error: Authentication failed
```

Solusi: Regenerate token di Railway dashboard → update secret di GitHub.

### Build Docker gagal di CI tapi jalan di lokal

Kemungkinan penyebab file tidak ter-copy di Dockerfile:
```dockerfile
# Pastikan .dockerignore tidak mengecualikan file penting
COPY requirements.txt .    # ← pastikan path benar
```

### Frontend tidak bisa akses backend (CORS error)

Cek `backend/config.py` — pastikan `CORS_ORIGINS` sudah menyertakan URL production frontend.

---

*Dokumentasi ini dikelola oleh **Lead DevOps**. Update setiap ada perubahan infrastruktur.*