import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
type MapLibreMap = maplibregl.Map;
import 'maplibre-gl/dist/maplibre-gl.css';
import '../assets/styles/mapCustom.css';
import { useMapStore } from '../stores/MapStore';
import { TileService } from '../services/TileService';
import { useLayers } from '../hooks/useLayers';
import { useMapEvents } from '../hooks/useMapEvents';
import { useDisasterLayers } from '../hooks/useDisasterLayers';
import { useMeasurement } from '../hooks/useMeasurement';
import { useDrawing } from '../hooks/useDrawing';
import { useNavigationLayers } from '../hooks/useNavigationLayers';

interface MapCanvasProps {
  onMapReady?: (map: MapLibreMap) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ onMapReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const { viewState, basemapStyle, selectedFeature } = useMapStore();

  useLayers(mapInstance);
  useMapEvents(mapInstance);
  useDisasterLayers(mapInstance);
  useMeasurement(mapInstance);
  useDrawing(mapInstance);
  useNavigationLayers(mapInstance);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!containerRef.current || mapInstance) return;

    TileService.preloadBasemaps();

    const styleSpec = TileService.getStyle(basemapStyle);

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleSpec,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
      attributionControl: false,
    });

    setMapInstance(map);

    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      map.remove();
      setMapInstance(null);
    };
  }, []);

  // Update style when basemapStyle changes
  useEffect(() => {
    if (!mapInstance) return;
    try {
      const newStyle = TileService.getStyle(basemapStyle);
      mapInstance.setStyle(newStyle);
    } catch (err) {
      console.warn('[MapCanvas] Failed to set style:', err);
    }
  }, [basemapStyle, mapInstance]);

  // Synchronize selection marker
  useEffect(() => {
    if (!mapInstance) return;

    if (selectedFeature) {
      if (!markerRef.current) {
        const el = document.createElement('div');
        el.className = 'search-highlight-marker';
        markerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(selectedFeature.coordinates)
          .addTo(mapInstance);
      } else {
        markerRef.current.setLngLat(selectedFeature.coordinates);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [selectedFeature, mapInstance]);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] bg-[#07161E] overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
};
