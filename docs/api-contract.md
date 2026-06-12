# API Contract – ATHSNACK Microservices

## Pendahuluan

Dokumen ini menjelaskan kontrak API yang digunakan pada aplikasi ATHSNACK. Tujuan dari API Contract adalah memberikan referensi yang jelas mengenai endpoint yang tersedia, format request dan response, mekanisme autentikasi, serta kode status yang digunakan oleh sistem.

Pada versi final, ATHSNACK menggunakan arsitektur microservices yang terdiri dari:

* Auth Service
* Item Service
* API Gateway

Seluruh request dari client akan melewati API Gateway sebelum diteruskan ke service yang sesuai.

---

# Base URL

## Local Development

```text
http://localhost
```

## Production

```text
https://your-app.up.railway.app
```

---

# Authentication

Sebagian besar endpoint membutuhkan JWT Token yang dikirim melalui header:

```http
Authorization: Bearer <access_token>
```

Token diperoleh melalui endpoint:

```http
POST /auth/login
```

Token memiliki masa berlaku sesuai konfigurasi:

```env
TOKEN_EXPIRE_MINUTES
```

---

# Standard Error Response

Seluruh error menggunakan format yang konsisten:

```json
{
  "detail": "Error message description"
}
```

---

# HTTP Status Code

| Status Code | Keterangan            |
| ----------- | --------------------- |
| 200         | Request berhasil      |
| 201         | Data berhasil dibuat  |
| 204         | Data berhasil dihapus |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 404         | Data tidak ditemukan  |
| 422         | Validation Error      |
| 429         | Rate Limit Exceeded   |
| 500         | Internal Server Error |
| 503         | Service Unavailable   |

---

# Auth Service

Base Path:

```text
/auth
```

---

## Register User

### Endpoint

```http
POST /auth/register
```

### Rate Limit

```text
5 request per second
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "User Example"
}
```

### Response

Status:

```text
201 Created
```

Response:

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "User Example"
}
```

---

## Login User

### Endpoint

```http
POST /auth/login
```

### Rate Limit

```text
5 request per second
```

### Request Body

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

### Response

Status:

```text
200 OK
```

Response:

```json
{
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

---

## Verify Token

Endpoint ini digunakan oleh service lain untuk memvalidasi JWT.

### Endpoint

```http
GET /auth/verify
```

### Header

```http
Authorization: Bearer <token>
```

### Response

Status:

```text
200 OK
```

Response:

```json
{
  "user_id": 1,
  "email": "user@example.com",
  "name": "User Example",
  "role": "customer"
}
```

---

## Health Check

### Endpoint

```http
GET /auth/health
```

### Response

```json
{
  "service": "auth-service",
  "status": "healthy"
}
```

---

## Metrics

### Endpoint

```http
GET /auth/metrics
```

### Response

```json
{
  "service": "auth-service",
  "total_requests": 25,
  "total_errors": 2,
  "error_rate_percent": 8.0
}
```

---

# Item Service

Base Path:

```text
/items
```

Semua endpoint Item Service membutuhkan JWT Token.

---

## Get All Items

### Endpoint

```http
GET /items
```

### Query Parameters

| Parameter | Default | Keterangan        |
| --------- | ------- | ----------------- |
| search    | null    | Pencarian item    |
| skip      | 0       | Pagination offset |
| limit     | 20      | Jumlah data       |

### Header

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "total": 10,
  "items": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 15000000
    }
  ]
}
```

---

## Get Item By ID

### Endpoint

```http
GET /items/{id}
```

### Header

```http
Authorization: Bearer <token>
```

### Response

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Laptop Gaming",
  "price": 15000000,
  "quantity": 5
}
```

---

## Create Item

### Endpoint

```http
POST /items
```

### Header

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Request Body

```json
{
  "name": "Laptop",
  "description": "Laptop Gaming",
  "price": 15000000,
  "quantity": 5
}
```

### Response

Status:

```text
201 Created
```

Response:

```json
{
  "id": 1,
  "name": "Laptop",
  "description": "Laptop Gaming",
  "price": 15000000,
  "quantity": 5
}
```

---

## Update Item

### Endpoint

```http
PUT /items/{id}
```

### Header

```http
Authorization: Bearer <token>
```

### Request Body

Partial Update diperbolehkan.

Contoh:

```json
{
  "price": 17000000
}
```

### Response

```json
{
  "id": 1,
  "name": "Laptop",
  "price": 17000000
}
```

---

## Delete Item

### Endpoint

```http
DELETE /items/{id}
```

### Header

```http
Authorization: Bearer <token>
```

### Response

Status:

```text
204 No Content
```

---

## Health Check

### Endpoint

```http
GET /items/health
```

### Response

```json
{
  "service": "item-service",
  "status": "healthy"
}
```

---

## Metrics

### Endpoint

```http
GET /items/metrics
```

### Response

```json
{
  "service": "item-service",
  "total_requests": 40,
  "total_errors": 3,
  "error_rate_percent": 7.5
}
```

---

# API Gateway

Seluruh request dari frontend akan melewati API Gateway.

Gateway bertanggung jawab untuk:

* Reverse Proxy
* Request Routing
* Rate Limiting
* Health Monitoring

---

## Gateway Health Check

### Endpoint

```http
GET /health
```

### Response

```json
{
  "status": "healthy"
}
```

---

# Rate Limiting

Untuk mencegah abuse dan brute-force attack, gateway menerapkan rate limiting.

| Endpoint | Limit             |
| -------- | ----------------- |
| /auth/*  | 5 request/second  |
| /items/* | 20 request/second |

Jika limit terlampaui:

```json
{
  "detail": "Rate limit exceeded"
}
```

Status:

```text
429 Too Many Requests
```

---

# Security Notes

ATHSNACK menerapkan beberapa mekanisme keamanan:

* JWT Authentication
* Password Hashing (bcrypt)
* Input Validation (Pydantic)
* Environment Variable Management
* Rate Limiting
* Service Isolation melalui Microservices

---

# Version Information

| Version | Description                                                      |
| ------- | ---------------------------------------------------------------- |
| v1.0.0  | Monolith Application                                             |
| v2.0.0  | Railway Deployment                                               |
| v3.0.0  | Microservices + Reliability + Observability + Security Hardening |

Dokumen ini digunakan sebagai referensi resmi API ATHSNACK versi 3.0.0.
