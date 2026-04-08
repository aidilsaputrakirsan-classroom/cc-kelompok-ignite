# Frontend Login & Registrasi - Panduan Implementasi

## 📋 Daftar Isi
1. [Fitur Utama](#fitur-utama)
2. [Struktur Routing](#struktur-routing)
3. [Alur Autentikasi](#alur-autentikasi)
4. [Komponen Utama](#komponen-utama)
5. [Cara Menggunakan](#cara-menggunakan)
6. [Testing](#testing)

## ✨ Fitur Utama

### 1. Login & Registrasi Terintegrasi
- Form login dan registrasi dalam satu halaman
- Toggle antara tab Login dan Registrasi
- Validasi email dan password real-time
- Support untuk 2 role: Admin dan Customer

### 2. Role-Based Routing
- **Admin**: Otomatis diarahkan ke `/admin` dashboard
- **Customer**: Otomatis diarahkan ke `/home` halaman belanja
- **Publik**: Halaman LoginPage (`/login`)

### 3. Session Persistence
- Token JWT disimpan di `localStorage`
- Automatic session recovery saat refresh halaman
- Automatic logout jika token expired (401 error)

## 🛣️ Struktur Routing

```
/                          → Root (redirect berdasarkan role/login status)
/login                     → Login & Registrasi Page (Public)
/admin                     → Admin Dashboard (Protected - Admin only)
/home                      → Customer Home (Protected - Customer only)
*                          → 404 Not Found (redirect ke root)
```

## 🔐 Alur Autentikasi

### Registrasi
```
User Input Data → Validasi → API Register → API Login → Set Token → Redirect
```

### Login
```
User Input Email/Password → Validasi → API Login → Set Token → Redirect
```

### Session Check (On App Load)
```
Check Token di localStorage → getMe() API → Set User State → Render Dashboard
```

## 🧩 Komponen Utama

### 1. **App.jsx** - Router Utama
```javascript
// BrowserRouter wrapper
// 5 Routes: /, /login, /admin, /home, *
// Token validation & user state management
```

**Key Functions:**
- `useEffect`: Check auth on mount
- `handleLogin`: Process login request
- `handleRegister`: Process registration
- `handleLogout`: Clear token & user

### 2. **LoginPage.jsx** - Form Login/Registrasi
```javascript
// Tab-based interface
// Input fields:
//   - Login: email, password
//   - Register: name, email, password, phone?, address?, role
```

**Validasi:**
- Email format validation
- Password min 8 chars + 1 digit
- Required field checks

### 3. **ProtectedRoute.jsx** - Route Guard
```javascript
// Check: user authenticated?
// Check: user.role matches requiredRole?
// Redirect if not authorized
```

### 4. **AdminDashboard.jsx** - Admin Portal
```javascript
// Sidebar navigation
// Tabs:
//   - 📦 Kelola Produk (ItemForm + ItemList)
//   - 📊 Analitik (placeholder)
//   - 📋 Pesanan (placeholder)
//   - 👤 Profil (User info)
```

### 5. **CustomerHome.jsx** - Customer Home
```javascript
// Hero section
// Sidebar:
//   - Profile card
//   - Quick links
//   - Price filter
// Main area:
//   - Search bar
//   - Product grid
```

### 6. **ItemForm.jsx** - Product Form (Admin only)
```javascript
// Fields:
//   - name, description, category, slug
//   - price, stock, image_url
//   - is_active checkbox
// POST /products endpoint
```

### 7. **ItemList.jsx** - Product Display
```javascript
// Fetch from /products API
// Filter: by search, price range
// Admin view: show edit/delete buttons
// Customer view: show "Add to Cart" button
// Only show active products to customers
```

### 8. **api.js** - API Service
```javascript
// Auth endpoints:
//   POST /auth/register
//   POST /auth/login
//   GET /auth/me

// Product endpoints:
//   GET /products (with search, min_price, max_price params)
//   POST /products
//   PUT /products/{id}
//   DELETE /products/{id}

// Token management:
//   setToken, getToken, clearToken
//   authHeaders (auto-adds Authorization header)
```

## 🚀 Cara Menggunakan

### 1. Memulai Development Server
```bash
cd frontend
npm install  # Jika belum pernah
npm run dev
```

Buka http://localhost:5173

### 2. Testing Login Admin
```
Email: admin@example.com
Password: admin123  (atau sesuai DB)
```
Akan diarahkan ke `/admin`

### 3. Testing Login Customer
```
Email: customer@example.com
Password: customer123  (atau sesuai DB)
```
Akan diarahkan ke `/home`

### 4. Testing Registrasi
1. Klik tab "📝 Register" di LoginPage
2. Isi semua field (email, password, name, dll)
3. Pilih role: "👤 Pelanggan" atau "🔐 Admin"
4. Klik "Buat Akun"
5. Form login akan ditampilkan dengan email otomatis terisi
6. Login otomatis
7. Diarahkan ke dashboard sesuai role

## ✅ Testing

### Frontend Build
```bash
npm run build  # Kompilasi production
npm run preview  # Preview production build
```

### Checklist Testing
- [ ] Registrasi dengan role admin
- [ ] Registrasi dengan role customer
- [ ] Login dengan admin credentials → App redirect ke /admin
- [ ] Login dengan customer credentials → App redirect ke /home
- [ ] Logout → Token dihapus, redirect ke /login
- [ ] Refresh halaman setelah login → User info tetap ada (session persist)
- [ ] AdminDashboard → Semua tab terbuka
- [ ] CustomerHome → Hero section, sidebar, products tampil
- [ ] Try access /admin dengan customer account → Redirect ke /home
- [ ] Try access /home dengan admin account → Redirect ke /admin
- [ ] API endpoints working (check Network tab di DevTools)

## 📝 Field Mapping Backend → Frontend

### User Model
```
Backend                 Frontend
------                  --------
id                      (not used in form)
email                   formData.email
name                    formData.name
password_hash           formData.password (hashed di backend)
phone                   formData.phone
address                 formData.address
role                    formData.role
is_active               (managed by backend)
created_at/updated_at   (displayed in profile)
```

### Product Model
```
Backend                 Frontend
------                  --------
id                      item.id
name                    formData.name
description             formData.description
category                formData.category
slug                    formData.slug
price                   formData.price
stock                   formData.stock
image_url               formData.image_url
is_active               formData.is_active
created_at/updated_at   (displayed in product card)
```

## 🔧 Environment Variables

File: `frontend/.env` atau `.env.local`
```
VITE_API_URL=http://localhost:8000
```

Jika tidak diset, default ke `http://localhost:8000`

## 🐛 Troubleshooting

### "Cannot POST /products" Error
- ✅ Backend harus running di port 8000
- ✅ CORS middleware harus diset di backend
- ✅ Token harus ada di Authorization header

### "Token tidak valid" pada getMe()
- ✅ Token expired → User perlu login ulang
- ✅ Backend SECRET_KEY berubah → Token lama invalid
- ✅ Check localStorage untuk melihat token tersimpan

### Role tidak sesuai
- ✅ Check `user.role` case-insensitive di backend
- ✅ LoginPage harus mengirim role saat register

## 📚 Dependencies Baru
```json
{
  "react-router-dom": "^6.x"
}
```

Sudah diinstall via: `npm install react-router-dom`

## 🎨 Design Notes

Warna branding:
- Primary: `#4CAF50` (Hijau)
- Secondary: `#333` (Abu-abu gelap)
- Error: `#C00000` (Merah)
- Info: `#4A90E2` (Biru)

Fonts:
- Family: 'Segoe UI', Arial, sans-serif
- Sizes: 12px (small), 14px (body), 16px (heading), 18-24px (title)

---

**Last Updated:** 8 April 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
