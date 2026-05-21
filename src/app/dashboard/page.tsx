'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [tests, setTests] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push('/login');
        return;
      }

      // Load profile — create it if it doesn't exist yet
      let { data: p, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist — create it
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
          })
          .select()
          .single();

        if (createError) {
          setError('Could not create profile: ' + createError.message + '. Make sure DATABASE_SCHEMA.sql has been run in Supabase.');
          setLoading(false);
          return;
        }
        p = newProfile;
      } else if (profileError) {
        setError('Profile error: ' + profileError.message + ' (code: ' + profileError.code + ')');
        setLoading(false);
        return;
      }

      setProfile(p);

      // Load tests and topics in parallel
      const [testsRes, topicsRes] = await Promise.all([
        supabase.from('test_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('topic_performance').select('*').eq('user_id', user.id).order('accuracy', { ascending: true }),
      ]);

      setTests(testsRes.data || []);
      setTopics(topicsRes.data || []);
    } catch (err: any) {
      setError('Error: ' + err.message);
    }

    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Loading
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#9ca3af' }}>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#450a0a', border: '1px solid #dc2626', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%' }}>
          <h2 style={{ color: '#fca5a5', marginBottom: '12px' }}>❌ Dashboard Error</h2>
          <p style={{ color: '#fca5a5', fontSize: '14px', marginBottom: '16px' }}>{error}</p>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
            This usually means the database schema hasn&apos;t been set up yet. Run DATABASE_SCHEMA.sql in Supabase SQL Editor.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={load} style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Retry
            </button>
            <button onClick={logout} style={{ padding: '10px 20px', background: '#374151', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  const weakTopics = topics.filter(t => t.accuracy < 70).slice(0, 3);
  const strongTopics = topics.filter(t => t.accuracy >= 70).slice(0, 3);

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: 'white', padding: '24px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
              Hey, <span style={{ background: 'linear-gradient(to right, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{profile?.name}</span> 👋
            </h1>
            <p style={{ color: '#9ca3af', margin: '4px 0 0', fontSize: '14px' }}>Let&apos;s crush it today!</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/profile" style={{ padding: '8px 16px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: 'white', textDecoration: 'none', fontSize: '14px' }}>
              Profile
            </Link>
            <button onClick={logout} style={{ padding: '8px 16px', background: '#1f2937', border: '1px solid #374151', borderRadius: '10px', color: 'white', cursor: 'pointer', fontSize: '14px' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          {[
            { href: '/test', icon: '⚡', label: 'Practice', bg: 'linear-gradient(135deg, #4f46e5, #6366f1)' },
            { href: '/mock-test', icon: '📝', label: 'Mock Test', bg: 'linear-gradient(135deg, #0891b2, #6366f1)' },
            { href: '/battle', icon: '⚔️', label: 'Battle', bg: 'linear-gradient(135deg, #dc2626, #f97316)' },
            { href: '/leaderboard', icon: '🏆', label: 'Ranks', bg: 'linear-gradient(135deg, #d97706, #f97316)' },
            { href: '/achievements', icon: '🎖️', label: 'Badges', bg: 'linear-gradient(135deg, #7c3aed, #ec4899)' },
            { href: '/daily-challenge', icon: '🔥', label: 'Daily', bg: 'linear-gradient(135deg, #ea580c, #eab308)' },
            { href: '/ai-setup', icon: '🤖', label: 'AI Setup', bg: 'linear-gradient(135deg, #0891b2, #6366f1)' },
          ].map((a) => (
            <Link key={a.href} href={a.href} style={{ padding: '20px 16px', background: a.bg, borderRadius: '16px', textAlign: 'center', textDecoration: 'none', color: 'white', display: 'block' }}>
              <div style={{ fontSize: '28px', marginBottom: '6px' }}>{a.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{a.label}</div>
            </Link>
          ))}
        </div>

        {/* Mock Test Banner */}
        <Link href="/mock-test" style={{ display: 'block', marginBottom: '24px', padding: '20px', background: 'linear-gradient(135deg, rgba(8,145,178,0.2), rgba(99,102,241,0.2))', border: '1px solid rgba(8,145,178,0.3)', borderRadius: '16px', textDecoration: 'none', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>📝</span>
              <div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#22d3ee' }}>Unlimited Mock Tests</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>UPSC • NEET • JEE • NDA • SSC — Real exam pattern with AI questions</div>
              </div>
            </div>
            <div style={{ color: '#22d3ee', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>Start Now →</div>
          </div>
        </Link>

        {/* XP Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ color: '#9ca3af', fontSize: '13px' }}>Level {Math.floor(Math.sqrt((profile?.xp || 0) / 100)) + 1}</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>⚡ {profile?.xp || 0} XP</div>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px' }}>🔥</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f97316' }}>{profile?.streak || 0}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Streak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px' }}>🪙</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#eab308' }}>{profile?.coins || 0}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Coins</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px' }}>📊</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#22d3ee' }}>{profile?.total_tests || 0}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>Tests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weak & Strong Areas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>🎯 Weak Areas</h3>
            {weakTopics.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Take tests to discover weak areas</p>
            ) : (
              <div>
                {weakTopics.map((t) => (
                  <div key={t.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px' }}>{t.topic}</span>
                      <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>{t.accuracy.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#1f2937', borderRadius: '3px' }}>
                      <div style={{ height: '100%', background: '#ef4444', borderRadius: '3px', width: `${t.accuracy}%` }} />
                    </div>
                  </div>
                ))}
                <Link href={`/test?topic=${encodeURIComponent(weakTopics[0]?.topic)}`}
                  style={{ display: 'block', marginTop: '12px', padding: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', textAlign: 'center', color: '#ef4444', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
                  Practice Weak Areas →
                </Link>
              </div>
            )}
          </div>

          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>💪 Strong Areas</h3>
            {strongTopics.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>Build strong areas through practice</p>
            ) : (
              <div>
                {strongTopics.map((t) => (
                  <div key={t.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px' }}>{t.topic}</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>{t.accuracy.toFixed(0)}%</span>
                    </div>
                    <div style={{ height: '6px', background: '#1f2937', borderRadius: '3px' }}>
                      <div style={{ height: '100%', background: '#10b981', borderRadius: '3px', width: `${t.accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Tests */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '18px' }}>📝 Recent Activity</h3>
          {tests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚀</div>
              <p style={{ color: '#6b7280', marginBottom: '16px' }}>Take your first test!</p>
              <Link href="/test" style={{ padding: '12px 24px', background: 'linear-gradient(to right, #4f46e5, #6366f1)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold' }}>
                Start Now
              </Link>
            </div>
          ) : (
            <div>
              {tests.map((t) => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#1f2937', borderRadius: '10px', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{t.topic}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px' }}>{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                    <span>{t.correct}/{t.total_questions}</span>
                    <span style={{ color: t.accuracy >= 70 ? '#10b981' : '#eab308', fontWeight: 'bold' }}>{t.accuracy.toFixed(0)}%</span>
                    <span style={{ color: '#818cf8' }}>+{t.xp_earned} XP</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start Test CTA */}
        <Link href="/test" style={{ display: 'block', padding: '24px', background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', textAlign: 'center', textDecoration: 'none', color: 'white' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>Start Practicing Now</div>
          <div style={{ color: '#9ca3af', fontSize: '14px' }}>AI generates unlimited unique questions for you</div>
        </Link>

      </div>
    </div>
  );
}
