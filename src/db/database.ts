import * as SQLite from 'expo-sqlite';
import { SCHEMA_SQL } from './schema';
import { A1_CARDS } from '../data/seed/a1';

const DB_NAME = 'compre-v2.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

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

async function seedIfEmpty(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM words'
  );
  if (row && row.count > 0) return;

  await db.withTransactionAsync(async () => {
    // Collect unique categories in order of appearance
    const seen = new Set<string>();
    const categories: string[] = [];
    for (const card of A1_CARDS) {
      if (!seen.has(card.category)) {
        seen.add(card.category);
        categories.push(card.category);
      }
    }

    // Insert categories and build name → id map
    const categoryIdMap = new Map<string, number>();
    for (const name of categories) {
      await db.runAsync(
        'INSERT OR IGNORE INTO categories (name) VALUES (?)',
        name
      );
      const r = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM categories WHERE name = ?',
        name
      );
      if (r) categoryIdMap.set(name, r.id);
    }

    // Insert words with category_id
    for (const card of A1_CARDS) {
      const categoryId = categoryIdMap.get(card.category)!;
      await db.runAsync(
        'INSERT OR IGNORE INTO words (word, level, category_id, image, seq) VALUES (?, ?, ?, ?, ?)',
        card.newWord,
        'A1',
        categoryId,
        card.imageKey,
        card.order
      );
    }
  });
}

export async function resetDatabase(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(
    'DELETE FROM user_words; DELETE FROM words; DELETE FROM categories; DELETE FROM lessons; UPDATE statistics SET total_words=0, mastered_words=0, streak=0, last_active=NULL WHERE id=1;'
  );
  await seedIfEmpty(db);
}
