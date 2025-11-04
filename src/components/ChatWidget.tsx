import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { apiService } from '../services/apiService';

interface ChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

export function ChatWidget({ open, onClose }: ChatWidgetProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user', content: input } as const];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const resp = await apiService.aiChat(next);
      setMessages([...next, { role: 'assistant', content: resp.reply }]);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <GlassCard className="w-full max-w-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold text-xl">AI Assistant</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>
        <div className="h-80 overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
          {messages.length === 0 && (
            <p className="text-white/40 text-sm">Ask about swaps, fees, rewards, or how SideShift works.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`${m.role === 'user' ? 'bg-blue-500/20' : 'bg-white/10'} inline-block px-3 py-2 rounded-lg text-white`}>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white placeholder-white/40 focus:outline-none"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          />
          <button onClick={send} disabled={loading} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 rounded-xl">
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}


