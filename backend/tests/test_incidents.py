def test_incidents_and_missions(client):
    # Test Incidents List
    res_inc = client.get("/api/v1/incidents")
    assert res_inc.status_code == 200
    assert "incidents" in res_inc.json()

    # Test Missions List
    res_msn = client.get("/api/v1/missions")
    assert res_msn.status_code == 200
    assert "missions" in res_msn.json()
