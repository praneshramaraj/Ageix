import React from 'react';
import { useMapStore } from '../stores/MapStore';

export const LoadingOverlay: React.FC = () => {
  const { isMapLoaded, tileLoadingProgress } = useMapStore();

  if (isMapLoaded && tileLoadingProgress >= 100) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#07161E]/90 backdrop-blur-md transition-opacity duration-300">
      <div className="w-12 h-12 border-4 border-[#1E3440] border-t-[#00D4FF] rounded-full animate-spin mb-4" />
      <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-widest">
        LOADING OPENSTREETMAP GIS ENGINE...
      </span>
      <div className="w-48 h-1.5 bg-[#10232C] rounded-full mt-3 overflow-hidden border border-[#1E3440]">
        <div
          className="h-full bg-gradient-to-r from-[#00D4FF] to-[#3DDC84] transition-all duration-300"
          style={{ width: `${tileLoadingProgress}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-[#AAB6C3] mt-1.5">
        Fetching Vector Tiles & Cartographic Geometry
      </span>
    </div>
  );
};
