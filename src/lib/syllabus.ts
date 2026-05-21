/**
 * EDUHUB Syllabus
 * Organized by exam: UPSC, NEET, JEE, NDA, SSC
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  name: string;
  icon: string;
  color: string;
  exam: string[];
}

export interface ExamSyllabus {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  subjects: Subject[];
}

export interface Subject {
  name: string;
  icon: string;
  topics: Topic[];
}

// ─── UPSC ────────────────────────────────────────────────────────────────────
export const UPSC: ExamSyllabus = {
  id: 'upsc',
  name: 'UPSC',
  icon: '🏛️',
  color: '#f59e0b',
  description: 'Civil Services Examination',
  subjects: [
    {
      name: 'General Studies - Math',
      icon: '🔢',
      topics: [
        { name: 'Number System', icon: '🔢', color: 'from-blue-500 to-cyan-500', exam: ['upsc', 'ssc'] },
        { name: 'Percentage', icon: '💯', color: 'from-indigo-500 to-blue-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Profit & Loss', icon: '💰', color: 'from-green-500 to-emerald-500', exam: ['upsc', 'ssc'] },
        { name: 'Simple Interest', icon: '🏦', color: 'from-amber-500 to-orange-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Compound Interest', icon: '📈', color: 'from-lime-500 to-emerald-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Time Speed Distance', icon: '🚗', color: 'from-orange-500 to-red-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Time and Work', icon: '⚙️', color: 'from-violet-500 to-purple-500', exam: ['upsc', 'ssc'] },
        { name: 'Ratio & Proportion', icon: '⚖️', color: 'from-teal-500 to-green-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Averages', icon: '📊', color: 'from-sky-500 to-blue-500', exam: ['upsc', 'ssc'] },
        { name: 'Data Interpretation', icon: '📉', color: 'from-rose-500 to-pink-500', exam: ['upsc', 'ssc'] },
      ],
    },
    {
      name: 'General Studies - Reasoning',
      icon: '🧩',
      topics: [
        { name: 'Logical Reasoning', icon: '🧠', color: 'from-purple-500 to-pink-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Analytical Reasoning', icon: '🔍', color: 'from-cyan-500 to-blue-500', exam: ['upsc'] },
        { name: 'Blood Relations', icon: '👨‍👩‍👧', color: 'from-rose-500 to-pink-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Direction Sense', icon: '🧭', color: 'from-emerald-500 to-teal-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Coding-Decoding', icon: '🔐', color: 'from-cyan-500 to-blue-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Syllogism', icon: '💭', color: 'from-violet-500 to-indigo-500', exam: ['upsc', 'ssc'] },
        { name: 'Number Series', icon: '🔢', color: 'from-indigo-500 to-blue-500', exam: ['upsc', 'ssc', 'nda'] },
      ],
    },
    {
      name: 'General Studies - Science',
      icon: '🔬',
      topics: [
        { name: 'General Science', icon: '🔬', color: 'from-green-500 to-teal-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Indian History', icon: '🏺', color: 'from-amber-500 to-yellow-500', exam: ['upsc', 'nda'] },
        { name: 'Indian Geography', icon: '🗺️', color: 'from-emerald-500 to-green-500', exam: ['upsc', 'nda'] },
        { name: 'Indian Polity', icon: '⚖️', color: 'from-blue-500 to-indigo-500', exam: ['upsc'] },
        { name: 'Indian Economy', icon: '💹', color: 'from-green-500 to-emerald-500', exam: ['upsc'] },
        { name: 'Current Affairs', icon: '📰', color: 'from-red-500 to-orange-500', exam: ['upsc', 'ssc', 'nda'] },
      ],
    },
    {
      name: 'English',
      icon: '📖',
      topics: [
        { name: 'English Grammar', icon: '📖', color: 'from-teal-500 to-cyan-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Vocabulary', icon: '📚', color: 'from-fuchsia-500 to-purple-500', exam: ['upsc', 'ssc', 'nda'] },
        { name: 'Reading Comprehension', icon: '📄', color: 'from-sky-500 to-blue-500', exam: ['upsc', 'ssc'] },
        { name: 'Error Spotting', icon: '✏️', color: 'from-orange-500 to-amber-500', exam: ['upsc', 'ssc'] },
      ],
    },
  ],
};

// ─── NEET ────────────────────────────────────────────────────────────────────
export const NEET: ExamSyllabus = {
  id: 'neet',
  name: 'NEET',
  icon: '🩺',
  color: '#10b981',
  description: 'National Eligibility cum Entrance Test',
  subjects: [
    {
      name: 'Physics',
      icon: '⚛️',
      topics: [
        { name: 'Mechanics', icon: '⚙️', color: 'from-blue-500 to-cyan-500', exam: ['neet', 'jee', 'nda'] },
        { name: 'Thermodynamics', icon: '🌡️', color: 'from-orange-500 to-red-500', exam: ['neet', 'jee'] },
        { name: 'Electrostatics', icon: '⚡', color: 'from-yellow-500 to-amber-500', exam: ['neet', 'jee'] },
        { name: 'Current Electricity', icon: '🔌', color: 'from-indigo-500 to-blue-500', exam: ['neet', 'jee', 'nda'] },
        { name: 'Magnetism', icon: '🧲', color: 'from-purple-500 to-pink-500', exam: ['neet', 'jee', 'nda'] },
        { name: 'Optics', icon: '🔭', color: 'from-cyan-500 to-teal-500', exam: ['neet', 'jee'] },
        { name: 'Modern Physics', icon: '☢️', color: 'from-green-500 to-emerald-500', exam: ['neet', 'jee'] },
        { name: 'Waves & Sound', icon: '🌊', color: 'from-sky-500 to-blue-500', exam: ['neet', 'jee', 'nda'] },
      ],
    },
    {
      name: 'Chemistry',
      icon: '🧪',
      topics: [
        { name: 'Physical Chemistry', icon: '⚗️', color: 'from-violet-500 to-purple-500', exam: ['neet', 'jee'] },
        { name: 'Organic Chemistry', icon: '🧬', color: 'from-green-500 to-teal-500', exam: ['neet', 'jee'] },
        { name: 'Inorganic Chemistry', icon: '🔩', color: 'from-gray-500 to-slate-500', exam: ['neet', 'jee'] },
        { name: 'Chemical Bonding', icon: '🔗', color: 'from-blue-500 to-indigo-500', exam: ['neet', 'jee'] },
        { name: 'Electrochemistry', icon: '🔋', color: 'from-yellow-500 to-orange-500', exam: ['neet', 'jee'] },
        { name: 'Periodic Table', icon: '📋', color: 'from-teal-500 to-cyan-500', exam: ['neet', 'jee'] },
      ],
    },
    {
      name: 'Biology',
      icon: '🌿',
      topics: [
        { name: 'Cell Biology', icon: '🔬', color: 'from-green-500 to-emerald-500', exam: ['neet'] },
        { name: 'Genetics', icon: '🧬', color: 'from-purple-500 to-violet-500', exam: ['neet'] },
        { name: 'Human Physiology', icon: '🫀', color: 'from-red-500 to-rose-500', exam: ['neet'] },
        { name: 'Plant Physiology', icon: '🌱', color: 'from-lime-500 to-green-500', exam: ['neet'] },
        { name: 'Ecology', icon: '🌍', color: 'from-teal-500 to-green-500', exam: ['neet'] },
        { name: 'Evolution', icon: '🦕', color: 'from-amber-500 to-yellow-500', exam: ['neet'] },
        { name: 'Biotechnology', icon: '🧫', color: 'from-cyan-500 to-blue-500', exam: ['neet'] },
      ],
    },
  ],
};

// ─── JEE ─────────────────────────────────────────────────────────────────────
export const JEE: ExamSyllabus = {
  id: 'jee',
  name: 'JEE',
  icon: '⚙️',
  color: '#6366f1',
  description: 'Joint Entrance Examination',
  subjects: [
    {
      name: 'Mathematics',
      icon: '📐',
      topics: [
        { name: 'Algebra', icon: '🔣', color: 'from-violet-500 to-purple-500', exam: ['jee', 'nda'] },
        { name: 'Calculus', icon: '∫', color: 'from-blue-500 to-indigo-500', exam: ['jee', 'nda'] },
        { name: 'Coordinate Geometry', icon: '📍', color: 'from-pink-500 to-rose-500', exam: ['jee', 'nda'] },
        { name: 'Trigonometry', icon: '📏', color: 'from-pink-500 to-rose-500', exam: ['jee', 'nda', 'ssc'] },
        { name: 'Quadratic Equations', icon: '🔣', color: 'from-violet-500 to-purple-500', exam: ['jee', 'nda', 'ssc'] },
        { name: 'Matrices & Determinants', icon: '🔲', color: 'from-slate-500 to-gray-500', exam: ['jee', 'nda'] },
        { name: 'Probability', icon: '🎲', color: 'from-orange-500 to-amber-500', exam: ['jee', 'nda', 'ssc'] },
        { name: 'Statistics', icon: '📊', color: 'from-cyan-500 to-teal-500', exam: ['jee', 'nda'] },
        { name: 'Vectors & 3D Geometry', icon: '📐', color: 'from-indigo-500 to-violet-500', exam: ['jee', 'nda'] },
        { name: 'Linear Equations', icon: '📐', color: 'from-purple-500 to-pink-500', exam: ['jee', 'nda', 'ssc'] },
      ],
    },
    {
      name: 'Physics',
      icon: '⚛️',
      topics: [
        { name: 'Mechanics', icon: '⚙️', color: 'from-blue-500 to-cyan-500', exam: ['jee', 'nda'] },
        { name: 'Thermodynamics', icon: '🌡️', color: 'from-orange-500 to-red-500', exam: ['jee'] },
        { name: 'Electrostatics', icon: '⚡', color: 'from-yellow-500 to-amber-500', exam: ['jee'] },
        { name: 'Current Electricity', icon: '🔌', color: 'from-indigo-500 to-blue-500', exam: ['jee', 'nda'] },
        { name: 'Optics', icon: '🔭', color: 'from-cyan-500 to-teal-500', exam: ['jee'] },
        { name: 'Modern Physics', icon: '☢️', color: 'from-green-500 to-emerald-500', exam: ['jee'] },
      ],
    },
    {
      name: 'Chemistry',
      icon: '🧪',
      topics: [
        { name: 'Physical Chemistry', icon: '⚗️', color: 'from-violet-500 to-purple-500', exam: ['jee'] },
        { name: 'Organic Chemistry', icon: '🧬', color: 'from-green-500 to-teal-500', exam: ['jee'] },
        { name: 'Inorganic Chemistry', icon: '🔩', color: 'from-gray-500 to-slate-500', exam: ['jee'] },
      ],
    },
  ],
};

// ─── NDA ─────────────────────────────────────────────────────────────────────
export const NDA: ExamSyllabus = {
  id: 'nda',
  name: 'NDA',
  icon: '🎖️',
  color: '#ef4444',
  description: 'National Defence Academy',
  subjects: [
    {
      name: 'Mathematics',
      icon: '📐',
      topics: [
        { name: 'Algebra', icon: '🔣', color: 'from-violet-500 to-purple-500', exam: ['nda', 'jee'] },
        { name: 'Trigonometry', icon: '📏', color: 'from-pink-500 to-rose-500', exam: ['nda', 'jee', 'ssc'] },
        { name: 'Calculus', icon: '∫', color: 'from-blue-500 to-indigo-500', exam: ['nda', 'jee'] },
        { name: 'Matrices & Determinants', icon: '🔲', color: 'from-slate-500 to-gray-500', exam: ['nda', 'jee'] },
        { name: 'Probability', icon: '🎲', color: 'from-orange-500 to-amber-500', exam: ['nda', 'jee', 'ssc'] },
        { name: 'Statistics', icon: '📊', color: 'from-cyan-500 to-teal-500', exam: ['nda', 'jee'] },
        { name: 'Vectors', icon: '➡️', color: 'from-indigo-500 to-violet-500', exam: ['nda'] },
        { name: 'Coordinate Geometry', icon: '📍', color: 'from-pink-500 to-rose-500', exam: ['nda', 'jee'] },
        { name: 'Number System', icon: '🔢', color: 'from-blue-500 to-cyan-500', exam: ['nda', 'ssc'] },
        { name: 'Quadratic Equations', icon: '🔣', color: 'from-violet-500 to-purple-500', exam: ['nda', 'jee', 'ssc'] },
      ],
    },
    {
      name: 'General Ability',
      icon: '🧠',
      topics: [
        { name: 'English Grammar', icon: '📖', color: 'from-teal-500 to-cyan-500', exam: ['nda', 'ssc', 'upsc'] },
        { name: 'Vocabulary', icon: '📚', color: 'from-fuchsia-500 to-purple-500', exam: ['nda', 'ssc', 'upsc'] },
        { name: 'General Science', icon: '🔬', color: 'from-green-500 to-teal-500', exam: ['nda', 'ssc', 'upsc'] },
        { name: 'Indian History', icon: '🏺', color: 'from-amber-500 to-yellow-500', exam: ['nda', 'upsc'] },
        { name: 'Indian Geography', icon: '🗺️', color: 'from-emerald-500 to-green-500', exam: ['nda', 'upsc'] },
        { name: 'Current Affairs', icon: '📰', color: 'from-red-500 to-orange-500', exam: ['nda', 'ssc', 'upsc'] },
        { name: 'Physics', icon: '⚛️', color: 'from-blue-500 to-indigo-500', exam: ['nda'] },
        { name: 'Chemistry', icon: '🧪', color: 'from-violet-500 to-purple-500', exam: ['nda'] },
      ],
    },
  ],
};

// ─── SSC ─────────────────────────────────────────────────────────────────────
export const SSC: ExamSyllabus = {
  id: 'ssc',
  name: 'SSC',
  icon: '🏛️',
  color: '#22d3ee',
  description: 'Staff Selection Commission (CGL/CHSL/MTS)',
  subjects: [
    {
      name: 'Quantitative Aptitude',
      icon: '🔢',
      topics: [
        { name: 'Number System', icon: '🔢', color: 'from-blue-500 to-cyan-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Percentage', icon: '💯', color: 'from-indigo-500 to-blue-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Profit & Loss', icon: '💰', color: 'from-green-500 to-emerald-500', exam: ['ssc', 'upsc'] },
        { name: 'Simple Interest', icon: '🏦', color: 'from-amber-500 to-orange-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Compound Interest', icon: '📈', color: 'from-lime-500 to-emerald-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Time Speed Distance', icon: '🚗', color: 'from-orange-500 to-red-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Time and Work', icon: '⚙️', color: 'from-violet-500 to-purple-500', exam: ['ssc', 'upsc'] },
        { name: 'Ratio & Proportion', icon: '⚖️', color: 'from-teal-500 to-green-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Averages', icon: '📊', color: 'from-sky-500 to-blue-500', exam: ['ssc', 'upsc'] },
        { name: 'Trigonometry', icon: '📏', color: 'from-pink-500 to-rose-500', exam: ['ssc', 'jee', 'nda'] },
        { name: 'Geometry', icon: '📐', color: 'from-purple-500 to-violet-500', exam: ['ssc', 'nda'] },
        { name: 'Algebra', icon: '🔣', color: 'from-violet-500 to-purple-500', exam: ['ssc', 'jee', 'nda'] },
        { name: 'Data Interpretation', icon: '📉', color: 'from-rose-500 to-pink-500', exam: ['ssc', 'upsc'] },
        { name: 'Mensuration', icon: '📏', color: 'from-cyan-500 to-teal-500', exam: ['ssc', 'nda'] },
      ],
    },
    {
      name: 'Reasoning',
      icon: '🧩',
      topics: [
        { name: 'Number Series', icon: '🔢', color: 'from-indigo-500 to-blue-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Coding-Decoding', icon: '🔐', color: 'from-cyan-500 to-blue-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Blood Relations', icon: '👨‍👩‍👧', color: 'from-rose-500 to-pink-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Direction Sense', icon: '🧭', color: 'from-emerald-500 to-teal-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Logical Reasoning', icon: '🧠', color: 'from-purple-500 to-pink-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Analogy', icon: '🔄', color: 'from-blue-500 to-indigo-500', exam: ['ssc', 'nda'] },
        { name: 'Syllogism', icon: '💭', color: 'from-violet-500 to-indigo-500', exam: ['ssc', 'upsc'] },
        { name: 'Matrix Reasoning', icon: '🔲', color: 'from-slate-500 to-gray-500', exam: ['ssc'] },
      ],
    },
    {
      name: 'English',
      icon: '📖',
      topics: [
        { name: 'English Grammar', icon: '📖', color: 'from-teal-500 to-cyan-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Vocabulary', icon: '📚', color: 'from-fuchsia-500 to-purple-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Reading Comprehension', icon: '📄', color: 'from-sky-500 to-blue-500', exam: ['ssc', 'upsc'] },
        { name: 'Error Spotting', icon: '✏️', color: 'from-orange-500 to-amber-500', exam: ['ssc', 'upsc'] },
        { name: 'Fill in the Blanks', icon: '📝', color: 'from-green-500 to-teal-500', exam: ['ssc'] },
        { name: 'Synonyms & Antonyms', icon: '🔤', color: 'from-pink-500 to-rose-500', exam: ['ssc', 'nda'] },
      ],
    },
    {
      name: 'General Awareness',
      icon: '🌍',
      topics: [
        { name: 'General Science', icon: '🔬', color: 'from-green-500 to-teal-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Indian History', icon: '🏺', color: 'from-amber-500 to-yellow-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Indian Geography', icon: '🗺️', color: 'from-emerald-500 to-green-500', exam: ['ssc', 'upsc', 'nda'] },
        { name: 'Indian Polity', icon: '⚖️', color: 'from-blue-500 to-indigo-500', exam: ['ssc', 'upsc'] },
        { name: 'Current Affairs', icon: '📰', color: 'from-red-500 to-orange-500', exam: ['ssc', 'upsc', 'nda'] },
      ],
    },
  ],
};

// ─── ALL EXAMS ────────────────────────────────────────────────────────────────
export const ALL_EXAMS: ExamSyllabus[] = [UPSC, NEET, JEE, NDA, SSC];

// Flat list of all unique topics for the test page
export const ALL_TOPICS: Topic[] = Array.from(
  new Map(
    ALL_EXAMS.flatMap(e => e.subjects.flatMap(s => s.topics))
      .map(t => [t.name, t])
  ).values()
);

// Get topics for a specific exam
export function getTopicsForExam(examId: string): Topic[] {
  const exam = ALL_EXAMS.find(e => e.id === examId);
  if (!exam) return ALL_TOPICS;
  return exam.subjects.flatMap(s => s.topics);
}

// Get all topic names (for API calls)
export const ALL_TOPIC_NAMES = ALL_TOPICS.map(t => t.name);
