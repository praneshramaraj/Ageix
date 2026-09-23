import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Radio,
  Clock,
  Command,
} from 'lucide-react';
import { useCommandStore } from '../../stores/CommandStore';
import { NotificationCenter } from './NotificationCenter';

export const EocHeaderBar: React.FC = () => {
  const {
    defconLevel,
    setDefconLevel,
    notifications,
    setIsCommandPaletteOpen,
  } = useCommandStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [timeUtc, setTimeUtc] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeUtc(now.toUTCString().replace('GMT', 'UTC').split(' ').slice(4, 5)[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative z-30 h-12 bg-[#07161E]/95 border-b border-[#1E3440] px-4 flex items-center justify-between text-white backdrop-blur-md">
      {/* Left: EOC Station Title & DEFCON Selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3DDC84] animate-pulse" />
          <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
            AEGISX EOC COMMAND NODE 01
          </span>
        </div>

        <div className="h-4 w-px bg-[#1E3440]" />

        {/* DEFCON Picker */}
        <div className="flex items-center gap-1 bg-[#10232C] border border-[#1E3440] rounded-lg px-2 py-0.5">
          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">ALERT:</span>
          <select
            value={defconLevel}
            onChange={(e) => setDefconLevel(e.target.value as any)}
            className="bg-transparent text-xs font-mono font-bold text-[#FF4B55] outline-none cursor-pointer"
          >
            <option value="DEFCON 1" className="bg-[#10232C] text-[#FF4B55]">DEFCON 1 - MAX RED ALERT</option>
            <option value="DEFCON 2" className="bg-[#10232C] text-[#FFB000]">DEFCON 2 - SEVERE DISASTER</option>
            <option value="DEFCON 3" className="bg-[#10232C] text-[#00D4FF]">DEFCON 3 - ELEVATED READINESS</option>
            <option value="DEFCON 4" className="bg-[#10232C] text-[#3DDC84]">DEFCON 4 - NORMAL MONITORED</option>
          </select>
        </div>
      </div>

      {/* Right: Search + UTC Clock + Notifications */}
      <div className="flex items-center gap-3">
        {/* Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1 bg-[#10232C] border border-[#1E3440] hover:border-[#00D4FF]/50 rounded-lg text-xs font-mono text-gray-400 hover:text-white transition-all"
        >
          <Search className="w-3.5 h-3.5 text-[#00D4FF]" />
          <span>Search / Commands</span>
          <span className="px-1.5 py-0.2 bg-[#1E3440] text-[10px] rounded text-gray-300 font-mono flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </button>

        {/* Live UTC Clock */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10232C] border border-[#1E3440] rounded-lg text-xs font-mono text-[#00D4FF] font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>{timeUtc || '12:00:00 UTC'}</span>
        </div>

        {/* Notifications Toggle */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 bg-[#10232C] border border-[#1E3440] hover:border-[#00D4FF]/50 rounded-lg text-gray-300 hover:text-white transition-all"
            title="Emergency Notifications"
          >
            <Bell className="w-4 h-4 text-[#00D4FF]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF4B55] text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>
      </div>
    </div>
  );
};
