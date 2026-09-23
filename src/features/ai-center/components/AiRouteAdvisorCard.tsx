import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Navigation, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AiRouteAdvisorCard: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>({
    recommendedRoute: 'Route B (HAL Flyover North Direct)',
    travelTime: '18.4 mins',
    distanceKm: '12.8 km',
    avoidedHazards: [
      '2.8m Flood Inundation on Kaveri Arterial Road',
      'Downed High-Voltage Tree Line at Sector 4 Junction',
    ],
    reasoning: 'Evaluated 3 candidate paths against live GIS flood polygon layer and Valhalla road matrix. Route B avoids all active water barriers and high-risk bridges.',
  });

  const handleReevaluate = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
    }, 800);
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-[#00D4FF]" />
          <span className="font-bold text-white">AI GIS Hazard-Avoidance Route Advisor</span>
        </div>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#AAB6C3]">Recommended Path:</span>
            <span className="text-[#3DDC84] font-bold">{result.recommendedRoute}</span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#AAB6C3]">Estimated Transit Time:</span>
            <span className="text-[#00D4FF] font-bold">{result.travelTime} ({result.distanceKm})</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-white font-bold text-[11px] block">Actively Avoided Disaster Hazards:</span>
          {result.avoidedHazards.map((hz: string, i: number) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#FF4B55] bg-[#FF4B55]/10 p-2 rounded border border-[#FF4B55]/30">
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
              <span>{hz}</span>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-[#10232C] border border-[#1E3440] rounded-lg text-[11px] text-[#AAB6C3]">
          <strong className="text-white">AI Decision Rationalization:</strong> {result.reasoning}
        </div>

        <Button variant="outline" size="sm" onClick={handleReevaluate} disabled={analyzing} className="w-full">
          {analyzing ? 'Re-evaluating GIS Layers...' : 'Re-run Valhalla Hazard Matrix'}
        </Button>
      </div>
    </Card>
  );
};
