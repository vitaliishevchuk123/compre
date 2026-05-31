export const SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS words (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  word        TEXT NOT NULL UNIQUE,
  level       TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  image       TEXT,
  seq         INTEGER NOT NULL DEFAULT 0
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
