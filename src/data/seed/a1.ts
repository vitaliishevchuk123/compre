import type { LessonCard } from '../../types';

// Function words taught implicitly (articles, auxiliaries, copula). The CI
// "one new word per card" invariant is enforced over content words only.
const FUNCTION_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'can', 'to', 'and',
]);

/**
 * A1 lesson sequence. Each card introduces exactly ONE new content word; every
 * other content word in its sentence appears in an EARLIER card. Ordered by
 * `order` — that order defines what the learner already knows at each step.
 */
export const A1_CARDS: LessonCard[] = [
  {
    order: 1, newWord: 'boy', category: 'people',
    knownWords: [], sentence: null, imageKey: 'a1/boy',
    options: ['boy', 'girl', 'dog'], answer: 'boy',
  },
  {
    order: 2, newWord: 'girl', category: 'people',
    knownWords: [], sentence: null, imageKey: 'a1/girl',
    options: ['girl', 'boy', 'dog'], answer: 'girl',
  },
  {
    order: 3, newWord: 'dog', category: 'animals',
    knownWords: [], sentence: null, imageKey: 'a1/dog',
    options: ['dog', 'boy', 'girl'], answer: 'dog',
  },
  {
    order: 4, newWord: 'run', category: 'actions',
    knownWords: ['dog'], sentence: 'The dog can run.', imageKey: 'a1/dog-run',
    options: ['run', 'boy', 'girl'], answer: 'run',
  },
  {
    order: 5, newWord: 'eat', category: 'actions',
    knownWords: ['boy'], sentence: 'The boy can eat.', imageKey: 'a1/boy-eat',
    options: ['eat', 'run', 'dog'], answer: 'eat',
  },
  {
    order: 6, newWord: 'happy', category: 'emotions',
    knownWords: ['girl'], sentence: 'The girl is happy.', imageKey: 'a1/girl-happy',
    options: ['happy', 'run', 'eat'], answer: 'happy',
  },
  {
    order: 7, newWord: 'fast', category: 'adverbs',
    knownWords: ['dog', 'run'], sentence: 'The dog can run fast.', imageKey: 'a1/dog-run-fast',
    options: ['fast', 'happy', 'eat'], answer: 'fast',
  },
  {
    order: 8, newWord: 'too', category: 'adverbs',
    knownWords: ['boy', 'girl', 'happy'], sentence: 'The boy and the girl are happy too.', imageKey: 'a1/boy-girl-happy',
    options: ['too', 'fast', 'run'], answer: 'too',
  },
];

/** Strip punctuation and lowercase a sentence into word tokens. */
function tokenize(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Dev-time guard: verify every card obeys the CI invariant. Returns a list of
 * human-readable violations (empty when valid). Run in __DEV__ on startup.
 */
export function validateCards(cards: LessonCard[]): string[] {
  const problems: string[] = [];
  const learned = new Set<string>();

  for (const card of cards) {
    if (card.answer !== card.newWord) {
      problems.push(`Card ${card.order}: answer "${card.answer}" != newWord "${card.newWord}"`);
    }
    if (!card.options.includes(card.newWord)) {
      problems.push(`Card ${card.order}: options missing newWord "${card.newWord}"`);
    }
    if (card.sentence) {
      for (const token of tokenize(card.sentence)) {
        if (token === card.newWord) continue;
        if (FUNCTION_WORDS.has(token)) continue;
        if (!learned.has(token)) {
          problems.push(
            `Card ${card.order} ("${card.sentence}"): word "${token}" used before it was taught`
          );
        }
      }
    }
    learned.add(card.newWord);
  }
  return problems;
}
