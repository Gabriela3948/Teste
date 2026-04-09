const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/lifetracker.db');

let db;

function getDb() {
  if (!db) {
    const fs = require('fs');
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initializeSchema() {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      birth_date TEXT,
      weight REAL,
      height REAL,
      occupation TEXT,
      lifestyle TEXT,
      pre_existing_conditions TEXT,
      medications TEXT,
      sleep_goal_hours REAL DEFAULT 8,
      daily_calorie_goal INTEGER DEFAULT 2000,
      disc_profile TEXT,
      disc_scores TEXT,
      onboarding_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_value REAL,
      target_unit TEXT,
      deadline TEXT,
      priority INTEGER DEFAULT 1,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS daily_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      productivity_score INTEGER,
      work_hours REAL DEFAULT 0,
      selfcare_hours REAL DEFAULT 0,
      procrastination_hours REAL DEFAULT 0,
      general_notes TEXT,
      ai_analysis TEXT,
      ai_recommendations TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, entry_date)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('work', 'personal', 'selfcare', 'procrastination')),
      completed INTEGER DEFAULT 0,
      duration_minutes INTEGER DEFAULT 0,
      priority TEXT DEFAULT 'medium',
      notes TEXT,
      source TEXT DEFAULT 'manual',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS meals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      meal_type TEXT NOT NULL CHECK(meal_type IN ('breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'late_snack')),
      description TEXT NOT NULL,
      estimated_calories INTEGER,
      quality_score INTEGER CHECK(quality_score BETWEEN 1 AND 5),
      compulsion_flag INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      exercise_type TEXT NOT NULL,
      duration_minutes INTEGER NOT NULL,
      intensity TEXT CHECK(intensity IN ('low', 'moderate', 'high')),
      calories_burned INTEGER,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS mood_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      time_of_day TEXT CHECK(time_of_day IN ('morning', 'afternoon', 'evening', 'night')),
      mood_score INTEGER NOT NULL CHECK(mood_score BETWEEN 1 AND 10),
      emotions TEXT,
      energy_level INTEGER CHECK(energy_level BETWEEN 1 AND 10),
      anxiety_level INTEGER CHECK(anxiety_level BETWEEN 1 AND 10),
      triggers TEXT,
      observations TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS sleep_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      bedtime TEXT,
      wake_time TEXT,
      total_hours REAL,
      quality_score INTEGER CHECK(quality_score BETWEEN 1 AND 5),
      interruptions INTEGER DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, entry_date)
    );

    CREATE TABLE IF NOT EXISTS body_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      weight REAL,
      energy_feeling TEXT,
      physical_symptoms TEXT,
      body_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, entry_date)
    );

    CREATE TABLE IF NOT EXISTS menstrual_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      entry_date TEXT NOT NULL,
      phase TEXT CHECK(phase IN ('menstruation', 'follicular', 'ovulation', 'luteal')),
      flow_intensity TEXT CHECK(flow_intensity IN ('none', 'light', 'moderate', 'heavy')),
      cramps_level INTEGER CHECK(cramps_level BETWEEN 0 AND 10),
      mood_impact TEXT,
      symptoms TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, entry_date)
    );

    CREATE TABLE IF NOT EXISTS weekly_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      week_start TEXT NOT NULL,
      week_end TEXT NOT NULL,
      report_data TEXT,
      ai_analysis TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, week_start)
    );

    CREATE TABLE IF NOT EXISTS monthly_reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      year INTEGER NOT NULL,
      month INTEGER NOT NULL,
      report_data TEXT,
      ai_analysis TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, year, month)
    );
  `);

  console.log('Database schema initialized');
}

module.exports = { getDb, initializeSchema };
