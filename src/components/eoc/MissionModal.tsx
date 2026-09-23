import React, { useState } from 'react';
import { X, Crosshair, Plus, Check } from 'lucide-react';
import { useMissionStore } from '../../stores/MissionStore';
import { useTeamStore } from '../../stores/TeamStore';
import { useVehicleStore } from '../../stores/VehicleStore';
import { MissionPriority, MissionStatus } from '../../types/eoc';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editMissionId?: string | null;
}

export const MissionModal: React.FC<MissionModalProps> = ({ isOpen, onClose, editMissionId }) => {
  const { createMission, updateMission, missions } = useMissionStore();
  const { teams } = useTeamStore();
  const { vehicles } = useVehicleStore();

  const editMission = editMissionId ? missions.find((m) => m.id === editMissionId) : null;

  const [title, setTitle] = useState(editMission ? editMission.title : '');
  const [description, setDescription] = useState(editMission ? editMission.description : '');
  const [priority, setPriority] = useState<MissionPriority>(editMission ? editMission.priority : 'HIGH');
  const [status, setStatus] = useState<MissionStatus>(editMission ? editMission.status : 'Pending');
  const [locationName, setLocationName] = useState(editMission ? editMission.locationName : 'Sector 4 Flood Boundary');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(editMission ? editMission.assignedTeamIds : []);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>(editMission ? editMission.assignedVehicleIds : []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    if (editMission) {
      updateMission(editMission.id, {
        title,
        description,
        priority,
        status,
        locationName,
        assignedTeamIds: selectedTeamIds,
        assignedVehicleIds: selectedVehicleIds,
      });
    } else {
      createMission({
        title,
        description,
        priority,
        status,
        targetLocation: [77.588, 12.962],
        locationName,
        assignedTeamIds: selectedTeamIds,
        assignedVehicleIds: selectedVehicleIds,
        progressPercent: 0,
      });
    }
    onClose();
  };

  const toggleTeam = (id: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleVehicle = (id: string) => {
    setSelectedVehicleIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#10232C] border border-[#1E3440] rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-[#07161E] border-b border-[#1E3440] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-[#00D4FF]" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">
              {editMission ? `EDIT MISSION (${editMission.code})` : 'CREATE NEW RESCUE MISSION'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[#1E3440] rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Mission Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Operation Water Rescue Sector 4"
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="EMERGENCY">EMERGENCY RED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Location Name</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Description & Field Notes</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          {/* Assign Teams Selection */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Assign Rescue Teams</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {teams.map((t) => {
                const isAssigned = selectedTeamIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => toggleTeam(t.id)}
                    className={`p-2 rounded-lg border cursor-pointer text-xs font-mono flex items-center justify-between transition-all ${
                      isAssigned
                        ? 'bg-[#00D4FF]/15 border-[#00D4FF] text-[#00D4FF] font-bold'
                        : 'bg-[#07161E] border-[#1E3440] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    {isAssigned && <Check className="w-3.5 h-3.5" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assign Vehicles Selection */}
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1.5">Assign Vehicles / UAVs</label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {vehicles.map((v) => {
                const isAssigned = selectedVehicleIds.includes(v.id);
                return (
                  <div
                    key={v.id}
                    onClick={() => toggleVehicle(v.id)}
                    className={`p-2 rounded-lg border cursor-pointer text-xs font-mono flex items-center justify-between transition-all ${
                      isAssigned
                        ? 'bg-[#3DDC84]/15 border-[#3DDC84] text-[#3DDC84] font-bold'
                        : 'bg-[#07161E] border-[#1E3440] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{v.callsign} ({v.model})</span>
                    {isAssigned && <Check className="w-3.5 h-3.5" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#1E3440]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1E3440] hover:bg-[#2A4758] text-xs font-mono rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all"
            >
              {editMission ? 'Save Changes' : 'Create Mission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
