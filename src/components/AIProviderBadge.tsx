'use client';

import { useEffect, useState } from 'react';

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

export default function AIProviderBadge({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<StatusData | null>(null);

  useEffect(() => {
    fetch('/api/ai-status')
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => {});
  }, []);

  if (!status) return null;

  if (!status.ready) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
        ⚠️ No AI provider configured
      </div>
    );
  }

  const primary = status.primary ? status.providers[status.primary] : null;
  if (!primary) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
        {primary.badge} {primary.label}
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
      <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">AI Providers</div>
      <div className="space-y-2">
        {Object.entries(status.providers).map(([key, p]) => (
          <div
            key={key}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              key === status.primary
                ? 'border-emerald-500/40 bg-emerald-500/5'
                : p.configured
                ? 'border-gray-700 bg-gray-800/30'
                : 'border-gray-800 bg-gray-900/20 opacity-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{p.badge}</span>
              <div>
                <div className="text-sm font-medium flex items-center gap-2">
                  {p.label}
                  {key === status.primary && (
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full font-bold">
                      ACTIVE
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{p.model}</div>
              </div>
            </div>
            <div className="text-right">
              {p.configured ? (
                <div>
                  <div className="text-xs text-emerald-400 font-medium">✓ Ready</div>
                  <div className="text-xs text-gray-500">{p.speed}</div>
                </div>
              ) : (
                <a
                  href={p.getKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Get Key →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      {status.active.length > 1 && (
        <p className="text-xs text-gray-500 mt-3">
          {status.active.length} providers active — auto-fallback enabled
        </p>
      )}
    </div>
  );
}
