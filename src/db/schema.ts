// SQLite schema. Mirrors PLAN.md (words, user_words, lessons, statistics).
// `words.image` is intentionally flexible: it holds an imageKey today and can
// hold a remote URI later without a migration.
export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS words (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  word      TEXT NOT NULL UNIQUE,
  level     TEXT NOT NULL,
  category  TEXT NOT NULL,
  image     TEXT,
  seq       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_words (
  word_id        INTEGER PRIMARY KEY REFERENCES words(id),
  status         TEXT NOT NULL DEFAULT 'new',
  review_count   INTEGER NOT NULL DEFAULT 0,
  correct_count  INTEGER NOT NULL DEFAULT 0,
  next_review_at INTEGER
);

CREATE TABLE IF NOT EXISTS lessons (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  date          INTEGER NOT NULL,
  words_learned INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS statistics (
  id             INTEGER PRIMARY KEY CHECK (id = 1),
  total_words    INTEGER NOT NULL DEFAULT 0,
  mastered_words INTEGER NOT NULL DEFAULT 0,
  streak         INTEGER NOT NULL DEFAULT 0,
  last_active    INTEGER
);

INSERT OR IGNORE INTO statistics (id) VALUES (1);
`;
