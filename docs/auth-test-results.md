# 🔐 Hasil Pengujian Autentikasi — Modul 4

**Proyek:** Cloud App — Inventory Management  
**Modul:** 4 — Integrasi Full-Stack: CORS, ENV Variables & JWT Auth  
**Tanggal Pengujian:** 18–19 Maret 2026  
**Penguji:** Desnita Dwi Putri (10231030) — Lead QA & Docs  
**Alat Pengujian:** Swagger UI (`http://localhost:8000/docs`) dan Browser (`http://localhost:5173`)

> 📌 **Swagger UI** adalah halaman dokumentasi API yang dibuat otomatis oleh FastAPI. Halaman ini memungkinkan kita mencoba setiap fitur API langsung dari browser tanpa perlu aplikasi tambahan.

---

## 📊 Ringkasan Hasil Pengujian

| Total Pengujian | Berhasil | Gagal | Tingkat Keberhasilan |
|---|---|---|---|
| 19 | ✅ 19 | ❌ 0 | **100%** |

---

## 📖 Tentang Pengujian Modul 4

Pada Modul 4, aplikasi Cloud App ditambahkan sistem **autentikasi** (proses memverifikasi identitas pengguna sebelum mengizinkan akses). Sistem ini menggunakan teknologi bernama **JWT**.

> 💡 **Autentikasi** adalah proses membuktikan siapa kamu sebelum diizinkan masuk. Contoh sehari-hari: memasukkan PIN ATM sebelum bisa mengambil uang.

> 💡 **JWT (JSON Web Token)** adalah sebuah kode unik berupa rangkaian huruf dan angka yang diberikan server kepada pengguna setelah berhasil login. Kode ini berfungsi seperti **tanda pengenal sementara** — setiap kali pengguna ingin mengakses data, kode ini disertakan sebagai bukti bahwa pengguna sudah login. Token berlaku selama 60 menit, setelah itu pengguna perlu login kembali.

Sebelum Modul 4, siapa saja bisa mengakses daftar item tanpa perlu login. Setelah Modul 4, semua halaman yang menampilkan atau mengubah data item hanya bisa diakses oleh pengguna yang sudah login dan memiliki token yang valid.

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
| 4 | Tampilan | Halaman login tampil saat belum masuk |
| 5 | Multi Akun | Dashboard Andini setelah login |
| 6 | Multi Akun | Dashboard Putri Rahmawati setelah login |
| 7 | Multi Akun | Form login Desnita Dwi Putri |
| 8 | Multi Akun | Dashboard Desnita setelah login |
| 9 | Multi Akun | Form login Krishandy |
| 10 | Multi Akun | Dashboard Krishandy setelah login |
| 11 | Multi Akun | Form login Andini |
| 12 | Multi Akun | Form login Putri Rahmawati |
| 13 | Error Login | Login dengan email yang salah |
| 14 | Statistik | Melihat statistik item menggunakan token |
| 15 | Tampilan | Nama pengguna tampil di bagian atas halaman |
| 16 | Fitur CRUD | Form edit item berfungsi setelah login |
| 17 | Fitur CRUD | Pencarian item berfungsi setelah login |
| 18 | Fitur CRUD | Dialog konfirmasi hapus item muncul |
| 19 | Fitur CRUD | Tampilan kosong setelah semua item dihapus |

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

### Data Item yang Ada di Database

| Nama Item | Harga | Stok | Keterangan |
|---|---|---|---|
| Charger Laptop | Rp 250.000 | 3 | Bagus |
| Mouse | Rp 100.000 | 10 | Mouse |
| Keyboard | Rp 2.000.000 | 5 | Keyboard keren |
| Laptop | Rp 14.000.000 | 3 | Laptop untuk coding Cloud Computing |

---

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

### Pengujian 4 — Halaman Login Tampil Saat Belum Masuk

**Apa yang diuji:**  
Pengujian ini memastikan bahwa saat pengguna membuka aplikasi tanpa login terlebih dahulu, yang tampil adalah halaman login — bukan langsung ke daftar item. Ini adalah lapisan perlindungan di sisi tampilan (frontend).

**Cara menguji:**  
Membuka `http://localhost:5173` di browser tanpa melakukan login sebelumnya, kemudian mengklik tab Register.

**Hasil aktual yang terlihat di layar:**
- Latar halaman berwarna biru gelap
- Judul: "☁️ Cloud App"
- Subjudul: "Komputasi Awan — SI ITK"
- Dua tab tersedia: **Login** dan **Register**
- Tab **Register sedang aktif** (ditandai warna berbeda)
- Kolom yang tersedia: Nama Lengkap, Email, Password (Minimal 8 karakter)
- Tombol "📝 Register"
- Daftar item **tidak tampil** sama sekali

