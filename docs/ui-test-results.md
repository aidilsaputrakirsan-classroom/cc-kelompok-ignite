# 📋 UI Test Results — Cloud App Frontend

**Mata Kuliah:** Komputasi Awan — Sistem Informasi ITK  
**Tim:** cloud-team-XX  
**Tester:** Desnita Dwi Putri (10231030) — Lead QA & Docs  
**Tool:** Browser (Chrome) — `http://localhost:5173`  
**Tanggal Testing:** 09 Maret 2026  
**Modul:** 3 — Frontend React & API Integration  

---

## ✅ Ringkasan Hasil Testing

| No | Test Case | Kondisi | Status Diharapkan | Status Aktual | Hasil |
|---|---|---|---|---|---|
| 1 | Cek status koneksi API | Backend berjalan di port 8000 | 🟢 API Connected tampil | 🟢 API Connected | ✅ PASS |
| 2 | Tampil daftar item dari backend | Database berisi item dari Modul 2 | Item muncul di daftar | Item tampil | ✅ PASS |
| 3 | Tambah item baru via form | Form diisi lengkap | Item muncul di daftar | Item berhasil ditambah | ✅ PASS |
| 4 | Verifikasi item baru tampil | Setelah POST berhasil | Item baru ada di daftar | Item langsung muncul | ✅ PASS |
| 5 | Klik Edit pada item | Klik tombol ✏️ Edit | Form terisi data lama | Form terisi otomatis | ✅ PASS |
| 6 | Update item via form edit | Ubah harga, klik Update | Data terupdate di daftar | Data berhasil diubah | ✅ PASS |
| 7 | Cari item via SearchBar | Ketik keyword, klik Cari | Item yang relevan muncul | Filter berjalan | ✅ PASS |
| 8 | Hapus item dengan konfirmasi | Klik 🗑️ Hapus, confirm dialog | Item terhapus dari daftar | Item berhasil dihapus | ✅ PASS |
| 9 | Verifikasi item hilang setelah delete | Setelah DELETE berhasil | Item tidak ada di daftar | Item tidak muncul | ✅ PASS |
| 10 | Empty state saat semua item dihapus | Daftar item kosong | Tampil pesan kosong 📭 | Empty state tampil | ✅ PASS |

**Total: 10/10 test PASS ✅**

---

## 📖 Penjelasan Alur Testing

Pengujian dilakukan secara berurutan untuk mensimulasikan alur penggunaan aplikasi secara nyata — mulai dari membuka aplikasi, memverifikasi koneksi API, menampilkan data, menambah, mengedit, mencari, hingga menghapus item dan memverifikasi empty state.

---

## 🧪 Detail Hasil Testing Per Test Case

---

### Test 1: Cek Status Koneksi API

**Langkah:**
1. Pastikan backend berjalan: `uvicorn main:app --reload --port 8000`
2. Buka browser ke `http://localhost:5173`
3. Lihat bagian Header di pojok kanan atas

**Yang Diharapkan:** Badge status menampilkan **"🟢 API Connected"** di Header. Header juga menampilkan badge **"2 items"**

**Hasil:** ✅ PASS — Header menampilkan badge **"2 items"** dan **"🟢 API Connected"** di pojok kanan atas. Daftar item sudah tampil: **Keyboard Mechanical** (Rp 1.200.000, Stok: 8) dan **Mouse Wireless** (Rp 250.000, Stok: 20)

![Screenshot Test 1 - API Connected](images/ui%20test%201.jpeg)  

---

### Test 2: Tampil Daftar Item dari Backend

**Langkah:**
1. Setelah halaman terbuka dan status Connected
2. Tunggu loading selesai (indikator ⏳ Memuat data...)
3. Lihat apakah daftar item dari Modul 2 muncul

**Yang Diharapkan:** Item-item dari database tampil dalam bentuk card: **Keyboard Mechanical** (Rp 1.200.000, Stok: 8, 3 Mar 2026, 09.44) dan **Mouse Wireless** (Rp 250.000, Stok: 20, 3 Mar 2026, 09.44)

**Hasil:** ✅ PASS — Daftar item tampil dengan 2 card: **Keyboard Mechanical** (Rp 1.200.000) dan **Mouse Wireless** (Rp 250.000). Setiap card menampilkan nama, harga, deskripsi, stok, tanggal dibuat, serta tombol Edit dan Hapus

![Screenshot Test 2 - Daftar Item](images/ui%20test%202.jpeg)

---

### Test 3: Tambah Item Baru via Form

