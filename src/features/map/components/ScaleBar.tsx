import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { calculateScaleDistance } from '../utils/geojson';

export const ScaleBar: React.FC = () => {
  const { viewState } = useMapStore();
  const { distance, unit, widthPx } = calculateScaleDistance(viewState.zoom, viewState.latitude);

  return (
    <div className="flex flex-col items-center pointer-events-none select-none">
      <div className="text-[10px] font-mono font-bold text-[#00D4FF] mb-0.5 tracking-wider">
        {distance} {unit}
      </div>
      <div
        className="h-1.5 border-b-2 border-l-2 border-r-2 border-[#00D4FF] bg-[#00D4FF]/20 rounded-b"
        style={{ width: `${widthPx}px` }}
      />
    </div>
  );
};
