import { getDatabase } from './database';

export interface Statistics {
  totalWords: number;
  masteredWords: number;
  streak: number;
  lessonsCompleted: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Live dashboard stats, computed from user_words plus the streak counter. */
export async function getStatistics(): Promise<Statistics> {
  const db = await getDatabase();

  const learned = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM user_words WHERE status != 'new'"
  );
  const mastered = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM user_words WHERE status = 'mastered'"
  );
  const lessons = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM lessons'
  );
  const stats = await db.getFirstAsync<{ streak: number }>(
    'SELECT streak FROM statistics WHERE id = 1'
  );

  return {
    totalWords: learned?.count ?? 0,
    masteredWords: mastered?.count ?? 0,
    streak: stats?.streak ?? 0,
    lessonsCompleted: lessons?.count ?? 0,
  };
}

/**
 * Record a finished lesson and update the daily streak. Same-day completions
 * keep the streak; a one-day gap continues it; a longer gap resets to 1.
 */
export async function completeLesson(wordsLearned: number): Promise<void> {
  const db = await getDatabase();
  const now = Date.now();

  await db.runAsync(
    'INSERT INTO lessons (date, words_learned) VALUES (?, ?)',
    now,
    wordsLearned
  );

  const row = await db.getFirstAsync<{ streak: number; last_active: number | null }>(
    'SELECT streak, last_active FROM statistics WHERE id = 1'
  );
  const streak = computeStreak(row?.streak ?? 0, row?.last_active ?? null, now);

  await db.runAsync(
    'UPDATE statistics SET streak = ?, last_active = ? WHERE id = 1',
    streak,
    now
  );
}

function computeStreak(
  current: number,
  lastActive: number | null,
  now: number
): number {
  if (lastActive == null) return 1;
  const dayDiff = Math.floor(now / DAY_MS) - Math.floor(lastActive / DAY_MS);
  if (dayDiff === 0) return Math.max(current, 1); // already counted today
  if (dayDiff === 1) return current + 1; // consecutive day
  return 1; // streak broken
}
