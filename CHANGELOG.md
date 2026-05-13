# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- GitHub Actions CI pipeline — build, lint, dan automated test (dijadwalkan Minggu 10–11)
- Deployment ke Railway / Render untuk akses online (dijadwalkan Minggu 9–11)
- Branch protection rules dan CODEOWNERS konfigurasi (Minggu 9 — sedang berjalan)

---

## [1.1.0] — Milestone 2 Fase Awal — Git Workflow & Docker — 2026-04-14

> Mencakup Minggu 5–9: Docker containerization, Docker Compose, dan penerapan
> Git workflow profesional dengan branch protection dan Pull Request.

### Added

**Minggu 5–7 — Docker & Containerization**

- `backend/Dockerfile` — image backend berbasis `python:3.11-slim`, layer-optimized build
  > **Penjelasan:** Dockerfile = "resep" untuk buat container (seperti resep masak). Image python:3.11-slim = basis (Python 3.11 + tools minimal, lebih ringan dari "python:3.11"). Layer-optimized = urutan command diatur agar reusable dan cepat rebuild.
  
- `frontend/Dockerfile` — multi-stage build: Node.js untuk build React, Nginx Alpine untuk serving
  > **Penjelasan:** Multi-stage = 2 tahap: (1) Build React dengan Node.js → hasilkan dist/ (2) Copy dist/ ke Nginx Alpine (ringan, hanya untuk serve static files). Hasil akhir image kecil, cepat.
  
- `backend/.dockerignore` — mengecualikan `.env`, `__pycache__`, `.git`, `venv` dari image
  > **Penjelasan:** .dockerignore = seperti .gitignore. File-file yang tidak perlu masuk image (cache, env lokal, repo git, virtual env) dikecualikan. Image jadi lebih kecil, build lebih cepat.
  
- `frontend/.dockerignore` — mengecualikan `node_modules`, `.env`, `dist` dari image
- `docker-compose.yml` — orkestrasi tiga service sekaligus: `backend`, `frontend`, `db` (PostgreSQL)
  > **Penjelasan:** Docker Compose = file konfigurasi YAML yang mendefinisikan: (1) backend service (FastAPI container), (2) frontend service (React container), (3) db service (PostgreSQL container). Jalankan `docker compose up` → ketiga service jalan bersamaan.
  
- Health check di `docker-compose.yml` — backend dan database saling menunggu siap sebelum start
  > **Penjelasan:** Health check = cek apakah service sudah ready. Misal database health check jalankan `pg_isready` setiap 10 detik. Backend baru start SETELAH database healthy (cegah error koneksi).
  
- `docker-compose.prod.yml` — konfigurasi override untuk environment production
  > **Penjelasan:** Production config = berbeda dari development. Misal prod mode, debug off, hanya port penting terbuka, replica/scale up, resources limit, dll. Docker Compose bisa punya override config untuk prod.
  
- Environment variable `DATABASE_URL` dikonfigurasi menggunakan `host.docker.internal` untuk koneksi container ke host database
  > **Penjelasan:** host.docker.internal = hostname khusus di Docker untuk akses host machine dari container. Misal: DATABASE_URL=postgresql://user:pass@host.docker.internal:5432/db (container akses PostgreSQL yang running di host).
  
- Nginx sebagai reverse proxy dan static file server untuk frontend production
  > **Penjelasan:** Nginx = web server super cepat dan ringan. Reverse proxy = Nginx menerima request /api → forward ke backend 8000. Static file = Nginx serve React build files (HTML, CSS, JS). Lebih efficient dari Node.js dev server.
  
- Image backend di-push ke Docker Hub: `athsnac-backend:latest`
  > **Penjelasan:** Docker Hub = repository publik untuk Docker images (seperti npm/pip). Push image di sini = mudah di-share & deploy di server manapun.
  
- Image frontend di-push ke Docker Hub: `athsnac-frontend:latest`
- `docs/image-comparison.md` — perbandingan ukuran base image `python:3.11`, `python:3.11-slim`, dan `python:3.11-alpine`
  > **Penjelasan:** Dokumentasi research: image mana yang paling kecil/cepat. python:3.11-slim vs alpine = tradeoff antara ukuran vs compatibility.
  
