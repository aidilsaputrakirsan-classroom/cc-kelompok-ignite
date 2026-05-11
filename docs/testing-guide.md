# 📋 Panduan Testing Lengkap

Panduan ini berisi semua yang Anda perlu ketahui untuk menjalankan, menulis, dan di-debug test di project CC Kelompok Ignite.

---

## 📑 Daftar Isi
1. [Menjalankan Test Lokal](#menjalankan-test-lokal)
2. [Memahami Test Code](#memahami-test-code)
3. [Interpreting Real Test Results](#interpreting-real-test-results)
4. [Membaca CI Log](#membaca-ci-log)
5. [Debug Test Failure](#debug-test-failure)
6. [Menambah Test Baru](#menambah-test-baru)
7. [Cheatsheet Command](#cheatsheet-command)

---

## 🚀 Menjalankan Test Lokal

### Backend Testing (Python + FastAPI)

#### Setup Pertama Kali
```bash
# 1. Masuk ke folder backend
cd backend

# 2. Install dependencies (hanya jika belum)
pip install -r requirements.txt

# Penjelasan:
# - pip install = command untuk install Python packages
# - -r requirements.txt = baca file requirements.txt untuk list packages yang dibutuhkan
```

#### Menjalankan Semua Test Backend
```bash
pytest
```

**Penjelasan Command:**
- `pytest` = command untuk menjalankan semua test files yang cocok dengan pattern `test_*.py`
- Otomatis mencari test di folder `tests/` (sesuai konfigurasi di `pytest.ini`)
- Akan menampilkan:
  - ✓ Test yang passed (hijau)
  - ✗ Test yang failed (merah)
  - Waktu eksekusi setiap test

#### Menjalankan Test Tertentu
```bash
# Jalankan hanya test_auth.py
pytest tests/test_auth.py

# Jalankan hanya satu function test
pytest tests/test_auth.py::test_login_success

# Penjelasan:
# tests/test_auth.py = file path
# ::test_login_success = nama function test yang ingin dijalankan
```

#### Menjalankan Test dengan Coverage Report
```bash
pytest --cov=. --cov-report=term-missing

# Penjelasan setiap bagian:
# --cov=. = hitung coverage untuk semua file di folder ini (.)
# --cov-report=term-missing = tampilkan report di terminal dan tunjukkan line mana yang tidak ter-cover
```

**Output Coverage:** Anda akan melihat tabel seperti ini:
```
Name          Stmts   Miss  Cover   Missing
──────────────────────────────────────────
auth.py        50      5    90%     12, 34, 45, 67, 89
crud.py        30      2    93%     15, 20
──────────────────────────────────────────
TOTAL         200     10    95%
```

**Arti kolom:**
- `Name` = nama file
- `Stmts` = jumlah statement (baris code) di file itu
- `Miss` = berapa baris yang tidak dijalankan di test
- `Cover` = persentase coverage
- `Missing` = nomor line mana yang belum ter-cover

#### Menjalankan Test Verbose Mode
```bash
pytest -v

# -v = verbose = tampilkan detail setiap test
# Output:
# tests/test_auth.py::test_register_success PASSED     [10%]
# tests/test_auth.py::test_login_success PASSED        [20%]
# tests/test_auth.py::test_invalid_password FAILED    [30%]
```

#### Menjalankan Test dengan Output Println
```bash
pytest -s

# -s = show output = tampilkan print() statements dari test
# Contoh: jika ada print("Debug: user =", user) di test, akan terlihat
```

---

### Frontend Testing (React + Vitest)

#### Setup Pertama Kali
```bash
# 1. Masuk ke folder frontend
cd frontend

# 2. Install dependencies (hanya jika belum)
npm install

# Penjelasan:
# npm install = install semua dependencies yang ada di package.json
```

#### Menjalankan Semua Test Frontend
```bash
npm run test

# Penjelasan:
# npm run = jalankan script yang ada di package.json
# test = nama script (lihat di package.json: "test": "vitest run")
# Command ini akan menjalankan vitest dalam mode sekali jalan (run mode, tidak watch)
```

#### Menjalankan Test dalam Watch Mode
```bash
npm run test:watch

# Penjelasan:
# Watch mode = test berjalan ulang otomatis setiap ada perubahan file
# Sangat berguna saat development
# Tekan 'q' untuk quit, 'a' untuk jalankan semua test lagi
```

#### Menjalankan Test dengan Coverage
```bash
npm run test:coverage

# Penjelasan:
# Akan menjalankan test dan generate coverage report
# Output mirip dengan backend, menunjukkan % coverage per file
```

#### Menjalankan Test File Tertentu
```bash
npm run test -- Header.test.jsx

# Penjelasan:
# -- = pass argument ke vitest command
# Header.test.jsx = nama file test yang ingin dijalankan
```

---

## 🧪 Memahami Test Code

### Backend Test Structure

Contoh dari `backend/tests/test_auth.py`:

```python
"""Test authentication endpoints."""

# ===== BAGIAN 1: IMPORT =====
# import mengambil code dari file lain yang kita butuhkan

def test_register_success(client):
    """Test register user baru berhasil."""
    # ===== BAGIAN 2: SETUP DATA =====
    # Persiapan data yang ingin di-test
    response = client.post("/auth/register", json={
        "email": "newuser@example.com",
        "password": "SecurePassword123",
        "name": "New User"
    })
    
    # ===== BAGIAN 3: ASSERTION =====
    # Cek apakah hasilnya sesuai yang diharapkan
    assert response.status_code == 201
    # ☝️ assert = klaim/pernyataan
    # Ini berarti: "Saya yakin response status code adalah 201"
    # Jika bukan 201, test ini akan FAILED
    
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["name"] == "New User"
    assert "id" in data
    assert "password" not in data  # Password TIDAK boleh di response untuk keamanan
```

#### Penjelasan Setiap Bagian:

**`def test_register_success(client):`**
- `def` = define = mendefinisikan function
- `test_` = prefix wajib untuk pytest mengenali ini sebagai test
- `(client)` = parameter, `client` adalah test client yang sudah disiapkan di `conftest.py`

**`client.post("/auth/register", json={...})`**
- `client.post()` = send HTTP POST request ke API (test client)
- `"/auth/register"` = endpoint yang di-test
- `json={...}` = data yang dikirim dalam format JSON

**`assert response.status_code == 201`**
- `assert` = klaim/pernyataan
- `response.status_code` = status code dari response (201 = Created)
- `== 201` = harus sama dengan 201
- Jika tidak sama, test ini akan **FAILED**

**`assert "password" not in data`**
- Cek bahwa "password" TIDAK ada di response
- Ini untuk keamanan (password sensitive tidak boleh di-return)

---

### Frontend Test Structure

Contoh dari `frontend/src/components/__tests__/Header.test.jsx`:

```javascript
// ===== BAGIAN 1: IMPORT =====
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from '../Header';

// ===== BAGIAN 2: DESCRIBE (group test) =====
describe('Header Component', () => {
  // Penjelasan describe:
  // describe() = membuat group test dengan nama "Header Component"
  // Semua it() di dalam block ini adalah test untuk Header component
  
  // ===== BAGIAN 3: INDIVIDUAL TEST =====
  it('should render header with title', () => {
    // Penjelasan it():
    // it() = satu test individual
    // "should render header with title" = deskripsi apa yang di-test
    
    // Setup: render component
    render(<Header />);
    
    // Action: cari element
    const title = screen.getByText('My App');
    
    // Assert: cek apakah element ada
    expect(title).toBeInTheDocument();
    // Penjelasan expect():
    // expect() = klaim/pernyataan
    // toBeInTheDocument() = matcher (cara ngecek) bahwa element ada di DOM
  });

  it('should render navigation menu', () => {
    render(<Header />);
    
    const menu = screen.getByRole('navigation');
    // screen.getByRole() = cari element berdasarkan ARIA role
    // 'navigation' = mencari <nav> element
    
    expect(menu).toBeInTheDocument();
  });
});
```

#### Penjelasan Testing Library Queries:

**`screen.getByText('text')`**
- Cari element yang punya text "text"
- Throw error jika tidak ketemu

**`screen.getByRole('role')`**
- Cari element berdasarkan ARIA role
- Common roles: 'button', 'link', 'navigation', 'heading', dll

**`screen.queryByText('text')`**
- Cari element yang punya text "text"
- Return null jika tidak ketemu (tidak throw error)

**`screen.getAllByRole('role')`**
- Cari SEMUA element dengan role tertentu
- Return array

#### Penjelasan Matcher (expect assertions):

```javascript
expect(element).toBeInTheDocument();        // element ada di DOM
expect(element).toHaveTextContent('Hello'); // element punya text "Hello"
expect(element).toHaveClass('active');      // element punya class "active"
expect(button).toBeDisabled();              // button disable
expect(input).toHaveValue('text');          // input value sama dengan "text"
expect(func).toHaveBeenCalled();            // function sudah di-call
```

---

---

## 🔍 Interpreting Real Test Results

### Backend Pytest Output Detailed

**Project Anda Output:**
```
pytest
================================================== test session starts ==================================================
platform win32 -- Python 3.11.5, pytest-8.3.5, pluggy-1.6.0 -- c:\Users\ASUS\...\python.exe
```

**Arti setiap bagian:**
- `platform win32` = OS yang digunakan (win32 = Windows, linux = Linux)
- `Python 3.11.5` = Python version
- `pytest-8.3.5` = pytest version (framework untuk testing)
- `pluggy-1.6.0` = plugin system untuk pytest
- Path terakhir = executable python yang digunakan (dari virtual environment `.venv`)

**Lanjutan output:**
```
cachedir: .pytest_cache         # Pytest cache folder
rootdir: C:\...\backend          # Root directory untuk test
configfile: pytest.ini           # Config file (testpaths, options, dll)
testpaths: tests                 # Folder tempat pytest cari test
plugins: anyio-4.12.1, ...       # Installed pytest plugins
collected 12 items               # Menemukan 12 test untuk dijalankan
```

**Test execution:**
```
tests/test_auth.py::test_register_success PASSED                    [  8%]
│                   │                        │                       │
└─ file path        └─ function name         └─ result             └─ progress
```

- `test_auth.py` = file test
- `test_register_success` = function name (harus start dengan `test_`)
- `PASSED` = hasil (✓ berhasil)
- `[8%]` = 1 dari 12 test selesai

**Summary akhir:**
```
========================================== 12 passed, 10 warnings in 19.26s =========================================
│                                          │                │            │
└─ separator                               └─ 12 test passed └─ warnings └─ total time
```

---

### Frontend Vitest Output Detailed

**Project Anda Output:**
```
 RUN  v4.1.5 C:/Users/ASUS/cc-kelompok-ignite/frontend
```

- `RUN` = vitest sedang running
- `v4.1.5` = vitest version
- Path = project folder yang di-test

**File results:**
```
 ✓ src/test/api.test.js (2 tests) 12ms
 │ │                      │        │
 └─ passed                │        └─ execution time
   └─ file path           └─ number of tests di file ini
```

**Timing breakdown (dari project Anda):**
```
Duration  3.96s (transform 435ms, setup 781ms, import 1.07s, tests 404ms, environment 7.68s)
│         │      │          │          │          │           │          │
└─ total  │      └─ vite/webpack transform code
          │      └─ setup vitest environment
          │      └─ import modules dan dependencies
          │      └─ **actual test execution** ← YANG PALING PENTING
          └─ setup jsdom (browser environment simulation)
```

**Insights dari timing:**
- Test execution `404ms` = cepat ✓
- Environment setup `7.68s` = banyak dihabiskan untuk setup
- Ini NORMAL untuk first run. Run berikutnya akan lebih cepat karena cache.

**Test output dengan stdout:**
```
stdout | src/components/__tests__/Header.test.jsx > Header Component > menampilkan judul aplikasi
THEME SEKARANG: light
```

- Ada `console.log()` / `print` di test Anda
- `stdout |` = output dari test (bukan error)
- Anda bisa lihat ini dengan `-s` flag (backend) atau default di vitest
- Gunakan untuk debug

---

## 📊 Comparing Your Project Results

### Backend Status ✓
```
12 passed, 10 warnings in 19.26s

Tests mencakup:
- ✓ Authentication (register, login, duplicate check, wrong password)
- ✓ Health check
- ✓ Items CRUD (create, read, update, delete)
- ✓ Authorization (unauthorized checks)
- ✓ Search functionality
```

**Coverage Status:** Perlu check dengan `--cov` flag untuk melihat persentase coverage.

### Frontend Status ✓
```
Test Files  3 passed (3)
Tests       7 passed (7)

Files tested:
- api.test.js (2 tests) - API integration tests
- Header.test.jsx (2 tests) - Header component rendering
- ItemCard.test.jsx (3 tests) - ItemCard component behavior
```

---

## 🎯 Real World Scenarios

### Scenario 1: Test Passed Tapi Ada Warnings

**Output:**
```
12 passed, 10 warnings in 19.26s
```

**Action:** ✓ AMAN. Test PASSED.
- Warnings adalah deprecated function atau config style
- Tidak menghalangi test
- Optional untuk fix nanti (tech debt cleanup)

**Kapan perlu khawatir:** Jika warnings berubah menjadi errors di update dependency mendatang.

---

### Scenario 2: Test Failed

**Output:**
```
tests/test_auth.py::test_login_wrong_password FAILED    [ 33%]

AssertionError: assert 200 == 401
```

**Action:** ❌ HARUS FIX
1. Baca error message: `assert 200 == 401` = expected 401 (Unauthorized) tapi dapat 200 (OK)
2. Kemungkinan:
   - Login logic tidak validate password dengan benar
   - Authentication middleware tidak work
3. Debug:
   ```bash
   pytest tests/test_auth.py::test_login_wrong_password -vvs
   # -vvs = extra verbose dengan print output
   ```
4. Fix code dan test lagi

---

### Scenario 3: Test Slow

**Output:**
```
Duration  45.23s (transform 1500ms, setup 5000ms, import 2100ms, tests 35000ms, ...)
```

**Analysis:**
- `tests 35000ms` = test actual execution sangat lambat (35 detik!)
- Kemungkinan:
  - Ada sleep/wait di test
  - Database query tidak efficient
  - API call tidak di-mock
- Action: Optimize dengan:
  - Remove unnecessary sleeps
  - Mock external API
  - Check database indexes

---

## 📋 Before & After Running Test

### Before Running Test
```bash
# Setup
cd backend && pip install -r requirements.txt  # ← HANYA PERTAMA KALI
cd frontend && npm install                      # ← HANYA PERTAMA KALI
```

### After Running Test
```bash
# File baru yang dibuat:
backend/
  test.db                    # ← SQLite test database (di-create dan di-delete otomatis)
  .pytest_cache/             # ← Pytest cache untuk percepat run

frontend/
  node_modules/              # ← Already ada dari npm install
  dist/                      # ← Di-create jika run build (bukan test)
```

**Catatan:** Jangan commit `test.db` atau `.pytest_cache` ke git (sudah di `.gitignore` hopefully).

---

CI (Continuous Integration) secara otomatis menjalankan test setiap push atau PR. Log CI bisa dibaca di GitHub.

### Lokasi CI Log
1. Buka repository di GitHub
2. Klik tab **"Actions"**
3. Klik workflow yang ingin dilihat
4. Klik job yang ingin dilihat (test-backend, test-frontend, atau build-docker)

### Memahami Output CI Log

#### Backend Test Output (Real Project)

**Contoh hasil test PASSED:**
```
================================================== test session starts ==================================================
platform win32 -- Python 3.11.5, pytest-8.3.5, pluggy-1.6.0 -- c:\Users\ASUS\cc-kelompok-ignite\.venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\ASUS\cc-kelompok-ignite\backend
configfile: pytest.ini
testpaths: tests
plugins: anyio-4.12.1, cov-6.0.0
collected 12 items

tests/test_auth.py::test_register_success PASSED                                                              [  8%]
tests/test_auth.py::test_register_duplicate_email PASSED                                                      [ 16%]
tests/test_auth.py::test_login_success PASSED                                                                 [ 25%]
tests/test_auth.py::test_login_wrong_password PASSED                                                          [ 33%]
tests/test_health.py::test_health_check PASSED                                                                [ 41%]
tests/test_items.py::test_create_item PASSED                                                                  [ 50%]
tests/test_items.py::test_create_item_unauthorized PASSED                                                     [ 58%]
tests/test_items.py::test_get_items PASSED                                                                    [ 66%]
tests/test_items.py::test_get_item_not_found PASSED                                                           [ 75%]
tests/test_items.py::test_update_item PASSED                                                                  [ 83%]
tests/test_items.py::test_delete_item PASSED                                                                  [ 91%]
tests/test_items.py::test_search_items PASSED                                                                 [100%]

========================================== 12 passed, 10 warnings in 19.26s =========================================
```

**Cara Baca Output:**
- `platform win32` = running di Windows
- `Python 3.11.5` = versi Python yang digunakan
- `collected 12 items` = pytest menemukan 12 test functions
- Setiap line berisi: `filename::test_name PASSED [percentage]`
- Persentase menunjukkan progress (8% = 1 dari 12, 100% = semua selesai)
- `12 passed` = semua 12 test berhasil ✓
- `10 warnings` = ada 10 warning (lihat section "Memahami Warnings" di bawah)

**Contoh hasil test FAILED:**
```
tests/test_auth.py::test_login_invalid_password FAILED    [ 33%]

===== FAILURES =====
___ test_login_invalid_password ___

def test_login_invalid_password(client):
>       assert response.status_code == 401
E       AssertionError: assert 200 == 401
E        where 200 = <Response [200]>.status_code

tests/test_auth.py:45: AssertionError

================================================== 11 passed, 1 failed in 5.23s =========================================
```

**Penjelasan:**
- `FAILED` di test name menunjukkan test gagal ✗
- `===== FAILURES =====` section menunjukkan detail error
- `>` = baris yang failed (assertion line)
- `E` = error message yang detailed
- Nomor line terakhir (45) = tempat assertion gagal di file
- `11 passed, 1 failed` = ringkasan hasil akhir

**Cara Baca:**
1. **PASSED** = test berhasil ✓
2. **FAILED** = test gagal ✗ (lihat FAILURES section)
3. Di FAILURES:
   - `>` = baris yang failed
   - `E` = error/assertion yang gagal
   - `AssertionError: assert 200 == 401` = expected 401 tapi dapat 200
4. Nomor line terakhir (`tests/test_auth.py:45`) = tempat assertion gagal
5. Coverage report = berapa % code yang ter-cover

#### Frontend Test Output (Real Project)

**Contoh hasil test PASSED:**
```
 RUN  v4.1.5 C:/Users/ASUS/cc-kelompok-ignite/frontend

 ✓ src/test/api.test.js (2 tests) 12ms
 ✓ src/components/__tests__/Header.test.jsx (2 tests) 127ms
 ✓ src/components/__tests__/ItemCard.test.jsx (3 tests) 265ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  20:26:54
   Duration  3.96s (transform 435ms, setup 781ms, import 1.07s, tests 404ms, environment 7.68s)
```

**Cara Baca Output:**
- `RUN v4.1.5` = menjalankan vitest versi 4.1.5
- ✓ = test file / test passed
- `(2 tests)` = jumlah test di file itu
- `12ms` = waktu eksekusi file itu
- `Test Files 3 passed (3)` = semua 3 test files berhasil
- `Tests 7 passed (7)` = semua 7 test functions berhasil
- `Duration 3.96s` = total waktu keseluruhan
  - `transform 435ms` = waktu transform code (webpack/vite)
  - `setup 781ms` = waktu setup environment
  - `import 1.07s` = waktu import modules
  - `tests 404ms` = waktu jalankan test sebenarnya
  - `environment 7.68s` = waktu setup jsdom environment

**Contoh hasil test FAILED:**
```
 FAIL  src/components/__tests__/SearchBar.test.jsx

AssertionError: expected 'Hello' to equal 'World'

 src/components/__tests__/SearchBar.test.jsx (1 test)
  ✗ should display correct text

 Test Files  1 failed (1)
      Tests  1 failed (1)
```

**Penjelasan:**
- `FAIL` (merah) = test file gagal
- Error message menunjukkan apa yang salah
- `✗` = test function yang gagal
- Summary menunjukkan 1 failed

### Memahami Warnings

Warnings adalah peringatan dari dependencies/code, tapi test masih jalan. **Test dengan warnings tetap PASSED jika semua assertion pass.**

**Contoh warnings dari project:**
```
warnings summary ====================================================
database.py:28
  C:\Users\ASUS\cc-kelompok-ignite\backend\database.py:28: MovedIn20Warning: 
  The ``declarative_base()`` function is now available as 
  sqlalchemy.orm.declarative_base(). (deprecated since: 2.0)
    Base = declarative_base()

..\.venv\Lib\site-packages\pydantic\_internal\_config.py:291
  PydanticDeprecatedSince20: Support for class-based `config` is deprecated, 
  use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0.
```

**Penjelasan:**
- `MovedIn20Warning` = SQLAlchemy 2.0 deprecated function yang lama
  - **Action:** Update `database.py` untuk pakai `sqlalchemy.orm.declarative_base()` bukan deprecated version
  
- `PydanticDeprecatedSince20` = Pydantic 2.0 deprecated config style
  - **Action:** Update schema untuk pakai `ConfigDict` bukan class-based config

**Kapan Perlu Khawatir:**
- ✓ Warnings saja = tidak perlu khawatir, test tetap PASSED
- ✗ Errors (E prefix) = HARUS diperbaiki, test akan FAILED
- ⚠️ Warnings yang sering muncul = sebaiknya fix untuk code cleanliness

**Cara Hide Warnings (jika tidak perlu melihat):**
```bash
pytest -W ignore::DeprecationWarning

# Penjelasan:
# -W ignore::DeprecationWarning = ignore semua DeprecationWarning
# Tapi tidak recommended, lebih baik fix source-nya
```

---

## 🐛 Debug Test Failure

### Strategy 1: Baca Error Message dengan Teliti

Contoh error:
```
AssertionError: assert 200 == 401
```

**Artinya:**
- Expected (yang diharapkan) = 401
- Actual (yang terjadi) = 200
- Kemungkinan: logic authentication salah atau test setup tidak benar

### Strategy 2: Jalankan Test Lokal dengan Verbose

```bash
# Backend
cd backend
pytest tests/test_auth.py::test_login_invalid_password -v -s

# Penjelasan:
# -v = verbose (tampilkan detail)
# -s = show (tampilkan print statements)

# Frontend
cd frontend
npm run test:watch -- ItemCard.test.jsx
# Watch mode memudahkan debug karena otomatis re-run
```

### Strategy 3: Tambah Debug Print

**Backend:**
```python
def test_login_invalid_password(client):
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "WrongPassword"
    })
    
    print(f"DEBUG: Status Code = {response.status_code}")      # Tambahin ini
    print(f"DEBUG: Response = {response.json()}")              # Tambahin ini
    
    assert response.status_code == 401
```

Jalankan dengan `-s` flag untuk melihat print output:
```bash
pytest tests/test_auth.py::test_login_invalid_password -s
```

**Frontend:**
```javascript
it('should display item price correctly', () => {
  render(<ItemCard item={mockItem} />);
  
  const price = screen.getByText('Rp 100.000');
  
  console.log('DEBUG: item element =', price);              // Tambahin ini
  console.log('DEBUG: DOM =', document.body.innerHTML);     // Tambahin ini
  
  expect(price).toBeInTheDocument();
});
```

Output akan terlihat di terminal watch mode.

### Strategy 4: Check Test Setup (conftest.py / setup)

**Backend - lihat `backend/tests/conftest.py`:**
- Database di-setup benar kah?
- Fixture `client` dan `db_session` di-mount benar kah?
- Ada data initial kah yang dibutuhkan test?

```python
# Contoh: jika test butuh user yang sudah ada
@pytest.fixture(scope="function")
def client_with_user(db_session, client):
    """Client dengan user yang sudah di-register."""
    # Setup: create user
    client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "TestPassword123",
        "name": "Test User"
    })
    return client

# Gunakan di test:
def test_login(client_with_user):
    response = client_with_user.post("/auth/login", json={
        "email": "test@example.com",
        "password": "TestPassword123"
    })
    assert response.status_code == 200
```

**Frontend - lihat `frontend/src/test/setup.js`:**
- Setup dan teardown benar kah?
- Mock data/API benar kah?

### Strategy 5: Isolate the Problem

```python
# Jangan test multiple things dalam satu test
# ❌ BAD: Test terlalu banyak hal
def test_user_workflow(client):
    # Register
    response1 = client.post("/auth/register", json={...})
    # Login
    response2 = client.post("/auth/login", json={...})
    # Get items
    response3 = client.get("/items")
    # Create item
    response4 = client.post("/items", json={...})

# ✓ GOOD: Setiap test test satu hal
def test_register_success(client):
    response = client.post("/auth/register", json={...})
    assert response.status_code == 201

def test_login_success(client_with_user):
    response = client_with_user.post("/auth/login", json={...})
    assert response.status_code == 200
```

---

## ✍️ Menambah Test Baru

### Backend: Menambah Test untuk API Baru

**Skenario:** Anda ingin test endpoint baru `/items/search`

**Step 1: Tentukan apa yang ingin di-test**
```
Endpoint: GET /items/search?q=laptop
Expected:
- Status 200 OK
- Return items yang cocok dengan query "laptop"
- Jika query kosong, return 400 (Bad Request)
- Jika user tidak auth, return 401 (Unauthorized)
```

**Step 2: Buat test file baru atau tambah ke file yang ada**

```python
# Di backend/tests/test_items.py

def test_search_items_success(client):
    """Test search items berhasil."""
    # Setup: create items dulu
    client.post("/auth/register", json={
        "email": "user@example.com",
        "password": "Password123",
        "name": "User"
    })
    # Login untuk dapat token (jika API require auth)
    login_response = client.post("/auth/login", json={
        "email": "user@example.com",
        "password": "Password123"
    })
    token = login_response.json()["access_token"]
    
    # Setup: create items
    headers = {"Authorization": f"Bearer {token}"}
    client.post("/items", json={
        "name": "Laptop Dell",
        "price": 10000000,
        "description": "Gaming laptop"
    }, headers=headers)
    
    # Test: search
    response = client.get("/items/search?q=laptop", headers=headers)
    
    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "Laptop" in data[0]["name"]


def test_search_items_empty_query(client):
    """Test search dengan query kosong → 400."""
    response = client.get("/items/search?q=")
    assert response.status_code == 400


def test_search_items_unauthorized(client):
    """Test search tanpa token → 401."""
    response = client.get("/items/search?q=laptop")
    assert response.status_code == 401
```

**Step 3: Jalankan test**
```bash
cd backend
pytest tests/test_items.py::test_search_items_success -v
```

### Frontend: Menambah Test untuk Component Baru

**Skenario:** Anda ingin test component baru `<SearchBar />`

**Step 1: Tentukan apa yang ingin di-test**
```
Component: <SearchBar />
Props: 
  - placeholder: string
  - onSearch: function(query)
  
Test cases:
- Render dengan placeholder yang benar
- User bisa type di input
- Submit trigger onSearch callback
- Clear button reset input
```

**Step 2: Buat test file**

```javascript
// frontend/src/components/__tests__/SearchBar.test.jsx

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  it('should render with placeholder', () => {
    render(<SearchBar placeholder="Search products..." />);
    
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeInTheDocument();
  });

  it('should allow user to type', async () => {
    render(<SearchBar placeholder="Search..." />);
    
    const input = screen.getByPlaceholderText('Search...');
    
    // userEvent.type = lebih real dari fireEvent
    // Karena mensimulasikan actual user typing
    await userEvent.type(input, 'laptop');
    
    expect(input.value).toBe('laptop');
  });

  it('should call onSearch callback when submitted', async () => {
    // vi.fn() = membuat mock function untuk track calls
    const mockOnSearch = vi.fn();
    
    render(<SearchBar placeholder="Search..." onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await userEvent.type(input, 'laptop');
    fireEvent.click(button);
    
    // Assert: onSearch sudah di-call dengan "laptop"
    expect(mockOnSearch).toHaveBeenCalledWith('laptop');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    // toHaveBeenCalledTimes = check berapa kali function di-call
  });

  it('should clear input when clear button clicked', async () => {
    render(<SearchBar placeholder="Search..." />);
    
    const input = screen.getByPlaceholderText('Search...');
    const clearButton = screen.getByRole('button', { name: /clear/i });
    
    await userEvent.type(input, 'laptop');
    fireEvent.click(clearButton);
    
    expect(input.value).toBe('');
  });
});
```

**Step 3: Jalankan test**
```bash
cd frontend
npm run test:watch -- SearchBar.test.jsx
```

---

## 📖 Penjelasan Fixture dan Setup

### Backend: Pytest Fixture

**`conftest.py`** adalah file special untuk setup test configuration.

```python
# backend/tests/conftest.py

@pytest.fixture(scope="function")
def db_session():
    """
    Fixture yang membuat database baru untuk setiap test.
    
    Penjelasan:
    - @pytest.fixture = decorator untuk register sebagai fixture
    - scope="function" = fixture di-create dan di-destroy untuk setiap test function
    - Isi: create database, yield session, teardown (drop all)
    """
    Base.metadata.create_all(bind=engine)  # Buat tabel baru
    session = TestingSessionLocal()
    try:
        yield session                      # Pass ke test
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine) # Cleanup
```

**Cara Pakai:**
```python
def test_something(db_session):  # Terima fixture sebagai parameter
    # db_session sudah siap pakai
    user = db_session.query(User).first()
```

**Fixture Scope:**
- `function` = di-create & destroy per test (paling aman, default)
- `session` = di-create & destroy per test session (lebih cepat tapi bisa ada side effect)
- `module` = di-create & destroy per file test

### Frontend: Vitest Setup

**`frontend/src/test/setup.js`** adalah file setup untuk frontend test.

```javascript
import '@testing-library/jest-dom'
// @testing-library/jest-dom = add custom matchers seperti toBeInTheDocument()
```

---

## 🎯 Cheatsheet Command

### Backend Testing

```bash
# Buka backend folder
cd backend

# Jalankan SEMUA test
pytest

# Jalankan test dengan coverage
pytest --cov=. --cov-report=term-missing

# Jalankan test file tertentu
pytest tests/test_auth.py

# Jalankan test function tertentu
pytest tests/test_auth.py::test_login_success

# Jalankan test dengan verbose output
pytest -v

# Jalankan test dengan print output visible
pytest -s

# Jalankan test dan stop pada failure pertama
pytest -x

# Jalankan test dengan keyword matching
pytest -k "login"  # Jalankan semua test yang namanya ada "login"

# Jalankan test dan tampilkan 10 test terlama
pytest --durations=10
```

### Frontend Testing

```bash
# Buka frontend folder
cd frontend

# Jalankan SEMUA test (sekali jalan)
npm run test

# Jalankan test dalam watch mode
npm run test:watch

# Jalankan test dengan coverage
npm run test:coverage

# Jalankan test file tertentu
npm run test -- Header.test.jsx

# Jalankan test dengan filter (hanya test yang namanya ada "render")
npm run test -- -t render

# Di watch mode:
# - Tekan 'w' untuk show more options
# - Tekan 'a' untuk run all test
# - Tekan 'q' untuk quit
```

---

## ✅ Checklist Sebelum Commit

Sebelum push code dan buat PR, pastikan:

- [ ] Semua test lokal **PASSED**
  ```bash
  cd backend && pytest
  cd frontend && npm run test
  ```

- [ ] Coverage tetap **≥ 50%** (backend requirement)
  ```bash
  cd backend && pytest --cov=. --cov-report=term-missing
  ```

- [ ] Tidak ada warning atau error di test output

- [ ] Jika tambah feature baru, sudah **ada test baru untuk feature itu**

- [ ] Test names jelas dan deskriptif (tidak boleh vague)

Setelah push, GitHub Actions CI akan otomatis jalankan test. Check di **Actions tab** bahwa CI **PASSED**.

---

## 🆘 Troubleshooting Umum

### Backend

**Error: `ModuleNotFoundError: No module named 'database'`**
```bash
# Penyebab: PYTHONPATH tidak benar
# Solusi: pastikan jalankan pytest dari folder backend
cd backend
pytest
```

**Error: `ConnectionRefusedError` atau database error**
```bash
# Penyebab: test database tidak ter-setup
# Solusi: cek conftest.py, pastikan menggunakan sqlite:///./test.db (in-memory)
```

**Test tiba-tiba failed tapi code sama**
```bash
# Penyebab: test database corrupt atau ada test yang tidak cleanup
# Solusi: hapus test.db dan jalankan lagi
rm -f test.db
pytest
```

### Frontend

**Error: `ReferenceError: document is not defined`**
```bash
# Penyebab: jsdom tidak ter-setup
# Solusi: cek vitest.config.js, pastikan ada: environment: 'jsdom'
```

**Component tidak ter-render di test**
```javascript
// ❌ Lupa render
it('should display text', () => {
  const MyComponent = <Header />;
  expect(screen.getByText('Hello')).toBeInTheDocument(); // FAIL
});

// ✓ Render dulu
it('should display text', () => {
  render(<Header />);
  expect(screen.getByText('Hello')).toBeInTheDocument(); // PASS
});
```
