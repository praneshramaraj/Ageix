def test_sos_pipeline(client):
    sos_payload = {
        "userName": "Emergency Victim",
        "userPhone": "+91 99999 11111",
        "latitude": 12.9620,
        "longitude": 77.5880,
        "medicalInfo": "Asthma",
        "severity": "critical"
    }
    response = client.post("/api/v1/sos", json=sos_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "SOS received & broadcasted"
    assert data["sos"]["userName"] == "Emergency Victim"

    # List SOS
    list_response = client.get("/api/v1/sos")
    assert list_response.status_code == 200
    sos_list = list_response.json()["sosList"]
    assert len(sos_list) >= 1
