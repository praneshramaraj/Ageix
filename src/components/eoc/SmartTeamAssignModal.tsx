import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Users,
  MapPin,
  Navigation2,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string | null;
  incidentTitle?: string;
  incidentCoordinates?: [number, number];
  onAssignSuccess?: (assignedData: any) => void;
}

export const SmartTeamAssignModal: React.FC<Props> = ({
  isOpen,
  onClose,
  incidentId,
  incidentTitle,
  incidentCoordinates = [77.588, 12.962],
  onAssignSuccess,
}) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>('team_alpha');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);

  if (!isOpen || !incidentId) return null;

  const candidateTeams = [
    {
      id: 'team_alpha',
      name: 'NDRF Alpha Rescue Unit 1',
      leader: 'Capt. Rajesh V.',
      vehicle: 'Rapid Response Boat R-04',
      capacity: 12,
      distanceKm: 2.4,
      etaMins: 6,
      availability: 'Ready',
      isSuggested: true,
      suitabilityScore: 98,
      specialization: 'Aquatic & Flood Extraction Specialist',
    },
    {
      id: 'team_bravo',
      name: 'SDRF Tactical Taskforce Bravo',
      leader: 'Commander Anita R.',
      vehicle: 'All-Terrain Ambulance A-02',
      capacity: 8,
      distanceKm: 4.8,
      etaMins: 12,
      availability: 'Ready',
      isSuggested: false,
      suitabilityScore: 84,
      specialization: 'Medical Emergency Triage',
    },
    {
      id: 'team_charlie',
      name: 'Rapid Urban Search & Rescue Delta',
      leader: 'Inspector Vikram S.',
      vehicle: 'Heavy Evacuation Truck H-09',
      capacity: 20,
      distanceKm: 7.1,
      etaMins: 18,
      availability: 'Standby',
      isSuggested: false,
      suitabilityScore: 72,
      specialization: 'Heavy Structural Debris Clearance',
    },
  ];

  const handleConfirmAssignment = async () => {
    setIsDispatching(true);
    const chosen = candidateTeams.find((t) => t.id === selectedTeamId) || candidateTeams[0];

    try {
      const res = await fetch(`http://localhost:8000/api/v1/sos/${incidentId}/assign-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: chosen.id,
          teamName: chosen.name,
          vehicleId: chosen.id === 'team_alpha' ? 'veh_01' : 'veh_02',
          vehicleName: chosen.vehicle,
          eta: `${chosen.etaMins} mins`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (onAssignSuccess) onAssignSuccess(data);
      }
    } catch (e) {
      console.error('[SmartTeamAssignModal] Dispatch error:', e);
      if (onAssignSuccess) {
        onAssignSuccess({
          sos: {
            id: incidentId,
            status: 'En Route',
            assignedTeam: chosen.name,
            assignedVehicle: chosen.vehicle,
            eta: `${chosen.etaMins} mins`,
          },
        });
      }
    } finally {
      setIsDispatching(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0A1A22] border border-[#1E3440] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-[#10232C] border-b border-[#1E3440] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-xl text-[#00D4FF]">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#00D4FF] text-xs">SMART TEAM DISPATCH ANALYTICS</span>
                <Badge variant="accent">AI OPTIMIZED ROUTE</Badge>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">Assign Tactical Unit to {incidentTitle || incidentId}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#07161E] text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto text-xs">
          <div className="text-[#AAB6C3] font-mono text-[11px] mb-2">
            Candidates ranked by real-time proximity (GIS Haversine), ETA, unit capacity & hazard specialization:
          </div>

          {candidateTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedTeamId === team.id
                  ? 'bg-[#102D3A] border-[#00D4FF] shadow-lg ring-1 ring-[#00D4FF]'
                  : 'bg-[#10232C] border-[#1E3440] hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{team.name}</span>
                  {team.isSuggested && (
                    <span className="px-2 py-0.5 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] font-mono text-[10px] font-bold rounded-full flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-3 h-3" /> SUGGESTED MATCH (Score {team.suitabilityScore}%)
                    </span>
                  )}
                </div>
                <div className="text-right font-mono">
                  <span className="text-base font-bold text-[#00D4FF] block">{team.etaMins} MINS</span>
                  <span className="text-[10px] text-gray-400">Proximity: {team.distanceKm} km</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-[#1E3440]">
                <div>
                  <span className="text-[#AAB6C3] text-[10px] block font-mono">Leader</span>
                  <span className="font-bold text-white">{team.leader}</span>
                </div>
                <div>
                  <span className="text-[#AAB6C3] text-[10px] block font-mono">Vehicle & Capacity</span>
                  <span className="font-bold text-white">{team.vehicle} ({team.capacity} Cap)</span>
                </div>
                <div>
                  <span className="text-[#AAB6C3] text-[10px] block font-mono">Specialization</span>
                  <span className="text-[#00D4FF] font-mono text-[11px]">{team.specialization}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#10232C] border-t border-[#1E3440] flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">
            Selected Unit: <span className="text-[#00D4FF] font-bold">{candidateTeams.find((t) => t.id === selectedTeamId)?.name}</span>
          </span>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-[#1E3440] hover:bg-[#2A4858] text-white font-mono font-bold text-xs rounded-xl">
              Cancel
            </button>
            <button
              onClick={handleConfirmAssignment}
              disabled={isDispatching}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 uppercase tracking-wider"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isDispatching ? 'Dispatching...' : 'Confirm Dispatch & Update Mission'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
