import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkAndUnlockAchievements } from '@/lib/achievements';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, topic, difficulty, questions, answers, totalTime } = body;

    const correct = answers.filter((a: any) => a.correct).length;
    const accuracy = (correct / questions.length) * 100;
    const xpMultiplier = difficulty === 'hard' ? 2 : difficulty === 'medium' ? 1.5 : 1;
    const xpEarned = Math.round(correct * 10 * xpMultiplier);
    const coinsEarned = Math.round(xpEarned / 10);

    // Find weak concepts
    const conceptStats: Record<string, { c: number; t: number }> = {};
    answers.forEach((a: any, i: number) => {
      const concept = questions[i].concept || questions[i].topic;
      if (!conceptStats[concept]) conceptStats[concept] = { c: 0, t: 0 };
      conceptStats[concept].t++;
      if (a.correct) conceptStats[concept].c++;
    });
    
    const weakConcepts = Object.entries(conceptStats)
      .filter(([_, s]) => s.c / s.t < 0.6)
      .map(([c]) => c);
    
    const strongConcepts = Object.entries(conceptStats)
      .filter(([_, s]) => s.c / s.t >= 0.8)
      .map(([c]) => c);

    // Save result
    const { data: result } = await supabaseAdmin.from('test_results').insert({
      user_id: userId,
      topic,
      difficulty,
      total_questions: questions.length,
      correct,
      accuracy,
      time_taken: totalTime,
      xp_earned: xpEarned,
      coins_earned: coinsEarned,
      questions_data: questions.map((q: any, i: number) => ({
        ...q,
        userAnswer: answers[i].answer,
        isCorrect: answers[i].correct,
        timeTaken: answers[i].time,
      })),
    }).select().single();

    // Update profile
    await supabaseAdmin.rpc('increment_user_xp', {
      p_user_id: userId,
      p_xp: xpEarned,
      p_coins: coinsEarned,
    });

    // Update counters
    const { data: currentProfile } = await supabaseAdmin
      .from('profiles')
      .select('total_tests, total_questions, total_correct')
      .eq('id', userId)
      .single();

    await supabaseAdmin
      .from('profiles')
      .update({
        total_tests: (currentProfile?.total_tests || 0) + 1,
        total_questions: (currentProfile?.total_questions || 0) + questions.length,
        total_correct: (currentProfile?.total_correct || 0) + correct,
      })
      .eq('id', userId);

    // Update topic performance
    const { data: existing } = await supabaseAdmin
      .from('topic_performance')
      .select('*')
      .eq('user_id', userId)
      .eq('topic', topic)
      .single();

    if (existing) {
      const newTotal = existing.total_attempted + questions.length;
      const newCorrect = existing.total_correct + correct;
      await supabaseAdmin.from('topic_performance').update({
        total_attempted: newTotal,
        total_correct: newCorrect,
        accuracy: (newCorrect / newTotal) * 100,
        weak_concepts: weakConcepts,
        strong_concepts: strongConcepts,
        last_practiced: new Date().toISOString(),
      }).eq('id', existing.id);
    } else {
      await supabaseAdmin.from('topic_performance').insert({
        user_id: userId,
        topic,
        total_attempted: questions.length,
        total_correct: correct,
        accuracy,
        weak_concepts: weakConcepts,
        strong_concepts: strongConcepts,
      });
    }

    // Check achievements
    const newAchievements = await checkAndUnlockAchievements(userId);

    return NextResponse.json({
      success: true,
      result,
      xpEarned,
      coinsEarned,
      weakConcepts,
      strongConcepts,
      newAchievements,
    });
  } catch (error: any) {
    console.error('Submit test error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
