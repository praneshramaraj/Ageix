import React from 'react';

export const Attribution: React.FC = () => {
  return (
    <div className="absolute bottom-1 right-2 z-10 px-2 py-0.5 rounded bg-[#07161E]/80 border border-[#1E3440] text-[9px] text-[#AAB6C3] font-mono pointer-events-auto">
      &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-[#00D4FF]">OpenStreetMap</a> contributors | MapLibre GL
    </div>
  );
};
