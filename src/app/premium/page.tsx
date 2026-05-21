'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const PLANS = [
  { id: 'monthly', name: 'Monthly', price: 99, period: '/month', save: '' },
  { id: 'yearly', name: 'Yearly', price: 799, period: '/year', save: 'SAVE 33%', popular: true },
  { id: 'lifetime', name: 'Lifetime', price: 2999, period: 'one-time', save: 'BEST VALUE' },
];

const FEATURES = [
  'Unlimited AI questions',
  'Personal AI Teacher 24/7',
  'Battle Mode (no limits)',
  'Detailed analytics',
  'No ads, ever',
  'Priority support',
  'Early access to new features',
  'Custom study plans',
];

export default function Premium() {
  const router = useRouter();
  const [selected, setSelected] = useState('yearly');
  const [loading, setLoading] = useState(false);

  const buy = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan: selected }),
      });
      const { orderId, amount } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'EDUHUB',
        description: 'Premium Subscription',
        order_id: orderId,
        handler: async (resp: any) => {
          const verify = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...resp, userId: user.id }),
          });
          const data = await verify.json();
          if (data.success) {
            toast.success('🎉 Welcome to Premium!');
            router.push('/dashboard');
          } else {
            toast.error('Payment verification failed');
          }
        },
        theme: { color: '#6366f1' },
      };

      // @ts-ignore
      new window.Razorpay(options).open();
    } catch {
      toast.error('Payment failed. Try again.');
    }
    setLoading(false);
  };

  const selectedPlan = PLANS.find(p => p.id === selected);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> Back
          </Link>

          <div className="text-center mb-10">
            <div className="text-6xl mb-4">👑</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-3">
              Go Premium
            </h1>
            <p className="text-gray-400 text-lg">Unlock the full power of AI learning</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {PLANS.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`p-6 rounded-2xl border-2 text-left transition-all relative ${
                  selected === p.id
                    ? 'border-yellow-500 bg-gradient-to-br from-yellow-500/10 to-orange-500/10'
                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-500 text-black text-xs font-black rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-2xl font-bold mb-2">{p.name}</div>
                <div className="text-4xl font-black mb-1">₹{p.price}</div>
                <div className="text-sm text-gray-400 mb-3">{p.period}</div>
                {p.save && (
                  <div className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">
                    {p.save}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">✨ Premium includes:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="text-emerald-400 flex-shrink-0" size={18} />
                  <span className="text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={buy}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black text-xl rounded-2xl disabled:opacity-50 transition-all"
          >
            {loading ? 'Processing...' : `Get Premium — ₹${selectedPlan?.price}`}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </div>
    </>
  );
}