**Hasil yang diharapkan:** Halaman login tampil, daftar item tidak bisa dilihat  
**Hasil aktual:** Halaman login tampil dengan benar  
**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 4 — Halaman Login](images/auth_test_4.jpeg)

**Penjelasan:**  
Aplikasi memeriksa apakah pengguna sudah login atau belum. Jika belum, aplikasi menampilkan halaman login dan menyembunyikan seluruh konten utama. Pengguna tidak bisa melihat daftar item meskipun mencoba mengakses langsung melalui alamat URL — karena komponen daftar item memang tidak dimuat sama sekali selama pengguna belum login.

---

### Pengujian 5 — Dashboard Andini Permata Dewanti Setelah Login

**Apa yang diuji:**  
Setelah login, aplikasi harus menampilkan halaman utama dengan nama pengguna yang benar di bagian atas (header), beserta semua fitur yang tersedia.

**Akun yang digunakan:** Andini Permata Dewanti — `10231014@student.itk.ac.id`

**Hasil aktual yang terlihat di layar:**
- Bagian atas (header) menampilkan: badge **"8 items"**, badge **"🟢 Connected"**, nama **"Andrei"**, tombol **Logout**
- Form **"+ Tambah Item Baru"** tersedia
- Kolom pencarian tersedia
- Daftar item tampil:
  - **Charger Laptop** — Rp 250.000 | Stok: 3 | 13 Mar 2026, 23:41
  - **Mouse** — Rp 100.000 | Stok: 10 | 13 Mar 2026, 23:40

> 💡 **Badge** adalah label kecil berbentuk bulat atau persegi panjang yang biasanya menampilkan angka atau status. Contoh: badge "8 items" menunjukkan jumlah item di database.

> 💡 **Header** (di konteks tampilan web) adalah bagian paling atas halaman yang biasanya menampilkan judul aplikasi dan informasi pengguna.

**Hasil yang diharapkan:** Dashboard tampil dengan nama pengguna yang benar  
**Hasil aktual:** Dashboard tampil, nama "Andrei" muncul di header  
**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 5 — Dashboard Andini](images/auth_test_5.jpeg)

**Penjelasan:**  
Setelah login berhasil, data pengguna yang dikembalikan server (termasuk nama) disimpan di memori aplikasi. Aplikasi kemudian menampilkan nama tersebut di bagian atas halaman. Ini membuktikan alur login bekerja secara menyeluruh dari awal hingga akhir.

---

### Pengujian 6 — Dashboard Putri Rahmawati Setelah Login

**Apa yang diuji:**  
Memastikan bahwa saat akun yang berbeda login, nama yang tampil di header juga berubah sesuai akun tersebut.

**Akun yang digunakan:** Putri Rahmawati — `10231074@student.itk.ac.id`

**Hasil aktual yang terlihat di layar:**
- Header menampilkan: badge **"8 items"**, badge **"🟢 Connected"**, nama **"Putri Rahmawati"**, tombol **Logout**
- Daftar item yang sama tampil: Charger Laptop dan Mouse
- Semua fitur (tambah, edit, hapus, cari) tersedia

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 6 — Dashboard Putri Rahmawati](images/auth_test_6.jpeg)

**Penjelasan:**  
Sistem mendukung banyak pengguna (multi-user). Setiap pengguna memiliki akun sendiri dan token sendiri setelah login. Nama yang tampil di header selalu sesuai dengan akun yang sedang aktif. Data inventori yang ditampilkan sama untuk semua pengguna karena semua mengakses satu database yang sama.

---

### Pengujian 7 — Form Login Desnita Dwi Putri

**Apa yang diuji:**  
Mendokumentasikan proses pengisian form login oleh Lead QA & Docs sebelum menekan tombol login.

**Akun:** Desnita Dwi Putri — `10231030@student.itk.ac.id`

**Hasil aktual yang terlihat di layar:**
- Tab **Login** aktif
- Kolom Email terisi: `10231030@student.itk.ac.id`
- Kolom Password terisi dan disembunyikan (ditampilkan sebagai titik-titik)
- Tombol "🔐 Login" siap ditekan

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 7 — Form Login Desnita](images/auth_test_7.jpeg)

---

### Pengujian 8 — Dashboard Desnita Dwi Putri Setelah Login

**Apa yang diuji:**  
Memastikan akun Desnita berhasil masuk dan nama tampil dengan benar di header.

