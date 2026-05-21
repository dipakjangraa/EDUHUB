'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, CheckCircle, XCircle, Zap } from 'lucide-react';

interface ProviderInfo {
  configured: boolean;
  model: string;
  label: string;
  badge: string;
  description: string;
  speed: string;
  cost: string;
  getKeyUrl: string;
}

interface StatusData {
  providers: Record<string, ProviderInfo>;
  active: string[];
  primary: string | null;
  ready: boolean;
}

const SETUP_STEPS: Record<string, { steps: string[]; envKey: string }> = {
  gemini: {
    envKey: 'GEMINI_API_KEY',
    steps: [
      'Go to https://aistudio.google.com/app/apikey',
      'Sign in with your Google account',
      'Click "Create API Key"',
      'Copy the key',
      'Add to .env.local: GEMINI_API_KEY=your_key_here',
      'Restart the dev server',
    ],
  },
  groq: {
    envKey: 'GROQ_API_KEY',
    steps: [
      'Go to https://console.groq.com/keys',
      'Sign up / Login (free)',
      'Click "Create API Key"',
      'Copy the key',
      'Add to .env.local: GROQ_API_KEY=your_key_here',
      'Restart the dev server',
    ],
  },
  openai: {
    envKey: 'OPENAI_API_KEY',
    steps: [
      'Go to https://platform.openai.com/api-keys',
      'Sign up / Login',
      'Click "Create new secret key"',
      'Copy the key (shown only once!)',
      'Add to .env.local: OPENAI_API_KEY=your_key_here',
      'Restart the dev server',
    ],
  },
};

export default function AISetupPage() {
  const [status, setStatus] = useState<StatusData | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await fetch('/api/ai-status');
    const data = await res.json();
    setStatus(data);
  };

  const testGeneration = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'Percentage', count: 2, difficulty: 'easy' }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ error: err.message });
    }
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            🤖 AI Provider Setup
          </h1>
          <p className="text-gray-400 mt-2">
            Connect one or more AI providers to power unlimited question generation.
            The app auto-selects the best available provider.
          </p>
        </div>

        {/* Status overview */}
        {status && (
          <div className={`p-4 rounded-2xl border mb-6 ${
            status.ready
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {status.ready ? (
                <CheckCircle className="text-emerald-400" size={24} />
              ) : (
                <XCircle className="text-red-400" size={24} />
              )}
              <div>
                <div className={`font-bold ${status.ready ? 'text-emerald-400' : 'text-red-400'}`}>
                  {status.ready
                    ? `✅ ${status.active.length} provider${status.active.length > 1 ? 's' : ''} active — AI questions ready!`
                    : '❌ No AI provider configured — questions will not generate'}
                </div>
                {status.primary && (
                  <div className="text-sm text-gray-400 mt-0.5">
                    Primary: {status.providers[status.primary]?.label}
                    {status.active.length > 1 && ` (+${status.active.length - 1} fallback)`}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Provider cards */}
        <div className="space-y-4 mb-8">
          {status && Object.entries(status.providers).map(([key, p]) => (
            <div
              key={key}
              className={`rounded-2xl border overflow-hidden transition-all ${
                p.configured
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-gray-800 bg-gray-900/50'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{p.badge}</span>
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        {p.label}
                        {key === status.primary && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold">
                            PRIMARY
                          </span>
                        )}
                        {p.configured && key !== status.primary && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            FALLBACK
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{p.model}</div>
                      <div className="text-xs text-gray-500 mt-1">{p.description}</div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {p.configured ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                        <CheckCircle size={16} /> Configured
                      </div>
                    ) : (
                      <a
                        href={p.getKeyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                      >
                        Get API Key <ExternalLink size={14} />
                      </a>
                    )}
                    <div className="text-xs text-gray-500 mt-1">{p.cost}</div>
                    <div className="text-xs text-gray-500">Speed: {p.speed}</div>
                  </div>
                </div>

                {!p.configured && (
                  <button
                    onClick={() => setExpanded(expanded === key ? null : key)}
                    className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    {expanded === key ? '▲ Hide setup steps' : '▼ Show setup steps'}
                  </button>
                )}
              </div>

              {/* Setup steps */}
              {expanded === key && !p.configured && (
                <div className="border-t border-gray-800 p-5 bg-gray-900/50">
                  <h4 className="font-bold mb-3 text-sm">Setup Steps:</h4>
                  <ol className="space-y-2">
                    {SETUP_STEPS[key]?.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-4 p-3 bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-400 font-mono">
                      # Add to eduhub/.env.local<br />
                      {SETUP_STEPS[key]?.envKey}=your_api_key_here
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Test button */}
        {status?.ready && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="font-bold mb-3">🧪 Test Question Generation</h3>
            <button
              onClick={testGeneration}
              disabled={testing}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              <Zap size={18} />
              {testing ? 'Generating...' : 'Generate 2 Test Questions'}
            </button>

            {testResult && (
              <div className="mt-4">
                {testResult.error ? (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    ❌ Error: {testResult.error}
                    {testResult.hint && <div className="mt-1 text-gray-400">{testResult.hint}</div>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                      <CheckCircle size={16} />
                      Generated {testResult.questions?.length} questions via {testResult.provider}
                    </div>
                    {testResult.questions?.slice(0, 1).map((q: any, i: number) => (
                      <div key={i} className="p-4 bg-gray-800/50 rounded-xl text-sm">
                        <div className="font-medium mb-2">{q.question}</div>
                        <div className="space-y-1">
                          {q.options?.map((opt: string, j: number) => (
                            <div
                              key={j}
                              className={`px-3 py-1 rounded-lg ${
                                opt === q.correctAnswer
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'text-gray-400'
                              }`}
                            >
                              {String.fromCharCode(65 + j)}. {opt}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Concept: {q.concept}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold mb-4">⚙️ How the Multi-Provider System Works</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold flex-shrink-0">1.</span>
              <span>When a student starts a test, the app calls <code className="text-indigo-300 bg-gray-800 px-1 rounded">/api/generate-questions</code></span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold flex-shrink-0">2.</span>
              <span>The system tries providers in order: <strong className="text-white">Gemini → Groq → OpenAI</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold flex-shrink-0">3.</span>
              <span>If one fails (rate limit, error), it automatically falls back to the next</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold flex-shrink-0">4.</span>
              <span>Each call generates <strong className="text-white">completely unique questions</strong> — no repetition ever</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-indigo-400 font-bold flex-shrink-0">5.</span>
              <span>Students can also manually pick a provider from the test setup screen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
