# 📋 UTS Demo Script — Cloud Team Ignite (ATHSNAC)

**Durasi Total: ~15 menit**

---

## 1️⃣ Setup (2 menit)

### A. Buka Terminal di Root Project
```bash
cd c:\Users\ASUS\cc-kelompok-ignite
```

### B. Jalankan Docker Services
```bash
docker compose up -d
```
**Tunggu ~10 detik untuk services start**

### C. Verifikasi 3 Services Healthy
```bash
docker compose ps
```

**Tunjukkan ke dosen:**
- ✅ **athsnac-backend** (FastAPI) → port 8000 → status `Up`
- ✅ **athsnac-frontend** (React + Vite) → port 5173 → status `Up`  
- ✅ **postgres** (PostgreSQL DB) → port 5432 → status `Up`

Penjelasan: "Ketiga service sudah berjalan dan siap digunakan"

---

## 2️⃣ Frontend Demo — Admin Dashboard (5 menit)

### A. Akses Application
```
Buka browser → http://localhost:5173
```
Tampilkan: Landing page ATHSNAC dengan hero section & navbar

### B. Admin Login
1. Klik **"Login"** di navbar → Tampil 2 pilihan: Customer / Admin
2. Pilih **"Admin Login"**
3. Isi credentials:
   - Email: `admin@test.com`
   - Password: `admin123`
4. Klik **"Login"** → Redirect ke **Admin Dashboard**

**Demo poin:**
- JWT authentication working
- Role-based routing (admin vs customer)
- Protected route access control

### C. Admin Dashboard Overview
Tampilkan halaman utama Admin Dashboard dengan:
- **Summary Cards:**
  - Total Produk: 25
  - Total Pesanan: 15
  - Pembayaran Pending: 3
  - Testimoni Menunggu: 5
- **Quick Links:** Produk, Pesanan, Pembayaran, Testimoni, Pelanggan
- **Navigation Sidebar:** Menu lengkap untuk manajemen

**Demo poin:**
- Admin view berbeda dari customer
- Dashboard summary statistics
- Easy navigation untuk admin tasks

### D. Kelola Produk — Create, Read, Update 

**1. Lihat Daftar Produk:**
- Klik **"Produk"** di sidebar
- Tampilkan tabel produk:
  - Nama | Kategori | Harga | Stock | Status | Aksi

**2. Edit Produk Existing:**
- Klik tombol **"Edit"** pada salah satu produk (ex: Amplang)
- Form tampil:
  - Nama: `Amplang` (pre-filled)
  - Deskripsi: (pre-filled)
  - Kategori: `Makanan`
  - Harga: `25000`
  - Stock: `50`
  - Upload image (optional)
- Edit salah satu field (ex: Harga jadi `26000`)
- Klik **"Simpan"** → Toast: "Produk berhasil diupdate" ✅

**3. Tambah Produk Baru:**
- Klik tombol **"Tambah Produk"**
- Form kosong tampil:
  - Nama: `Keripik Singkong` (isi)
  - Deskripsi: `Keripik singkong renyah` (isi)
  - Kategori: `Snack` (pilih)
  - Harga: `20000` (isi)
  - Stock: `100` (isi)
  - Upload image
- Klik **"Tambah"** → Toast: "Produk berhasil ditambahkan" ✅
- Produk baru tampil di tabel

**4. Hapus Produk:**
- Klik tombol **"Hapus"** pada salah satu produk
- Confirm dialog: "Yakin ingin menghapus produk ini?"
- Klik **"Ya"** → Toast: "Produk berhasil dihapus" ✅
- Produk hilang dari tabel

**Demo poin:**
- CRUD operations (Create, Read, Update, Delete)
- Form validation & error handling
- Real-time table update
- Admin-only access

### E. Kelola Pesanan 

**1. Lihat Daftar Pesanan:**
- Klik **"Pesanan"** di sidebar
- Tampilkan tabel order:
  - Order Code | Customer | Total | Status | Aksi
  - Contoh: ORD-20260419-001 | Budi | Rp 75.000 | PENDING

**2. Lihat Detail Pesanan:**
- Klik **"Detail"** pada order
- Tampilkan:
  - Order code, tanggal, customer info
  - Daftar item yang dipesan
  - Total amount
  - Status dropdown: PENDING → PROCESSING → SHIPPED → DELIVERED
- Ubah status ke **"PROCESSING"** → Toast: "Status berhasil diupdate" ✅
- Ubah lagi ke **"SHIPPED"** untuk demo

**Demo poin:**
- Order management & status tracking

---

## 3️⃣ Backend Demo (3 menit)

### A. Buka Swagger UI
```
Buka: http://localhost:8000/docs
```
Tampilkan: Auto-generated API documentation

