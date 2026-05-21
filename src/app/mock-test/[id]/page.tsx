'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatTime } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MockTestArena() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [mockTest, setMockTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [user, setUser] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTest();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [id]);

  const loadTest = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    setUser(user);

    const { data: test } = await supabase
      .from('mock_tests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!test) { router.push('/mock-test'); return; }

    if (test.status === 'completed') {
      router.push(`/mock-test/result/${id}`);
      return;
    }

    setMockTest(test);
    setQuestions(test.questions || []);
    setCurrentSection(test.questions?.[0]?.section || '');

    // Restore existing answers if resuming
    if (test.answers && Array.isArray(test.answers)) {
      const restored: Record<number, string> = {};
      test.answers.forEach((a: string, i: number) => { if (a) restored[i] = a; });
      setAnswers(restored);
    }

    // Set timer
    const elapsed = test.started_at
      ? Math.floor((Date.now() - new Date(test.started_at).getTime()) / 1000)
      : 0;
    const totalSeconds = test.duration_minutes * 60;
    const remaining = Math.max(0, totalSeconds - elapsed);
    setTimeLeft(remaining);

    // Mark as in_progress
    if (test.status === 'pending') {
      await supabase.from('mock_tests').update({
        status: 'in_progress',
        started_at: new Date().toISOString(),
      }).eq('id', id);
    }

    setLoading(false);
  };

  // Timer
  useEffect(() => {
    if (loading || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading]);

  const handleSubmit = useCallback(async () => {
    if (submitting || !user) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalSeconds = mockTest?.duration_minutes * 60 || 0;
    const timeTaken = totalSeconds - timeLeft;

    // Build answers array
    const answersArray = questions.map((_, i) => answers[i] || '');

    try {
      const res = await fetch('/api/mock-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: id,
          userId: user.id,
          answers: answersArray,
          timeTaken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Test submitted! Score: ${data.score}/${data.maxScore}`);
        router.push(`/mock-test/result/${id}`);
      } else {
        toast.error(data.error || 'Submit failed');
        setSubmitting(false);
      }
    } catch {
      toast.error('Network error');
      setSubmitting(false);
    }
  }, [submitting, user, mockTest, timeLeft, questions, answers, id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#9ca3af' }}>Loading mock test...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const current = questions[currentIdx];
  if (!current) return null;

  const answered = Object.keys(answers).length;
  const unanswered = questions.length - answered;
  const progress = (answered / questions.length) * 100;
  const isLowTime = timeLeft < 300; // 5 minutes

  // Group questions by section
  const sections = questions.reduce((acc: Record<string, number[]>, q, i) => {
    const s = q.section || 'General';
    if (!acc[s]) acc[s] = [];
    acc[s].push(i);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Top Bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px' }}>{mockTest?.title}</div>
            <div style={{ color: '#6b7280', fontSize: '12px' }}>{currentIdx + 1}/{questions.length} • {current?.section}</div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Timer */}
            <div style={{
              padding: '8px 16px', borderRadius: '10px', fontFamily: 'monospace', fontWeight: '700', fontSize: '16px',
              background: isLowTime ? 'rgba(239,68,68,0.2)' : 'rgba(99,102,241,0.2)',
              color: isLowTime ? '#ef4444' : '#818cf8',
              animation: isLowTime ? 'pulse 1s infinite' : 'none',
            }}>
              ⏱ {formatTime(timeLeft)}
            </div>

            {/* Stats */}
            <div style={{ padding: '8px 12px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', fontSize: '13px', color: '#10b981' }}>
              ✓ {answered}
            </div>
            <div style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: '10px', fontSize: '13px', color: '#ef4444' }}>
              ○ {unanswered}
            </div>

            {/* Panel toggle */}
            <button
              onClick={() => setShowPanel(!showPanel)}
              style={{ padding: '8px 12px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '13px' }}
            >
              📋 Panel
            </button>

            {/* Submit */}
            <button
              onClick={() => {
                if (unanswered > 0) {
                  if (!confirm(`${unanswered} questions unanswered. Submit anyway?`)) return;
                }
                handleSubmit();
              }}
              disabled={submitting}
              style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px', opacity: submitting ? 0.5 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ maxWidth: '900px', margin: '8px auto 0', height: '3px', background: '#1f2937', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(to right, #6366f1, #22d3ee)', width: `${progress}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '16px', gap: '16px' }}>

        {/* Main Question Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
            >
              {/* Question */}
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#6b7280' }}>Q{currentIdx + 1} • {current.section}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                      +{current.marks || 1} marks
                    </span>
                    {(current.negativeMarks || 0) > 0 && (
                      <span style={{ fontSize: '12px', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                        -{current.negativeMarks} wrong
                      </span>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '17px', lineHeight: '1.7', margin: 0 }}>{current.question}</p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {current.options?.map((opt: string, i: number) => {
                  const isSelected = answers[currentIdx] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: opt }))}
                      style={{
                        padding: '14px 18px',
                        background: isSelected ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.07)'}`,
                        borderRadius: '12px',
                        color: 'white',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.15s',
                        fontSize: '15px',
                      }}
                    >
                      <span style={{
                        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                        background: isSelected ? '#6366f1' : '#1f2937',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '700', fontSize: '13px',
                      }}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Clear & Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setAnswers(prev => { const n = { ...prev }; delete n[currentIdx]; return n; })}
                  style={{ padding: '10px 16px', background: 'transparent', border: '1px solid #374151', borderRadius: '10px', color: '#9ca3af', cursor: 'pointer', fontSize: '13px' }}
                >
                  Clear Response
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                    disabled={currentIdx === 0}
                    style={{ padding: '10px 20px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '14px', opacity: currentIdx === 0 ? 0.4 : 1 }}
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setCurrentIdx(Math.min(questions.length - 1, currentIdx + 1))}
                    disabled={currentIdx === questions.length - 1}
                    style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: currentIdx === questions.length - 1 ? 0.4 : 1 }}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Question Panel */}
        {showPanel && (
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '16px', position: 'sticky', top: '80px', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
              <h3 style={{ fontWeight: '700', marginBottom: '12px', fontSize: '14px' }}>Question Navigator</h3>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '11px', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#6366f1', borderRadius: '3px' }} /> Current
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} /> Answered
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '12px', height: '12px', background: '#1f2937', borderRadius: '3px' }} /> Not visited
                </div>
              </div>

              {/* Sections */}
              {Object.entries(sections).map(([section, indices]) => (
                <div key={section} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>{section}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(indices as number[]).map((qi) => (
                      <button
                        key={qi}
                        onClick={() => setCurrentIdx(qi)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                          border: 'none', cursor: 'pointer',
                          background: qi === currentIdx ? '#6366f1' : answers[qi] ? '#10b981' : '#1f2937',
                          color: 'white',
                        }}
                      >
                        {qi + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Summary */}
              <div style={{ borderTop: '1px solid #1f2937', paddingTop: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ color: '#10b981' }}>Answered</span>
                  <span style={{ fontWeight: '700', color: '#10b981' }}>{answered}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
                  <span style={{ color: '#ef4444' }}>Not Answered</span>
                  <span style={{ fontWeight: '700', color: '#ef4444' }}>{unanswered}</span>
                </div>
                <button
                  onClick={() => {
                    if (unanswered > 0) {
                      if (!confirm(`${unanswered} questions unanswered. Submit anyway?`)) return;
                    }
                    handleSubmit();
                  }}
                  disabled={submitting}
                  style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', border: 'none', borderRadius: '10px', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '13px' }}
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }`}</style>
    </div>
  );
}
