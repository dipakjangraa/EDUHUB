'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { EXAM_META } from '@/lib/mock-test-config';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Home, ChevronDown, ChevronUp } from 'lucide-react';

export default function MockTestResult() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mockTest, setMockTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [filterSection, setFilterSection] = useState('all');

  useEffect(() => { loadResult(); }, [id]);

  const loadResult = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const { data } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!data) { router.push('/mock-test'); return; }
    setMockTest(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const questions = mockTest.questions || [];
  const answers = mockTest.answers || [];
  const sectionScores = mockTest.section_scores || {};
  const meta = EXAM_META[mockTest.exam as keyof typeof EXAM_META];

  const correct = answers.filter((a: string, i: number) => a === questions[i]?.correctAnswer).length;
  const wrong = answers.filter((a: string, i: number) => a && a !== '' && a !== questions[i]?.correctAnswer).length;
  const skipped = answers.filter((a: string) => !a || a === '').length;
  const percentage = mockTest.max_score > 0 ? (mockTest.score / mockTest.max_score) * 100 : 0;

  let grade = { letter: 'F', emoji: '😔', color: '#ef4444', msg: 'Keep practicing!' };
  if (percentage >= 90) grade = { letter: 'A+', emoji: '🏆', color: '#10b981', msg: 'Outstanding!' };
  else if (percentage >= 75) grade = { letter: 'A', emoji: '🌟', color: '#10b981', msg: 'Excellent!' };
  else if (percentage >= 60) grade = { letter: 'B', emoji: '💪', color: '#6366f1', msg: 'Good job!' };
  else if (percentage >= 45) grade = { letter: 'C', emoji: '📚', color: '#f59e0b', msg: 'Keep going!' };
  else if (percentage >= 30) grade = { letter: 'D', emoji: '💡', color: '#f97316', msg: 'Need more practice' };

  const sections = [...new Set(questions.map((q: any) => q.section || 'General'))];
  const filteredQuestions = filterSection === 'all'
    ? questions.map((q: any, i: number) => ({ ...q, idx: i }))
    : questions.map((q: any, i: number) => ({ ...q, idx: i })).filter((q: any) => q.section === filterSection);

  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: 'white', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Back */}
        <Link href="/mock-test" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#9ca3af', textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
          <ArrowLeft size={18} /> Back to Mock Tests
        </Link>

        {/* Hero Result */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: 'center', marginBottom: '32px', padding: '40px 24px', background: `linear-gradient(135deg, ${meta?.bg || 'rgba(99,102,241,0.1)'}, rgba(3,7,18,0))`, border: `1px solid ${meta?.border || 'rgba(99,102,241,0.3)'}`, borderRadius: '24px' }}
        >
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>{grade.emoji}</div>
          <div style={{ fontSize: '72px', fontWeight: '900', color: grade.color, lineHeight: 1 }}>{grade.letter}</div>
          <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '8px' }}>{grade.msg}</div>
          <div style={{ color: '#9ca3af', marginTop: '4px', fontSize: '14px' }}>{mockTest.title}</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginTop: '28px' }}>
            {[
              { label: 'Score', value: `${mockTest.score}/${mockTest.max_score}`, color: meta?.color || '#6366f1' },
              { label: 'Percentage', value: `${percentage.toFixed(1)}%`, color: grade.color },
              { label: 'Correct', value: correct, color: '#10b981' },
              { label: 'Wrong', value: wrong, color: '#ef4444' },
              { label: 'Skipped', value: skipped, color: '#6b7280' },
              { label: 'Time Taken', value: formatTime(mockTest.time_taken || 0), color: '#22d3ee' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section-wise Scores */}
        {Object.keys(sectionScores).length > 0 && (
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontWeight: '700', marginBottom: '16px', fontSize: '16px' }}>📊 Section-wise Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(sectionScores).map(([section, data]: [string, any]) => {
                const pct = data.maxScore > 0 ? (data.score / data.maxScore) * 100 : 0;
                const color = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
                return (
                  <div key={section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                      <span>{section}</span>
                      <span style={{ color, fontWeight: '700' }}>{Math.max(0, data.score)}/{data.maxScore} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div style={{ height: '8px', background: '#1f2937', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: color, borderRadius: '4px', width: `${Math.max(0, pct)}%`, transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '3px' }}>
                      {data.correct} correct out of {data.total} questions
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Review */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontWeight: '700', fontSize: '16px', margin: 0 }}>📝 Question Review</h3>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterSection('all')}
                style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: filterSection === 'all' ? '#6366f1' : '#1f2937', color: 'white' }}
              >
                All
              </button>
              {sections.map((s: any) => (
                <button
                  key={s}
                  onClick={() => setFilterSection(s)}
                  style={{ padding: '5px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: filterSection === s ? '#6366f1' : '#1f2937', color: 'white' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredQuestions.map((q: any) => {
              const userAns = answers[q.idx];
              const isCorrect = userAns === q.correctAnswer;
              const isSkipped = !userAns || userAns === '';
              const isExpanded = expandedQ === q.idx;

              return (
                <div
                  key={q.idx}
                  style={{
                    background: isCorrect ? 'rgba(16,185,129,0.05)' : isSkipped ? 'rgba(107,114,128,0.05)' : 'rgba(239,68,68,0.05)',
                    border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.2)' : isSkipped ? 'rgba(107,114,128,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setExpandedQ(isExpanded ? null : q.idx)}
                    style={{ width: '100%', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', color: 'white' }}
                  >
                    <span style={{
                      width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                      background: isCorrect ? '#10b981' : isSkipped ? '#374151' : '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700',
                    }}>
                      {isCorrect ? '✓' : isSkipped ? '–' : '✗'}
                    </span>
                    <span style={{ flex: 1, fontSize: '14px', lineHeight: '1.4' }}>
                      Q{q.idx + 1}: {q.question?.substring(0, 80)}{q.question?.length > 80 ? '...' : ''}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280', flexShrink: 0 }}>{q.section}</span>
                    {isExpanded ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
                  </button>

                  {isExpanded && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '15px', lineHeight: '1.7', margin: '12px 0' }}>{q.question}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                        {q.options?.map((opt: string, i: number) => {
                          const isUserAns = opt === userAns;
                          const isCorrectAns = opt === q.correctAnswer;
                          return (
                            <div key={i} style={{
                              padding: '8px 12px', borderRadius: '8px', fontSize: '14px',
                              background: isCorrectAns ? 'rgba(16,185,129,0.15)' : isUserAns && !isCorrectAns ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${isCorrectAns ? 'rgba(16,185,129,0.4)' : isUserAns && !isCorrectAns ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.05)'}`,
                              color: isCorrectAns ? '#10b981' : isUserAns && !isCorrectAns ? '#ef4444' : '#d1d5db',
                            }}>
                              {String.fromCharCode(65 + i)}. {opt}
                              {isCorrectAns && ' ✓'}
                              {isUserAns && !isCorrectAns && ' ✗ (Your answer)'}
                            </div>
                          );
                        })}
                      </div>
                      {q.explanation && (
                        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ color: '#818cf8', fontWeight: '600', fontSize: '13px', marginBottom: '6px' }}>📖 Explanation</div>
                          <div style={{ color: '#d1d5db', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{q.explanation}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/mock-test" style={{ flex: 1, padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', textDecoration: 'none', borderRadius: '12px', textAlign: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RotateCcw size={18} /> Take Another Mock Test
          </Link>
          <Link href="/dashboard" style={{ flex: 1, padding: '14px', background: '#1f2937', border: '1px solid #374151', color: 'white', textDecoration: 'none', borderRadius: '12px', textAlign: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Home size={18} /> Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
