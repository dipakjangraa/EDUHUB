import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { battleId, userId, questionIdx, answer, timeTaken } = await req.json();

    const { data: battle } = await supabaseAdmin
      .from('battles').select('*').eq('id', battleId).single();
    if (!battle) return NextResponse.json({ error: 'Battle not found' }, { status: 404 });

    const isPlayer1 = battle.player1_id === userId;
    const correct = battle.questions[questionIdx]?.correctAnswer === answer;
    const points = correct ? Math.max(10, 50 - timeTaken) : 0;

    const updates: any = {};
    if (isPlayer1) {
      updates.player1_answers = [...(battle.player1_answers || []), { answer, correct, time: timeTaken }];
      updates.player1_score = (battle.player1_score || 0) + points;
    } else {
      updates.player2_answers = [...(battle.player2_answers || []), { answer, correct, time: timeTaken }];
      updates.player2_score = (battle.player2_score || 0) + points;
    }

    await supabaseAdmin.from('battles').update(updates).eq('id', battleId);

    // Notify score update via Pusher if configured
    try {
      const { getPusherServer } = await import('@/lib/pusher');
      const pusher = getPusherServer();
      if (pusher) {
        await pusher.trigger(`battle-${battleId}`, 'score-update', {
          player1Score: isPlayer1 ? updates.player1_score : battle.player1_score,
          player2Score: !isPlayer1 ? updates.player2_score : battle.player2_score,
        });
      }
    } catch { /* Pusher optional */ }

    // Check if both players finished
    const p1Answers = isPlayer1 ? updates.player1_answers : (battle.player1_answers || []);
    const p2Answers = !isPlayer1 ? updates.player2_answers : (battle.player2_answers || []);
    const totalQ = battle.questions.length;

    if (p1Answers.length >= totalQ && p2Answers.length >= totalQ) {
      const p1Score = isPlayer1 ? updates.player1_score : battle.player1_score;
      const p2Score = !isPlayer1 ? updates.player2_score : battle.player2_score;
      const winnerId = p1Score >= p2Score ? battle.player1_id : battle.player2_id;

      await supabaseAdmin.from('battles').update({
        winner_id: winnerId,
        status: 'completed',
        ended_at: new Date().toISOString(),
      }).eq('id', battleId);

      await supabaseAdmin.rpc('increment_user_xp', {
        p_user_id: winnerId, p_xp: 100, p_coins: 25,
      });

      try {
        const { getPusherServer } = await import('@/lib/pusher');
        const pusher = getPusherServer();
        if (pusher) {
          await pusher.trigger(`battle-${battleId}`, 'battle-ended', { winnerId, p1Score, p2Score });
        }
      } catch { /* Pusher optional */ }
    }

    return NextResponse.json({ success: true, points });
  } catch (error: any) {
    console.error('Battle answer error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
