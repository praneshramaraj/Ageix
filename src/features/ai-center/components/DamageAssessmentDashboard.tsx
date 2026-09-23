import React from 'react';
import { Card } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { Users, Building2, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { AiCommanderEngine } from '../services/aiCommanderEngine';

export const DamageAssessmentDashboard: React.FC = () => {
  const data = AiCommanderEngine.getDamageAssessment();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Estimated Affected Population"
          value={data.affectedPopulation.toLocaleString()}
          icon={<Users className="w-5 h-5 text-[#00D4FF]" />}
          subtext="Sectors 3, 4, 5 & 7"
          variant="accent"
        />
        <StatCard
          title="Damaged Infrastructure Units"
          value={data.damagedInfrastructureCount}
          icon={<Building2 className="w-5 h-5 text-[#FFB000]" />}
          subtext="Bridges, roads & powerlines"
          variant="warning"
        />
        <StatCard
          title="High-Risk Inundation Zones"
          value={data.highRiskZoneCount}
          icon={<AlertTriangle className="w-5 h-5 text-[#FF4B55]" />}
          subtext="Critical flood perimeter"
          variant="danger"
        />
        <StatCard
          title="Avg EOC Response Time"
          value={`${data.avgResponseTimeMin}m`}
          icon={<Clock className="w-5 h-5 text-[#3DDC84]" />}
          subtext="Dispatch to site arrival"
          variant="success"
        />

      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#FFB000]" />
            <span className="font-bold text-white">Critical Resource Supply Deficit Matrix</span>
          </div>
        }
      >
        <div className="space-y-3 font-mono text-xs">
          {data.resourceDeficits.map((def, idx) => {
            const pct = Math.round((def.current / def.required) * 100);
            return (
              <div key={idx} className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-bold">{def.item}</span>
                  <span className={pct < 50 ? 'text-[#FF4B55] font-bold' : 'text-[#FFB000] font-bold'}>
                    {def.current} / {def.required} {def.unit} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#10232C] h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className={pct < 50 ? 'bg-[#FF4B55] h-full' : 'bg-[#FFB000] h-full'}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
