import json
from typing import List, Dict, Set
from fastapi import WebSocket, WebSocketDisconnect

class WebSocketManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.channel_subscriptions: Dict[str, Set[WebSocket]] = {
            "sos": set(),
            "incidents": set(),
            "missions": set(),
            "teams": set(),
            "vehicles": set(),
            "resources": set(),
            "ai": set(),
        }

    async def connect(self, websocket: WebSocket, channel: str = "sos"):
        await websocket.accept()
        self.active_connections.add(websocket)
        if channel in self.channel_subscriptions:
            self.channel_subscriptions[channel].add(websocket)
        print(f"[WebSocketManager] Client connected to '{channel}'. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        for sub_set in self.channel_subscriptions.values():
            if websocket in sub_set:
                sub_set.remove(websocket)
        print(f"[WebSocketManager] Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast_to_channel(self, channel: str, message: dict):
        subscribers = self.channel_subscriptions.get(channel, self.active_connections)
        disconnected = []
        for connection in list(subscribers):
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"[WebSocketManager] Failed to send message: {e}")
                disconnected.append(connection)

        for conn in disconnected:
            self.disconnect(conn)

    async def broadcast_global(self, message: dict):
        disconnected = []
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"[WebSocketManager] Global broadcast failed: {e}")
                disconnected.append(connection)

        for conn in disconnected:
            self.disconnect(conn)

ws_manager = WebSocketManager()
