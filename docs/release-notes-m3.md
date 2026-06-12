# Release Notes — Milestone 3 (Final Release)

## Version 3.0.0

**Project:** ATHSNACK Microservices
**Release Date:** June 2026
**Tag:** v3.0.0

---

# Overview

ATHSNACK telah berevolusi dari aplikasi monolithic menjadi aplikasi cloud-native berbasis microservices yang menerapkan praktik modern dalam pengembangan perangkat lunak, meliputi containerization, CI/CD, observability, reliability, dan security hardening.

Release ini merupakan versi final yang dipersiapkan untuk Ujian Akhir Semester Mata Kuliah Komputasi Awan Institut Teknologi Kalimantan.

---

# Architecture Evolution

| Phase      | Architecture                       |
| ---------- | ---------------------------------- |
| Modul 1–4  | Monolithic Application             |
| Modul 5–7  | Docker Containerization            |
| Modul 9–11 | CI/CD & Cloud Deployment           |
| Modul 12   | Microservices Decomposition        |
| Modul 13   | Reliability Engineering            |
| Modul 14   | Observability & Monitoring         |
| Modul 15   | Security Hardening & Documentation |

---

# Major Features

## Authentication Service

Auth Service bertanggung jawab untuk seluruh proses autentikasi pengguna.

### Features

* User Registration
* User Login
* JWT Authentication
* JWT Verification Endpoint
* Password Hashing menggunakan bcrypt
* Token Expiration

### Available Endpoints

| Method | Endpoint       |
| ------ | -------------- |
| POST   | /auth/register |
| POST   | /auth/login    |
| GET    | /auth/verify   |
| GET    | /auth/health   |
| GET    | /auth/metrics  |

---

## Item Service

Item Service bertanggung jawab untuk pengelolaan data inventory.

### Features

* Create Item
* Read Item
* Update Item
* Delete Item
* Item Search
* Owner Based Access Control

### Available Endpoints

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /items         |
| POST   | /items         |
| PUT    | /items/{id}    |
| DELETE | /items/{id}    |
| GET    | /items/health  |
| GET    | /items/metrics |

---

## API Gateway

Gateway menggunakan Nginx sebagai reverse proxy untuk seluruh request.

### Features

* Request Routing
* Reverse Proxy
* Centralized Access Point
* Health Endpoint
* Rate Limiting

---

# Microservices Architecture

Implementasi microservices dilakukan dengan pemisahan service menjadi:

### Auth Service

Bertanggung jawab untuk:

* Registrasi pengguna
* Login pengguna
* Verifikasi JWT

### Item Service

Bertanggung jawab untuk:

* CRUD inventory
* Validasi akses pengguna

### Database Per Service

Setiap service memiliki database terpisah:

| Service      | Database |
| ------------ | -------- |
| Auth Service | auth_db  |
| Item Service | item_db  |

Keuntungan:

* Loose Coupling
* Independent Deployment
* Better Scalability
* Better Fault Isolation

---

# Reliability Improvements

## Retry Mechanism

Auth Client pada Item Service menggunakan retry mechanism dengan exponential backoff.

### Configuration

* Maximum Retry: 3
* Timeout Protection
* Exponential Delay

### Benefit

Mengurangi kegagalan akibat gangguan jaringan sementara.

---

## Circuit Breaker

Circuit Breaker digunakan untuk mencegah cascading failure antar service.

### Configuration

* Failure Threshold: 5
* Recovery Timeout: 30 Seconds

### Benefit

Mencegah Item Service terus melakukan request ke Auth Service yang sedang bermasalah.

---

## Graceful Degradation

Sistem tetap memberikan response yang sesuai ketika service dependency mengalami gangguan.

### Benefit

* User mendapatkan pesan error yang jelas
* Service tidak mengalami crash total
* Monitoring tetap dapat dilakukan

---

# Observability & Monitoring

## Structured Logging

Logging menggunakan format JSON yang konsisten.

Informasi yang dicatat:

* Timestamp
* HTTP Method
* Endpoint
* Status Code
* Duration
* Correlation ID

---

## Correlation ID

Correlation ID digunakan untuk melakukan tracing request antar service.

### Benefit

* Root Cause Analysis
* End-to-End Tracing
* Faster Debugging

