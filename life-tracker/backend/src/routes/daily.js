const express = require('express');
const router = express.Router();
const { getDb } = require('../database/schema');
const { v4: uuidv4 } = require('uuid');
const { analyzeDailyEntry, estimateCalories } = require('../services/aiService');

function getDailyData(db, userId, date) {
  const entry = db.prepare('SELECT * FROM daily_entries WHERE user_id = ? AND entry_date = ?').get(userId, date);
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? AND entry_date = ? ORDER BY created_at').all(userId, date);
  const meals = db.prepare('SELECT * FROM meals WHERE user_id = ? AND entry_date = ? ORDER BY meal_type').all(userId, date);
  const exercises = db.prepare('SELECT * FROM exercises WHERE user_id = ? AND entry_date = ?').all(userId, date);
  const moods = db.prepare('SELECT * FROM mood_entries WHERE user_id = ? AND entry_date = ? ORDER BY created_at').all(userId, date);
  const sleep = db.prepare('SELECT * FROM sleep_entries WHERE user_id = ? AND entry_date = ?').get(userId, date);
  const body = db.prepare('SELECT * FROM body_entries WHERE user_id = ? AND entry_date = ?').get(userId, date);
  const menstrual = db.prepare('SELECT * FROM menstrual_entries WHERE user_id = ? AND entry_date = ?').get(userId, date);

  return { entry, tasks, meals, exercises, moods, sleep, body, menstrual };
}

// Get full daily entry
router.get('/:userId/:date', (req, res) => {
  const db = getDb();
  const data = getDailyData(db, req.params.userId, req.params.date);
  if (data.entry?.ai_analysis) {
    try { data.entry.ai_analysis = JSON.parse(data.entry.ai_analysis); } catch(e) {}
  }
  res.json(data);
});

// Get list of dates with entries
router.get('/:userId', (req, res) => {
  const db = getDb();
  const { from, to } = req.query;
  let query = 'SELECT entry_date, productivity_score, work_hours, selfcare_hours, procrastination_hours FROM daily_entries WHERE user_id = ?';
  const params = [req.params.userId];
  if (from) { query += ' AND entry_date >= ?'; params.push(from); }
  if (to) { query += ' AND entry_date <= ?'; params.push(to); }
  query += ' ORDER BY entry_date DESC';
  const entries = db.prepare(query).all(...params);
  res.json(entries);
});

// Upsert daily entry
router.post('/:userId/:date', (req, res) => {
  const db = getDb();
  const { userId, date } = req.params;
  const { general_notes, work_hours, selfcare_hours, procrastination_hours } = req.body;

  const existing = db.prepare('SELECT id FROM daily_entries WHERE user_id = ? AND entry_date = ?').get(userId, date);
  if (existing) {
    db.prepare(`UPDATE daily_entries SET general_notes=?, work_hours=?, selfcare_hours=?, procrastination_hours=?, updated_at=datetime('now') WHERE user_id=? AND entry_date=?`)
      .run(general_notes, work_hours, selfcare_hours, procrastination_hours, userId, date);
  } else {
    db.prepare(`INSERT INTO daily_entries (id, user_id, entry_date, general_notes, work_hours, selfcare_hours, procrastination_hours) VALUES (?,?,?,?,?,?,?)`)
      .run(uuidv4(), userId, date, general_notes, work_hours || 0, selfcare_hours || 0, procrastination_hours || 0);
  }
  res.json({ success: true });
});

