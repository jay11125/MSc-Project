def test_signup(test_client, new_user):
    response = test_client.post('/auth/signup', json=new_user)
    assert response.status_code == 201
    assert response.json['msg'] == "User created successfully"

def test_signup_existing_user(test_client, new_user):
    response = test_client.post('/auth/signup', json=new_user)
    assert response.status_code == 400
    assert response.json['msg'] == "User already exists"

def test_login(test_client, new_user):
    response = test_client.post('/auth/login', json=new_user)
    assert response.status_code == 200
    assert 'access_token' in response.json
    assert 'refresh_token' in response.json

def test_login_invalid_credentials(test_client):
    response = test_client.post('/auth/login', json={"email": "invalid@example.com", "password": "wrongpassword"})
    assert response.status_code == 401
    assert response.json['msg'] == "Invalid credentials"

def test_refresh_token(test_client, refresh_token):
    headers = {'Authorization': f'Bearer {refresh_token}'}
    response = test_client.post('/auth/refresh', headers=headers)
    assert response.status_code == 200
    assert 'access_token' in response.json
