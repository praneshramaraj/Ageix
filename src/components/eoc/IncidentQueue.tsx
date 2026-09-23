import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import {
  AlertTriangle,
  User,
  Phone,
  Clock,
  MapPin,
  Flame,
  CloudRain,
  Radio,
  UserX,
  Filter,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { IncidentDetailsDrawer, IncidentDetailData } from './IncidentDetailsDrawer';
import { SosDispatchModal, SosDispatchData } from './SosDispatchModal';

export const IncidentQueue: React.FC<{
  onAssignClick?: (incident: IncidentDetailData) => void;
  onFocusMap?: (lng: number, lat: number) => void;
}> = ({ onAssignClick, onFocusMap }) => {
  const [incidents, setIncidents] = useState<IncidentDetailData[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetailData | null>(null);
  const [selectedSosForModal, setSelectedSosForModal] = useState<SosDispatchData | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const fetchIncidents = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/sos');
      if (res.ok) {
        const data = await res.json();
        const list = data.sosList || [];
        const formatted: IncidentDetailData[] = list.map((item: any) => ({
          id: item.id,
          code: item.incidentId ? item.incidentId.toUpperCase() : `INC-${item.id.slice(-4)}`,
          title: item.emergencyType || item.description || `Distress Ping: ${item.userName}`,
          category: item.emergencyType?.toLowerCase().includes('fire')
            ? 'fire'
            : item.emergencyType?.toLowerCase().includes('flood')
            ? 'flood'
            : 'sos',
          severity: item.severity || 'critical',
          status: item.status || 'Waiting for Dispatcher',
          citizenName: item.userName || 'Civilian User',
          citizenPhone: item.userPhone || '+91 98112 33441',
          latitude: item.latitude || 12.9620,
          longitude: item.longitude || 77.5880,
          locationName: item.locationName || `Lat: ${item.latitude}, Lng: ${item.longitude}`,
          district: item.locationName?.includes('Sector') ? item.locationName.split(' ')[0] + ' ' + item.locationName.split(' ')[1] : 'Sector 4 Kaveri Zone',
          medicalNotes: item.medicalInfo,
          description: item.description || item.message,
          timestamp: item.timestamp || 'Just now',
          assignedTeam: item.assignedTeam,
          assignedVehicle: item.assignedVehicle,
          eta: item.eta,
          username: item.username || 'civilian_user',
          age: item.age || 28,
          bloodGroup: item.bloodGroup || 'O+',
          gender: item.gender || 'Male',
          emergencyContact: item.emergencyContact || '+91 78069 94340',
          requiredTeamMembers: item.requiredTeamMembers || 4,
        }));
        setIncidents(formatted);
      }
    } catch (e) {
      console.error('[IncidentQueue] Error fetching incident queue:', e);
    }
  };

  useEffect(() => {
    fetchIncidents();

    const handleSosReceived = (event: CustomEvent) => {
      console.log('[Frontend] NEW_SOS received in IncidentQueue event handler:', event.detail);
      fetchIncidents();
    };

    window.addEventListener('RESCUE_SOS_RECEIVED', handleSosReceived as EventListener);
    return () => {
      window.removeEventListener('RESCUE_SOS_RECEIVED', handleSosReceived as EventListener);
    };
  }, []);

  const filtered = incidents.filter((item) => {
    if (filterSeverity !== 'all' && item.severity !== filterSeverity) return false;
    if (filterStatus === 'waiting' && item.status !== 'Waiting for Dispatcher' && item.status !== 'PENDING') return false;
    if (filterStatus === 'assigned' && !item.assignedTeam) return false;
    if (filterStatus === 'completed' && item.status !== 'Completed') return false;
    return true;
  });

  console.log('[Frontend] IncidentQueue rendered, count:', filtered.length);

  const renderTypeIcon = (category: string) => {
    switch (category) {
      case 'fire':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'flood':
        return <CloudRain className="w-4 h-4 text-[#00D4FF]" />;
      case 'sos':
      default:
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const handleOpenSosModal = (inc: IncidentDetailData) => {
    setSelectedSosForModal({
      id: inc.id,
      userName: inc.citizenName,
      username: (inc as any).username || 'civilian_user',
      userPhone: inc.citizenPhone,
      age: (inc as any).age || 28,
      bloodGroup: (inc as any).bloodGroup || 'O+',
      gender: (inc as any).gender || 'Male',
      emergencyContact: (inc as any).emergencyContact || '+91 78069 94340',
      latitude: inc.latitude,
      longitude: inc.longitude,
      medicalInfo: inc.medicalNotes,
      severity: inc.severity,
      status: inc.status,
      timestamp: inc.timestamp,
      locationName: inc.locationName,
      description: inc.description,
      assignedTeam: inc.assignedTeam,
      assignedVehicle: inc.assignedVehicle,
      eta: inc.eta,
      requiredTeamMembers: (inc as any).requiredTeamMembers || 4,
      incidentId: inc.code,
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters Header Bar */}
      <Card
        title="Live Rescue Incident Queue"
        subtitle="Real-time multi-hazard telemetry feeds requiring EOC dispatch"
        glow="accent"
        action={
          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Severity Quick Filters */}
            <div className="flex items-center gap-1 bg-[#07161E] p-1 rounded-lg border border-[#1E3440]">
              {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                    filterSeverity === sev
                      ? 'bg-[#00D4FF] text-[#07161E]'
                      : 'text-[#AAB6C3] hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1 bg-[#07161E] p-1 rounded-lg border border-[#1E3440]">
              {[
                { id: 'all', label: 'All Status' },
                { id: 'waiting', label: 'Waiting' },
                { id: 'assigned', label: 'Assigned' },
                { id: 'completed', label: 'Completed' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                    filterStatus === st.id
                      ? 'bg-[#3DDC84] text-[#07161E]'
                      : 'text-[#AAB6C3] hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {/* Incident Table */}
        <Table
          data={filtered}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => setSelectedIncident(item)}
          columns={[
            {
              header: 'Priority',
              accessor: (item) => (
                <Badge variant={item.severity === 'critical' ? 'danger' : 'warning'}>
                  {item.severity.toUpperCase()}
                </Badge>
              ),
            },
            {
              header: 'Citizen',
              accessor: (item) => (
                <div>
                  <span className="font-bold text-white block flex items-center gap-1">
                    <User className="w-3 h-3 text-[#00D4FF]" /> {item.citizenName}
                  </span>
                  <span className="text-[10px] text-[#AAB6C3] font-mono">{item.citizenPhone}</span>
                </div>
              ),
            },
            {
              header: 'Incident Type',
              accessor: (item) => (
                <div className="flex items-center gap-2">
                  {renderTypeIcon(item.category)}
                  <div>
                    <span className="font-semibold text-white block text-xs">{item.title}</span>
                    <span className="text-[10px] text-[#00D4FF] font-mono font-bold">{item.code}</span>
                  </div>
                </div>
              ),
            },
            {
              header: 'District',
              accessor: (item) => (
                <span className="text-xs text-gray-300 font-mono flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-400" /> {item.district}
                </span>
              ),
            },
            {
              header: 'Time',
              accessor: (item) => (
                <span className="text-xs text-[#FFB000] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.timestamp}
                </span>
              ),
            },
            {
              header: 'Status',
              accessor: (item) => (
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    item.status === 'En Route' || item.status === 'Team Assigned'
                      ? 'bg-[#3DDC84]/20 text-[#3DDC84]'
                      : item.status === 'Completed'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.status}
                </span>
              ),
            },
            {
              header: 'Assigned Team',
              accessor: (item) => (
                <div>
                  {item.assignedTeam ? (
                    <div>
                      <span className="text-xs font-mono font-bold text-[#3DDC84] block">{item.assignedTeam}</span>
                      <span className="text-[10px] text-gray-400 font-mono">ETA: {item.eta || '8 mins'}</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSosModal(item);
                      }}
                      className="text-[10px] font-mono text-red-400 font-bold bg-red-950/40 hover:bg-red-600 hover:text-white px-2 py-0.5 rounded border border-red-500/30 transition-all"
                    >
                      Dispatch Protocol
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Incident Details Side Drawer */}
      <IncidentDetailsDrawer
        isOpen={!!selectedIncident}
        onClose={() => setSelectedIncident(null)}
        incident={selectedIncident}
        onAssignTeamClick={(inc) => {
          setSelectedIncident(null);
          handleOpenSosModal(inc);
        }}
        onFocusMapClick={(lng, lat) => {
          if (onFocusMap) onFocusMap(lng, lat);
        }}
      />

      {/* SOS Dispatch Modal */}
      <SosDispatchModal
        isOpen={!!selectedSosForModal}
        onClose={() => setSelectedSosForModal(null)}
        sos={selectedSosForModal}
        onAssignSuccess={() => {
          fetchIncidents();
        }}
        onFocusMap={onFocusMap}
      />
    </div>
  );
};

