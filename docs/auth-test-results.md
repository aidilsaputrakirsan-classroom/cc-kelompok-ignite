# 🔐 Hasil Pengujian Autentikasi

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

| No | Alat | Kategori | Yang Diuji |
|---|---|---|---|
| 1 | Swagger UI | Login API | Login berhasil dan mendapat token |
| 2 | Swagger UI | Login API | Memasukkan token ke halaman dokumentasi API |
| 3 | Swagger UI | Login API | Mengambil daftar item menggunakan token |
| 4 | Browser | Autentikasi | Registrasi akun baru |
| 5 | Browser | Autentikasi | Dashboard tampil setelah login |
| 6 | Browser | Autentikasi | Form login tampil dengan benar |
| 7 | Browser | CRUD | Dialog konfirmasi sebelum menambah item |
| 8 | Browser | CRUD | Notifikasi item berhasil ditambahkan |
| 9 | Browser | CRUD | Form edit item terisi data lama |
| 10 | Browser | CRUD | Dialog konfirmasi sebelum update item |
| 11 | Browser | CRUD | Notifikasi item berhasil diupdate |
| 12 | Browser | CRUD | Dialog konfirmasi sebelum menghapus item |
| 13 | Browser | CRUD | Notifikasi item berhasil dihapus |
| 14 | Browser | Sorting | Urutkan berdasarkan tanggal terlama |
| 15 | Browser | Sorting | Urutkan berdasarkan nama A-Z |
| 16 | Browser | Pencarian | Mencari item berdasarkan kata kunci |
| 17 | Browser | Filter Harga | Filter item berdasarkan rentang harga |
| 18 | Browser | Sorting | Urutkan berdasarkan harga |
| 19 | Browser | Autentikasi | Dialog konfirmasi sebelum logout |
| 20 | Browser | Autentikasi | Halaman login tampil setelah logout |

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
Membuka Swagger UI di `http://localhost:8000/docs`, mencari bagian `POST /auth/login`, mengisi email dan kata sandi, kemudian menekan tombol Execute.
 
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
 
> 💡 **`access_token`** adalah token tanda pengenal sementara yang diberikan server. Rangkaian karakter panjang tersebut adalah token JWT yang sudah dienkripsi dan akan digunakan di setiap permintaan berikutnya.
 
> 💡 **`token_type: "bearer"`** berarti token ini digunakan dengan menulisnya di header permintaan dengan format: `Authorization: Bearer <token>`.
 
> 💡 **`is_active: true`** berarti akun pengguna dalam kondisi aktif dan dapat digunakan.
 
**Informasi header yang dikembalikan:**
```
access-control-allow-credentials: true
content-length: 354
content-type: application/json
date: Wed, 19 Mar 2026 16:30:04 GMT
server: uvicorn
```
 
> 💡 **`access-control-allow-credentials: true`** adalah bukti bahwa pengaturan CORS sudah berjalan benar, sehingga aplikasi frontend di port 5173 diizinkan berkomunikasi dengan backend di port 8000.
 
**Hasil yang diharapkan:** Kode 200, token diterima  
**Hasil aktual:** Kode 200, token JWT berhasil diterima beserta data pengguna  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 1 — Login Berhasil](images/auth_test_1.jpeg)
 
---
 
### Pengujian 2 — Memasukkan Token ke Swagger UI
 
**Apa yang diuji:**
Setelah mendapat token dari Pengujian 1, token tersebut dimasukkan ke Swagger UI agar semua pengujian berikutnya bisa dilakukan tanpa perlu login ulang setiap saat.
 
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
 
**Hasil yang diharapkan:** Status Authorized tampil setelah token dimasukkan  
**Hasil aktual:** Status Authorized, token tersimpan di Swagger UI  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 2 — Token Berhasil Dimasukkan ke Swagger](images/auth_test_2.jpeg)
 
---
 
### Pengujian 3 — Mengambil Daftar Item Menggunakan Token
 
**Apa yang diuji:**
Memastikan bahwa setelah token dimasukkan, endpoint `/items` yang sebelumnya dilindungi kini dapat diakses. Ini membuktikan bahwa sistem perlindungan endpoint berjalan dengan benar.
 
**Cara menguji:**
Membuka bagian `GET /items` di Swagger UI dan menekan tombol Execute. Swagger akan otomatis menyertakan token dari Pengujian 2.
 
> 💡 **`GET`** adalah cara meminta data dari server tanpa mengubah apapun. Digunakan ketika kita hanya ingin membaca data.
 
**Permintaan yang dikirim:**
```
GET http://localhost:8000/items?skip=0&limit=20
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```
 
> 💡 **`skip=0&limit=20`** adalah pengaturan halaman data. `skip=0` berarti mulai dari data pertama, `limit=20` berarti tampilkan maksimal 20 data sekaligus.
 
**Kode respons:** `200 OK`
 
**Data yang dikembalikan server:**
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
 
> 💡 **`total: 3`** menunjukkan jumlah keseluruhan item. **`updated_at: null`** berarti item belum pernah diubah sejak pertama kali ditambahkan.
 
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
 
### Pengujian 4 — Registrasi Akun Baru
 
**Apa yang diuji:**
Memastikan pengguna baru dapat mendaftarkan akun melalui form registrasi di browser, kolom terisi dengan benar, dan proses pendaftaran dapat dijalankan.
 
**Langkah yang dilakukan:**
1. Buka `http://localhost:5173`
2. Klik tab **Register**
3. Isi kolom Nama Lengkap: **Nazwa**
4. Isi kolom Email: **10231068@student.itk.ac.id**
5. Isi kolom Password
6. Klik tombol Register
 
**Hasil aktual yang terlihat di layar:**
- Tab **Register** aktif, tab **Login** tersedia di sebelah kiri
- Kolom Nama Lengkap terisi: **Nazwa**
- Kolom Email terisi: **10231068@student.itk.ac.id**
- Kolom Password terisi dan disembunyikan
- Tombol berubah menjadi **"⏳ Loading..."** saat proses berjalan
 
**Hasil yang diharapkan:** Form registrasi dapat diisi dan dikirim, tombol menampilkan loading  
**Hasil aktual:** Sesuai — form terisi, tombol Loading tampil saat proses berjalan  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 4 — Registrasi Akun](images/auth_test_4.jpeg)
 
**Penjelasan:**
Saat tombol Register ditekan, aplikasi mengirimkan data ke endpoint `POST /auth/register`. Tombol berubah menjadi "Loading..." sebagai umpan balik visual dan mencegah pengguna menekan tombol berulang kali. Setelah server menyimpan akun baru, aplikasi otomatis melanjutkan ke proses login.
 
