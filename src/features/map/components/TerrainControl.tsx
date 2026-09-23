import React from 'react';
import { Mountain } from 'lucide-react';

interface TerrainControlProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const TerrainControl: React.FC<TerrainControlProps> = ({ isEnabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      title={isEnabled ? 'Disable DEM 3D Terrain' : 'Enable DEM 3D Terrain'}
      className={`p-2.5 rounded-xl map-glass-button flex items-center justify-center transition-all ${
        isEnabled ? 'active' : ''
      }`}
    >
      <Mountain className={`w-5 h-5 ${isEnabled ? 'text-[#FFB000]' : 'text-[#AAB6C3]'}`} />
    </button>
  );
};
