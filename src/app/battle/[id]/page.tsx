'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function BattleArena() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [battle, setBattle] = useState<any>(null);
  const [me, setMe] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>(null);
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState(20);
  const [selected, setSelected] = useState<string | null>(null);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [isP1, setIsP1] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [ended, setEnded] = useState<any>(null);
  const qStartRef = useRef(Date.now());
  const handleNextRef = useRef<() => void>(() => {});

  useEffect(() => {
    loadBattle();

    // Lazy-load Pusher only in browser
    let channel: any = null;
    const setupPusher = async () => {
      try {
        const { getPusherClient } = await import('@/lib/pusher');
        const client = getPusherClient();
        if (!client) return;
        channel = client.subscribe(`battle-${id}`);
        channel.bind('opponent-joined', () => { setWaiting(false); loadBattle(); });
        channel.bind('score-update', (data: any) => setScores({ p1: data.player1Score, p2: data.player2Score }));
        channel.bind('battle-ended', (data: any) => setEnded(data));
      } catch { /* Pusher not configured */ }
    };
    setupPusher();

    return () => {
      if (channel) {
        try { channel.unsubscribe(); } catch { /* ignore */ }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (waiting || ended) return;
    setTime(20);
    qStartRef.current = Date.now();
    const t = setInterval(() => {
      setTime((p) => {
        if (p <= 1) { clearInterval(t); handleNextRef.current(); return 20; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [idx, waiting, ended]);

  const loadBattle = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data: b } = await supabase.from('battles').select('*').eq('id', id).single();
    if (!b) return;
    setBattle(b);
    setIsP1(b.player1_id === user?.id);
    if (b.status === 'active') setWaiting(false);
    const [{ data: p1 }, { data: p2 }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', b.player1_id).single(),
      b.player2_id
        ? supabase.from('profiles').select('*').eq('id', b.player2_id).single()
        : Promise.resolve({ data: null }),
    ]);
    const userId = user?.id;
    setMe(b.player1_id === userId ? p1 : p2);
    setOpponent(b.player1_id === userId ? p2 : p1);
  };

  const submitAnswer = async (ans: string | null) => {
    const { data: { user } } = await supabase.auth.getUser();
    const elapsed = Math.round((Date.now() - qStartRef.current) / 1000);
    await fetch('/api/battle/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        battleId: id,
        userId: user?.id,
        questionIdx: idx,
        answer: ans || '',
        timeTaken: elapsed,
      }),
    });
    if (idx < (battle?.questions?.length || 5) - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setTime(20);
      qStartRef.current = Date.now();
    }
  };

  handleNextRef.current = () => submitAnswer(null);

  // ── Waiting screen ──────────────────────────────────────────────────────────
  if (waiting) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-pulse">⚔️</div>
          <h2 className="text-3xl font-bold mb-2">Waiting for opponent...</h2>
          <p className="text-gray-400 mb-4">Share this link to invite a friend</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
            className="px-6 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm hover:bg-gray-700 transition-all"
          >
            📋 Copy Battle Link
          </button>
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mt-8" />
        </div>
      </div>
    );
  }

  // ── End screen ──────────────────────────────────────────────────────────────
  if (ended) {
    const won = ended.winnerId === me?.id;
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="text-9xl mb-4">{won ? '🏆' : '😤'}</div>
          <h1 className={`text-6xl font-black mb-4 ${won ? 'text-yellow-400' : 'text-gray-400'}`}>
            {won ? 'VICTORY!' : 'DEFEAT'}
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-sm mb-1">You</div>
              <div className="text-3xl font-bold">{isP1 ? ended.p1Score : ended.p2Score}</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <div className="text-gray-400 text-sm mb-1">Opponent</div>
              <div className="text-3xl font-bold">{isP1 ? ended.p2Score : ended.p1Score}</div>
            </div>
          </div>
          {won && <p className="text-xl text-yellow-400 mb-6">+100 XP, +25 Coins! 🎉</p>}
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/battle')}
              className="flex-1 py-4 bg-gradient-to-r from-red-600 to-orange-500 font-bold rounded-xl hover:opacity-90 transition-all"
            >
              ⚔️ Battle Again
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 py-4 bg-gray-800 border border-gray-700 font-bold rounded-xl hover:bg-gray-700 transition-all"
            >
              🏠 Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Battle screen ───────────────────────────────────────────────────────────
  const q = battle?.questions?.[idx];
  if (!q) return null;
  const myScore = isP1 ? scores.p1 : scores.p2;
  const oppScore = isP1 ? scores.p2 : scores.p1;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* VS Header */}
      <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-b border-red-500/30 p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xl font-bold">
              {me?.name?.[0] || '?'}
            </div>
            <div>
              <div className="font-bold text-sm">{me?.name || 'You'}</div>
              <div className="text-yellow-400 text-2xl font-black">{myScore}</div>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
            time <= 5 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-orange-500/20 text-orange-300'
          }`}>
            ⏱ {time}s
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="font-bold text-sm">{opponent?.name || 'Opponent'}</div>
              <div className="text-yellow-400 text-2xl font-black">{oppScore}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xl font-bold">
              {opponent?.name?.[0] || '?'}
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-sm text-gray-400 mb-4">
          Question {idx + 1} / {battle?.questions?.length}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold leading-relaxed">{q.question}</h2>
            </div>

            <div className="space-y-3">
              {q.options.map((opt: string, i: number) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selected) return;
                    setSelected(opt);
                    submitAnswer(opt);
                  }}
                  disabled={!!selected}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selected === opt
                      ? 'border-red-500 bg-red-500/20'
                      : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                  } disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                      selected === opt ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
