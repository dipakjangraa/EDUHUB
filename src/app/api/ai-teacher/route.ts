import { NextRequest, NextResponse } from 'next/server';
import { askAITeacher, AIProvider } from '@/lib/ai-providers';

export async function POST(req: NextRequest) {
  try {
    const {
      question,
      weakConcepts = [],
      history = [],
      provider,
    } = await req.json();

    const { answer, provider: usedProvider } = await askAITeacher(
      question,
      weakConcepts,
      history,
      provider as AIProvider | undefined
    );

    return NextResponse.json({ answer, provider: usedProvider });
  } catch (error: any) {
    console.error('AI teacher error:', error.message);
    return NextResponse.json({
      answer: '😅 Sorry yaar, kuch problem aa gayi. Try again!',
      provider: null,
    });
  }
}