- `docs/docker-architecture.md` — dokumentasi arsitektur Docker dan Docker Compose tim
  > **Penjelasan:** Dokumentasi diagram: bagaimana 3 services terhubung, data flow, network topology, troubleshooting tips.

**Minggu 9 — Git Workflow & Branching Strategy**

- File `.github/CODEOWNERS` — reviewer otomatis per area kode berdasarkan peran tim
  > **Penjelasan:** CODEOWNERS = file yang define siapa yang expert di area mana. Misal: `/backend/ @andini` = siapa PR ubah backend, andini auto-ditambah sebagai reviewer (GitHub auto-assign).
  
- File `.github/pull_request_template.md` — template standar Pull Request seluruh tim
  > **Penjelasan:** PR template = form standar yang muncul saat create PR. Berisi: deskripsi perubahan, issue number, testing done, screenshot (kalau ada UI change), checklist. Standardisasi → PR lebih terstruktur & mudah di-review.
  
- Branch protection rules aktif di `main` — push langsung ke main ditolak, wajib via PR
  > **Penjelasan:** Branch protection = "gerbang keamanan". Tanpa ini, siapa saja bisa push ke main (bahaya!). Dengan ini: ❌ push langsung ditolak, ✅ harus via PR + review + approval baru boleh merge.
  
- `CHANGELOG.md` — dokumen ini, mengikuti format Keep a Changelog
  > **Penjelasan:** CHANGELOG = dokumentasi semua perubahan per version. Format Keep a Changelog = standar industri (Section: Added/Changed/Removed/Fixed). Mudah dibaca & semua project gunakan format sama.

### Changed

- Semua kontribusi tim kini wajib melalui Pull Request + code review sebelum merge ke `main`
  > **Penjelasan:** Sebelum Minggu 9, bisa push langsung ke main. Sekarang semua harus via PR + minimal 1 orang review + approve baru merge. Quality control lebih ketat, bug berkurang.
  
- Merge strategy distandarkan ke **Squash and Merge** untuk menjaga history `main` tetap bersih
  > **Penjelasan:** Squash and Merge = gabung semua commit di branch jadi 1 commit saat merge. Manfaat: history `main` lebih rapi, mudah di-read, tidak berantakan dengan detail commit feature branch.
  
- Branch `main` dilindungi: minimal 1 approval diperlukan sebelum merge
  > **Penjelasan:** PR tidak bisa di-merge sendirian. Harus ada 1 (atau lebih) orang approve PR dulu. Cegah self-merge, pastikan ada review sebelum code masuk main.

---

## [1.0.0] — Milestone 1 — Full-Stack + Auth — 2026-03-22

> Milestone 1 mencakup Minggu 1–4: Setup proyek, Backend REST API lengkap,
> Frontend React multi-halaman, dan integrasi autentikasi JWT full-stack.

### Added

**Minggu 1 — Setup & Hello World**

- Inisialisasi repository GitHub Classroom `cloud-team-ignite`
  > **Penjelasan:** Membuat repository Git di GitHub untuk version control (track semua perubahan code).
  
- Struktur folder proyek: `backend/`, `frontend/`, `docs/`
  > **Penjelasan:** Pisahkan folder: backend (server Python), frontend (website React), docs (dokumentasi). Organisasi rapi → mudah navigasi.
  
- Hello World FastAPI — endpoint `GET /` mengembalikan identitas aplikasi
  > **Penjelasan:** Test pertama: buat endpoint paling sederhana untuk cek apakah FastAPI server berjalan.
  
- Endpoint `GET /health` — health check status server dan versi
  > **Penjelasan:** Health check = endpoint untuk monitor apakah server masih hidup/sehat. Biasanya di-call oleh load balancer atau monitoring tools.
  
- Endpoint `GET /team` — informasi anggota Tim Ignite
  > **Penjelasan:** Endpoint info tim (nama, NIM, role, email). Untuk dokumentasi & testing.
  
- File `.gitignore` untuk Python, Node.js, dan file environment
  > **Penjelasan:** .gitignore = file yang define "apa yang JANGAN di-track git". Misal: __pycache__ (Python cache), node_modules (npm packages), .env (konfigurasi rahasia). File-file ini tidak perlu masuk repository (terlalu besar atau sensitif).
  
