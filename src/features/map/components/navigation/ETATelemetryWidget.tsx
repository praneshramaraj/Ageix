import React from 'react';
import {
  Clock,
  Compass,
  Gauge,
  Play,
  Pause,
  FastForward,
  CheckCircle2,
} from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';

export const ETATelemetryWidget: React.FC = () => {
  const {
    navigationStatus,
    telemetry,
    isSimulationPlaying,
    setIsSimulationPlaying,
    simulationSpeed,
    setSimulationSpeed,
  } = useNavigationStore();

  if (navigationStatus !== 'navigating' && navigationStatus !== 'arrived') {
    return null;
  }

  const remainingMin = telemetry ? Math.round(telemetry.remainingDurationSeconds / 60) : 0;
  const remainingDistKm = telemetry ? (telemetry.remainingDistanceMeters / 1000).toFixed(1) : '0.0';
  const currentSpeed = telemetry ? telemetry.speedKmh : 0;

  const etaTime = new Date(Date.now() + (telemetry ? telemetry.remainingDurationSeconds * 1000 : 0)).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const speedOptions = [1, 2, 4, 8];

  return (
    <div className="pointer-events-auto w-full max-w-md bg-[#10232C]/95 border border-[#1E3440] rounded-xl shadow-2xl backdrop-blur-md text-white overflow-hidden transition-all">
      {/* Telemetry Numbers Row */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-[#3DDC84]">{remainingMin}</span>
            <span className="text-xs font-mono font-bold text-gray-400 uppercase">MIN</span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00D4FF]" />
            ETA: <span className="text-white font-bold">{etaTime}</span>
          </p>
        </div>

        <div className="h-10 w-px bg-[#1E3440]" />

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-white">{remainingDistKm}</span>
            <span className="text-xs font-mono text-gray-400 uppercase">KM</span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-[#00D4FF]" />
            Distance Left
          </p>
        </div>

        <div className="h-10 w-px bg-[#1E3440]" />

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-[#00D4FF]">{currentSpeed}</span>
            <span className="text-xs font-mono text-gray-400 uppercase">KM/H</span>
          </div>
          <p className="text-[11px] font-mono text-gray-400 mt-0.5 flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#00D4FF]" />
            Telemetry
          </p>
        </div>
      </div>

      {/* Progress Bar & Simulation Controls */}
      <div className="px-4 py-2.5 bg-[#07161E]/90 border-t border-[#1E3440] flex items-center justify-between gap-4">
        {/* Progress Bar */}
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-gray-400">
            <span>Progress</span>
            <span className="text-[#3DDC84] font-bold">{telemetry?.progressPercentage || 0}%</span>
          </div>
          <div className="w-full h-2 bg-[#1E3440] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00D4FF] to-[#3DDC84] transition-all duration-300"
              style={{ width: `${telemetry?.progressPercentage || 0}%` }}
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsSimulationPlaying(!isSimulationPlaying)}
            className="p-2 bg-[#00D4FF]/20 hover:bg-[#00D4FF]/30 border border-[#00D4FF]/50 text-[#00D4FF] rounded-lg transition-colors"
            title={isSimulationPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          >
            {isSimulationPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <div className="flex items-center bg-[#10232C] border border-[#1E3440] rounded-lg p-0.5">
            {speedOptions.map((s) => (
              <button
                key={s}
                onClick={() => setSimulationSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                  simulationSpeed === s ? 'bg-[#00D4FF] text-[#07161E]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
