const express = require('express');
const router = express.Router();
const { getDb } = require('../database/schema');
const { v4: uuidv4 } = require('uuid');

router.get('/:userId', (req, res) => {
  const db = getDb();
  const goals = db.prepare('SELECT * FROM goals WHERE user_id = ? AND active = 1 ORDER BY priority').all(req.params.userId);
  res.json(goals);
});

router.post('/:userId', (req, res) => {
  const db = getDb();
  const id = uuidv4();
  const { category, title, description, target_value, target_unit, deadline, priority } = req.body;
  db.prepare(`
    INSERT INTO goals (id, user_id, category, title, description, target_value, target_unit, deadline, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.params.userId, category, title, description, target_value, target_unit, deadline, priority || 1);
  res.json({ id, ...req.body });
});

router.put('/:userId/:goalId', (req, res) => {
  const db = getDb();
  const { title, description, target_value, deadline, priority, active } = req.body;
  db.prepare(`
    UPDATE goals SET title=?, description=?, target_value=?, deadline=?, priority=?, active=? WHERE id=? AND user_id=?
  `).run(title, description, target_value, deadline, priority, active, req.params.goalId, req.params.userId);
  res.json({ success: true });
});

router.delete('/:userId/:goalId', (req, res) => {
  const db = getDb();
  db.prepare('UPDATE goals SET active = 0 WHERE id = ? AND user_id = ?').run(req.params.goalId, req.params.userId);
  res.json({ success: true });
});

module.exports = router;
