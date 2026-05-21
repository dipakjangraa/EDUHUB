'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

const rarityColors: Record<string, string> = {
  common: 'border-gray-600 bg-gray-800/50',
  rare: 'border-blue-500/50 bg-blue-500/10',
  epic: 'border-purple-500/50 bg-purple-500/10',
  legendary: 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
};

const rarityText: Record<string, string> = {
  common: 'text-gray-400',
  rare: 'text-blue-400',
  epic: 'text-purple-400',
  legendary: 'text-yellow-400',
};

export default function Achievements() {
  const [all, setAll] = useState<any[]>([]);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: achievements } = await supabase.from('achievements').select('*').order('rarity');
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userAch } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id);
      setUnlocked(new Set(userAch?.map((u) => u.achievement_id) || []));
    }
    setAll(achievements || []);
    setLoading(false);
  };

  const filtered = all.filter((a) => {
    if (filter === 'unlocked') return unlocked.has(a.id);
    if (filter === 'locked') return !unlocked.has(a.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold">Achievements</h1>
          <p className="text-gray-400 mt-2">{unlocked.size} / {all.length} unlocked</p>
          <div className="w-64 h-3 bg-gray-800 rounded-full mx-auto mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all"
              style={{ width: `${all.length ? (unlocked.size / all.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 bg-gray-900/50 p-1 rounded-xl max-w-xs mx-auto">
          {(['all', 'unlocked', 'locked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-sm capitalize transition-all ${filter === f ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((a) => {
              const isUnlocked = unlocked.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`p-5 rounded-2xl border-2 text-center transition-all ${
                    isUnlocked ? rarityColors[a.rarity] : 'border-gray-800 bg-gray-900/30 opacity-50'
                  }`}
                >
                  <div className={`text-5xl mb-3 ${!isUnlocked ? 'grayscale' : ''}`}>{a.icon}</div>
                  <h3 className="font-bold mb-1 text-sm">{a.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">{a.description}</p>
                  <div className="flex justify-center gap-3 text-xs">
                    <span className="text-indigo-400">+{a.xp_reward} XP</span>
                    <span className="text-yellow-400">+{a.coin_reward} 🪙</span>
                  </div>
                  <div className={`mt-2 text-xs uppercase font-bold ${rarityText[a.rarity]}`}>
                    {a.rarity}
                  </div>
                  {isUnlocked && (
                    <div className="mt-2 text-xs text-emerald-400 font-bold">✓ Unlocked</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
