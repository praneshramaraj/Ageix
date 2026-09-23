import React from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { ExportUtils } from '../../../utils/exportUtils';
import { useMissionStore } from '../../../stores/MissionStore';
import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';

import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { missions } = useMissionStore();
  const { incidents } = useIncidentBoardStore();

  const handleExportCsv = () => {
    const rows = missions.map((m) => ({
      Code: m.code,
      Title: m.title,
      Priority: m.priority,
      Status: m.status,
      Location: m.locationName,
      ProgressPct: m.progressPercent,
      CreatedAt: m.createdAt,
    }));
    ExportUtils.exportToCsv('eoc_missions_analytics', rows);
  };

  const handleExportPdf = () => {
    const tableHtml = `
      <table>
        <thead>
          <tr><th>Code</th><th>Title</th><th>Priority</th><th>Status</th><th>Progress</th></tr>
        </thead>
        <tbody>
          ${missions.map(m => `
            <tr>
              <td>${m.code}</td>
              <td>${m.title}</td>
              <td>${m.priority}</td>
              <td>${m.status}</td>
              <td>${m.progressPercent}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    ExportUtils.exportToPdf('EOC Mission Performance Analytics', tableHtml);
  };

  return (
    <PageContainer
      title="EOC Response Analytics & Disaster Intelligence"
      subtitle="Response Times, Multi-Hazard Trend Analysis & Resource Utilization Visuals"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Analytics' }]}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-[#10232C] hover:bg-[#1E3440] border border-[#1E3440] text-xs font-mono text-[#3DDC84] rounded-lg font-bold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export Excel/CSV
          </button>
          <button
            onClick={handleExportPdf}
            className="px-3 py-1.5 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Export PDF Report
          </button>
        </div>
      }
    >
      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Avg Unit Response Time"
          value="7.4 MIN"
          subtext="Target < 10 mins"
          icon={<Clock className="w-5 h-5 text-[#3DDC84]" />}
          variant="success"
          trend="-1.2 min vs baseline"
        />
        <StatCard
          title="Mission Success Rate"
          value="98.2%"
          subtext="142 Operational Missions"
          icon={<CheckCircle2 className="w-5 h-5 text-[#3DDC84]" />}
          variant="success"
        />
        <StatCard
          title="SOS Triage Time"
          value="2.1 MIN"
          subtext="Automated Dispatch"
          icon={<TrendingUp className="w-5 h-5 text-[#00D4FF]" />}
          variant="accent"
        />
        <StatCard
          title="Total Evacuated"
          value="4,280"
          subtext="Civilians Saved"
          icon={<BarChart3 className="w-5 h-5 text-[#FFB000]" />}
          variant="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disaster Incident Distribution Chart Visual */}
        <Card title="Multi-Hazard Incident Triage Distribution">
          <div className="p-4 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-4">
            {[
              { label: 'Flood & Inundation Reports', pct: 45, color: '#00D4FF', count: 64 },
              { label: 'Wildfire Perimeters', pct: 25, color: '#FF4B55', count: 35 },
              { label: 'Structural Debris & Road Closures', pct: 18, color: '#FFB000', count: 26 },
              { label: 'Seismic Earthquake Tremors', pct: 12, color: '#3DDC84', count: 17 },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{item.label}</span>
                  <span className="text-[#00D4FF] font-bold">{item.count} Incidents ({item.pct}%)</span>
                </div>
                <div className="w-full bg-[#1E3440] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Team Response Efficiency Matrix */}
        <Card title="Rescue Unit Response Time Efficiency">
          <div className="p-4 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-4">
            {[
              { unit: 'Alpha Swiftwater Rescue', avgTime: '6.2 min', rating: 'Exceptional (A+)' },
              { unit: 'Bravo Heavy Rigging Team', avgTime: '11.4 min', rating: 'Optimal (A)' },
              { unit: 'Charlie Field Trauma Unit', avgTime: '5.8 min', rating: 'Exceptional (A+)' },
              { unit: 'Delta Tactical UAV Recon', avgTime: '3.5 min', rating: 'Immediate (S)' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-[#10232C] rounded-lg border border-[#1E3440] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">{item.unit}</span>
                  <span className="text-[10px] text-gray-400">Avg Time: {item.avgTime}</span>
                </div>
                <span className="text-[#3DDC84] font-bold">{item.rating}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AnalyticsPage;
