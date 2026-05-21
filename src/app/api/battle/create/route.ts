import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestions } from '@/lib/ai-providers';

export async function POST(req: NextRequest) {
  try {
    const { userId, topic, difficulty } = await req.json();

    // Find a waiting battle to join
    const { data: waiting } = await supabaseAdmin
      .from('battles')
      .select('*')
      .eq('status', 'waiting')
      .eq('topic', topic)
      .eq('difficulty', difficulty)
      .neq('player1_id', userId)
      .limit(1)
      .single();

    if (waiting) {
      await supabaseAdmin.from('battles').update({
        player2_id: userId,
        status: 'active',
        started_at: new Date().toISOString(),
      }).eq('id', waiting.id);

      // Notify via Pusher if configured
      try {
        const { getPusherServer } = await import('@/lib/pusher');
        const pusher = getPusherServer();
        if (pusher) {
          await pusher.trigger(`battle-${waiting.id}`, 'opponent-joined', { player2Id: userId });
        }
      } catch { /* Pusher optional */ }

      return NextResponse.json({ battleId: waiting.id, isJoin: true });
    }

    // Generate 5 questions using multi-provider AI
    const { questions } = await generateQuestions(topic, 5, difficulty);

    const { data: battle } = await supabaseAdmin.from('battles').insert({
      player1_id: userId,
      topic,
      difficulty,
      questions,
      status: 'waiting',
    }).select().single();

    return NextResponse.json({ battleId: battle?.id, isJoin: false });
  } catch (error: any) {
    console.error('Battle create error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
