import React, { useState } from 'react';
import { MapCanvas } from '../components/MapCanvas';
import { SearchBar } from '../components/SearchBar';
import { LayerManager } from '../components/LayerManager';
import { Gistoolbar } from '../components/Gistoolbar';
import { MapControls } from '../components/MapControls';
import { CoordinatePanel } from '../components/CoordinatePanel';
import { MiniMap } from '../components/MiniMap';
import { Legend } from '../components/Legend';
import { DisasterLegend } from '../components/DisasterLegend';
import { MeasurementTool } from '../components/MeasurementTool';
import { DrawingTool } from '../components/DrawingTool';
import { PopupCard } from '../components/PopupCard';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Attribution } from '../components/Attribution';
import { useMap } from '../hooks/useMap';
import { useTerrain } from '../hooks/useTerrain';
import { useBuildings } from '../hooks/useBuildings';
import { Map as MapLibreMap } from 'maplibre-gl';

// Phase 3 Navigation Components
import { NavigationCommandCard } from '../components/navigation/NavigationCommandCard';
import { RouteSelectorCard } from '../components/navigation/RouteSelectorCard';
import { NavigationHUD } from '../components/navigation/NavigationHUD';
import { ETATelemetryWidget } from '../components/navigation/ETATelemetryWidget';
import { RouteComparisonModal } from '../components/navigation/RouteComparisonModal';
import { HazardAvoidanceTool } from '../components/navigation/HazardAvoidanceTool';
import { MissionRoutingPicker } from '../components/navigation/MissionRoutingPicker';
import { CompactMobileHUD } from '../components/navigation/CompactMobileHUD';

export const MapPage: React.FC = () => {
  const [mapInstance, setLocalMapInstance] = useState<MapLibreMap | null>(null);

  const { setMapInstance, zoomIn, zoomOut, resetNorth, togglePitch, flyTo } = useMap();
  const { toggleTerrain } = useTerrain(mapInstance);
  const { toggleBuildings } = useBuildings(mapInstance);

  const handleMapReady = (map: MapLibreMap) => {
    setLocalMapInstance(map);
    setMapInstance(map);
  };

  React.useEffect(() => {
    const handleSosEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ coordinates: [number, number]; zoom?: number }>;
      if (customEvt.detail?.coordinates) {
        const [lng, lat] = customEvt.detail.coordinates;
        const targetZoom = customEvt.detail.zoom || 17;
        flyTo(lng, lat, targetZoom);
      }
    };

    window.addEventListener('RESCUE_SOS_RECEIVED', handleSosEvent);
    return () => {
      window.removeEventListener('RESCUE_SOS_RECEIVED', handleSosEvent);
    };
  }, [flyTo]);


  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#07161E] overflow-hidden">
      {/* Loading Overlay */}
      <LoadingOverlay />

      {/* Main MapLibre Canvas */}
      <MapCanvas onMapReady={handleMapReady} />

      {/* Top Floating Command Header (Search + Layer Manager + GIS Toolbar) */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-start justify-between gap-4 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <SearchBar onFlyTo={flyTo} />
            <LayerManager />
          </div>

          {/* Emergency Route Planner Command Card & Candidate Selector */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            <NavigationCommandCard />
            <RouteSelectorCard mapInstance={mapInstance} />
          </div>
        </div>

        {/* Center Navigation Turn-by-Turn HUD */}
        <div className="flex-1 max-w-xl mx-auto flex justify-center pointer-events-auto">
          <NavigationHUD />
        </div>

        <Gistoolbar onResetNorth={resetNorth} />
      </div>

      {/* Left Drawer Side Controls (Hazard Drawer + Mission Dispatch Targets) */}
      <div className="absolute top-20 left-4 z-20 flex flex-col gap-3 pointer-events-none">
        <HazardAvoidanceTool />
        <MissionRoutingPicker />
      </div>

      {/* Interactive Tools HUD (Measurement + Drawing) */}
      <MeasurementTool />
      <DrawingTool />

      {/* Right Controls Panel */}
      <div className="absolute top-20 right-4 z-30">
        <MapControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetNorth={resetNorth}
          onTogglePitch={togglePitch}
          onToggleBuildings={toggleBuildings}
          onToggleTerrain={toggleTerrain}
        />
      </div>

      {/* Interactive Feature Popup Card */}
      <PopupCard />

      {/* Bottom Floating Bar (Telemetry HUD + MiniMap + Legend + Disaster Legend + Attribution) */}
      <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between pointer-events-none">
        <div className="flex items-end gap-3">
          <MiniMap />
          <Legend />
          <DisasterLegend />
        </div>

        {/* Center Bottom ETA Telemetry Widget */}
        <div className="flex-1 max-w-md mx-auto flex justify-center pointer-events-auto">
          <ETATelemetryWidget />
        </div>

        <CoordinatePanel />
      </div>

      {/* Modal & Mobile Overlays */}
      <RouteComparisonModal />
      <CompactMobileHUD />
      <Attribution />
    </div>
  );
};

export default MapPage;
