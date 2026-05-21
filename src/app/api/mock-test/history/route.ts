import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId');
    const exam = req.nextUrl.searchParams.get('exam');
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    let query = supabaseAdmin
      .from('mock_tests')
      .select('id, exam, title, total_questions, score, max_score, accuracy, time_taken, status, completed_at, xp_earned, section_scores, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (exam) query = query.eq('exam', exam);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, tests: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
