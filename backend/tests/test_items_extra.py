"""Additional backend tests for coverage improvement."""


def test_create_item_empty_name(client, auth_headers):
    """Test create item dengan nama kosong."""

    response = client.post(
        "/items",
        json={
            "name": "",
            "price": 10000,
            "quantity": 1
        },
        headers=auth_headers
    )

    assert response.status_code in [400, 422]


def test_create_item_negative_price(client, auth_headers):
    """Harga negatif harus gagal."""

    response = client.post(
        "/items",
        json={
            "name": "Laptop",
            "price": -5000,
            "quantity": 1
        },
        headers=auth_headers
    )

    assert response.status_code in [400, 422]


def test_create_item_negative_quantity(client, auth_headers):
    """Quantity negatif harus gagal."""

    response = client.post(
        "/items",
        json={
            "name": "Mouse",
            "price": 50000,
            "quantity": -2
        },
        headers=auth_headers
    )

    assert response.status_code in [400, 422]


def test_create_item_missing_required_field(client, auth_headers):
    """Field wajib tidak diisi."""

    response = client.post(
        "/items",
        json={
            "price": 10000,
            "quantity": 1
        },
        headers=auth_headers
    )

    assert response.status_code == 422