import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabaseAdmin } from '@/lib/supabase';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const PLANS: Record<string, { amount: number; days: number; name: string }> = {
  monthly: { amount: 9900, days: 30, name: 'Monthly Premium' },
  yearly: { amount: 79900, days: 365, name: 'Yearly Premium' },
  lifetime: { amount: 299900, days: 36500, name: 'Lifetime Premium' },
};

export async function POST(req: NextRequest) {
  try {
    const { userId, plan } = await req.json();
    const planData = PLANS[plan];
    if (!planData) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const order = await razorpay.orders.create({
      amount: planData.amount,
      currency: 'INR',
      receipt: `r_${Date.now()}`,
    });

    await supabaseAdmin.from('payments').insert({
      user_id: userId,
      razorpay_order_id: order.id,
      amount: planData.amount,
      plan,
      duration_days: planData.days,
      status: 'pending',
    });

    return NextResponse.json({ orderId: order.id, amount: planData.amount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
