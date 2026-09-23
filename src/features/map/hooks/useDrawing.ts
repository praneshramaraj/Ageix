import { useState, useEffect } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';

export function useDrawing(map: MapLibreMap | null) {
  const { activeGisTool, addDrawnShape, drawnShapes, clearDrawnShapes } = useMapStore();
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);

  const isDrawing =
    activeGisTool === 'draw_polygon' ||
    activeGisTool === 'draw_rectangle' ||
    activeGisTool === 'place_marker';

  useEffect(() => {
    if (!map || !isDrawing) {
      setCurrentPoints([]);
      return;
    }

    const handleClick = (e: any) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      if (activeGisTool === 'place_marker') {
        addDrawnShape({
          id: `marker-${Date.now()}`,
          type: 'marker',
          coordinates: [lng, lat],
          color: '#FF4B55',
          label: 'Disaster Staging Point',
        });
        return;
      }

      const nextPoints = [...currentPoints, [lng, lat] as [number, number]];
      setCurrentPoints(nextPoints);

      if (activeGisTool === 'draw_polygon' && nextPoints.length >= 3) {
        // Auto-complete shape or add
        addDrawnShape({
          id: `poly-${Date.now()}`,
          type: 'polygon',
          coordinates: nextPoints,
          color: '#00D4FF',
          label: 'Drawn Risk Sector',
        });
      }
    };

    map.getCanvas().style.cursor = 'crosshair';
    map.on('click', handleClick);

    return () => {
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = '';
      }
      map.off('click', handleClick);
    };
  }, [map, isDrawing, activeGisTool, currentPoints, addDrawnShape]);

  return {
    isDrawing,
    currentPoints,
    drawnShapes,
    clearDrawnShapes,
  };
}