**Hasil aktual yang terlihat di layar:**
- Header menampilkan: badge **"4 items"**, badge **"🟢 Connected"**, nama **"Desnita Dwi Putri"**, tombol **Logout**
- Daftar item tampil: Charger Laptop (Rp 250.000) dan Mouse (Rp 100.000)

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 8 — Dashboard Desnita](images/auth_test_8.jpeg)

---

### Pengujian 9 — Form Login Krishandy Dhanysa Pratama

**Apa yang diuji:**  
Mendokumentasikan proses pengisian form login oleh Lead DevOps.

**Akun:** Krishandy Dhanysa Pratama — `10231050@student.itk.ac.id`

**Hasil aktual yang terlihat di layar:**
- Tab **Login** aktif
- Kolom Email terisi: `10231050@student.itk.ac.id`
- Kolom Password terisi dan disembunyikan
- Tombol "🔐 Login" siap ditekan

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 9 — Form Login Krishandy](images/auth_test_9.jpeg)

---

### Pengujian 10 — Dashboard Krishandy Setelah Login

**Apa yang diuji:**  
Memastikan akun Krishandy berhasil masuk dan nama tampil di header.

**Hasil aktual yang terlihat di layar:**
- Header menampilkan: badge **"4 items"**, badge **"🟢 Connected"**, nama **"Krishandy"**, tombol **Logout**
- Daftar item tampil: Charger Laptop dan Mouse

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 10 — Dashboard Krishandy](images/auth_test_10.jpeg)

---

### Pengujian 11 — Form Login Andini Permata Dewanti

**Apa yang diuji:**  
Mendokumentasikan proses pengisian form login oleh Lead Backend.

**Akun:** Andini Permata Dewanti — `10231014@student.itk.ac.id`

**Hasil aktual yang terlihat di layar:**
- Tab **Login** aktif
- Kolom Email terisi: `10231014@student.itk.ac.id`
- Kolom Password terisi dan disembunyikan

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 11 — Form Login Andini](images/auth_test_11.jpeg)

---

### Pengujian 12 — Form Login Putri Rahmawati

**Apa yang diuji:**  
Mendokumentasikan proses pengisian form login oleh Lead Frontend.

**Akun:** Putri Rahmawati — `10231074@student.itk.ac.id`

**Hasil aktual yang terlihat di layar:**
- Tab **Login** aktif
- Kolom Email terisi: `10231074@student.itk.ac.id`
- Kolom Password terisi dan disembunyikan

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 12 — Form Login Putri](images/auth_test_12.jpeg)

---

### Pengujian 13 — Login dengan Email yang Salah

**Apa yang diuji:**  
Pengujian ini khusus dilakukan untuk memastikan bahwa pesan kesalahan muncul dengan benar ketika seseorang mencoba login dengan email yang tidak terdaftar. Catatan dari penguji saat pengujian: *"auth/login itu untuk tes pesan errornya udah muncul apa belum (berhasil)".*

**Cara menguji:**  
Menggunakan Swagger UI untuk mengirim permintaan login dengan email yang belum terdaftar di sistem.

**Data yang dikirim ke server:**
```json
{
  "email": "10231011@student.itk.ac.id",
  "password": "andini1123"
}
```

**Kode respons:** `401 Unauthorized`

> 💡 **401 Unauthorized** berarti server menolak permintaan karena identitas pengguna tidak dapat diverifikasi. Dalam hal ini, email yang dimasukkan tidak ditemukan di database.

**Pesan kesalahan yang dikembalikan server:**
```json
{
  "detail": "Login gagal: email atau password salah"
}
```

**Informasi header yang dikembalikan:**
```
access-control-allow-credentials: true
content-length: 51
content-type: application/json
date: Wed, 18 Mar 2026 17:21:38 GMT
server: uvicorn
```

**Hasil yang diharapkan:** Kode 401, pesan kesalahan tampil  
**Hasil aktual:** Kode 401, pesan **"Login gagal: email atau password salah"** berhasil muncul  
**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 13 — Login Email Salah](images/auth_test_13.jpeg)

**Penjelasan:**  
Pesan kesalahan yang ditampilkan sengaja tidak membedakan antara "email tidak ditemukan" dan "kata sandi salah". Keduanya mendapat pesan yang sama: *"Login gagal: email atau password salah"*. Hal ini dilakukan untuk alasan keamanan — jika pesannya berbeda, orang yang tidak bertanggung jawab bisa memanfaatkannya untuk mengetahui email mana saja yang terdaftar di sistem hanya dengan mencoba satu per satu.

---

### Pengujian 14 — Melihat Statistik Item (`GET /items/stats`)

