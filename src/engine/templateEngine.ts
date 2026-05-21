// Template-based question generator for fast, offline questions
// Covers 16 topics with multiple difficulty levels

import { Question } from '@/types/question';

type QuestionTemplate = {
  generate: (difficulty: 'easy' | 'medium' | 'hard') => Question;
};

// Helper to shuffle array
const shuffle = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Random integer between min and max (inclusive)
const randInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ============================================
// TOPIC: Quadratic Equations
// ============================================
const quadraticTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const a = difficulty === 'easy' ? 1 : randInt(1, 3);
      const b = randInt(-10, 10);
      const c = randInt(-10, 10);
      
      // Calculate discriminant
      const discriminant = b * b - 4 * a * c;
      
      let solution1, solution2;
      if (discriminant >= 0) {
        solution1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        solution2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      } else {
        solution1 = solution2 = 0; // Complex roots
      }
      
      const correctAnswer = discriminant >= 0 
        ? 'x = ' + solution1.toFixed(2) + ' or x = ' + solution2.toFixed(2)
        : 'No real roots';
      
      const options = shuffle([
        correctAnswer,
        'x = ' + (solution1 + 1).toFixed(2) + ' or x = ' + (solution2 + 1).toFixed(2),
        'x = ' + (solution1 - 1).toFixed(2) + ' or x = ' + (solution2 - 1).toFixed(2),
        'No real roots'
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: 'Solve: ' + a + 'x² + ' + b + 'x + ' + c + ' = 0',
        options,
        correctAnswer,
        explanation: 'Use quadratic formula: x = (-b ± √(b²-4ac)) / 2a. Here discriminant = ' + discriminant,
        difficulty,
        topic: 'Quadratic Equations'
      };
    }
  }
];

// ============================================
// TOPIC: Percentages
// ============================================
const percentageTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const base = difficulty === 'easy' ? randInt(100, 500) : randInt(500, 2000);
      const percent = randInt(10, 50);
      const result = (base * percent) / 100;
      
      const options = shuffle([
        result.toString(),
        (result + 10).toString(),
        (result - 10).toString(),
        (result * 1.1).toFixed(0)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `What is ${percent}% of ${base}?`,
        options,
        correctAnswer: result.toString(),
        explanation: `${percent}% of ${base} = (${percent}/100) × ${base} = ${result}`,
        difficulty,
        topic: 'Percentages'
      };
    }
  },
  {
    generate: (difficulty) => {
      const original = difficulty === 'easy' ? randInt(100, 500) : randInt(500, 2000);
      const increase = randInt(10, 40);
      const result = original + (original * increase) / 100;
      
      const options = shuffle([
        result.toString(),
        (result + 20).toString(),
        (result - 20).toString(),
        (original + increase).toString()
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `A price of ₹${original} is increased by ${increase}%. What is the new price?`,
        options,
        correctAnswer: result.toString(),
        explanation: `New price = ${original} + (${increase}% of ${original}) = ${original} + ${(original * increase) / 100} = ${result}`,
        difficulty,
        topic: 'Percentages'
      };
    }
  }
];

// ============================================
// TOPIC: Time and Work
// ============================================
const timeWorkTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const daysA = difficulty === 'easy' ? randInt(5, 15) : randInt(10, 30);
      const daysB = difficulty === 'easy' ? randInt(5, 15) : randInt(10, 30);
      
      const rateA = 1 / daysA;
      const rateB = 1 / daysB;
      const combinedRate = rateA + rateB;
      const daysTogether = 1 / combinedRate;
      
      const options = shuffle([
        daysTogether.toFixed(2),
        (daysTogether + 1).toFixed(2),
        (daysTogether - 1).toFixed(2),
        ((daysA + daysB) / 2).toFixed(2)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `A can complete a work in ${daysA} days and B can complete it in ${daysB} days. How many days will they take working together?`,
        options,
        correctAnswer: daysTogether.toFixed(2),
        explanation: `Combined rate = 1/${daysA} + 1/${daysB} = ${combinedRate.toFixed(4)}. Days = 1/${combinedRate.toFixed(4)} = ${daysTogether.toFixed(2)}`,
        difficulty,
        topic: 'Time and Work'
      };
    }
  }
];

