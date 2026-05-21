'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Users, BookOpen, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Simple admin check — in production, use a proper role system
const ADMIN_EMAILS = ['admin@eduhub.com'];

export default function AdminPanel() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
      router.push('/dashboard');
      return;
    }
    setAuthorized(true);

    const [
      { count: totalUsers },
      { count: totalTests },
      { data: topUsers },
      { data: recent },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('test_results').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('id, name, email, xp, total_tests, is_premium, created_at').order('xp', { ascending: false }).limit(20),
      supabase.from('test_results').select('*, profiles(name)').order('created_at', { ascending: false }).limit(10),
    ]);

    setStats({ totalUsers, totalTests });
    setUsers(topUsers || []);
    setRecentTests(recent || []);
    setLoading(false);
  };

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const topicData = recentTests.reduce((acc: any, t) => {
    acc[t.topic] = (acc[t.topic] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(topicData).map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">🛡️ Admin Panel</h1>
          <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm">
            Back to App
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Users size={24} />, label: 'Total Users', value: stats?.totalUsers || 0, color: 'text-indigo-400' },
            { icon: <BookOpen size={24} />, label: 'Total Tests', value: stats?.totalTests || 0, color: 'text-cyan-400' },
            { icon: <TrendingUp size={24} />, label: 'Premium Users', value: users.filter(u => u.is_premium).length, color: 'text-yellow-400' },
            { icon: <DollarSign size={24} />, label: 'Revenue (est)', value: `₹${users.filter(u => u.is_premium).length * 99}`, color: 'text-emerald-400' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Topic Chart */}
        {chartData.length > 0 && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">📊 Popular Topics (Recent)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xl font-bold">👥 Top Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">XP</th>
                  <th className="text-left p-4">Tests</th>
                  <th className="text-left p-4">Premium</th>
                  <th className="text-left p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="p-4 font-medium">{u.name}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4 text-yellow-400 font-bold">{u.xp}</td>
                    <td className="p-4">{u.total_tests}</td>
                    <td className="p-4">
                      {u.is_premium ? (
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold">👑 YES</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-xl font-bold">📝 Recent Tests</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {recentTests.map((t) => (
              <div key={t.id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{(t.profiles as any)?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-400">{t.topic} • {t.difficulty}</div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className={t.accuracy >= 70 ? 'text-emerald-400' : 'text-yellow-400'}>{t.accuracy.toFixed(0)}%</span>
                  <span className="text-gray-400">{new Date(t.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
