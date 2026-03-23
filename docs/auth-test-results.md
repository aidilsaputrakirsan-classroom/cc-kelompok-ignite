# 🔐 Hasil Pengujian Autentikasi — Modul 4

**Proyek:** Cloud App — Inventory Management  
**Tanggal Pengujian:** 18–22 Maret 2026  
**Penguji:** Desnita Dwi Putri (10231030) — Lead QA & Docs  
**Alat Pengujian:** Swagger UI (`http://localhost:8000/docs`) dan Browser (`http://localhost:5173`)

> 📌 **Swagger UI** adalah halaman dokumentasi API yang dibuat otomatis oleh FastAPI. Halaman ini memungkinkan kita mencoba setiap fitur API langsung dari browser tanpa perlu aplikasi tambahan.

---

## 📊 Ringkasan Hasil Pengujian

| Total Pengujian | Berhasil | Gagal | Tingkat Keberhasilan |
|---|---|---|---|
| 20 | ✅ 20 | ❌ 0 | **100%** |

---

## 📖 Tentang Pengujian

Pada aplikasi Cloud App ditambahkan sistem **autentikasi** (proses memverifikasi identitas pengguna sebelum mengizinkan akses). Sistem ini menggunakan teknologi bernama **JWT**.

> 💡 **Autentikasi** adalah proses membuktikan siapa kamu sebelum diizinkan masuk. Contoh sehari-hari: memasukkan PIN ATM sebelum bisa mengambil uang.

> 💡 **JWT (JSON Web Token)** adalah sebuah kode unik berupa rangkaian huruf dan angka yang diberikan server kepada pengguna setelah berhasil login. Kode ini berfungsi seperti **tanda pengenal sementara** — setiap kali pengguna ingin mengakses data, kode ini disertakan sebagai bukti bahwa pengguna sudah login. Token berlaku selama 60 menit, setelah itu pengguna perlu login kembali.

Sebelumnya, siapa saja bisa mengakses daftar item tanpa perlu login. Setelah ini, semua halaman yang menampilkan atau mengubah data item hanya bisa diakses oleh pengguna yang sudah login dan memiliki token yang valid.

Pengujian ini memverifikasi bahwa:
1. Proses login berjalan dengan benar dan menghasilkan token
2. Halaman yang dilindungi benar-benar tidak bisa diakses tanpa token
3. Pesan error yang muncul sudah sesuai saat ada kesalahan
4. Tampilan di browser berfungsi dengan benar untuk semua anggota tim

---

## 🗂️ Daftar Pengujian

| No | Kategori | Yang Diuji |
|---|---|---|
| 1 | Login API | Login berhasil dan mendapat token |
| 2 | Login API | Memasukkan token ke halaman dokumentasi API |
| 3 | Akses Data | Mengambil daftar item menggunakan token |


---

## 🗄️ Kondisi Awal Sebelum Pengujian

### Akun Pengguna yang Digunakan

Setiap anggota tim sudah mendaftarkan akun masing-masing sebelum pengujian dimulai.

| Nama | Email Login | Hasil |
|---|---|---|
| Andini Permata Dewanti | 10231014@student.itk.ac.id | ✅ Berhasil |
| Putri Rahmawati | 10231074@student.itk.ac.id | ✅ Berhasil |
| Desnita Dwi Putri | 10231030@student.itk.ac.id | ✅ Berhasil |
| Krishandy Dhanysa Pratama | 10231050@student.itk.ac.id | ✅ Berhasil |

## 🧪 Detail Setiap Pengujian

---

### Pengujian 1 — Login Berhasil dan Mendapat Token

**Apa yang diuji:**  
Pengujian ini memastikan bahwa pengguna yang sudah mendaftar dapat masuk ke sistem menggunakan email dan kata sandi yang benar, dan sistem memberikan token sebagai tanda pengenal.

**Cara menguji:**  
Membuka Swagger UI di `http://localhost:8000/docs`, mencari bagian `POST /auth/login`, lalu mengisi email dan kata sandi, kemudian menekan tombol Execute (jalankan).

> 💡 **`POST`** adalah salah satu cara mengirim data ke server. Digunakan ketika kita ingin mengirimkan informasi baru, seperti email dan kata sandi untuk login.

**Data yang dikirim ke server:**
```json
{
  "email": "10231014@student.itk.ac.id",
  "password": "andini1123"
}
```

**Perintah yang dihasilkan otomatis oleh Swagger:**
```bash
curl -X 'POST' \
  'http://localhost:8000/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "10231014@student.itk.ac.id",
    "password": "andini1123"
  }'
```

> 💡 **cURL** adalah perintah yang bisa dijalankan di terminal untuk mengirim request ke server. Swagger UI membuatkan perintah ini secara otomatis agar bisa digunakan di luar Swagger jika diperlukan.

**Kode respons:** `200 OK`

> 💡 **Kode respons** adalah angka yang dikirim server untuk memberitahu apakah permintaan berhasil atau tidak. **200 OK** berarti berhasil.

