import React from 'react';
import { Bell, Check, Trash2, AlertTriangle, Info, Flame } from 'lucide-react';
import { useCommandStore } from '../../stores/CommandStore';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useCommandStore();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-96 bg-[#10232C]/95 border border-[#1E3440] rounded-2xl shadow-2xl backdrop-blur-md text-white overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-[#07161E] border-b border-[#1E3440] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#00D4FF]" />
          <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
            EOC EMERGENCY NOTIFICATIONS ({notifications.length})
          </h3>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-[10px] font-mono text-gray-400 hover:text-[#FF4B55] flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* List */}
      <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-xs font-mono text-gray-500 italic text-center py-6">
            No active emergency alerts
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                n.isRead
                  ? 'bg-[#07161E]/40 border-[#1E3440] opacity-75'
                  : 'bg-[#07161E] border-[#00D4FF]/40 shadow-md ring-1 ring-[#00D4FF]/20'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {n.type === 'danger' && <Flame className="w-4 h-4 text-[#FF4B55] shrink-0 mt-0.5" />}
                {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#FFB000] shrink-0 mt-0.5" />}
                {n.type === 'info' && <Info className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />}
                {n.type === 'success' && <Check className="w-4 h-4 text-[#3DDC84] shrink-0 mt-0.5" />}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono text-white truncate">{n.title}</h4>
                    <span className="text-[9px] font-mono text-gray-400">{n.timestamp}</span>
                  </div>
                  <p className="text-[11px] font-mono text-gray-300 mt-0.5 leading-snug">{n.message}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
