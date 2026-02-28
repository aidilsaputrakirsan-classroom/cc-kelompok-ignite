#  RAZ'Q App - Ignite 

## 📌 Deskripsi Proyek

RAZ'Q App (E-Commerce UMKM RAZ'Q) adalah platform e-commerce berbasis website yang dirancang untuk mendigitalisasikan proses bisnis UMKM RAZ'Q Balikpapan. UMKM ini memproduksi makanan khas Balikpapan seperti Amplang, keripik pisang, abon, dan camilan lainnya. Aplikasi ini mengatasi kendala pemasaran dan visibilitas usaha, serta mempermudah pengelolaan transaksi dan stok produk yang sebelumnya menghadapi tantangan kompleksitas pada aplikasi pihak ketiga.

## 📖 Daftar Isi
- [RAZ'Q App - Ignite](#razq-app---ignite)
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

| Teknologi | Fungsi |
|------------|----------|
| FastAPI | Backend REST API |
| React | Frontend SPA |
| PostgreSQL | Database |
| Docker | Containerization |
| GitHub Actions | CI/CD |
| Railway / Render | Cloud Deployment |

---

## 🏗️ Architecture

```text
[React Frontend] <--HTTP--> [FastAPI Backend] <--SQL--> [PostgreSQL]
``` 

## 🚀 Getting Started

### Prasyarat
- Python 3.10+
- Node.js 18+
- Git

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```