**Apa yang diuji:**  
Pengujian ini memastikan bahwa fitur baru statistik item yang ditambahkan oleh Lead Backend sudah berfungsi dan menampilkan data yang benar, termasuk rata-rata harga yang sebelumnya belum ada. Catatan dari penguji saat pengujian: *"menambahkan endpoint get/items/stats, disini udah muncul dan averagenya juga udah ada (berhasil)".*

**Cara menguji:**  
Membuka bagian `GET /items/stats` di Swagger UI dan menekan tombol Execute dengan token yang sudah aktif.

**Kode respons:** `200 OK`

**Data yang dikembalikan server (aktual dari hasil pengujian):**
```json
{
  "total_items": 4,
  "total_stock": 21,
  "average_price": 4087500
}
```

**Penjelasan setiap data yang dikembalikan:**

| Nama Data | Nilai | Artinya |
|---|---|---|
| `total_items` | `4` | Jumlah item yang ada di database saat ini |
| `total_stock` | `21` | Total jumlah stok dari semua item digabungkan (3+10+5+3=21) |
| `average_price` | `4087500` | Rata-rata harga semua item (250.000+100.000+2.000.000+14.000.000 dibagi 4 = Rp4.087.500) |

**Informasi header yang dikembalikan:**
```
content-length: 68
content-type: application/json
date: Wed, 18 Mar 2026 17:36:57 GMT
server: uvicorn
```

**Hasil yang diharapkan:** Kode 200, data statistik tampil termasuk rata-rata harga  
**Hasil aktual:** Kode 200, semua data statistik berhasil ditampilkan dengan nilai yang benar  
**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 14 — Statistik Item](images/auth_test_14.jpeg)

**Penjelasan:**  
Fitur statistik yang ditambahkan Lead Backend sudah bekerja dengan benar dan lebih lengkap dari versi sebelumnya (Modul 2). Kini terdapat tambahan data `total_stock` dan `average_price`. Endpoint ini juga sudah dilindungi dengan token, sehingga hanya pengguna yang sudah login yang dapat melihat statistik.

---

### Pengujian 15 — Nama Pengguna Tampil di Bagian Atas Halaman

**Apa yang diuji:**  
Memastikan nama pengguna yang sedang aktif tampil dengan benar di bagian atas halaman (header), dan daftar item lengkap dapat dilihat setelah login.

**Akun yang digunakan:** Andini (login)

**Hasil aktual yang terlihat di layar:**
- Bagian atas halaman menampilkan: badge **"8 items"**, badge **"🟢 Connected"**, nama **"Andrei"**, tombol **Logout**
- Daftar item tampil dalam tampilan dua kolom:
  - **Charger Laptop** — Rp 250.000 | Bagus | Stok: 3 | 13 Mar 2026, 23:41
  - **Mouse** — Rp 100.000 | Mouse | Stok: 10 | 13 Mar 2026, 23:40
  - **Keyboard** — Rp 2.000.000 | Keyboard keren | Stok: 5 | 13 Mar 2026
  - **Laptop** — Rp 14.000.000 | Laptop untuk coding Cloud Computing | Stok: 3 | 13 Mar 2026

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 15 — Daftar Item dengan Nama Pengguna](images/auth_test_15.jpeg)

---

### Pengujian 16 — Form Edit Item Terisi Data Lama

**Apa yang diuji:**  
Memastikan fitur edit item masih berfungsi dengan benar setelah sistem login ditambahkan. Saat tombol Edit ditekan, form harus terisi otomatis dengan data item yang lama.

**Langkah:** Klik tombol Edit pada item Laptop

**Hasil aktual yang terlihat di layar:**
- Judul form berubah menjadi **"✏️ Edit Item"**
- Kolom Nama Item terisi: **Laptop**
- Kolom Harga (Rp) terisi: **14000000**
- Kolom Deskripsi terisi: **Laptop untuk coding Cloud Computing**
- Kolom Jumlah Stok terisi: **3**
- Tombol **"⬆ Update Item"** (warna hijau) dan **"✕ Batal Edit"** (warna abu-abu) tersedia
- Daftar item masih tampil di bawah form

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 16 — Form Edit Item](images/auth_test_16.jpeg)

**Penjelasan:**  
Fitur edit masih berjalan seperti biasa setelah login ditambahkan. Perbedaannya adalah sekarang setiap kali perubahan disimpan (klik Update Item), permintaan yang dikirim ke server akan menyertakan token secara otomatis. Hal ini memastikan hanya pengguna yang sudah login yang bisa mengubah data item.

---

### Pengujian 17 — Pencarian Item "keyboard"

**Apa yang diuji:**  
Memastikan fitur pencarian masih berjalan setelah sistem login ditambahkan. Pencarian dilakukan ke server (bukan hanya filter di tampilan), sehingga token juga harus disertakan secara otomatis.

