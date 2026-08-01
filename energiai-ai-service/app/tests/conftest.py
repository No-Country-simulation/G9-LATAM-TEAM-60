import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(scope="module")
def test_client():
    """Fixture que provee un cliente HTTP para interactuar con los endpoints de FastAPI."""
    with TestClient(app) as client:
        yield client