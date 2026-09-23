import React, { useState } from 'react';
import { LegendGroupDef } from '../types/map';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';

export const Legend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const legendGroups: LegendGroupDef[] = [
    {
      title: 'Infrastructure & Roads',
      items: [
        { id: 'l-motorway', label: 'Expressway / Motorway', color: '#FFB000', type: 'line' },
        { id: 'l-primary', label: 'Primary Highway', color: '#00D4FF', type: 'line' },
        { id: 'l-secondary', label: 'Secondary / Urban Road', color: '#AAB6C3', type: 'line' },
        { id: 'l-building', label: '3D Building Extrusion', color: '#3182ce', type: 'fill' },
      ],
    },
    {
      title: 'Environment & Hydrology',
      items: [
        { id: 'l-water', label: 'River / Reservoir / Lake', color: '#00D4FF', type: 'fill' },
        { id: 'l-[#3DDC84]', label: 'Reserve Forest / Park', color: '#3DDC84', type: 'fill' },
        { id: 'l-contour', label: 'DEM Hillshade Contour', color: '#FFB000', type: 'line' },
      ],
    },
    {
      title: 'Emergency Facilities',
      items: [
        { id: 'l-hosp', label: 'Hospital / Trauma Center', color: '#FF4B55', type: 'circle' },
        { id: 'l-shelter', label: 'Evacuation Shelter', color: '#3DDC84', type: 'circle' },
        { id: 'l-police', label: 'Police Station', color: '#3182ce', type: 'circle' },
        { id: 'l-fire', label: 'Fire Station', color: '#FF4B55', type: 'circle' },
      ],
    },
  ];

  return (
    <div className="pointer-events-auto select-none">
      {/* Collapse button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl map-glass-button text-xs font-semibold text-[#AAB6C3]"
      >
        <HelpCircle className="w-4 h-4 text-[#00D4FF]" />
        <span>Cartographic Legend</span>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded panel */}
      {isExpanded && (
        <div className="absolute bottom-10 left-0 w-72 p-3 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl space-y-3 z-40 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between border-b border-[#1E3440] pb-2">
            <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
              GIS Legend & Symbology
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {legendGroups.map((group, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-[10px] font-mono text-[#AAB6C3] uppercase font-bold tracking-wider">
                  {group.title}
                </h4>
                <div className="space-y-1 bg-[#07161E]/80 p-2 rounded-xl border border-[#1E3440]">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      {item.type === 'line' && (
                        <div className="w-5 h-1 rounded" style={{ backgroundColor: item.color }} />
                      )}
                      {item.type === 'fill' && (
                        <div className="w-4 h-3 rounded border border-white/20" style={{ backgroundColor: item.color }} />
                      )}
                      {item.type === 'circle' && (
                        <div className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: item.color }} />
                      )}
                      <span className="text-[11px] text-white font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
