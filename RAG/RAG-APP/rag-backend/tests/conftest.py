import pytest
from app import create_app, mongo
from flask_jwt_extended import create_access_token, create_refresh_token

@pytest.fixture(scope='module')
def test_client():
    app = create_app()
    app.app_context().push()
    app.config['TESTING'] = True
    app.config['MONGO_URI'] = 'mongodb://localhost:27017/rag_system_test'
    app.config['JWT_SECRET_KEY'] = 'test_secret_key'

    with app.test_client() as testing_client:
        with app.app_context():
            mongo.db.users.delete_many({})
            mongo.db.chats.delete_many({})
        yield testing_client

@pytest.fixture(scope='module')
def new_user():
    return {
        "email": "testuser@example.com",
        "password": "testpassword"
    }

@pytest.fixture(scope='module')
def access_token(new_user):
    return create_access_token(identity=new_user['email'])

@pytest.fixture(scope='module')
def refresh_token(new_user):
    return create_refresh_token(identity=new_user['email'])

@pytest.fixture(scope='module')
def test_chat_id():
      return {'value':''}