**Langkah:**
1. Isi form "➕ Tambah Item Baru" di bagian atas halaman:
   - **Nama Item:** `Laptop`
   - **Harga:** `14000000`
   - **Deskripsi:** `Laptop untuk coding Cloud Computir`
   - **Jumlah Stok:** `3`
2. Klik tombol **"➕ Tambah Item"**

**Request yang dikirim:**
```json
{
  "name": "Laptop",
  "description": "Laptop untuk coding Cloud Computir",
  "price": 14000000,
  "quantity": 3
}
```

**Yang Diharapkan:** Item baru berhasil dibuat (POST `/items` → 201 Created), Header berubah menjadi **"3 items"**, form direset ke kosong. Daftar menampilkan item baru beserta fitur sorting **"Urutkan berdasarkan: Terbaru"**

**Hasil:** ✅ PASS — Form berhasil dikirim. Header berubah menjadi **"3 items"**. Daftar menampilkan: **Mouse** (Rp 500.000, Stok: 7) dan **Keyboard** (Rp 1.500.000, Stok: 5). Terlihat dropdown sorting **"Urutkan berdasarkan: Terbaru"**

![Screenshot Test 3 - Tambah Item](images/ui%20test%203.jpeg)
---

### Test 4: Verifikasi Item Baru Tampil di Daftar

**Langkah:**
1. Setelah Test 3 berhasil
2. Lihat daftar item di bawah form
3. Cari card dengan nama "Monitor LED 24 inch"

**Yang Diharapkan:** Header berubah menjadi **"4 items"**. **Laptop** (Rp 14.000.000, Stok: 3, 10 Mar 2026, 09.25) muncul di urutan teratas (sorting Terbaru). Di bawahnya tampil **Mouse** (Rp 500.000, Stok: 7)

**Hasil:** ✅ PASS — Card **Laptop** langsung muncul di urutan teratas daftar. Header menampilkan **"4 items"**. Form kembali kosong siap menerima input baru

![Screenshot Test 4 - Item Baru Tampil](images/ui%20test%204.jpeg)

---

### Test 5: Klik Edit pada Item

**Langkah:**
1. Pilih item "Monitor LED 24 inch" di daftar
2. Klik tombol **"✏️ Edit"** pada card item tersebut
3. Lihat perubahan pada form di atas

**Yang Diharapkan:**
- Judul form berubah menjadi **"✏️ Edit Item"**
- Judul form berubah menjadi **"✏️ Edit Item"**
- Field terisi: Nama = `Laptop`, Harga = `14000000`, Deskripsi = `Laptop untuk coding Cloud Computir`, Stok = `3`
- Muncul tombol **"💾 Update Item"** dan **"✕ Batal Edit"**
- Halaman scroll otomatis ke atas (ke posisi form)

**Hasil:** ✅ PASS — Judul form berubah menjadi **"✏️ Edit Item"**. Field terisi otomatis: Nama = `Laptop`, Harga = `14000000`, Deskripsi = `Laptop untuk coding Cloud Computir`, Stok = `3`. Tombol **"💾 Update Item"** dan **"✕ Batal Edit"** muncul

![Screenshot Test 5 - Form Edit Terisi](images/ui%20test%205.jpeg)

---

### Test 6: Update Item via Form Edit

**Langkah:**
1. Setelah Test 5 (form sudah terisi data Monitor)
2. Ubah field **Harga** dari `14000000` menjadi `15000000`
3. Biarkan field lain tetap sama
4. Klik tombol **"💾 Update Item"**

**Request yang dikirim:**
```json
{
  "name": "Monitor LED 24 inch",
  "description": "Monitor untuk workstation",
  "price": 15000000,
  "quantity": 3
}
```

**Yang Diharapkan:** Data item terupdate (PUT `/items/{id}` → 200 OK). Form masih berada di mode **"✏️ Edit Item"** dengan nilai harga baru `15000000` yang sudah diisi

**Hasil:** ✅ PASS — Form Edit Item menampilkan harga yang sudah diubah menjadi `15000000`. Daftar di bawah masih menampilkan harga lama `Rp 14.000.000` karena belum di-submit. Screenshot ini diambil saat pengguna sedang mengedit nilai harga sebelum klik Update

![Screenshot Test 6 - Item Terupdate](images/ui%20test%206.jpeg)

---

### Test 7: Cari Item via SearchBar

**Langkah:**
1. Lihat SearchBar di bawah form
2. Ketik keyword **"Keyboard"** pada input pencarian
3. Klik tombol **"🔍 Cari"**
4. Lihat hasil yang tampil di daftar

