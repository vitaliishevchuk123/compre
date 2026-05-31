import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';
import { A1_CARDS } from '../data/seed/a1';

const DB_NAME = 'english-input.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Open (once) and lazily initialize the database: schema + first-run seed. */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DB_NAME);
      await db.execAsync(SCHEMA_SQL);
      await seedIfEmpty(db);
      return db;
    })();
  }
  return dbPromise;
}

/** Seed the words table from lesson content on first launch only. */
async function seedIfEmpty(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM words'
  );
  if (row && row.count > 0) return;

  await db.withTransactionAsync(async () => {
    for (const card of A1_CARDS) {
      await db.runAsync(
        'INSERT OR IGNORE INTO words (word, level, category, image, seq) VALUES (?, ?, ?, ?, ?)',
        card.newWord,
        'A1',
        card.category,
        card.imageKey,
        card.order
      );
    }
  });
}

/** Test/util hook: wipe progress and re-seed. Not used in normal flow. */
export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(
    'DELETE FROM user_words; DELETE FROM words; DELETE FROM lessons; UPDATE statistics SET total_words=0, mastered_words=0, streak=0, last_active=NULL WHERE id=1;'
  );
  await seedIfEmpty(db);
}
