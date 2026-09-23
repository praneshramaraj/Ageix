import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { formatCoordinates } from '../utils/geojson';
import { ScaleBar } from './ScaleBar';

export const CoordinatePanel: React.FC = () => {
  const { viewState } = useMapStore();

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 rounded-xl map-glass-panel text-[11px] font-mono text-[#AAB6C3] border border-[#1E3440] shadow-lg pointer-events-auto">
      <div className="flex items-center gap-1.5">
        <span className="text-[#00D4FF] font-bold">POS:</span>
        <span className="text-white font-semibold">{formatCoordinates(viewState.latitude, viewState.longitude)}</span>
      </div>
      <div className="h-3 w-[1px] bg-[#1E3440]" />
      <div className="flex items-center gap-1">
        <span className="text-[#00D4FF] font-bold">ZOOM:</span>
        <span className="text-white font-semibold">{viewState.zoom.toFixed(1)}</span>
      </div>
      <div className="h-3 w-[1px] bg-[#1E3440]" />
      <div className="flex items-center gap-1">
        <span className="text-[#00D4FF] font-bold">PITCH:</span>
        <span className="text-white font-semibold">{Math.round(viewState.pitch)}°</span>
      </div>
      <div className="h-3 w-[1px] bg-[#1E3440]" />
      <div className="flex items-center gap-1">
        <span className="text-[#00D4FF] font-bold">BEARING:</span>
        <span className="text-white font-semibold">{Math.round(viewState.bearing)}°</span>
      </div>
      <div className="h-3 w-[1px] bg-[#1E3440]" />
      <ScaleBar />
    </div>
  );
};
