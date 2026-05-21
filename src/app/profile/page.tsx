'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { calculateLevel } from '@/lib/utils';

const EXAM_TARGETS = ['SSC', 'Bank PO', 'UPSC', 'NEET', 'JEE', 'CAT', 'GATE', 'Other'];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [examTarget, setExamTarget] = useState('SSC');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setProfile(data);
      setName(data.name || '');
      setBio(data.bio || '');
      setExamTarget(data.exam_target || 'SSC');
    }
    setLoading(false);
  };

  const save = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('profiles').update({ name, bio, exam_target: examTarget }).eq('id', user.id);
    if (error) toast.error('Failed to save');
    else toast.success('Profile updated! ✅');
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const levelInfo = calculateLevel(profile?.xp || 0);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        {/* Avatar & Stats */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-4xl font-bold mx-auto mb-4">
            {profile?.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="text-xl font-bold">{profile?.name}</div>
          <div className="text-gray-400 text-sm">{profile?.email}</div>
          {profile?.is_premium && (
            <div className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full text-sm">
              👑 PREMIUM
            </div>
          )}

          <div className="grid grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Level', value: levelInfo.level, icon: '⚡' },
              { label: 'XP', value: profile?.xp || 0, icon: '🌟' },
              { label: 'Streak', value: profile?.streak || 0, icon: '🔥' },
              { label: 'Tests', value: profile?.total_tests || 0, icon: '📝' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-800/50 rounded-xl p-3">
                <div className="text-2xl">{s.icon}</div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Display Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 text-white resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-2">Exam Target</label>
            <div className="grid grid-cols-4 gap-2">
              {EXAM_TARGETS.map((e) => (
                <button
                  key={e}
                  onClick={() => setExamTarget(e)}
                  className={`py-2 rounded-xl border text-sm transition-all ${
                    examTarget === e ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-gray-700 text-gray-400'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 mt-6">
          <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-4">These actions cannot be undone.</p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/');
            }}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm hover:bg-red-500/30 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
