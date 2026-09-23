import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { calculateTotalDistance, calculatePolygonArea } from '../utils/geojson';
import { Ruler, Square, X, Trash2 } from 'lucide-react';

export const MeasurementTool: React.FC = () => {
  const { activeGisTool, setActiveGisTool, measurementPoints, clearMeasurementPoints } = useMapStore();

  const isMeasuring = activeGisTool === 'measure_distance' || activeGisTool === 'measure_area';
  if (!isMeasuring) return null;

  const coords = measurementPoints.map((p) => p.coordinates);
  const distanceInfo = calculateTotalDistance(measurementPoints);
  const areaInfo = calculatePolygonArea(coords);

  return (
    <div className="absolute top-20 left-4 z-40 w-72 p-3.5 rounded-2xl map-glass-panel border border-[#00D4FF]/40 shadow-2xl animate-in fade-in slide-in-from-top-2 pointer-events-auto">
      <div className="flex items-center justify-between border-b border-[#1E3440] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          {activeGisTool === 'measure_distance' ? (
            <Ruler className="w-4 h-4 text-[#00D4FF]" />
          ) : (
            <Square className="w-4 h-4 text-[#3DDC84]" />
          )}
          <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
            {activeGisTool === 'measure_distance' ? 'Distance Measure' : 'Area Measure'}
          </span>
        </div>
        <button
          onClick={() => {
            setActiveGisTool('none');
            clearMeasurementPoints();
          }}
          className="p-1 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <p className="text-[10px] text-[#AAB6C3] italic">
          Click map points to calculate GIS measurements.
        </p>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#07161E]/90 border border-[#1E3440]">
          <span className="font-mono text-[10px] text-[#AAB6C3]">TOTAL DISTANCE</span>
          <span className="font-mono text-xs font-bold text-[#00D4FF]">
            {distanceInfo.formatted}
          </span>
        </div>

        {activeGisTool === 'measure_area' && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#07161E]/90 border border-[#1E3440]">
            <span className="font-mono text-[10px] text-[#AAB6C3]">ENCLOSED AREA</span>
            <span className="font-mono text-xs font-bold text-[#3DDC84]">
              {areaInfo.formatted}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-[#AAB6C3] pt-1">
          <span>Points Placed: {measurementPoints.length}</span>
          {measurementPoints.length > 0 && (
            <button
              onClick={clearMeasurementPoints}
              className="flex items-center gap-1 text-[#FF4B55] hover:underline"
            >
              <Trash2 className="w-3 h-3" /> Reset Points
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
