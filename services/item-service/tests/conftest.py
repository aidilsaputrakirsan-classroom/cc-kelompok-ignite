"""
Konfigurasi test untuk Item Service — mock auth verification.
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import patch, AsyncMock

sys.path.insert(0, str(Path(__file__).parent.parent))


# Mock auth before importing main to avoid database connection issues
def mock_verify_token_with_auth_service(*args, **kwargs):
    """Mock auth verification."""
    return AsyncMock(
        return_value={"id": 1, "email": "test@example.com", "name": "Test User"}
    )()


# Patch auth_client before importing main
with patch(
    "auth_client.verify_token_with_auth_service",
    side_effect=mock_verify_token_with_auth_service,
):
    from main import app, fake_items_db
    import main


@pytest.fixture(autouse=True)
def reset_fake_db_before_each():
    """Reset fake database sebelum setiap test."""
    main.fake_items_db.clear()
    main.item_id_counter = 1
    yield
    # Cleanup
    main.fake_items_db.clear()
    main.item_id_counter = 1