// TASKS
router.post('/:userId/:date/tasks', (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { title, category, completed, duration_minutes, priority, notes } = req.body;
  db.prepare(`INSERT INTO tasks (id, user_id, entry_date, title, category, completed, duration_minutes, priority, notes) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(id, req.params.userId, req.params.date, title, category, completed ? 1 : 0, duration_minutes || 0, priority || 'medium', notes);
  res.json({ id });
});

router.put('/:userId/:date/tasks/:taskId', (req, res) => {
  const db = getDb();
  const { title, category, completed, duration_minutes, priority, notes } = req.body;
  db.prepare('UPDATE tasks SET title=?, category=?, completed=?, duration_minutes=?, priority=?, notes=? WHERE id=? AND user_id=?')
    .run(title, category, completed ? 1 : 0, duration_minutes, priority, notes, req.params.taskId, req.params.userId);
  res.json({ success: true });
});

router.delete('/:userId/:date/tasks/:taskId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM tasks WHERE id=? AND user_id=?').run(req.params.taskId, req.params.userId);
  res.json({ success: true });
});

// MEALS
router.post('/:userId/:date/meals', async (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { meal_type, description, estimated_calories, quality_score, compulsion_flag, notes } = req.body;

  let calories = estimated_calories;
  if (!calories && description) {
    const estimate = await estimateCalories(description, meal_type);
    calories = estimate.calories;
  }

  db.prepare(`INSERT INTO meals (id, user_id, entry_date, meal_type, description, estimated_calories, quality_score, compulsion_flag, notes) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(id, req.params.userId, req.params.date, meal_type, description, calories, quality_score, compulsion_flag ? 1 : 0, notes);
  res.json({ id, estimated_calories: calories });
});

router.put('/:userId/:date/meals/:mealId', (req, res) => {
  const db = getDb();
  const { meal_type, description, estimated_calories, quality_score, compulsion_flag, notes } = req.body;
  db.prepare('UPDATE meals SET meal_type=?, description=?, estimated_calories=?, quality_score=?, compulsion_flag=?, notes=? WHERE id=? AND user_id=?')
    .run(meal_type, description, estimated_calories, quality_score, compulsion_flag ? 1 : 0, notes, req.params.mealId, req.params.userId);
  res.json({ success: true });
});

router.delete('/:userId/:date/meals/:mealId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM meals WHERE id=? AND user_id=?').run(req.params.mealId, req.params.userId);
  res.json({ success: true });
});

// EXERCISES
router.post('/:userId/:date/exercises', (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { exercise_type, duration_minutes, intensity, calories_burned, notes } = req.body;
  db.prepare(`INSERT INTO exercises (id, user_id, entry_date, exercise_type, duration_minutes, intensity, calories_burned, notes) VALUES (?,?,?,?,?,?,?,?)`)
    .run(id, req.params.userId, req.params.date, exercise_type, duration_minutes, intensity || 'moderate', calories_burned, notes);
  res.json({ id });
});

router.delete('/:userId/:date/exercises/:exId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM exercises WHERE id=? AND user_id=?').run(req.params.exId, req.params.userId);
  res.json({ success: true });
});