---

## Metrics Endpoint

Setiap service menyediakan endpoint metrics.

### Auth Service

```text
GET /auth/metrics
```

### Item Service

```text
GET /items/metrics
```

Metrics yang tersedia:

* Total Requests
* Total Errors
* Error Rate
* Status Code Distribution
* Average Latency
* P50 Latency
* P95 Latency
* P99 Latency

---

## Health Check

### Gateway

```text
GET /health
```

### Auth Service

```text
GET /auth/health
```

### Item Service

```text
GET /items/health
```

Health endpoint digunakan untuk monitoring dan container healthcheck.

---

# Security Hardening

Modul 15 berfokus pada peningkatan keamanan sistem.

## Password Security

* bcrypt hashing
* Password tidak disimpan dalam bentuk plain text

---

## JWT Authentication

* Token Expiration
* Token Verification
* Protected Endpoint

---

## Environment Variables

Konfigurasi sensitif dipindahkan ke environment variables.

Contoh:

```text
SECRET_KEY
DATABASE_URL
TOKEN_EXPIRE_MINUTES
POSTGRES_PASSWORD
```

---

## Input Validation

Menggunakan Pydantic untuk validasi data.

### Validasi yang diterapkan

* Email Validation
* Password Validation
* Name Validation
* Price Validation
* Quantity Validation

---

## Rate Limiting

Gateway menerapkan rate limiting untuk mencegah brute force dan abuse.

### Auth Endpoint

```text
5 requests / second
```

### API Endpoint

```text
20 requests / second
```

---

# Containerization

Deployment menggunakan Docker Compose.

## Services

| Container     | Port |
| ------------- | ---- |
| Gateway       | 80   |
| Frontend      | 3000 |
| Auth Service  | 8001 |
| Item Service  | 8002 |
| Auth Database | 5434 |
| Item Database | 5435 |

---

## Docker Features

* Multi Container Deployment
* Health Check
* Restart Policy
* Service Dependency Management
* Persistent Volumes

---

# CI/CD Integration

GitHub Actions digunakan untuk:

* Automated Testing
* Build Validation
* Docker Build
* Continuous Integration

Pipeline Flow:

```text
Push Code
↓
GitHub Actions
↓
Build
↓
Test
↓
Deploy
```

---

# Testing Summary

## Functional Testing

### Auth Service

* Register User
* Login User
* Verify Token

Result:

✅ PASS

---

### Item Service

* Create Item
* Read Item
* Update Item
* Delete Item

Result:

✅ PASS

---

### API Gateway

* Route Validation
* Reverse Proxy Validation

Result:

✅ PASS

---

# Reliability Testing

Dokumentasi tersedia pada:

```text
docs/reliability-testing.md
```

Pengujian yang dilakukan:

* Health Check Testing
* Register Testing
* Login Testing
* Inter-Service Communication Testing
* Failure Simulation Testing
* Recovery Testing

Result:

✅ PASS

---

# Observability Testing

Dokumentasi tersedia pada:

```text
docs/operations-guide.md
```

Pengujian yang dilakukan:

* Structured Logging Test
* Correlation ID Test
* Metrics Endpoint Test

Result:

✅ PASS

---

# Documentation

Dokumentasi proyek yang tersedia:

```text
docs/
├── architecture.md
├── api-contract.md
├── deployment-guide.md
├── operations-guide.md
├── reliability-testing.md
└── release-notes-m3.md
```

---

# Team Contributions

| Role           | Responsibility              |
| -------------- | --------------------------- |
| Lead Backend   | Auth Service & Item Service |
| Lead Frontend  | Frontend Development        |
| Lead DevOps    | Docker, Gateway, Deployment |
| Lead QA & Docs | Testing & Documentation     |
| Lead CI/CD     | Pipeline Automation         |

---

# Final Achievement

✅ Microservices Architecture

✅ Independent Database per Service

✅ API Gateway

✅ Docker Compose Deployment

✅ JWT Authentication

✅ Reliability Engineering

✅ Structured Logging

✅ Correlation ID Tracing

✅ Metrics Monitoring

✅ Health Monitoring

✅ Security Hardening

✅ Documentation Completion

✅ CI/CD Integration

git add docs/release-notes-m3.md