import React, { useState } from 'react';
import { Send, MessageSquare, User, ShieldCheck, Radio } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'Dispatcher' | 'Team Leader' | 'Control Room';
  text: string;
  time: string;
}

export const MissionChatPanel: React.FC<{ missionId: string }> = ({ missionId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Dispatcher', text: 'Distress signal confirmed in Sector 4. Flooding depth +2.4m.', time: '10:46:00' },
    { id: '2', sender: 'Team Leader', text: 'NDRF Alpha en route. Boat R-04 launched from Kaveri Depot.', time: '10:48:15' },
    { id: '3', sender: 'Control Room', text: 'Airforce Helicopter Air-1 on standby for roof extraction if needed.', time: '10:50:30' },
  ]);
  const [inputText, setInputText] = useState('');
  const [senderRole, setSenderRole] = useState<'Dispatcher' | 'Team Leader' | 'Control Room'>('Dispatcher');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: senderRole,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="p-4 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-3 flex flex-col h-[380px]">
      <div className="flex items-center justify-between border-b border-[#1E3440] pb-2">
        <h4 className="font-mono font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#00D4FF]" /> Mission Operational Tactical Chat ({missionId})
        </h4>
        <select
          value={senderRole}
          onChange={(e) => setSenderRole(e.target.value as any)}
          className="bg-[#07161E] border border-[#1E3440] text-[10px] font-mono text-[#00D4FF] font-bold rounded px-2 py-1 outline-none uppercase"
        >
          <option value="Dispatcher">Dispatcher</option>
          <option value="Team Leader">Team Leader</option>
          <option value="Control Room">Control Room</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-sans text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2.5 rounded-lg border text-xs ${
              m.sender === 'Dispatcher'
                ? 'bg-[#07161E] border-[#00D4FF]/30 text-white'
                : m.sender === 'Team Leader'
                ? 'bg-[#0A261E] border-[#3DDC84]/30 text-white'
                : 'bg-[#261E0A] border-[#FFB000]/30 text-white'
            }`}
          >
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span
                className={`font-bold uppercase ${
                  m.sender === 'Dispatcher'
                    ? 'text-[#00D4FF]'
                    : m.sender === 'Team Leader'
                    ? 'text-[#3DDC84]'
                    : 'text-[#FFB000]'
                }`}
              >
                {m.sender}
              </span>
              <span className="text-[#AAB6C3]">{m.time}</span>
            </div>
            <p className="leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#1E3440]">
        <input
          type="text"
          placeholder={`Type operational note as ${senderRole}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] rounded-lg font-bold transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
