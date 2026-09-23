import React from 'react';
import {
  AlertCircle,
  Building2,
  Home,
  Flame,
  Shield,
  Tent,
  Package,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';
import { MissionLocationTarget } from '../../types/navigation';
import { UnifiedRoutingService } from '../../services/routing/UnifiedRoutingService';

export const MissionRoutingPicker: React.FC = () => {
  const {
    setDestination,
    origin,
    vehicleType,
    setRoutes,
    setSelectedRouteId,
    setNavigationStatus,
    activeMissionTarget,
    setActiveMissionTarget,
  } = useNavigationStore();

  const missionTargets: MissionLocationTarget[] = [
    {
      id: 'tgt_sos_1',
      title: 'SOS Alert #4012 - Trapped Civilians',
      type: 'sos',
      coordinates: [77.588, 12.962],
      urgency: 'critical',
      victimsCount: 6,
    },
    {
      id: 'tgt_hosp_1',
      title: 'Victoria Central Trauma Hospital',
      type: 'hospital',
      coordinates: [77.574, 12.963],
      availableBeds: 24,
    },
    {
      id: 'tgt_shelter_1',
      title: 'Kanteerava Evacuation Shelter',
      type: 'shelter',
      coordinates: [77.595, 12.969],
    },
    {
      id: 'tgt_fire_1',
      title: 'Central Fire & Rescue Station #01',
      type: 'fire_station',
      coordinates: [77.583, 12.975],
    },
    {
      id: 'tgt_safe_1',
      title: 'Staging Area Alpha (Helipad Safe Zone)',
      type: 'safe_zone',
      coordinates: [77.605, 12.982],
    },
  ];

  const handleRouteToTarget = async (tgt: MissionLocationTarget) => {
    setActiveMissionTarget(tgt);
    const destObj = { coordinates: tgt.coordinates, label: tgt.title };
    setDestination(destObj);

    if (origin) {
      setNavigationStatus('calculating');
      const routes = await UnifiedRoutingService.calculateEmergencyRoutes(
        origin.coordinates,
        tgt.coordinates,
        vehicleType
      );
      setRoutes(routes);
      if (routes.length > 0) {
        setSelectedRouteId(routes[0].id);
        setNavigationStatus('route_selected');
      }
    }
  };

  const renderTargetIcon = (type: MissionLocationTarget['type']) => {
    switch (type) {
      case 'sos':
        return <AlertCircle className="w-3.5 h-3.5 text-[#FF4B55]" />;
      case 'hospital':
        return <Building2 className="w-3.5 h-3.5 text-[#00D4FF]" />;
      case 'shelter':
        return <Home className="w-3.5 h-3.5 text-[#3DDC84]" />;
      case 'fire_station':
        return <Flame className="w-3.5 h-3.5 text-[#FFB000]" />;
      case 'police_station':
        return <Shield className="w-3.5 h-3.5 text-[#00D4FF]" />;
      case 'relief_camp':
        return <Tent className="w-3.5 h-3.5 text-[#3DDC84]" />;
      case 'supply_depot':
        return <Package className="w-3.5 h-3.5 text-[#FFB000]" />;
      case 'safe_zone':
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC84]" />;
    }
  };

  return (
    <div className="pointer-events-auto bg-[#10232C]/95 border border-[#1E3440] rounded-xl p-3 shadow-xl backdrop-blur-md text-white w-72">
      <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-[#00D4FF] border-b border-[#1E3440] pb-2 mb-2">
        <Navigation className="w-3.5 h-3.5" />
        QUICK MISSION DISPATCH POIS
      </div>

      <div className="space-y-1.5 max-h-44 overflow-y-auto">
        {missionTargets.map((tgt) => {
          const isActive = activeMissionTarget?.id === tgt.id;
          return (
            <div
              key={tgt.id}
              onClick={() => handleRouteToTarget(tgt)}
              className={`p-2 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-[11px] font-mono ${
                isActive
                  ? 'bg-[#07161E] border-[#00D4FF] text-[#00D4FF] font-bold shadow-md'
                  : 'bg-[#07161E]/60 border-[#1E3440] hover:border-gray-500 text-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                {renderTargetIcon(tgt.type)}
                <span className="truncate">{tgt.title}</span>
              </div>
              <span className="text-[10px] text-[#3DDC84] font-bold shrink-0">ROUTE</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
