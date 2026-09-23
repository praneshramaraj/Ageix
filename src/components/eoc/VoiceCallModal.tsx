import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, Shield } from 'lucide-react';
import { useCommunicationStore } from '../../stores/CommunicationStore';

export const VoiceCallModal: React.FC = () => {
  const { isVoiceCallActive, activeVoiceCallRecipient, endVoiceCall } = useCommunicationStore();
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isVoiceCallActive) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isVoiceCallActive]);

  if (!isVoiceCallActive) return null;

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-[#10232C] border border-[#00D4FF]/50 rounded-2xl shadow-2xl text-white p-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#00D4FF]/20 border-2 border-[#00D4FF] flex items-center justify-center relative animate-pulse">
            <Shield className="w-10 h-10 text-[#00D4FF]" />
            <div className="absolute inset-0 rounded-full border border-[#00D4FF] animate-ping opacity-30" />
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono text-[#00D4FF] uppercase tracking-widest block font-bold">
            ENCRYPTED SATELLITE VOICE UPLINK
          </span>
          <h3 className="text-lg font-bold font-mono text-white mt-1">
            {activeVoiceCallRecipient || 'Alpha Rescue Leader (Capt. Vance)'}
          </h3>
          <span className="text-xs font-mono text-[#3DDC84] font-bold mt-1 block">
            Connected • {formatSec(callDuration)}
          </span>
        </div>

        {/* Audio Wave Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-8">
          {[40, 75, 100, 60, 90, 45, 80, 30].map((h, i) => (
            <div
              key={i}
              className="w-1.5 bg-[#00D4FF] rounded-full transition-all duration-150 animate-pulse"
              style={{ height: `${isMuted ? 10 : h}%` }}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-all ${
              isMuted
                ? 'bg-[#FF4B55]/20 border-[#FF4B55] text-[#FF4B55]'
                : 'bg-[#1E3440] border-[#00D4FF]/40 text-[#00D4FF]'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={endVoiceCall}
            className="p-4 bg-[#FF4B55] hover:bg-[#e03a44] text-white rounded-full shadow-lg transition-all"
            title="End Voice Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
