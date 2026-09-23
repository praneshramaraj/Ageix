import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { StatCard } from '../../../components/ui/StatCard';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';

import { useCommandStore } from '../../../stores/CommandStore';
import { useMissionStore } from '../../../stores/MissionStore';
import { useTeamStore } from '../../../stores/TeamStore';
import { useVehicleStore } from '../../../stores/VehicleStore';
import { useResourceStore } from '../../../stores/ResourceStore';
import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';

import {
  AlertTriangle,
  Flame,
  Crosshair,
  Users,
  Truck,
  Building2,
  Home,
  CloudRain,
  Radio,
  ArrowRight,
  ShieldCheck,
  Server,
  Zap,
  Award,
  FileText,
} from 'lucide-react';

import { MissionModal } from '../../../components/eoc/MissionModal';
import { EmergencySosPanel } from '../../../components/eoc/EmergencySosPanel';
import { IncidentQueue } from '../../../components/eoc/IncidentQueue';
import { RescueTeamsPanel } from '../../../components/eoc/RescueTeamsPanel';
import { SmartTeamAssignModal } from '../../../components/eoc/SmartTeamAssignModal';
import { MissionTimeline } from '../../../components/eoc/MissionTimeline';
import { MissionChatPanel } from '../../../components/eoc/MissionChatPanel';
import { MissionReportModal, MissionReportData } from '../../../components/eoc/MissionReportModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { defconLevel, weatherSummary, systemHealth } = useCommandStore();
  const { missions } = useMissionStore();
  const { teams } = useTeamStore();
  const { vehicles } = useVehicleStore();
  const { resources } = useResourceStore();
  const { incidents } = useIncidentBoardStore();

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [smartAssignIncidentId, setSmartAssignIncidentId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<MissionReportData | null>(null);

  const activeMissionsCount = missions.filter((m) => m.status === 'In Progress' || m.status === 'Assigned' || (m.status as string) === 'En Route').length;
  const readyTeamsCount = teams.filter((t) => t.availability === 'Ready').length;
  const activeVehiclesCount = vehicles.filter((v) => v.status === 'Dispatched' || v.status === 'Operational').length;
  const lowResourcesCount = resources.filter((r) => r.status === 'LOW STOCK' || r.status === 'CRITICAL EMPTY').length;
  const openIncidentsCount = incidents.filter((i) => i.status !== 'Closed').length;

  const handleOpenSampleReport = (msn: any) => {
    setSelectedReport({
      missionId: msn.id,
      missionCode: msn.code,
      incidentId: msn.incidentId || 'inc_101',
      incidentCode: 'INC-2026-901',
      citizenName: 'Ramesh Kumar',
      citizenPhone: '+91 98765 12345',
      locationName: 'Sector 4 Kaveri Basin (Lat: 12.9620, Lng: 77.5880)',
      assignedTeam: 'NDRF Alpha Rescue Unit 1',
      assignedLeader: 'Capt. Rajesh V.',
      assignedVehicle: 'Rapid Response Boat R-04',
      responseTimeMins: 2.5,
      travelTimeMins: 6.0,
      rescueDurationMins: 14.2,
      totalDurationMins: 22.7,
      outcome: 'Trapped citizens successfully extracted from 1st floor rooftop via aquatic boat R-04. First-aid administered on scene and transferred to ICU Hub 2.',
      completedAt: 'Just now (EOC Verified)',
    });
  };

  return (
    <PageContainer
      title="EOC Rescue Operations Center"
      subtitle="Phase 11 Real-Time Telemetry, Incident Queue, Smart Dispatch & Tactical Mission Tracking"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Rescue Operations Center' }]}
      action={
        <div className="flex items-center gap-2">
          <Badge variant={defconLevel.includes('1') ? 'danger' : 'warning'} pulse size="md">
            {defconLevel} ACTIVE
          </Badge>
          <button
            onClick={() => setIsMissionModalOpen(true)}
            className="px-3 py-1.5 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5" />
            + New Rescue Mission
          </button>
        </div>
      }
    >
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-6">
        <StatCard
          title="Open Incidents"
          value={openIncidentsCount.toString()}
          subtext="Recorded today"
          icon={<AlertTriangle className="w-5 h-5 text-[#FF4B55]" />}
          variant="danger"
          trend={`${incidents.filter((i) => i.severity === 'critical').length} Critical P1`}
        />
        <StatCard
          title="Active Missions"
          value={activeMissionsCount.toString()}
          subtext="Tactical Deployed"
          icon={<Crosshair className="w-5 h-5 text-[#FFB000]" />}
          variant="warning"
          trend="Live Operations"
        />
        <StatCard
          title="Available Teams"
          value={`${readyTeamsCount} / ${teams.length}`}
          subtext="Ready for Dispatch"
          icon={<Users className="w-5 h-5 text-[#3DDC84]" />}
          variant="success"
          trend="Standby Staging"
        />
        <StatCard
          title="Rescue Vehicles"
          value={`${activeVehiclesCount} / ${vehicles.length}`}
          subtext="Fleet Operable"
          icon={<Truck className="w-5 h-5 text-[#00D4FF]" />}
          variant="accent"
        />
        <StatCard
          title="UAV Drone Recon"
          value="1 Unit"
          subtext="Live Telemetry"
          icon={<Radio className="w-5 h-5 text-[#00D4FF]" />}
          variant="accent"
          trend="FLIR Thermal"
        />
        <StatCard
          title="Medical ICU Hubs"
          value="8 Hubs"
          subtext="ICU Occupancy 84%"
          icon={<Building2 className="w-5 h-5 text-[#FFB000]" />}
          variant="warning"
        />
        <StatCard
          title="Shelter Capacity"
          value="18,500"
          subtext="12 Sites Active"
          icon={<Home className="w-5 h-5 text-[#3DDC84]" />}
          variant="success"
          trend="72% Occupied"
        />
        <StatCard
          title="Weather Warning"
          value={weatherSummary.category.split(' ')[0]}
          subtext={`Wind ${weatherSummary.windSpeedKmh} km/h`}
          icon={<CloudRain className="w-5 h-5 text-[#00D4FF]" />}
          variant="accent"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowResourcesCount.toString()}
          subtext="Warehouse Depots"
          icon={<Flame className="w-5 h-5 text-[#FF4B55]" />}
          variant="danger"
          trend="Restock Needed"
        />
        <StatCard
          title="System Health"
          value={systemHealth.tileServerStatus}
          subtext={`DB Latency ${systemHealth.dbLatencyMs}ms`}
          icon={<Server className="w-5 h-5 text-[#3DDC84]" />}
          variant="success"
        />
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Incident Queue & Rescue Teams */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phase 11.1 Live Incident Queue */}
          <IncidentQueue
            onAssignClick={(inc) => setSmartAssignIncidentId(inc.id)}
            onFocusMap={(lng, lat) => navigate('/map')}
          />

          {/* Emergency SOS Signal Feed */}
          <EmergencySosPanel />

          {/* Phase 11.3 Rescue Teams Panel */}
          <RescueTeamsPanel
            onSelectTeam={(team) => console.log('Team selected:', team)}
            onFocusMap={(lng, lat) => navigate('/map')}
          />
        </div>

        {/* Right Column: Mission Timeline, Operational Chat & Weather */}
        <div className="space-y-6">
          {/* Phase 11.7 Mission Timeline */}
          <MissionTimeline currentStatus="En Route" />

          {/* Phase 11.9 Mission Tactical Chat */}
          <MissionChatPanel missionId="MSN-TACTICAL-44" />

          {/* Active Missions Card with Report PDF Export */}
          <Card
            title="Active Operations & PDF Reports"
            subtitle="Click to view & export official EOC Mission PDF"
            glow="accent"
          >
            <div className="space-y-3">
              {missions.slice(0, 3).map((msn) => (
                <div key={msn.id} className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#00D4FF] text-xs">{msn.code}</span>
                      <Badge variant="success">En Route</Badge>
                    </div>
                    <span className="text-xs font-bold text-white block mt-0.5">{msn.title}</span>
                  </div>
                  <button
                    onClick={() => handleOpenSampleReport(msn)}
                    className="px-2.5 py-1.5 bg-[#00D4FF]/20 text-[#00D4FF] hover:bg-[#00D4FF]/30 font-mono font-bold text-[10px] rounded-lg flex items-center gap-1 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" /> PDF Report
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <MissionModal isOpen={isMissionModalOpen} onClose={() => setIsMissionModalOpen(false)} />
      <SmartTeamAssignModal
        isOpen={!!smartAssignIncidentId}
        onClose={() => setSmartAssignIncidentId(null)}
        incidentId={smartAssignIncidentId}
      />
      <MissionReportModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </PageContainer>
  );
};

export default DashboardPage;