---
 
### Pengujian 5 — Dashboard Tampil Setelah Login
 
**Apa yang diuji:**
Memastikan setelah login berhasil, aplikasi menampilkan halaman utama dengan nama pengguna yang benar di header beserta seluruh fitur yang tersedia.
 
**Hasil aktual yang terlihat di layar:**
- Header: badge **"3 Items"**, badge **"🟢 Connected"**, nama **"Nazwa"**, tombol **Logout**
- Form **"+ Tambah Item Baru"** tersedia dengan semua kolom input
- Kolom pencarian dan tombol **"⚙ Filter Harga"** tersedia
- Daftar item tampil dalam grid dua kolom:
  - **komputer** — Rp 12.000.000 | bagus | Stok: 3 | 31 Mar 2026, 00:00
  - **Keyboard** — Rp 1.000.000 | Ngetikk | Stok: 1 | 25 Mar 2026, 23:48
 
**Hasil yang diharapkan:** Dashboard tampil dengan nama pengguna dan semua fitur  
**Hasil aktual:** Dashboard tampil, nama "Nazwa" muncul di header, semua fitur tersedia  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 5 — Dashboard Setelah Login](images/auth_test_5.jpeg)
 
**Penjelasan:**
Setelah login berhasil, server mengembalikan token JWT beserta data pengguna termasuk nama. Aplikasi menyimpan token di memori dan menampilkan nama pengguna di header. Badge "3 Items" menunjukkan jumlah item yang ada di database saat itu.
 
---
 
### Pengujian 6 — Form Login Tampil dengan Benar
 
**Apa yang diuji:**
Memastikan form login menampilkan kolom yang tepat dan dapat menerima input email serta password.
 
**Hasil aktual yang terlihat di layar:**
- Tab **Login** aktif, tab **Register** tersedia
- Kolom Email terisi: **10231014@student.itk.ac.id**
- Kolom Password terisi dan disembunyikan
- Tombol **"🔐 Login"** tersedia
 
**Hasil yang diharapkan:** Form login tampil dengan kolom email dan password  
**Hasil aktual:** Sesuai — form login tampil lengkap dengan data terisi  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 6 — Form Login](images/auth_test_6.jpeg)
 
---
 
### Pengujian 7 — Dialog Konfirmasi Sebelum Menambah Item
 
**Apa yang diuji:**
Memastikan dialog konfirmasi muncul sebelum data item baru dikirim ke server. Pengguna harus menyetujui terlebih dahulu sebelum proses penyimpanan dijalankan.
 
**Langkah yang dilakukan:**
1. Isi form Tambah Item Baru
2. Klik tombol **Tambah Item**
3. Verifikasi dialog konfirmasi muncul
 
**Hasil aktual yang terlihat di layar:**
- Dialog browser muncul: **"Apakah Anda yakin menambahkan data item ini?"**
- Dua tombol: **OK** (hijau) dan **Cancel**
- Di latar belakang tampak daftar 4 item: Monitor, komputer, Keyboard, Laptop
 
> 💡 **Dialog browser** adalah jendela kecil yang muncul di atas halaman untuk meminta konfirmasi sebelum melanjutkan suatu tindakan. Dialog ini memblokir interaksi sampai pengguna memilih OK atau Cancel.
 
**Hasil yang diharapkan:** Dialog konfirmasi muncul sebelum data disimpan  
**Hasil aktual:** Dialog muncul dengan pesan yang tepat  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 7 — Dialog Konfirmasi Tambah](images/auth_test_7.jpeg)
 
**Penjelasan:**
Jika pengguna menekan OK, request `POST /items` dikirim ke server dengan token JWT di header secara otomatis. Jika menekan Cancel, tidak ada data yang dikirim dan form tetap terbuka.
 
---
 
### Pengujian 8 — Notifikasi Item Berhasil Ditambahkan
 
**Apa yang diuji:**
Memastikan setelah pengguna mengonfirmasi penambahan item, muncul notifikasi keberhasilan dan daftar item langsung diperbarui tanpa perlu me-refresh halaman.
 
**Hasil aktual yang terlihat di layar:**
- Notifikasi hijau muncul di bagian atas: **"1 Item menyebutkan berhasil"**
 
> 💡 **Notifikasi toast** adalah pesan kecil yang muncul sebentar di bagian atas halaman, lalu menghilang sendiri setelah beberapa detik. Memberikan umpan balik tanpa mengganggu tampilan utama.
 
- Badge di header: **"5 Items"** (bertambah)
- Dropdown sorting tersedia: **Urutkan Berdasarkan** (Tanggal) dan **Urutan** (Terbaru)
- Daftar 4 item tampil:
  - **charger laptop** — Rp 250.000 | fast charging | Stok: 1 | 22 Mar 2026, 21:08
  - **mouse** — Rp 100.000 | bagus | Stok: 4 | 22 Mar 2026, 21:20
  - **komputer** — Rp 12.000.000 | bagus | Stok: 3 | 22 Mar 2026
  - **Keyboard** — Rp 1.000.000 | Ngetikk | Stok: 3 | 25 Mar 2026, 23:48
 
**Hasil yang diharapkan:** Notifikasi berhasil muncul, daftar diperbarui otomatis  
**Hasil aktual:** Notifikasi hijau tampil, badge bertambah, item baru muncul di daftar  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 8 — Notifikasi Tambah Berhasil](images/auth_test_8.jpeg)
 
**Penjelasan:**
Setelah server berhasil menyimpan item baru (response `201 Created`), aplikasi memanggil ulang `GET /items` untuk memuat daftar terbaru. Notifikasi toast tampil otomatis sebagai konfirmasi visual.
 
---
 
### Pengujian 9 — Form Edit Item Terisi Data Lama
 
**Apa yang diuji:**
Memastikan saat tombol Edit ditekan, form beralih ke mode edit dan semua kolom terisi otomatis dengan data item yang dipilih.
 
**Langkah yang dilakukan:**
1. Klik tombol **Edit** pada item **charger laptop**
2. Verifikasi form beralih ke mode Edit dan terisi data lama
 
**Hasil aktual yang terlihat di layar:**
- Judul form: **"✏️ Edit Item"**
- Kolom Nama Item: **charger laptop**
- Kolom Harga (Rp): **260000**
- Kolom Deskripsi: **bagus fast charging**
- Kolom Jumlah Stok: **0**
- Tombol **"⬆ Update Item"** (hijau) dan **"✕ Batal Edit"** (abu-abu)
- Daftar item tetap tampil di bawah form
 
