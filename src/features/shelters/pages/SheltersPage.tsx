import React from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { MOCK_SHELTERS } from '../../../services/mockData';
import { Home, Zap, Wifi, HeartPulse, Droplets, Plus } from 'lucide-react';

export const SheltersPage: React.FC = () => {
  return (
    <PageContainer
      title="Evacuation Shelters & Relief Sites"
      subtitle="Evacuee Capacity, Rations, Water Reserves, Power Generators & Medical Badging"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Shelters' }]}
      action={
        <Button variant="accent" icon={<Plus className="w-4 h-4" />}>
          Register Evac Shelter
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SHELTERS.map((s) => {
          const occupancyPct = Math.round((s.currentOccupancy / s.capacity) * 100);

          return (
            <Card
              key={s.id}
              title={
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-[#3DDC84]" />
                  <span className="font-bold text-white text-xs">{s.name}</span>
                </div>
              }
              action={
                <Badge variant={s.status === 'OPEN' ? 'success' : s.status === 'NEAR CAPACITY' ? 'warning' : 'danger'}>
                  {s.status}
                </Badge>
              }
            >
              <div className="space-y-4 text-xs">
                <p className="text-[11px] text-[#AAB6C3]">{s.location}</p>

                {/* Occupancy Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#AAB6C3] mb-1">
                    <span>Evacuee Occupancy</span>
                    <span className="font-bold text-white">
                      {s.currentOccupancy.toLocaleString()} / {s.capacity.toLocaleString()} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#07161E] border border-[#1E3440] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPct > 90 ? 'bg-[#FF4B55]' : occupancyPct > 75 ? 'bg-[#FFB000]' : 'bg-[#3DDC84]'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border ${
                      s.hasPowerGenerator
                        ? 'bg-[#3DDC84]/15 text-[#3DDC84] border-[#3DDC84]/30'
                        : 'bg-[#1E3440] text-[#AAB6C3] border-transparent'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> Generator Power
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border ${
                      s.hasMedicalSupport
                        ? 'bg-[#3DDC84]/15 text-[#3DDC84] border-[#3DDC84]/30'
                        : 'bg-[#1E3440] text-[#AAB6C3] border-transparent'
                    }`}
                  >
                    <HeartPulse className="w-3 h-3" /> Medical Clinic
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border ${
                      s.hasInternet
                        ? 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30'
                        : 'bg-[#1E3440] text-[#AAB6C3] border-transparent'
                    }`}
                  >
                    <Wifi className="w-3 h-3" /> Satellite Internet
                  </span>
                </div>

                {/* Supply Stats */}
                <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#AAB6C3]">Food Rations Reserve:</span>
                    <span className="font-bold text-white">{s.foodSupplyDays} Days Supply</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB6C3]">Potable Water:</span>
                    <span className="font-mono text-[#00D4FF]">{s.waterLitres.toLocaleString()} Litres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB6C3]">Shelter Manager:</span>
                    <span className="font-semibold text-white">{s.contactPerson}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Update Shelter Roster
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};
