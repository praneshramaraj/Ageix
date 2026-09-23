import { useIncidentBoardStore } from '../stores/IncidentBoardStore';

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
  private reconnectInterval: number = 3000;
  private url: string = 'ws://localhost:8000/ws/sos';

  public connect() {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[Frontend] WebSocket connected');
        console.log('[RescueWebSocket] Connected to AEGISX Shared Backend WebSocket Server.');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[RescueWebSocket] Message received:', data);

          if ((data.type === 'CIVILIAN_SOS_TRIGGERED' || data.type === 'NEW_SOS' || data.event === 'NEW_SOS') && data.payload) {
            console.log('[Frontend] NEW_SOS received:', data);
            this.handleIncomingSos(data.payload as RealtimeSosPayload);
          }
        } catch (err) {
          console.error('[RescueWebSocket] Failed to parse WebSocket message:', err);
        }
      };

      this.socket.onclose = () => {
        console.warn('[RescueWebSocket] WebSocket closed. Attempting reconnect in 3s...');
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.socket.onerror = (err) => {
        console.error('[RescueWebSocket] WebSocket error:', err);
        this.socket?.close();
      };
    } catch (error) {
      console.error('[RescueWebSocket] Connection error:', error);
    }
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
    const coords: [number, number] = [sos.longitude || 77.588, sos.latitude || 12.962];

    // Play Audio Siren Alert
    this.playEmergencyAlarmSound();

    // 1. Create Incident in EOC Store with status Waiting for Dispatcher
    useIncidentBoardStore.getState().createIncident({
      title: `LIVE SOS: ${sos.userName || 'Civilian User'}`,
      category: 'sos',
      severity: (sos.severity || sos.priority || 'critical') as any,
      status: 'Waiting for Dispatcher' as any,
      coordinates: coords,
      locationName: sos.locationName || `GPS: ${sos.latitude.toFixed(4)}, ${sos.longitude.toFixed(4)}`,
      reportedBy: sos.userName || 'Civilian Mobile App',
      contactNumber: sos.userPhone || '+91 98112 33441',
      affectedCount: 1,
      description: sos.message || sos.description || sos.medicalInfo || 'Immediate emergency distress ping triggered.',
    });
    console.log('[Frontend] Store updated with new SOS:', sos);

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

