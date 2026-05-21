import { NextResponse } from 'next/server';

export async function GET() {
  const providers = {
    gemini: {
      configured: !!process.env.GEMINI_API_KEY,
      model: 'gemini-2.0-flash',
      label: 'Google Gemini',
      badge: '🟢',
      description: 'Best quality, free tier available',
      speed: 'Fast',
      cost: 'Free (1M tokens/day)',
      getKeyUrl: 'https://aistudio.google.com/app/apikey',
    },
    groq: {
      configured: !!process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      label: 'Groq (LLaMA 3.3 70B)',
      badge: '⚡',
      description: 'Ultra-fast inference, free tier',
      speed: 'Ultra Fast',
      cost: 'Free (generous limits)',
      getKeyUrl: 'https://console.groq.com/keys',
    },
    openai: {
      configured: !!process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini',
      label: 'OpenAI GPT-4o mini',
      badge: '🤖',
      description: 'Reliable fallback',
      speed: 'Medium',
      cost: 'Paid (~$0.001/question)',
      getKeyUrl: 'https://platform.openai.com/api-keys',
    },
  };

  const active = Object.entries(providers)
    .filter(([, v]) => v.configured)
    .map(([k]) => k);

  return NextResponse.json({
    providers,
    active,
    primary: active[0] || null,
    ready: active.length > 0,
  });
}