- File `README.md` awal dengan deskripsi proyek ATHSNAC
  > **Penjelasan:** README = dokumentasi awal project (deskripsi, setup, features). Orang pertama kali lihat repo → lihat README dulu.
  
- File `.env.example` sebagai template konfigurasi lingkungan
  > **Penjelasan:** .env.example = template .env tanpa secret value. Developer baru copy `.env.example` → `.env` lalu isi value-nya. Jadi tahu apa aja config yang diperlukan.

**Minggu 2 — Backend REST API + Database**

- Koneksi PostgreSQL menggunakan SQLAlchemy ORM
  > **Penjelasan:** ORM = cara berkomunikasi dengan database menggunakan Python class, bukan SQL mentah. Misal: `User.query.filter(User.email=="test@test.com")` alih-alih menulis SQL query.
  
- 8 model database dengan relasi lengkap: `User`, `Product`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `Testimonial`
  > **Penjelasan:** Model = "tabel" di database. Tiap model menyimpan tipe data tertentu (User = nama/email/password, Product = nama/harga/stok, dll)
  
- Migrasi tabel otomatis via `Base.metadata.create_all()` saat pertama kali dijalankan
  > **Penjelasan:** Migrasi = proses membuat tabel di database secara otomatis tanpa perlu manual SQL. Cukup jalankan script → tabel terbentuk.
  
- Skema validasi Pydantic untuk semua model: Create, Update, dan Response schema
  > **Penjelasan:** Pydantic = "sistem keamanan" untuk memvalidasi data masuk. Contoh: email harus format valid, password minimal 8 karakter, harga harus angka positif. Jika data tidak valid → tolak dengan error.
- **Modul Products** — CRUD produk + filter kategori + pencarian:
  > **Penjelasan:** CRUD = Create, Read, Update, Delete (4 operasi dasar). Modul = kumpulan fitur sejenis. Di sini, admin bisa kelola produk (tambah, lihat, ubah, hapus).
  
  - `GET /products` — daftar produk dengan filter `category`, `search`, `min_price`, `max_price`
    > **Contoh:** `GET /products?category=snack&search=amplang&min_price=5000` = cari produk kategori snack, nama ada "amplang", harga mulai dari 5rb
  - `POST /products` — tambah produk baru (Admin Only)
  - `GET /products/{id}` — detail produk
  - `PUT /products/{id}` — update data dan stok produk (Admin Only)
  - `DELETE /products/{id}` — hapus produk (Admin Only)
  - `GET /products/stats` — statistik inventori: total produk, total stok, total nilai, breakdown per kategori (Admin Only)
    > **Penjelasan:** Stats = statistik untuk dashboard admin (berapa total barang terjual, nilai stok, dll)
    
- **Modul Cart** — keranjang belanja persisten per user:
  > **Penjelasan:** Persisten = data tetap tersimpan di database (tidak hilang saat logout). Setiap user punya keranjang sendiri.
  
  - `GET /cart` — lihat isi keranjang aktif
  - `POST /cart/items` — tambah produk ke keranjang, simpan `price_at_time` dan `subtotal`
    > **Penjelasan:** Snapshot = "potret" harga saat produk dimasukkan. Jadi jika admin kemudian ubah harga, di keranjang tetap harga lama.
  - `PUT /cart/items/{id}` — update kuantitas item
  - `DELETE /cart/items/{id}` — hapus item dari keranjang
  
- **Modul Orders** — manajemen pesanan dengan kode order unik:
  - `POST /orders` — buat pesanan dari keranjang aktif, generate `order_code` unik
    > **Penjelasan:** Ketika customer checkout, sistem otomatis buat pesanan + nomor unik (misal: ORD20260503001)
  - `GET /orders` — riwayat pesanan milik customer yang sedang login
  - `GET /orders/admin/all` — lihat semua pesanan dari semua customer (Admin Only)
  - `PUT /orders/{id}` — update status pesanan: `pending` → `processing` → `shipped` → `delivered` / `cancelled` (Admin Only)
    > **Penjelasan:** Alur status = pending (baru order) → processing (siap kirim) → shipped (sudah dikirim) → delivered (tiba)
    
