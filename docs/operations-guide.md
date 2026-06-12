# Operations Guide – ATHSNAC Microservices

## Overview

Dokumen ini berisi panduan operasional untuk sistem ATHSNAC Microservices.

Panduan ini digunakan oleh tim QA, Backend, DevOps, dan Project Lead untuk:

* Memeriksa kesehatan sistem
* Membaca log aplikasi
* Melakukan request tracing menggunakan Correlation ID
* Memantau metrics aplikasi
* Menangani masalah umum
* Melakukan eskalasi jika terjadi gangguan
* Memverifikasi hasil pengujian observability

---

# 1. Architecture Overview

ATHSNAC menggunakan arsitektur microservices yang terdiri dari:

| Service       | Fungsi               | Port |
| ------------- | -------------------- | ---- |
| Gateway       | Reverse Proxy        | 80   |
| Frontend      | React Application    | 3000 |
| Auth Service  | Authentication & JWT | 8001 |
| Item Service  | Inventory Management | 8002 |
| Auth Database | PostgreSQL           | 5434 |
| Item Database | PostgreSQL           | 5435 |

---

# 2. Service Reference

## Gateway

```text
http://localhost
```

### Endpoint

```text
GET /health
```

---

## Auth Service

```text
http://localhost/auth
```

### Endpoint

```text
GET /health
GET /metrics
POST /register
POST /login
GET /verify
```

---

## Item Service

```text
http://localhost/items
```

### Endpoint

```text
GET /health
GET /metrics
GET /items
POST /items
PUT /items/{id}
DELETE /items/{id}
```

---

# 3. Health Check Guide

## Tujuan

Memastikan seluruh service berjalan dengan normal.

---

## Cek Semua Container

```bash
docker compose ps
```

Expected:

```text
auth-db         healthy
item-db         healthy
auth-service    healthy
item-service    healthy
frontend        healthy
gateway         healthy
```

---

## Cek Health Gateway

```bash
curl http://localhost/health
```

Expected:

```json
{
  "status":"healthy"
}
```

---

## Cek Health Auth Service

```bash
curl http://localhost/auth/health
```

Expected:

```json
{
  "service":"auth-service",
  "status":"healthy"
}
```

---

## Cek Health Item Service

```bash
curl http://localhost/items/health
```

Expected:

```json
{
  "service":"item-service",
  "status":"healthy"
}
```

---

# 4. Log Monitoring Guide

## Tujuan

Memantau aktivitas service dan mendeteksi error.

---

## Melihat Semua Log

```bash
docker compose logs
```

---

## Melihat Log Auth Service

```bash
docker compose logs auth-service
```

---

## Melihat Log Item Service

```bash
docker compose logs item-service
```

---

## Monitoring Real Time

```bash
docker compose logs -f
```

---

## Melihat 20 Log Terakhir

```bash
docker compose logs auth-service --tail=20

docker compose logs item-service --tail=20
```

---

# 5. Correlation ID Tracing Guide

## Tujuan

Correlation ID digunakan untuk melacak request yang melewati lebih dari satu service.

---

## Cara Melakukan Trace

Lakukan request:

```bash
curl http://localhost/items \
-H "Authorization: Bearer TOKEN"
```

Kemudian lihat log:

```bash
docker compose logs auth-service --tail=20

docker compose logs item-service --tail=20
```

Cari field berikut:

```json
{
  "correlation_id":"9bc39dc6-503"
}
```

Jika Correlation ID sama muncul pada beberapa service, maka request berhasil ditelusuri.

---

## Manfaat

* Root Cause Analysis
* Debugging lebih cepat
* Monitoring request antar service
* Audit trail

---

# 6. Metrics Monitoring Guide

## Tujuan

Metrics digunakan untuk mengukur performa aplikasi.

---

## Auth Service Metrics

```bash
curl http://localhost/auth/metrics
```

---

## Item Service Metrics

```bash
curl http://localhost/items/metrics
```

---

## Informasi Metrics

Metrics yang tersedia:

* Total Requests
* Total Errors
* Error Rate
* Status Code Distribution
* Endpoint Statistics
* Average Latency
* P50 Latency
* P95 Latency
* P99 Latency

---

## Contoh Response

```json
{
  "service":"auth-service",
  "total_requests":20,
  "total_errors":6,
  "error_rate_percent":30.0
}
```

---

# 7. Service Restart Procedure

