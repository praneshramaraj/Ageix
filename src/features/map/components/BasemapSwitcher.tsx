import React, { useState } from 'react';
import { useMapStore } from '../stores/MapStore';
import { BasemapStyleId } from '../types/map';
import { Layers, Check } from 'lucide-react';

export const BasemapSwitcher: React.FC = () => {
  const { basemapStyle, setBasemapStyle } = useMapStore();
  const [isOpen, setIsOpen] = useState(false);

  const basemaps: { id: BasemapStyleId; label: string; desc: string; color: string }[] = [
    { id: 'standard', label: 'Standard OSM', desc: 'Google-style OSM vector cartography', color: 'from-blue-600 to-indigo-800' },
    { id: 'dark', label: 'Dark EOC Theme', desc: 'Optimized emergency command view', color: 'from-slate-900 to-cyan-950' },
    { id: 'light', label: 'High Contrast Light', desc: 'Daylight high contrast cartography', color: 'from-gray-100 to-gray-300' },
    { id: 'terrain', label: 'Outdoor Topo', desc: 'Contour lines & hillshade topography', color: 'from-amber-700 to-emerald-900' },
    { id: 'satellite', label: 'Satellite Hybrid', desc: 'High-res satellite imagery base', color: 'from-emerald-800 to-blue-900' },
  ];

  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Basemap Gallery"
        className={`p-2.5 rounded-xl map-glass-button flex items-center justify-center gap-2 ${
          isOpen ? 'active' : ''
        }`}
      >
        <Layers className="w-5 h-5 text-[#00D4FF]" />
        <span className="text-xs font-semibold text-white hidden md:inline uppercase tracking-wider">
          Basemap
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-12 w-64 p-3 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl space-y-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-[#1E3440] pb-2">
            <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
              Basemap Gallery
            </span>
            <span className="text-[10px] text-[#AAB6C3]">5 Styles</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {basemaps.map((item) => {
              const active = basemapStyle === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setBasemapStyle(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white shadow-sm'
                      : 'bg-[#10232C]/80 border-[#1E3440] text-[#AAB6C3] hover:border-[#00D4FF]/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} border border-white/20 shrink-0`} />
                    <div>
                      <div className="text-xs font-bold leading-none">{item.label}</div>
                      <div className="text-[9px] text-[#AAB6C3] mt-1">{item.desc}</div>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-[#00D4FF] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
