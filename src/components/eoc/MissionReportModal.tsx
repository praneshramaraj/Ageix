import React from 'react';
import { X, FileText, Download, Printer, CheckCircle2, ShieldCheck, Award, Clock, MapPin, User, Truck } from 'lucide-react';

export interface MissionReportData {
  missionId: string;
  missionCode: string;
  incidentId: string;
  incidentCode: string;
  citizenName: string;
  citizenPhone: string;
  locationName: string;
  assignedTeam: string;
  assignedLeader: string;
  assignedVehicle: string;
  responseTimeMins: number;
  travelTimeMins: number;
  rescueDurationMins: number;
  totalDurationMins: number;
  outcome: string;
  completedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  report: MissionReportData | null;
}

export const MissionReportModal: React.FC<Props> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#0A1A22] border border-[#1E3440] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#10232C] border-b border-[#1E3440] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#3DDC84]/10 border border-[#3DDC84]/30 rounded-xl text-[#3DDC84]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#3DDC84] text-xs">AEGISX OFFICIAL EOC MISSION REPORT</span>
                <span className="px-2 py-0.5 bg-[#3DDC84]/20 text-[#3DDC84] font-mono text-[10px] font-bold rounded">
                  PASSED / COMPLETED
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Mission Summary: {report.missionCode} ({report.incidentCode})
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-1.5 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" /> Export PDF Report
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-[#07161E] text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Body Container */}
        <div id="printable-mission-report" className="p-6 space-y-6 overflow-y-auto text-xs bg-[#07161E]">
          {/* Top Banner */}
          <div className="p-4 bg-[#10232C] border border-[#1E3440] rounded-xl flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Operation Code</span>
              <span className="font-mono font-bold text-[#00D4FF] text-lg">{report.missionCode}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Completion Time</span>
              <span className="font-mono font-bold text-[#3DDC84] text-xs">{report.completedAt}</span>
            </div>
          </div>

          {/* Time Telemetry Cards */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-[#10232C] border border-[#1E3440] rounded-xl text-center">
              <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Response Time</span>
              <span className="font-mono font-bold text-white text-base">{report.responseTimeMins} mins</span>
            </div>
            <div className="p-3 bg-[#10232C] border border-[#1E3440] rounded-xl text-center">
              <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Travel Duration</span>
              <span className="font-mono font-bold text-white text-base">{report.travelTimeMins} mins</span>
            </div>
            <div className="p-3 bg-[#10232C] border border-[#1E3440] rounded-xl text-center">
              <span className="text-[10px] font-mono text-[#AAB6C3] uppercase block">Rescue Extraction</span>
              <span className="font-mono font-bold text-white text-base">{report.rescueDurationMins} mins</span>
            </div>
            <div className="p-3 bg-[#10232C] border border-[#3DDC84]/50 rounded-xl text-center bg-[#3DDC84]/5">
              <span className="text-[10px] font-mono text-[#3DDC84] uppercase block">Total Elapsed</span>
              <span className="font-mono font-bold text-[#3DDC84] text-base">{report.totalDurationMins} mins</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-2">
              <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
                <User className="w-4 h-4 text-[#00D4FF]" /> Citizen & Incident Metadata
              </h4>
              <div className="space-y-1.5 font-mono text-[11px] text-gray-300">
                <div>Citizen Name: <span className="text-white font-bold">{report.citizenName}</span></div>
                <div>Contact Phone: <span className="text-[#3DDC84] font-bold">{report.citizenPhone}</span></div>
                <div>Location Zone: <span className="text-white">{report.locationName}</span></div>
                <div>Incident ID: <span className="text-[#00D4FF] font-bold">{report.incidentCode}</span></div>
              </div>
            </div>

            <div className="p-4 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-2">
              <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
                <Truck className="w-4 h-4 text-[#3DDC84]" /> Deployed Tactical Unit
              </h4>
              <div className="space-y-1.5 font-mono text-[11px] text-gray-300">
                <div>Assigned Team: <span className="text-[#3DDC84] font-bold">{report.assignedTeam}</span></div>
                <div>Team Commander: <span className="text-white font-bold">{report.assignedLeader}</span></div>
                <div>Assigned Fleet: <span className="text-white font-bold">{report.assignedVehicle}</span></div>
              </div>
            </div>
          </div>

          {/* Outcome Summary */}
          <div className="p-4 bg-[#10232C] border border-[#3DDC84]/40 rounded-xl space-y-2">
            <h4 className="font-mono font-bold text-[#3DDC84] text-xs uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Final Mission Outcome & Triage Summary
            </h4>
            <p className="text-white text-xs leading-relaxed font-sans bg-[#07161E] p-3 rounded-lg border border-[#1E3440]">
              {report.outcome}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
