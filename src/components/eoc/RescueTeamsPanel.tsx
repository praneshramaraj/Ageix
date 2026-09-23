import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ShieldCheck, UserCheck, Truck, Users, MapPin, Radio, Activity, Navigation2 } from 'lucide-react';

export interface RescueTeamItem {
  id: string;
  name: string;
  leader: string;
  vehicle: string;
  capacity: number;
  latitude: number;
  longitude: number;
  locationName: string;
  availability: 'Ready' | 'Dispatched' | 'On Scene' | 'Standby';
  status: 'Active' | 'Standby' | 'Maintenance';
  specialization: string;
}

export const RescueTeamsPanel: React.FC<{
  onSelectTeam?: (team: RescueTeamItem) => void;
  onFocusMap?: (lng: number, lat: number) => void;
}> = ({ onSelectTeam, onFocusMap }) => {
  const [teams, setTeams] = useState<RescueTeamItem[]>([
    {
      id: 'team_alpha',
      name: 'NDRF Alpha Rescue Unit 1',
      leader: 'Capt. Rajesh V.',
      vehicle: 'Rapid Response Boat R-04',
      capacity: 12,
      latitude: 12.9620,
      longitude: 77.5880,
      locationName: 'Sector 4 Kaveri Basin Depot',
      availability: 'Ready',
      status: 'Active',
      specialization: 'Aquatic & Flood Evacuation',
    },
    {
      id: 'team_bravo',
      name: 'SDRF Tactical Taskforce Bravo',
      leader: 'Commander Anita R.',
      vehicle: 'All-Terrain Ambulance A-02',
      capacity: 8,
      latitude: 12.9750,
      longitude: 77.6100,
      locationName: 'HAL Command Base 2',
      availability: 'Ready',
      status: 'Active',
      specialization: 'Medical Triage & Hazmat',
    },
    {
      id: 'team_charlie',
      name: 'Rapid Urban Search & Rescue Delta',
      leader: 'Inspector Vikram S.',
      vehicle: 'Heavy Evacuation Truck H-09',
      capacity: 20,
      latitude: 12.9550,
      longitude: 77.5700,
      locationName: 'West Ridge Staging Hub',
      availability: 'Standby',
      status: 'Active',
      specialization: 'Structural Collapse Extraction',
    },
    {
      id: 'team_echo',
      name: 'Helicopter Air-Drop Rescue Air-1',
      leader: 'Major K. Sharma',
      vehicle: 'ALH Dhruv Helicopter R-01',
      capacity: 6,
      latitude: 12.9880,
      longitude: 77.6050,
      locationName: 'Airforce Helipad Alpha',
      availability: 'Ready',
      status: 'Active',
      specialization: 'Air Evacuation & Winching',
    },
  ]);

  return (
    <Card
      title="Rescue Teams Telemetry & Dispatch Panel"
      subtitle="Tactical units, team leaders, vehicles, live GPS & operational capacity"
      glow="accent"
      action={
        <Badge variant="success" pulse>
          {teams.filter((t) => t.availability === 'Ready').length} UNITS READY FOR DISPATCH
        </Badge>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-4 bg-[#10232C] border border-[#1E3440] hover:border-[#00D4FF] rounded-xl space-y-3 transition-all cursor-pointer"
            onClick={() => onSelectTeam && onSelectTeam(team)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#00D4FF]" />
                <div>
                  <h4 className="font-bold text-white text-xs">{team.name}</h4>
                  <span className="text-[10px] text-[#AAB6C3] font-mono">{team.specialization}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  team.availability === 'Ready'
                    ? 'bg-[#3DDC84]/20 text-[#3DDC84]'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {team.availability}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#1E3440]">
              <div>
                <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Team Leader</span>
                <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5 text-[#3DDC84]" /> {team.leader}
                </span>
              </div>

              <div>
                <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Assigned Vehicle</span>
                <span className="font-bold text-white flex items-center gap-1 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-[#00D4FF]" /> {team.vehicle}
                </span>
              </div>

              <div>
                <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Capacity</span>
                <span className="font-mono text-white flex items-center gap-1 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-[#FFB000]" /> {team.capacity} Persons
                </span>
              </div>

              <div>
                <span className="text-[#AAB6C3] block text-[10px] uppercase font-mono">Current GPS</span>
                <span className="font-mono text-[11px] text-[#00D4FF] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {team.latitude.toFixed(4)}, {team.longitude.toFixed(4)}
                </span>
              </div>
            </div>

            {onFocusMap && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFocusMap(team.longitude, team.latitude);
                  }}
                  className="px-2.5 py-1 bg-[#1E3440] hover:bg-[#2A4858] text-[#00D4FF] text-[10px] font-mono font-bold rounded flex items-center gap-1"
                >
                  <Navigation2 className="w-3 h-3" /> Focus on Map
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
