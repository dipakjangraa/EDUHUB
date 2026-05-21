'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Swords } from 'lucide-react';
import toast from 'react-hot-toast';

const TOPICS = [
  // SSC / UPSC / NDA Math
  'Percentage', 'Profit & Loss', 'Time Speed Distance', 'Simple Interest',
  'Compound Interest', 'Ratio & Proportion', 'Averages', 'Time and Work',
  // JEE / NDA Math
  'Trigonometry', 'Algebra', 'Quadratic Equations', 'Probability',
  // Reasoning
  'Number Series', 'Logical Reasoning', 'Coding-Decoding',
  // NEET / JEE Science
  'Mechanics', 'Current Electricity', 'Organic Chemistry',
];

export default function BattleLobby() {
  const router = useRouter();
  const [topic, setTopic] = useState('Percentage');
  const [difficulty, setDifficulty] = useState('medium');
  const [searching, setSearching] = useState(false);

  const findMatch = async () => {
    setSearching(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    try {
      const res = await fetch('/api/battle/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, topic, difficulty }),
      });
      const data = await res.json();
      if (data.battleId) {
        toast.success(data.isJoin ? '⚔️ Match found!' : '⏳ Waiting for opponent...');
        router.push(`/battle/${data.battleId}`);
      } else {
        toast.error('Failed to create battle');
      }
    } catch {
      toast.error('Network error');
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <div className="text-center mb-10">
          <div className="text-7xl mb-4">⚔️</div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            BATTLE MODE
          </h1>
          <p className="text-gray-400 mt-2">5 questions. 1v1. Winner takes XP.</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <label className="text-sm text-gray-400 block mb-2">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mb-4 text-white focus:outline-none focus:border-indigo-500"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label className="text-sm text-gray-400 block mb-2">Difficulty</label>
          <div className="flex gap-2">
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-3 rounded-xl border capitalize transition-all ${
                  difficulty === d ? 'border-red-500 bg-red-500/20 text-red-300' : 'border-gray-700 text-gray-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={findMatch}
          disabled={searching}
          className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 font-black text-xl rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
        >
          {searching ? (
            <>
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              Searching...
            </>
          ) : (
            <><Swords /> FIND OPPONENT</>
          )}
        </button>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { value: '+100', label: 'XP for Win', color: 'text-yellow-400' },
            { value: '+25', label: 'Coins for Win', color: 'text-yellow-400' },
            { value: '5', label: 'Questions', color: 'text-cyan-400' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
