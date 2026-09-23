import React from 'react';
import { ShieldAlert, Plus, Trash2, Ban } from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';
import { HazardAvoidanceZone } from '../../types/navigation';

export const HazardAvoidanceTool: React.FC = () => {
  const { hazardZones, addHazardZone, removeHazardZone, clearHazardZones } = useNavigationStore();

  const handleAddSampleRoadBlock = () => {
    const newZone: HazardAvoidanceZone = {
      id: `hb_${Date.now()}`,
      name: `Emergency Road Blockade #${hazardZones.length + 1}`,
      type: 'road_block',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.580, 12.965],
            [77.585, 12.965],
            [77.585, 12.970],
            [77.580, 12.970],
            [77.580, 12.965],
          ],
        ],
      },
      severity: 'critical',
      penaltyFactor: 3.0,
      timestamp: new Date().toLocaleTimeString(),
    };
    addHazardZone(newZone);
  };

  return (
    <div className="pointer-events-auto bg-[#10232C]/95 border border-[#1E3440] rounded-xl p-3 shadow-xl backdrop-blur-md text-white w-72">
      <div className="flex items-center justify-between border-b border-[#1E3440] pb-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#FF4B55]">
          <ShieldAlert className="w-4 h-4" />
          HAZARD AVOIDANCE DRAWER
        </div>
        {hazardZones.length > 0 && (
          <button
            onClick={clearHazardZones}
            className="text-[10px] font-mono text-gray-400 hover:text-white flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={handleAddSampleRoadBlock}
          className="w-full py-1.5 px-2 bg-[#FF4B55]/15 hover:bg-[#FF4B55]/30 border border-[#FF4B55]/40 text-[#FF4B55] text-xs font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Road Closure / Blockade
        </button>

        <div className="space-y-1 max-h-36 overflow-y-auto pt-1">
          {hazardZones.length === 0 ? (
            <p className="text-[10px] font-mono text-gray-500 italic text-center py-2">
              No active manual avoidances
            </p>
          ) : (
            hazardZones.map((hz) => (
              <div
                key={hz.id}
                className="p-1.5 bg-[#07161E] border border-[#1E3440] rounded flex items-center justify-between text-[11px] font-mono"
              >
                <div className="flex items-center gap-1.5">
                  <Ban className="w-3 h-3 text-[#FF4B55]" />
                  <span className="text-gray-200 truncate max-w-[170px]">{hz.name}</span>
                </div>
                <button
                  onClick={() => removeHazardZone(hz.id)}
                  className="text-gray-500 hover:text-[#FF4B55]"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