**Kata kunci yang dicari:** `keyboard`

**Hasil aktual yang terlihat di layar:**
- Badge di header berubah menjadi **"1 Items"**
- Hanya item **Keyboard** (Rp 2.000.000) yang ditampilkan
- Tombol **"✕ Clear"** muncul di samping tombol Cari untuk menghapus pencarian
- Nama pengguna "Andrei" dan tombol Logout masih tampil di header

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 17 — Pencarian Keyboard](images/auth_test_17.jpeg)

**Penjelasan:**  
Pencarian item dikirim ke server dengan menyertakan token secara otomatis di setiap permintaan. Server memverifikasi token terlebih dahulu sebelum menjalankan pencarian. Pencarian juga tidak membedakan huruf besar dan kecil, sehingga mengetik "keyboard" akan menemukan item bernama "Keyboard".

---

### Pengujian 18 — Dialog Konfirmasi Sebelum Menghapus Item

**Apa yang diuji:**  
Memastikan dialog konfirmasi muncul terlebih dahulu sebelum item benar-benar dihapus, sehingga pengguna tidak menghapus item secara tidak sengaja.

**Langkah:** Klik tombol Hapus pada item Laptop

**Hasil aktual yang terlihat di layar:**
- Dialog browser muncul dengan teks: **"Yakin ingin menghapus 'Laptop'?"**
- Dua pilihan tersedia: tombol **OK** (untuk melanjutkan penghapusan) dan **Cancel** (untuk membatalkan)
- Item lain masih terlihat di latar belakang: Charger Laptop, Mouse, Keyboard, Laptop

> 💡 **Dialog browser** adalah jendela kecil yang muncul di atas halaman web untuk meminta konfirmasi dari pengguna sebelum melanjutkan suatu tindakan.

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 18 — Dialog Konfirmasi Hapus](images/auth_test_18.jpeg)

**Penjelasan:**  
Dialog konfirmasi menampilkan nama item secara spesifik sehingga pengguna dapat memastikan item mana yang akan dihapus. Jika pengguna menekan OK, permintaan penghapusan akan dikirim ke server dengan menyertakan token secara otomatis. Jika menekan Cancel, tidak ada yang berubah.

---

### Pengujian 19 — Tampilan Kosong Setelah Semua Item Dihapus

**Apa yang diuji:**  
Memastikan tampilan khusus "belum ada item" muncul saat semua item di database sudah dihapus. Pengujian ini juga membuktikan bahwa semua proses penghapusan berhasil dijalankan dengan sistem login yang aktif.

**Langkah:** Hapus semua item yang ada satu per satu

**Hasil aktual yang terlihat di layar:**
- Badge di header berubah menjadi **"0 items"**
- Badge **"🟢 Connected"** dan nama pengguna **"Andrei"** serta tombol Logout masih tampil
- Area daftar item menampilkan:
  - Ikon 📭 (kotak surat kosong)
  - Teks besar: **"Belum ada item."**
  - Teks kecil di bawahnya: "Gunakan form di atas untuk menambahkan item pertama."
- Form tambah item masih tersedia di atas untuk menambah item baru

**Status:** ✅ BERHASIL

**Screenshot:**

![Pengujian 19 — Tampilan Kosong](images/auth_test_19.jpeg)

**Penjelasan:**  
Seluruh 4 item berhasil dihapus satu per satu dengan sistem login yang berjalan di setiap permintaan. Setiap penghapusan yang berhasil langsung memperbarui tampilan secara otomatis tanpa perlu me-refresh halaman. Saat tidak ada item tersisa, aplikasi menampilkan pesan khusus yang ramah pengguna agar tidak terlihat seperti ada kesalahan atau kerusakan.

---

## 🗂️ Daftar File Screenshot

Semua screenshot disimpan di folder `docs/images/`:

