import { useEffect } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import { useMapStore } from '../stores/MapStore';
import { calculateTotalDistance, calculatePolygonArea } from '../utils/geojson';

export function useMeasurement(map: MapLibreMap | null) {
  const { activeGisTool, measurementPoints, addMeasurementPoint } = useMapStore();

  const isMeasuring = activeGisTool === 'measure_distance' || activeGisTool === 'measure_area';

  useEffect(() => {
    if (!map || !isMeasuring) return;

    const handleClick = (e: any) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      addMeasurementPoint({
        coordinates: [lng, lat],
        label: `Pt ${measurementPoints.length + 1}`,
      });
    };

    map.getCanvas().style.cursor = 'crosshair';
    map.on('click', handleClick);

    return () => {
      if (map.getCanvas()) {
        map.getCanvas().style.cursor = '';
      }
      map.off('click', handleClick);
    };
  }, [map, isMeasuring, measurementPoints, addMeasurementPoint]);

  const coords = measurementPoints.map((p) => p.coordinates);
  const distanceInfo = calculateTotalDistance(measurementPoints);
  const areaInfo = calculatePolygonArea(coords);

  return {
    isMeasuring,
    measurementPoints,
    distanceInfo,
    areaInfo,
  };
}
