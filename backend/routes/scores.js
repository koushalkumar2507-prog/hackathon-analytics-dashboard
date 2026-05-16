// routes/scores.js
const express = require("express");
const router  = express.Router();
const db      = require("../database/db");

// ── POST /api/scores — Judge submits a score ─────────────
router.post("/", (req, res) => {
  const { submission_id, judge_id, innovation, technical, presentation, impact, notes } = req.body;

  if (!submission_id || !judge_id) {
    return res.status(400).json({
      success: false,
      message: "submission_id and judge_id are required",
    });
  }

  const fields = { innovation, technical, presentation, impact };
  for (const [key, val] of Object.entries(fields)) {
    if (val === undefined || val === null) {
      return res.status(400).json({ success: false, message: `${key} score is required` });
    }
    if (val < 0 || val > 10) {
      return res.status(400).json({ success: false, message: `${key} must be between 0 and 10` });
    }
  }

  try {
    // Insert score
    db.prepare(`
      INSERT INTO scores (submission_id, judge_id, innovation, technical, presentation, impact, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(submission_id, judge_id, innovation, technical, presentation, impact, notes || null);

    // Recalculate average score for this submission
    const avg = db.prepare(`
      SELECT ROUND(AVG((innovation + technical + presentation + impact) / 4.0 * 10), 1) AS avg_score
      FROM scores WHERE submission_id = ?
    `).get(submission_id);

    db.prepare(`UPDATE submissions SET score = ? WHERE id = ?`)
      .run(avg.avg_score, submission_id);

    res.status(201).json({
      success: true,
      message: "Score submitted and average updated",
      avg_score: avg.avg_score,
    });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({
        success: false,
        message: "This judge has already scored this submission",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/scores/submission/:id — All scores for a submission
router.get("/submission/:id", (req, res) => {
  try {
    const scores = db.prepare(`
      SELECT sc.*, j.name AS judge_name,
        ROUND((sc.innovation + sc.technical + sc.presentation + sc.impact) / 4.0 * 10, 1) AS total
      FROM scores sc
      JOIN judges j ON j.id = sc.judge_id
      WHERE sc.submission_id = ?
    `).all(req.params.id);

    res.json({ success: true, data: scores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
