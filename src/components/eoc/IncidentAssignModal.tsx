import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useIncidentBoardStore } from '../../stores/IncidentBoardStore';
import { useMissionStore } from '../../stores/MissionStore';

interface IncidentAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string | null;
}

export const IncidentAssignModal: React.FC<IncidentAssignModalProps> = ({ isOpen, onClose, incidentId }) => {
  const { incidents, assignIncidentToMission } = useIncidentBoardStore();
  const { missions } = useMissionStore();

  const [selectedMissionId, setSelectedMissionId] = useState<string>('');

  if (!isOpen || !incidentId) return null;

  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;

  const handleAssign = () => {
    if (!selectedMissionId) return;
    assignIncidentToMission(incident.id, selectedMissionId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#10232C] border border-[#1E3440] rounded-2xl shadow-2xl text-white overflow-hidden">
        <div className="px-5 py-4 bg-[#07161E] border-b border-[#1E3440] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF4B55]" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              ASSIGN INCIDENT TO MISSION
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1E3440] rounded text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#00D4FF] font-bold">{incident.code}</span>
            <h4 className="text-xs font-bold text-white">{incident.title}</h4>
            <p className="text-[11px] font-mono text-gray-400">{incident.locationName}</p>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Select Target Operational Mission</label>
            <select
              value={selectedMissionId}
              onChange={(e) => setSelectedMissionId(e.target.value)}
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
            >
              <option value="">-- Choose Mission --</option>
              {missions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} - {m.title} ({m.priority})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1E3440] text-xs font-mono rounded-lg hover:bg-[#2A4758]"
            >
              Cancel
            </button>
            <button
              disabled={!selectedMissionId}
              onClick={handleAssign}
              className="px-4 py-2 bg-[#3DDC84] disabled:bg-gray-700 text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Assign & Triage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
