import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Bot, Send, Sparkles, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { AiCommanderEngine } from '../services/aiCommanderEngine';
import { LLMAnalysisResult } from '../services/llmProvider';

interface ChatMessage {
  id: string;
  sender: 'user' | 'commander';
  text: string;
  timestamp: string;
  analysis?: LLMAnalysisResult;
}

export const AiCommanderChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'commander',
      text: 'AEGISX AI Commander initialized. Ready for operational queries, mission prioritization, and hazard route analysis.',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQueries = [
    'Show all critical flood incidents.',
    'Which rescue team is closest?',
    'Recommend the safest evacuation route.',
    'Summarize all active missions.',
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const result = await AiCommanderEngine.query(q);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'commander',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: result,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'commander',
          text: 'AI Engine Error processing query. Utilizing fallback neural heuristics.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-[#00D4FF]" />
          <span className="font-bold text-white">AI Commander Tactical Assistant</span>
        </div>
      }
      glow="accent"
    >
      <div className="flex flex-col h-[520px]">
        {/* Sample Prompt Shortcuts */}
        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-[#1E3440]">
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#10232C] hover:bg-[#1E3440] text-[#00D4FF] border border-[#1E3440] transition"
            >
              "{sq}"
            </button>
          ))}
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 font-mono text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-3 rounded-xl max-w-[85%] ${
                m.sender === 'user'
                  ? 'ml-auto bg-[#00D4FF]/10 text-white border border-[#00D4FF]/30'
                  : 'mr-auto bg-[#10232C] text-[#AAB6C3] border border-[#1E3440]'
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[10px] text-[#AAB6C3]">
                <span className="font-bold text-[#00D4FF]">
                  {m.sender === 'user' ? 'DISPATCH OPERATOR' : 'AI COMMANDER'}
                </span>
                <span>{m.timestamp}</span>
              </div>
              <p className="text-white leading-relaxed">{m.text}</p>

              {/* Action Suggestions */}
              {m.analysis?.suggestedActions && m.analysis.suggestedActions.length > 0 && (
                <div className="mt-2 pt-2 border-t border-[#1E3440] space-y-1">
                  {m.analysis.suggestedActions.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-[11px] text-[#3DDC84] font-bold cursor-pointer hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Action: {act.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#00D4FF] p-2 font-mono">
              <div className="w-3 h-3 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
              AI Commander analyzing disaster telemetry...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-[#1E3440]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Commander (e.g. 'Which team is closest to Kaveri flood?')"
            className="flex-1 bg-[#07161E] border border-[#1E3440] rounded-xl px-3 py-2 text-xs text-white placeholder-[#AAB6C3] focus:outline-none focus:border-[#00D4FF]"
          />
          <Button variant="accent" size="sm" onClick={() => handleSend()} disabled={loading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
