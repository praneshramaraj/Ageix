import React from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { MOCK_HOSPITALS } from '../../../services/mockData';
import { Building2, Phone, AlertTriangle, Plus } from 'lucide-react';

export const HospitalsPage: React.FC = () => {
  return (
    <PageContainer
      title="Hospital Trauma & Emergency Capacities"
      subtitle="Bed Capacity, ICU Bed Monitoring, Trauma Doctors & Ambulance Diversion Alerts"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Hospitals' }]}
      action={
        <Button variant="accent" icon={<Plus className="w-4 h-4" />}>
          Register Medical Center
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_HOSPITALS.map((h) => {
          const bedOccupancyPct = Math.round((h.occupiedBeds / h.totalBeds) * 100);
          const icuOccupancyPct = Math.round((h.icuBedsOccupied / h.icuBedsTotal) * 100);

          return (
            <Card
              key={h.id}
              title={
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF4B55]" />
                  <span className="font-bold text-white text-xs">{h.name}</span>
                </div>
              }
              action={
                <Badge variant={h.status === 'NORMAL' ? 'success' : h.status === 'HIGH OCCUPANCY' ? 'warning' : 'danger'}>
                  {h.status}
                </Badge>
              }
            >
              <div className="space-y-4 text-xs">
                <p className="text-[11px] text-[#AAB6C3]">{h.location}</p>

                {/* Total Bed Occupancy Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#AAB6C3] mb-1">
                    <span>Total Bed Occupancy</span>
                    <span className="font-bold text-white">
                      {h.occupiedBeds} / {h.totalBeds} ({bedOccupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#07161E] border border-[#1E3440] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        bedOccupancyPct > 90 ? 'bg-[#FF4B55]' : bedOccupancyPct > 75 ? 'bg-[#FFB000]' : 'bg-[#3DDC84]'
                      }`}
                      style={{ width: `${bedOccupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* ICU Bed Occupancy Bar */}
                <div>
                  <div className="flex justify-between text-[10px] font-mono text-[#AAB6C3] mb-1">
                    <span>ICU Critical Beds</span>
                    <span className="font-bold text-[#FF4B55]">
                      {h.icuBedsOccupied} / {h.icuBedsTotal} ({icuOccupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#07161E] border border-[#1E3440] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        icuOccupancyPct > 90 ? 'bg-[#FF4B55]' : 'bg-[#FFB000]'
                      }`}
                      style={{ width: `${icuOccupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Stats */}
                <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#AAB6C3]">Doctors on Duty:</span>
                    <span className="font-bold text-[#3DDC84]">{h.doctorsOnDuty} Trauma Surgeons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB6C3]">Stationed Ambulances:</span>
                    <span className="font-mono text-[#00D4FF]">{h.ambulancesStationed} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AAB6C3]">Emergency Contact:</span>
                    <span className="font-mono text-white flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#00D4FF]" /> {h.phone}
                    </span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Update Capacity Status
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};
