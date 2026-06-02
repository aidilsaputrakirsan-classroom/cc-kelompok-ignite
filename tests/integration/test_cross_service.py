"""
Integration Tests — Verifikasi komunikasi antar services.
Jalankan dengan: pytest tests/integration/ -v
Syarat: docker compose up -d (semua services running)
"""
import httpx
import pytest


def test_gateway_health(gateway_url):
    """Test 1: Gateway bisa diakses."""
    try:
        response = httpx.get(f"{gateway_url}/health", timeout=5.0)
        # Nginx usually returns 200 if configured, or 404 if /health not mapped.
        # But based on the module, we expect 200.
        assert response.status_code == 200
    except Exception as e:
        pytest.fail(f"Gateway health check failed: {e}")


def test_auth_service_health(gateway_url):
    """Test 2: Auth Service health check via gateway."""
    response = httpx.get(f"{gateway_url}/auth/health", timeout=5.0)
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "auth-service"
    assert data["status"] == "healthy"


def test_item_service_health(gateway_url):
    """Test 3: Item Service health check via gateway."""
    response = httpx.get(f"{gateway_url}/items/health", timeout=5.0)
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "item-service"
    # Dependencies might be 'available' if auth is up
    assert data["status"] in ["healthy", "degraded"]


def test_register_login_flow(gateway_url):
    """Test 4: Full flow register → login → get token."""
    import time
    email = f"flow-test-{int(time.time())}@example.com"

    # Register
    resp = httpx.post(f"{gateway_url}/auth/register", json={
        "email": email, "password": "FlowTest123", "name": "Flow User"
    }, timeout=5.0)
    assert resp.status_code == 201
    assert resp.json()["email"] == email

    # Login
    resp = httpx.post(f"{gateway_url}/auth/login", json={
        "email": email, "password": "FlowTest123"
    }, timeout=5.0)
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_cross_service_auth_verification(gateway_url, test_user):
    """Test 5: Item Service verifikasi token via Auth Service (cross-service)."""
    # Create item (requires auth verification across services)
    resp = httpx.post(
        f"{gateway_url}/items",
        json={
            "name": "Integration Test Item",
            "description": "Created during integration test",
            "price": 99000,
            "stock": 10,
            "category": "makanan"
        },
        headers=test_user["headers"],
        timeout=10.0
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Integration Test Item"
    assert "owner_id" in data


def test_crud_via_gateway(gateway_url, test_user):
    """Test 6: Full CRUD melalui gateway (melibatkan semua services)."""
    headers = test_user["headers"]

    # Create
    resp = httpx.post(f"{gateway_url}/items", json={
        "name": "CRUD Test", 
        "description": "Testing CRUD",
        "price": 50000, 
        "stock": 5,
        "category": "makanan"
    }, headers=headers, timeout=10.0)
    assert resp.status_code == 201
    item_id = resp.json()["id"]

    # Read
    resp = httpx.get(f"{gateway_url}/items/{item_id}", headers=headers, timeout=5.0)
    assert resp.status_code == 200
    assert resp.json()["name"] == "CRUD Test"

    # Update
    resp = httpx.put(f"{gateway_url}/items/{item_id}", json={
        "price": 45000
    }, headers=headers, timeout=5.0)
    assert resp.status_code == 200
    assert resp.json()["price"] == 45000

    # Delete
    resp = httpx.delete(f"{gateway_url}/items/{item_id}", headers=headers, timeout=5.0)
    assert resp.status_code == 204

    # Verify deleted
    resp = httpx.get(f"{gateway_url}/items/{item_id}", headers=headers, timeout=5.0)
    assert resp.status_code == 404


def test_unauthorized_without_token(gateway_url):
    """Test 7: Request tanpa token harus ditolak oleh Item Service."""
    resp = httpx.post(f"{gateway_url}/items", json={
        "name": "Should Fail", "price": 100, "stock": 1
    }, timeout=5.0)
    assert resp.status_code in [401, 403, 422]


def test_invalid_token_rejected(gateway_url):
    """Test 8: Token invalid harus ditolak."""
    resp = httpx.get(
        f"{gateway_url}/items",
        headers={"Authorization": "Bearer invalid-fake-token"},
        timeout=5.0
    )
    assert resp.status_code == 401
