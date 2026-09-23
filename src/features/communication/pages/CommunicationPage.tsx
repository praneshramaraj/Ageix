import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';

import { useCommunicationStore } from '../../../stores/CommunicationStore';
import { BroadcastMessageModal } from '../../../components/eoc/BroadcastMessageModal';

import {
  Radio,
  Send,
  PhoneCall,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Users,
  Shield,
  MessageSquare,
} from 'lucide-react';

export const CommunicationPage: React.FC = () => {
  const {
    chatMessages,
    broadcasts,
    activeChannel,
    setActiveChannel,
    sendChatMessage,
    acknowledgeBroadcast,
    startVoiceCall,
  } = useCommunicationStore();

  const [messageText, setMessageText] = useState('');
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  const filteredMessages = chatMessages.filter((m) => m.channel === activeChannel || m.channel === 'emergency');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText || !messageText.trim()) return;
    sendChatMessage(messageText.trim());
    setMessageText('');
  };

  return (
    <PageContainer
      title="EOC Multi-Channel Communication Center"
      subtitle="Encrypted Radio Mesh, Field Tactical Chat, Emergency Broadcasts & Voice Dispatch"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Comms Center' }]}
      action={
        <button
          onClick={() => setIsBroadcastModalOpen(true)}
          className="px-4 py-2 bg-[#FF4B55] hover:bg-[#e03a44] text-white font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider transition-all flex items-center gap-2"
        >
          <Megaphone className="w-4 h-4" />
          Dispatch Broadcast Alert
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Multi-Channel Tactical Chat */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Tactical Channel Comms Mesh">
            {/* Channel Tabs */}
            <div className="flex items-center gap-2 p-1 bg-[#07161E] border border-[#1E3440] rounded-xl mb-4">
              {[
                { id: 'general', label: 'General Net' },
                { id: 'mission', label: 'Mission Alpha Net' },
                { id: 'command', label: 'Command Direct' },
                { id: 'emergency', label: 'Emergency Override' },
              ].map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id as any)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeChannel === ch.id
                      ? 'bg-[#00D4FF] text-[#07161E] shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>

            {/* Chat Messages Box */}
            <div className="bg-[#07161E] border border-[#1E3440] rounded-xl p-4 h-96 overflow-y-auto space-y-3">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="p-3 bg-[#10232C] border border-[#1E3440] rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#00D4FF]">{msg.senderName}</span>
                      <span className="text-[10px] font-mono text-gray-400">({msg.senderRole})</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs text-white leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Send Message Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 mt-4">
              <input
                type="text"
                placeholder={`Type message to ${activeChannel.toUpperCase()} channel...`}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-xl px-4 py-2.5 text-xs font-mono text-white outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Transmit
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Emergency Broadcast Log & Voice Hotline */}
        <div className="space-y-6">
          {/* Emergency Broadcasts Log */}
          <Card title="EOC Emergency Broadcast Log" glow="danger">
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {broadcasts.map((bc) => (
                <div key={bc.id} className="p-3 bg-[#07161E] border border-[#FF4B55]/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={bc.severity === 'critical' ? 'danger' : 'warning'}>
                      {bc.severity.toUpperCase()}
                    </Badge>
                    <span className="text-[10px] font-mono text-gray-400">{bc.timestamp}</span>
                  </div>

                  <h4 className="text-xs font-bold font-mono text-white">{bc.title}</h4>
                  <p className="text-[11px] text-[#AAB6C3] leading-relaxed">{bc.message}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E3440] text-[10px] font-mono">
                    <span className="text-gray-400">Target: {bc.targetAudience}</span>
                    {!bc.isAcknowledged ? (
                      <button
                        onClick={() => acknowledgeBroadcast(bc.id)}
                        className="px-2 py-0.5 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] font-bold rounded"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[#3DDC84] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ACKNOWLEDGED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Voice Call Dispatcher */}
          <Card title="Quick Voice Hotline Dispatcher">
            <div className="space-y-2 text-xs font-mono">
              {[
                { name: 'Capt. Marcus Vance', role: 'Alpha Water Rescue Leader' },
                { name: 'Lt. Rahul Sharma', role: 'Bravo Heavy Debris Lead' },
                { name: 'Dr. Anita Roy', role: 'Charlie Medical Director' },
                { name: 'Eng. Alex Mercer', role: 'UAV Pilot Lead' },
              ].map((person, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-[#07161E] rounded-lg border border-[#1E3440]">
                  <div>
                    <span className="text-white font-bold block">{person.name}</span>
                    <span className="text-[9px] text-gray-400">{person.role}</span>
                  </div>
                  <button
                    onClick={() => startVoiceCall(person.name)}
                    className="px-3 py-1 bg-[#00D4FF]/10 hover:bg-[#00D4FF]/20 border border-[#00D4FF]/40 text-[#00D4FF] font-bold rounded flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <BroadcastMessageModal isOpen={isBroadcastModalOpen} onClose={() => setIsBroadcastModalOpen(false)} />
    </PageContainer>
  );
};

export default CommunicationPage;