### B. Tunjukkan Endpoints
Scroll dan tunjukkan endpoint groups:
1. **🔑 Authentication** — register, login, get_current_user
2. **🛍️ Products** — list, create (admin only), detail, update, delete
3. **🛒 Cart** — get_cart, add_item, update_item, delete_item
4. **📦 Orders** — create_order, list_orders, get_order_detail, update_status
5. **💳 Payments** — create_payment, list_payments, verify_payment (admin only)
6. **⭐ Testimonials** — create_testimonial, list_testimonial, update_testimonial

### C. Test Live Endpoint
**Try It Out: GET /products**
1. Klik "Try it out"
2. Klik "Execute" → Tampil:
```json
[
  {
    "id": 1,
    "name": "Amplang",
    "price": 25000,
    "stock": 50,
    "category": "makanan"
  },
  ...
]
```

**Try It Out: GET /auth/me** (dengan JWT token)
1. Dari login di frontend, copy token dari browser DevTools → Application → localStorage → access_token
2. Klik "Try it out"
3. Masukkan token di Authorization field
4. Klik "Execute" → Tampil:
```json
{
  "id": 1,
  "email": "customer@test.com",
  "name": "Budi Santoso",
  "role": "customer"
}
```

**Demo poin:**
- Auto-generated Swagger documentation (FastAPI)
- JWT token validation
- Request/Response schema validation
- Error handling (401, 403, 404)

---

## 4️⃣ Docker Demo (3 menit)

### A. Show Container Status
```bash
docker compose ps
```
Tampilkan:
- Container names, ports, status
- Networking: semua connected

### B. Show Docker Compose Config
```bash
cat docker-compose.yml
```
Scroll dan tunjukkan:
- Service definitions (backend, frontend, postgres)
- Port mappings
- Environment variables
- Health checks
- Volumes configuration

### C. Demo Data Persistence
1. **Di admin browser:** Buat/edit 1 produk baru (ikuti langkah 2D)

2. **Stop semua containers:**
   ```bash
   docker compose down
   ```
   Tunggu sebentar... Tampilkan: "Stopping... Removing... Done"

3. **Start kembali:**
   ```bash
   docker compose up -d
   docker compose ps
   ```
   Tampilkan: Services starting kembali → "Up"

4. **Buka browser → http://localhost:5173**

5. **Login kembali** dengan admin credentials yang sama
   - Email: `admin1@gmail.com`
   - Password: `admin123`

6. **Klik "Produk"** → **Data produk masih ada!** ✅ (termasuk produk yang baru dibuat/diedit)

**Penjelasan ke dosen:**
"Ketika kami stop container, PostgreSQL volume tetap persist di host. Jadi ketika service di-start lagi, data langsung ter-load kembali dari volume. Ini menunjukkan bahwa semua perubahan yang kami lakukan (edit produk, ubah order status, verifikasi pembayaran) semuanya tersimpan di database dan tidak hilang saat restart."

**Demo poin:**
- Container orchestration dengan docker-compose
- Multi-service architecture & networking
- Volume persistence (data tidak hilang saat restart)
- Service health checks

---

## 5️⃣ Code Walkthrough (2 menit)

### A. Tunjukkan docker-compose.yml
```bash
code docker-compose.yml
```
Highlight:
- 3 services: backend, frontend, postgres
- Port mappings
- Health checks (confirm container ready sebelum start service lain)
- Volumes (postgres data persistence)
- Environment variables

### B. Tunjukkan Backend Dockerfile
```bash
code backend/Dockerfile
```
Highlight:
- Base image: `python:3.10-slim`
- Install dependencies
- Copy code
- Expose port 8000
- Run uvicorn server

### C. Tunjukkan Frontend Dockerfile
```bash
code frontend/Dockerfile
```
Highlight:
- Multi-stage build:
  - Stage 1: Build dengan Node.js (install deps, build React)
  - Stage 2: Serve dengan nginx (hasil build di stage 1)
  - Optimization: hanya copy hasil build, bukan semua node_modules
- Nginx config untuk routing
- Expose port 5173

**Demo poin:**
- Infrastructure as Code (docker-compose.yml)
- Dockerfile best practices
- Multi-stage builds untuk optimization
- Health checks untuk reliability

---

## ✅ Demo Checklist

- [ ] Docker compose up & all services healthy
- [ ] Admin login authentication
- [ ] Admin dashboard overview & summary cards
- [ ] Create produk baru
- [ ] Edit produk existing
- [ ] Delete produk
- [ ] View order list & order details
- [ ] Update order status (PENDING → PROCESSING → SHIPPED)
- [ ] Verify payment (PENDING → COMPLETED)
- [ ] View testimonials
- [ ] Toggle testimonial visibility (show/hide)
- [ ] Swagger API documentation
- [ ] Live API endpoint testing
- [ ] Docker persistence demo
- [ ] Show code (docker-compose.yml, Dockerfile)

---

## 🚀 Quick Reference Commands

```bash
# Start services
docker compose up -d

# Check status
docker compose ps

# View logs (real-time)
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# Stop all services
docker compose down

# Clean everything (remove volumes)
docker compose down -v

# Rebuild images
docker compose build
docker compose up -d
```
