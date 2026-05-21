'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AITeacher from '@/components/AITeacher';
import toast from 'react-hot-toast';

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastResult');
    if (!stored) return router.push('/test');
    const parsed = JSON.parse(stored);
    setData(parsed);

    if (parsed.newAchievements?.length > 0) {
      parsed.newAchievements.forEach((a: any) => {
        toast.success(`🏆 Unlocked: ${a.icon} ${a.name}!`, { duration: 4000 });
      });
    }
  }, [router]);

  if (!data) return null;

  const { questions, answers, weakConcepts = [], xpEarned, coinsEarned, topic } = data;
  const correct = answers.filter((a: any) => a.correct).length;
  const accuracy = (correct / questions.length) * 100;
  const totalTime = answers.reduce((s: number, a: any) => s + (a.time || 0), 0);

  let grade = { letter: 'F', emoji: '😔', color: 'text-red-400', message: 'Keep practicing!' };
  if (accuracy >= 90) grade = { letter: 'A+', emoji: '🏆', color: 'text-emerald-400', message: 'Outstanding!' };
  else if (accuracy >= 80) grade = { letter: 'A', emoji: '🌟', color: 'text-emerald-400', message: 'Excellent!' };
  else if (accuracy >= 70) grade = { letter: 'B', emoji: '💪', color: 'text-blue-400', message: 'Great job!' };
  else if (accuracy >= 50) grade = { letter: 'C', emoji: '📚', color: 'text-yellow-400', message: 'Good effort!' };
  else if (accuracy >= 30) grade = { letter: 'D', emoji: '💡', color: 'text-orange-400', message: 'Keep going!' };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-10 pt-10"
        >
          <div className="text-7xl mb-4">{grade.emoji}</div>
          <div className={`text-7xl font-black ${grade.color} mb-2`}>{grade.letter}</div>
          <h1 className="text-3xl font-bold">{grade.message}</h1>
          <p className="text-gray-400">{topic} • {accuracy.toFixed(0)}% accuracy</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Score', value: `${correct}/${questions.length}`, color: 'text-indigo-400' },
            { label: 'Accuracy', value: `${accuracy.toFixed(0)}%`, color: 'text-cyan-400' },
            { label: 'Time', value: `${Math.round(totalTime / 60)}m ${totalTime % 60}s`, color: 'text-yellow-400' },
            { label: 'XP', value: `+${xpEarned}`, color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Coins earned */}
        {coinsEarned > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 text-center">
            <span className="text-yellow-400 font-bold">🪙 +{coinsEarned} coins earned!</span>
          </div>
        )}

        {/* Weak Areas */}
        {weakConcepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6"
          >
            <h3 className="text-xl font-bold text-red-400 mb-3">🎯 Areas to Focus On</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {weakConcepts.map((c: string) => (
                <span key={c} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-sm">💡 Click AI Teacher (bottom right) to learn these!</p>
          </motion.div>
        )}

        {/* Question Review */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">📝 Review Answers</h3>
          <div className="space-y-2">
            {questions.map((q: any, i: number) => {
              const ans = answers[i];
              return (
                <details key={i} className="bg-gray-800/50 rounded-xl p-4 cursor-pointer group">
                  <summary className="flex items-center gap-3 list-none">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      ans?.correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {ans?.correct ? '✓' : '✗'}
                    </span>
                    <span className="flex-1 text-sm line-clamp-1">Q{i + 1}: {q.question}</span>
                    <span className="text-gray-500 text-xs group-open:hidden">Show</span>
                  </summary>
                  <div className="mt-4 pt-4 border-t border-gray-700 space-y-2">
                    <p className="font-medium text-sm">{q.question}</p>
                    <p className="text-emerald-400 text-sm">✓ Correct: {q.correctAnswer}</p>
                    {!ans?.correct && ans?.answer && (
                      <p className="text-red-400 text-sm">✗ Your answer: {ans.answer}</p>
                    )}
                    {q.explanation && (
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <p className="text-indigo-300 font-semibold text-sm mb-1">📖 Explanation</p>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={() => router.push('/test')} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-bold rounded-xl transition-all">
            🔁 Practice More
          </button>
          <button onClick={() => router.push('/dashboard')} className="flex-1 py-4 bg-gray-800 border border-gray-700 hover:border-gray-600 font-bold rounded-xl transition-all">
            🏠 Dashboard
          </button>
        </div>
      </div>

      <AITeacher weakConcepts={weakConcepts} />
    </div>
  );
}
