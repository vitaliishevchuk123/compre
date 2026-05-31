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
 * Exercise format:
 * - 'word': image + a context sentence; options are single WORDS, pick one.
 * - 'sentence': image only; options are three near-identical SENTENCES that
 *   differ by one swapped word — pick the one matching the image.
 */
export type ExerciseKind = 'word' | 'sentence';

/**
 * A single learning card. `newWord` is the focal word; on 'word' cards it is the
 * one new word being introduced (every other content word is already known), on
 * 'sentence' cards it is the swapped word being practiced (all words already
 * known). The image conveys meaning instead of a translation.
 */
export interface LessonCard {
  /** position in the level sequence; defines what counts as "already learned". */
  order: number;
  kind: ExerciseKind;
  newWord: string;
  /** previously-learned words reused on this card (for display + invariant checks). */
  knownWords: string[];
  /** 'word': CI context sentence (or null for first intros). 'sentence': null. */
  sentence: string | null;
  /** scene image key into the image registry. */
  imageKey: string;
  /** options: WORDS for 'word' cards, full SENTENCES for 'sentence' cards. */
  options: string[];
  /** correct option (a word or a full sentence depending on `kind`). */
  answer: string;
  category: string;
}
