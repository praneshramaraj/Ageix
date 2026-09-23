import { useEffect } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';

export function useMapEvents(map: MapLibreMap | null) {
  const { setViewState, setSelectedFeature, setIsMapLoaded, setTileLoadingProgress } = useMapStore();

  useEffect(() => {
    // Immediate 1.5s fallback to ensure loading overlay hides quickly
    const fallbackTimer = setTimeout(() => {
      setIsMapLoaded(true);
      setTileLoadingProgress(100);
    }, 1500);

    if (!map) {
      return () => clearTimeout(fallbackTimer);
    }

    const markLoaded = () => {
      setIsMapLoaded(true);
      setTileLoadingProgress(100);
    };

    if (map.isStyleLoaded() || map.loaded()) {
      markLoaded();
    }

    const handleMove = () => {
      try {
        const center = map.getCenter();
        setViewState({
          longitude: center.lng,
          latitude: center.lat,
          zoom: map.getZoom(),
          pitch: map.getPitch(),
          bearing: map.getBearing(),
        });
      } catch (_) {}
    };

    const handleLoad = () => {
      markLoaded();
    };

    const handleDataLoading = () => {
      setTileLoadingProgress(60);
    };

    const handleIdle = () => {
      markLoaded();
    };

    const handleClick = (e: any) => {
      try {
        const features = map.queryRenderedFeatures(e.point);
        if (features && features.length > 0) {
          const topFeature = features[0];
          const props = topFeature.properties || {};
          setSelectedFeature({
            id: topFeature.id || `feat-${Date.now()}`,
            name: props.name || props.title || 'Selected Map Feature',
            type: props.category || props.type || 'GIS Feature',
            category: props.category || 'POI',
            coordinates: [e.lngLat.lng, e.lngLat.lat],
            properties: props,
            layerId: topFeature.layer ? topFeature.layer.id : undefined,
          });
        }
      } catch (_) {}
    };

    map.on('move', handleMove);
    map.on('pitch', handleMove);
    map.on('rotate', handleMove);
    map.on('load', handleLoad);
    map.on('styledata', handleLoad);
    map.on('dataloading', handleDataLoading);
    map.on('idle', handleIdle);
    map.on('click', handleClick);

    return () => {
      clearTimeout(fallbackTimer);
      try {
        map.off('move', handleMove);
        map.off('pitch', handleMove);
        map.off('rotate', handleMove);
        map.off('load', handleLoad);
        map.off('styledata', handleLoad);
        map.off('dataloading', handleDataLoading);
        map.off('idle', handleIdle);
        map.off('click', handleClick);
      } catch (_) {}
    };
  }, [map, setViewState, setSelectedFeature, setIsMapLoaded, setTileLoadingProgress]);
}
