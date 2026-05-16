import os
import sys

# Must be set before any app imports so database.py picks up the test URL
os.environ.setdefault("DATABASE_URL", "sqlite://")

_tests_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.dirname(_tests_dir)
sys.path.insert(0, _tests_dir)   # makes tests/data.py importable as 'data'
sys.path.insert(0, _backend_dir)  # makes backend modules importable

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from database import Base, get_db
from app import app

# StaticPool keeps a single connection alive so the in-memory DB persists
# across the multiple sessions a single test may open.
_test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
_TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=_test_engine)


@pytest.fixture(scope="function")
def client():
    Base.metadata.create_all(bind=_test_engine)

    def _override_get_db():
        db = _TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=_test_engine)