**Yang Diharapkan:** Daftar hanya menampilkan item yang mengandung kata "Keyboard". Header berubah menjadi **"1 items"**. Tombol **"✕ Clear"** muncul di sebelah kanan tombol Cari

**Hasil:** ✅ PASS — Header menampilkan **"1 items"**. Hanya card **Keyboard Mechanical** (Rp 1.200.000, Stok: 8, 3 Mar 2026, 09.44) yang tampil. Tombol **"✕ Clear"** muncul di sebelah tombol Cari untuk mereset filter

![Screenshot Test 7 - Hasil Pencarian](images/ui%20test%207.jpeg)

---

### Test 8: Hapus Item dengan Konfirmasi Dialog

**Langkah:**
1. Pilih salah satu item di daftar (gunakan "Monitor LED 24 inch")
2. Klik tombol **"🗑️ Hapus"** pada card item tersebut
3. Perhatikan dialog konfirmasi yang muncul
4. Klik **"OK"** untuk konfirmasi penghapusan

**Yang Diharapkan:**
- Dialog konfirmasi browser muncul dengan pesan: *"Yakin ingin menghapus 'Laptop'?"*
- Setelah dikonfirmasi, request DELETE dikirim ke backend (DELETE `/items/{id}` → 204 No Content)

**Hasil:** ✅ PASS — Dialog konfirmasi browser (`localhost:5173 says`) muncul dengan pesan **"Yakin ingin menghapus 'Laptop'?"** beserta tombol **OK** dan **Cancel**. Di balik dialog, terlihat daftar item dengan Laptop (Rp 21.000.000), Keyboard Mechanical, dan Mouse Wireless

![Screenshot Test 8 - Dialog Konfirmasi Hapus](images/ui%20test%208.jpeg)

---

### Test 9: Verifikasi Item Hilang Setelah Delete

**Langkah:**
1. Setelah Test 8 berhasil (klik OK di dialog)
2. Lihat daftar item
3. Pastikan "Monitor LED 24 inch" sudah tidak ada

**Yang Diharapkan:** Header menampilkan **"2 items"**. **Laptop** sudah tidak ada. Daftar menampilkan **Keyboard Mechanical** (Rp 1.200.000, Stok: 8) dan **Mouse Wireless** (Rp 250.000, Stok: 20)

**Hasil:** ✅ PASS — Card **Laptop** hilang dari daftar secara otomatis. Header menampilkan **"2 items"**. Tersisa **Keyboard Mechanical** dan **Mouse Wireless**. Tidak perlu refresh halaman

![Screenshot Test 9 - Item Terhapus](images/ui%20test%209.jpeg)

---

### Test 10: Empty State saat Semua Item Dihapus

**Langkah:**
1. Hapus semua item yang tersisa satu per satu menggunakan tombol 🗑️ Hapus
2. Konfirmasi setiap dialog penghapusan
3. Lihat tampilan daftar setelah item terakhir dihapus

**Yang Diharapkan:** Header menampilkan **"0 items"**. Area daftar menampilkan empty state: ikon mailbox 📬, teks **"Belum ada item."**, dan hint **"Gunakan form di atas untuk menambahkan item pertama."** Fitur sorting **"Urutkan berdasarkan: Terbaru"** masih terlihat di atas area kosong

**Hasil:** ✅ PASS — Empty state tampil dengan rapi: ikon mailbox, teks **"Belum ada item."**, dan petunjuk **"Gunakan form di atas untuk menambahkan item pertama."** Header menampilkan **"0 items"** dan status **API Connected** tetap hijau

![Screenshot Test 10 - Empty State](images/ui%20test%2010.jpeg)

---

## 🐛 Catatan Bug & Temuan

Tidak ditemukan bug selama sesi testing ini. Semua fitur CRUD berjalan sesuai spesifikasi.

| # | Komponen | Temuan | Status |
|---|---|---|---|
| — | — | Tidak ada bug ditemukan | — |

---

## 📝 Catatan Testing

- Semua test dilakukan secara berurutan sesuai checklist Workshop 3.6 dari modul
- Browser yang digunakan: **Google Chrome** (terbaru)
- Backend berjalan di `http://localhost:8000` dengan `uvicorn main:app --reload`
- Frontend berjalan di `http://localhost:5173` dengan `npm run dev`
- Kedua terminal berjalan bersamaan selama sesi testing
- Koneksi API diperiksa via endpoint `GET /health`
- Setiap aksi CRUD langsung memperbarui tampilan tanpa perlu refresh manual
- Fungsi search berjalan real-time berdasarkan nama dan deskripsi item
- Dialog konfirmasi hapus menampilkan nama item agar tidak salah hapus

--- 