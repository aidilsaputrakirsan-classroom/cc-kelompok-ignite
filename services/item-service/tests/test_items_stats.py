"""
Test untuk endpoint GET /items/stats di Item Service.
"""

import pytest
from fastapi.testclient import TestClient

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app


# Override auth untuk testing
def override_get_current_user():
    return {"id": 1, "email": "test@example.com", "name": "Test User"}


@pytest.fixture
def test_client():
    """Test client fixture dengan auth override."""
    from main import get_current_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    client = TestClient(app)
    yield client

    # Cleanup
    app.dependency_overrides.clear()


class TestItemStatsEndpoint:
    """Test suite untuk GET /items/stats endpoint."""

    def test_stats_empty_inventory(self, test_client):
        """Test stats ketika tidak ada item."""
        response = test_client.get("/items/stats")

        if response.status_code != 200:
            print(f"Response: {response.status_code}")
            print(f"Content: {response.text}")

        assert response.status_code == 200
        data = response.json()

        assert data["total_items"] == 0
        assert data["total_value"] == 0.0
        assert data["most_expensive"] is None
        assert data["cheapest"] is None

    def test_stats_single_item(self, test_client):
        """Test stats dengan satu item."""
        # Create item
        item_data = {
            "name": "Amplang",
            "description": "Amplang gurih",
            "category": "makanan",
            "slug": "amplang",
            "price": 25000.0,
            "stock": 10,
            "image_url": "https://example.com/amplang.jpg",
            "is_active": True,
        }

        create_response = test_client.post("/items", json=item_data)
        assert create_response.status_code == 201

        # Get stats
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()
        assert data["total_items"] == 1
        assert data["total_value"] == 250000.0  # 25000 * 10
        assert data["most_expensive"]["name"] == "Amplang"
        assert data["most_expensive"]["price"] == 25000.0
        assert data["cheapest"]["name"] == "Amplang"
        assert data["cheapest"]["price"] == 25000.0

    def test_stats_multiple_items_different_prices(self, test_client):
        """Test stats dengan multiple items dengan harga berbeda."""
        items_data = [
            {
                "name": "Amplang Murah",
                "description": "Amplang ekonomis",
                "category": "makanan",
                "slug": "amplang-murah",
                "price": 15000.0,
                "stock": 20,
                "image_url": "https://example.com/amplang1.jpg",
                "is_active": True,
            },
            {
                "name": "Amplang Premium",
                "description": "Amplang premium",
                "category": "makanan",
                "slug": "amplang-premium",
                "price": 50000.0,
                "stock": 5,
                "image_url": "https://example.com/amplang2.jpg",
                "is_active": True,
            },
            {
                "name": "Amplang Medium",
                "description": "Amplang sedang",
                "category": "makanan",
                "slug": "amplang-medium",
                "price": 30000.0,
                "stock": 15,
                "image_url": "https://example.com/amplang3.jpg",
                "is_active": True,
            },
        ]

        # Create all items
        for item in items_data:
            response = test_client.post("/items", json=item)
            assert response.status_code == 201

        # Get stats
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()

        # Verify counts
        assert data["total_items"] == 3

        # Verify total value calculation
        # (15000 * 20) + (50000 * 5) + (30000 * 15)
        # 300000 + 250000 + 450000 = 1000000
        assert data["total_value"] == 1000000.0

        # Verify most expensive
        assert data["most_expensive"]["name"] == "Amplang Premium"
        assert data["most_expensive"]["price"] == 50000.0
        assert data["most_expensive"]["stock"] == 5

        # Verify cheapest
        assert data["cheapest"]["name"] == "Amplang Murah"
        assert data["cheapest"]["price"] == 15000.0
        assert data["cheapest"]["stock"] == 20

    def test_stats_response_structure(self, test_client):
        """Test struktur response stats endpoint."""
        # Create item
        item_data = {
            "name": "Test Item",
            "description": "Test",
            "category": "snack",
            "slug": "test-item",
            "price": 35000.0,
            "stock": 8,
            "image_url": "https://example.com/test.jpg",
            "is_active": True,
        }

        test_client.post("/items", json=item_data)

        # Get stats
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()

        # Verify required fields
        assert "total_items" in data
        assert "total_value" in data
        assert "most_expensive" in data
        assert "cheapest" in data

        # Verify data types
        assert isinstance(data["total_items"], int)
        assert isinstance(data["total_value"], (int, float))

        # Verify most_expensive structure
        most_exp = data["most_expensive"]
        assert most_exp["id"] == 1
        assert most_exp["name"] == "Test Item"
        assert most_exp["price"] == 35000.0
        assert most_exp["stock"] == 8
        assert most_exp["category"] == "snack"

        # Verify cheapest structure (same as most_expensive in this case)
        cheapest = data["cheapest"]
        assert cheapest["id"] == 1
        assert cheapest["name"] == "Test Item"
        assert cheapest["price"] == 35000.0
        assert cheapest["stock"] == 8
        assert cheapest["category"] == "snack"

    def test_stats_user_isolation(self, test_client):
        """Test bahwa stats hanya menghitung items milik user."""
        # Create item untuk user 1
        item_data = {
            "name": "Item User 1",
            "description": "Milik user 1",
            "category": "makanan",
            "slug": "item-user1",
            "price": 20000.0,
            "stock": 10,
            "image_url": "https://example.com/item1.jpg",
            "is_active": True,
        }

        response = test_client.post("/items", json=item_data)
        assert response.status_code == 201

        # Manually add item untuk user 2
        import main

        main.fake_items_db.append(
            {
                "id": 2,
                "name": "Item User 2",
                "description": "Milik user 2",
                "category": "minuman",
                "slug": "item-user2",
                "price": 5000.0,
                "stock": 100,
                "image_url": "https://example.com/item2.jpg",
                "is_active": True,
                "owner_id": 2,  # Different owner
                "created_at": None,
                "updated_at": None,
            }
        )

        # Get stats untuk user 1
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()

        # Should only count item dari user 1
        assert data["total_items"] == 1
        assert data["total_value"] == 200000.0  # 20000 * 10
        assert data["most_expensive"]["name"] == "Item User 1"
        assert data["cheapest"]["name"] == "Item User 1"

    def test_stats_with_zero_stock_items(self, test_client):
        """Test stats dengan items yang stock-nya 0."""
        items_data = [
            {
                "name": "Item With Stock",
                "description": "Ada stock",
                "category": "makanan",
                "slug": "item-stock",
                "price": 10000.0,
                "stock": 50,
                "image_url": "https://example.com/item1.jpg",
                "is_active": True,
            },
            {
                "name": "Item No Stock",
                "description": "Tidak ada stock",
                "category": "makanan",
                "slug": "item-nostock",
                "price": 25000.0,
                "stock": 0,
                "image_url": "https://example.com/item2.jpg",
                "is_active": True,
            },
        ]

        # Create items
        for item in items_data:
            response = test_client.post("/items", json=item)
            assert response.status_code == 201

        # Get stats
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()

        # Should include zero-stock items in count and stats
        assert data["total_items"] == 2

        # Total value should only count stocked items for calculation
        # (10000 * 50) + (25000 * 0) = 500000
        assert data["total_value"] == 500000.0

        # Most expensive should still be the 25000 item (even with 0 stock)
        assert data["most_expensive"]["name"] == "Item No Stock"
        assert data["most_expensive"]["price"] == 25000.0

        # Cheapest should be the 10000 item
        assert data["cheapest"]["name"] == "Item With Stock"
        assert data["cheapest"]["price"] == 10000.0

    def test_stats_after_item_deletion(self, test_client):
        """Test stats after menghapus item."""
        items_data = [
            {
                "name": "Item 1",
                "description": "First",
                "category": "makanan",
                "slug": "item1",
                "price": 10000.0,
                "stock": 5,
                "image_url": "https://example.com/item1.jpg",
                "is_active": True,
            },
            {
                "name": "Item 2",
                "description": "Second",
                "category": "makanan",
                "slug": "item2",
                "price": 20000.0,
                "stock": 3,
                "image_url": "https://example.com/item2.jpg",
                "is_active": True,
            },
        ]

        # Create items
        for item in items_data:
            response = test_client.post("/items", json=item)
            assert response.status_code == 201

        # Get initial stats
        response = test_client.get("/items/stats")
        assert response.status_code == 200
        initial_data = response.json()
        assert initial_data["total_items"] == 2

        # Delete first item
        delete_response = test_client.delete("/items/1")
        assert delete_response.status_code == 204

        # Get stats after deletion
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()
        assert data["total_items"] == 1
        assert data["total_value"] == 60000.0  # 20000 * 3
        assert data["most_expensive"]["name"] == "Item 2"
        assert data["cheapest"]["name"] == "Item 2"

    def test_stats_large_values(self, test_client):
        """Test stats dengan nilai yang sangat besar."""
        item_data = {
            "name": "Expensive Item",
            "description": "Very expensive",
            "category": "premium",
            "slug": "expensive",
            "price": 999999999.99,
            "stock": 100,
            "image_url": "https://example.com/expensive.jpg",
            "is_active": True,
        }

        response = test_client.post("/items", json=item_data)
        assert response.status_code == 201

        # Get stats
        response = test_client.get("/items/stats")
        assert response.status_code == 200

        data = response.json()
        assert data["total_items"] == 1
        # 999999999.99 * 100 = 99999999999
        assert data["total_value"] == 99999999999.0
        assert data["most_expensive"]["price"] == 999999999.99
