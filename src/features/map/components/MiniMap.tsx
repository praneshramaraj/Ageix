import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { MapPin } from 'lucide-react';

export const MiniMap: React.FC = () => {
  const { viewState } = useMapStore();

  return (
    <div className="w-36 h-28 rounded-2xl map-glass-panel border border-[#1E3440] overflow-hidden relative shadow-xl pointer-events-none select-none flex flex-col justify-between p-2">
      <div className="flex items-center justify-between z-10">
        <span className="text-[9px] font-mono font-bold text-[#00D4FF] uppercase tracking-wider bg-[#07161E]/80 px-1.5 py-0.5 rounded border border-[#1E3440]">
          OVERVIEW
        </span>
        <span className="text-[9px] font-mono text-[#AAB6C3] bg-[#07161E]/80 px-1 py-0.5 rounded">
          Z{Math.round(viewState.zoom)}
        </span>
      </div>

      {/* Synchronized viewport center indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-12 h-8 border-2 border-[#00D4FF] bg-[#00D4FF]/20 rounded shadow-sm animate-pulse flex items-center justify-center">
          <MapPin className="w-3 h-3 text-[#00D4FF]" />
        </div>
      </div>

      <div className="text-[8px] font-mono text-[#AAB6C3] z-10 text-center bg-[#07161E]/80 py-0.5 rounded border border-[#1E3440]">
        {viewState.latitude.toFixed(2)}°, {viewState.longitude.toFixed(2)}°
      </div>
    </div>
  );
};
