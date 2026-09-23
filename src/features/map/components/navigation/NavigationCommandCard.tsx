import React, { useState } from 'react';
import {
  Navigation,
  NavigationOff,
  Ambulance,
  Flame,
  Shield,
  Truck,
  Ship,
  Users,
  Zap,
  ShieldAlert,
  ArrowUpDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';
import { UnifiedRoutingService } from '../../services/routing/UnifiedRoutingService';
import { VehicleType, RouteProfile } from '../../types/navigation';

export const NavigationCommandCard: React.FC = () => {
  const {
    origin,
    destination,
    vehicleType,
    setVehicleType,
    selectedProfile,
    setSelectedProfile,
    setRoutes,
    setSelectedRouteId,
    swapOriginDestination,
    clearRouting,
    setNavigationStatus,
    navigationStatus,
    setIsComparisonModalOpen,
  } = useNavigationStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const vehicleOptions: { id: VehicleType; label: string; icon: any }[] = [
    { id: 'ambulance', label: 'Ambulance', icon: Ambulance },
    { id: 'fire_truck', label: 'Fire Truck', icon: Flame },
    { id: 'police_car', label: 'Police', icon: Shield },
    { id: 'heavy_rescue', label: 'Heavy Rescue', icon: Truck },
    { id: 'rescue_boat', label: 'Boat', icon: Ship },
    { id: 'convoy', label: 'Convoy', icon: Users },
  ];

  const profileOptions: { id: RouteProfile; label: string; icon: any }[] = [
    { id: 'fastest', label: 'Fastest', icon: Zap },
    { id: 'shortest', label: 'Shortest', icon: Navigation },
    { id: 'safest', label: 'Safest', icon: ShieldAlert },
    { id: 'emergency', label: 'Emergency', icon: Flame },
    { id: 'disaster_aware', label: 'Disaster-Aware', icon: Sparkles },
  ];

  const handleCalculateRoute = async () => {
    if (!origin || !destination) return;

    setIsLoading(true);
    setNavigationStatus('calculating');

    try {
      const generatedRoutes = await UnifiedRoutingService.calculateEmergencyRoutes(
        origin.coordinates,
        destination.coordinates,
        vehicleType
      );

      setRoutes(generatedRoutes);
      if (generatedRoutes.length > 0) {
        setSelectedRouteId(generatedRoutes[0].id);
        setNavigationStatus('route_selected');
      }
    } catch (err) {
      console.error('Route calculation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 bg-[#10232C]/90 hover:bg-[#1E3440] text-[#00D4FF] rounded-lg border border-[#00D4FF]/40 shadow-xl backdrop-blur-md transition-all font-mono text-xs font-bold uppercase tracking-wider"
      >
        <Navigation className="w-4 h-4 text-[#00D4FF]" />
        Open Route Planner
      </button>
    );
  }

  return (
    <div className="pointer-events-auto w-96 bg-[#10232C]/95 border border-[#1E3440] rounded-xl shadow-2xl backdrop-blur-md text-white overflow-hidden flex flex-col transition-all">
      {/* Header */}
      <div className="px-4 py-3 bg-[#07161E]/80 border-b border-[#1E3440] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-[#00D4FF]" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
              EMERGENCY ROUTE PLANNER
            </h3>
            <span className="text-[10px] text-gray-400 font-mono">AEGISX Valhalla & OSM Engine</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsComparisonModalOpen(true)}
            className="p-1.5 hover:bg-[#1E3440] rounded-md text-gray-400 hover:text-[#00D4FF] transition-colors"
            title="Route Comparison Matrix"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-[#1E3440] rounded-md text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Origin / Destination Input Box */}
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2 bg-[#07161E] border border-[#1E3440] rounded-lg px-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3DDC84]" />
            <input
              type="text"
              readOnly
              value={origin ? origin.label : 'Select Start Point'}
              className="bg-transparent text-xs font-mono text-gray-200 outline-none w-full cursor-default"
            />
          </div>

          <button
            onClick={swapOriginDestination}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-[#10232C] border border-[#1E3440] hover:border-[#00D4FF] rounded-full text-gray-400 hover:text-[#00D4FF] transition-all shadow-md"
            title="Swap Origin & Destination"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 bg-[#07161E] border border-[#1E3440] rounded-lg px-3 py-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF4B55]" />
            <input
              type="text"
              readOnly
              value={destination ? destination.label : 'Click Map / SOS Node to set Destination'}
              className="bg-transparent text-xs font-mono text-gray-200 outline-none w-full cursor-default placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Vehicle Selection */}
        <div>
          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5 block">
            Rescue Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {vehicleOptions.map((v) => {
              const Icon = v.icon;
              const isSelected = vehicleType === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVehicleType(v.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-[11px] font-mono transition-all ${
                    isSelected
                      ? 'bg-[#00D4FF]/15 border-[#00D4FF] text-[#00D4FF] font-bold'
                      : 'bg-[#07161E] border-[#1E3440] text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="truncate">{v.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Tabs */}
        <div>
          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5 block">
            Routing Optimization Profile
          </label>
          <div className="flex items-center gap-1 bg-[#07161E] p-1 rounded-lg border border-[#1E3440]">
            {profileOptions.map((p) => {
              const isSelected = selectedProfile === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfile(p.id)}
                  className={`flex-1 py-1 px-1.5 rounded text-[10px] font-mono font-medium transition-all truncate ${
                    isSelected
                      ? 'bg-[#3DDC84]/20 text-[#3DDC84] font-bold border border-[#3DDC84]/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCalculateRoute}
            disabled={!origin || !destination || isLoading}
            className="flex-1 py-2.5 bg-[#00D4FF] hover:bg-[#00B4D8] disabled:bg-gray-700 text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#07161E] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            Calculate Emergency Route
          </button>

          {navigationStatus !== 'idle' && (
            <button
              onClick={clearRouting}
              className="p-2.5 bg-[#FF4B55]/15 hover:bg-[#FF4B55]/30 border border-[#FF4B55]/40 text-[#FF4B55] rounded-lg transition-colors"
              title="Clear Route"
            >
              <NavigationOff className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
