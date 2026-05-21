'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Bell } from 'lucide-react';
import { getTimeAgo } from '@/lib/utils';

export default function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    setNotifications(data || []);

    // Mark all as read
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);

    setLoading(false);
  };

  const typeIcon: Record<string, string> = {
    achievement: '🏆',
    premium: '👑',
    battle: '⚔️',
    streak: '🔥',
    system: '📢',
  };

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={20} /> Back
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Bell size={28} className="text-indigo-400" />
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-400">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-2">Complete tests and unlock achievements to get notified!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition-all ${
                  n.is_read ? 'border-gray-800 bg-gray-900/30' : 'border-indigo-500/30 bg-indigo-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{typeIcon[n.type] || '📢'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{n.title}</div>
                    <div className="text-gray-400 text-sm mt-1">{n.message}</div>
                    <div className="text-gray-600 text-xs mt-2">{getTimeAgo(n.created_at)}</div>
                  </div>
                  {!n.is_read && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
