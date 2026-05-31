// Core domain types for English Input.
// Comprehensible Input invariant: every lesson card introduces exactly ONE new
// word; every other word in the card must already be known by the learner.

export type Level = 'A1' | 'A2' | 'B1' | 'B2';

export type WordStatus = 'new' | 'learning' | 'known' | 'mastered';

export interface Word {
  id: number;
  word: string;
  level: Level;
  category: string;
  /** imageKey into the bundled image registry, or a remote URI. Flexible on purpose. */
  image: string | null;
}

export interface UserWord {
  wordId: number;
  status: WordStatus;
  reviewCount: number;
  correctCount: number;
  /** epoch ms of next scheduled review, or null if not scheduled. */
  nextReviewAt: number | null;
}

/**
 * A single learning card. Introduces `newWord` and may show a `sentence` built
 * ONLY from words introduced in earlier cards plus `newWord`. The image conveys
 * meaning instead of a translation.
 */
export interface LessonCard {
  /** position in the level sequence; defines what counts as "already learned". */
  order: number;
  newWord: string;
  /** previously-learned words reused on this card (for display + invariant checks). */
  knownWords: string[];
  /** CI sentence, or null for the first single-word introductions. */
  sentence: string | null;
  /** scene image key into the image registry. */
  imageKey: string;
  /** multiple-choice options: the answer plus distractors drawn from known words. */
  options: string[];
  /** correct option; always equals newWord. */
  answer: string;
  category: string;
}
