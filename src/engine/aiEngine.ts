// AI-powered question generator using OpenAI
// Fallback to template engine if AI fails

import { Question } from '@/types/question';
import { generateTemplateQuestions } from './templateEngine';

export const generateAIQuestions = async (
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): Promise<Question[]> => {
  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, count })
    });
    
    if (!response.ok) {
      throw new Error('AI generation failed');
    }
    
    const data = await response.json();
    return data.questions;
  } catch (error) {
    console.error('AI generation failed, using templates:', error);
    // Fallback to template engine
    return generateTemplateQuestions(topic, difficulty, count);
  }
};
