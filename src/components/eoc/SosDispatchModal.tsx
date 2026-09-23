import React, { useState } from 'react';
import {
  AlertTriangle,
  User,
  Phone,
  Clock,
  MapPin,
  Heart,
  Shield,
  Truck,
  CheckCircle2,
  Navigation2,
  X,
  Users,
  Send,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useTeamStore } from '../../stores/TeamStore';
import { useMissionStore } from '../../stores/MissionStore';

export interface SosDispatchData {
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

interface SosDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sos: SosDispatchData | null;
  onAssignSuccess?: (updatedSos: SosDispatchData) => void;
  onFocusMap?: (lng: number, lat: number) => void;
}

// Haversine formula to compute distance in KM
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const SosDispatchModal: React.FC<SosDispatchModalProps> = ({
  isOpen,
  onClose,
  sos,
  onAssignSuccess,
  onFocusMap,
}) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [assignedResult, setAssignedResult] = useState<{
    teamName: string;
    vehicleName: string;
    eta: string;
    distanceKm: number;
  } | null>(null);

  const { teams } = useTeamStore();
  const { createMission } = useMissionStore();

  if (!isOpen || !sos) return null;

  // Calculate required team size based on disaster/description
  const getRequiredTeamMembers = (): number => {
    if (sos.requiredTeamMembers && sos.requiredTeamMembers > 0) return sos.requiredTeamMembers;
    const desc = (sos.description || '').toLowerCase();
    if (desc.includes('fire')) return 6;
    if (desc.includes('flood')) return 4;
    if (desc.includes('medical') || desc.includes('injury')) return 2;
    if (desc.includes('accident') || desc.includes('crash')) return 4;
    return 4;
  };

  const requiredTeamCount = getRequiredTeamMembers();

  // Find nearest team using GPS Haversine distance
  const calculateNearestTeam = () => {
    let nearest = teams[0];
    let minDistance = Infinity;

    teams.forEach((t) => {
      const [tLon, tLat] = t.coordinates || [77.588, 12.962];
      const dist = getDistanceKm(sos.latitude, sos.longitude, tLat, tLon);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = t;
      }
    });

    const calculatedEta = `${Math.max(4, Math.round(minDistance * 2.5 + 3))} mins`;
    return {
      team: nearest || teams[0],
      distanceKm: minDistance === Infinity ? 2.4 : minDistance,
      eta: calculatedEta,
    };
  };

  const handleAssignTeamClick = async () => {
    setIsAssigning(true);
    const { team, distanceKm, eta } = calculateNearestTeam();
    const vehicleName = team.equipment?.[0] || 'Rapid Response Rescue Vehicle R-01';

    try {
      const res = await fetch(`http://localhost:8000/api/v1/sos/${sos.id}/assign-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          teamName: team.name,
          vehicleId: `veh_${team.id}`,
          vehicleName: vehicleName,
          eta: eta,
        }),
      });

      const updatedSos: SosDispatchData = {
        ...sos,
        status: 'En Route',
        assignedTeam: team.name,
        assignedVehicle: vehicleName,
        eta: eta,
        requiredTeamMembers: requiredTeamCount,
      };

      setAssignedResult({
        teamName: team.name,
        vehicleName: vehicleName,
        eta: eta,
        distanceKm: distanceKm,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mission) {
          createMission({
            title: data.mission.title || `Rescue Mission for ${sos.userName}`,
            priority: 'CRITICAL',
            status: 'In Progress' as any,
            progressPercent: 15,
            description: `Emergency dispatch for ${sos.userName} (${sos.userPhone}). Medical notes: ${sos.medicalInfo || 'None'}. Required team size: ${requiredTeamCount}`,
            targetLocation: [sos.longitude, sos.latitude],
            locationName: sos.locationName || 'Sector 4',
            assignedTeamIds: [team.id],
            assignedVehicleIds: [`veh_${team.id}`],
          });
        }
      }

      if (onAssignSuccess) {
        onAssignSuccess(updatedSos);
      }
    } catch (e) {
      console.error('[SosDispatchModal] Assign team error:', e);
      setAssignedResult({
        teamName: team.name,
        vehicleName: vehicleName,
        eta: eta,
        distanceKm: distanceKm,
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleLocationClick = async () => {
    setIsSendingSms(true);
    try {
      // 1. Trigger backend SMS alert
      await fetch(`http://localhost:8000/api/v1/sos/${sos.id}/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: '7806994340',
        }),
      });
    } catch (e) {
      console.error('[SosDispatchModal] SMS trigger error:', e);
    } finally {
      setIsSendingSms(false);
    }

    // 2. Dispatch custom event for Map component to trigger flyTo zoom 17 & victim popup
    window.dispatchEvent(
      new CustomEvent('RESCUE_SOS_RECEIVED', {
        detail: {
          coordinates: [sos.longitude, sos.latitude],
          sos: {
            ...sos,
            requiredTeamMembers: requiredTeamCount,
          },
          zoom: 17,
          highlight: true,
        },
      })
    );

    if (onFocusMap) {
      onFocusMap(sos.longitude, sos.latitude);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0A1A24] border-2 border-red-500/80 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-white relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E3440] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/30 border border-red-500 rounded-xl animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-red-400 text-xs tracking-wider uppercase">
                  EMERGENCY SOS DISPATCH PROTOCOL
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                  {sos.severity.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white font-mono mt-0.5">
                Incident ID: {sos.incidentId || `INC-${sos.id.slice(-6)}`}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#10232C] rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Civilian Full Details Card */}
        <div className="bg-[#10232C] border border-[#1E3440] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#1E3440] pb-2">
            <h3 className="font-mono font-bold text-xs text-[#00D4FF] uppercase flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#00D4FF]" /> Civilian Profile Details
            </h3>
            <span className="text-[10px] font-mono text-[#AAB6C3] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#FFB000]" /> {sos.timestamp}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Full Name</span>
              <span className="font-bold text-white font-mono">{sos.userName}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Username</span>
              <span className="font-bold text-[#00D4FF] font-mono">@{sos.username || 'civilian_user'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Phone Number</span>
              <span className="font-bold text-[#3DDC84] font-mono flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#3DDC84]" /> {sos.userPhone}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Age & Gender</span>
              <span className="font-bold text-white font-mono">{sos.age || 28} Yrs • {sos.gender || 'Male'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Blood Group</span>
              <span className="font-bold text-red-400 font-mono flex items-center gap-1">
                <Heart className="w-3 h-3 text-red-500 fill-red-500/20" /> {sos.bloodGroup || 'O+'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-gray-400 block uppercase">Emergency Contact</span>
              <span className="font-bold text-orange-400 font-mono">{sos.emergencyContact || '+91 78069 94340'}</span>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-mono text-gray-400 block uppercase">GPS Coordinates</span>
              <span className="font-mono text-xs text-[#00D4FF] flex items-center gap-1 bg-[#07161E] p-1.5 rounded border border-[#1E3440]">
                <MapPin className="w-3.5 h-3.5 text-red-400" /> Lat {sos.latitude.toFixed(5)}, Lng {sos.longitude.toFixed(5)} ({sos.locationName || 'GPS Location Ping'})
              </span>
            </div>
            {sos.medicalInfo && (
              <div className="col-span-2">
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Medical Notes & History</span>
                <span className="text-xs text-red-200 font-mono block bg-red-950/40 p-2 rounded border border-red-500/30">
                  {sos.medicalInfo}
                </span>
              </div>
            )}
          </div>

          {/* Required Team Members Banner */}
          <div className="flex items-center justify-between bg-[#07161E] p-2.5 rounded-lg border border-[#00D4FF]/30 text-xs">
            <span className="font-mono text-[#AAB6C3] flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#00D4FF]" /> Estimated Team Members Needed:
            </span>
            <span className="font-mono font-bold text-[#00D4FF] text-sm bg-[#00D4FF]/10 px-2 py-0.5 rounded border border-[#00D4FF]/40">
              {requiredTeamCount} Rescuers
            </span>
          </div>
        </div>

        {/* Assigned Result Feedback Banner */}
        {(assignedResult || sos.assignedTeam) && (
          <div className="bg-[#0A261E] border border-[#3DDC84] rounded-xl p-3.5 space-y-1 text-xs">
            <div className="flex items-center justify-between text-[#3DDC84] font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> TEAM ASSIGNED & EN ROUTE
              </span>
              <span>ETA: {assignedResult?.eta || sos.eta || '8 mins'}</span>
            </div>
            <div className="text-gray-300 font-mono text-[11px] grid grid-cols-2 gap-1 pt-1">
              <div>Team: <span className="text-white font-bold">{assignedResult?.teamName || sos.assignedTeam}</span></div>
              <div>Vehicle: <span className="text-white font-bold">{assignedResult?.vehicleName || sos.assignedVehicle}</span></div>
              <div>Distance: <span className="text-white font-bold">{assignedResult?.distanceKm || 2.4} km</span></div>
              <div>Status: <span className="text-[#3DDC84] font-bold">En Route</span></div>
            </div>
          </div>
        )}

        {/* TWO BUTTONS ONLY */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Button A: Assign Team */}
          <button
            onClick={handleAssignTeamClick}
            disabled={isAssigning || sos.status === 'En Route'}
            className={`py-3.5 px-4 rounded-xl font-mono font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              sos.status === 'En Route'
                ? 'bg-[#3DDC84]/20 text-[#3DDC84] border border-[#3DDC84]/40 cursor-default'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/50 shadow-emerald-900/30'
            }`}
          >
            {isAssigning ? (
              <Activity className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#3DDC84]" />
            )}
            {sos.status === 'En Route' ? 'Team Assigned' : 'Assign Team'}
          </button>

          {/* Button B: Location */}
          <button
            onClick={handleLocationClick}
            disabled={isSendingSms}
            className="py-3.5 px-4 rounded-xl font-mono font-bold text-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/30"
          >
            {isSendingSms ? (
              <Activity className="w-5 h-5 animate-spin" />
            ) : (
              <Navigation2 className="w-5 h-5 text-[#00D4FF]" />
            )}
            Location
          </button>
        </div>
      </div>
    </div>
  );
};