| File Screenshot | Nomor Pengujian | Isi |
|---|---|---|
| `auth_test_1.jpeg` | Pengujian 1 | Swagger: Login berhasil, token diterima |
| `auth_test_2.jpeg` | Pengujian 2 | Swagger: Status Authorized setelah token dimasukkan |
| `auth_test_3.jpeg` | Pengujian 3 | Swagger: Daftar item berhasil ditampilkan dengan token |
| `auth_test_4.jpeg` | Pengujian 4 | Browser: Halaman login — tab Register aktif |
| `auth_test_5.jpeg` | Pengujian 5 | Browser: Dashboard Andini — nama tampil di header |
| `auth_test_6.jpeg` | Pengujian 6 | Browser: Dashboard Putri Rahmawati |
| `auth_test_7.jpeg` | Pengujian 7 | Browser: Form login Desnita Dwi Putri |
| `auth_test_8.jpeg` | Pengujian 8 | Browser: Dashboard Desnita — "Desnita Dwi Putri" di header |
| `auth_test_9.jpeg` | Pengujian 9 | Browser: Form login Krishandy |
| `auth_test_10.jpeg` | Pengujian 10 | Browser: Dashboard Krishandy — nama tampil |
| `auth_test_11.jpeg` | Pengujian 11 | Browser: Form login Andini |
| `auth_test_12.jpeg` | Pengujian 12 | Browser: Form login Putri Rahmawati |
| `auth_test_13.jpeg` | Pengujian 13 | Swagger: Login email salah → pesan kesalahan muncul |
| `auth_test_14.jpeg` | Pengujian 14 | Swagger: Statistik item — `average_price` tampil |
| `auth_test_15.jpeg` | Pengujian 15 | Browser: Daftar 4 item + nama pengguna di header |
| `auth_test_16.jpeg` | Pengujian 16 | Browser: Form Edit — data Laptop terisi otomatis |
| `auth_test_17.jpeg` | Pengujian 17 | Browser: Pencarian "keyboard" — 1 hasil, tombol Clear muncul |
| `auth_test_18.jpeg` | Pengujian 18 | Browser: Dialog konfirmasi hapus item "Laptop" |
| `auth_test_19.jpeg` | Pengujian 19 | Browser: Tampilan kosong setelah semua item dihapus |

---
 
## 🐛 Catatan Bug & Temuan Selama Pengujian
 
---
 
### ⚠️ Bug Ditemukan — Fitur Edit Tidak Menampilkan Data Terbaru
 
Selama pengujian, ditemukan masalah pada fitur edit item di browser. Ketika pengguna mengubah data item melalui form dan menekan tombol Update, data di daftar tidak berubah. Halaman perlu di-refresh secara manual baru data terbaru muncul. Sementara itu, fitur tambah item dan hapus item berjalan tanpa masalah. Ketika edit dilakukan melalui Swagger UI, perubahan berhasil tersimpan dan terlihat.
 
Setelah dilakukan analisis pada kode `App.jsx` dan `api.js`, ditemukan **dua bug yang saling berkaitan**. Keduanya bersumber dari dua file yang berbeda dan masing-masing memberikan efek yang berbeda pula.
 
---
 
#### Bug 1 — File `api.js`: Data yang Dikirim Tidak Bisa Dibaca Server
 
**File yang bermasalah:** `frontend/src/services/api.js`  
**Fungsi yang terdampak:** `updateItem()` — penyebab utama edit tidak menyimpan perubahan
 
**Penjelasan masalah:**
 
Ketika frontend mengirim data ke server — baik untuk menambah item (POST) maupun mengubah item (PUT) — server perlu diberitahu dalam format apa data tersebut dikirim. Keterangan ini disebut `Content-Type` dan diletakkan di bagian **header** permintaan.
 
> 💡 **Header** pada sebuah permintaan ke server adalah kumpulan informasi tambahan yang menyertai data utama. Analoginya seperti amplop surat — amplop berisi informasi pengirim, penerima, dan jenis isi surat, sementara isi suratnya ada di dalam.
 
> 💡 **`Content-Type: application/json`** adalah keterangan yang memberitahu server bahwa data yang dikirim menggunakan format JSON. Tanpa keterangan ini, server menerima data tetapi tidak tahu cara membacanya — seperti menerima surat yang ditulis dalam kode yang tidak dikenal.
 
Jika dibandingkan seluruh fungsi di `api.js`, terlihat perbedaan yang jelas:
 
| Fungsi | Metode | Mengirim Data | Punya `Content-Type` |
|---|---|---|---|
| `register` | POST | ✅ Ya | ✅ Ya — **sudah benar** |
| `login` | POST | ✅ Ya | ✅ Ya — **sudah benar** |
| `createItem` | POST | ✅ Ya | ❌ Tidak — **bug** |
| `updateItem` | PUT | ✅ Ya | ❌ Tidak — **bug** |
| `deleteItem` | DELETE | ❌ Tidak perlu | ✅ Tidak perlu |
| `fetchItems` | GET | ❌ Tidak perlu | ✅ Tidak perlu |
 
Fungsi `register` dan `login` sudah benar karena menyertakan `Content-Type` secara eksplisit. Namun `createItem` dan `updateItem` hanya menyertakan token login (`authHeaders()`) tanpa `Content-Type`.
 
**Mengapa tambah item tetap bisa berjalan?**
 
FastAPI di backend memiliki kemampuan mendeteksi format data secara otomatis dalam kondisi tertentu, terutama untuk operasi POST sederhana. Itulah mengapa tambah item (`createItem`) kadang masih bisa berjalan meskipun `Content-Type` tidak ada.
 
