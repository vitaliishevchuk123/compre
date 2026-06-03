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
 * A single learning card. The `answer` is the focal word — the one new word
 * being introduced (every other content word is already known). The card shows
 * an image plus a context sentence; options are single WORDS, pick one. The
 * image conveys meaning instead of a translation.
 */
export interface LessonCard {
  /** position in the level sequence; defines what counts as "already learned". */
  order: number;
  /** CI context sentence (or null for first intros). */
  sentence: string | null;
  /** scene image key into the image registry. */
  imageKey: string;
  /** options: WORDS to pick one from. */
  options: string[];
  /** correct option. */
  answer: string;
  /** Full phrase spoken aloud after the user answers. Falls back to `answer`. */
  answerPhrase?: string;
  category: string;
}