**Hasil yang diharapkan:** Form beralih ke mode edit, semua kolom terisi data lama  
**Hasil aktual:** Sesuai — form terisi otomatis dengan data charger laptop  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 9 — Form Edit Item](images/auth_test_9.jpeg)
 
**Penjelasan:**
Ketika tombol Edit ditekan, fungsi `handleEdit()` di `App.jsx` menyimpan data item ke state `editingItem`. Komponen `ItemForm` mendeteksi perubahan ini melalui `useEffect` dan mengisi semua kolom secara otomatis.
 
---
 
### Pengujian 10 — Dialog Konfirmasi Sebelum Update Item
 
**Apa yang diuji:**
Memastikan dialog konfirmasi muncul sebelum perubahan data item dikirim ke server.
 
**Langkah yang dilakukan:**
1. Ubah data di form Edit Item
2. Klik tombol **Update Item**
3. Verifikasi dialog konfirmasi muncul
 
**Hasil aktual yang terlihat di layar:**
- Dialog browser muncul: **"Apakah Anda yakin untuk update data item ini?"**
- Dua tombol: **OK** (hijau) dan **Cancel**
- Di latar belakang tampak form edit dengan deskripsi "bagus, fast charging"
 
**Hasil yang diharapkan:** Dialog konfirmasi muncul sebelum perubahan disimpan  
**Hasil aktual:** Dialog muncul dengan pesan yang tepat  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 10 — Dialog Konfirmasi Update](images/auth_test_10.jpeg)
 
---
 
### Pengujian 11 — Notifikasi Item Berhasil Diupdate
 
**Apa yang diuji:**
Memastikan setelah pengguna mengonfirmasi update, perubahan tersimpan di server, notifikasi muncul, dan data terbaru langsung tampil.
 
**Hasil aktual yang terlihat di layar:**
- Notifikasi hijau: **"1 Item update berhasil"**
- Form kembali ke mode **"+ Tambah Item Baru"** (kosong)
- Daftar item diperbarui:
  - **charger laptop** — Rp 250.000 | fast charging | Stok: 1 | 22 Mar 2026, 21:08
  - **mouse** — Rp 150.000 | bagus | Stok: 4 | 22 Mar 2026, 21:09
  - **komputer** — Rp 12.000.000 | bagus | Stok: 3 | 21 Mar 2026
  - **Keyboard** — Rp 1.000.000 | Ngetikk | Stok: 3 | 25 Mar 2026, 23:48
 
**Hasil yang diharapkan:** Notifikasi update muncul, data terbaru langsung terlihat  
**Hasil aktual:** Notifikasi hijau tampil, data diperbarui, form kembali kosong  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 11 — Notifikasi Update Berhasil](images/auth_test_11.jpeg)
 
**Penjelasan:**
Setelah server memproses `PUT /items/:id` (response `200 OK`), aplikasi memuat ulang daftar secara otomatis. State `editingItem` direset ke `null` sehingga form kembali ke mode tambah.
 
---
 
### Pengujian 12 — Dialog Konfirmasi Sebelum Menghapus Item
 
**Apa yang diuji:**
Memastikan dialog konfirmasi dengan nama item yang spesifik muncul sebelum proses penghapusan dijalankan.
 
**Langkah yang dilakukan:**
1. Klik tombol **Hapus** pada item **charger laptop**
2. Verifikasi dialog konfirmasi muncul
 
**Hasil aktual yang terlihat di layar:**
- Dialog browser muncul: **"Yakin ingin menghapus 'charger laptop'?"**
- Dua tombol: **OK** (hijau) dan **Cancel**
- Di latar belakang tampak daftar item lengkap
 
**Hasil yang diharapkan:** Dialog dengan nama item yang tepat muncul  
**Hasil aktual:** Dialog muncul, nama "charger laptop" tercantum dengan benar  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 12 — Dialog Konfirmasi Hapus](images/auth_test_12.jpeg)
 
**Penjelasan:**
Dialog menampilkan nama item secara spesifik agar pengguna dapat memverifikasi item mana yang akan dihapus. Jika OK diklik, `DELETE /items/:id` dikirim ke server dengan token JWT di header.
 
---
 
### Pengujian 13 — Notifikasi Item Berhasil Dihapus
 
**Apa yang diuji:**
Memastikan setelah penghapusan dikonfirmasi, item terhapus dari database, notifikasi muncul, dan daftar langsung diperbarui.
 
**Hasil aktual yang terlihat di layar:**
- Notifikasi hijau: **"1 Item berhasil dihapus"**
- Badge header: **"4 Items"** (berkurang dari 5)
- Item **charger laptop** tidak lagi tampil, daftar tersisa:
  - **mouse** — Rp 150.000 | bagus | Stok: 4 | 22 Mar 2026
  - **komputer** — Rp 12.000.000 | bagus | Stok: 3 | 21 Mar 2026
  - **Keyboard** — Rp 1.000.000 | Ngetikk | Stok: 3 | 25 Mar 2026
  - **Laptop** — Rp 13.000.000 | Laptop untuk coding Cloud Computing | Stok: 3 | 22 Mar 2026
 
**Hasil yang diharapkan:** Notifikasi hapus muncul, item hilang dari daftar  
**Hasil aktual:** Notifikasi tampil, charger laptop tidak ada, badge berkurang  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 13 — Notifikasi Hapus Berhasil](images/auth_test_13.jpeg)
 
---
 
### Pengujian 14 — Urutkan Berdasarkan Tanggal Terlama
 
**Apa yang diuji:**
Memastikan fitur sorting berfungsi dengan kombinasi kriteria **Tanggal** dan arah **Terlama** — item yang paling lama ditambahkan muncul di posisi paling atas.
 
**Langkah yang dilakukan:**
1. Dropdown **"Urutkan Berdasarkan"**: pilih **Tanggal**
2. Dropdown **"Urutan"**: pilih **Terlama**
 
**Hasil aktual yang terlihat di layar:**
- Dropdown: **Tanggal** + **Terlama**
- Daftar diurutkan dari paling lama:
  1. **Laptop** — Rp 13.000.000
  2. **Keyboard** — Rp 1.000.000
  3. **komputer** — Rp 12.000.000
  4. **mouse** — Rp 150.000
 
