import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await req.json();

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });

    await supabaseAdmin.from('payments').update({
      razorpay_payment_id,
      status: 'completed',
    }).eq('id', payment.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + payment.duration_days);

    await supabaseAdmin.from('profiles').update({
      is_premium: true,
      premium_expires_at: expiresAt.toISOString(),
    }).eq('id', userId);

    await supabaseAdmin.from('notifications').insert({
      user_id: userId,
      type: 'premium',
      title: '🎉 Welcome to Premium!',
      message: 'Enjoy unlimited AI features. Thank you for your support!',
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
