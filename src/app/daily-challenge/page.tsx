'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyChallenge() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const today = new Date().toISOString().split('T')[0];

    // Get or create today's challenge
    let { data: ch } = await supabase.from('daily_challenges').select('*').eq('date', today).single();

    if (!ch) {
      // Generate challenge via API
      // Pick today's topic from the full syllabus (rotates daily)
      const dailyTopics = [
        'Percentage', 'Profit & Loss', 'Time Speed Distance', 'Simple Interest',
        'Trigonometry', 'Algebra', 'Number Series', 'Logical Reasoning',
        'Mechanics', 'Current Electricity', 'Organic Chemistry', 'Cell Biology',
        'Indian History', 'General Science', 'English Grammar', 'Vocabulary',
        'Ratio & Proportion', 'Averages', 'Coding-Decoding', 'Blood Relations',
      ];
      const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const todayTopic = dailyTopics[dayOfYear % dailyTopics.length];

      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: todayTopic, count: 5, difficulty: 'medium' }),
      });
      const data = await res.json();
      if (data.questions) {
        const { data: newCh } = await supabase.from('daily_challenges').insert({
          date: today,
          topic: todayTopic,
          questions: data.questions,
          xp_reward: 100,
          coin_reward: 20,
        }).select().single();
        ch = newCh;
      }
    }

    if (ch) {
      setChallenge(ch);
      setQuestions(ch.questions || []);

      // Check if already completed
      const { data: attempt } = await supabase
        .from('user_challenges')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_id', ch.id)
        .single();

      if (attempt) setCompleted(true);
    }

    setLoading(false);
  };

  const handleNext = async () => {
    const q = questions[idx];
    const correct = selected === q.correctAnswer;
    const newAnswers = [...answers, { answer: selected || '', correct }];
    setAnswers(newAnswers);

    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      // Finish
      const score = newAnswers.filter(a => a.correct).length;
      const { data: { user } } = await supabase.auth.getUser();
      if (user && challenge) {
        await supabase.from('user_challenges').insert({
          user_id: user.id,
          challenge_id: challenge.id,
          score,
        });
        await supabase.rpc('increment_user_xp', {
          p_user_id: user.id,
          p_xp: challenge.xp_reward,
          p_coins: challenge.coin_reward,
        });
        toast.success(`🎉 +${challenge.xp_reward} XP earned!`);
      }
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (completed || finished) {
    const score = answers.filter(a => a.correct).length;
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-7xl mb-4">🔥</div>
          <h1 className="text-4xl font-bold mb-2">
            {completed && !finished ? 'Already Completed!' : 'Challenge Done!'}
          </h1>
          {finished && (
            <>
              <p className="text-gray-400 mb-4">{score}/{questions.length} correct</p>
              <div className="flex gap-4 justify-center mb-6">
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-yellow-400">+{challenge?.xp_reward}</div>
                  <div className="text-gray-400 text-sm">XP</div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
                  <div className="text-2xl font-bold text-yellow-400">+{challenge?.coin_reward}</div>
                  <div className="text-gray-400 text-sm">Coins</div>
                </div>
              </div>
            </>
          )}
          {completed && !finished && (
            <p className="text-gray-400 mb-6">Come back tomorrow for a new challenge!</p>
          )}
          <button onClick={() => router.push('/dashboard')} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> Back
          </Link>
          <div className="text-center py-10">
            <div className="text-7xl mb-4">🔥</div>
            <h1 className="text-4xl font-bold mb-2">Daily Challenge</h1>
            <p className="text-gray-400 mb-2">Topic: {challenge?.topic}</p>
            <p className="text-gray-400 mb-8">{questions.length} questions • Medium difficulty</p>
            <div className="flex gap-4 justify-center mb-8">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-400">+{challenge?.xp_reward}</div>
                <div className="text-gray-400 text-sm">XP Reward</div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
                <div className="text-2xl font-bold text-yellow-400">+{challenge?.coin_reward}</div>
                <div className="text-gray-400 text-sm">Coins</div>
              </div>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="px-10 py-4 bg-gradient-to-r from-orange-600 to-yellow-500 font-bold text-xl rounded-2xl"
            >
              🔥 Start Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[idx];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="sticky top-0 bg-gray-950/90 backdrop-blur-xl border-b border-orange-500/30 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-orange-400 font-bold">🔥 Daily Challenge</span>
            <span className="text-sm text-gray-400">{idx + 1} / {questions.length}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
              animate={{ width: `${((idx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-semibold">{current.question}</h2>
            </div>
            <div className="space-y-3 mb-6">
              {current.options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelected(opt)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selected === opt ? 'border-orange-500 bg-orange-500/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${selected === opt ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!selected}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-yellow-500 disabled:opacity-30 font-bold text-lg rounded-xl transition-all"
            >
              {idx === questions.length - 1 ? '🎯 Finish' : 'Next →'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
