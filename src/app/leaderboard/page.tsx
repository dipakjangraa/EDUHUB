'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { getRankBadge } from '@/lib/utils';

export default function Leaderboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [{ data: top }, { data: { user } }] = await Promise.all([
      supabase.from('profiles').select('id, name, avatar_url, xp, level, streak, total_tests').order('xp', { ascending: false }).limit(50),
      supabase.auth.getUser(),
    ]);
    setUsers(top || []);
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setMe(profile);
    }
    setLoading(false);
  };

  const myRank = users.findIndex((u) => u.id === me?.id) + 1;

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-400 mt-2">Top performers worldwide</p>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[users[1], users[0], users[2]].map((u, i) => {
              const rank = [2, 1, 3][i];
              const heights = ['h-32', 'h-40', 'h-28'];
              return (
                <div key={u.id} className="flex flex-col items-center">
                  <div className="text-4xl mb-2">{getRankBadge(rank)}</div>
                  <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl font-bold mb-2 border-2 border-indigo-500/30">
                    {u.name?.[0]}
                  </div>
                  <div className={`w-full ${heights[i]} bg-gradient-to-t from-indigo-600/20 to-transparent border border-indigo-500/30 rounded-t-2xl flex flex-col items-center justify-end p-3`}>
                    <div className="font-bold text-xs truncate w-full text-center">{u.name}</div>
                    <div className="text-yellow-400 font-black text-sm">{u.xp} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* My Rank */}
        {me && myRank > 0 && (
          <div className="bg-gradient-to-r from-indigo-900/40 to-cyan-900/40 border border-indigo-500/30 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-indigo-400">#{myRank}</div>
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold text-xl">
                {me.name?.[0]}
              </div>
              <div className="flex-1">
                <div className="font-bold">You ({me.name})</div>
                <div className="text-sm text-gray-400">Level {me.level}</div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-black">{me.xp} XP</div>
                <div className="text-orange-400 text-sm">🔥 {me.streak}</div>
              </div>
            </div>
          </div>
        )}

        {/* Full List */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            {users.map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 p-4 border-b border-gray-800 last:border-0 transition-colors ${
                  u.id === me?.id ? 'bg-indigo-500/10' : 'hover:bg-gray-800/30'
                }`}
              >
                <div className="w-10 text-center font-bold text-gray-400">
                  {i < 3 ? getRankBadge(i + 1) : `#${i + 1}`}
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center font-bold">
                  {u.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.name}</div>
                  <div className="text-xs text-gray-500">Level {u.level} • {u.total_tests} tests</div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 font-bold">{u.xp}</div>
                  <div className="text-xs text-gray-500">XP</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
