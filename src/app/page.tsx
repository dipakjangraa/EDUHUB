'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Question Generator',
    desc: 'Powered by Google Gemini, Groq & OpenAI. Generates unlimited unique questions every time — no repetition ever.',
    color: '#6366f1',
  },
  {
    icon: '🧠',
    title: 'Smart Weak Point Analysis',
    desc: 'AI tracks every answer, finds your weak concepts, and automatically focuses your practice where you need it most.',
    color: '#8b5cf6',
  },
  {
    icon: '👨‍🏫',
    title: 'Personal AI Teacher',
    desc: 'Ask anything in Hinglish. Your AI tutor explains concepts with real-life Indian examples, 24/7.',
    color: '#06b6d4',
  },
  {
    icon: '⚔️',
    title: 'Real-time Battle Mode',
    desc: '1v1 quiz battles with live scoring. Challenge friends, win XP and coins, climb the leaderboard.',
    color: '#ef4444',
  },
  {
    icon: '📈',
    title: 'Performance Analytics',
    desc: 'Detailed charts showing your accuracy trends, speed, topic-wise breakdown and improvement over time.',
    color: '#10b981',
  },
  {
    icon: '🎮',
    title: 'Gamified Learning',
    desc: 'XP, levels, coins, streaks, daily challenges and 17+ achievements. Learning feels like a game.',
    color: '#f59e0b',
  },
];

const TOPICS = [
  // UPSC / SSC
  'Percentage', 'Profit & Loss', 'Time Speed Distance', 'Simple Interest',
  'Compound Interest', 'Ratio & Proportion', 'Data Interpretation', 'Averages',
  // JEE / NDA Math
  'Trigonometry', 'Algebra', 'Calculus', 'Coordinate Geometry',
  'Quadratic Equations', 'Probability', 'Matrices & Determinants', 'Vectors',
  // NEET Physics
  'Mechanics', 'Thermodynamics', 'Electrostatics', 'Current Electricity',
  'Optics', 'Modern Physics', 'Waves & Sound', 'Magnetism',
  // NEET Chemistry
  'Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Chemical Bonding',
  // NEET Biology
  'Cell Biology', 'Genetics', 'Human Physiology', 'Plant Physiology', 'Ecology',
  // Reasoning
  'Number Series', 'Logical Reasoning', 'Coding-Decoding', 'Blood Relations',
  'Direction Sense', 'Syllogism', 'Analogy',
  // English
  'English Grammar', 'Vocabulary', 'Reading Comprehension', 'Error Spotting',
  // GK
  'Indian History', 'Indian Geography', 'General Science', 'Current Affairs', 'Indian Polity',
];

const EXAMS = [
  { name: 'UPSC', icon: '🏛️', desc: 'Civil Services' },
  { name: 'NEET', icon: '🩺', desc: 'Medical Entrance' },
  { name: 'JEE', icon: '⚙️', desc: 'Engineering Entrance' },
  { name: 'NDA', icon: '🎖️', desc: 'National Defence' },
  { name: 'SSC CGL', icon: '📋', desc: 'Staff Selection' },
  { name: 'SSC CHSL', icon: '📝', desc: 'Higher Secondary' },
  { name: 'Bank PO', icon: '🏦', desc: 'Banking' },
  { name: 'RRB', icon: '🚂', desc: 'Railways' },
];

