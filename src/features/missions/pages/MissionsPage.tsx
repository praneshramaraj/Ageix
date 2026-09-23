import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

import { useMissionStore } from '../../../stores/MissionStore';
import { useTeamStore } from '../../../stores/TeamStore';
import { useVehicleStore } from '../../../stores/VehicleStore';
import { MissionStatus, MissionPriority } from '../../../types/eoc';

import {
  Plus,
  Crosshair,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Paperclip,
  MessageSquare,
  Users,
  Truck,
  ArrowRight,
} from 'lucide-react';

import { MissionModal } from '../../../components/eoc/MissionModal';

export const MissionsPage: React.FC = () => {
  const {
    missions,
    updateMissionStatus,
    cancelMission,
    deleteMission,
    addMissionNote,
  } = useMissionStore();

  const { teams } = useTeamStore();
  const { vehicles } = useVehicleStore();

  const [filterStatus, setFilterStatus] = useState<MissionStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<MissionPriority | 'ALL'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null);

  const [activeNoteInput, setActiveNoteInput] = useState<{ [key: string]: string }>({});

  const filteredMissions = missions.filter((m) => {
    if (filterStatus !== 'ALL' && m.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && m.priority !== filterPriority) return false;
    return true;
  });

  const handleNoteSubmit = (missionId: string) => {
    const text = activeNoteInput[missionId];
    if (!text || !text.trim()) return;
    addMissionNote(missionId, 'Commander EOC', text.trim());
    setActiveNoteInput({ ...activeNoteInput, [missionId]: '' });
  };

  return (
    <PageContainer
      title="Tactical Mission Operations Console"
      subtitle="Lifecycle Command, Unit Dispatch & Real-Time Operational Mission Tracking"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Mission Operations' }]}
      action={
        <button
          onClick={() => {
            setEditingMissionId(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Rescue Mission
        </button>
      }
    >
      {/* Filters Bar */}
      <div className="mb-6 p-4 bg-[#10232C] border border-[#1E3440] rounded-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">Filter Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-[#07161E] border border-[#1E3440] text-xs font-mono text-white rounded-lg px-3 py-1.5 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">Filter Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as any)}
              className="bg-[#07161E] border border-[#1E3440] text-xs font-mono text-white rounded-lg px-3 py-1.5 outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="EMERGENCY">EMERGENCY</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-mono text-gray-400">
          Showing <span className="text-[#00D4FF] font-bold">{filteredMissions.length}</span> of {missions.length} Missions
        </div>
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMissions.map((mission) => {
          const assignedTeamNames = teams.filter((t) => mission.assignedTeamIds.includes(t.id)).map((t) => t.name);
          const assignedVehiclePlates = vehicles.filter((v) => mission.assignedVehicleIds.includes(v.id)).map((v) => v.callsign);

          return (
            <Card key={mission.id} glow={mission.priority === 'CRITICAL' || mission.priority === 'EMERGENCY' ? 'danger' : 'accent'}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={mission.priority === 'CRITICAL' || mission.priority === 'EMERGENCY' ? 'danger' : 'warning'}>
                        {mission.priority}
                      </Badge>
                      <span className="font-mono text-xs font-bold text-[#00D4FF]">{mission.code}</span>
                      <span className="px-2 py-0.5 rounded bg-[#1E3440] text-[10px] font-mono font-bold text-white">
                        {mission.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-tight">{mission.title}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingMissionId(mission.id);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 bg-[#1E3440] hover:bg-[#2A4758] rounded text-gray-300 hover:text-white transition-colors"
                      title="Edit Mission"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => cancelMission(mission.id)}
                      className="p-1.5 bg-[#FF4B55]/15 hover:bg-[#FF4B55]/30 rounded text-[#FF4B55] transition-colors"
                      title="Cancel Mission"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#AAB6C3] leading-relaxed">{mission.description}</p>

                {/* Location & Time */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00D4FF]" />
                    {mission.locationName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Created: {mission.createdAt}
                  </span>
                </div>

                {/* Assigned Units */}
                <div className="p-3 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#3DDC84]" />
                    <span className="text-gray-400">Teams:</span>
                    <span className="text-white font-bold">
                      {assignedTeamNames.length > 0 ? assignedTeamNames.join(', ') : 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#00D4FF]" />
                    <span className="text-gray-400">Vehicles:</span>
                    <span className="text-white font-bold">
                      {assignedVehiclePlates.length > 0 ? assignedVehiclePlates.join(', ') : 'Unassigned'}
                    </span>
                  </div>
                </div>

                {/* Execution Progress */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                    <span>Execution Progress</span>
                    <span className="text-[#3DDC84] font-bold">{mission.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-[#1E3440] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#00D4FF] to-[#3DDC84] h-full rounded-full transition-all"
                      style={{ width: `${mission.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Quick Status Control Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#1E3440]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Set Status:</span>
                  <button
                    onClick={() => updateMissionStatus(mission.id, 'In Progress')}
                    className="px-2.5 py-1 bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF] text-[10px] font-mono font-bold rounded hover:bg-[#00D4FF]/30 transition-all"
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateMissionStatus(mission.id, 'Completed')}
                    className="px-2.5 py-1 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] text-[10px] font-mono font-bold rounded hover:bg-[#3DDC84]/30 transition-all"
                  >
                    Completed
                  </button>
                </div>

                {/* Mission Timeline & Notes */}
                <div className="space-y-2 pt-2 border-t border-[#1E3440]">
                  <div className="text-[11px] font-mono font-bold text-gray-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#00D4FF]" />
                    Field Activity Logs ({mission.timeline.length})
                  </div>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                    {mission.timeline.map((tl) => (
                      <div key={tl.id} className="text-[10px] font-mono text-gray-400 bg-[#07161E] p-2 rounded border border-[#1E3440]">
                        <span className="text-[#00D4FF] font-bold">[{tl.timestamp}]</span> {tl.author}:{' '}
                        <span className="text-gray-200">{tl.action}</span> - {tl.details}
                      </div>
                    ))}
                  </div>

                  {/* Add Note Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add field note..."
                      value={activeNoteInput[mission.id] || ''}
                      onChange={(e) => setActiveNoteInput({ ...activeNoteInput, [mission.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleNoteSubmit(mission.id)}
                      className="flex-1 bg-[#07161E] border border-[#1E3440] rounded px-2.5 py-1 text-xs font-mono text-white outline-none focus:border-[#00D4FF]"
                    />
                    <button
                      onClick={() => handleNoteSubmit(mission.id)}
                      className="px-3 py-1 bg-[#1E3440] hover:bg-[#2A4758] text-xs font-mono text-white rounded font-bold"
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <MissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editMissionId={editingMissionId}
      />
    </PageContainer>
  );
};

export default MissionsPage;
