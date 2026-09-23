import React from 'react';
import { useMapStore } from '../stores/MapStore';
import { Eye, X, Check } from 'lucide-react';

interface AccessibilitySettingsProps {
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ onClose }) => {
  const { accessibility, toggleHighContrast, toggleLargeLabels } = useMapStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07161E]/80 backdrop-blur-sm pointer-events-auto select-none">
      <div className="w-full max-w-sm p-5 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#1E3440] pb-2.5">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#00D4FF]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Accessibility Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <button
            onClick={toggleHighContrast}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              accessibility.highContrast
                ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white'
                : 'bg-[#07161E] border-[#1E3440] text-[#AAB6C3] hover:text-white'
            }`}
          >
            <div>
              <div className="font-bold">High Contrast Mode</div>
              <div className="text-[10px] text-[#AAB6C3]">Enhances layer boundary & line contrast</div>
            </div>
            {accessibility.highContrast && <Check className="w-4 h-4 text-[#00D4FF]" />}
          </button>

          <button
            onClick={toggleLargeLabels}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              accessibility.largeLabels
                ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white'
                : 'bg-[#07161E] border-[#1E3440] text-[#AAB6C3] hover:text-white'
            }`}
          >
            <div>
              <div className="font-bold">Large Text Labels</div>
              <div className="text-[10px] text-[#AAB6C3]">Increases font size of city & POI labels</div>
            </div>
            {accessibility.largeLabels && <Check className="w-4 h-4 text-[#00D4FF]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
