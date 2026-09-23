import React, { useEffect, useRef } from 'react';
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
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const { viewState, basemapStyle, selectedFeature } = useMapStore();

  useLayers(mapInstanceRef.current);
  useMapEvents(mapInstanceRef.current);
  useDisasterLayers(mapInstanceRef.current);
  useMeasurement(mapInstanceRef.current);
  useDrawing(mapInstanceRef.current);
  useNavigationLayers(mapInstanceRef.current);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

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

    mapInstanceRef.current = map;

    if (onMapReady) {
      onMapReady(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update style when basemapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const newStyle = TileService.getStyle(basemapStyle);
    mapInstanceRef.current.setStyle(newStyle);
  }, [basemapStyle]);

  // Synchronize selection marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedFeature) {
      if (!markerRef.current) {
        const el = document.createElement('div');
        el.className = 'search-highlight-marker';
        markerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(selectedFeature.coordinates)
          .addTo(mapInstanceRef.current);
      } else {
        markerRef.current.setLngLat(selectedFeature.coordinates);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    }
  }, [selectedFeature]);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-4rem)] bg-[#07161E] overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
    </div>
  );
};
