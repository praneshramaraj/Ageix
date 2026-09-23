import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Navigation, Shield, Crosshair, Users, Truck, AlertTriangle, Radio, BarChart3, Settings } from 'lucide-react';
import { useCommandStore } from '../../stores/CommandStore';

export const CommandPaletteModal: React.FC = () => {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useCommandStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands = [
    { label: 'Go to EOC Command Dashboard', path: '/dashboard', icon: Shield },
    { label: 'Open Emergency GIS Map & Routing', path: '/map', icon: Navigation },
    { label: 'Manage Active Rescue Missions', path: '/missions', icon: Crosshair },
    { label: 'View Rescue Teams & Personnel', path: '/personnel', icon: Users },
    { label: 'Track Vehicle & UAV Drone Fleet', path: '/vehicles', icon: Truck },
    { label: 'Open Live Incident Board', path: '/incidents', icon: AlertTriangle },
    { label: 'Open Communication & Broadcast Hub', path: '/communication', icon: Radio },
    { label: 'View Reports & Response Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Open EOC Admin & Audit Logs', path: '/admin', icon: Settings },
  ];

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#10232C] border border-[#00D4FF]/40 rounded-2xl shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="px-4 py-3 bg-[#07161E] border-b border-[#1E3440] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#00D4FF]" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or navigate (e.g. 'map', 'missions')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-mono text-sm text-white placeholder-gray-500 outline-none"
          />
          <kbd className="px-2 py-0.5 bg-[#1E3440] text-[10px] font-mono text-gray-400 rounded">ESC</kbd>
        </div>

        {/* Command List */}
        <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs font-mono text-gray-500 text-center py-6">No matching EOC commands</p>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(cmd.path);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full p-3 rounded-xl hover:bg-[#00D4FF]/15 hover:border-[#00D4FF]/40 border border-transparent transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#00D4FF] group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-mono font-bold text-gray-200 group-hover:text-white">
                      {cmd.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 group-hover:text-[#00D4FF]">
                    {cmd.path}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
