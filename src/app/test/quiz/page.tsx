'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { formatTime } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  concept: string;
  topic: string;
  difficulty: string;
}

interface Answer {
  answer: string;
  correct: boolean;
  time: number;
}

function QuizContent() {
  const router = useRouter();
  const params = useSearchParams();
  const topic = params.get('topic') || 'Percentage';
  const count = parseInt(params.get('count') || '10');
  const difficulty = params.get('difficulty') || 'medium';
  const provider = params.get('provider') || undefined;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string>('');
  const qStartRef = useRef(Date.now());
  const answersRef = useRef<Answer[]>([]);

  useEffect(() => {
    fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, count, difficulty, ...(provider && { provider }) }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.questions?.length) {
          setQuestions(d.questions);
          setActiveProvider(d.provider || '');
        } else {
          toast.error('Failed to generate questions');
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error('Network error');
        setLoading(false);
      });
  }, [topic, count, difficulty]);

  // Per-question timer — FIXED: uses ref to avoid stale closure
  useEffect(() => {
    if (loading || submitting) return;
    setTimeLeft(60);
    qStartRef.current = Date.now();

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleNextRef.current();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, loading]);

  // Total time tracker
  useEffect(() => {
    if (loading) return;
    const t = setInterval(() => setTotalTime((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [loading]);

  const handleNext = () => {
    const q = questions[idx];
    if (!q) return;

    const elapsed = Math.round((Date.now() - qStartRef.current) / 1000);
    const correct = selected === q.correctAnswer;
    const newAnswer: Answer = { answer: selected || '', correct, time: elapsed };
    const newAnswers = [...answersRef.current, newAnswer];
    answersRef.current = newAnswers;
    setAnswers(newAnswers);

    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
    } else {
      finishTest(newAnswers);
    }
  };

  // Stable ref so timer callback always has latest version
  const handleNextRef = useRef(handleNext);
  useEffect(() => { handleNextRef.current = handleNext; });

  const finishTest = async (finalAnswers: Answer[]) => {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      try {
        const res = await fetch('/api/test/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            topic,
            difficulty,
            questions,
            answers: finalAnswers,
            totalTime,
          }),
        });
        const data = await res.json();
        sessionStorage.setItem('lastResult', JSON.stringify({
          questions,
          answers: finalAnswers,
          xpEarned: data.xpEarned || 0,
          coinsEarned: data.coinsEarned || 0,
          weakConcepts: data.weakConcepts || [],
          newAchievements: data.newAchievements || [],
          topic,
          difficulty,
        }));
      } catch {
        // Save locally even if API fails
        sessionStorage.setItem('lastResult', JSON.stringify({
          questions,
          answers: finalAnswers,
          xpEarned: 0,
          coinsEarned: 0,
          weakConcepts: [],
          newAchievements: [],
          topic,
          difficulty,
        }));
      }
    }

    router.push('/test/result');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            🤖 AI generating questions...
          </h2>
          <p className="text-gray-400 mt-2">Creating unique problems for you</p>
          {provider && (
            <p className="text-gray-600 text-sm mt-1">Using: {provider}</p>
          )}
        </div>
      </div>
    );
  }

  const current = questions[idx];
  if (!current) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <div className="sticky top-0 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">{idx + 1} / {questions.length}</span>
            <div className="flex gap-2 items-center">
              {activeProvider && (
                <span className="text-xs text-gray-600 hidden sm:block">
                  {activeProvider === 'gemini' ? '🟢' : activeProvider === 'groq' ? '⚡' : '🤖'} {activeProvider}
                </span>
              )}
              <div className={`px-3 py-1 rounded-lg font-mono text-sm ${
                timeLeft <= 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-indigo-500/20 text-indigo-300'
              }`}>
                ⏱ {timeLeft}s
              </div>
              <div className="px-3 py-1 rounded-lg font-mono text-sm bg-gray-800 text-gray-400">
                {formatTime(totalTime)}
              </div>
            </div>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
              animate={{ width: `${((idx + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            {/* Difficulty badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                current.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400' :
                current.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {current.difficulty?.toUpperCase()}
              </span>
              <span className="text-gray-500 text-xs">{current.topic}</span>
            </div>

            {/* Question */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
                {current.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {current.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelected(opt)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selected === opt
                      ? 'border-indigo-500 bg-indigo-500/20'
                      : 'border-gray-700 bg-gray-900/30 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                      selected === opt ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-base flex-1">{opt}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!selected || submitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg rounded-xl transition-all"
            >
              {submitting ? 'Saving...' : idx === questions.length - 1 ? '🎯 Finish Test' : 'Next Question →'}
            </button>

            {/* Question navigator */}
            <div className="mt-6 flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-lg text-xs flex items-center justify-center font-bold ${
                    i === idx ? 'bg-indigo-500 text-white' :
                    i < answers.length ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-gray-800 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>}>
      <QuizContent />
    </Suspense>
  );
}
