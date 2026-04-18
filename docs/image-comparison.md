# 📊 Perbandingan Ukuran Docker Image — Python 3.12 Variants
---

## 📈 Ringkasan Perbandingan

| Varian | Base Image | Uncompressed Size | Compressed Size | Difference | Use Case |
|--------|-----------|-------------------|-----------------|-----------|----------|
| **Full** | `python:3.12` | ~920 MB | ~310 MB | 100% | Development, Full Features |
| **Slim** | `python:3.12-slim` | ~170 MB | ~60 MB | 82% lebih kecil | Production + Build Tools |
| **Alpine** | `python:3.12-alpine` | ~50 MB | ~16 MB | 95% lebih kecil | Minimal/Microservices |

**Key Insight:** Alpine image 18x lebih kecil dari full image, namun Slim sudah cukup untuk production dan memiliki library yang lebih lengkap.

---

## 🔍 Detail Analisis Per Varian

### 1️⃣ Python:3.12 (Full)

**Karakteristik:**
- **Uncompressed Size:** ~920 MB → ~1 GB
- **Compressed Size:** ~310 MB (saat push ke registry)
- **Base OS:** Debian 12 (Bookworm)
- **Included:** GCC, build tools, compiler, development libraries

**Kelebihan:**
- ✅ Semua development tools sudah terinstall
- ✅ Kompatibilitas maksimal dengan build wheels (C extensions)
- ✅ Support penuh untuk semua dependencies (numpy, scipy, psycopg2, etc.)
- ✅ Tidak perlu install tools tambahan saat build

**Kekurangan:**
- ❌ Ukuran sangat besar untuk production
- ❌ Slower image pull & deployment
- ❌ Lebih banyak potential vulnerabilities (lebih banyak packages)
- ❌ Waste resources (banyak unused libraries)

**Rekomendasi Use Case:**
- Local development dengan Docker Compose
- CI/CD build stage (multi-stage build)
- Development environment setup
- Quick prototyping

**Docker Pull Contoh:**
```dockerfile
FROM python:3.12

# Semua build tools sudah ada di sini
# Bisa langsung compile extensions
```

**Estimasi Pull Time:** ~2-3 menit (tergantung internet)

---

### 2️⃣ Python:3.12-slim

**Karakteristik:**
- **Uncompressed Size:** ~170 MB
- **Compressed Size:** ~60 MB (saat push ke registry)
- **Base OS:** Debian 12 (Bookworm) - Minimal
- **Included:** Essential build tools, but NOT compiler chain

**Kelebihan:**
- ✅ Ukuran reasonable (170 MB uncompressed)
- ✅ Fastsing image pull & deployment (~5x lebih cepat dari full)
- ✅ Enough untuk production dengan minimal dependencies
- ✅ Less attack surface (fewer packages = fewer vulnerabilities)
- ✅ Tetap support C extensions (GCC ada tapi minimal)

**Kekurangan:**
- ⚠️ Beberapa build dependencies tidak ada (bisa perlu custom install)
- ⚠️ Lebih complex jika ada dependencies yang perlu compilation
- ⚠️ Tidak cocok untuk development (tools minimal)

**Rekomendasi Use Case:**
- **RECOMMENDED untuk production** ⭐
- Base image untuk multi-stage build
- Containerized microservices
- Cloud deployment (AWS ECS, GKE, etc.)
- FastAPI/Flask production apps
- Database applications (minimal queries)

**Docker Pull Contoh:**
```dockerfile
FROM python:3.12-slim AS builder

# Install dependencies yang butuh compile
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

---

FROM python:3.12-slim

# Copy hanya hasil install, buang builder tools
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

COPY . .
CMD ["python", "main.py"]
```

**Estimasi Pull Time:** ~1-1.5 menit

**Ukuran Final Image:** ~200-250 MB (uncompressed)

---

### 3️⃣ Python:3.12-alpine

**Karakteristik:**
- **Uncompressed Size:** ~50 MB
- **Compressed Size:** ~16 MB (saat push ke registry)
- **Base OS:** Alpine Linux (non-GNU)
- **Included:** Minimal, hanya Python runtime

**Kelebihan:**
- ✅ **ULTRA KECIL** — Ideal untuk resource-constrained environments
- ✅ **SANGAT CEPAT** untuk pull/push image
- ✅ Minimal attack surface (Alpine very stripped down)
- ✅ Cocok untuk serverless (AWS Lambda, Google Cloud Run)
- ✅ Efficient untuk Kubernetes clusters (banyak nodes)

**Kekurangan:**
- ❌ Tidak compatible dengan musl libc (berbeda dari glibc)
- ❌ Beberapa Python packages tidak punya pre-built wheels untuk alpine
- ❌ GCC tidak ada — harus install jika need compilation
- ❌ Build process jadi lebih kompleks
- ❌ Troubleshooting lebih sulit (minimal tools)

**Rekomendasi Use Case:**
- ✅ **TERBAIK untuk microservices** yang lightweight
- ✅ Serverless/container orchestration (size matters)
- ✅ CI/CD runner images
- ✅ Minimal apps (API sederhana tanpa heavy dependencies)
- ✅ Resource-constrained environments

**Docker Pull Contoh:**
```dockerfile
FROM python:3.12-alpine

# Install build dependencies hanya saat build
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    openssl-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Clean up build tools
RUN apk del gcc musl-dev

COPY . .
CMD ["python", "main.py"]
```

