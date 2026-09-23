import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { useTeamStore } from '../../../stores/TeamStore';
import { useCommunicationStore } from '../../../stores/CommunicationStore';
import { TeamType, TeamAvailability } from '../../../types/eoc';

import {
  Users,
  Shield,
  Flame,
  Building2,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  PhoneCall,
  Wrench,
  Award,
} from 'lucide-react';

export const PersonnelPage: React.FC = () => {
  const { teams, setTeamAvailability } = useTeamStore();
  const { startVoiceCall } = useCommunicationStore();

  const [filterType, setFilterType] = useState<TeamType | 'ALL'>('ALL');

  const filteredTeams = teams.filter((t) => filterType === 'ALL' || t.type === filterType);

  const renderTeamIcon = (type: TeamType) => {
    switch (type) {
      case 'rescue':
        return <Users className="w-4 h-4 text-[#3DDC84]" />;
      case 'police':
        return <Shield className="w-4 h-4 text-[#00D4FF]" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-[#FF4B55]" />;
      case 'medical':
        return <Building2 className="w-4 h-4 text-[#FFB000]" />;
      case 'drone_operators':
        return <Radio className="w-4 h-4 text-[#00D4FF]" />;
      case 'volunteers':
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <PageContainer
      title="Rescue Teams & Personnel Management"
      subtitle="Tactical Unit Rosters, Field Skill Matrix, Equipment Manifests & Response Times"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Personnel & Teams' }]}
    >
      {/* Category Filter Bar */}
      <div className="mb-6 p-4 bg-[#10232C] border border-[#1E3440] rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-gray-400 mr-2">Filter Unit Category:</span>
          {['ALL', 'rescue', 'police', 'fire', 'medical', 'drone_operators', 'volunteers'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase ${
                filterType === cat
                  ? 'bg-[#00D4FF] text-[#07161E] shadow-md'
                  : 'bg-[#07161E] border border-[#1E3440] text-gray-400 hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-gray-400">
          Total Registered Units: <span className="text-[#3DDC84] font-bold">{teams.length}</span>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} glow={team.availability === 'Deployed' ? 'warning' : 'accent'}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#07161E] border border-[#1E3440] flex items-center justify-center">
                    {renderTeamIcon(team.type)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white">{team.name}</h3>
                    <span className="text-[10px] font-mono text-[#00D4FF]">Leader: {team.leaderName}</span>
                  </div>
                </div>

                <Badge variant={team.availability === 'Ready' ? 'success' : team.availability === 'Deployed' ? 'warning' : 'neutral'}>
                  {team.availability}
                </Badge>
              </div>

              {/* Location & Response Time */}
              <div className="p-2.5 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#00D4FF]" />
                    {team.locationName}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#1E3440]/60">
                  <span className="text-[10px] text-gray-400">Avg Response Time:</span>
                  <span className="text-[#3DDC84] font-bold">{team.avgResponseTimeMin} MINS</span>
                </div>
              </div>

              {/* Members Roster */}
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  Team Members ({team.members.length})
                </span>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {team.members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between text-[11px] font-mono p-1.5 bg-[#07161E] rounded border border-[#1E3440]">
                      <div>
                        <span className="text-white font-bold block">{m.name}</span>
                        <span className="text-[9px] text-[#AAB6C3]">{m.role} ({m.callsign})</span>
                      </div>
                      <button
                        onClick={() => startVoiceCall(m.name)}
                        className="p-1 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] rounded"
                        title="Voice Call Member"
                      >
                        <PhoneCall className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Set */}
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  Tactical Skill Matrix
                </span>
                <div className="flex flex-wrap gap-1">
                  {team.skillSet.map((skill, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-[#1E3440] text-[10px] font-mono text-gray-200 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  Equipment Manifest
                </span>
                <div className="flex flex-wrap gap-1">
                  {team.equipment.map((eq, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[10px] font-mono text-[#00D4FF] rounded">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability Toggle Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1E3440]">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Set Status:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setTeamAvailability(team.id, 'Ready')}
                    className="px-2 py-0.5 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] text-[10px] font-mono font-bold rounded"
                  >
                    Ready
                  </button>
                  <button
                    onClick={() => setTeamAvailability(team.id, 'Deployed')}
                    className="px-2 py-0.5 bg-[#FFB000]/20 border border-[#FFB000] text-[#FFB000] text-[10px] font-mono font-bold rounded"
                  >
                    Deployed
                  </button>
                  <button
                    onClick={() => setTeamAvailability(team.id, 'Resting')}
                    className="px-2 py-0.5 bg-[#1E3440] text-gray-300 text-[10px] font-mono rounded"
                  >
                    Resting
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default PersonnelPage;
