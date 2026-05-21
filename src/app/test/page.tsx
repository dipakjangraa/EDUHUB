'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ALL_EXAMS, getTopicsForExam } from '@/lib/syllabus';

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedTopic = searchParams.get('topic') || '';
  const preselectedExam = searchParams.get('exam') || '';

  const [selectedExam, setSelectedExam] = useState(preselectedExam);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(preselectedTopic);
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('medium');
  const [provider, setProvider] = useState('auto');

  const currentExam = ALL_EXAMS.find(e => e.id === selectedExam);
  const currentSubjects = currentExam?.subjects || [];
  const currentTopics = selectedSubject
    ? currentSubjects.find(s => s.name === selectedSubject)?.topics || []
    : currentSubjects.flatMap(s => s.topics);

  const start = () => {
    if (!selectedTopic) return;
    const params = new URLSearchParams({
      topic: selectedTopic,
      count: count.toString(),
      difficulty,
      ...(provider !== 'auto' && { provider }),
      ...(selectedExam && { exam: selectedExam }),
    });
    router.push(`/test/quiz?${params}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Choose Your <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Practice</span>
        </h1>
        <p className="text-gray-400 mb-8">Select your exam, subject and topic — AI generates unlimited unique questions</p>

        {/* Step 1: Exam Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">1</span>
            Select Exam
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ALL_EXAMS.map((exam) => (
              <motion.button
                key={exam.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setSelectedExam(exam.id);
                  setSelectedSubject('');
                  setSelectedTopic('');
                }}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  selectedExam === exam.id
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                <div className="text-3xl mb-2">{exam.icon}</div>
                <div className="font-bold text-sm">{exam.name}</div>
                <div className="text-xs text-gray-500 mt-1">{exam.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Step 2: Subject Selection */}
        <AnimatePresence>
          {selectedExam && currentSubjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">2</span>
                Select Subject
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedSubject(''); setSelectedTopic(''); }}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    selectedSubject === ''
                      ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  All Subjects
                </button>
                {currentSubjects.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => { setSelectedSubject(sub.name); setSelectedTopic(''); }}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedSubject === sub.name
                        ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span>{sub.icon}</span> {sub.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Topic Selection */}
        <AnimatePresence>
          {selectedExam && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-8"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">3</span>
                Select Topic
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentTopics.map((t) => (
                  <motion.button
                    key={t.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTopic(t.name)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      selectedTopic === t.name
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.icon}</div>
                    <div className="font-medium text-sm">{t.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Configure */}
        <AnimatePresence>
          {selectedTopic && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sticky bottom-4"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">4</span>
                Configure: <span className="text-indigo-400">{selectedTopic}</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {/* Questions */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Questions</label>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCount(n)}
                        className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                          count === n ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-gray-700 text-gray-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Difficulty</label>
                  <div className="flex gap-2">
                    {[
                      { v: 'easy', l: '🟢 Easy' },
                      { v: 'medium', l: '🟡 Medium' },
                      { v: 'hard', l: '🔴 Hard' },
                    ].map((d) => (
                      <button
                        key={d.v}
                        onClick={() => setDifficulty(d.v)}
                        className={`flex-1 py-2 rounded-lg border text-sm transition-all ${
                          difficulty === d.v ? 'border-indigo-500 bg-indigo-500/20' : 'border-gray-700 text-gray-400'
                        }`}
                      >
                        {d.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Provider */}
                <div>
                  <label className="text-sm text-gray-400 block mb-2">AI Provider</label>
                  <div className="flex gap-2">
                    {[
                      { v: 'auto', l: '⚡ Auto' },
                      { v: 'gemini', l: '🟢 Gemini' },
                      { v: 'groq', l: '⚡ Groq' },
                    ].map((p) => (
                      <button
                        key={p.v}
                        onClick={() => setProvider(p.v)}
                        className={`flex-1 py-2 rounded-lg border text-xs transition-all ${
                          provider === p.v ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-gray-700 text-gray-400'
                        }`}
                      >
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={start}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-bold rounded-xl text-lg transition-all"
              >
                🚀 Start {count} Questions — {selectedTopic}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No exam selected prompt */}
        {!selectedExam && (
          <div className="text-center py-16 text-gray-600">
            <div className="text-5xl mb-4">☝️</div>
            <p className="text-lg">Select your exam above to see the syllabus</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <TestContent />
    </Suspense>
  );
}