Namun untuk operasi PUT (`updateItem`) yang melakukan **partial update** (hanya mengubah sebagian field saja), backend lebih ketat dalam memeriksa header. Tanpa `Content-Type`, server tidak bisa membaca data perubahan yang dikirim, sehingga tidak ada yang tersimpan ke database. Permintaan diterima oleh server, tetapi karena data tidak terbaca, server mengembalikan data lama yang sudah tersimpan sebelumnya — seolah-olah tidak terjadi apa-apa.
 
**Kode yang bermasalah (sebelum diperbaiki):**
```javascript
// ❌ updateItem — tidak ada keterangan format data
export async function updateItem(id, itemData) {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: "PUT",
        headers: authHeaders(),         // hanya berisi token login
        body: JSON.stringify(itemData), // data dikirim tapi server tidak tahu formatnya
    })
    return handleResponse(response)
}
```
 
**Kode yang sudah diperbaiki:**
```javascript
// ✅ updateItem — sudah ada keterangan format data
export async function updateItem(id, itemData) {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: "PUT",
        headers: {
            ...authHeaders(),                   // token login tetap disertakan
            "Content-Type": "application/json", // tambahan: beritahu server format datanya JSON
        },
        body: JSON.stringify(itemData),
    })
    return handleResponse(response)
}
```
 
> 💡 **`...authHeaders()`** — tanda tiga titik (`...`) di sini artinya "salin semua isi dari `authHeaders()` ke sini". Hasilnya adalah satu objek header yang berisi token login sekaligus keterangan format data, keduanya sekaligus.
 
Perbaikan yang sama juga diterapkan pada `createItem` agar konsisten dan tidak bermasalah di semua kondisi:
```javascript
// ✅ createItem — sudah diperbaiki juga
export async function createItem(itemData) {
    const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
    })
    return handleResponse(response)
}
```
 
---
 
#### Bug 2 — File `App.jsx`: Daftar Dimuat Sebelum Server Selesai Menyimpan
 
**File yang bermasalah:** `frontend/src/App.jsx`  
**Fungsi yang terdampak:** `handleSubmit()` dan `handleDelete()`
 
**Penjelasan masalah:**
 
Setelah data berhasil dikirim ke server, aplikasi perlu memuat ulang daftar item agar perubahan tampil di layar. Namun di kode yang ada, perintah "muat ulang daftar" (`loadItems`) dijalankan tanpa menunggu server selesai terlebih dahulu.
 
> 💡 **`await`** adalah kata kunci dalam JavaScript yang artinya "tunggu dulu sampai proses ini benar-benar selesai, baru lanjutkan ke baris berikutnya". Tanpa `await`, JavaScript langsung melanjutkan ke baris berikutnya tanpa menunggu.
 
`loadItems()` adalah fungsi yang perlu waktu karena harus mengirim permintaan ke server dan menunggu jawaban. Jika dipanggil tanpa `await`, daftar akan dimuat ulang sebelum server sempat memproses dan menyimpan perubahan — sehingga data lama yang muncul.
 
Ini juga menjelaskan mengapa data terbaru baru muncul setelah halaman di-refresh manual. Saat refresh, server sudah selesai menyimpan, sehingga data terbaru bisa ditampilkan.
 
**Kode yang bermasalah di `handleSubmit` (sebelum diperbaiki):**
```javascript
const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
      } else {
        await createItem(itemData)
      }
      loadItems(searchQuery)   // ❌ tidak ada "await" — daftar dimuat sebelum server selesai
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else throw err
    }
}
```
 
**Kode yang sudah diperbaiki:**
```javascript
const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
      } else {
        await createItem(itemData)
      }
      await loadItems(searchQuery)   // ✅ tambahkan "await" — tunggu server selesai, baru muat ulang
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else throw err
    }
}
```
 
**Kode yang bermasalah di `handleDelete` (sebelum diperbaiki):**
```javascript
const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    try {
      await deleteItem(id)
      loadItems(searchQuery)   // ❌ tidak ada "await"
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else alert("Gagal menghapus: " + err.message)
    }
}
```
 
**Kode yang sudah diperbaiki:**
```javascript
const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    try {
      await deleteItem(id)
      await loadItems(searchQuery)   // ✅ tambahkan "await"
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else alert("Gagal menghapus: " + err.message)
    }
}
```
 
---
 
#### Hubungan Dua Bug dan Pengaruhnya
 
Kedua bug ini bekerja bersama-sama dan menghasilkan gejala yang membingungkan:
 
