import React from 'react';
import { Plus, Minus, Maximize2, Box } from 'lucide-react';
import { Compass } from './Compass';
import { BuildingControl } from './BuildingControl';
import { TerrainControl } from './TerrainControl';
import { BasemapSwitcher } from './BasemapSwitcher';
import { useMapStore } from '../stores/MapStore';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetNorth: () => void;
  onTogglePitch: () => void;
  onToggleBuildings: () => void;
  onToggleTerrain: () => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetNorth,
  onTogglePitch,
  onToggleBuildings,
  onToggleTerrain,
}) => {
  const { viewState, is3dBuildingsEnabled, isTerrainEnabled } = useMapStore();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 pointer-events-auto select-none">
      {/* Zoom controls */}
      <div className="flex flex-col rounded-xl map-glass-panel overflow-hidden border border-[#1E3440]">
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2.5 text-[#AAB6C3] hover:text-[#00D4FF] hover:bg-[#1E3440] transition-colors border-b border-[#1E3440]"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2.5 text-[#AAB6C3] hover:text-[#00D4FF] hover:bg-[#1E3440] transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Compass */}
      <Compass onResetNorth={onResetNorth} />

      {/* Pitch (2D/3D View) */}
      <button
        onClick={onTogglePitch}
        title="Toggle Camera Pitch Angle (2D/3D)"
        className={`p-2.5 rounded-xl map-glass-button flex items-center justify-center ${
          viewState.pitch > 20 ? 'active' : ''
        }`}
      >
        <Box className="w-5 h-5 text-[#00D4FF]" />
      </button>

      {/* 3D Buildings */}
      <BuildingControl isEnabled={is3dBuildingsEnabled} onToggle={onToggleBuildings} />

      {/* DEM Terrain */}
      <TerrainControl isEnabled={isTerrainEnabled} onToggle={onToggleTerrain} />

      {/* Fullscreen */}
      <button
        onClick={handleFullscreen}
        title="Toggle Fullscreen Mode"
        className="p-2.5 rounded-xl map-glass-button flex items-center justify-center"
      >
        <Maximize2 className="w-5 h-5 text-[#AAB6C3] hover:text-[#00D4FF]" />
      </button>

      {/* Basemap Gallery */}
      <BasemapSwitcher />
    </div>
  );
};
