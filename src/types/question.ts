export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  steps?: string[];
  topic: string;
  subtopic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type?: 'template' | 'ai';
  concept?: string;
}

export interface TestConfig {
  subject: string;
  topic: string;
  numberOfQuestions: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  timePerQuestion: number;
  mode: 'practice' | 'test' | 'battle';
}

export interface TestResult {
  totalQuestions: number;
  correct: number;
  wrong: number;
  skipped: number;
  accuracy: number;
  timeTaken: number;
  avgTimePerQuestion: number;
  xpEarned: number;
  coinsEarned: number;
  questionResults: QuestionResultItem[];
  weakAreas: string[];
}

export interface QuestionResultItem {
  question: Question;
  userAnswer: string | null;
  isCorrect: boolean;
  timeTaken: number;
}