- **Modul Payments** — pembayaran multi-metode dengan verifikasi admin:
  > **Penjelasan:** Multi-metode = banyak cara bayar (transfer bank, e-wallet, dll). Admin verifikasi apakah bukti transfer valid.
  
  - `POST /payments` — submit bukti pembayaran (URL/screenshot)
  - `GET /payments` — daftar pembayaran (customer hanya lihat miliknya, admin lihat semua)
  - `PUT /payments/{id}` — verifikasi dan ubah status pembayaran (Admin Only)
    > **Penjelasan:** Status pembayaran: pending (menunggu verifikasi) → verified (lolos) / rejected (ditolak)
    
- **Modul Testimonials** — rating dan ulasan produk terverifikasi:
  > **Penjelasan:** Terverifikasi = sistem cek apakah user benar-benar membeli produk itu (cegah ulasan palsu/spam).
  
  - `POST /testimonials` — buat ulasan (terhubung ke order nyata untuk cegah ulasan palsu)
  - `GET /testimonials` — daftar testimoni publik (filter `is_visible=true`)
  - `PUT /testimonials/{id}` — update ulasan milik sendiri
  - `PUT /testimonials/{id}/toggle-visibility` — sembunyikan/tampilkan ulasan (Admin Only)
    > **Penjelasan:** Toggle visibility = sembunyikan ulasan jelek/spam, tampilkan ulasan bagus untuk promosi.
    
- Auto-delete cascade — menghapus user otomatis menghapus semua data terkait (cart, order, testimoni, pembayaran)
  > **Penjelasan:** Cascade = efek berantai. Misal user dihapus → cart dia ikut dihapus, order ikut dihapus, dll. Jadi tidak ada data "tersesat" di database.
  
- Snapshot harga — `price_at_time` dan `subtotal` tersimpan saat produk masuk keranjang/order, tidak ikut berubah meski harga produk diubah kemudian
  > **Penjelasan:** Aman dari scam = customer masukkan produk 50rb ke keranjang, harga dihapus ke 100rb, saat checkout masih 50rb (bukan 100rb).
- `docs/api-test-results.md` — dokumentasi hasil pengujian seluruh endpoint via Swagger UI
  > **Penjelasan:** Test documentation: tangkap screenshot setiap endpoint (request/response). Bukti bahwa semua endpoint tested & working.

**Minggu 3 — Frontend React Multi-Halaman**

- Setup React 18 + Vite + React Router DOM, berjalan di port 5173
  > **Penjelasan:** React = framework untuk bikin UI interaktif. Vite = tool bundling super cepat. Router DOM = navigasi antar halaman (Home → Shop → Cart, dll)
  
- `src/services/api.js` — service layer terpusat: semua fungsi fetch, token management, error handling
  > **Penjelasan:** Service layer = "pusat komunikasi" dengan backend. Semua HTTP request di sini (bukan tersebar di banyak file), jadi mudah maintenance.
  
- **Komponen reusable:** `Header.jsx`, `CustomerNav.jsx`, `ItemCard.jsx`, `ItemForm.jsx`, `ItemList.jsx`, `SearchBar.jsx`
  > **Penjelasan:** Reusable = komponen yang dipake di banyak halaman. Misal ItemCard dipakai di ShopPage, CartPage, OrderPage, dll. Hemat kode + konsisten UI.
  
- **Halaman Customer (9 halaman):**
  - `LoginChoicePage.jsx` — pilih jenis akun sebelum login
    > **Penjelasan:** Halaman ini tanya: "Mau login sebagai Customer atau Admin?" untuk routing ke halaman login yang benar.
  - `CustomerHome.jsx` — beranda dengan hero section dan featured products
  - `ShopPage.jsx` — katalog produk dengan filter kategori dan pencarian
  - `ProductDetailPage.jsx` — detail produk, rating, testimoni, tombol add to cart
  - `CartPage.jsx` — keranjang belanja dengan update quantity dan kalkulasi subtotal
  - `CheckoutPage.jsx` — form data pengiriman sebelum checkout
    > **Penjelasan:** Checkout = tahap sebelum finalisir pembelian. User isi alamat kirim, pilih metode pembayaran, dll.
  - `OrdersPage.jsx` — riwayat pesanan dengan tracking status
  - `TestimoniPage.jsx` — halaman daftar testimoni publik
  - `ProfilePage.jsx` — profil customer dan riwayat transaksi
  - `AboutPage.jsx` — informasi tentang ATHSNAC
  
