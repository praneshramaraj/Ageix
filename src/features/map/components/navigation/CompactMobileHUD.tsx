import React from 'react';
import { Navigation, Clock, Compass } from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';

export const CompactMobileHUD: React.FC = () => {
  const { navigationStatus, telemetry, getSelectedRoute } = useNavigationStore();

  if (navigationStatus !== 'navigating') return null;

  const route = getSelectedRoute();
  const remainingMin = telemetry ? Math.round(telemetry.remainingDurationSeconds / 60) : 0;
  const remainingKm = telemetry ? (telemetry.remainingDistanceMeters / 1000).toFixed(1) : '0';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07161E]/95 border-t border-[#00D4FF]/40 p-3 shadow-2xl backdrop-blur-md text-white flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/20 border border-[#00D4FF]/40 flex items-center justify-center">
          <Navigation className="w-5 h-5 text-[#00D4FF]" />
        </div>
        <div>
          <div className="text-sm font-bold font-mono text-[#3DDC84]">
            {remainingMin} MIN ({remainingKm} km)
          </div>
          <p className="text-[10px] font-mono text-gray-400 line-clamp-1">
            {route ? route.name : 'Navigating Emergency Corridor'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-[#10232C] border border-[#1E3440] rounded text-xs font-mono font-bold text-[#00D4FF]">
          {telemetry?.speedKmh || 0} km/h
        </span>
      </div>
    </div>
  );
};
