import React from 'react';
import { CheckCircle2, Clock, MapPin, ShieldAlert, Truck, UserCheck, Heart, Award } from 'lucide-react';

export interface TimelineStep {
  title: string;
  time: string;
  actor: string;
  completed: boolean;
  active?: boolean;
}

export const MissionTimeline: React.FC<{
  currentStatus: string;
  steps?: TimelineStep[];
}> = ({ currentStatus, steps }) => {
  const defaultSteps: TimelineStep[] = [
    { title: 'SOS Received', time: '10:45:00 UTC', actor: 'Civilian Mobile App', completed: true },
    { title: 'Dispatcher Accepted', time: '10:46:12 UTC', actor: 'EOC Controller', completed: true },
    { title: 'Team Assigned', time: '10:47:30 UTC', actor: 'NDRF Alpha Unit 1', completed: currentStatus !== 'Waiting' && currentStatus !== 'Accepted' },
    { title: 'Vehicle Departed', time: '10:48:00 UTC', actor: 'Rapid Response Boat R-04', completed: currentStatus !== 'Waiting' && currentStatus !== 'Accepted' && currentStatus !== 'Team Assigned' },
    { title: 'Reached Victim', time: '10:54:15 UTC', actor: 'On-Scene Rescue Lead', completed: ['Reached Victim', 'Rescue In Progress', 'Transporting', 'Completed'].includes(currentStatus) },
    { title: 'Victim Rescued', time: '11:02:40 UTC', actor: 'NDRF Tactical Team', completed: ['Rescue In Progress', 'Transporting', 'Completed'].includes(currentStatus) },
    { title: 'Hospital Reached', time: '11:15:00 UTC', actor: 'St. John Trauma Center', completed: ['Transporting', 'Completed'].includes(currentStatus) },
    { title: 'Mission Completed', time: '11:20:00 UTC', actor: 'EOC Command Center', completed: currentStatus === 'Completed' },
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <div className="p-4 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-4">
      <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1E3440] pb-2">
        <Clock className="w-4 h-4 text-[#00D4FF]" /> Mission Chronological Timeline
      </h4>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E3440]">
        {displaySteps.map((step, idx) => (
          <div key={idx} className="relative flex items-start justify-between text-xs">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                step.completed
                  ? 'bg-[#3DDC84] border-[#3DDC84] shadow-md shadow-[#3DDC84]/30'
                  : 'bg-[#07161E] border-gray-600'
              }`}
            />
            <div>
              <span className={`font-bold block ${step.completed ? 'text-white' : 'text-gray-500'}`}>
                {step.title}
              </span>
              <span className="text-[10px] text-[#AAB6C3] font-mono">{step.actor}</span>
            </div>
            <span className="font-mono text-[10px] text-[#00D4FF] font-bold">{step.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
