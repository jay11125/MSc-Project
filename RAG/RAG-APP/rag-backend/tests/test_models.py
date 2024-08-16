from app.models import User

def test_create_user():
    user = User.create_user("testuser@example.com", "testpassword")
    assert user is not None

def test_create_existing_user():
    user = User.create_user("testuser@example.com", "testpassword")
    assert user is None

def test_verify_user():
    user = User.verify_user("testuser@example.com", "testpassword")
    assert user is True

def test_verify_invalid_user():
    user = User.verify_user("invalid@example.com", "wrongpassword")
    assert user is False

    