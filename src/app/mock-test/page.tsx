'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ALL_MOCK_TESTS, EXAM_META, MockTestConfig } from '@/lib/mock-test-config';
import toast from 'react-hot-toast';
import { ArrowLeft, Clock, FileText, Target, Zap, ChevronRight, History } from 'lucide-react';

export default function MockTestPage() {
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<string>('ssc');
  const [creating, setCreating] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) loadHistory();
  }, [user, selectedExam]);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser(user);
  };

  const loadHistory = async () => {
    if (!user) return;
    const res = await fetch(`/api/mock-test/history?userId=${user.id}&exam=${selectedExam}&limit=5`);
    const data = await res.json();
    setHistory(data.tests || []);
  };

  const startMockTest = async (config: MockTestConfig) => {
    if (!user) return;
    setCreating(config.id);
    toast.loading(`Generating ${config.totalQuestions} questions...`, { id: 'creating' });

    try {
      const res = await fetch('/api/mock-test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, mockTestId: config.id, exam: selectedExam }),
      });
      const data = await res.json();

      if (data.mockTestId) {
        toast.success('Mock test ready!', { id: 'creating' });
        router.push(`/mock-test/${data.mockTestId}`);
      } else {
        toast.error(data.error || 'Failed to create test', { id: 'creating' });
      }
    } catch {
      toast.error('Network error', { id: 'creating' });
    }
    setCreating(null);
  };

  const exams = Object.entries(EXAM_META);
  const currentMocks = ALL_MOCK_TESTS[selectedExam] || [];
  const meta = EXAM_META[selectedExam as keyof typeof EXAM_META];

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">📝 Mock Tests</h1>
              <p className="text-gray-400 text-sm">Unlimited AI-generated full-length mock tests</p>
            </div>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm hover:bg-gray-700 transition-all"
          >
            <History size={16} /> History
          </button>
        </div>

        {/* Exam Selector */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {exams.map(([id, m]) => (
            <button
              key={id}
              onClick={() => setSelectedExam(id)}
              style={{
                background: selectedExam === id ? m.bg : 'rgba(255,255,255,0.03)',
                border: `2px solid ${selectedExam === id ? m.border : 'rgba(255,255,255,0.07)'}`,
              }}
              className="p-3 rounded-2xl text-center transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="font-bold text-sm" style={{ color: selectedExam === id ? m.color : 'white' }}>{m.name}</div>
            </button>
          ))}
        </div>

        {/* History Panel */}
        {showHistory && history.length > 0 && (
          <div className="mb-8 bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <History size={18} className="text-indigo-400" />
              Recent {meta?.name} Mock Tests
            </h3>
            <div className="space-y-2">
              {history.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
                  <div>
                    <div className="font-medium text-sm">{t.title}</div>
                    <div className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="flex gap-4 text-sm items-center">
                    {t.status === 'completed' ? (
                      <>
                        <span className="text-gray-400">{t.score}/{t.max_score}</span>
                        <span className={`font-bold ${t.accuracy >= 70 ? 'text-emerald-400' : t.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {t.accuracy?.toFixed(0)}%
                        </span>
                        <Link href={`/mock-test/result/${t.id}`} className="text-indigo-400 text-xs hover:underline">
                          View →
                        </Link>
                      </>
                    ) : (
                      <Link href={`/mock-test/${t.id}`} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold">
                        Resume →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mock Test Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {currentMocks.map((config) => (
            <div
              key={config.id}
              style={{ border: `1px solid ${meta?.border || 'rgba(255,255,255,0.07)'}` }}
              className="bg-gray-900/50 rounded-2xl p-5 hover:bg-gray-900/80 transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{config.icon}</div>
                  <div>
                    <h3 className="font-bold text-base">{config.title}</h3>
                    <p className="text-gray-400 text-xs mt-0.5">{config.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  config.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                  config.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {config.difficulty.toUpperCase()}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <FileText size={16} className="mx-auto mb-1 text-indigo-400" />
                  <div className="font-bold text-sm">{config.totalQuestions}</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <Clock size={16} className="mx-auto mb-1 text-cyan-400" />
                  <div className="font-bold text-sm">{config.durationMinutes}m</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                  <Target size={16} className="mx-auto mb-1 text-emerald-400" />
                  <div className="font-bold text-sm">{config.totalMarks}</div>
                  <div className="text-xs text-gray-500">Max Marks</div>
                </div>
              </div>

              {/* Sections */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Sections:</div>
                <div className="flex flex-wrap gap-1.5">
                  {config.sections.map((s) => (
                    <span key={s.subject} className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-300 flex items-center gap-1">
                      {s.icon} {s.subject} ({s.questionCount}Q)
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {config.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Negative marking warning */}
              {config.sections[0]?.negativeMarking > 0 && (
                <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 rounded-lg px-3 py-2 mb-4">
                  ⚠️ Negative marking: -{config.sections[0].negativeMarking} per wrong answer
                </div>
              )}

              {/* Start Button */}
              <button
                onClick={() => startMockTest(config)}
                disabled={creating === config.id}
                style={{ background: creating === config.id ? '#374151' : `linear-gradient(135deg, ${meta?.color}cc, ${meta?.color})` }}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
              >
                {creating === config.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Start Mock Test
                    <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Zap size={18} className="text-indigo-400" />
            How Unlimited Mock Tests Work
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">1.</span>
              AI generates completely unique questions every time — no two tests are the same
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">2.</span>
              Real exam pattern with section-wise scoring and negative marking
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">3.</span>
              Detailed analysis after each test — weak areas, time per question, section scores
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
