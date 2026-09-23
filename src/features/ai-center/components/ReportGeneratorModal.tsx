import React, { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { useIncidentBoardStore } from '../../../stores/IncidentBoardStore';
import { ReportExporter } from '../services/reportExporter';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({ isOpen, onClose }) => {
  const [reportType, setReportType] = useState<'incident' | 'mission' | 'daily' | 'resource'>('incident');
  const incidents = useIncidentBoardStore((s) => s.incidents);

  const handleExportPDF = () => {
    const summary = `Executive Briefing: ${incidents.length} incidents recorded across 4 disaster sectors. ${
      incidents.filter((i) => i.severity === 'critical').length
    } incidents marked CRITICAL requiring immediate search & rescue.`;
    ReportExporter.generatePdfBrief(`${reportType.toUpperCase()} DISASTER REPORT`, summary, incidents);
    onClose();
  };

  const handleExportCSV = () => {
    const dataToExport = incidents.map((i) => ({
      ID: i.code || i.id,
      Title: i.title,
      Category: i.category,
      Severity: i.severity,
      Status: i.status,
      Location: i.locationName || 'GPS',
      ReportedBy: i.reportedBy || 'Civilian App',
      AffectedCount: i.affectedCount || 1,
      Timestamp: i.timestamp,
    }));
    ReportExporter.exportToCSV(`AEGISX_${reportType.toUpperCase()}_REPORT`, dataToExport);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Automated Report Generator & Exporter" maxWidth="md">

      <div className="space-y-4 font-mono text-xs text-white">
        <div>
          <label className="block text-[#AAB6C3] mb-2 font-bold">Select Report Blueprint Type:</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'incident', label: 'Incident Situation Report' },
              { id: 'mission', label: 'Mission Response Log' },
              { id: 'daily', label: '24-Hour EOC Executive Brief' },
              { id: 'resource', label: 'Resource & Shelter Allocation' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setReportType(type.id as any)}
                className={`p-3 rounded-xl text-left border transition ${
                  reportType === type.id
                    ? 'bg-[#00D4FF]/10 border-[#00D4FF] text-[#00D4FF] font-bold'
                    : 'bg-[#10232C] border-[#1E3440] text-[#AAB6C3] hover:border-[#AAB6C3]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl text-[11px] text-[#AAB6C3]">
          Include Data Scope: <span className="text-white font-bold">{incidents.length} active incidents</span>, live squad logs, and hospital capacity.
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="accent" size="md" onClick={handleExportPDF} className="flex-1 flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            <span>EXPORT TO PDF</span>
          </Button>

          <Button variant="success" size="md" onClick={handleExportCSV} className="flex-1 flex items-center justify-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>EXPORT TO EXCEL / CSV</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
