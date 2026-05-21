'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AITeacher({ weakConcepts = [] }: { weakConcepts?: string[] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: weakConcepts.length
        ? `Hey! 👋 I see you're working on **${weakConcepts[0]}**. Want me to explain it?`
        : '👋 Hi! I\'m your AI Teacher. Ask me anything!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          weakConcepts,
          history: messages.slice(-6),
        }),
      });
      const { answer } = await res.json();
      setMessages((m) => [...m, { role: 'assistant', content: answer }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: '😅 Try again!' }]);
    }
    setLoading(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-2xl shadow-indigo-500/50 flex items-center justify-center z-40"
      >
        {open ? <X size={28} /> : <span className="text-3xl">🤖</span>}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed bottom-28 right-6 w-[90vw] md:w-[400px] h-[550px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center gap-3">
              <div className="text-3xl">🤖</div>
              <div>
                <div className="font-bold">AI Teacher</div>
                <div className="text-xs opacity-80">Online • Ready</div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 rounded-br-sm'
                      : 'bg-gray-800 rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-1 px-3">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200" />
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-3 border-t border-gray-800 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask anything..."
                className="flex-1 bg-gray-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={send}
                disabled={loading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 flex items-center justify-center disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
