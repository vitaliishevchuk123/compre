import type { LessonCard } from '../../types';

// Function words taught implicitly (articles, auxiliaries, copula). The CI
// "one new word per card" invariant is enforced over content words only.
const FUNCTION_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'can', 'to', 'and',
]);

/**
 * A1 lesson sequence.
 *
 * 'word' cards introduce exactly ONE new content word; every other content word
 * already appeared earlier. 'sentence' cards introduce nothing new — they show
 * three near-identical sentences differing by one swapped word, and the learner
 * picks the one that matches the image (all words already known).
 *
 * Ordered by `order`; that order defines what the learner knows at each step.
 */
export const A1_CARDS: LessonCard[] = [
  {
    order: 1,
    kind: 'word',
    newWord: 'boy',
    category: 'people',
    knownWords: [],
    sentence: 'What is this?',
    imageKey: 'a1/boy',
    options: ['boy', 'girl', 'dog'],
    answer: 'boy',
    answerPhrase: 'This is a boy.',
  },
  {
    order: 2,
    kind: 'word',
    newWord: 'girl',
    category: 'people',
    knownWords: ['boy'],
    sentence: 'What is this?',
    imageKey: 'a1/girl',
    options: ['girl', 'boy', 'dog'],
    answer: 'girl',
    answerPhrase: 'This is a girl.',
  },
  {
    order: 3,
    kind: 'word',
    newWord: 'dog',
    category: 'animals',
    knownWords: ['boy', 'girl'],
    sentence: 'What is this?',
    imageKey: 'a1/dog',
    options: ['dog', 'boy', 'girl'],
    answer: 'dog',
    answerPhrase: 'This is a dog.',
  },
  {
    order: 4,
    kind: 'word',
    newWord: 'run',
    category: 'actions',
    knownWords: ['dog'],
    sentence: 'What is the dog doing?',
    imageKey: 'a1/dog-run',
    options: ['run', 'eat', 'sleep'],
    answer: 'run',
    answerPhrase: 'The dog is running.',
  },
  {
    order: 5,
    kind: 'word',
    newWord: 'eat',
    category: 'actions',
    knownWords: ['boy'],
    sentence: 'What is the boy doing?',
    imageKey: 'a1/boy-eat',
    options: ['eat', 'run', 'sleep'],
    answer: 'eat',
    answerPhrase: 'The boy is eating.',
  },
  {
    order: 6,
    kind: 'word',
    newWord: 'happy',
    category: 'emotions',
    knownWords: ['girl'],
    sentence: 'How does the girl feel?',
    imageKey: 'a1/girl-happy',
    options: ['happy', 'sad', 'angry'],
    answer: 'happy',
    answerPhrase: 'The girl is happy.',
  },
  {
    order: 7,
    kind: 'word',
    newWord: 'fast',
    category: 'adverbs',
    knownWords: ['dog', 'run'],
    sentence: 'How does the dog run?',
    imageKey: 'a1/dog-run-fast',
    options: ['fast', 'slow', 'happy'],
    answer: 'fast',
    answerPhrase: 'The dog runs fast.',
  },
  {
    order: 8,
    kind: 'word',
    newWord: 'sad',
    category: 'emotions',
    knownWords: ['boy'],
    sentence: 'How does the boy feel?',
    imageKey: 'a1/boy-sad',
    options: ['sad', 'happy', 'angry'],
    answer: 'sad',
    answerPhrase: 'The boy is sad.',
  },
  {
    order: 9,
    kind: 'word',
    newWord: 'angry',
    category: 'emotions',
    knownWords: ['dog'],
    sentence: 'How does the dog feel?',
    imageKey: 'a1/dog-angry',
    options: ['angry', 'sad', 'happy'],
    answer: 'angry',
    answerPhrase: 'The dog is angry.',
  },
  {
    order: 10,
    kind: 'sentence',
    newWord: 'sad',
    category: 'emotions',
    knownWords: ['girl', 'happy', 'sad', 'angry'],
    sentence: 'Choose the correct sentence',
    imageKey: 'a1/girl-sad',
    options: [
      'The girl is happy.',
      'The girl is sad.',
      'The girl is angry.'
    ],
    answer: 'The girl is sad.',
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
 * Dev-time guard: verify every card obeys its format's rules. Returns a list of
 * human-readable violations (empty when valid). Run in __DEV__ on startup.
 */
export function validateCards(cards: LessonCard[]): string[] {
  const problems: string[] = [];
  const learned = new Set<string>();

  for (const card of cards) {
    if (!card.options.includes(card.answer)) {
      problems.push(`Card ${card.order}: options missing answer "${card.answer}"`);
    }

    if (card.kind === 'word') {
      // Introduces exactly one new word; context sentence reuses known words.
      if (card.answer !== card.newWord) {
        problems.push(`Card ${card.order}: word answer "${card.answer}" != newWord "${card.newWord}"`);
      }
      if (card.sentence) {
        for (const token of tokenize(card.sentence)) {
          if (token === card.newWord || FUNCTION_WORDS.has(token)) continue;
          if (!learned.has(token)) {
            problems.push(`Card ${card.order} ("${card.sentence}"): word "${token}" used before it was taught`);
          }
        }
      }
      learned.add(card.newWord);
    } else {
      // 'sentence' practice: introduces nothing — every option word is known.
      if (!learned.has(card.newWord)) {
        problems.push(`Card ${card.order}: focal word "${card.newWord}" not taught yet`);
      }
      for (const option of card.options) {
        for (const token of tokenize(option)) {
          if (FUNCTION_WORDS.has(token)) continue;
          if (!learned.has(token)) {
            problems.push(`Card ${card.order} ("${option}"): word "${token}" used before it was taught`);
          }
        }
      }
    }
  }
  return problems;
}
