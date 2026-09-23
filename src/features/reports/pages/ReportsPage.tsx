import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { ExportUtils } from '../../../utils/exportUtils';
import { useMissionStore } from '../../../stores/MissionStore';
import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';
import { useResourceStore } from '../../../stores/ResourceStore';

import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { missions } = useMissionStore();
  const { incidents } = useIncidentBoardStore();
  const { resources } = useResourceStore();

  const [reportType, setReportType] = useState<'daily' | 'missions' | 'resources' | 'incidents'>('daily');

  const handleExportCsv = () => {
    if (reportType === 'missions') {
      const rows = missions.map((m) => ({
        Code: m.code,
        Title: m.title,
        Priority: m.priority,
        Status: m.status,
        Progress: `${m.progressPercent}%`,
        Location: m.locationName,
      }));
      ExportUtils.exportToCsv('eoc_missions_report', rows);
    } else if (reportType === 'resources') {
      const rows = resources.map((r) => ({
        Name: r.name,
        Category: r.category,
        Stock: r.currentStock,
        Unit: r.unit,
        StorageHub: r.storageHub,
        Status: r.status,
      }));
      ExportUtils.exportToCsv('eoc_resource_inventory_report', rows);
    } else {
      const rows = incidents.map((i) => ({
        Code: i.code,
        Title: i.title,
        Category: i.category,
        Severity: i.severity,
        Status: i.status,
        Location: i.locationName,
      }));
      ExportUtils.exportToCsv('eoc_incidents_report', rows);
    }
  };

  const handleExportPdf = () => {
    let html = `<h2>AEGISX EOC ${reportType.toUpperCase()} SUMMARY REPORT</h2>`;
    html += `<p>Total Record Entries Processed: ${reportType === 'missions' ? missions.length : incidents.length}</p>`;
    html += `<table><thead><tr><th>Code/ID</th><th>Name/Title</th><th>Status</th></tr></thead><tbody>`;

    if (reportType === 'missions') {
      missions.forEach(m => {
        html += `<tr><td>${m.code}</td><td>${m.title}</td><td>${m.status}</td></tr>`;
      });
    } else {
      incidents.forEach(i => {
        html += `<tr><td>${i.code}</td><td>${i.title}</td><td>${i.status}</td></tr>`;
      });
    }
    html += `</tbody></table>`;

    ExportUtils.exportToPdf(`AEGISX EOC ${reportType.toUpperCase()} Official Report`, html);
  };

  return (
    <PageContainer
      title="EOC Official Reports & Export Console"
      subtitle="Generate Daily Summaries, Operational Reports & Export to PDF, Excel, CSV"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Reports' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Report Generator Selector */}
        <Card title="Select Report Specification">
          <div className="space-y-3">
            {[
              { id: 'daily', title: 'Daily EOC Operations Summary', desc: 'Complete 24-hour disaster telemetry, missions & resource summary' },
              { id: 'missions', title: 'Tactical Mission Execution Report', desc: 'Detailed log of active, completed & cancelled rescue missions' },
              { id: 'incidents', title: 'Multi-Hazard Incident Triage Report', desc: 'SOS requests, casualty reports & severity distribution' },
              { id: 'resources', title: 'Resource Stock & Distribution Audit', desc: 'Logistics inventory, warehouse levels & low stock alerts' },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => setReportType(item.id as any)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  reportType === item.id
                    ? 'bg-[#07161E] border-[#00D4FF] ring-1 ring-[#00D4FF]/40 shadow-lg'
                    : 'bg-[#10232C] border-[#1E3440] hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold font-mono text-white">{item.title}</h4>
                  {reportType === item.id && <CheckCircle2 className="w-4 h-4 text-[#00D4FF]" />}
                </div>
                <p className="text-[11px] text-[#AAB6C3] mt-1 leading-snug">{item.desc}</p>
              </div>
            ))}

            <div className="pt-4 border-t border-[#1E3440] space-y-2">
              <button
                onClick={handleExportPdf}
                className="w-full py-2.5 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-xl shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate & Export PDF
              </button>
              <button
                onClick={handleExportCsv}
                className="w-full py-2.5 bg-[#1E3440] hover:bg-[#2A4758] text-[#3DDC84] font-mono font-bold text-xs rounded-xl shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 border border-[#3DDC84]/30"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Export Excel / CSV Spreadsheet
              </button>
            </div>
          </div>
        </Card>

        {/* Right 2 Columns: Live Report Preview Table */}
        <div className="lg:col-span-2">
          <Card title={`Live Preview: ${reportType.toUpperCase()} REPORT`}>
            <div className="p-4 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-3 font-mono text-xs text-white">
              <div className="flex justify-between text-gray-400 border-b border-[#1E3440] pb-2">
                <span>EOC Node: AEGISX Supreme Command</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>

              {reportType === 'missions' && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {missions.map((m) => (
                    <div key={m.id} className="p-2.5 bg-[#10232C] rounded border border-[#1E3440] flex justify-between">
                      <div>
                        <span className="text-[#00D4FF] font-bold block">{m.code} - {m.title}</span>
                        <span className="text-[10px] text-gray-400">{m.locationName}</span>
                      </div>
                      <span className="text-[#3DDC84] font-bold">{m.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {reportType !== 'missions' && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {incidents.map((i) => (
                    <div key={i.id} className="p-2.5 bg-[#10232C] rounded border border-[#1E3440] flex justify-between">
                      <div>
                        <span className="text-[#00D4FF] font-bold block">{i.code} - {i.title}</span>
                        <span className="text-[10px] text-gray-400">{i.locationName}</span>
                      </div>
                      <span className="text-[#FF4B55] font-bold">{i.severity.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default ReportsPage;
