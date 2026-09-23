import React from 'react';
import {
  Clock,
  Compass,
  AlertTriangle,
  Play,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';
import { VehicleSimulator } from '../../services/navigation/VehicleSimulator';
import { Map as MapLibreMap } from 'maplibre-gl';

interface RouteSelectorCardProps {
  mapInstance: MapLibreMap | null;
}

export const RouteSelectorCard: React.FC<RouteSelectorCardProps> = ({ mapInstance }) => {
  const {
    routes,
    selectedRouteId,
    setSelectedRouteId,
    setNavigationStatus,
    navigationStatus,
    setTelemetry,
    isVoiceEnabled,
    voiceVolume,
    setIsSimulationPlaying,
    setIsComparisonModalOpen,
  } = useNavigationStore();

  if (routes.length === 0 || navigationStatus === 'navigating') {
    return null;
  }

  const handleStartNavigation = () => {
    const selectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
    if (!selectedRoute) return;

    setNavigationStatus('navigating');
    setIsSimulationPlaying(true);

    const simulator = new VehicleSimulator(mapInstance);
    simulator.setVoiceSettings(isVoiceEnabled, voiceVolume);
    simulator.start(
      selectedRoute,
      (telemetry) => setTelemetry(telemetry),
      () => {
        setNavigationStatus('arrived');
        setIsSimulationPlaying(false);
      },
      () => setNavigationStatus('rerouting')
    );
  };

  return (
    <div className="pointer-events-auto w-96 bg-[#10232C]/95 border border-[#1E3440] rounded-xl shadow-2xl backdrop-blur-md text-white overflow-hidden flex flex-col transition-all">
      <div className="px-4 py-3 bg-[#07161E]/80 border-b border-[#1E3440] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00D4FF]" />
          <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
            RECOMMENDED ROUTES ({routes.length})
          </h3>
        </div>

        <button
          onClick={() => setIsComparisonModalOpen(true)}
          className="text-[11px] font-mono text-[#00D4FF] hover:underline flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5" />
          Compare All
        </button>
      </div>

      <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
        {routes.map((route, idx) => {
          const isSelected = route.id === selectedRouteId;
          const durMin = Math.round(route.totalDurationSeconds / 60);
          const distKm = (route.totalDistanceMeters / 1000).toFixed(1);

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#07161E] border-[#00D4FF] shadow-lg ring-1 ring-[#00D4FF]/40'
                  : 'bg-[#07161E]/50 border-[#1E3440] hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-white">{route.name}</span>
                    {route.score.isAiRecommended && (
                      <span className="px-1.5 py-0.5 bg-[#3DDC84]/20 border border-[#3DDC84]/50 text-[#3DDC84] text-[9px] font-mono font-bold rounded uppercase">
                        AI BEST
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5 line-clamp-1">
                    {route.score.aiRecommendationReason}
                  </p>
                </div>
                <span className="text-sm font-bold font-mono text-[#3DDC84]">{durMin} min</span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#1E3440]/60 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#00D4FF]" />
                    {distKm} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    ETA: {new Date(Date.now() + route.totalDurationSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {route.hazardRiskScore > 20 ? (
                  <span className="flex items-center gap-1 text-[#FF4B55] font-bold">
                    <AlertTriangle className="w-3 h-3" />
                    Risk {route.hazardRiskScore}%
                  </span>
                ) : (
                  <span className="text-[#3DDC84] font-bold">Safe Corridor</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-[#07161E]/90 border-t border-[#1E3440]">
        <button
          onClick={handleStartNavigation}
          className="w-full py-2.5 bg-[#3DDC84] hover:bg-[#2ecc71] text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          Start Turn-By-Turn Navigation
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
