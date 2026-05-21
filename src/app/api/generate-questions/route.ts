import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions, AIProvider } from '@/lib/ai-providers';

export async function POST(req: NextRequest) {
  try {
    const {
      topic,
      count = 10,
      difficulty = 'medium',
      weakConcepts = [],
      provider,          // optional: 'gemini' | 'groq' | 'openai'
    } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const { questions, provider: usedProvider } = await generateQuestions(
      topic,
      count,
      difficulty,
      weakConcepts,
      provider as AIProvider | undefined
    );

    // Attach id, topic, difficulty to each question
    const enriched = questions.map((q, i) => ({
      ...q,
      id: `q_${Date.now()}_${i}`,
      topic,
      difficulty,
    }));

    return NextResponse.json({
      success: true,
      questions: enriched,
      count: enriched.length,
      provider: usedProvider,
    });
  } catch (error: any) {
    console.error('Question generation error:', error.message);
    return NextResponse.json(
      {
        error: error.message,
        hint: 'Make sure at least one of GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY is set in .env.local',
      },
      { status: 500 }
    );
  }
}

// GET — check which providers are configured
export async function GET() {
  const providers = {
    gemini: !!process.env.GEMINI_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    openai: !!process.env.OPENAI_API_KEY,
  };

  const active = Object.entries(providers)
    .filter(([, v]) => v)
    .map(([k]) => k);

  return NextResponse.json({
    configured: providers,
    active,
    primary: active[0] || null,
    status: active.length > 0 ? 'ready' : 'no_providers_configured',
  });
}
