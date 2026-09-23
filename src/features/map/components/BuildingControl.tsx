import React from 'react';
import { Building2 } from 'lucide-react';

interface BuildingControlProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const BuildingControl: React.FC<BuildingControlProps> = ({ isEnabled, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      title={isEnabled ? 'Disable 3D Buildings' : 'Enable 3D Buildings Extrusion'}
      className={`p-2.5 rounded-xl map-glass-button flex items-center justify-center transition-all ${
        isEnabled ? 'active' : ''
      }`}
    >
      <Building2 className={`w-5 h-5 ${isEnabled ? 'text-[#00D4FF]' : 'text-[#AAB6C3]'}`} />
    </button>
  );
};
