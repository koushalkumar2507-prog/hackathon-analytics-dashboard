// routes/judges.js
const express = require("express");
const router  = express.Router();
const db      = require("../database/db");

// ── GET /api/judges ──────────────────────────────────────
router.get("/", (req, res) => {
  try {
    const judges = db.prepare(`
      SELECT j.*, COUNT(sc.id) AS scores_given
      FROM judges j
      LEFT JOIN scores sc ON sc.judge_id = j.id
      GROUP BY j.id
      ORDER BY j.name
    `).all();
    res.json({ success: true, data: judges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/judges ─────────────────────────────────────
router.post("/", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "name and email are required" });
  }
  try {
    const result = db.prepare(`INSERT INTO judges (name, email) VALUES (?, ?)`)
      .run(name.trim(), email.trim().toLowerCase());
    const judge = db.prepare(`SELECT * FROM judges WHERE id = ?`)
      .get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: judge });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/judges/:id ────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    const result = db.prepare(`DELETE FROM judges WHERE id = ?`).run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: "Judge not found" });
    }
    res.json({ success: true, message: "Judge removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
