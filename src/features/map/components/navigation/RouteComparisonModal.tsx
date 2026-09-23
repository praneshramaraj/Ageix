import React from 'react';
import { X, Check, ShieldAlert, Zap, Compass, Clock, Mountain } from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';

export const RouteComparisonModal: React.FC = () => {
  const {
    routes,
    selectedRouteId,
    setSelectedRouteId,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
  } = useNavigationStore();

  if (!isComparisonModalOpen || routes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#10232C] border border-[#1E3440] rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#07161E] border-b border-[#1E3440] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-mono text-white uppercase tracking-wider">
              EMERGENCY ROUTE COMPARISON MATRIX
            </h2>
            <p className="text-xs font-mono text-gray-400">
              Multi-factor trade-off analysis across generated response corridors
            </p>
          </div>
          <button
            onClick={() => setIsComparisonModalOpen(false)}
            className="p-2 hover:bg-[#1E3440] rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-x-auto">
          <div className="grid grid-cols-4 gap-4 min-w-[650px]">
            {/* Row Header Label Column */}
            <div className="space-y-4 pt-12 text-xs font-mono text-gray-400 font-bold border-r border-[#1E3440] pr-4">
              <div className="h-10 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00D4FF]" />
                Estimated Travel Time
              </div>
              <div className="h-10 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#00D4FF]" />
                Total Distance
              </div>
              <div className="h-10 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#FF4B55]" />
                Hazard Risk Index
              </div>
              <div className="h-10 flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#FFB000]" />
                Elevation Gain / Loss
              </div>
              <div className="h-10 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#3DDC84]" />
                AI Score & Recommendation
              </div>
            </div>

            {/* Route Columns */}
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const durMin = Math.round(route.totalDurationSeconds / 60);
              const distKm = (route.totalDistanceMeters / 1000).toFixed(1);

              return (
                <div
                  key={route.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-[#07161E] border-[#00D4FF] ring-2 ring-[#00D4FF]/30 shadow-xl'
                      : 'bg-[#07161E]/50 border-[#1E3440]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="h-10 border-b border-[#1E3440] pb-2 flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-white truncate">{route.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#00D4FF]" />}
                    </div>

                    <div className="h-10 flex items-center text-lg font-bold font-mono text-[#3DDC84]">
                      {durMin} min
                    </div>

                    <div className="h-10 flex items-center text-sm font-bold font-mono text-white">
                      {distKm} km
                    </div>

                    <div className="h-10 flex items-center text-sm font-bold font-mono">
                      {route.hazardRiskScore > 20 ? (
                        <span className="text-[#FF4B55]">{route.hazardRiskScore}% (High Risk)</span>
                      ) : (
                        <span className="text-[#3DDC84]">4% (Minimal Risk)</span>
                      )}
                    </div>

                    <div className="h-10 flex items-center text-xs font-mono text-gray-300">
                      +{route.elevationGainMeters}m / -{route.elevationLossMeters}m
                    </div>

                    <div className="h-10 flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-[#00D4FF]">{route.score.overallScore}/100</span>
                      {route.score.isAiRecommended && (
                        <span className="px-1.5 py-0.5 bg-[#3DDC84]/20 border border-[#3DDC84]/50 text-[#3DDC84] text-[9px] font-mono font-bold rounded">
                          AI TOP
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRouteId(route.id);
                      setIsComparisonModalOpen(false);
                    }}
                    className={`w-full mt-4 py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                      isSelected
                        ? 'bg-[#00D4FF] text-[#07161E]'
                        : 'bg-[#1E3440] hover:bg-[#2A4758] text-white'
                    }`}
                  >
                    {isSelected ? 'Active Route Selected' : 'Select This Route'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