## Restart Semua Service

```bash
docker compose restart
```

---

## Restart Auth Service

```bash
docker compose restart auth-service
```

---

## Restart Item Service

```bash
docker compose restart item-service
```

---

## Restart Gateway

```bash
docker compose restart gateway
```

---

## Verifikasi Setelah Restart

```bash
docker compose ps
```

Pastikan semua service kembali healthy.

---

# 8. Common Troubleshooting

## Auth Service Tidak Bisa Diakses

### Gejala

```text
Connection refused
```

### Pemeriksaan

```bash
docker compose ps

docker compose logs auth-service
```

### Solusi

```bash
docker compose restart auth-service
```

---

## Item Service Tidak Bisa Diakses

### Pemeriksaan

```bash
docker compose logs item-service
```

### Solusi

```bash
docker compose restart item-service
```

---

## Invalid or Expired Token

### Gejala

```json
{
  "detail":"Invalid or expired token"
}
```

### Solusi

* Login ulang
* Gunakan token baru
* Pastikan Auth Service aktif

---

## Database Tidak Terhubung

### Pemeriksaan

```bash
docker compose logs auth-db

docker compose logs item-db
```

### Solusi

```bash
docker compose restart auth-db

docker compose restart item-db
```

---

## Metrics Endpoint Tidak Merespon

### Pemeriksaan

```bash
curl http://localhost/auth/metrics

curl http://localhost/items/metrics
```

### Solusi

Pastikan metrics endpoint telah diregistrasikan pada service.

---

# 9. Escalation Path

Jika masalah tidak dapat diselesaikan menggunakan troubleshooting di atas, lakukan eskalasi berikut:

| Level   | PIC              | Tanggung Jawab                          |
| ------- | ---------------- | --------------------------------------- |
| Level 1 | QA Engineer      | Verifikasi masalah dan kumpulkan bukti  |
| Level 2 | Backend Engineer | Analisis service dan endpoint           |
| Level 3 | DevOps Engineer  | Analisis container, network, deployment |
| Level 4 | Project Lead     | Koordinasi dan pengambilan keputusan    |

---

## Informasi Wajib Saat Eskalasi

* Timestamp kejadian
* Correlation ID
* Endpoint yang diakses
* Error message
* Screenshot error
* Log terkait

---

# 10. Daily Monitoring Checklist

Operator wajib memeriksa:

* [ ] Semua container healthy
* [ ] Gateway dapat diakses
* [ ] Auth Service healthy
* [ ] Item Service healthy
* [ ] Metrics endpoint merespon
* [ ] Error rate tidak meningkat signifikan
* [ ] Tidak ada error berulang pada log

---

# 11. Testing Results

Bagian ini berisi bukti pengujian observability yang telah dilakukan pada Modul 14.

---

## Structured Logging Test

### Tujuan

Memastikan request tercatat dalam format structured logging.

### Hasil

Berhasil menampilkan:

* Timestamp
* HTTP Method
* Endpoint
* Status Code
* Duration
* Correlation ID

### Bukti Pengujian

![Structured Logging Test](images/reliability-test/structured-logging-test.png)

### Status

✅ PASS

---

## Correlation ID Test

### Tujuan

Memastikan request dapat ditelusuri menggunakan Correlation ID.

### Hasil

Correlation ID berhasil muncul pada setiap request dan dapat digunakan untuk tracing antar service.

### Bukti Pengujian

![Correlation ID Test](images/reliability-test/correlation-id-test.png)

### Status

✅ PASS

---

## Metrics Endpoint Test

### Tujuan

Memastikan metrics endpoint berjalan dengan baik.

### Hasil

Metrics berhasil menampilkan:

* Total Requests
* Total Errors
* Error Rate
* Endpoint Statistics
* Latency Statistics

### Bukti Pengujian

![Metrics Test](images/reliability-test/metrics-test.png)

### Status

✅ PASS

---

# 12. Conclusion

Berdasarkan hasil pengujian, seluruh fitur observability ATHSNACK berhasil berjalan dengan baik.

| Fitur                 | Status |
| --------------------- | ------ |
| Health Check          | ✅ PASS |
| Structured Logging    | ✅ PASS |
| Correlation ID        | ✅ PASS |
| Metrics Monitoring    | ✅ PASS |
| Troubleshooting Guide | ✅ PASS |
| Escalation Path       | ✅ PASS |

