import React, { useState } from 'react';
import { X, Radio, Megaphone } from 'lucide-react';
import { useCommunicationStore } from '../../stores/CommunicationStore';

interface BroadcastMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastMessageModal: React.FC<BroadcastMessageModalProps> = ({ isOpen, onClose }) => {
  const { sendBroadcast } = useCommunicationStore();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'warning' | 'critical' | 'evacuation'>('warning');
  const [targetAudience, setTargetAudience] = useState('All Tactical Field Units');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    sendBroadcast({
      sender: 'EOC Supreme Command Unit',
      title,
      message,
      severity,
      targetAudience,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#10232C] border border-[#FF4B55]/40 rounded-2xl shadow-2xl text-white overflow-hidden">
        <div className="px-5 py-4 bg-[#07161E] border-b border-[#1E3440] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#FF4B55] animate-pulse" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              DISPATCH EMERGENCY BROADCAST
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[#1E3440] rounded text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Broadcast Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. MANDATORY EVACUATION ORDER SECTOR 4"
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#FF4B55] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#FF4B55] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
              >
                <option value="warning">WARNING</option>
                <option value="critical">CRITICAL ALERT</option>
                <option value="evacuation">EVACUATION ORDER</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-gray-400 block mb-1">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#FF4B55] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-gray-400 block mb-1">Broadcast Message Body</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter instruction details to transmit over radio mesh and mobile app notification push..."
              className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#FF4B55] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1E3440] text-xs font-mono rounded-lg hover:bg-[#2A4758]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#FF4B55] hover:bg-[#e03a44] text-white font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4" />
              Transmit Broadcast
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