- **Halaman Admin (6 halaman):**
  - `AdminDashboard.jsx` — dashboard KPI: statistik penjualan, produk, pesanan
    > **Penjelasan:** KPI = Key Performance Indicator. Dashboard = ringkasan penting untuk manajer (total order hari ini, revenue, top produk, dll)
  - `AdminProducts.jsx` — manajemen produk CRUD + update stok
  - `AdminOrders.jsx` — manajemen pesanan dan update status pengiriman
  - `AdminPayments.jsx` — verifikasi bukti pembayaran customer
  - `AdminCustomers.jsx` — data pelanggan dan history transaksi
  - `AdminTestimonials.jsx` — moderasi ulasan: approve/hide/show
  
- `ProtectedRoute.jsx` — route guard berbasis autentikasi dan role
  > **Penjelasan:** Route guard = "penjaga pintu". Sebelum buka halaman admin, cek: apakah user login? apakah role=admin? Jika tidak, redirect ke login. Aman dari akses tidak sah.
  
- Toast notification via `react-toastify` untuk semua aksi CRUD, login, logout
  > **Penjelasan:** Toast = notifikasi pop-up kecil (di sudut layar). Misal: "Produk berhasil ditambahkan ✓" atau "Error: Email sudah terdaftar ✗"
  
- Modal konfirmasi sebelum delete dan checkout
  > **Penjelasan:** Modal = pop-up window tanya konfirmasi. Misal: "Yakin hapus produk?" → OK/Batal. Cegah user hapus data aksidental.
  
- Loading state (skeleton/spinner) dan empty state pada semua halaman
  > **Penjelasan:** Loading state = tampil loading spinner saat data sedang dimuat. Empty state = tampil "Belum ada pesanan" jika data kosong (user experience lebih baik).
  
- Format harga otomatis dalam Rupiah (IDR)
  > **Penjelasan:** Harga 50000 otomatis tampil "Rp 50.000" (format currency) untuk mudah dibaca user.
- `docs/ui-test-results.md` — dokumentasi 10 hasil pengujian UI di browser

**Minggu 4 — Autentikasi JWT + CORS + ENV**

- Enkripsi password menggunakan `passlib` dengan algoritma bcrypt
  > **Penjelasan:** Password TIDAK boleh disimpan plain-text di database (sangat bahaya!). Bcrypt = algoritma enkripsi satu arah. Password "secret123" di-hash jadi "$2b$12$..." yang mustahil di-reverse. Saat login, sistem hash password masuk → bandingkan dengan hash di DB.
  
- Pembuatan dan verifikasi JWT token menggunakan `python-jose`
  > **Penjelasan:** JWT = "kartu identitas digital". Saat login berhasil, server kasih JWT token. Token ini dikirim di setiap request untuk membuktikan "saya sudah login". Format: Header.Payload.Signature (3 bagian terpisah dengan titik).
  
- Token berlaku selama 60 menit
  > **Penjelasan:** Setelah 60 menit, token kadaluarsa. User harus login ulang untuk dapat token baru (keamanan).
  
- Endpoint autentikasi:
  - `POST /auth/register` — daftarkan akun baru dengan validasi email (`EmailStr`) dan password (minimal 8 karakter, harus mengandung angka)
    > **Penjelasan:** EmailStr = sistem cek format email valid (harus ada @). Password harus kuat: minimal 8 char + ada angka (misal: "pass1234" ✓, "password" ✗)
  - `POST /auth/login` — login, kembalikan access token dan data user
  - `GET /auth/me` — ambil profil user yang sedang login
    > **Penjelasan:** Endpoint ini butuh token. Kalau token valid → tampil data user. Kalau token invalid/kadaluarsa → error 401.
    
- **Role-Based Access Control (RBAC)** — endpoint Admin Only ditandai dan dilindungi secara eksplisit
  > **Penjelasan:** RBAC = kontrol akses berdasarkan role. Endpoint `DELETE /products/{id}` ada decorator `@require_role("admin")` = hanya admin boleh akses. Customer akses → error 403 (forbidden).
  
