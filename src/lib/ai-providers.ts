/**
 * Multi-LLM Provider System
 * Supports: Google Gemini (primary), Groq (fast/free), OpenAI (fallback)
 * Auto-selects best available provider based on configured API keys
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';

export type AIProvider = 'gemini' | 'groq' | 'openai';

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  concept: string;
  steps?: string[];
}

// ─── Build the shared prompt ────────────────────────────────────────────────

export function buildQuestionPrompt(
  topic: string,
  count: number,
  difficulty: string,
  weakConcepts: string[] = [],
  language: 'english' | 'hinglish' = 'english'
): string {
  return `You are an expert question generator for Indian competitive exams (SSC CGL, Bank PO, UPSC, NEET, JEE).

Generate exactly ${count} unique multiple-choice questions.

Topic: ${topic}
Difficulty: ${difficulty}
${weakConcepts.length > 0 ? `Focus on these weak concepts: ${weakConcepts.join(', ')}` : ''}
${language === 'hinglish' ? 'Use simple Hinglish (mix of Hindi + English) in explanations.' : ''}

STRICT RULES:
1. Each question must have EXACTLY 4 options (A, B, C, D)
2. correctAnswer must be the EXACT text of the correct option (not A/B/C/D)
3. explanation must be step-by-step (use \\n for line breaks)
4. concept must be a specific subtopic name (e.g. "Successive Percentage", "Time-Speed formula")
5. Use Indian context: ₹ for money, km for distance, Indian names
6. Questions must be UNIQUE — no repetition
7. Mix question types: numerical, conceptual, application-based
8. Difficulty guide:
   - easy: direct formula application, single step
   - medium: 2-3 steps, some reasoning
   - hard: multi-step, tricky options, real exam level

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "questions": [
    {
      "question": "full question text here",
      "options": ["option text 1", "option text 2", "option text 3", "option text 4"],
      "correctAnswer": "exact text of correct option",
      "explanation": "Step 1: ...\\nStep 2: ...\\nAnswer: ...",
      "concept": "specific subtopic",
      "steps": ["step 1", "step 2", "step 3"]
    }
  ]
}`;
}

// ─── Parse and validate AI response ─────────────────────────────────────────

export function parseQuestions(
  raw: string,
  topic: string,
  difficulty: string
): GeneratedQuestion[] {
  try {
    // Strip markdown code fences if present
    let cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    // Try direct parse first
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try extracting JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      parsed = JSON.parse(jsonMatch[0]);
    }

    const questions: GeneratedQuestion[] = parsed.questions || [];

    // Validate each question
    return questions
      .filter((q) => {
        return (
          q.question &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          q.correctAnswer &&
          q.options.includes(q.correctAnswer)
        );
      })
      .map((q) => ({
        question: q.question.trim(),
        options: q.options.map((o: string) => o.trim()),
        correctAnswer: q.correctAnswer.trim(),
        explanation: q.explanation || 'See the steps above.',
        concept: q.concept || topic,
        steps: q.steps || [],
      }));
  } catch (err) {
    console.error('Failed to parse AI response:', err);
    console.error('Raw response was:', raw?.substring(0, 200));
    return [];
  }
}

// ─── GEMINI Provider ─────────────────────────────────────────────────────────

export async function generateWithGemini(
  prompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.9,
      topP: 0.95,
      maxOutputTokens: 8192,
      // No responseMimeType — works with all API key tiers
    },
  });

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

// ─── GROQ Provider ───────────────────────────────────────────────────────────

export async function generateWithGroq(
  prompt: string,
  model = 'llama-3.3-70b-versatile'
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not set');

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert exam question generator. Always respond with valid JSON only. No markdown, no extra text.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.9,
    max_tokens: 8192,
    response_format: { type: 'json_object' },
  });

  return completion.choices[0].message.content || '{}';
}

// ─── OPENAI Provider ─────────────────────────────────────────────────────────

export async function generateWithOpenAI(
  prompt: string,
  model = 'gpt-4o-mini'
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are an expert exam question generator. Always respond with valid JSON only.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.9,
    max_tokens: 8192,
    response_format: { type: 'json_object' },
  });

  return completion.choices[0].message.content || '{}';
}

// ─── AUTO-SELECT + FALLBACK CHAIN ────────────────────────────────────────────

export async function generateQuestions(
  topic: string,
  count: number,
  difficulty: string,
  weakConcepts: string[] = [],
  preferredProvider?: AIProvider
): Promise<{ questions: GeneratedQuestion[]; provider: AIProvider }> {
  const prompt = buildQuestionPrompt(topic, count, difficulty, weakConcepts);

  // Determine provider order
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  // Build priority chain based on what's configured
  let chain: AIProvider[];

  if (preferredProvider) {
    // User explicitly chose a provider — try it first, then fallback
    const others: AIProvider[] = (['gemini', 'groq', 'openai'] as AIProvider[]).filter(
      (p) => p !== preferredProvider
    );
    chain = [preferredProvider, ...others];
  } else {
    // Auto: Gemini first (best quality + free), then Groq (fastest), then OpenAI
    chain = [];
    if (hasGemini) chain.push('gemini');
    if (hasGroq) chain.push('groq');
    if (hasOpenAI) chain.push('openai');
    if (chain.length === 0) throw new Error('No AI provider configured. Add GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY to .env.local');
  }

  let lastError: Error | null = null;

  for (const provider of chain) {
    try {
      let raw = '';

      if (provider === 'gemini' && hasGemini) {
        raw = await generateWithGemini(prompt);
      } else if (provider === 'groq' && hasGroq) {
        raw = await generateWithGroq(prompt);
      } else if (provider === 'openai' && hasOpenAI) {
        raw = await generateWithOpenAI(prompt);
      } else {
        continue; // skip if key not available
      }

      const questions = parseQuestions(raw, topic, difficulty);

      if (questions.length > 0) {
        console.log(`✅ Generated ${questions.length} questions via ${provider}`);
        return { questions, provider };
      }

      console.warn(`⚠️ ${provider} returned 0 valid questions. Raw (first 300 chars):`, raw?.substring(0, 300));
      throw new Error(`${provider} returned 0 valid questions`);
    } catch (err: any) {
      lastError = err;
      console.warn(`⚠️ ${provider} failed: ${err.message}. Trying next provider...`);
    }
  }

  throw lastError || new Error('All AI providers failed');
}

// ─── AI TEACHER (multi-provider) ─────────────────────────────────────────────

export async function askAITeacher(
  question: string,
  weakConcepts: string[],
  history: Array<{ role: string; content: string }>,
  preferredProvider?: AIProvider
): Promise<{ answer: string; provider: AIProvider }> {
  const systemPrompt = `You are a friendly, patient AI teacher for Indian competitive exam students.
Your style:
- Warm and encouraging
- Use simple Hinglish when helpful (mix of Hindi + English)
- Give real-life Indian examples (cricket, chai, market)
- Use emojis to make it engaging
- Keep answers under 200 words
- End with a quick check question to test understanding
${weakConcepts.length ? `Student's weak areas: ${weakConcepts.join(', ')}. Focus on these!` : ''}`;

  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  const chain: AIProvider[] = preferredProvider
    ? [preferredProvider, ...(['gemini', 'groq', 'openai'] as AIProvider[]).filter((p) => p !== preferredProvider)]
    : [...(hasGemini ? ['gemini' as AIProvider] : []), ...(hasGroq ? ['groq' as AIProvider] : []), ...(hasOpenAI ? ['openai' as AIProvider] : [])];

  for (const provider of chain) {
    try {
      let answer = '';

      if (provider === 'gemini' && hasGemini) {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
          systemInstruction: systemPrompt,
        });
        const chat = model.startChat({
          history: history.slice(-6).map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        });
        const result = await chat.sendMessage(question);
        answer = result.response.text();
      } else if (provider === 'groq' && hasGroq) {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-6).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
            { role: 'user', content: question },
          ],
          temperature: 0.7,
          max_tokens: 512,
        });
        answer = completion.choices[0].message.content || '';
      } else if (provider === 'openai' && hasOpenAI) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.slice(-6).map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
            { role: 'user', content: question },
          ],
          temperature: 0.7,
          max_tokens: 512,
        });
        answer = completion.choices[0].message.content || '';
      } else {
        continue;
      }

      if (answer) return { answer, provider };
    } catch (err: any) {
      console.warn(`AI Teacher ${provider} failed: ${err.message}`);
    }
  }

  return { answer: '😅 Sorry yaar, connection issue. Try again!', provider: 'gemini' };
}
