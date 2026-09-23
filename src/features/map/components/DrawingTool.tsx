import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { PenTool, MapPin, X, Trash2 } from 'lucide-react';

export const DrawingTool: React.FC = () => {
  const { activeGisTool, setActiveGisTool, drawnShapes, clearDrawnShapes } = useMapStore();

  const isDrawing =
    activeGisTool === 'draw_polygon' ||
    activeGisTool === 'draw_rectangle' ||
    activeGisTool === 'place_marker';

  if (!isDrawing) return null;

  return (
    <div className="absolute top-20 left-4 z-40 w-72 p-3.5 rounded-2xl map-glass-panel border border-[#FFB000]/40 shadow-2xl animate-in fade-in slide-in-from-top-2 pointer-events-auto">
      <div className="flex items-center justify-between border-b border-[#1E3440] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          {activeGisTool === 'place_marker' ? (
            <MapPin className="w-4 h-4 text-[#FF4B55]" />
          ) : (
            <PenTool className="w-4 h-4 text-[#FFB000]" />
          )}
          <span className="text-xs font-mono font-bold text-[#FFB000] uppercase tracking-wider">
            {activeGisTool === 'place_marker' ? 'Pin Disaster Marker' : 'Draw Polygon Zone'}
          </span>
        </div>
        <button
          onClick={() => setActiveGisTool('none')}
          className="p-1 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <p className="text-[10px] text-[#AAB6C3] italic">
          Click on the map canvas to place custom risk markers and evacuation sector boundaries.
        </p>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#07161E]/90 border border-[#1E3440]">
          <span className="font-mono text-[10px] text-[#AAB6C3]">DRAWN SHAPES</span>
          <span className="font-mono text-xs font-bold text-[#FFB000]">
            {drawnShapes.length} Custom Geometries
          </span>
        </div>

        {drawnShapes.length > 0 && (
          <div className="flex items-center justify-end pt-1">
            <button
              onClick={clearDrawnShapes}
              className="flex items-center gap-1 text-[#FF4B55] hover:underline text-[10px]"
            >
              <Trash2 className="w-3 h-3" /> Clear Drawn Geometries
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
