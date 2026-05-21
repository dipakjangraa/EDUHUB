import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateQuestions } from '@/lib/ai-providers';
import { ALL_MOCK_TESTS } from '@/lib/mock-test-config';

export async function POST(req: NextRequest) {
  try {
    const { userId, mockTestId, exam } = await req.json();

    const examMocks = ALL_MOCK_TESTS[exam];
    const config = examMocks?.find(m => m.id === mockTestId);
    if (!config) {
      return NextResponse.json({ error: 'Mock test config not found' }, { status: 404 });
    }

    // Generate questions for each section in parallel
    const sectionResults = await Promise.all(
      config.sections.map(async (section) => {
        const topicForGeneration = section.topics[Math.floor(Math.random() * section.topics.length)];
        const { questions } = await generateQuestions(
          topicForGeneration,
          section.questionCount,
          config.difficulty,
          [],
        );
        return {
          subject: section.subject,
          icon: section.icon,
          marksPerQuestion: section.marksPerQuestion,
          negativeMarking: section.negativeMarking,
          questions: questions.map((q, i) => ({
            ...q,
            id: `${section.subject}-${i}-${Date.now()}`,
            section: section.subject,
            marks: section.marksPerQuestion,
            negativeMarks: section.negativeMarking,
          })),
        };
      })
    );

    // Flatten all questions
    const allQuestions = sectionResults.flatMap(s => s.questions);

    // Create mock test record
    const { data: mockTest, error } = await supabaseAdmin
      .from('mock_tests')
      .insert({
        user_id: userId,
        exam,
        title: config.title,
        subjects: config.sections.map(s => s.subject),
        total_questions: allQuestions.length,
        duration_minutes: config.durationMinutes,
        questions: allQuestions,
        max_score: config.totalMarks,
        status: 'pending',
        section_scores: {},
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      mockTestId: mockTest.id,
      totalQuestions: allQuestions.length,
      durationMinutes: config.durationMinutes,
    });
  } catch (error: any) {
    console.error('Mock test create error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
