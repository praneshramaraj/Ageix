def test_websocket_ping_pong(client):
    with client.websocket_connect("/ws/sos") as websocket:
        websocket.send_json({"type": "PING"})
        data = websocket.receive_json()
        assert data == {"type": "PONG"}
