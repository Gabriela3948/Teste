const express = require('express');
const router = express.Router();
const { getDb } = require('../database/schema');
const { v4: uuidv4 } = require('uuid');

// Get user profile
router.get('/:id', (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Create user profile
router.post('/', (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const {
    name, email, birth_date, weight, height, occupation, lifestyle,
    pre_existing_conditions, medications, sleep_goal_hours, daily_calorie_goal
  } = req.body;

  db.prepare(`
    INSERT INTO users (id, name, email, birth_date, weight, height, occupation, lifestyle, pre_existing_conditions, medications, sleep_goal_hours, daily_calorie_goal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, email, birth_date, weight, height, occupation, lifestyle,
         pre_existing_conditions, medications, sleep_goal_hours || 8, daily_calorie_goal || 2000);

  res.json({ id, ...req.body });
});

// Update user profile
router.put('/:id', (req, res) => {
  const db = getDb();
  const fields = ['name','email','birth_date','weight','height','occupation','lifestyle',
    'pre_existing_conditions','medications','sleep_goal_hours','daily_calorie_goal',
    'disc_profile','disc_scores','onboarding_completed'];
  const updates = fields.filter(f => req.body[f] !== undefined);
  if (!updates.length) return res.json({ success: true });

  const set = updates.map(f => `${f} = ?`).join(', ');
  const vals = updates.map(f => req.body[f]);
  db.prepare(`UPDATE users SET ${set}, updated_at = datetime('now') WHERE id = ?`).run(...vals, req.params.id);
  res.json({ success: true });
});

// Save DISC test results
router.post('/:id/disc', (req, res) => {
  const db = getDb();
  const { disc_profile, disc_scores } = req.body;
  db.prepare(`UPDATE users SET disc_profile = ?, disc_scores = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(disc_profile, JSON.stringify(disc_scores), req.params.id);
  res.json({ success: true, disc_profile });
});

module.exports = router;