// ============================================
// TOPIC: Speed, Distance, Time
// ============================================
const speedDistanceTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const speed = difficulty === 'easy' ? randInt(20, 60) : randInt(60, 120);
      const time = difficulty === 'easy' ? randInt(2, 5) : randInt(3, 8);
      const distance = speed * time;
      
      const options = shuffle([
        distance.toString(),
        (distance + 10).toString(),
        (distance - 10).toString(),
        (speed + time).toString()
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `A car travels at ${speed} km/h for ${time} hours. What distance does it cover?`,
        options,
        correctAnswer: distance.toString(),
        explanation: `Distance = Speed × Time = ${speed} × ${time} = ${distance} km`,
        difficulty,
        topic: 'Speed, Distance, Time'
      };
    }
  }
];

// ============================================
// TOPIC: Profit and Loss
// ============================================
const profitLossTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const cp = difficulty === 'easy' ? randInt(100, 500) : randInt(500, 2000);
      const profitPercent = randInt(10, 40);
      const sp = cp + (cp * profitPercent) / 100;
      
      const options = shuffle([
        sp.toString(),
        (sp + 20).toString(),
        (sp - 20).toString(),
        (cp + profitPercent).toString()
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `An article is bought for ₹${cp} and sold at ${profitPercent}% profit. What is the selling price?`,
        options,
        correctAnswer: sp.toString(),
        explanation: `SP = CP + Profit = ${cp} + (${profitPercent}% of ${cp}) = ${cp} + ${(cp * profitPercent) / 100} = ${sp}`,
        difficulty,
        topic: 'Profit and Loss'
      };
    }
  }
];

// ============================================
// TOPIC: Averages
// ============================================
const averageTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const count = difficulty === 'easy' ? 3 : 5;
      const numbers = Array.from({ length: count }, () => randInt(10, 100));
      const sum = numbers.reduce((a, b) => a + b, 0);
      const avg = sum / count;
      
      const options = shuffle([
        avg.toFixed(2),
        (avg + 5).toFixed(2),
        (avg - 5).toFixed(2),
        (sum / (count + 1)).toFixed(2)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Find the average of: ${numbers.join(', ')}`,
        options,
        correctAnswer: avg.toFixed(2),
        explanation: `Average = Sum/Count = ${sum}/${count} = ${avg.toFixed(2)}`,
        difficulty,
        topic: 'Averages'
      };
    }
  }
];

// ============================================
// TOPIC: Ratios and Proportions
// ============================================
const ratioTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const a = randInt(2, 5);
      const b = randInt(2, 5);
      const total = difficulty === 'easy' ? randInt(100, 500) : randInt(500, 2000);
      
      const partA = (total * a) / (a + b);
      
      const options = shuffle([
        partA.toFixed(0),
        (partA + 10).toFixed(0),
        (partA - 10).toFixed(0),
        ((total * b) / (a + b)).toFixed(0)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Divide ${total} in the ratio ${a}:${b}. What is the first part?`,
        options,
        correctAnswer: partA.toFixed(0),
        explanation: `First part = ${total} × ${a}/(${a}+${b}) = ${total} × ${a}/${a + b} = ${partA.toFixed(0)}`,
        difficulty,
        topic: 'Ratios and Proportions'
      };
    }
  }
];

