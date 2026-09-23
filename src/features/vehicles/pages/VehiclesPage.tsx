import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

import { useVehicleStore } from '../../../stores/VehicleStore';
import { VehicleCategory, VehicleStatus } from '../../../types/eoc';

import {
  Truck,
  Ship,
  Flame,
  Radio,
  Navigation,
  Fuel,
  Users,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  Wrench,
} from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const { vehicles, updateVehicleStatus, updateVehicleFuel } = useVehicleStore();

  const [filterCategory, setFilterCategory] = useState<VehicleCategory | 'ALL'>('ALL');

  const filteredVehicles = vehicles.filter((v) => filterCategory === 'ALL' || v.category === filterCategory);

  const renderCategoryIcon = (category: VehicleCategory) => {
    switch (category) {
      case 'ambulance':
        return <Truck className="w-4 h-4 text-[#00D4FF]" />;
      case 'rescue_boat':
        return <Ship className="w-4 h-4 text-[#00D4FF]" />;
      case 'fire_truck':
        return <Flame className="w-4 h-4 text-[#FF4B55]" />;
      case 'uav_drone':
        return <Radio className="w-4 h-4 text-[#3DDC84]" />;
      case 'helicopter':
        return <Navigation className="w-4 h-4 text-[#FFB000]" />;
      case 'command_vehicle':
      default:
        return <Truck className="w-4 h-4 text-[#3DDC84]" />;
    }
  };

  return (
    <PageContainer
      title="Vehicle & UAV Fleet Operations"
      subtitle="Real-time Vehicle GPS Telemetry, Fuel Gauges, Driver Roster & Maintenance Status"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Vehicle Fleet' }]}
    >
      {/* Category Filter Bar */}
      <div className="mb-6 p-4 bg-[#10232C] border border-[#1E3440] rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-mono text-gray-400 mr-2">Filter Fleet Category:</span>
          {['ALL', 'ambulance', 'fire_truck', 'rescue_boat', 'helicopter', 'uav_drone', 'command_vehicle'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all uppercase ${
                filterCategory === cat
                  ? 'bg-[#00D4FF] text-[#07161E] shadow-md'
                  : 'bg-[#07161E] border border-[#1E3440] text-gray-400 hover:text-white'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-gray-400">
          Total Operable Fleet: <span className="text-[#00D4FF] font-bold">{vehicles.length}</span>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((veh) => (
          <Card key={veh.id} glow={veh.status === 'Dispatched' ? 'warning' : 'accent'}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#07161E] border border-[#1E3440] flex items-center justify-center">
                    {renderCategoryIcon(veh.category)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white">{veh.callsign}</h3>
                    <span className="text-[10px] font-mono text-[#00D4FF]">{veh.model}</span>
                  </div>
                </div>

                <Badge variant={veh.status === 'Operational' ? 'success' : veh.status === 'Dispatched' ? 'warning' : 'danger'}>
                  {veh.status}
                </Badge>
              </div>

              {/* Driver & License */}
              <div className="p-3 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Driver / Operator:</span>
                  <span className="text-white font-bold">{veh.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plate / FAA Reg:</span>
                  <span className="text-[#00D4FF] font-bold">{veh.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Passenger Capacity:</span>
                  <span className="text-white font-bold">{veh.capacity} Persons</span>
                </div>
              </div>

              {/* Fuel Level Progress */}
              <div>
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5 text-[#00D4FF]" />
                    {veh.category === 'uav_drone' ? 'Battery Charge' : 'Fuel Level'}
                  </span>
                  <span className={veh.fuelPercent < 30 ? 'text-[#FF4B55] font-bold' : 'text-[#3DDC84] font-bold'}>
                    {veh.fuelPercent}%
                  </span>
                </div>
                <div className="w-full bg-[#1E3440] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      veh.fuelPercent < 30 ? 'bg-[#FF4B55]' : 'bg-[#3DDC84]'
                    }`}
                    style={{ width: `${veh.fuelPercent}%` }}
                  />
                </div>
              </div>

              {/* Live Ping & Map Link */}
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
                  {veh.lastPingTime}
                </span>

                <button
                  onClick={() => navigate('/map')}
                  className="text-[#00D4FF] hover:underline font-bold flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View on GIS
                </button>
              </div>

              {/* Status Change Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#1E3440]">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Set Status:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateVehicleStatus(veh.id, 'Operational')}
                    className="px-2 py-0.5 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] text-[10px] font-mono font-bold rounded"
                  >
                    Operable
                  </button>
                  <button
                    onClick={() => updateVehicleStatus(veh.id, 'Dispatched')}
                    className="px-2 py-0.5 bg-[#FFB000]/20 border border-[#FFB000] text-[#FFB000] text-[10px] font-mono font-bold rounded"
                  >
                    Dispatched
                  </button>
                  <button
                    onClick={() => updateVehicleStatus(veh.id, 'Maintenance')}
                    className="px-2 py-0.5 bg-[#FF4B55]/20 border border-[#FF4B55] text-[#FF4B55] text-[10px] font-mono font-bold rounded"
                  >
                    Maint
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default VehiclesPage;
