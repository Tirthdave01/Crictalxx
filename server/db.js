const sqlite = require('node:sqlite');
const DatabaseSync = sqlite.DatabaseSync || sqlite.Database;
const path = require('node:path');

const dbPath = path.join(__dirname, 'crictalxx.db');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for high performance
db.exec('PRAGMA journal_mode = WAL;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    mode TEXT DEFAULT 'standard',
    difficulty TEXT DEFAULT 'Medium',
    question TEXT NOT NULL,
    options TEXT NOT NULL, -- JSON array of 4 strings
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    clues TEXT, -- JSON array of progressive clues
    player_avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    mode TEXT DEFAULT 'standard',
    time_limit_sec INTEGER DEFAULT 180,
    pass_mark_pct INTEGER DEFAULT 80,
    question_ids TEXT, -- JSON array or 'dynamic'
    badge_name TEXT,
    badge_icon TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user', -- 'admin' or 'user'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    quiz_title TEXT NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score_pct REAL NOT NULL,
    time_spent_sec INTEGER NOT NULL,
    certificate_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS certificates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    quiz_title TEXT NOT NULL,
    score_pct REAL NOT NULL,
    tier TEXT NOT NULL,
    signatory_name TEXT DEFAULT 'Tirth',
    signatory_title TEXT DEFAULT 'Founder & Chief Match Referee, Crictalxx',
    issue_date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Safe column migrations for users table if existing table had older schema
try {
  db.exec("ALTER TABLE users ADD COLUMN email TEXT;");
} catch (e) {}
try {
  db.exec("ALTER TABLE users ADD COLUMN password TEXT;");
} catch (e) {}
try {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';");
} catch (e) {}
try {
  db.exec("ALTER TABLE quizzes ADD COLUMN difficulty TEXT DEFAULT 'Medium';");
} catch (e) {}

module.exports = db;