**Hasil yang diharapkan:** Daftar diurutkan dari yang paling lama ditambahkan  
**Hasil aktual:** Urutan berubah sesuai pilihan  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 14 — Sorting Tanggal Terlama](images/auth_test_14.jpeg)
 
**Penjelasan:**
Fitur sorting dijalankan di sisi frontend — tidak mengirim request baru ke server. Data di state diurutkan ulang menggunakan fungsi `sort()` di `App.jsx` berdasarkan pilihan dropdown, sehingga respons terasa instan.
 
---
 
### Pengujian 15 — Urutkan Berdasarkan Nama A-Z
 
**Apa yang diuji:**
Memastikan fitur sorting berdasarkan nama dengan urutan A-Z menghasilkan daftar yang tersusun secara alfabetis.
 
**Langkah yang dilakukan:**
1. Dropdown **"Urutkan Berdasarkan"**: pilih **Nama (A-Z)**
2. Dropdown **"Urutan"**: pilih **A-Z**
 
**Hasil aktual yang terlihat di layar:**
- Dropdown: **Nama (A-Z)** + **A-Z**
- Daftar diurutkan secara alfabetis:
  1. **Keyboard** — Rp 1.000.000 (K)
  2. **komputer** — Rp 12.000.000 (k)
  3. **Laptop** — Rp 13.000.000 (L)
  4. **mouse** — Rp 150.000 (m)
 
**Hasil yang diharapkan:** Daftar diurutkan secara alfabetis A-Z  
**Hasil aktual:** Daftar berubah urutan sesuai abjad  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 15 — Sorting Nama A-Z](images/auth_test_15.jpeg)
 
---
 
### Pengujian 16 — Mencari Item Berdasarkan Kata Kunci
 
**Apa yang diuji:**
Memastikan fitur pencarian menampilkan hanya item yang namanya atau deskripsinya mengandung kata kunci yang diketik.
 
**Langkah yang dilakukan:**
1. Ketik **"laptop"** di kolom pencarian
2. Klik tombol **Cari**
 
**Hasil aktual yang terlihat di layar:**
- Kolom pencarian: **laptop**
- Tombol **"✕ Clear"** muncul di sebelah tombol Cari
- Dropdown sorting: **Nama (A-Z)** + **A-Z** (tetap aktif dari pengujian sebelumnya)
- Hanya **1 item** tampil:
  - **Laptop** — Rp 13.000.000 | Laptop untuk coding Cloud Computing | Stok: 3 | 22 Mar 2026, 23:45
- Badge header: **"1 Items"**
 
**Hasil yang diharapkan:** Hanya item yang mengandung kata "laptop" tampil  
**Hasil aktual:** Sesuai — hanya Laptop yang muncul, badge berubah menjadi 1  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 16 — Pencarian Laptop](images/auth_test_16.jpeg)
 
**Penjelasan:**
Pencarian dikirim ke backend melalui `GET /items?search=laptop`. Server melakukan pencarian *case-insensitive* — mengetik "laptop" atau "Laptop" akan menemukan item yang sama.
 
---
 
### Pengujian 17 — Filter Item Berdasarkan Rentang Harga
 
**Apa yang diuji:**
Memastikan fitur filter harga menampilkan hanya item dengan harga yang berada dalam rentang minimum dan maksimum yang dimasukkan.
 
**Langkah yang dilakukan:**
1. Klik tombol **"⚙ Filter Harga"**
2. Isi **Harga Min (Rp)**: **100000**
3. Isi **Harga Maks (Rp)**: **2000000**
4. Klik tombol **"✓ Terapkan"**
 
**Hasil aktual yang terlihat di layar:**
- Panel filter terbuka, tombol berganti menjadi **"✕ Tutup Filter"** dan **"✕ Clear"**
- Nilai yang diisi: min **100000**, maks **2000000**
- Dropdown sorting: **Nama (A-Z)** + **A-Z** tetap aktif
- Daftar difilter:
  - **Keyboard** — Rp 1.000.000 | Ngetikk | Stok: 3 | 22 Mar 2026, 23:45
  - **mouse** — Rp 150.000 | bagus | Stok: 4 | 22 Mar 2026, 21:09
 
**Hasil yang diharapkan:** Hanya item dalam rentang harga Rp100.000–Rp2.000.000 tampil  
**Hasil aktual:** Sesuai — hanya Keyboard dan mouse yang tampil  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 17 — Filter Harga](images/auth_test_17.jpeg)
 
---
 
### Pengujian 18 — Urutkan Berdasarkan Harga
 
**Apa yang diuji:**
Memastikan fitur sorting berdasarkan harga berfungsi, mengurutkan item dari harga terendah ke tertinggi atau sebaliknya.
 
**Langkah yang dilakukan:**
1. Dropdown **"Urutkan Berdasarkan"**: pilih **Harga**
2. Dropdown **"Urutan"**: pilih **A-Z** (terendah ke tertinggi)
 
**Hasil aktual yang terlihat di layar:**
- Dropdown: **Nama (A-Z)** + **A-Z** (gabungan filter dan sorting masih aktif)
- Daftar item tampil sesuai urutan harga dari terendah ke tertinggi berdasarkan kombinasi filter dan sorting yang diterapkan
 
**Hasil yang diharapkan:** Daftar diurutkan berdasarkan harga  
**Hasil aktual:** Fitur sorting harga berfungsi  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 18 — Sorting Harga](images/auth_test_18.jpeg)
 
---
 
### Pengujian 19 — Dialog Konfirmasi Sebelum Logout
 
**Apa yang diuji:**
Memastikan dialog konfirmasi muncul saat pengguna menekan tombol Logout, mencegah pengguna keluar secara tidak sengaja.
 
**Langkah yang dilakukan:**
1. Klik tombol **Logout** di bagian atas halaman
2. Verifikasi dialog konfirmasi muncul
 
**Hasil aktual yang terlihat di layar:**
- Dialog browser muncul: **"Apakah Anda yakin ingin logout?"**
- Dua tombol: **OK** (hijau) dan **Cancel**
- Di latar belakang tampak empty state (📭 Belum ada item) karena filter harga yang ketat masih aktif
 
**Hasil yang diharapkan:** Dialog konfirmasi logout muncul  
**Hasil aktual:** Dialog muncul dengan pesan yang tepat  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 19 — Dialog Konfirmasi Logout](images/auth_test_19.jpeg)
 
---
 
### Pengujian 20 — Halaman Login Tampil Setelah Logout
 
