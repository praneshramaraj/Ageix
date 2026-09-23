import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { X, MapPin, Building, ShieldAlert, Phone, Users, Activity } from 'lucide-react';
import { formatCoordinates } from '../utils/geojson';

export const PopupCard: React.FC = () => {
  const { selectedFeature, setSelectedFeature } = useMapStore();

  if (!selectedFeature) return null;

  const props = selectedFeature.properties || {};

  return (
    <div className="absolute top-20 right-6 z-40 w-80 p-4 rounded-2xl map-glass-panel border border-[#00D4FF]/40 shadow-2xl animate-in fade-in slide-in-from-right-4 pointer-events-auto">
      <div className="flex items-start justify-between border-b border-[#1E3440] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">{selectedFeature.name}</h3>
            <span className="text-[10px] font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
              {selectedFeature.type}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSelectedFeature(null)}
          className="p-1 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs text-[#AAB6C3]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#07161E]/80 border border-[#1E3440]">
          <span className="font-mono text-[10px] text-[#AAB6C3]">COORDINATES</span>
          <span className="font-mono text-[11px] font-bold text-white">
            {formatCoordinates(selectedFeature.coordinates[1], selectedFeature.coordinates[0])}
          </span>
        </div>

        {props.subtitle && (
          <p className="text-xs text-[#AAB6C3] leading-relaxed bg-[#10232C] p-2 rounded-lg border border-[#1E3440]">
            {props.subtitle}
          </p>
        )}

        {props.adminArea && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#AAB6C3]">
              <Building className="w-3.5 h-3.5 text-[#00D4FF]" /> Admin District:
            </span>
            <span className="font-semibold text-white">{props.adminArea}</span>
          </div>
        )}

        {props.capacity && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#AAB6C3]">
              <Users className="w-3.5 h-3.5 text-[#3DDC84]" /> Capacity / Beds:
            </span>
            <span className="font-semibold text-[#3DDC84] font-mono">{props.capacity}</span>
          </div>
        )}

        {props.status && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#AAB6C3]">
              <Activity className="w-3.5 h-3.5 text-[#FFB000]" /> Operational Status:
            </span>
            <span className="font-semibold text-[#FFB000] font-mono uppercase">{props.status}</span>
          </div>
        )}

        {props.contact && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[#AAB6C3]">
              <Phone className="w-3.5 h-3.5 text-[#00D4FF]" /> Contact Dispatch:
            </span>
            <span className="font-semibold text-white font-mono">{props.contact}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-[#1E3440] flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#AAB6C3]">AEGISX GIS Node</span>
        <button
          onClick={() => alert(`Target locked: ${selectedFeature.name}`)}
          className="px-3 py-1.5 rounded-lg bg-[#00D4FF] text-[#07161E] font-bold text-xs hover:bg-[#00D4FF]/90 transition-all shadow-md"
        >
          Dispatch Node
        </button>
      </div>
    </div>
  );
};