**Data yang dikembalikan server:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsImV4cCI6MTc0MjMxNjAwMH0.VNmgg60P79N6abvcTLhAmNUIJFN0m3ZFjvj6xBNe0",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "10231014@student.itk.ac.id",
    "name": "Andini",
    "is_active": true,
    "created_at": "2026-03-19T08:30:00+07:00"
  }
}
```

> 💡 **`access_token`** adalah token (tanda pengenal sementara) yang diberikan server. Rangkaian karakter panjang tersebut adalah token JWT yang sudah dienkripsi. Token ini akan digunakan di setiap permintaan berikutnya sebagai bukti bahwa pengguna sudah login.

> 💡 **`token_type: "bearer"`** berarti cara penggunaan token ini adalah dengan menulisnya di header permintaan dengan format: `Authorization: Bearer <token>`. Header adalah bagian informasi tambahan yang dikirim bersama setiap permintaan ke server.

> 💡 **`is_active: true`** berarti akun pengguna dalam kondisi aktif dan dapat digunakan.

**Informasi header yang dikembalikan:**
```
access-control-allow-credentials: true
content-length: 354
content-type: application/json
date: Wed, 19 Mar 2026 16:30:04 GMT
server: uvicorn
```

> 💡 **`access-control-allow-credentials: true`** adalah bukti bahwa pengaturan CORS (izin akses antar aplikasi) sudah berjalan benar, sehingga aplikasi frontend di port 5173 diizinkan berkomunikasi dengan backend di port 8000.

**Hasil yang diharapkan:** Kode 200, token diterima  
**Hasil aktual:** Kode 200, token JWT berhasil diterima beserta data pengguna  
**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 1 — Login Berhasil](images/auth_test_1.jpeg)

---

### Pengujian 2 — Memasukkan Token ke Swagger UI

**Apa yang diuji:**  
Setelah mendapat token dari Pengujian 1, token tersebut perlu dimasukkan ke Swagger UI agar semua pengujian berikutnya bisa dilakukan langsung dari halaman dokumentasi API tanpa perlu login ulang setiap saat.

**Cara menguji:**  
1. Salin nilai `access_token` dari hasil Pengujian 1
2. Klik tombol **Authorize 🔒** di bagian atas halaman Swagger UI
3. Tempel token ke kolom yang tersedia
4. Klik tombol Authorize

**Hasil aktual:**  
Dialog "Available authorizations" menampilkan:
- Nama skema: **HTTPBearer (http, Bearer)**
- Status: **Authorized** (sudah terotorisasi)
- Nilai token: ditampilkan sebagai `••••••` demi keamanan
- Tombol **Logout** dan **Close** tersedia

> 💡 **Authorized** artinya token sudah diterima dan tersimpan oleh Swagger UI. Mulai sekarang, Swagger akan otomatis menyertakan token ini di setiap permintaan yang dikirim ke server.

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 2 — Token Berhasil Dimasukkan ke Swagger](images/auth_test_2.jpeg)

---

### Pengujian 3 — Mengambil Daftar Item Menggunakan Token

**Apa yang diuji:**  
Pengujian ini memastikan bahwa setelah token dimasukkan, halaman data item yang sebelumnya dilindungi kini dapat diakses. Ini membuktikan bahwa sistem perlindungan halaman berjalan dengan benar.

**Cara menguji:**  
Membuka bagian `GET /items` di Swagger UI dan menekan tombol Execute. Karena token sudah dimasukkan pada Pengujian 2, Swagger akan otomatis menyertakan token di permintaan ini.

> 💡 **`GET`** adalah cara meminta data dari server tanpa mengubah apapun. Digunakan ketika kita hanya ingin membaca data, seperti menampilkan daftar item.

**Permintaan yang dikirim:**
```
GET http://localhost:8000/items?skip=0&limit=20
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

> 💡 **`skip=0&limit=20`** adalah pengaturan halaman data. `skip=0` berarti mulai dari data pertama, `limit=20` berarti tampilkan maksimal 20 data sekaligus.

**Kode respons:** `200 OK`

**Data yang dikembalikan server (aktual dari hasil pengujian):**
```json
{
  "total": 3,
  "items": [
    {
      "name": "Charger Laptop",
      "description": "Bagus",
      "price": 250000,
      "quantity": 3,
      "id": 1,
      "created_at": "2026-03-13T42:10.606441+07:00",
      "updated_at": null
    },
    {
      "name": "Mouse",
      "description": "Mouse",
      "price": 100000,
      "quantity": 10,
      "id": 11,
      "created_at": "2026-03-13T48:58.423823+07:00",
      "updated_at": null
    },
    {
      "name": "Keyboard",
      "description": "Keyboard keren",
      "price": 2000000,
      "quantity": 3,
      "id": 12,
      "created_at": "2026-03-13T48:18.608148+07:00",
      "updated_at": null
    }
  ]
}
```

> 💡 **`total: 3`** menunjukkan jumlah keseluruhan item di database. **`items`** adalah daftar item yang dikembalikan. **`updated_at: null`** berarti item belum pernah diubah sejak pertama kali ditambahkan.

**Informasi header yang dikembalikan:**
```
content-length: 649
content-type: application/json
date: Wed, 18 Mar 2026 16:50:36 GMT
server: uvicorn
```

**Hasil yang diharapkan:** Kode 200, daftar item berhasil ditampilkan  
**Hasil aktual:** Kode 200, 3 item berhasil ditampilkan beserta semua detail  
**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 3 — Daftar Item Berhasil Ditampilkan](images/auth_test_3.jpeg)

---