// ============================================
// TOPIC: Simple Interest
// ============================================
const simpleInterestTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const principal = difficulty === 'easy' ? randInt(1000, 5000) : randInt(5000, 20000);
      const rate = randInt(5, 15);
      const time = randInt(2, 5);
      
      const si = (principal * rate * time) / 100;
      
      const options = shuffle([
        si.toString(),
        (si + 100).toString(),
        (si - 100).toString(),
        (principal * rate / 100).toString()
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Find simple interest on ₹${principal} at ${rate}% per annum for ${time} years.`,
        options,
        correctAnswer: si.toString(),
        explanation: `SI = (P × R × T)/100 = (${principal} × ${rate} × ${time})/100 = ${si}`,
        difficulty,
        topic: 'Simple Interest'
      };
    }
  }
];

// ============================================
// TOPIC: Compound Interest
// ============================================
const compoundInterestTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const principal = difficulty === 'easy' ? randInt(1000, 5000) : randInt(5000, 20000);
      const rate = randInt(5, 15);
      const time = difficulty === 'easy' ? 2 : 3;
      
      const amount = principal * Math.pow(1 + rate / 100, time);
      const ci = amount - principal;
      
      const options = shuffle([
        ci.toFixed(0),
        (ci + 100).toFixed(0),
        (ci - 100).toFixed(0),
        ((principal * rate * time) / 100).toFixed(0)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Find compound interest on ₹${principal} at ${rate}% per annum for ${time} years.`,
        options,
        correctAnswer: ci.toFixed(0),
        explanation: `A = P(1 + R/100)^T = ${principal}(1 + ${rate}/100)^${time} = ${amount.toFixed(0)}. CI = A - P = ${ci.toFixed(0)}`,
        difficulty,
        topic: 'Compound Interest'
      };
    }
  }
];

// ============================================
// TOPIC: Algebra
// ============================================
const algebraTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const a = randInt(2, 10);
      const b = randInt(1, 20);
      const c = randInt(1, 50);
      
      const x = (c - b) / a;
      
      const options = shuffle([
        x.toFixed(2),
        (x + 1).toFixed(2),
        (x - 1).toFixed(2),
        (c / a).toFixed(2)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Solve for x: ${a}x + ${b} = ${c}`,
        options,
        correctAnswer: x.toFixed(2),
        explanation: `${a}x = ${c} - ${b} = ${c - b}. x = ${c - b}/${a} = ${x.toFixed(2)}`,
        difficulty,
        topic: 'Algebra'
      };
    }
  }
];

// ============================================
// TOPIC: Number Series
// ============================================
const numberSeriesTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const start = randInt(2, 10);
      const diff = randInt(2, 5);
      const series = [start, start + diff, start + 2 * diff, start + 3 * diff];
      const next = start + 4 * diff;
      
      const options = shuffle([
        next.toString(),
        (next + diff).toString(),
        (next - diff).toString(),
        (next + 1).toString()
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Find the next number in the series: ${series.join(', ')}, ?`,
        options,
        correctAnswer: next.toString(),
        explanation: `This is an arithmetic series with common difference ${diff}. Next = ${series[3]} + ${diff} = ${next}`,
        difficulty,
        topic: 'Number Series'
      };
    }
  }
];