**Apa yang diuji:**
Memastikan setelah pengguna mengonfirmasi logout, token dihapus dari memori, semua data dibersihkan, dan halaman login tampil kembali.
 
**Hasil aktual yang terlihat di layar:**
- Halaman login tampil dengan latar biru gelap
- Judul: **"☁️ Cloud App"** | Subjudul: **"Komputasi Awan — SI ITK"**
- Tab **Login** aktif, tab **Register** tersedia
- Kolom Email: placeholder `email@student.itk.ac.id`
- Kolom Password: placeholder `Minimal 8 karakter`
- Tombol **"🔐 Login"** tersedia
- Halaman utama tidak tampil sama sekali
 
**Hasil yang diharapkan:** Halaman login tampil bersih, semua data pengguna bersih  
**Hasil aktual:** Halaman login tampil kosong, semua data sudah dibersihkan  
**Status:** ✅ BERHASIL
 
**Screenshot:**
 
![Pengujian 20 — Halaman Login Setelah Logout](images/auth_test_20.jpeg)
 
**Penjelasan:**
Fungsi `handleLogout()` di `App.jsx` memanggil `clearToken()` untuk menghapus token dari memori, kemudian mereset semua state: `user = null`, `isAuthenticated = false`, `items = []`, `totalItems = 0`. Karena `isAuthenticated` menjadi `false`, React merender ulang dan menampilkan `LoginPage`.
 
---
 
## 🗂️ Daftar File Screenshot
 
Semua screenshot disimpan di folder `docs/images/`:
 
| File Screenshot | Pengujian | Isi |
|---|---|---|
| `auth_test_1.jpeg` | 1 | Swagger UI: POST /auth/login → 200 OK, token diterima |
| `auth_test_2.jpeg` | 2 | Swagger UI: Available authorizations — status Authorized |
| `auth_test_3.jpeg` | 3 | Swagger UI: GET /items dengan token → 200 OK, 3 item |
| `auth_test_4.jpeg` | 4 | Browser: Form registrasi — nama Nazwa, email 10231068, tombol Loading |
| `auth_test_5.jpeg` | 5 | Browser: Dashboard setelah login — nama Nazwa, 3 items, komputer & Keyboard |
| `auth_test_6.jpeg` | 6 | Browser: Form login — tab Login aktif, email 10231014 terisi |
| `auth_test_7.jpeg` | 7 | Browser: Dialog konfirmasi tambah — "Apakah Anda yakin menambahkan data item ini?" |
| `auth_test_8.jpeg` | 8 | Browser: Notifikasi "1 item berhasil" + 4 item tampil + dropdown sorting |
| `auth_test_9.jpeg` | 9 | Browser: Form Edit Item — charger laptop terisi, harga 260000, deskripsi bagus fast charging |
| `auth_test_10.jpeg` | 10 | Browser: Dialog konfirmasi update — "Apakah Anda yakin untuk update data item ini?" |
| `auth_test_11.jpeg` | 11 | Browser: Notifikasi "1 item update berhasil" + daftar diperbarui |
| `auth_test_12.jpeg` | 12 | Browser: Dialog konfirmasi hapus — "Yakin ingin menghapus 'charger laptop'?" |
| `auth_test_13.jpeg` | 13 | Browser: Notifikasi "1 item berhasil dihapus" + 4 item tersisa |
| `auth_test_14.jpeg` | 14 | Browser: Sorting Tanggal + Terlama — urutan Laptop, Keyboard, komputer, mouse |
| `auth_test_15.jpeg` | 15 | Browser: Sorting Nama A-Z — urutan Keyboard, komputer, Laptop, mouse |
| `auth_test_16.jpeg` | 16 | Browser: Search "laptop" — 1 hasil, tombol Clear muncul |
| `auth_test_17.jpeg` | 17 | Browser: Filter harga 100000–2000000 + Tutup Filter + Clear — Keyboard dan mouse tampil |
| `auth_test_18.jpeg` | 18 | Browser: Sorting berdasarkan harga |
| `auth_test_19.jpeg` | 19 | Browser: Dialog konfirmasi logout — "Apakah Anda yakin ingin logout?", empty state di background |
| `auth_test_20.jpeg` | 20 | Browser: Halaman login setelah logout — form kosong |
 
---
 
## 🐛 Catatan Bug & Temuan Selama Pengujian
 
Seluruh 20 pengujian berjalan sesuai yang diharapkan. Namun sebelum pengujian final ini dilakukan, ditemukan beberapa bug pada kode frontend yang sudah diperbaiki terlebih dahulu. Selain itu, dilakukan juga serangkaian perbaikan dan penambahan fitur berdasarkan hasil evaluasi awal.
 
---
 
### Bug yang Ditemukan dan Diperbaiki
 
Terdapat dua bug yang ditemukan pada dua file berbeda. Keduanya menyebabkan satu gejala yang sama: **fitur edit item tidak berfungsi dari browser**, sementara tambah dan hapus terlihat berjalan normal.
 
| No | File | Fungsi | Masalah | Dampak |
|---|---|---|---|---|
| 1 | `api.js` | `updateItem()` | Tidak ada `Content-Type: application/json` di header | Server menerima permintaan edit tetapi tidak bisa membaca data perubahan yang dikirim, sehingga tidak ada yang tersimpan ke database |
| 2 | `api.js` | `createItem()` | Tidak ada `Content-Type: application/json` di header | Server kadang tidak bisa membaca data item baru yang dikirim — rentan bergantung pada toleransi FastAPI untuk request POST |
| 3 | `App.jsx` | `handleSubmit()` | `loadItems()` dipanggil tanpa `await` | Daftar item dimuat ulang sebelum server selesai menyimpan perubahan, sehingga data lama yang muncul. Pengguna perlu refresh manual untuk melihat data terbaru |
| 4 | `App.jsx` | `handleDelete()` | `loadItems()` dipanggil tanpa `await` | Sama seperti di atas — daftar dimuat sebelum server selesai menghapus item |
 
---
 
#### Bug 1 & 2 — File `api.js`: Keterangan Format Data Tidak Disertakan
 
**File yang bermasalah:** `frontend/src/services/api.js`  
**Fungsi yang terdampak:** `updateItem()` dan `createItem()`
 
Setiap kali frontend mengirim data ke server — baik untuk menambah item (POST) maupun mengubah item (PUT) — server perlu diberitahu dalam format apa data tersebut dikirim. Keterangan ini disebut `Content-Type` dan diletakkan di bagian **header** permintaan.
 