// MOOD
router.post('/:userId/:date/mood', (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { time_of_day, mood_score, emotions, energy_level, anxiety_level, triggers, observations } = req.body;
  db.prepare(`INSERT INTO mood_entries (id, user_id, entry_date, time_of_day, mood_score, emotions, energy_level, anxiety_level, triggers, observations) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(id, req.params.userId, req.params.date, time_of_day, mood_score, emotions, energy_level, anxiety_level, triggers, observations);
  res.json({ id });
});

router.delete('/:userId/:date/mood/:moodId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM mood_entries WHERE id=? AND user_id=?').run(req.params.moodId, req.params.userId);
  res.json({ success: true });
});

// SLEEP
router.post('/:userId/:date/sleep', (req, res) => {
  const db = getDb();
  const { bedtime, wake_time, total_hours, quality_score, interruptions, notes } = req.body;
  const existing = db.prepare('SELECT id FROM sleep_entries WHERE user_id=? AND entry_date=?').get(req.params.userId, req.params.date);

  let hours = total_hours;
  if (!hours && bedtime && wake_time) {
    const [bh, bm] = bedtime.split(':').map(Number);
    const [wh, wm] = wake_time.split(':').map(Number);
    let diff = (wh * 60 + wm) - (bh * 60 + bm);
    if (diff < 0) diff += 1440;
    hours = parseFloat((diff / 60).toFixed(1));
  }

  if (existing) {
    db.prepare('UPDATE sleep_entries SET bedtime=?, wake_time=?, total_hours=?, quality_score=?, interruptions=?, notes=? WHERE id=?')
      .run(bedtime, wake_time, hours, quality_score, interruptions || 0, notes, existing.id);
  } else {
    db.prepare(`INSERT INTO sleep_entries (id, user_id, entry_date, bedtime, wake_time, total_hours, quality_score, interruptions, notes) VALUES (?,?,?,?,?,?,?,?,?)`)
      .run(uuidv4(), req.params.userId, req.params.date, bedtime, wake_time, hours, quality_score, interruptions || 0, notes);
  }
  res.json({ success: true, total_hours: hours });
});

// BODY
router.post('/:userId/:date/body', (req, res) => {
  const db = getDb();
  const { weight, energy_feeling, physical_symptoms, body_notes } = req.body;
  const existing = db.prepare('SELECT id FROM body_entries WHERE user_id=? AND entry_date=?').get(req.params.userId, req.params.date);

  if (existing) {
    db.prepare('UPDATE body_entries SET weight=?, energy_feeling=?, physical_symptoms=?, body_notes=? WHERE id=?')
      .run(weight, energy_feeling, physical_symptoms, body_notes, existing.id);
  } else {
    db.prepare(`INSERT INTO body_entries (id, user_id, entry_date, weight, energy_feeling, physical_symptoms, body_notes) VALUES (?,?,?,?,?,?,?)`)
      .run(uuidv4(), req.params.userId, req.params.date, weight, energy_feeling, physical_symptoms, body_notes);
  }
  res.json({ success: true });
});

// MENSTRUAL
router.post('/:userId/:date/menstrual', (req, res) => {
  const db = getDb();
  const { phase, flow_intensity, cramps_level, mood_impact, symptoms, notes } = req.body;
  const existing = db.prepare('SELECT id FROM menstrual_entries WHERE user_id=? AND entry_date=?').get(req.params.userId, req.params.date);

  if (existing) {
    db.prepare('UPDATE menstrual_entries SET phase=?, flow_intensity=?, cramps_level=?, mood_impact=?, symptoms=?, notes=? WHERE id=?')
      .run(phase, flow_intensity, cramps_level, mood_impact, symptoms, notes, existing.id);
  } else {
    db.prepare(`INSERT INTO menstrual_entries (id, user_id, entry_date, phase, flow_intensity, cramps_level, mood_impact, symptoms, notes) VALUES (?,?,?,?,?,?,?,?,?)`)
      .run(uuidv4(), req.params.userId, req.params.date, phase, flow_intensity, cramps_level, mood_impact, symptoms, notes);
  }
  res.json({ success: true });
});

// AI ANALYSIS
router.post('/:userId/:date/analyze', async (req, res) => {
  const db = getDb();
  const { userId, date } = req.params;

  try {
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    const goals = db.prepare('SELECT * FROM goals WHERE user_id=? AND active=1').all(userId);
    const dayData = getDailyData(db, userId, date);

    const analysis = await analyzeDailyEntry({
      user, goals, entry_date: date,
      tasks: dayData.tasks,
      meals: dayData.meals,
      exercises: dayData.exercises,
      moods: dayData.moods,
      sleep: dayData.sleep,
      body: dayData.body,
      menstrual: dayData.menstrual,
      general_notes: dayData.entry?.general_notes
    });

    const existing = db.prepare('SELECT id FROM daily_entries WHERE user_id=? AND entry_date=?').get(userId, date);
    if (existing) {
      db.prepare(`UPDATE daily_entries SET ai_analysis=?, productivity_score=?, work_hours=?, selfcare_hours=?, procrastination_hours=?, updated_at=datetime('now') WHERE user_id=? AND entry_date=?`)
        .run(JSON.stringify(analysis), analysis.productivity_score, analysis.work_percentage, analysis.selfcare_percentage, analysis.procrastination_percentage, userId, date);
    } else {
      db.prepare(`INSERT INTO daily_entries (id, user_id, entry_date, ai_analysis, productivity_score, work_hours, selfcare_hours, procrastination_hours) VALUES (?,?,?,?,?,?,?,?)`)
        .run(uuidv4(), userId, date, JSON.stringify(analysis), analysis.productivity_score, analysis.work_percentage, analysis.selfcare_percentage, analysis.procrastination_percentage);
    }

    res.json(analysis);
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
