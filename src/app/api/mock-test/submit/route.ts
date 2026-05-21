import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { mockTestId, userId, answers, timeTaken } = await req.json();

    const { data: mockTest } = await supabaseAdmin
      .from('mock_tests')
      .select('*')
      .eq('id', mockTestId)
      .eq('user_id', userId)
      .single();

    if (!mockTest) return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });

    const questions = mockTest.questions as any[];

    // Calculate scores
    let totalScore = 0;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const sectionScores: Record<string, { score: number; correct: number; total: number; maxScore: number }> = {};

    questions.forEach((q: any, i: number) => {
      const userAnswer = answers[i];
      const section = q.section || 'General';

      if (!sectionScores[section]) {
        sectionScores[section] = { score: 0, correct: 0, total: 0, maxScore: 0 };
      }
      sectionScores[section].total++;
      sectionScores[section].maxScore += q.marks || 1;

      if (!userAnswer || userAnswer === '') {
        skipped++;
      } else if (userAnswer === q.correctAnswer) {
        correct++;
        totalScore += q.marks || 1;
        sectionScores[section].score += q.marks || 1;
        sectionScores[section].correct++;
      } else {
        wrong++;
        totalScore -= q.negativeMarks || 0;
        sectionScores[section].score -= q.negativeMarks || 0;
      }
    });

    const accuracy = questions.length > 0 ? (correct / questions.length) * 100 : 0;
    const xpEarned = Math.max(0, Math.round(totalScore * 2));

    // Update mock test
    await supabaseAdmin
      .from('mock_tests')
      .update({
        answers,
        score: Math.max(0, totalScore),
        accuracy,
        time_taken: timeTaken,
        status: 'completed',
        completed_at: new Date().toISOString(),
        xp_earned: xpEarned,
        section_scores: sectionScores,
      })
      .eq('id', mockTestId);

    // Award XP
    await supabaseAdmin.rpc('increment_user_xp', {
      p_user_id: userId,
      p_xp: xpEarned,
      p_coins: Math.round(xpEarned / 10),
    });

    // Update profile test count
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('total_tests, total_questions, total_correct')
      .eq('id', userId)
      .single();

    await supabaseAdmin.from('profiles').update({
      total_tests: (profile?.total_tests || 0) + 1,
      total_questions: (profile?.total_questions || 0) + questions.length,
      total_correct: (profile?.total_correct || 0) + correct,
    }).eq('id', userId);

    return NextResponse.json({
      success: true,
      score: Math.max(0, totalScore),
      maxScore: mockTest.max_score,
      correct,
      wrong,
      skipped,
      accuracy,
      xpEarned,
      sectionScores,
    });
  } catch (error: any) {
    console.error('Mock test submit error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
