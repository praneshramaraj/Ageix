import { useRef, useCallback } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';

export function useMap() {
  const mapRef = useRef<MapLibreMap | null>(null);
  const { setViewState } = useMapStore();

  const setMapInstance = useCallback((map: MapLibreMap | null) => {
    mapRef.current = map;
  }, []);

  const zoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  }, []);

  const resetNorth = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.resetNorthPitch();
      setViewState({ bearing: 0, pitch: 0 });
    }
  }, [setViewState]);

  const togglePitch = useCallback(() => {
    if (mapRef.current) {
      const currentPitch = mapRef.current.getPitch();
      const targetPitch = currentPitch > 20 ? 0 : 60;
      mapRef.current.easeTo({ pitch: targetPitch, duration: 800 });
      setViewState({ pitch: targetPitch });
    }
  }, [setViewState]);

  const flyTo = useCallback((lng: number, lat: number, zoom: number = 15) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        pitch: 45,
        duration: 2000,
        essential: true,
      });
    }
  }, []);

  return {
    mapRef,
    setMapInstance,
    zoomIn,
    zoomOut,
    resetNorth,
    togglePitch,
    flyTo,
  };
}
