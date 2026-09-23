import React from 'react';
import { Card } from '../../../components/ui/Card';
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { AiCommanderEngine } from '../services/aiCommanderEngine';

export const PredictiveAnalyticsDashboard: React.FC = () => {
  const forecast = AiCommanderEngine.getPredictiveForecast();

  return (
    <Card
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00D4FF]" />
            <span className="font-bold text-white">48-Hour AI Threat & Workload Predictive Forecast</span>
          </div>
          <span className="text-[10px] font-mono text-[#FFB000] border border-[#FFB000]/40 px-2 py-0.5 rounded bg-[#FFB000]/10">
            ⚠️ ESTIMATED PREDICTION MODEL
          </span>
        </div>
      }
    >
      <div className="space-y-4 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-1">
            <span className="text-[#AAB6C3] text-[11px]">Flood Inundation Surge:</span>
            <div className="text-xl font-bold text-[#FF4B55]">{forecast.floodInundationSurgePct}% Peak</div>
            <p className="text-[10px] text-[#AAB6C3]">Water level forecasted to breach +3.2m by 04:00 AM.</p>
          </div>

          <div className="p-3.5 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-1">
            <span className="text-[#AAB6C3] text-[11px]">Forecasted New Incidents:</span>
            <div className="text-xl font-bold text-[#FFB000]">+{forecast.expectedNewIncidents} Expected</div>
            <p className="text-[10px] text-[#AAB6C3]">High confidence in Sector 4 & Sector 7 grids.</p>
          </div>

          <div className="p-3.5 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-1">
            <span className="text-[#AAB6C3] text-[11px]">Projected Shelter Capacity:</span>
            <div className="text-xl font-bold text-[#00D4FF]">{forecast.shelterCapacityUsedPct}% Filled</div>
            <p className="text-[10px] text-[#AAB6C3]">Recommending opening Relief Hub Bravo by 08:00 AM.</p>
          </div>
        </div>

        <div className="p-3 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-2">
          <span className="text-white font-bold block text-xs">Predicted Cascading Risk Zones (Next 48h):</span>
          <div className="space-y-1">
            {forecast.predictedRiskZones.map((rz, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-[#FFB000]">
                <AlertTriangle className="w-3.5 h-3.5 text-[#FFB000] shrink-0" />
                <span>{rz}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
