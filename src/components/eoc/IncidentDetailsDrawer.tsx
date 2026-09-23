import React from 'react';
import { Badge } from '../ui/Badge';
import {
  X,
  User,
  Phone,
  MapPin,
  FileText,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CloudRain,
  Radio,
  UserX,
  Navigation2,
  CheckCircle2,
  Image as ImageIcon,
  Activity,
  Award,
} from 'lucide-react';

export interface IncidentDetailData {
  id: string;
  code: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  citizenName: string;
  citizenPhone: string;
  latitude: number;
  longitude: number;
  locationName: string;
  district: string;
  medicalNotes?: string;
  medicalInfo?: string;
  description?: string;
  timestamp: string;
  assignedTeam?: string;
  assignedVehicle?: string;
  eta?: string;
  images?: string[];
  history?: { time: string; action: string; actor: string }[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  incident: IncidentDetailData | null;
  onAssignTeamClick?: (incident: IncidentDetailData) => void;
  onFocusMapClick?: (lng: number, lat: number) => void;
}

export const IncidentDetailsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  incident,
  onAssignTeamClick,
  onFocusMapClick,
}) => {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="w-full max-w-lg bg-[#0A1A22] border-l border-[#1E3440] h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#10232C] border-b border-[#1E3440] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={incident.severity === 'critical' ? 'danger' : 'warning'}>
                {incident.severity.toUpperCase()} PRIORITY
              </Badge>
              <span className="font-mono font-bold text-[#00D4FF] text-xs">{incident.code}</span>
            </div>
            <h2 className="text-base font-bold text-white leading-tight">{incident.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#07161E] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-[#1E3440] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Status Banner */}
          <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Mission Status</span>
              <span className="font-mono font-bold text-[#3DDC84] text-sm">{incident.status}</span>
            </div>
            {incident.assignedTeam && (
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Assigned Unit</span>
                <span className="font-mono font-bold text-[#00D4FF] text-xs">{incident.assignedTeam}</span>
              </div>
            )}
          </div>

          {/* Citizen Info Section */}
          <div className="bg-[#10232C] border border-[#1E3440] rounded-xl p-4 space-y-3">
            <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
              <User className="w-4 h-4 text-[#00D4FF]" /> Citizen Telemetry & Contact
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#AAB6C3] text-[10px] block font-mono">Citizen Name</span>
                <span className="font-bold text-white text-xs">{incident.citizenName}</span>
              </div>
              <div>
                <span className="text-[#AAB6C3] text-[10px] block font-mono">Phone Number</span>
                <span className="font-mono font-bold text-[#3DDC84] text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {incident.citizenPhone}
                </span>
              </div>
              <div>
                <span className="text-[#AAB6C3] text-[10px] block font-mono">District / Sector</span>
                <span className="font-bold text-white text-xs">{incident.district}</span>
              </div>
              <div>
                <span className="text-[#AAB6C3] text-[10px] block font-mono">Time Reported</span>
                <span className="font-mono text-[#FFB000] text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {incident.timestamp}
                </span>
              </div>
            </div>
          </div>

          {/* GPS Coordinates & Map Location */}
          <div className="bg-[#10232C] border border-[#1E3440] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E3440] pb-2">
              <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" /> GPS Coordinates & Location
              </h3>
              {onFocusMapClick && (
                <button
                  onClick={() => onFocusMapClick(incident.longitude, incident.latitude)}
                  className="px-2.5 py-1 bg-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/30 font-mono font-bold text-[10px] rounded flex items-center gap-1"
                >
                  <Navigation2 className="w-3 h-3" /> Fly Camera
                </button>
              )}
            </div>
            <div className="font-mono text-xs text-[#00D4FF] bg-[#07161E] p-2.5 rounded-lg border border-[#1E3440]">
              Lat: {incident.latitude.toFixed(4)} • Lng: {incident.longitude.toFixed(4)} ({incident.locationName})
            </div>
          </div>

          {/* Medical Notes & Emergency Description */}
          <div className="bg-[#10232C] border border-[#1E3440] rounded-xl p-4 space-y-3">
            <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
              <FileText className="w-4 h-4 text-[#FFB000]" /> Emergency Description & Medical Notes
            </h3>
            {incident.medicalInfo && (
              <div className="p-2.5 bg-red-950/40 border border-red-500/30 rounded-lg text-red-200">
                <span className="font-bold block text-[10px] uppercase font-mono text-red-400">Medical Condition Alert:</span>
                {incident.medicalInfo}
              </div>
            )}
            <p className="text-[#AAB6C3] leading-relaxed bg-[#07161E] p-3 rounded-lg border border-[#1E3440]">
              {incident.description || 'Immediate tactical search and rescue extraction required for distress ping.'}
            </p>
          </div>

          {/* Images / Media Attachments */}
          <div className="bg-[#10232C] border border-[#1E3440] rounded-xl p-4 space-y-3">
            <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
              <ImageIcon className="w-4 h-4 text-[#00D4FF]" /> Field Photographs & Snapshots
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-28 bg-[#07161E] border border-[#1E3440] rounded-lg flex items-center justify-center text-gray-500 text-[11px] font-mono">
                📸 Aerial Drone Snapshot
              </div>
              <div className="h-28 bg-[#07161E] border border-[#1E3440] rounded-lg flex items-center justify-center text-gray-500 text-[11px] font-mono">
                📸 Ground Recon Photo
              </div>
            </div>
          </div>

          {/* Audit Trail History */}
          <div className="bg-[#10232C] border border-[#1E3440] rounded-xl p-4 space-y-3">
            <h3 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
              <Activity className="w-4 h-4 text-[#3DDC84]" /> Audit History Log
            </h3>
            <div className="space-y-2 font-mono text-[11px]">
              {(incident.history || [
                { time: incident.timestamp, action: 'SOS Signal Received by EOC Gateway', actor: 'System' },
                { time: 'Just now', action: 'Incident Queued for Dispatcher Triage', actor: 'EOC Engine' },
              ]).map((h, i) => (
                <div key={i} className="flex justify-between items-center bg-[#07161E] p-2 rounded border border-[#1E3440]">
                  <span className="text-[#AAB6C3]">{h.action}</span>
                  <span className="text-[#00D4FF] font-bold text-[10px]">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#10232C] border-t border-[#1E3440] flex items-center gap-3">
          {onAssignTeamClick && incident.status !== 'Completed' && (
            <button
              onClick={() => onAssignTeamClick(incident)}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
            >
              <CheckCircle2 className="w-4 h-4" /> Assign Tactical Team
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-[#1E3440] hover:bg-[#2A4858] text-white font-mono font-bold text-xs rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
