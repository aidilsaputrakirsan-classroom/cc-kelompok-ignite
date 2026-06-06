# Dokumentasi Reliability Testing ATHSNACK

## Pengenalan

**Pengujian Keandalan (Reliability Testing)** memastikan bahwa aplikasi ATHSNACK dapat:
- ✅ Menangani kegagalan dengan baik (tidak crash total)
- ✅ Tidak menyebabkan kegagalan berantai (saat satu layanan bermasalah)
- ✅ Tetap memberikan pelayanan terbatas kepada pengguna saat ada masalah

### Strategi Reliability

Aplikasi kami menggunakan **tiga strategi** untuk tetap berfungsi saat terjadi kegagalan:

```
┌──────────────────────────────────────────────────────┐
│     TIGA STRATEGI MENGHADAPI KEGAGALAN               │
├──────────────────────────────────────────────────────┤
│  🔄 COBA LAGI (Retry)                               │
│     Jika jaringan lagi sibuk atau sementara error  │
│                                                      │
│  ⚡ BERHENTI SEBENTAR (Circuit Breaker)             │
│     Jika layanan memang sedang bermasalah          │
│                                                      │
│  📉 KURANGI FITUR (Graceful Degradation)           │
│     Tetap melayani dengan kemampuan terbatas       │
└──────────────────────────────────────────────────────┘
```

**Analogi Dunia Nyata:**
- 🔄 **Retry**: Seperti memanggil teman — jika tidak diangkat, coba lagi 3 kali
- ⚡ **Circuit Breaker**: Seperti menutup pintu kantor saat sedang renovasi (jangan bikin antrian)
- 📉 **Graceful Degradation**: Seperti restoran yang melayani menu terbatas saat chef sedang ganti shift

---

## Tiga Pilar Reliability

### 1. 🔄 Coba Lagi (Retry) dengan Penundaan Bertahap

**Idenya:**
- Saat aplikasi mencoba login, jaringan mungkin sedang sibuk atau terganggu sementara
- Daripada langsung gagal, aplikasi coba lagi 3 kali dengan jeda waktu yang semakin lama
- Jeda: 0.5 detik → 1 detik → 2 detik (untuk beri waktu jaringan/layanan pulih)

**Dimana diimplementasikan:**
- File: `services/item-service/auth_client.py`
- Jumlah percobaan: 3 kali
- Waktu tunggu maksimal: 5 detik per percobaan

**Kapan Coba Lagi (Layak untuk Diulangi):**
- ✅ Jaringan terputus (Connection refused)
- ✅ Jaringan lambat atau timeout
- ✅ Error sementara dari server (500, 502, 503, 504)

**Kapan TIDAK Coba Lagi (Sia-sia jika Diulangi):**
- ❌ Token salah (401 Unauthorized) — tetap salah sekalipun dicoba 3x
- ❌ Data tidak valid (400 Bad Request) — data sama tetap tidak valid
- ❌ Halaman tidak ditemukan (404 Not Found) — tidak akan tiba-tiba muncul

**Contoh Alur Coba Lagi:**

```
Percobaan ke-1: ❌ Jaringan error → tunggu 0.5 detik
Percobaan ke-2: ❌ Timeout → tunggu 1 detik  
Percobaan ke-3: ✅ Berhasil! (layanan sudah baik)
```

---

### 2. ⚡ Pemutus Sirkuit (Circuit Breaker)

**Idenya:**
- Mirip seperti **sekring listrik di rumah Anda**
- Jika layanan bermasalah berkali-kali, aplikasi akan "memutus" koneksi sementara
- Ini untuk mencegah aplikasi terus-menerus mencoba sesuatu yang sudah jelas tidak bisa
- Setelah beberapa waktu, aplikasi coba lagi melihat apakah layanan sudah baik

**Analogi Sekring Listrik:**
```
NORMAL (Sekring OK)
  → Semua lampu menyala normal
  → Listrik mengalir lancar

TERPUTUS (Sekring Putus)
  → Semua lampu padam
  → Listrik berhenti untuk melindungi peralatan
  
TESTING (Coba Nyalakan Lagi)
  → Nyalakan sekrin sekali
  → Jika listrik baik-baik saja, tetap hidup
  → Jika masih bermasalah, putus lagi
```

**Tiga Status Circuit Breaker:**

| Status | Arti | Apa yang Terjadi | Waktu Respons |
|--------|------|-----------------|---|
| **NORMAL** | Layanan OK | Permintaan diteruskan ke layanan | ~5 detik (normal) |
| **PUTUS** | Layanan bermasalah | Permintaan langsung ditolak (tidak usah ke layanan) | <0.1 detik (cepat!) |
| **TESTING** | Cek apakah layanan sudah baik | Izinkan 1 permintaan untuk test | ~5 detik |

**Parameter:**
- Menjadi PUTUS setelah: 5 kegagalan berturut-turut
- Waktu tunggu sebelum test ulang: 30 detik
- Implementasi: `services/item-service/circuit_breaker.py`

---

### 3. 📉 Kurangi Fitur (Graceful Degradation)

**Idenya:**
- Saat salah satu layanan sedang down/bermasalah, aplikasi tidak harus mati 100%
- Aplikasi akan "tahan" dengan mengurangi fitur (memberikan layanan terbatas)
- Seperti restoran yang melayani menu terbatas saat ada bahan yang habis

**Contoh Mode Operasi:**

```
STATUS NORMAL (Semua Layanan OK)
├─ Lihat semua produk: ✅ Bisa
├─ Buat produk baru: ✅ Bisa
├─ Perbarui produk: ✅ Bisa
└─ Hapus produk: ✅ Bisa

STATUS BERKURANG (Layanan Autentikasi Down)
├─ Lihat semua produk: ❌ Tidak bisa (butuh login)
├─ Buat produk baru: ❌ Tidak bisa (butuh login)
├─ Perbarui produk: ❌ Tidak bisa (butuh login)
├─ Hapus produk: ❌ Tidak bisa (butuh login)
└─ Lihat status kesehatan: ✅ Masih bisa (untuk monitoring)
```

**Keuntungan:**
- ✅ Pengguna tahu ada masalah (dapat pesan error jelas)
- ✅ Tim bisa monitor melalui status kesehatan
- ✅ Tidak membuat pengguna bingung dengan layanan "ghost"

---
