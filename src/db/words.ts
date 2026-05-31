import { getDatabase } from './database';
import type { Word, WordStatus, UserWord } from '../types';

interface WordRow {
  id: number;
  word: string;
  level: string;
  category: string;
  image: string | null;
  seq: number;
}

function toWord(r: WordRow): Word {
  return {
    id: r.id,
    word: r.word,
    level: r.level as Word['level'],
    category: r.category,
    image: r.image,
  };
}

/** All words for a level, in learning sequence order. */
export async function getWordsByLevel(level: string): Promise<Word[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<WordRow>(
    'SELECT * FROM words WHERE level = ? ORDER BY seq ASC',
    level
  );
  return rows.map(toWord);
}

interface UserWordRow {
  word_id: number;
  status: WordStatus;
  review_count: number;
  correct_count: number;
  next_review_at: number | null;
}

function toUserWord(r: UserWordRow): UserWord {
  return {
    wordId: r.word_id,
    status: r.status,
    reviewCount: r.review_count,
    correctCount: r.correct_count,
    nextReviewAt: r.next_review_at,
  };
}

/** Progress rows keyed by word id. Missing entries mean status 'new'. */
export async function getUserWordMap(): Promise<Map<number, UserWord>> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<UserWordRow>('SELECT * FROM user_words');
  return new Map(rows.map((r) => [r.word_id, toUserWord(r)]));
}

/**
 * Record an answer for a word, advancing its status. Correct answers move
 * new -> learning -> known -> mastered after enough correct reviews.
 */
export async function recordAnswer(
  wordId: number,
  correct: boolean
): Promise<void> {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<UserWordRow>(
    'SELECT * FROM user_words WHERE word_id = ?',
    wordId
  );

  const reviewCount = (existing?.review_count ?? 0) + 1;
  const correctCount = (existing?.correct_count ?? 0) + (correct ? 1 : 0);
  const status = nextStatus(correctCount, correct);

  if (existing) {
    await db.runAsync(
      'UPDATE user_words SET status = ?, review_count = ?, correct_count = ? WHERE word_id = ?',
      status,
      reviewCount,
      correctCount,
      wordId
    );
  } else {
    await db.runAsync(
      'INSERT INTO user_words (word_id, status, review_count, correct_count) VALUES (?, ?, ?, ?)',
      wordId,
      status,
      reviewCount,
      correctCount
    );
  }
}

function nextStatus(correctCount: number, correct: boolean): WordStatus {
  if (!correct) return 'learning';
  if (correctCount >= 5) return 'mastered';
  if (correctCount >= 2) return 'known';
  return 'learning';
}
