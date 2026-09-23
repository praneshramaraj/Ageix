import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

export const DisasterLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="pointer-events-auto select-none">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl map-glass-button text-xs font-semibold text-[#FF4B55] border-[#FF4B55]/40"
      >
        <ShieldAlert className="w-4 h-4 text-[#FF4B55]" />
        <span>Disaster Severity Key</span>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {isExpanded && (
        <div className="absolute bottom-10 left-0 w-64 p-3 rounded-2xl map-glass-panel border border-[#FF4B55]/30 shadow-2xl space-y-2.5 z-40 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-[#1E3440] pb-1.5">
            <span className="text-[10px] font-mono font-bold text-[#FF4B55] uppercase tracking-wider">
              Disaster Risk Intensity
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF0055] border border-white/40" />
                <span className="text-white font-semibold">Critical Threat</span>
              </div>
              <span className="text-[9px] font-mono text-[#FF0055]">IMMEDIATE SOS</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF4B55] border border-white/40" />
                <span className="text-white font-semibold">High Severity</span>
              </div>
              <span className="text-[9px] font-mono text-[#FF4B55]">EVACUATE</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFB000] border border-white/40" />
                <span className="text-white font-semibold">Medium Hazard</span>
              </div>
              <span className="text-[9px] font-mono text-[#FFB000]">STANDBY</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#3DDC84] border border-white/40" />
                <span className="text-white font-semibold">Low / Monitored</span>
              </div>
              <span className="text-[9px] font-mono text-[#3DDC84]">SAFE ZONE</span>
            </div>
          </div>

          {/* Heatmap density bar */}
          <div className="pt-2 border-t border-[#1E3440] space-y-1">
            <div className="flex justify-between text-[9px] font-mono text-[#AAB6C3]">
              <span>Risk Density</span>
              <span>Kernel Scale</span>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-[#3DDC84] via-[#FFB000] to-[#FF0055] border border-white/20" />
          </div>
        </div>
      )}
    </div>
  );
};