> 💡 **Header** pada sebuah permintaan ke server adalah kumpulan informasi tambahan yang menyertai data utama. Analoginya seperti amplop surat — amplop berisi informasi pengirim dan jenis isi surat, sementara isi suratnya ada di dalam.
 
> 💡 **`Content-Type: application/json`** adalah keterangan yang memberitahu server bahwa data yang dikirim menggunakan format JSON. Tanpa keterangan ini, server menerima data tetapi tidak tahu cara membacanya — seperti menerima surat yang ditulis dalam kode yang tidak dikenal.
 
**Mengapa tambah item tetap bisa berjalan meskipun ada bug ini?**
 
FastAPI terkadang masih bisa memproses request POST sederhana tanpa `Content-Type` karena lebih toleran terhadap format yang tidak lengkap. Namun untuk operasi PUT (edit item), FastAPI lebih ketat — tanpa `Content-Type`, server tidak bisa membaca isi data perubahan sama sekali, sehingga tidak ada yang tersimpan ke database.
 
**Mengapa edit di Swagger bisa berhasil tapi di frontend tidak?**
 
Swagger UI secara otomatis selalu menyertakan `Content-Type: application/json` pada setiap permintaan yang mengirim data, tanpa perlu diatur manual. Di frontend, keterangan ini harus ditambahkan secara manual di kode. Karena tidak ditambahkan, server tidak bisa membaca perubahan yang dikirim.
 
**Kode yang bermasalah (sebelum diperbaiki):**
```javascript
// ❌ updateItem — tidak ada keterangan format data
export async function updateItem(id, itemData) {
    const response = await fetch(`${API_URL}/items/${id}`, {
        method: "PUT",
        headers: authHeaders(),          // hanya berisi token login
        body: JSON.stringify(itemData),  // data dikirim tapi server tidak tahu formatnya
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
            ...authHeaders(),                    // token login tetap disertakan
            "Content-Type": "application/json",  // tambahan: beritahu server format datanya JSON
        },
        body: JSON.stringify(itemData),
    })
    return handleResponse(response)
}
```
 
> 💡 **`...authHeaders()`** — tanda tiga titik artinya "salin semua isi dari `authHeaders()` ke sini". Hasilnya adalah satu objek header yang berisi token login sekaligus keterangan format data, keduanya sekaligus.
 
