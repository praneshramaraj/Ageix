import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';

import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';
import { IncidentCategory, IncidentSeverity, IncidentStatus } from '../../../types/eoc';

import {
  AlertTriangle,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Flame,
  CloudRain,
  Radio,
  UserX,
} from 'lucide-react';

import { IncidentAssignModal } from '../../../components/eoc/IncidentAssignModal';

export const IncidentsPage: React.FC = () => {
  const {
    incidents,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSeverity,
    setSelectedSeverity,
    selectedStatus,
    setSelectedStatus,
    updateIncidentStatus,
  } = useIncidentBoardStore();

  const [assignIncidentId, setAssignIncidentId] = useState<string | null>(null);

  const filteredIncidents = incidents.filter((inc) => {
    if (searchQuery && !inc.title.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== 'all' && inc.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && inc.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'all' && inc.status !== selectedStatus) return false;
    return true;
  });

  const renderCategoryIcon = (cat: IncidentCategory) => {
    switch (cat) {
      case 'sos':
        return <AlertTriangle className="w-4 h-4 text-[#FF4B55]" />;
      case 'fire':
        return <Flame className="w-4 h-4 text-[#FF4B55]" />;
      case 'flood':
      case 'cyclone':
        return <CloudRain className="w-4 h-4 text-[#00D4FF]" />;
      case 'missing_person':
        return <UserX className="w-4 h-4 text-[#FFB000]" />;
      case 'road_closure':
      default:
        return <Radio className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <PageContainer
      title="Multi-Hazard Live Incident Triage Board"
      subtitle="SOS Alerts, Disaster Telemetry Feeds, Filtering, Triage & Operational Assignment"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Incident Board' }]}
    >
      {/* Search & Filter Bar */}
      <div className="mb-6 p-4 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#00D4FF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Title, Code or Location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-[#07161E] border border-[#1E3440] text-xs font-mono text-white rounded-lg px-3 py-2 outline-none uppercase"
            >
              <option value="all">All Hazards</option>
              <option value="sos">SOS Requests</option>
              <option value="flood">Flood</option>
              <option value="fire">Fire</option>
              <option value="landslide">Landslide</option>
              <option value="earthquake">Earthquake</option>
              <option value="cyclone">Cyclone</option>
              <option value="road_closure">Road Closures</option>
              <option value="missing_person">Missing Persons</option>
            </select>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="bg-[#07161E] border border-[#1E3440] text-xs font-mono text-white rounded-lg px-3 py-2 outline-none uppercase"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-[#07161E] border border-[#1E3440] text-xs font-mono text-white rounded-lg px-3 py-2 outline-none uppercase"
            >
              <option value="all">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Triaged">Triaged</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident List Table / Cards */}
      <Card title={`Active Incident Feed (${filteredIncidents.length})`}>
        <Table
          data={filteredIncidents}
          keyExtractor={(item) => item.id}
          columns={[
            {
              header: 'Code / Hazard',
              accessor: (item) => (
                <div className="flex items-center gap-2">
                  {renderCategoryIcon(item.category)}
                  <div>
                    <span className="font-mono text-[#00D4FF] font-bold block">{item.code}</span>
                    <span className="text-[10px] text-[#AAB6C3] uppercase">{item.category}</span>
                  </div>
                </div>
              ),
            },
            {
              header: 'Title & Location',
              accessor: (item) => (
                <div>
                  <span className="font-semibold text-white block">{item.title}</span>
                  <span className="text-[11px] text-[#AAB6C3]">{item.locationName}</span>
                </div>
              ),
            },
            {
              header: 'Severity',
              accessor: (item) => (
                <Badge variant={item.severity === 'critical' ? 'danger' : 'warning'}>
                  {item.severity.toUpperCase()}
                </Badge>
              ),
            },
            {
              header: 'Reported By',
              accessor: (item) => (
                <div>
                  <span className="text-xs text-white block">{item.reportedBy}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{item.contactNumber}</span>
                </div>
              ),
            },
            {
              header: 'Status & Assignment',
              accessor: (item) => (
                <div>
                  <span className="px-2 py-0.5 rounded bg-[#1E3440] text-[10px] font-mono font-bold text-white block mb-1">
                    {item.status}
                  </span>
                  {item.assignedMissionId ? (
                    <span className="text-[10px] font-mono text-[#3DDC84] font-bold">Assigned to Mission</span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#FF4B55]">Unassigned</span>
                  )}
                </div>
              ),
            },
            {
              header: 'Actions',
              accessor: (item) => (
                <div className="flex items-center gap-2">
                  {!item.assignedMissionId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAssignIncidentId(item.id);
                      }}
                      className="px-2.5 py-1 bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF] text-[10px] font-mono font-bold rounded hover:bg-[#00D4FF]/30 transition-all"
                    >
                      Assign Mission
                    </button>
                  )}
                  {item.status !== 'Closed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateIncidentStatus(item.id, 'Closed');
                      }}
                      className="px-2 py-1 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] text-[10px] font-mono font-bold rounded hover:bg-[#3DDC84]/30"
                    >
                      Close
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      <IncidentAssignModal
        isOpen={!!assignIncidentId}
        onClose={() => setAssignIncidentId(null)}
        incidentId={assignIncidentId}
      />
    </PageContainer>
  );
};

export default IncidentsPage;
