import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Cpu, Users, Truck, Building2, ShieldAlert } from 'lucide-react';
import { AiCommanderEngine } from '../services/aiCommanderEngine';

export const ResourceOptimizerCard: React.FC = () => {
  const rec = AiCommanderEngine.getResourceRecommendations();

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[#3DDC84]" />
          <span className="font-bold text-white">AI Resource & Equipment Allocation</span>
        </div>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#AAB6C3]">
            <span>Optimal Squad Match:</span>
            <span className="text-[#3DDC84] font-bold">{rec.recommendedTeam?.name || 'Airboat Squad 4'}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#AAB6C3]">
            <span>Optimal Vehicle Match:</span>
            <span className="text-[#00D4FF] font-bold">
              {rec.recommendedVehicle?.model || rec.recommendedVehicle?.callsign || 'NDRF Heavy Rescue Truck'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#AAB6C3]">
            <span>Trauma Hospital Hub:</span>
            <span className="text-white font-bold">{rec.recommendedHospital?.name || 'Victoria Memorial General'}</span>
          </div>
        </div>


        <div className="space-y-1.5">
          <span className="text-white font-bold text-[11px] block">Equipment Dispatch Allocations:</span>
          {rec.equipmentAllocation.map((item, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-[#10232C] rounded-lg border border-[#1E3440] text-[11px]">
              <span className="text-[#AAB6C3]">{item.item}</span>
              <span className="text-[#3DDC84] font-bold">{item.qty} units &rarr; {item.to}</span>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-[#00D4FF]/10 border border-[#00D4FF]/30 rounded-lg text-[11px] text-[#00D4FF]">
          💡 <strong>Fuel Optimization:</strong> {rec.fuelOptimization}
        </div>
      </div>
    </Card>
  );
};
