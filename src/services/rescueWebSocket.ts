import { useIncidentBoardStore } from '../stores/IncidentBoardStore';
import { API_BASE, WS_URL } from '../config/appConfig';

export interface RealtimeSosPayload {
  id: string;
  userId?: string;
  userName: string;
  userPhone: string;
  latitude: number;
  longitude: number;
  medicalInfo?: string;
  severity?: string;
  priority?: string;
  timestamp: string;
  locationName?: string;
  description?: string;
  message?: string;
  emergencyType?: string;
  status?: string;
  incidentId?: string;
}

class RescueWebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimer: any = null;
  private reconnectInterval: number = 2000;

  public connect() {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    console.log("API:", API_BASE.replace(/\/api\/v1\/?$/, ""));
    console.log("WS:", WS_URL);

    try {
      this.socket = new WebSocket(WS_URL);

      this.socket.onopen = () => {
        console.log("WebSocket OPEN");
        console.log("Waiting for SOS...");
        this.reconnectInterval = 2000;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      };


      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[RescueWebSocket] Message received:', data);

          const type = data.type || data.event || '';
          if (
            (type === 'CIVILIAN_SOS_TRIGGERED' || type === 'NEW_SOS') &&
            data.payload
          ) {
            console.log('[Frontend] NEW_SOS received:', data);
            this.handleIncomingSos(data.payload as RealtimeSosPayload);
          } else if (type === 'SOS_STATUS_UPDATED' && data.payload) {
            const payload = data.payload;
            if (payload.id && payload.status) {
              useIncidentBoardStore.getState().updateIncidentStatus(payload.id, payload.status);
            }
          }
        } catch (err) {
          console.error('[RescueWebSocket] Failed to parse WebSocket message:', err);
        }
      };

      this.socket.onclose = () => {
        console.warn(`[RescueWebSocket] Closed. Attempting reconnect in ${this.reconnectInterval / 1000}s...`);
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.error('[RescueWebSocket] WebSocket error:', err);
        this.socket?.close();
      };
    } catch (error) {
      console.error('[RescueWebSocket] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.reconnectInterval = Math.min(this.reconnectInterval * 1.5, 10000);
      this.connect();
    }, this.reconnectInterval);
  }

  private playEmergencyAlarmSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc1 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(880, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc1.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc1.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn('[RescueWebSocket] Web Audio alert play exception:', e);
    }
  }

  private handleIncomingSos(sos: RealtimeSosPayload) {
    const coords: [number, number] = [
      sos.longitude !== undefined ? Number(sos.longitude) : 77.588,
      sos.latitude !== undefined ? Number(sos.latitude) : 12.962,
    ];

    console.log('[Frontend] NEW_SOS received in WebSocket service:', sos);

    // Play Audio Siren Alert
    this.playEmergencyAlarmSound();

    // 1. Create Incident in EOC Store with status Waiting for Dispatcher
    useIncidentBoardStore.getState().createIncident({
      id: sos.id,
      sosId: sos.id,
      title: `LIVE SOS: ${sos.userName || 'Civilian User'}`,
      category: 'sos',
      severity: (sos.severity || sos.priority || 'critical') as any,
      status: (sos.status || 'Waiting for Dispatcher') as any,
      coordinates: coords,
      locationName: sos.locationName || `GPS: ${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`,
      reportedBy: sos.userName || 'Civilian Mobile App',
      contactNumber: sos.userPhone || '+91 98112 33441',
      affectedCount: 1,
      description: sos.message || sos.description || sos.medicalInfo || 'Immediate emergency distress ping triggered.',
    } as any);
    console.log('[Frontend] Store updated with new SOS:', sos.id);

    // 2. Dispatch custom event for Map auto-centering, popup, and notification
    window.dispatchEvent(
      new CustomEvent('RESCUE_SOS_RECEIVED', {
        detail: {
          coordinates: coords,
          sos,
        },
      })
    );
  }

}

export const rescueWebSocketService = new RescueWebSocketService();