- Semua endpoint selain `GET /products` dan `GET /testimonials` dilindungi JWT
  > **Penjelasan:** Hanya 2 endpoint publik (tidak perlu login). Yang lain harus attach token di header: `Authorization: Bearer <token>`. Kalau tidak ada token → error 401 (unauthorized).
  
- Konfigurasi CORS diperketat menggunakan whitelist origin dari environment variable `CORS_ORIGINS`
  > **Penjelasan:** CORS = permission untuk frontend akses backend dari domain berbeda. JANGAN pakai wildcard "*" (membuka untuk semua = bahaya!). Pakai whitelist eksplisit: hanya "localhost:5173" atau "example.com" saja yang boleh akses.
  
- Semua konfigurasi sensitif (database URL, secret key) dipindahkan ke `.env`
  > **Penjelasan:** .env = file config yang tidak masuk repository (ditambah .gitignore). Secret key, password DB, API keys, dll simpan di sini, bukan di code. Jadi jika ada yang lihat repo, tidak bisa dapat password.
  
- `LoginPage.jsx` dan `RegisterPage.jsx` — form login/registrasi dengan validasi sisi frontend
  > **Penjelasan:** Frontend validasi = cek lokal di browser sebelum kirim ke server (UX lebih cepat). Backend validasi juga = aman dari bypass (security). Keduanya penting.
  
- Halaman `LoginChoicePage.jsx` — pilih antara Customer dan Admin sebelum login
- Logout otomatis saat server mengembalikan `401 Unauthorized`
  > **Penjelasan:** Jika token kadaluarsa atau invalid, server return 401. Frontend auto-logout + redirect ke login page (seamless user experience).
- `docs/auth-test-results.md` — dokumentasi 19 hasil pengujian alur autentikasi

### Security

- Password disimpan sebagai hash bcrypt, tidak pernah plain-text
  > **Penjelasan:** Jika database di-hack, hacker dapat hash random (tidak berguna). Tidak bisa reverse ke password asli (one-way encryption). Aman!
  
- JWT token tidak tersimpan di server — stateless authentication
  > **Penjelasan:** Token hanya ada di client (browser). Server tidak perlu simpan token di database. Lebih scalable & faster (no database lookup setiap request).
  
- `.env` ditambahkan ke `.gitignore` — konfigurasi rahasia tidak pernah masuk repository
  > **Penjelasan:** Secret key, password DB, API key, dll di .env. Jika lupa & push ke GitHub, hacker dapat semua secret. Jadi .env selalu ditambah .gitignore (tidak pernah tertrack di git).
  
- CORS dikonfigurasi dengan whitelist origin eksplisit, bukan wildcard `*`
  > **Penjelasan:** Wildcard CORS = buka untuk semua domain = sangat bahaya (cross-site attack). Whitelist eksplisit = hanya domain terpercaya boleh akses.
  
- Role-based access control (RBAC) memisahkan hak akses Customer dan Admin
  > **Penjelasan:** Customer tidak boleh akses endpoint `DELETE /products`, `PUT /orders/{id}` (admin only). Setiap endpoint di-protect dengan @require_role decorator.
  
- Verifikasi pembelian pada testimoni mencegah ulasan palsu
  > **Penjelasan:** Sebelum buat testimoni, cek: apakah user pernah order & terima produk itu? Jika tidak → tolak. Anti spam & fake review.

---

## [0.4.0] — Minggu 4 — Auth & Security — 2026-03-22

### Added

- Sistem autentikasi JWT lengkap: register, login, token verification
  > **Penjelasan:** Implementasi autentikasi dengan JWT. Register = daftar user baru, Login = dapat token, Verification = token check.
  
- Role-Based Access Control (RBAC): Customer dan Admin
  > **Penjelasan:** 2 role: customer (akses user features) & admin (akses management features). Berbeda halaman, berbeda endpoint.
  
- Halaman login dan registrasi di frontend dengan validasi
  > **Penjelasan:** UI forms: login form & register form dengan client-side validation (email format, password strength).
  
- Token management di `services/api.js`
  > **Penjelasan:** Centralized token handling: simpan token di localStorage, attach ke setiap request header, handle expiration.
  
