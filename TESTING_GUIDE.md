# 🧪 TESTING GUIDE - Login & Registrasi Feature

## 📋 Table of Contents
1. [Setup](#setup-awal)
2. [Test Scenarios](#skenario-testing)
3. [Expected Results](#hasil-yang-diharapkan)
4. [Troubleshooting](#troubleshooting)

---

## ⚙️ Setup Awal

### 1. Install Dependencies (if needed)
```bash
cd c:\users\user\cc-kelompok-ignite\frontend
npm install react-router-dom
```

### 2. Jalankan Backend
```bash
cd c:\users\user\cc-kelompok-ignite\backend
# Pastikan requirements.txt sudah diinstall
pip install -r requirements.txt

# Jalankan server
python -m uvicorn main:app --reload
# Output: INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 3. Jalankan Frontend
```bash
cd c:\users\user\cc-kelompok-ignite\frontend
npm run dev
# Output: VITE v7.3.1  ready in XXX ms
#         ➜  Local:   http://localhost:5173/
```

### 4. Buka Browser
```
http://localhost:5173
```

Anda akan langsung diarahkan ke `/login` karena belum ada token.

---

## 🧪 Skenario Testing

### TEST 1: Register Admin User ✅

**Step 1: Klik Tab Register**
- Lihat halaman LoginPage dengan 2 tab: "🔐 Login" dan "📝 Register"
- Klik tab "📝 Register" (akan highlight warna hijau)

**Step 2: Isi Form Registrasi sebagai Admin**
```
Nama Lengkap:     John Doe
Nomor Telepon:    08123456789
Alamat:           Jl. Merdeka No. 123, Balikpapan
Daftar Sebagai:   🔐 Admin  ← SELECT THIS
Email:            admin@test.com
Password:         Admin12345
```

**Step 3: Submit Form**
- Klik tombol "📝 Buat Akun"
- Tunggu loading animation

**Expected Result:**
```
✅ Toast: "✅ Akun berhasil dibuat! Silakan login."
✅ Form register hilang → tab login menampil
✅ Email field sudah terisi: admin@test.com
✅ Password field kosong (untuk security)
✅ Automatic login happens behind the scenes

STEP 4: Auto-Login
✅ Toast: "✅ Anda berhasil masuk!"
✅ Redirect ke: http://localhost:5173/admin
✅ Lihat AdminDashboard dengan sidebar menu
```

---

### TEST 2: Register Customer User ✅

**Step 1: Logout dari Admin**
- Di AdminDashboard, lihat sidebar kanan atas ada tombol logout
- Klik "🚪 Logout"
- Akan redirect ke `/login`

**Step 2: Register sebagai Customer**
```
Nama Lengkap:     Jane Smith
Nomor Telepon:    08987654321
Alamat:           Jl. Ahmad Yani No. 456, Balikpapan
Daftar Sebagai:   👤 Pelanggan  ← SELECT THIS
Email:            customer@test.com
Password:         Customer12345
```

**Step 3: Submit**
- Tunggu loading

**Expected Result:**
```
✅ Registrasi success
✅ Auto-login
✅ Redirect ke: http://localhost:5173/home
✅ Lihat CustomerHome dengan hero section & products
```

---

### TEST 3: Login Existing User ✅

**Step 1: Buka Login Page**
- Refresh halaman atau buka `http://localhost:5173/login`

**Step 2: Login dengan Admin**
```
Email:      admin@test.com
Password:   Admin12345
```

**Step 3: Klik Tombol "🔐 Login"**

**Expected Result:**
```
✅ Toast: "✅ Anda berhasil masuk!"
✅ Redirect ke: /admin
✅ User name ditampilkan (misal: "John Doe")
✅ Dashboard kelola produk tampil
```

**Step 4: Logout**
- Klik tombol logout di sidebar kanan

**Expected Result:**
```
✅ Token dihapus dari localStorage
✅ Redirect ke: /login
✅ Token field di Storage tab browserdevtools kosong
```

---

### TEST 4: Test Product Management (Admin) ✅

**Prerequisites:** Login sebagai Admin

**Step 1: Cek Tab Products yang Active**
- Di sidebar kiri, tombol "📦 Kelola Produk" highlighted hijau
- Main area menampilkan 2 section:
  - Left: "Tambah Produk Baru" form
  - Right: "Daftar Produk" list

**Step 2: Tambah Produk Baru**
```
Nama Produk:      Amplang Balikpapan
Harga:            25000
Kategori:         Makanan
Stok:             100
Deskripsi:        Amplang gurih dan renyah
Slug:             amplang-balikpapan
URL Gambar:       https://via.placeholder.com/150
Aktif:            ☑️ (checked)
```

**Step 3: Submit Form**
- Klik "✅ Tambah Produk"

**Expected Result:**
```
✅ Toast: "✅ Produk berhasil ditambahkan!"
✅ Form reset (kosong)
✅ Product list di sebelah kanan update & tampil produk baru
✅ Card menampilkan: nama, harga, stok, kategori
✅ Tombol: ✏️ Edit dan 🗑️ Hapus tersedia
```

**Step 4: Test Product Display**
- Di product card, cek formatting:
  - Harga: "Rp25.000" (format Indonesian currency)
  - Stok: "📦 Stok: 100"
  - Kategori: "🏷️ Makanan"

---

### TEST 5: Test Header/Profile (Admin) ✅

**Step 1: Di AdminDashboard, Klik Tab "👤 Profil"**

**Expected Result:**
```
✅ Display user info:
   - Nama: John Doe
   - Email: admin@test.com
   - Role: 🔐 ADMIN (badge hijau)
   - Telepon: 08123456789
   - Alamat: Jl. Merdeka No. 123, Balikpapan
   - Terdaftar Sejak: (tanggal format Indonesia)
```

**Step 2: Verifikasi Tanggal Formatting**
- Harus format: "8 April 2026" atau similar (toLocaleDateString("id-ID"))

---

### TEST 6: Test Customer Homepage ✅

**Prerequisites:** Login sebagai Customer

**Expected View:**
```
┌─────────────────────────────────────────┐
│  🍲 ATHSNACK Header                     │
├─────────────────────────────────────────┤
│ ╔═══════════════════════════════════════╗  ← Hero section
│ ║ 🍲 Selamat Datang di ATHSNACK        ║
│ ║ Makanan Khas Balikpapan              ║
│ ╚═══════════════════════════════════════╝
├──────────────┬──────────────────────────┤
│  Sidebar     │   Main Products Area     │
│              │                          │
│ 👤 Profil    │   Search Bar             │
│ ⚡ Menu Cepat │   [Product Grid Cards]  │
│ 🔍 Filter    │                          │
└──────────────┴──────────────────────────┘
```

**Sidebar Features:**
- 👤 User profile card dengan nama, email
- ⚡ Quick links: Keranjang, Pesanan, Favorit, Testimonial
- 🔍 Price filter: Input min/max price

**Product Display:**
- Hanya menampilkan products dengan `is_active: true`
- Tombol: "🛒 Tambah ke Keranjang" (tidak ada edit/delete)
- Format harga, stok, kategori sama seperti admin

---

### TEST 7: Test Search & Filter (Customer) ✅

**Step 1: Search by Name**
- Di search bar, ketik nama produk: "Amplang"
- Items list akan filter otomatis

**Expected Result:**
```
✅ Product grid update menampilkan hanya "Amplang Balikpapan"
```

**Step 2: Filter by Price**
- Di Filter Harga section, isi:
  ```
  Harga min: 20000
  Harga max: 30000
  ```
- Klik "Terapkan"

**Expected Result:**
```
✅ Product list update dengan price range 20000-30000
```

**Step 3: Combine Search + Filter**
- Search: "Amplang"
- Min: 20000, Max: 30000
- Click Terapkan

**Expected Result:**
```
✅ Filter kombinasi bekerja (search AND price)
```

---

### TEST 8: Test Role-Based Redirection ✅

**Scenario A: Admin Try to Access /home**
```
1. Login as admin → At /admin
2. Manually type in URL: http://localhost:5173/home
3. Press Enter
```

**Expected Result:**
```
✅ Auto-redirect back ke: /admin
✅ No error, seamless transition
```

**Scenario B: Customer Try to Access /admin**
```
1. Login as customer → At /home
2. Manually type: http://localhost:5173/admin
3. Press Enter
```

**Expected Result:**
```
✅ Auto-redirect back ke: /home
```

**Scenario C: Access /login When Already Logged In**
```
1. Login as admin
2. Type: http://localhost:5173/login
3. Press Enter
```

**Expected Result:**
```
✅ Auto-redirect ke: /admin (sesuai role)
```

---

### TEST 9: Session Persistence ✅

**Step 1: Login to Admin**
```
1. Open http://localhost:5173/login
2. Login with admin credentials
3. Arrive at /admin
```

**Step 2: Refresh Page**
```
Press F5 atau Ctrl+R
```

**Expected Result:**
```
✅ No redirect to login
✅ Still at /admin
✅ User info (name) still displayed
✅ Token masih ada di localStorage
```

**Step 3: Check Token in DevTools**
```
1. Buka DevTools (F12)
2. Buka tab: Application → Local Storage
3. Cari: localhost:5173 → token key
```

**Expected Result:**
```
✅ Token ada dan berisi JWT string panjang
✅ Format: eyJhbGciOiJIUzI1NiIs...
```

**Step 4: Refresh Multi Times**
```
Press F5 beberapa kali
```

**Expected Result:**
```
✅ Tetap login, tetap di /admin
```

---

### TEST 10: Invalid Login Attempt ✅

**Scenario A: Wrong Email Format**
```
Email: invalidemailcom  (no @)
Password: Test12345
```

**Expected Result:**
```
❌ Error message: "Format email tidak valid"
❌ Login button batal
```

**Scenario B: Wrong Password Length**
```
Email: customer@test.com
Password: test  (< 8 chars)
```

**Expected Result:**
```
❌ Error message: "Password minimal 8 karakter dan harus mengandung angka"
```

**Scenario C: Non-Existent User**
```
Email: nonexistent@test.com
Password: Test12345
```

**Expected Result:**
```
❌ API returns 401
❌ Error message: "Login gagal: email atau password salah"
❌ Form tidak reset (untuk retry)
```

---

### TEST 11: Invalid Registration ✅

**Scenario A: Missing Required Fields**
```
Hanya isi: Email
Biarkan: Name, Password kosong
Submit
```

**Expected Result:**
```
❌ Error: "Nama wajib diisi"  (sebelum API call)
```

**Scenario B: Password Too Short**
```
Name: Test User
Email: test123@test.com
Password: test  (< 8)
```

**Expected Result:**
```
❌ Error: "Password minimal 8 karakter dan harus mengandung angka"
```

**Scenario C: Duplicate Email**
```
Register user dengan email yang sudah ada
```

**Expected Result:**
```
❌ API returns 400
❌ Error: "Registrasi gagal: email sudah digunakan"
```

---

## ✅ Hasil yang Diharapkan

### Jika Semua Test PASS:

```
┌───────────────────────────────────────┐
│  ✅ SEMUA FITUR WORKING CORRECTLY     │
│                                       │
│  ✅ Login & Register                  │
│  ✅ Role-based routing                │
│  ✅ Admin Dashboard                   │
│  ✅ Customer Home                     │
│  ✅ Product Management                │
│  ✅ Session persistence               │
│  ✅ Error handling                    │
│  ✅ Form validation                   │
│                                       │
│  🎉 READY FOR PRODUCTION!             │
└───────────────────────────────────────┘
```

### Test Summary Sheet:
```
TEST #   | TEST NAME                      | STATUS | NOTES
---------|--------------------------------|--------|--------
1        | Register Admin                 | ✅/❌  |
2        | Register Customer              | ✅/❌  |
3        | Login Existing User            | ✅/❌  |
4        | Product Management (Admin)     | ✅/❌  |
5        | User Profile (Admin)           | ✅/❌  |
6        | Customer Homepage              | ✅/❌  |
7        | Search & Filter                | ✅/❌  |
8        | Role-Based Redirection         | ✅/❌  |
9        | Session Persistence            | ✅/❌  |
10       | Invalid Login                  | ✅/❌  |
11       | Invalid Registration           | ✅/❌  |
```

---

## 🐛 Troubleshooting

### Error: "Cannot reach backend"
```
❌ Symptom: Toast Error "Login gagal: Request failed"
✅ Solution: 
   1. Pastikan backend running: python -m uvicorn main:app --reload
   2. Check CORS headers di backend
   3. Check VITE_API_URL variable
```

### Error: "Token tidak valid atau sudah expired"
```
❌ Symptom: Automatic logout saat access page
✅ Solution:
   1. Login ulang
   2. Cek SECRET_KEY di backend (jangan berubah)
   3. Check token di localStorage (valid format?)
```

### Products not showing in list
```
❌ Symptom: Empty product grid meski ada di DB
✅ Solution:
   1. Check is_active = true di database
   2. Admin: harus melihat semua products (termasuk inactive)
   3. Customer: hanya lihat is_active=true
   4. Check network tab API response
```

### Role redirect not working
```
❌ Symptom: Admin login tapi tetap di /home
✅ Solution:
   1. Check user.role value di backend (admin vs customer)
   2. Check role case: harus lowercase di ProtectedRoute
   3. Clear localStorage dan login fresh
```

### Form validation error
```
❌ Symptom: Cannot submit form meski data valid
✅ Solution:
   1. Check console error messages
   2. Check form field values di browser DevTools
   3. Try clear cache: Ctrl+Shift+Delete
   4. Try incognito browser
```

---

## 📞 Debug Checklist

Jika punya masalah, check ini:

- [ ] Backend running on http://localhost:8000/health → returns "healthy"
- [ ] Frontend running on http://localhost:5173
- [ ] No CORS errors di browser console
- [ ] Token saved di localStorage (Application tab)
- [ ] User object populated di React state
- [ ] Role value correct: "admin" or "customer" (lowercase)
- [ ] Check Network tab untuk API responses
- [ ] Check console untuk JavaScript errors
- [ ] Database punya user dengan role yang benar
- [ ] Products punya is_active=true untuk customer view

---

**Last Updated:** 8 April 2026  
**Test Environment:** Windows 10, Node 20+, Python 3.9+  
**Browser Tested:** Chrome, Firefox, Edge
