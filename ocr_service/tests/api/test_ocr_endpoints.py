import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint returns the expected message"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Medical Document OCR Service is online"}

def test_health_check():
    """Test the health check endpoint returns healthy status"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"