- `ProtectedRoute.jsx` untuk route yang memerlukan autentikasi
  > **Penjelasan:** Wrapper untuk route: cek token sebelum render halaman. Jika no token → redirect ke login.
  
- `docs/auth-test-results.md` — 19 test case autentikasi
  > **Penjelasan:** Dokumentasi testing: 19 scenario tested (register fail, register success, login invalid, login success, token expired, dll). Semua PASS.

### Security

- Password hashing dengan bcrypt
  > **Penjelasan:** Password di-encrypt dengan bcrypt sebelum disimpan. Aman dari hacker.
  
- JWT token berlaku 60 menit
  > **Penjelasan:** Token expires after 60 min → user logout otomatis, harus login ulang.
  
- Semua konfigurasi sensitif dipindahkan ke `.env`
  > **Penjelasan:** SECRET_KEY, DATABASE_URL, CORS_ORIGINS, dll di .env (tidak di code).

---

## [0.3.0] — Minggu 3 — Frontend React — 2026-03-10

### Added

- Setup React 18 + Vite + React Router DOM
  > **Penjelasan:** React 18 (latest), Vite (fast bundler), Router (SPA navigation).
  
- 9 halaman Customer dan 6 halaman Admin
  > **Penjelasan:** 15 halaman total: 9 untuk customer (shop, cart, order, profile), 6 untuk admin (dashboard, CRUD products/orders/payments/customers/testimonials).
  
- Service layer terpusat di `services/api.js`
  > **Penjelasan:** Semua HTTP calls di satu file → mudah maintenance, consistent error handling.
  
- Komponen reusable: Header, ItemCard, ItemForm, ItemList, SearchBar
  > **Penjelasan:** 5 reusable components dipake di banyak halaman → DRY principle, konsisten UI.
  
- Toast notification dan modal konfirmasi
  > **Penjelasan:** UX improvements: success/error toast pop-up, confirm dialog sebelum delete.
  
- `docs/ui-test-results.md` — 10 test case UI
  > **Penjelasan:** Manual testing 10 scenario (login, add to cart, checkout, admin crud, dll). Screenshot & notes.

---

## [0.2.0] — Minggu 2 — Backend REST API — 2026-03-03

### Added

- Koneksi PostgreSQL dengan SQLAlchemy ORM
  > **Penjelasan:** SQLAlchemy ORM setup dengan PostgreSQL. Python ↔ Database communication.
  
- 8 model database: User, Product, Cart, CartItem, Order, OrderItem, Payment, Testimonial
  > **Penjelasan:** 8 database tables dengan proper relationships (FK, 1-to-many, many-to-many).
  
- 27 endpoint REST API mencakup semua modul bisnis
  > **Penjelasan:** 27 endpoints: auth (3), products (6), cart (4), orders (4), payments (3), testimonials (4), admin stats, dll.
  
- Dokumentasi otomatis via Swagger UI (`/docs`)
  > **Penjelasan:** FastAPI auto-generate API docs di /docs. Developers bisa test endpoint langsung di Swagger UI tanpa Postman.
  
- `docs/api-test-results.md` — hasil pengujian endpoint
  > **Penjelasan:** Test results documentation dengan request/response examples.

---

## [0.1.0] — Minggu 1 — Setup Awal — 2026-02-24

### Added

- Inisialisasi repository GitHub Classroom `cloud-team-ignite`
  > **Penjelasan:** Repository dibuat & linked ke GitHub Classroom untuk tracking assignment.
  
- Struktur folder proyek: `backend/`, `frontend/`, `docs/`
  > **Penjelasan:** Project structure: 3 main folders + separation of concerns.
  
- Hello World FastAPI — endpoint `GET /`
  > **Penjelasan:** First endpoint: simple GET / untuk test FastAPI running.
  
- Endpoint `GET /health` dan `GET /team`
  > **Penjelasan:** 2 endpoints: health check + team info.
  
- File `.gitignore`, `README.md`, `.env.example`
  > **Penjelasan:** Basic project files: ignore config, readme docs, env template.
  
- Konfigurasi CORS awal
  > **Penjelasan:** CORS setup awal: allow requests dari frontend (localhost:5173).

---

[unreleased]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/aidilsaputrakirsan-classroom/cloud-team-ignite/releases/tag/v0.1.0