const STEPS = [
  { step: '1', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card needed.', icon: '✍️' },
  { step: '2', title: 'Choose Your Topic', desc: 'Pick from 16+ topics across Math, Reasoning and English.', icon: '📚' },
  { step: '3', title: 'AI Generates Questions', desc: 'Gemini/Groq creates unique questions tailored to your level.', icon: '🤖' },
  { step: '4', title: 'Practice & Improve', desc: 'Get instant explanations, track weak areas, earn XP.', icon: '🚀' },
];

const STATS = [
  { value: '∞', label: 'Questions Generated', icon: '📝' },
  { value: '50+', label: 'Topics Covered', icon: '📚' },
  { value: '3', label: 'AI Providers', icon: '🤖' },
  { value: '100%', label: 'Free to Start', icon: '🎁' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#030712', color: 'white', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: scrolled ? 'rgba(3,7,18,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
            <span style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(to right, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EDUHUB</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link href="/login" style={{ padding: '8px 18px', color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
              Login
            </Link>
            <Link href="/signup" style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', textDecoration: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600' }}>
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', fontSize: '13px', color: '#a5b4fc', marginBottom: '28px', fontWeight: '500' }}>
            🚀 Better than Testbook • Powered by Google Gemini + Groq AI
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: '900', lineHeight: '1.1', margin: '0 0 24px' }}>
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Unlimited Questions.</span>
            <br />
            <span style={{ color: 'white' }}>AI Teaches Your</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Weak Areas.</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#9ca3af', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7' }}>
            India&apos;s smartest exam prep platform. AI generates infinite unique questions, finds your weak points, and teaches you exactly what you don&apos;t understand — in Hinglish.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ padding: '16px 36px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', textDecoration: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: '700', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              🚀 Start Free — Forever
            </Link>
            <Link href="/login" style={{ padding: '16px 36px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none', borderRadius: '14px', fontSize: '17px', fontWeight: '600' }}>
              Login →
            </Link>
          </div>

          <p style={{ color: '#4b5563', fontSize: '13px', marginTop: '20px' }}>No credit card • No download • Works on mobile</p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: '900', background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', margin: '0 0 16px' }}>
              Why <span style={{ background: 'linear-gradient(135deg, #818cf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EDUHUB</span> Wins
            </h2>
            <p style={{ color: '#6b7280', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>
              Not just another test app. A complete AI-powered learning engine.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '28px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = f.color + '60')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                <div style={{ width: '52px', height: '52px', background: f.color + '20', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '16px' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 10px', color: 'white' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', margin: '0 0 16px' }}>
              How It <span style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '28px', left: '60%', width: '80%', height: '2px', background: 'linear-gradient(to right, rgba(99,102,241,0.5), transparent)', display: 'none' }} />
                )}
                <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 16px', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: '12px', color: '#6366f1', fontWeight: '700', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Step {s.step}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOPICS ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', margin: '0 0 16px' }}>
              50+ Topics Covered
            </h2>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>AI generates unlimited questions for every topic</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {TOPICS.map((t) => (
              <Link key={t} href={`/signup`} style={{ padding: '10px 18px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '100px', color: '#a5b4fc', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.25)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXAMS ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', margin: '0 0 16px' }}>
              Prepare for Any Exam
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {EXAMS.map((e) => (
              <div key={e.name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{e.icon}</div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>{e.name}</div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI PROVIDERS ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', fontWeight: '800', margin: '0 0 16px' }}>
            Powered by the World&apos;s Best AI
          </h2>
          <p style={{ color: '#6b7280', fontSize: '16px', marginBottom: '40px' }}>
            Auto-selects the best available provider. Falls back automatically if one fails.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {[
              { badge: '🟢', name: 'Google Gemini', model: 'gemini-2.0-flash', desc: 'Best quality', cost: 'Free tier', color: '#10b981' },
              { badge: '⚡', name: 'Groq', model: 'LLaMA 3.3 70B', desc: 'Ultra fast', cost: 'Free tier', color: '#f59e0b' },
              { badge: '🤖', name: 'OpenAI', model: 'GPT-4o mini', desc: 'Reliable fallback', cost: 'Paid', color: '#6366f1' },
            ].map((p) => (
              <div key={p.name} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.color}30`, borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{p.badge}</div>
                <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>{p.name}</div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>{p.model}</div>
                <div style={{ fontSize: '13px', color: p.color, fontWeight: '600' }}>{p.desc}</div>
                <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>{p.cost}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: '800', margin: '0 0 16px' }}>
              EDUHUB vs Testbook
            </h2>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: 'rgba(255,255,255,0.05)', padding: '16px 24px', fontWeight: '700', fontSize: '14px' }}>
              <div>Feature</div>
              <div style={{ textAlign: 'center', color: '#818cf8' }}>EDUHUB</div>
              <div style={{ textAlign: 'center', color: '#6b7280' }}>Testbook</div>
            </div>
            {[
              ['Unlimited AI Questions', '✅ Infinite', '❌ Limited'],
              ['Personal AI Teacher', '✅ 24/7 Hinglish', '❌ No'],
              ['Weak Point Analysis', '✅ Auto AI', '⚠️ Basic'],
              ['Real-time Battle Mode', '✅ Yes', '❌ No'],
              ['Free Forever', '✅ Core free', '❌ Paid'],
              ['Multiple AI Providers', '✅ 3 providers', '❌ No AI'],
              ['Daily Challenges', '✅ Yes', '⚠️ Limited'],
              ['Achievements & XP', '✅ Full system', '⚠️ Basic'],
            ].map(([feature, eduhub, testbook], i) => (
              <div key={feature} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', fontSize: '14px' }}>
                <div style={{ color: '#d1d5db' }}>{feature}</div>
                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: '600' }}>{eduhub}</div>
                <div style={{ textAlign: 'center', color: '#6b7280' }}>{testbook}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 24px 100px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.2))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '28px', padding: '60px 40px' }}>
            <div style={{ fontSize: '56px', marginBottom: '20px' }}>🚀</div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '900', margin: '0 0 16px' }}>
              Ready to Top Your Exam?
            </h2>
            <p style={{ color: '#9ca3af', fontSize: '17px', marginBottom: '36px', lineHeight: '1.6' }}>
              Join students already using EDUHUB to crack SSC, Bank PO, UPSC and more.
              Start free — no credit card needed.
            </p>
            <Link href="/signup" style={{ display: 'inline-block', padding: '18px 48px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', color: 'white', textDecoration: 'none', borderRadius: '14px', fontSize: '18px', fontWeight: '800', boxShadow: '0 0 50px rgba(99,102,241,0.5)' }}>
              ⚡ Start Now — It&apos;s Free
            </Link>
            <p style={{ color: '#4b5563', fontSize: '13px', marginTop: '16px' }}>
              Takes 30 seconds to sign up
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #22d3ee)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div>
            <span style={{ fontWeight: '700', fontSize: '16px' }}>EDUHUB</span>
          </div>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Login</Link>
            <Link href="/signup" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>Sign Up</Link>
            <Link href="/ai-setup" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '14px' }}>AI Setup</Link>
          </div>
          <p style={{ color: '#374151', fontSize: '13px', margin: 0 }}>
            © 2025 EDUHUB. Made with ❤️ for Indian students.
          </p>
        </div>
      </footer>

    </div>
  );
}
