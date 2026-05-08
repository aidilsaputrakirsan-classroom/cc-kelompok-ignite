"""Test health check endpoint."""


def test_health_check(client):
    """Test health endpoint → 200 dan status healthy."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "ATHSNACK API"
    assert data["database"] == "connected"
    assert data["version"] == "1.0.0"
    assert "timestamp" in data
    assert data["service"] == "backend"