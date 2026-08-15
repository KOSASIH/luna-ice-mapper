"""Pytest test suite for Artemis API endpoints and system health checks."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from ..main import app
from ..database import Base, get_db
from ..seed.seed_data import seed_database

# Set up in-memory SQLite database for test isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_test_db():
    """Create fresh database tables and seed sample data before each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    """Return FastAPI TestClient instance."""
    return TestClient(app)


def test_health_check(client: TestClient):
    """Test /health endpoint returns online status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "version" in data


def test_swagger_docs(client: TestClient):
    """Test OpenAPI /docs UI endpoint is accessible."""
    response = client.get("/docs")
    assert response.status_code == 200
    assert "text/html" in response.headers["content-type"]


def test_list_landing_sites(client: TestClient):
    """Test listing candidate Artemis landing sites."""
    response = client.get("/api/artemis/landing-sites")
    assert response.status_code == 200
    sites = response.json()
    assert isinstance(sites, list)
    assert len(sites) >= 3
    assert any("Shackleton" in s["name"] for s in sites)


def test_filter_landing_sites_by_ice(client: TestClient):
    """Test filtering landing sites by minimum ice concentration percentage."""
    response = client.get("/api/artemis/landing-sites?min_ice_concentration=5.0")
    assert response.status_code == 200
    sites = response.json()
    assert len(sites) >= 1
    for site in sites:
        assert site["ice_concentration_pct"] >= 5.0


def test_get_landing_site_by_id(client: TestClient):
    """Test retrieving a specific landing site by ID."""
    response = client.get("/api/artemis/landing-sites/1")
    assert response.status_code == 200
    site = response.json()
    assert site["id"] == 1
    assert "name" in site


def test_get_nonexistent_landing_site(client: TestClient):
    """Test 404 response for non-existent landing site ID."""
    response = client.get("/api/artemis/landing-sites/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Landing site with ID 9999 not found"


def test_analyze_landing_site_coordinates(client: TestClient):
    """Test coordinate analysis for ice depth and ISRU potential."""
    payload = {"latitude": -89.78, "longitude": 202.0}
    response = client.post("/api/artemis/landing-sites/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["latitude"] == -89.78
    assert data["longitude"] == 202.0
    assert "ice_depth_estimate_m" in data
    assert "accessibility_score" in data
    assert "isru_potential" in data
    assert "nearest_psr" in data


def test_psr_search_radius(client: TestClient):
    """Test spatial PSR search query with center coordinate and search radius."""
    params = {
        "latitude": -89.9,
        "longitude": 0.0,
        "radius_km": 100.0,
        "min_h2o_pct": 1.0
    }
    response = client.get("/api/artemis/psr-search", params=params)
    assert response.status_code == 200
    psrs = response.json()
    assert isinstance(psrs, list)
    assert len(psrs) >= 1
    assert any(p["name"] == "Shackleton Crater PSR" for p in psrs)
    assert "distance_km" in psrs[0]
