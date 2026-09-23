import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Sparkles, ArrowUpRight, Info } from 'lucide-react';
import { AiCommanderEngine } from '../services/aiCommanderEngine';
import { PrioritizedMissionScore } from '../services/llmProvider';

export const MissionPrioritizerCard: React.FC = () => {
  const [prioritized, setPrioritized] = useState<PrioritizedMissionScore[]>([]);

  useEffect(() => {
    AiCommanderEngine.getPrioritizedMissions().then(setPrioritized);
  }, []);

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFB000]" />
          <span className="font-bold text-white">AI Multi-Factor Mission Prioritization</span>
        </div>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        <p className="text-[#AAB6C3] text-[11px]">
          Algorithms score active missions based on severity, victim count, distance, route accessibility & elapsed time.
        </p>

        {prioritized.map((item, idx) => (
          <div
            key={item.missionId}
            className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl hover:border-[#FFB000]/50 transition"
          >
            <div className="flex justify-between items-start mb-1.5">
              <div>
                <span className="text-[#00D4FF] font-bold text-[11px]">RANK #{idx + 1}</span>
                <h4 className="text-white font-bold text-xs">{item.title}</h4>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#FFB000]/20 text-[#FFB000] font-bold text-xs">
                SCORE: {item.score}/100
              </span>
            </div>

            {/* Score Breakdown Bar */}
            <div className="w-full bg-[#10232C] h-1.5 rounded-full overflow-hidden flex my-2">
              <div style={{ width: `${item.breakdown.severityWeight * 2.5}%` }} className="bg-[#FF4B55]" />
              <div style={{ width: `${item.breakdown.victimsWeight * 3.3}%` }} className="bg-[#FFB000]" />
              <div style={{ width: `${item.breakdown.distanceWeight * 6.6}%` }} className="bg-[#00D4FF]" />
              <div style={{ width: `${item.breakdown.accessibilityWeight * 10}%` }} className="bg-[#3DDC84]" />
            </div>

            <p className="text-[11px] text-[#AAB6C3] flex items-center gap-1 mt-1">
              <Info className="w-3 h-3 text-[#FFB000] shrink-0" />
              <span>{item.reasoning}</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