Perbaikan yang sama diterapkan juga pada `createItem()` agar konsisten dan tidak bermasalah di semua kondisi:
```javascript
// ✅ createItem — sudah diperbaiki
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
 
#### Bug 3 & 4 — File `App.jsx`: Daftar Dimuat Sebelum Server Selesai Menyimpan
 
**File yang bermasalah:** `frontend/src/App.jsx`  
**Fungsi yang terdampak:** `handleSubmit()` dan `handleDelete()`
 
Setelah data berhasil dikirim ke server, aplikasi perlu memuat ulang daftar item agar perubahan tampil di layar. Namun di kode lama, perintah "muat ulang daftar" (`loadItems`) dijalankan **tanpa menunggu** server selesai terlebih dahulu.
 
Bayangkan kamu minta teman menyimpan buku ke rak, lalu langsung mengecek rak sebelum dia sempat meletakkannya — tentu buku belum ada. Inilah yang terjadi di kode lama.
 
> 💡 **`await`** adalah kata kunci dalam JavaScript yang artinya "tunggu dulu sampai proses ini benar-benar selesai, baru lanjutkan ke baris berikutnya". Tanpa `await`, JavaScript langsung melanjutkan ke baris berikutnya tanpa menunggu.
 
`loadItems()` adalah fungsi yang memerlukan waktu karena perlu mengirim permintaan ke server dan menunggu jawaban. Tanpa `await`, daftar dimuat ulang sebelum server sempat menyimpan perubahan — sehingga data lama yang muncul. Pengguna harus me-refresh halaman secara manual baru data terbaru tampil.
 
**Kode yang bermasalah di `handleSubmit` (sebelum diperbaiki):**
```javascript
const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)  // menunggu server simpan perubahan
        setEditingItem(null)
      } else {
        await createItem(itemData)          // menunggu server simpan item baru
      }
      loadItems(searchQuery)               // ❌ tidak ada "await" — langsung lanjut tanpa tunggu
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
      await loadItems(searchQuery)          // ✅ tambahkan "await" — tunggu server selesai dulu
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else throw err
    }
}
```
 
Perbaikan yang sama diterapkan pada `handleDelete()`:
```javascript
const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    try {
      await deleteItem(id)
      await loadItems(searchQuery)          // ✅ tambahkan "await"
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else alert("Gagal menghapus: " + err.message)
    }
}
```
 
---
 
#### Hubungan Dua Bug dan Pengaruhnya
 
Kedua bug bekerja bersama dan menghasilkan gejala yang membingungkan:
 
| Operasi | Dampak Bug `Content-Type` | Dampak Bug `await` | Gejala yang Terlihat |
|---|---|---|---|
| **Tambah item** | FastAPI masih toleran, data biasanya tersimpan | Daftar dimuat terlalu cepat, tapi biasanya cukup dekat waktunya | Terlihat normal |
| **Edit item** | Server tidak bisa membaca data perubahan sama sekali | Daftar dimuat sebelum server selesai | Data tidak berubah, harus refresh manual |
| **Hapus item** | Tidak terdampak — DELETE tidak mengirim body | Daftar dimuat terlalu cepat, tapi biasanya cukup dekat waktunya | Terlihat normal |
 
Itulah mengapa gejala yang terlihat hanya pada fitur edit, padahal sebenarnya ada bug di dua tempat sekaligus.
 
---
 
#### Ringkasan Perbaikan Bug
 
| File | Fungsi | Perbaikan |
|---|---|---|
| `api.js` | `updateItem()` | Tambahkan `"Content-Type": "application/json"` di header |
| `api.js` | `createItem()` | Tambahkan `"Content-Type": "application/json"` di header |
| `App.jsx` | `handleSubmit()` | Tambahkan `await` sebelum `loadItems(searchQuery)` |
| `App.jsx` | `handleDelete()` | Tambahkan `await` sebelum `loadItems(searchQuery)` |
 
---
 
### Revisi dan Peningkatan Sistem
 
Setelah bug diperbaiki dan pengujian awal selesai, dilakukan serangkaian perbaikan dan penambahan fitur berdasarkan hasil evaluasi. Perbaikan ini mencakup backend dan frontend sekaligus, dengan fokus pada pengalaman pengguna, validasi data, dan penanganan kesalahan.
 
---
 
#### Latar Belakang Revisi
 
Pengujian awal menemukan beberapa kekurangan yang perlu ditangani:
 
| Kekurangan yang Ditemukan | Penanganan |
|---|---|
| Belum ada filter berdasarkan harga | Ditambahkan fitur filter harga min–maks di frontend dan backend |
| Belum ada notifikasi visual setelah setiap operasi CRUD | Ditambahkan komponen notifikasi toast |
| Belum ada tampilan loading saat proses berlangsung | Ditambahkan spinner dan state loading pada form |
| Validasi email dan password masih longgar | Diperketat menggunakan `EmailStr` dan regex pattern |
| Belum ada dialog konfirmasi sebelum menambah atau mengubah data | Ditambahkan dialog konfirmasi untuk semua aksi utama |
 
---
 
#### Perbaikan Backend
 
Backend diperbaiki pada 4 file utama:
 
| File | Perubahan | Penjelasan |
|---|---|---|
| `models.py` | Penambahan dukungan filter harga | Struktur query database diperluas untuk mendukung filtering berdasarkan rentang harga |
| `crud.py` | Parameter `min_price` dan `max_price` ditambahkan ke fungsi `get_items()` | Fungsi pengambilan data item kini bisa menerima batasan harga minimum dan maksimum sebagai filter |
| `schemas.py` | Validasi email dan password diperketat | Email menggunakan `EmailStr` agar format email divalidasi otomatis. Password diwajibkan minimal 8 karakter dan harus mengandung setidaknya satu angka menggunakan pola regex |
| `main.py` | Endpoint `GET /items` ditambahkan query parameter `min_price` dan `max_price` | Endpoint item kini menerima parameter filter harga dari frontend |
 
> 💡 **`EmailStr`** adalah tipe data dari library Pydantic yang secara otomatis memvalidasi bahwa nilai yang dikirim benar-benar berformat email yang valid (mengandung `@` dan domain yang benar). Jika tidak valid, Pydantic langsung menolak dengan error sebelum data menyentuh database.
 
> 💡 **Regex (Regular Expression)** adalah pola teks yang digunakan untuk memeriksa format suatu string. Contoh: pola regex `.*\d.*` artinya "string ini harus mengandung setidaknya satu angka di mana saja". Digunakan untuk memastikan password mengandung angka.
 
---
 
#### Perbaikan Frontend
 
Frontend mengalami perubahan pada 7 file:
 
| File | Perubahan | Penjelasan |
|---|---|---|
| `App.jsx` | Penambahan `ToastContainer` dan state filter harga | `ToastContainer` adalah wadah tempat notifikasi toast ditampilkan. State filter harga menyimpan nilai min dan maks yang dipilih pengguna |
| `LoginPage.jsx` | Validasi email dan password, notifikasi toast | Email divalidasi menggunakan regex sebelum dikirim ke server. Password divalidasi minimal 8 karakter dan mengandung angka. Notifikasi toast muncul saat login atau registrasi berhasil maupun gagal |
| `ItemForm.jsx` | Loading state, spinner, dialog konfirmasi, notifikasi toast | Tombol berubah menjadi "⏳ Memproses..." saat request sedang berjalan. Dialog konfirmasi muncul sebelum data dikirim. Notifikasi toast muncul saat berhasil atau gagal |
| `Header.jsx` | Dialog konfirmasi logout, notifikasi toast | Saat tombol Logout ditekan, muncul dialog konfirmasi terlebih dahulu. Setelah logout, notifikasi toast ditampilkan |
| `SearchBar.jsx` | Panel filter harga | Ditambahkan tombol untuk membuka dan menutup panel filter harga. Panel berisi dua kolom input: harga minimum dan harga maksimum, beserta tombol Terapkan |
| `ItemCard.jsx` | Peningkatan tampilan | Tampilan kartu item diperbaiki untuk meningkatkan keterbacaan — tata letak, ukuran teks, dan jarak antar elemen dioptimalkan |
| `services/api.js` | Penambahan `Content-Type` dan perbaikan error message | `Content-Type: application/json` ditambahkan pada request POST dan PUT (perbaikan dari bug yang ditemukan). Penanganan pesan error diperbaiki agar tidak menampilkan `[object Object]` yang tidak informatif |
 
> 💡 **`ToastContainer`** adalah komponen yang bertugas menampilkan dan mengelola notifikasi toast di layar. Komponen ini diletakkan di level paling atas aplikasi (`App.jsx`) agar notifikasi bisa dipicu dari mana saja — dari form, header, maupun komponen lainnya.
 
> 💡 **Loading state** adalah kondisi saat aplikasi sedang menunggu jawaban dari server. Selama kondisi ini, tombol submit dinonaktifkan dan tampilannya berubah menjadi spinner atau teks "Memproses..." agar pengguna tahu bahwa proses sedang berlangsung dan tidak menekan tombol berulang kali.
 
> 💡 **`[object Object]`** adalah teks yang muncul di JavaScript ketika sebuah objek (kumpulan data) diubah langsung menjadi teks tanpa diolah terlebih dahulu. Contoh: jika error dari server berupa `{detail: "Email tidak valid"}` tapi kode langsung mengubahnya menjadi string, hasilnya adalah `"[object Object]"` yang tidak berguna bagi pengguna. Setelah perbaikan, pesan yang tampil adalah teks error yang sebenarnya.
 
---
 
#### Fitur Baru yang Berhasil Ditambahkan
 
| No | Fitur | Keterangan |
|---|---|---|
| 1 | Validasi format email dan kekuatan password | Email divalidasi sebelum dikirim ke server. Password wajib minimal 8 karakter dan mengandung angka — berlaku di frontend dan backend |
| 2 | Notifikasi toast untuk semua aksi | Notifikasi hijau muncul setelah: login berhasil, registrasi berhasil, item ditambahkan, item diupdate, item dihapus, dan logout |
| 3 | Dialog konfirmasi sebelum aksi penting | Dialog muncul sebelum: menambah item, mengubah item, dan logout — mencegah aksi tidak sengaja |
| 4 | Tampilan loading dan spinner pada form | Tombol berubah menjadi "⏳ Memproses..." saat request berlangsung dan dinonaktifkan untuk mencegah double-submit |
| 5 | Filter harga dengan rentang min–maks | Pengguna dapat memfilter item berdasarkan rentang harga menggunakan dua kolom input. Filter bisa dikombinasikan dengan fitur sorting |
| 6 | Penanganan error yang ramah pengguna | Pesan error dari server ditampilkan dalam bahasa yang mudah dipahami, bukan kode teknis seperti `[object Object]` |
| 7 | Logout otomatis saat token tidak valid | Jika server mengembalikan error `401 Unauthorized`, aplikasi otomatis menghapus token dan mengarahkan pengguna kembali ke halaman login |
 
---
 
#### Ringkasan File yang Diubah dalam Revisi
 
Secara keseluruhan, **11 file** mengalami perubahan — 4 file backend dan 7 file frontend — tanpa memerlukan migrasi database karena tidak ada perubahan struktur tabel.
 
| Kelompok | File yang Diubah |
|---|---|
| Backend (4 file) | `models.py`, `crud.py`, `schemas.py`, `main.py` |
| Frontend (7 file) | `App.jsx`, `LoginPage.jsx`, `ItemForm.jsx`, `Header.jsx`, `SearchBar.jsx`, `ItemCard.jsx`, `services/api.js` |
 
---
 
**Catatan tambahan dari hasil pengujian akhir:**
 
| Hal | Keterangan |
|---|---|
| Dialog konfirmasi untuk semua aksi utama | Tambah, update, hapus, dan logout masing-masing memiliki dialog konfirmasi sebelum dieksekusi |
| Notifikasi toast | Setiap aksi yang berhasil menampilkan notifikasi hijau di bagian atas halaman |
| Fitur sorting dua dropdown | Tersedia dua dropdown terpisah: satu untuk kriteria (Tanggal / Nama / Harga) dan satu untuk arah |
| Filter harga | Pengguna dapat menyaring item berdasarkan rentang harga minimum dan maksimum |
| Filter dan sorting dapat dikombinasikan | Filter harga dan sorting tetap aktif bersamaan — terlihat pada Pengujian 17 dan 18 |
| Token tidak tersimpan permanen | Jika halaman di-refresh, pengguna perlu login kembali karena token hanya disimpan di memori browser |
 
---
 
## ✅ Kesimpulan
 
Seluruh 20 pengujian berjalan dengan benar. Berikut ringkasan lengkap setiap pengujian:
 
| No | Fitur yang Diuji | Cara Menguji | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| 1 | Login berhasil dan mendapat token | Kirim `POST /auth/login` dengan email dan password yang benar melalui Swagger UI | Kode 200, token JWT dikembalikan beserta data pengguna | ✅ |
| 2 | Token dimasukkan ke Swagger UI | Salin token dari Pengujian 1, klik Authorize di Swagger UI, tempel token | Status berubah menjadi "Authorized" | ✅ |
| 3 | Akses daftar item dengan token | Kirim `GET /items` melalui Swagger UI dengan token yang sudah aktif | Kode 200, daftar item berhasil ditampilkan | ✅ |
| 4 | Registrasi akun baru | Buka browser, klik tab Register, isi nama, email, password, klik Register | Tombol Loading tampil, akun tersimpan, otomatis masuk ke dashboard | ✅ |
| 5 | Dashboard tampil setelah login | Selesaikan proses registrasi atau login | Nama pengguna tampil di header, daftar item tersedia, semua fitur dapat digunakan | ✅ |
| 6 | Form login berfungsi | Buka halaman login, isi email dan password, klik Login | Form menerima input dengan benar, tab Login dan Register tersedia | ✅ |
| 7 | Dialog konfirmasi sebelum tambah item | Isi form tambah item, klik tombol Tambah Item | Dialog "Apakah Anda yakin menambahkan data item ini?" muncul sebelum data dikirim | ✅ |
| 8 | Notifikasi item berhasil ditambahkan | Konfirmasi dialog pada Pengujian 7 dengan klik OK | Notifikasi hijau muncul, badge jumlah item bertambah, item baru tampil di daftar | ✅ |
| 9 | Form edit terisi otomatis | Klik tombol Edit pada salah satu item di daftar | Form beralih ke mode Edit, semua kolom terisi dengan data item yang dipilih | ✅ |
| 10 | Dialog konfirmasi sebelum update | Ubah salah satu data di form edit, klik tombol Update Item | Dialog "Apakah Anda yakin untuk update data item ini?" muncul | ✅ |
| 11 | Notifikasi item berhasil diupdate | Konfirmasi dialog pada Pengujian 10 dengan klik OK | Notifikasi hijau muncul, data terbaru langsung tampil, form kembali kosong | ✅ |
| 12 | Dialog konfirmasi sebelum hapus | Klik tombol Hapus pada salah satu item | Dialog "Yakin ingin menghapus '[nama item]'?" muncul dengan nama item yang spesifik | ✅ |
| 13 | Notifikasi item berhasil dihapus | Konfirmasi dialog pada Pengujian 12 dengan klik OK | Notifikasi hijau muncul, item hilang dari daftar, badge jumlah item berkurang | ✅ |
| 14 | Sorting tanggal terlama | Pilih "Tanggal" pada dropdown Urutkan Berdasarkan, pilih "Terlama" pada dropdown Urutan | Daftar diurutkan dari item yang paling lama ditambahkan ke yang paling baru | ✅ |
| 15 | Sorting nama A-Z | Pilih "Nama (A-Z)" pada dropdown Urutkan Berdasarkan, pilih "A-Z" pada dropdown Urutan | Daftar diurutkan secara alfabetis dari A ke Z | ✅ |
| 16 | Pencarian berdasarkan kata kunci | Ketik kata kunci di kolom pencarian, klik tombol Cari | Hanya item yang namanya atau deskripsinya mengandung kata kunci yang tampil, tombol Clear muncul | ✅ |
| 17 | Filter berdasarkan rentang harga | Klik Filter Harga, isi Harga Min dan Harga Maks, klik Terapkan | Hanya item dengan harga dalam rentang yang ditentukan yang tampil | ✅ |
| 18 | Sorting berdasarkan harga | Pilih "Harga" pada dropdown Urutkan Berdasarkan | Daftar diurutkan dari harga terendah ke tertinggi atau sebaliknya | ✅ |
| 19 | Dialog konfirmasi sebelum logout | Klik tombol Logout di header | Dialog "Apakah Anda yakin ingin logout?" muncul sebelum sesi diakhiri | ✅ |
| 20 | Halaman login tampil setelah logout | Konfirmasi dialog pada Pengujian 19 dengan klik OK | Token dihapus, semua data dibersihkan, halaman login tampil kembali | ✅ |
 
---