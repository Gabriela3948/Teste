const express = require('express');
const router = express.Router();
const { getDb } = require('../database/schema');
const { v4: uuidv4 } = require('uuid');
const { generateWeeklyReport, generateMonthlyReport } = require('../services/aiService');

function getWeekDates(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0]
  };
}

// Analytics overview for dashboard
router.get('/:userId/analytics', (req, res) => {
  const db = getDb();
  const { from, to } = req.query;
  const userId = req.params.userId;

  const dateFilter = from && to ? `AND entry_date BETWEEN '${from}' AND '${to}'` : "AND entry_date >= date('now', '-30 days')";

  const entries = db.prepare(`SELECT * FROM daily_entries WHERE user_id = ? ${dateFilter} ORDER BY entry_date`).all(userId);
  const meals = db.prepare(`SELECT entry_date, SUM(estimated_calories) as total_calories, COUNT(CASE WHEN compulsion_flag=1 THEN 1 END) as compulsions FROM meals WHERE user_id = ? ${dateFilter} GROUP BY entry_date`).all(userId);
  const exercises = db.prepare(`SELECT entry_date, SUM(duration_minutes) as total_minutes, COUNT(*) as sessions FROM exercises WHERE user_id = ? ${dateFilter} GROUP BY entry_date`).all(userId);
  const sleep = db.prepare(`SELECT entry_date, total_hours, quality_score FROM sleep_entries WHERE user_id = ? ${dateFilter} ORDER BY entry_date`).all(userId);
  const moods = db.prepare(`SELECT entry_date, AVG(mood_score) as avg_mood, AVG(energy_level) as avg_energy, AVG(anxiety_level) as avg_anxiety FROM mood_entries WHERE user_id = ? ${dateFilter} GROUP BY entry_date`).all(userId);

  const avgProductivity = entries.length ? Math.round(entries.reduce((s, e) => s + (e.productivity_score || 0), 0) / entries.length) : 0;
  const totalCompulsions = meals.reduce((s, m) => s + m.compulsions, 0);
  const exerciseDays = exercises.filter(e => e.total_minutes > 0).length;
  const avgSleep = sleep.length ? (sleep.reduce((s, e) => s + (e.total_hours || 0), 0) / sleep.length).toFixed(1) : 0;
  const avgMood = moods.length ? (moods.reduce((s, m) => s + m.avg_mood, 0) / moods.length).toFixed(1) : 0;

  res.json({
    entries,
    meals_by_date: meals,
    exercises_by_date: exercises,
    sleep_by_date: sleep,
    moods_by_date: moods,
    summary: {
      avg_productivity: avgProductivity,
      total_compulsions: totalCompulsions,
      exercise_days: exerciseDays,
      avg_sleep_hours: parseFloat(avgSleep),
      avg_mood: parseFloat(avgMood),
      total_days: entries.length
    }
  });
});

// Generate weekly report
router.post('/:userId/weekly', async (req, res) => {
  const db = getDb();
  const { date } = req.body;
  const { userId } = req.params;
  const { start, end } = getWeekDates(date || new Date().toISOString().split('T')[0]);

  try {
    const existing = db.prepare('SELECT * FROM weekly_reports WHERE user_id=? AND week_start=?').get(userId, start);
    if (existing && !req.body.force) {
      const report = { ...existing };
      try { report.report_data = JSON.parse(report.report_data); } catch(e) {}
      try { report.ai_analysis = JSON.parse(report.ai_analysis); } catch(e) {}
      return res.json(report);
    }

    const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    const goals = db.prepare('SELECT * FROM goals WHERE user_id=? AND active=1').all(userId);
    const dailyEntries = db.prepare(`SELECT * FROM daily_entries WHERE user_id=? AND entry_date BETWEEN ? AND ? ORDER BY entry_date`).all(userId, start, end);

    const analysis = await generateWeeklyReport({ user, goals, dailyEntries, weekStart: start, weekEnd: end });

    const reportData = {
      week_start: start, week_end: end,
      daily_entries: dailyEntries.length,
      overall_score: analysis.overall_score
    };

    if (existing) {
      db.prepare('UPDATE weekly_reports SET report_data=?, ai_analysis=? WHERE id=?')
        .run(JSON.stringify(reportData), JSON.stringify(analysis), existing.id);
    } else {
      db.prepare(`INSERT INTO weekly_reports (id, user_id, week_start, week_end, report_data, ai_analysis) VALUES (?,?,?,?,?,?)`)
        .run(uuidv4(), userId, start, end, JSON.stringify(reportData), JSON.stringify(analysis));
    }

    res.json({ week_start: start, week_end: end, report_data: reportData, ai_analysis: analysis });
  } catch (err) {
    console.error('Weekly report error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Generate monthly report
router.post('/:userId/monthly', async (req, res) => {
  const db = getDb();
  const { year, month } = req.body;
  const { userId } = req.params;

  try {
    const existing = db.prepare('SELECT * FROM monthly_reports WHERE user_id=? AND year=? AND month=?').get(userId, year, month);
    if (existing && !req.body.force) {
      const report = { ...existing };
      try { report.report_data = JSON.parse(report.report_data); } catch(e) {}
      try { report.ai_analysis = JSON.parse(report.ai_analysis); } catch(e) {}
      return res.json(report);
    }

    const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    const goals = db.prepare('SELECT * FROM goals WHERE user_id=? AND active=1').all(userId);
    const weeklyReports = db.prepare(`SELECT * FROM weekly_reports WHERE user_id=? AND strftime('%Y', week_start)=? AND strftime('%m', week_start)=?`)
      .all(userId, String(year), String(month).padStart(2, '0'));

    const weeklyData = weeklyReports.map(w => {
      const data = { week_start: w.week_start, week_end: w.week_end };
      try { Object.assign(data, JSON.parse(w.ai_analysis)); } catch(e) {}
      return data;
    });

    const analysis = await generateMonthlyReport({ user, goals, weeklyData, year, month });

    if (existing) {
      db.prepare('UPDATE monthly_reports SET report_data=?, ai_analysis=? WHERE id=?')
        .run(JSON.stringify({ year, month }), JSON.stringify(analysis), existing.id);
    } else {
      db.prepare(`INSERT INTO monthly_reports (id, user_id, year, month, report_data, ai_analysis) VALUES (?,?,?,?,?,?)`)
        .run(uuidv4(), userId, year, month, JSON.stringify({ year, month }), JSON.stringify(analysis));
    }

    res.json({ year, month, ai_analysis: analysis });
  } catch (err) {
    console.error('Monthly report error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all reports list
router.get('/:userId/history', (req, res) => {
  const db = getDb();
  const weekly = db.prepare('SELECT id, week_start, week_end, created_at FROM weekly_reports WHERE user_id=? ORDER BY week_start DESC LIMIT 20').all(req.params.userId);
  const monthly = db.prepare('SELECT id, year, month, created_at FROM monthly_reports WHERE user_id=? ORDER BY year DESC, month DESC LIMIT 12').all(req.params.userId);
  res.json({ weekly, monthly });
});

module.exports = router;