| Kondisi | Bug 1 (`api.js`) | Bug 2 (`App.jsx`) | Efek yang Terlihat |
|---|---|---|---|
| **Tambah item** | `createItem` kadang berhasil karena FastAPI toleran terhadap POST tanpa `Content-Type` | `loadItems` tanpa `await` — tapi tambah cepat sehingga tidak terasa | Item baru tampil, terlihat normal |
| **Edit item** | `updateItem` gagal menyimpan karena PUT lebih ketat — server tidak bisa baca data perubahan | `loadItems` tanpa `await` memperparah — daftar dimuat sebelum server selesai | Perubahan tidak tersimpan sama sekali, data lama muncul |
| **Hapus item** | `deleteItem` tidak mengirim body — tidak terdampak bug `Content-Type` | `loadItems` tanpa `await` — tapi hapus cepat sehingga tidak terasa | Item terhapus, terlihat normal |
 
Itulah mengapa gejala yang muncul hanya terlihat pada fitur edit, padahal sebenarnya ada bug di dua tempat sekaligus.
 
---
 
#### Mengapa Edit di Swagger Berhasil tapi di Frontend Tidak?
 
Swagger UI secara otomatis selalu menyertakan `Content-Type: application/json` pada setiap permintaan yang mengirim data. Pengguna tidak perlu mengatur ini secara manual. Karena itulah edit melalui Swagger berhasil — server bisa membaca data perubahan dengan benar.
 
Di frontend, keterangan `Content-Type` harus ditambahkan secara manual di kode. Karena tidak ditambahkan, server tidak bisa membaca perubahan yang dikirim.
 
---
 
#### Ringkasan Perbaikan
 
| File | Fungsi | Masalah | Perbaikan |
|---|---|---|---|
| `api.js` | `updateItem()` | Tidak ada `Content-Type` — server tidak bisa baca data perubahan | Tambahkan `"Content-Type": "application/json"` di header |
| `api.js` | `createItem()` | Tidak ada `Content-Type` — rentan bermasalah | Tambahkan `"Content-Type": "application/json"` di header |
| `App.jsx` | `handleSubmit()` | `loadItems` tanpa `await` — daftar dimuat sebelum server selesai | Tambahkan `await` sebelum `loadItems(searchQuery)` |
| `App.jsx` | `handleDelete()` | `loadItems` tanpa `await` — sama seperti di atas | Tambahkan `await` sebelum `loadItems(searchQuery)` |
 
**File yang sudah diperbaiki:**
- `frontend/src/services/api.js` — tersedia di file `api.js`
- `frontend/src/App.jsx` — tersedia di file `App.jsx`
 
**Perintah commit setelah perbaikan:**
```bash
git add frontend/src/services/api.js frontend/src/App.jsx
git commit -m "fix: Content-Type header and await loadItems
 
- api.js: updateItem and createItem missing Content-Type application/json
  server received body but could not parse it, causing edit to not save
- App.jsx: loadItems not awaited in handleSubmit and handleDelete
  list reloaded before server finished processing the change"
git push origin main
```
 
---
 
**Catatan tambahan lainnya:**
 
| Hal | Keterangan |
|---|---|
| Token tidak tersimpan permanen | Jika halaman di-refresh, pengguna perlu login kembali karena token hanya disimpan sementara di memori browser. Ini adalah perilaku yang disengaja untuk tahap pembelajaran ini. |
| Data inventori bersama | Semua pengguna melihat dan dapat mengubah data inventori yang sama. Belum ada pemisahan data per pengguna. |
| Endpoint statistik diperbarui | Lead Backend menambahkan field `average_price` dan `total_stock` yang sebelumnya tidak ada di Modul 2. |
 
---
 
## ✅ Kesimpulan
 
Seluruh fitur yang diuji pada Modul 4 berjalan dengan benar:
 
| Fitur | Hasil |
|---|---|
| Login berhasil dan mendapat token | ✅ |
| Token berhasil digunakan di Swagger UI | ✅ |
| Data item dapat diakses setelah login | ✅ |
| Pesan kesalahan saat email salah sudah muncul | ✅ |
| Statistik item menampilkan rata-rata harga | ✅ |
| Halaman login tampil saat belum masuk | ✅ |
| Nama pengguna tampil di header setelah login | ✅ |
| Semua 4 anggota tim berhasil login dengan akun masing-masing | ✅ |
| Fitur edit item tetap berfungsi setelah login ditambahkan | ✅ |
| Fitur pencarian tetap berfungsi setelah login ditambahkan | ✅ |
| Dialog konfirmasi tampil sebelum item dihapus | ✅ |
| Tampilan kosong muncul setelah semua item dihapus | ✅ |
 
---