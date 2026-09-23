def test_register_and_login(client):
    # Register test user
    reg_payload = {
        "fullName": "Test Rescuer",
        "email": "rescuer@aegisx.org",
        "phone": "+91 99887 76655",
        "password": "password123",
        "bloodGroup": "B+",
        "role": "Rescuer"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

    # Login test user
    login_payload = {
        "email": "rescuer@aegisx.org",
        "password": "password123"
    }
    response_login = client.post("/api/v1/auth/login", json=login_payload)
    assert response_login.status_code == 200
    login_data = response_login.json()
    assert "access_token" in login_data
