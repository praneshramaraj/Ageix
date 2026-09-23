import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Radio, AlertTriangle, MapPin, Phone, User, Clock, CheckCircle2, ShieldAlert, Navigation2, XCircle, Heart, Users } from 'lucide-react';
import { useIncidentBoardStore } from '../../stores/IncidentBoardStore';
import { useMissionStore } from '../../stores/MissionStore';
import { SosDispatchModal, SosDispatchData } from './SosDispatchModal';

export interface SosItem {
  id: string;
  userName: string;
  username?: string;
  userPhone: string;
  age?: number;
  bloodGroup?: string;
  gender?: string;
  emergencyContact?: string;
  latitude: number;
  longitude: number;
  medicalInfo?: string;
  severity: string;
  status: string;
  timestamp: string;
  locationName?: string;
  description?: string;
  assignedTeam?: string;
  assignedVehicle?: string;
  eta?: string;
  requiredTeamMembers?: number;
  incidentId?: string;
}

export const EmergencySosPanel: React.FC<{ onFocusMap?: (lng: number, lat: number) => void }> = ({ onFocusMap }) => {
  const [sosList, setSosList] = useState<SosItem[]>([]);
  const [activeAlert, setActiveAlert] = useState<SosItem | null>(null);
  const [selectedSosForModal, setSelectedSosForModal] = useState<SosItem | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  console.log('[Frontend] EmergencySosPanel rendered, count:', sosList.length);

  const { createMission } = useMissionStore();

  const fetchSosList = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/sos');
      if (res.ok) {
        const data = await res.json();
        setSosList(data.sosList || []);
      }
    } catch (e) {
      console.error('[EmergencySosPanel] Error fetching SOS list:', e);
    }
  };

  useEffect(() => {
    fetchSosList();

    const handleSosReceived = (event: CustomEvent) => {
      console.log('[Frontend] NEW_SOS received in EmergencySosPanel event handler:', event.detail);
      const newSos = event.detail?.sos as SosItem;
      if (newSos) {
        setSosList((prev) => [newSos, ...prev.filter((item) => item.id !== newSos.id)]);
        setActiveAlert(newSos);
        
        // Auto-clear toast alert after 8 seconds
        setTimeout(() => setActiveAlert(null), 8000);
      }
    };

    window.addEventListener('RESCUE_SOS_RECEIVED', handleSosReceived as EventListener);
    return () => {
      window.removeEventListener('RESCUE_SOS_RECEIVED', handleSosReceived as EventListener);
    };
  }, []);

  const handleCardClick = (sos: SosItem) => {
    setSelectedSosForModal(sos);
  };

  const handleAssignTeam = async (sos: SosItem) => {
    setLoadingId(sos.id);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/sos/${sos.id}/assign-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: 'team_alpha',
          teamName: 'NDRF Alpha Rescue Unit 1',
          vehicleId: 'veh_01',
          vehicleName: 'Rapid Response Boat R-04',
          eta: '8 mins',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local list
        setSosList((prev) =>
          prev.map((item) =>
            item.id === sos.id
              ? {
                  ...item,
                  status: 'En Route',
                  assignedTeam: 'NDRF Alpha Rescue Unit 1',
                  assignedVehicle: 'Rapid Response Boat R-04',
                  eta: '8 mins',
                }
              : item
          )
        );

        if (data.mission) {
          createMission({
            title: data.mission.title,
            priority: data.mission.priority || 'CRITICAL',
            status: 'In Progress' as any,
            progressPercent: 25,
            description: `Tactical rescue for ${sos.userName}`,
            targetLocation: [sos.longitude, sos.latitude],
            locationName: sos.locationName || 'Sector 4',
            assignedTeamIds: ['team_alpha'],
            assignedVehicleIds: ['veh_01'],
          });
        }
      }
    } catch (e) {
      console.error('[EmergencySosPanel] Assign team failed:', e);
      // Fallback local state update
      setSosList((prev) =>
        prev.map((item) =>
          item.id === sos.id
            ? {
                ...item,
                status: 'En Route',
                assignedTeam: 'NDRF Alpha Rescue Unit 1',
                assignedVehicle: 'Rapid Response Boat R-04',
                eta: '8 mins',
              }
            : item
        )
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (sos: SosItem) => {
    try {
      await fetch(`http://localhost:8000/api/v1/sos/${sos.id}/status?status_str=REJECTED`, {
        method: 'PATCH',
      });
      setSosList((prev) => prev.filter((item) => item.id !== sos.id));
    } catch (e) {
      setSosList((prev) => prev.filter((item) => item.id !== sos.id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Real-time Notification Banner */}
      {activeAlert && (
        <div className="bg-red-950/90 border-2 border-red-500 text-white p-4 rounded-xl shadow-2xl animate-pulse flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-600 rounded-lg animate-bounce">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-red-400 text-xs uppercase tracking-wider">🚨 NEW CRITICAL SOS SIGNAL</span>
                <Badge variant="danger" size="sm">CRITICAL</Badge>
              </div>
              <h3 className="font-bold text-base text-white mt-0.5">{activeAlert.userName} ({activeAlert.userPhone})</h3>
              <p className="text-xs text-red-200 mt-1">
                Location: Lat {activeAlert.latitude.toFixed(4)}, Lng {activeAlert.longitude.toFixed(4)} ({activeAlert.locationName})
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="text-red-400 hover:text-white p-1"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* EMERGENCY SOS PANEL */}
      <Card
        title="Emergency SOS Signals"
        subtitle="Live Distress Feeds from Civilian Mobile Devices"
        glow="danger"
        action={
          <div className="flex items-center gap-2">
            <Badge variant="danger" pulse>
              {sosList.filter((s) => s.status !== 'RESOLVED' && s.status !== 'REJECTED').length} ACTIVE PINGS
            </Badge>
          </div>
        }
      >
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {sosList.length === 0 ? (
            <div className="text-center py-8 text-[#AAB6C3] font-mono text-xs">
              No active distress pings recorded.
            </div>
          ) : (
            sosList.map((sos) => (
              <div
                key={sos.id}
                onClick={() => handleCardClick(sos)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  sos.status === 'En Route'
                    ? 'bg-[#0A261E] border-[#3DDC84]/50'
                    : 'bg-[#10232C] border-red-500/40 hover:border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-red-400 text-xs">{sos.id}</span>
                    <Badge variant={sos.severity === 'critical' ? 'danger' : 'warning'}>
                      {sos.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      sos.status === 'En Route'
                        ? 'bg-[#3DDC84]/20 text-[#3DDC84]'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {sos.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Citizen Name</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <User className="w-3 h-3 text-[#00D4FF]" /> {sos.userName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Phone & Username</span>
                    <span className="font-bold text-white flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-[#3DDC84]" /> {sos.userPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Blood & Contact</span>
                    <span className="font-mono text-[11px] text-red-400 flex items-center gap-1 font-bold">
                      <Heart className="w-3 h-3 text-red-500" /> {sos.bloodGroup || 'O+'} • {sos.emergencyContact || '+91 78069 94340'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">GPS Coordinates</span>
                    <span className="font-mono text-[11px] text-[#00D4FF] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-400" /> {sos.latitude.toFixed(4)}, {sos.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>

                {sos.medicalInfo && (
                  <div className="text-xs text-red-300 bg-[#07161E] p-1.5 rounded border border-red-500/20 mb-2 font-mono">
                    Medical Notes: {sos.medicalInfo}
                  </div>
                )}

                {/* Assigned Team & Mission Status display */}
                {sos.assignedTeam && (
                  <div className="p-2 bg-[#07161E] rounded-lg border border-[#3DDC84]/40 mb-2 text-xs space-y-0.5 font-mono">
                    <div className="flex justify-between items-center text-[#3DDC84] font-bold text-[11px]">
                      <span>ASSIGNED: {sos.assignedTeam}</span>
                      <span>ETA: {sos.eta || '8 mins'}</span>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-[#1E3440]">
                  <span className="text-[10px] font-mono text-[#00D4FF] flex items-center gap-1">
                    <Users className="w-3 h-3" /> Req: {sos.requiredTeamMembers || 4} Rescuers
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSosForModal(sos);
                    }}
                    className="py-1 px-3 bg-[#00D4FF]/20 hover:bg-[#00D4FF] text-[#00D4FF] hover:text-[#07161E] text-xs font-mono font-bold rounded transition-all"
                  >
                    Open Dispatch Protocol
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* SOS Dispatch Modal */}
      <SosDispatchModal
        isOpen={!!selectedSosForModal}
        onClose={() => setSelectedSosForModal(null)}
        sos={selectedSosForModal}
        onAssignSuccess={(updated) => {
          setSosList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }}
        onFocusMap={onFocusMap}
      />
    </div>
  );
};
