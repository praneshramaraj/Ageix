import React, { useState } from 'react';
import { useMapStore } from '../stores/MapStore';
import { GisToolId } from '../types/map';
import {
  Ruler,
  Square,
  PenTool,
  MapPin,
  Download,
  SlidersHorizontal,
  Compass,
  Eye,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { ExportModal } from './ExportModal';
import { AccessibilitySettings } from './AccessibilitySettings';

interface GistoolbarProps {
  onResetNorth: () => void;
  onLocateUser?: () => void;
}

export const Gistoolbar: React.FC<GistoolbarProps> = ({ onResetNorth, onLocateUser }) => {
  const { activeGisTool, setActiveGisTool, clearMeasurementPoints, clearDrawnShapes } = useMapStore();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);

  const tools: { id: GisToolId; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'measure_distance', label: 'Distance', icon: Ruler, color: 'text-[#00D4FF]' },
    { id: 'measure_area', label: 'Area', icon: Square, color: 'text-[#3DDC84]' },
    { id: 'draw_polygon', label: 'Draw Zone', icon: PenTool, color: 'text-[#FFB000]' },
    { id: 'place_marker', label: 'Pin Marker', icon: MapPin, color: 'text-[#FF4B55]' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl pointer-events-auto select-none">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const active = activeGisTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => {
              if (active) {
                setActiveGisTool('none');
              } else {
                setActiveGisTool(tool.id);
              }
            }}
            title={tool.label}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              active
                ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40 shadow-md scale-105'
                : 'text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]'
            }`}
          >
            <Icon className={`w-4 h-4 ${active ? 'text-[#00D4FF]' : tool.color}`} />
            <span className="hidden lg:inline">{tool.label}</span>
          </button>
        );
      })}

      <div className="h-5 w-[1px] bg-[#1E3440] mx-1" />

      {/* Clear Active Tools */}
      {activeGisTool !== 'none' && (
        <button
          onClick={() => {
            setActiveGisTool('none');
            clearMeasurementPoints();
            clearDrawnShapes();
          }}
          title="Clear Measurements & Drawing"
          className="p-2 rounded-xl text-[#FF4B55] hover:bg-[#FF4B55]/10 border border-[#FF4B55]/30 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}

      {/* Export Modal Trigger */}
      <button
        onClick={() => setIsExportOpen(true)}
        title="Export GIS Map / GeoJSON"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#AAB6C3] hover:text-white hover:bg-[#1E3440] transition-all"
      >
        <Download className="w-4 h-4 text-[#3DDC84]" />
        <span className="hidden lg:inline">Export</span>
      </button>

      {/* Accessibility / High Contrast Settings */}
      <button
        onClick={() => setIsAccessOpen(!isAccessOpen)}
        title="Accessibility & High Contrast"
        className={`p-2 rounded-xl transition-all ${
          isAccessOpen ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]'
        }`}
      >
        <Eye className="w-4 h-4" />
      </button>

      {isExportOpen && <ExportModal onClose={() => setIsExportOpen(false)} />}
      {isAccessOpen && <AccessibilitySettings onClose={() => setIsAccessOpen(false)} />}
    </div>
  );
};