**Estimasi Pull Time:** ~20-40 detik (SUPER CEPAT!)

**Ukuran Final Image:** ~80-150 MB (tergantung dependencies)

---

## 📊 Tabel Perbandingan Detail

### Ukuran Penyimpanan

| Aspek | python:3.12 | python:3.12-slim | python:3.12-alpine | Keterangan |
|-------|------------|------------------|-------------------|-----------|
| Uncompressed | 920 MB | 170 MB | 50 MB | Raw size di disk |
| Compressed (registry) | 310 MB | 60 MB | 16 MB | Size saat push ke Docker Hub |
| Pull time (1Mbps) | 5 min | 1 min | 10 sec | Rough estimation |
| Extraction time | ~30s | ~10s | ~3s | Time to extract layers |

### Base OS & Tools

| Tools | python:3.12 | python:3.12-slim | python:3.12-alpine |
|-------|------------|------------------|-------------------|
| Base OS | Debian 12 | Debian 12 | Alpine 3.x |
| libc | glibc | glibc | musl |
| GCC | ✅ Full | ⚠️ Minimal | ❌ Need manual |
| Build Essentials | ✅ Complete | ⚠️ Partial | ❌ Manual |
| Package Manager | apt | apt | apk |
| Pre-installed Packages | 300+ | ~150 | ~30 |

### Python & Runtime

| Feature | python:3.12 | python:3.12-slim | python:3.12-alpine |
|---------|------------|------------------|-------------------|
| Python Version | 3.12.x | 3.12.x | 3.12.x |
| pip | ✅ Latest | ✅ Latest | ✅ Latest |
| setuptools | ✅ Included | ✅ Included | ✅ Included |
| C Extension Support | ✅ Full | ✅ Good | ⚠️ Limited |
| Binary Wheels | ✅ Most libs | ✅ Most libs | ❌ Custom needed |

---

## 🚀 Rekomendasi untuk ATHSNAC Project

### Production Deployment
```dockerfile
# RECOMMENDED: Multi-stage build dengan slim
FROM python:3.12-slim as builder

WORKDIR /app

# Install dependencies yang butuh compile
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

---

# Final stage
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages dari builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Alasan:**
- ✅ Slim sudah cukup untuk production (170 MB acceptable)
- ✅ Support C extensions jika ada dependencies complex
- ✅ glibc compatible (kompatibilitas luas)
- ✅ Deployment fast (~60 MB compressed)

---

## 🧪 Cara Verifikasi Ukuran Lokal

### 1. Check Uncompressed Size
```bash
docker images
# Kolom SIZE menampilkan uncompressed size
# Contoh output:
# REPOSITORY      TAG              SIZE
# python          3.12             920MB
# python          3.12-slim        170MB
# python          3.12-alpine      50MB
```

### 2. Check Compressed Size (Registry)
```bash
# Install dive untuk inspect image layers
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive:latest python:3.12

# Output menampilkan layer breakdown
```

### 3. Test Pull Time
```bash
# Timing untuk full image
time docker pull python:3.12

# Timing untuk slim
time docker pull python:3.12-slim

# Timing untuk alpine
time docker pull python:3.12-alpine
```

### 4. Inspect Layer Details
```bash
docker history python:3.12
docker history python:3.12-slim
docker history python:3.12-alpine
```

**Output Contoh:**
```
IMAGE          CREATED       CREATED BY                      SIZE
<missing>      2 weeks ago   /bin/sh -c #(nop)  ENTRYPOINT...  0 B
<missing>      2 weeks ago   /bin/sh -c #(nop)  CMD ["pyt...   0 B
<missing>      2 weeks ago   /bin/sh -c set -eux;              920MB  ← Python binary & stdlib
<missing>      3 weeks ago   /bin/sh -c #(nop)  ENV PATH=...   0 B
<missing>      3 weeks ago   /bin/sh -c apt-get install...     500MB  ← Build tools
```

---

## 📋 Quick Decision Matrix

Gunakan matrix ini untuk **memilih image yang tepat**:

```
┌─────────────────────────────────────────────┐
│ Apakah perlu build tools? (GCC, make, etc)  │
├──────────────────────────────────────────────┤
│                                               │
│  YES → python:3.12 (Full)                   │
│        Gunakan untuk development & CI/CD    │
│                                               │
│  NO → Apakah image size kritis?             │
│       ├─ YES → python:3.12-alpine          │
│       │         (Serverless, microservices)│
│       │                                      │
│       └─ NO → python:3.12-slim ⭐          │
│              (RECOMMENDED untuk production) │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 🎯 Kesimpulan

### Untuk ATHSNAC Project Deployment:

**Stage 1: Development** 
- Image: `python:3.12` (Full)
- Purpose: Local development dengan semua tools
- Size: Tidak masalah (local only)

**Stage 2: CI/CD Build**
- Image: `python:3.12-slim` (Slim builder stage)
- Purpose: Build dependencies, compile wheels
- Size: 170 MB reasonable

**Stage 3: Production Runtime** ⭐ **RECOMMENDED**
- Image: `python:3.12-slim` (Final stage)
- Purpose: Run FastAPI/Uvicorn server
- Size: 200-250 MB (acceptable untuk production)
- Pull time: ~60 seconds (acceptable)

**Alternative untuk Microservices:**
- Image: `python:3.12-alpine`
- Jika size sangat kritis & dependencies minimal
- Size: ~16 MB compressed (ultra lightweight)
- Trade-off: Lebih complex build process

---
