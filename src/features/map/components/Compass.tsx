import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { Compass as CompassIcon } from 'lucide-react';

interface CompassProps {
  onResetNorth: () => void;
}

export const Compass: React.FC<CompassProps> = ({ onResetNorth }) => {
  const { viewState } = useMapStore();

  return (
    <button
      onClick={onResetNorth}
      title="Reset North (Click to align camera north)"
      className="p-2.5 rounded-xl map-glass-button flex items-center justify-center group"
    >
      <CompassIcon
        className="w-5 h-5 text-[#00D4FF] transition-transform duration-300 group-hover:scale-110"
        style={{ transform: `rotate(${-viewState.bearing}deg)` }}
      />
    </button>
  );
};