// ============================================
// TOPIC: Geometry
// ============================================
const geometryTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const radius = difficulty === 'easy' ? randInt(5, 15) : randInt(10, 30);
      const area = Math.PI * radius * radius;
      
      const options = shuffle([
        area.toFixed(2),
        (area + 10).toFixed(2),
        (area - 10).toFixed(2),
        (2 * Math.PI * radius).toFixed(2)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Find the area of a circle with radius ${radius} cm. (Use π = 3.14)`,
        options,
        correctAnswer: area.toFixed(2),
        explanation: `Area = πr² = 3.14 × ${radius}² = ${area.toFixed(2)} cm²`,
        difficulty,
        topic: 'Geometry'
      };
    }
  }
];

// ============================================
// TOPIC: Data Interpretation
// ============================================
const dataInterpretationTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const values = Array.from({ length: 5 }, () => randInt(100, 500));
      const max = Math.max(...values);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
      const maxMonth = months[values.indexOf(max)];
      
      const options = shuffle([
        maxMonth,
        ...months.filter(m => m !== maxMonth).slice(0, 3)
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `Sales data: Jan=${values[0]}, Feb=${values[1]}, Mar=${values[2]}, Apr=${values[3]}, May=${values[4]}. Which month had highest sales?`,
        options,
        correctAnswer: maxMonth,
        explanation: `${maxMonth} had sales of ${max}, which is the highest.`,
        difficulty,
        topic: 'Data Interpretation'
      };
    }
  }
];

// ============================================
// TOPIC: Logical Reasoning
// ============================================
const logicalReasoningTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const patterns = [
        { question: 'If A > B and B > C, then:', answer: 'A > C', wrong: ['A < C', 'A = C', 'Cannot determine'] },
        { question: 'All cats are animals. Some animals are dogs. Therefore:', answer: 'Some dogs may be cats', wrong: ['All dogs are cats', 'No dogs are cats', 'All animals are cats'] },
        { question: 'If it rains, the ground is wet. The ground is wet. Therefore:', answer: 'It may have rained', wrong: ['It definitely rained', 'It did not rain', 'The ground is dry'] }
      ];
      
      const pattern = patterns[randInt(0, patterns.length - 1)];
      const options = shuffle([pattern.answer, ...pattern.wrong]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: pattern.question,
        options,
        correctAnswer: pattern.answer,
        explanation: 'This follows basic logical reasoning principles.',
        difficulty,
        topic: 'Logical Reasoning'
      };
    }
  }
];

// ============================================
// TOPIC: Coding-Decoding
// ============================================
const codingDecodingTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const word = difficulty === 'easy' ? 'CAT' : 'DOG';
      const shift = 1;
      const coded = word.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
      
      const testWord = difficulty === 'easy' ? 'BAT' : 'FOG';
      const answer = testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
      
      const options = shuffle([
        answer,
        testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 2)).join(''),
        testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join(''),
        testWord.split('').reverse().join('')
      ]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: `If ${word} is coded as ${coded}, then ${testWord} is coded as:`,
        options,
        correctAnswer: answer,
        explanation: `Each letter is shifted by ${shift} position. ${testWord} becomes ${answer}.`,
        difficulty,
        topic: 'Coding-Decoding'
      };
    }
  }
];

// ============================================
// TOPIC: Blood Relations
// ============================================
const bloodRelationsTemplates: QuestionTemplate[] = [
  {
    generate: (difficulty) => {
      const relations = [
        { question: "A is B's father. B is C's father. How is A related to C?", answer: 'Grandfather', wrong: ['Father', 'Uncle', 'Brother'] },
        { question: "A is B's mother. C is B's daughter. How is A related to C?", answer: 'Grandmother', wrong: ['Mother', 'Aunt', 'Sister'] },
        { question: "A is B's brother. B is C's father. How is A related to C?", answer: 'Uncle', wrong: ['Father', 'Brother', 'Grandfather'] }
      ];
      
      const relation = relations[randInt(0, relations.length - 1)];
      const options = shuffle([relation.answer, ...relation.wrong]);
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        question: relation.question,
        options,
        correctAnswer: relation.answer,
        explanation: 'Follow the family tree relationships.',
        difficulty,
        topic: 'Blood Relations'
      };
    }
  }
];

// ============================================
// MAIN TEMPLATE ENGINE
// ============================================

const topicTemplates: Record<string, QuestionTemplate[]> = {
  'Quadratic Equations': quadraticTemplates,
  'Percentages': percentageTemplates,
  'Time and Work': timeWorkTemplates,
  'Speed, Distance, Time': speedDistanceTemplates,
  'Profit and Loss': profitLossTemplates,
  'Averages': averageTemplates,
  'Ratios and Proportions': ratioTemplates,
  'Simple Interest': simpleInterestTemplates,
  'Compound Interest': compoundInterestTemplates,
  'Algebra': algebraTemplates,
  'Number Series': numberSeriesTemplates,
  'Geometry': geometryTemplates,
  'Data Interpretation': dataInterpretationTemplates,
  'Logical Reasoning': logicalReasoningTemplates,
  'Coding-Decoding': codingDecodingTemplates,
  'Blood Relations': bloodRelationsTemplates
};

export const generateTemplateQuestions = (
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  count: number
): Question[] => {
  const templates = topicTemplates[topic];
  
  if (!templates) {
    throw new Error(`No templates found for topic: ${topic}`);
  }
  
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    questions.push(template.generate(difficulty));
  }
  
  return questions;
};

export const getAvailableTopics = (): string[] => {
  return Object.keys(topicTemplates);
};

