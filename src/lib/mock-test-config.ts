/**
 * Mock Test Configuration
 * Real exam patterns for UPSC, NEET, JEE, NDA, SSC
 */

export interface MockTestSection {
  subject: string;
  icon: string;
  topics: string[];
  questionCount: number;
  marksPerQuestion: number;
  negativeMarking: number; // marks deducted per wrong answer
}

export interface MockTestConfig {
  id: string;
  exam: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  sections: MockTestSection[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// ─── UPSC MOCK TESTS ─────────────────────────────────────────────────────────
export const UPSC_MOCKS: MockTestConfig[] = [
  {
    id: 'upsc-prelims-gs1',
    exam: 'upsc',
    title: 'UPSC Prelims GS Paper I',
    icon: '🏛️',
    color: '#f59e0b',
    description: 'General Studies Paper I — 100 questions, 2 hours',
    durationMinutes: 120,
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'hard',
    tags: ['prelims', 'gs1', 'full-length'],
    sections: [
      { subject: 'Indian History', icon: '🏺', topics: ['Indian History'], questionCount: 15, marksPerQuestion: 2, negativeMarking: 0.66 },
      { subject: 'Indian Geography', icon: '🗺️', topics: ['Indian Geography'], questionCount: 15, marksPerQuestion: 2, negativeMarking: 0.66 },
      { subject: 'Indian Polity', icon: '⚖️', topics: ['Indian Polity'], questionCount: 15, marksPerQuestion: 2, negativeMarking: 0.66 },
      { subject: 'Indian Economy', icon: '💹', topics: ['Indian Economy'], questionCount: 15, marksPerQuestion: 2, negativeMarking: 0.66 },
      { subject: 'General Science', icon: '🔬', topics: ['General Science'], questionCount: 15, marksPerQuestion: 2, negativeMarking: 0.66 },
      { subject: 'Current Affairs', icon: '📰', topics: ['Current Affairs'], questionCount: 15, marksPerQuestion: 2, negativeMarking: 0.66 },
      { subject: 'Quantitative Aptitude', icon: '🔢', topics: ['Percentage', 'Ratio & Proportion', 'Averages', 'Time Speed Distance'], questionCount: 10, marksPerQuestion: 2, negativeMarking: 0.66 },
    ],
  },
  {
    id: 'upsc-csat',
    exam: 'upsc',
    title: 'UPSC CSAT Paper II',
    icon: '🧠',
    color: '#f59e0b',
    description: 'Civil Services Aptitude Test — 80 questions, 2 hours',
    durationMinutes: 120,
    totalQuestions: 80,
    totalMarks: 200,
    difficulty: 'medium',
    tags: ['csat', 'aptitude'],
    sections: [
      { subject: 'Logical Reasoning', icon: '🧩', topics: ['Logical Reasoning', 'Analytical Reasoning', 'Syllogism'], questionCount: 25, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Quantitative Aptitude', icon: '🔢', topics: ['Percentage', 'Profit & Loss', 'Time Speed Distance', 'Averages', 'Ratio & Proportion'], questionCount: 25, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'English Comprehension', icon: '📖', topics: ['Reading Comprehension', 'English Grammar', 'Vocabulary'], questionCount: 15, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Decision Making', icon: '💡', topics: ['Logical Reasoning'], questionCount: 15, marksPerQuestion: 2.5, negativeMarking: 0 },
    ],
  },
  {
    id: 'upsc-mini-gs',
    exam: 'upsc',
    title: 'UPSC Mini Mock (30 Questions)',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Quick 30-question practice test — 45 minutes',
    durationMinutes: 45,
    totalQuestions: 30,
    totalMarks: 60,
    difficulty: 'medium',
    tags: ['mini', 'quick'],
    sections: [
      { subject: 'General Studies Mix', icon: '📚', topics: ['Indian History', 'Indian Geography', 'Indian Polity', 'General Science', 'Current Affairs', 'Percentage', 'Logical Reasoning'], questionCount: 30, marksPerQuestion: 2, negativeMarking: 0.66 },
    ],
  },
];

// ─── NEET MOCK TESTS ──────────────────────────────────────────────────────────
export const NEET_MOCKS: MockTestConfig[] = [
  {
    id: 'neet-full',
    exam: 'neet',
    title: 'NEET Full Mock Test',
    icon: '🩺',
    color: '#10b981',
    description: 'Complete NEET pattern — 180 questions, 3 hours 20 minutes',
    durationMinutes: 200,
    totalQuestions: 180,
    totalMarks: 720,
    difficulty: 'hard',
    tags: ['full-length', 'neet-ug'],
    sections: [
      { subject: 'Physics', icon: '⚛️', topics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Current Electricity', 'Magnetism', 'Optics', 'Modern Physics', 'Waves & Sound'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Chemistry', icon: '🧪', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Chemical Bonding', 'Electrochemistry', 'Periodic Table'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Biology - Botany', icon: '🌿', topics: ['Cell Biology', 'Plant Physiology', 'Ecology', 'Genetics'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Biology - Zoology', icon: '🦁', topics: ['Human Physiology', 'Genetics', 'Evolution', 'Biotechnology'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
  {
    id: 'neet-physics',
    exam: 'neet',
    title: 'NEET Physics Mock',
    icon: '⚛️',
    color: '#10b981',
    description: 'Physics only — 45 questions, 60 minutes',
    durationMinutes: 60,
    totalQuestions: 45,
    totalMarks: 180,
    difficulty: 'hard',
    tags: ['subject-wise', 'physics'],
    sections: [
      { subject: 'Physics', icon: '⚛️', topics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Current Electricity', 'Magnetism', 'Optics', 'Modern Physics', 'Waves & Sound'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
  {
    id: 'neet-bio',
    exam: 'neet',
    title: 'NEET Biology Mock',
    icon: '🧬',
    color: '#10b981',
    description: 'Biology only — 90 questions, 90 minutes',
    durationMinutes: 90,
    totalQuestions: 90,
    totalMarks: 360,
    difficulty: 'hard',
    tags: ['subject-wise', 'biology'],
    sections: [
      { subject: 'Botany', icon: '🌿', topics: ['Cell Biology', 'Plant Physiology', 'Ecology', 'Genetics'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Zoology', icon: '🦁', topics: ['Human Physiology', 'Genetics', 'Evolution', 'Biotechnology'], questionCount: 45, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
  {
    id: 'neet-mini',
    exam: 'neet',
    title: 'NEET Mini Mock (50 Questions)',
    icon: '⚡',
    color: '#10b981',
    description: 'Quick practice — 50 questions, 60 minutes',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 200,
    difficulty: 'medium',
    tags: ['mini', 'quick'],
    sections: [
      { subject: 'Physics', icon: '⚛️', topics: ['Mechanics', 'Current Electricity', 'Optics'], questionCount: 15, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Chemistry', icon: '🧪', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'], questionCount: 15, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Biology', icon: '🧬', topics: ['Cell Biology', 'Human Physiology', 'Genetics'], questionCount: 20, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
];

// ─── JEE MOCK TESTS ───────────────────────────────────────────────────────────
export const JEE_MOCKS: MockTestConfig[] = [
  {
    id: 'jee-mains-full',
    exam: 'jee',
    title: 'JEE Mains Full Mock',
    icon: '⚙️',
    color: '#6366f1',
    description: 'JEE Mains pattern — 90 questions, 3 hours',
    durationMinutes: 180,
    totalQuestions: 90,
    totalMarks: 300,
    difficulty: 'hard',
    tags: ['jee-mains', 'full-length'],
    sections: [
      { subject: 'Mathematics', icon: '📐', topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Quadratic Equations', 'Matrices & Determinants', 'Probability', 'Vectors & 3D Geometry'], questionCount: 30, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Physics', icon: '⚛️', topics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Current Electricity', 'Optics', 'Modern Physics'], questionCount: 30, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Chemistry', icon: '🧪', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry', 'Chemical Bonding', 'Electrochemistry'], questionCount: 30, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
  {
    id: 'jee-math',
    exam: 'jee',
    title: 'JEE Mathematics Mock',
    icon: '📐',
    color: '#6366f1',
    description: 'Math only — 30 questions, 60 minutes',
    durationMinutes: 60,
    totalQuestions: 30,
    totalMarks: 120,
    difficulty: 'hard',
    tags: ['subject-wise', 'math'],
    sections: [
      { subject: 'Mathematics', icon: '📐', topics: ['Algebra', 'Calculus', 'Coordinate Geometry', 'Trigonometry', 'Quadratic Equations', 'Matrices & Determinants', 'Probability'], questionCount: 30, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
  {
    id: 'jee-mini',
    exam: 'jee',
    title: 'JEE Mini Mock (45 Questions)',
    icon: '⚡',
    color: '#6366f1',
    description: 'Quick practice — 45 questions, 90 minutes',
    durationMinutes: 90,
    totalQuestions: 45,
    totalMarks: 180,
    difficulty: 'medium',
    tags: ['mini', 'quick'],
    sections: [
      { subject: 'Mathematics', icon: '📐', topics: ['Algebra', 'Calculus', 'Trigonometry', 'Probability'], questionCount: 15, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Physics', icon: '⚛️', topics: ['Mechanics', 'Current Electricity', 'Optics'], questionCount: 15, marksPerQuestion: 4, negativeMarking: 1 },
      { subject: 'Chemistry', icon: '🧪', topics: ['Physical Chemistry', 'Organic Chemistry'], questionCount: 15, marksPerQuestion: 4, negativeMarking: 1 },
    ],
  },
];

// ─── NDA MOCK TESTS ───────────────────────────────────────────────────────────
export const NDA_MOCKS: MockTestConfig[] = [
  {
    id: 'nda-math-full',
    exam: 'nda',
    title: 'NDA Mathematics Paper',
    icon: '🎖️',
    color: '#ef4444',
    description: 'NDA Math Paper — 120 questions, 2.5 hours',
    durationMinutes: 150,
    totalQuestions: 120,
    totalMarks: 300,
    difficulty: 'hard',
    tags: ['nda-math', 'full-length'],
    sections: [
      { subject: 'Algebra', icon: '🔣', topics: ['Algebra', 'Quadratic Equations', 'Matrices & Determinants'], questionCount: 25, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Trigonometry', icon: '📏', topics: ['Trigonometry'], questionCount: 20, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Calculus', icon: '∫', topics: ['Calculus'], questionCount: 20, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Coordinate Geometry', icon: '📍', topics: ['Coordinate Geometry', 'Vectors'], questionCount: 20, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Statistics & Probability', icon: '📊', topics: ['Statistics', 'Probability'], questionCount: 20, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'Number System', icon: '🔢', topics: ['Number System', 'Ratio & Proportion'], questionCount: 15, marksPerQuestion: 2.5, negativeMarking: 0.83 },
    ],
  },
  {
    id: 'nda-gat',
    exam: 'nda',
    title: 'NDA General Ability Test',
    icon: '🧠',
    color: '#ef4444',
    description: 'GAT Paper — 150 questions, 2.5 hours',
    durationMinutes: 150,
    totalQuestions: 150,
    totalMarks: 600,
    difficulty: 'hard',
    tags: ['nda-gat', 'full-length'],
    sections: [
      { subject: 'English', icon: '📖', topics: ['English Grammar', 'Vocabulary', 'Reading Comprehension', 'Synonyms & Antonyms'], questionCount: 50, marksPerQuestion: 4, negativeMarking: 1.33 },
      { subject: 'General Knowledge', icon: '🌍', topics: ['Indian History', 'Indian Geography', 'General Science', 'Current Affairs', 'Physics', 'Chemistry'], questionCount: 100, marksPerQuestion: 4, negativeMarking: 1.33 },
    ],
  },
  {
    id: 'nda-mini',
    exam: 'nda',
    title: 'NDA Mini Mock (50 Questions)',
    icon: '⚡',
    color: '#ef4444',
    description: 'Quick practice — 50 questions, 60 minutes',
    durationMinutes: 60,
    totalQuestions: 50,
    totalMarks: 125,
    difficulty: 'medium',
    tags: ['mini', 'quick'],
    sections: [
      { subject: 'Mathematics', icon: '📐', topics: ['Algebra', 'Trigonometry', 'Calculus', 'Probability', 'Number System'], questionCount: 25, marksPerQuestion: 2.5, negativeMarking: 0.83 },
      { subject: 'General Ability', icon: '🧠', topics: ['English Grammar', 'Indian History', 'General Science', 'Current Affairs'], questionCount: 25, marksPerQuestion: 2.5, negativeMarking: 0.83 },
    ],
  },
];

// ─── SSC MOCK TESTS ───────────────────────────────────────────────────────────
export const SSC_MOCKS: MockTestConfig[] = [
  {
    id: 'ssc-cgl-tier1',
    exam: 'ssc',
    title: 'SSC CGL Tier I Full Mock',
    icon: '📋',
    color: '#22d3ee',
    description: 'SSC CGL Tier I pattern — 100 questions, 60 minutes',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'medium',
    tags: ['ssc-cgl', 'tier1', 'full-length'],
    sections: [
      { subject: 'Quantitative Aptitude', icon: '🔢', topics: ['Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Time Speed Distance', 'Time and Work', 'Ratio & Proportion', 'Averages', 'Trigonometry', 'Geometry', 'Mensuration', 'Algebra', 'Data Interpretation'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
      { subject: 'General Intelligence & Reasoning', icon: '🧩', topics: ['Number Series', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Logical Reasoning', 'Analogy', 'Syllogism', 'Matrix Reasoning'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
      { subject: 'English Language', icon: '📖', topics: ['English Grammar', 'Vocabulary', 'Reading Comprehension', 'Error Spotting', 'Fill in the Blanks', 'Synonyms & Antonyms'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
      { subject: 'General Awareness', icon: '🌍', topics: ['General Science', 'Indian History', 'Indian Geography', 'Indian Polity', 'Current Affairs'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
    ],
  },
  {
    id: 'ssc-chsl',
    exam: 'ssc',
    title: 'SSC CHSL Tier I Mock',
    icon: '📝',
    color: '#22d3ee',
    description: 'SSC CHSL pattern — 100 questions, 60 minutes',
    durationMinutes: 60,
    totalQuestions: 100,
    totalMarks: 200,
    difficulty: 'easy',
    tags: ['ssc-chsl', 'tier1'],
    sections: [
      { subject: 'Quantitative Aptitude', icon: '🔢', topics: ['Percentage', 'Profit & Loss', 'Simple Interest', 'Time Speed Distance', 'Ratio & Proportion', 'Averages', 'Number System'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
      { subject: 'Reasoning', icon: '🧩', topics: ['Number Series', 'Coding-Decoding', 'Blood Relations', 'Direction Sense', 'Analogy'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
      { subject: 'English', icon: '📖', topics: ['English Grammar', 'Vocabulary', 'Error Spotting', 'Fill in the Blanks'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
      { subject: 'General Awareness', icon: '🌍', topics: ['General Science', 'Indian History', 'Current Affairs'], questionCount: 25, marksPerQuestion: 2, negativeMarking: 0.5 },
    ],
  },
  {
    id: 'ssc-quant-only',
    exam: 'ssc',
    title: 'SSC Quantitative Aptitude Mock',
    icon: '🔢',
    color: '#22d3ee',
    description: 'Quant only — 50 questions, 45 minutes',
    durationMinutes: 45,
    totalQuestions: 50,
    totalMarks: 100,
    difficulty: 'medium',
    tags: ['subject-wise', 'quant'],
    sections: [
      { subject: 'Quantitative Aptitude', icon: '🔢', topics: ['Percentage', 'Profit & Loss', 'Simple Interest', 'Compound Interest', 'Time Speed Distance', 'Time and Work', 'Ratio & Proportion', 'Averages', 'Trigonometry', 'Algebra', 'Data Interpretation', 'Mensuration'], questionCount: 50, marksPerQuestion: 2, negativeMarking: 0.5 },
    ],
  },
  {
    id: 'ssc-mini',
    exam: 'ssc',
    title: 'SSC Mini Mock (40 Questions)',
    icon: '⚡',
    color: '#22d3ee',
    description: 'Quick practice — 40 questions, 30 minutes',
    durationMinutes: 30,
    totalQuestions: 40,
    totalMarks: 80,
    difficulty: 'easy',
    tags: ['mini', 'quick'],
    sections: [
      { subject: 'Mixed', icon: '📚', topics: ['Percentage', 'Number Series', 'English Grammar', 'General Science', 'Logical Reasoning', 'Indian History'], questionCount: 40, marksPerQuestion: 2, negativeMarking: 0.5 },
    ],
  },
];

// ─── ALL MOCK TESTS ───────────────────────────────────────────────────────────
export const ALL_MOCK_TESTS: Record<string, MockTestConfig[]> = {
  upsc: UPSC_MOCKS,
  neet: NEET_MOCKS,
  jee: JEE_MOCKS,
  nda: NDA_MOCKS,
  ssc: SSC_MOCKS,
};

export const EXAM_META = {
  upsc: { name: 'UPSC', icon: '🏛️', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  neet: { name: 'NEET', icon: '🩺', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  jee: { name: 'JEE', icon: '⚙️', color: '#6366f1', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.3)' },
  nda: { name: 'NDA', icon: '🎖️', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  ssc: { name: 'SSC', icon: '📋', color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)' },
};
