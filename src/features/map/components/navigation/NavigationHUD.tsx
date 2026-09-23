import React from 'react';
import {
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Compass,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useNavigationStore } from '../../stores/NavigationStore';
import { ManeuverType } from '../../types/navigation';

export const NavigationHUD: React.FC = () => {
  const {
    navigationStatus,
    telemetry,
    getSelectedRoute,
    isVoiceEnabled,
    setVoiceEnabled,
    cameraMode,
    setCameraMode,
    clearRouting,
  } = useNavigationStore();

  if (navigationStatus !== 'navigating' && navigationStatus !== 'arrived') {
    return null;
  }

  const selectedRoute = getSelectedRoute();
  const currentStepIndex = telemetry ? telemetry.currentStepIndex : 0;
  const currentStep = selectedRoute && selectedRoute.steps[currentStepIndex]
    ? selectedRoute.steps[currentStepIndex]
    : null;

  const renderManeuverIcon = (maneuver?: ManeuverType) => {
    switch (maneuver) {
      case 'turn-right':
      case 'turn-slight-right':
      case 'turn-sharp-right':
        return <CornerUpRight className="w-8 h-8 text-[#00D4FF]" />;
      case 'turn-left':
      case 'turn-slight-left':
      case 'turn-sharp-left':
        return <CornerUpLeft className="w-8 h-8 text-[#00D4FF]" />;
      case 'u-turn':
        return <RotateCcw className="w-8 h-8 text-[#00D4FF]" />;
      case 'arrive':
        return <CheckCircle2 className="w-8 h-8 text-[#3DDC84]" />;
      case 'straight':
      default:
        return <ArrowUp className="w-8 h-8 text-[#00D4FF]" />;
    }
  };

  return (
    <div className="pointer-events-auto w-full max-w-xl bg-[#005F73]/95 border border-[#00D4FF]/40 rounded-2xl shadow-2xl backdrop-blur-md text-white overflow-hidden transition-all">
      {/* Top Banner Header */}
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#07161E]/70 border border-[#00D4FF]/40 flex items-center justify-center shadow-inner shrink-0">
            {renderManeuverIcon(currentStep?.maneuver)}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-[#3DDC84]">
                {telemetry ? `${telemetry.distanceToNextManeuverMeters} m` : '---'}
              </span>
              <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
                THEN
              </span>
            </div>

            <h2 className="text-base font-bold font-mono text-white leading-tight mt-0.5 line-clamp-1">
              {currentStep ? currentStep.instruction : 'Follow Emergency Route'}
            </h2>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setVoiceEnabled(!isVoiceEnabled)}
            className={`p-2.5 rounded-xl border transition-all ${
              isVoiceEnabled
                ? 'bg-[#07161E]/80 border-[#00D4FF]/50 text-[#00D4FF]'
                : 'bg-[#07161E]/40 border-gray-600 text-gray-400'
            }`}
            title="Toggle Voice Guidance"
          >
            {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={clearRouting}
            className="p-2.5 bg-[#FF4B55]/20 hover:bg-[#FF4B55]/40 border border-[#FF4B55]/50 text-[#FF4B55] rounded-xl transition-colors"
            title="End Navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lane Guidance & Camera Bar */}
      <div className="px-4 py-2 bg-[#07161E]/90 border-t border-[#00D4FF]/20 flex items-center justify-between text-xs font-mono">
        {/* Lane Guidance Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase">LANES:</span>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded bg-[#10232C] border border-[#1E3440] text-gray-400">↖ Left</span>
            <span className="px-1.5 py-0.5 rounded bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF] font-bold">⬆ Straight</span>
            <span className="px-1.5 py-0.5 rounded bg-[#10232C] border border-[#1E3440] text-gray-400">↗ Right</span>
          </div>
        </div>

        {/* Camera Follow Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#10232C] p-1 rounded-lg border border-[#1E3440]">
          <button
            onClick={() => setCameraMode('follow')}
            className={`px-2 py-0.5 rounded text-[10px] transition-all ${
              cameraMode === 'follow' ? 'bg-[#00D4FF] text-[#07161E] font-bold' : 'text-gray-400'
            }`}
          >
            Follow
          </button>
          <button
            onClick={() => setCameraMode('north_up')}
            className={`px-2 py-0.5 rounded text-[10px] transition-all ${
              cameraMode === 'north_up' ? 'bg-[#00D4FF] text-[#07161E] font-bold' : 'text-gray-400'
            }`}
          >
            North-Up
          </button>
          <button
            onClick={() => setCameraMode('free')}
            className={`px-2 py-0.5 rounded text-[10px] transition-all ${
              cameraMode === 'free' ? 'bg-[#00D4FF] text-[#07161E] font-bold' : 'text-gray-400'
            }`}
          >
            Free
          </button>
        </div>
      </div>
    </div>
  );
};
