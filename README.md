# 🛒 RAZ'Q App — UMKM E-Commerce Platform

## 📌 Deskripsi Proyek

RAZ'Q App (E-Commerce UMKM RAZ'Q) adalah platform e-commerce berbasis website yang dirancang untuk mendigitalisasikan proses bisnis UMKM RAZ'Q Balikpapan. UMKM ini memproduksi makanan khas Balikpapan seperti Amplang, keripik pisang, abon, dan camilan lainnya. Aplikasi ini mengatasi kendala pemasaran dan visibilitas usaha, serta mempermudah pengelolaan transaksi dan stok produk yang sebelumnya menghadapi tantangan kompleksitas pada aplikasi pihak ketiga.

## 📖 Daftar Isi
- [🛒 RAZ'Q App — UMKM E-Commerce Platform](#-razq-app--umkm-e-commerce-platform)
  - [📌 Deskripsi Proyek](#-deskripsi-proyek)
  - [📖 Daftar Isi](#-daftar-isi)
  - [Fitur Utama](#fitur-utama)
    - [Manajemen Produk \& Katalog](#manajemen-produk--katalog)
    - [Manajemen Pesanan \& Pembayaran](#manajemen-pesanan--pembayaran)
    - [Manajemen Admin](#manajemen-admin)
    - [Fitur Sistem](#fitur-sistem)
    - [Fitur Berdasarkan Role](#fitur-berdasarkan-role)
  - [👥 Tim](#-tim)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🏗️ Architecture](#️-architecture)
  - [🚀 Getting Started](#-getting-started)
    - [Prasyarat](#prasyarat)
    - [Backend](#backend)
    - [Frontend](#frontend)
  - [📅 Roadmap](#-roadmap)
---
## Fitur Utama

### Manajemen Produk & Katalog  
- ✅ **Katalog Penjualan** – Menampilkan daftar produk secara lengkap dengan gambar, harga, dan spesifikasi detail  
- ✅ **Informasi Produk Spesifik** – Menyajikan informasi produk sesuai jenis dan kategori untuk memudahkan pencarian  
- ✅ **Fitur Home & About** – Menyediakan informasi umum, visi misi, sejarah, dan profil identitas UMKM RAZ'Q   

### Manajemen Pesanan & Pembayaran 
- ✅ **Keranjang Belanja (Cart)** – Membantu pelanggan mengelola daftar barang sebelum melanjutkan ke proses pembayaran  
- ✅ **Sistem Pemesanan Online** – Pelanggan dapat melakukan pemesanan produk langsung melalui website setelah login  
- ✅ **Multi-Metode Pembayaran** – Mendukung pembayaran tunai di outlet atau digital melalui QRIS/Transfer dengan fitur unggah bukti verifikasi

### Manajemen Admin  
- ✅ **Dashboard Admin** – Panel utama bagi pengelola untuk manajemen produk, stok, dan pesanan  
- ✅ **Manajemen Stok (Inventory)** – Admin dapat mengupdate jumlah, memantau ketersediaan secara real-time, hingga menghapus produk 
-  ✅ **Verifikasi Pembayaran** – Fasilitas bagi admin untuk memeriksa bukti pembayaran digital dan mengubah status pembelian pelanggan

### Fitur Sistem  
- ✅ **Authentication** – Login & registrasi untuk user dan admin  

### Fitur Berdasarkan Role  
**Pelanggan**
- ✅ Melihat profil, kontak, dan katalog produk UMKM tanpa login wajib
- ✅ Melakukan registrasi akun dan login ke sistem
- ✅ Menambahkan barang ke keranjang dan melakukan pemesanan produk
- ✅ Melakukan pembayaran via QRIS dan mengunggah bukti transaksi
- ✅ Menambahkan testimoni atau ulasan produk

**Admin**
- ✅ Login ke Dashboard admin dengan hak akses kontrol penuh
- ✅ Mengelola data akun admin dan melihat data pelanggan
- ✅ Menambah, mengubah, dan menghapus produk di katalog
- ✅ Memantau stok barang dan mendapatkan notifikasi jika stok hampir habis
- ✅ Memverifikasi pembayaran dan mengubah status pembelian pelanggan

---

## 👥 Tim

| Nama | NIM | Peran |
|------|-----|-------|
| Andini Permata Dewanti | 102310314 | Lead Backend |
| Putri Rahmawati | 10231074 | Lead Frontend |
| Krishandy Dhanysa Pratama | 10231050 | Lead DevOps |
| Desnita Dwi Putri | 10231030 | Lead QA & Docs |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi | Penjelasan |
|------------|----------|------------|
| **FastAPI** | Backend REST API | Framework Python berbasis asynchronous yang digunakan untuk membangun REST API dengan performa tinggi dan dokumentasi otomatis (Swagger). |
| **React** | Frontend SPA | Library JavaScript untuk membangun Single Page Application (SPA) yang responsif dan modular menggunakan component-based architecture. |
| **PostgreSQL** | Database | Sistem manajemen basis data relasional (RDBMS) yang digunakan untuk menyimpan data user, produk, pesanan, dan transaksi secara terstruktur. |
| **Docker** | Containerization | Digunakan untuk mengemas aplikasi beserta dependensinya ke dalam container agar environment konsisten di berbagai sistem. |
| **GitHub Actions** | CI/CD | Digunakan untuk otomatisasi proses build, testing, dan deployment setiap terjadi perubahan pada repository. |
| **Railway / Render** | Cloud Deployment | Platform cloud yang digunakan untuk hosting backend dan database agar aplikasi dapat diakses secara online. |

---

## 🏗️ Architecture

```text
[React Frontend] <--HTTP--> [FastAPI Backend] <--SQL--> [PostgreSQL]
``` 
*(Diagram ini akan berkembang setiap minggu)*

## 🚀 Getting Started

### Prasyarat
- **Python 3.10+**: Diperlukan untuk menjalankan modul FastAPI dan asynchronous logic.
- **Node.js 18+**: Diperlukan untuk kompilasi aset React dan manajemen package (NPM).
- **Git**: Untuk manajemen versi dan kolaborasi antar anggota tim.

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Backend akan berjalan di:

http://localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di:

http://localhost:5173

## 📅 Roadmap

| Minggu | Target | Status |
|--------|--------|--------|
| 1 | Setup & Hello World | ✅ |
| 2 | REST API + Database | ⬜ |
| 3 | React Frontend | ⬜ |
| 4 | Full-Stack Integration | ⬜ |
| 5-7 | Docker & Compose | ⬜ |
| 8 | UTS Demo | ⬜ |
| 9-11 | CI/CD Pipeline | ⬜ |
| 12-14 | Microservices | ⬜ |
| 15-16 | Final & UAS | ⬜ |