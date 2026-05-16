// routes/teams.js
const express = require("express");
const router  = express.Router();
const db      = require("../database/db");

// ── GET /api/teams — List all teams ─────────────────────
router.get("/", (req, res) => {
  try {
    const teams = db.prepare(`
      SELECT
        t.id,
        t.name,
        t.members,
        t.created_at,
        COUNT(s.id)   AS submission_count
      FROM teams t
      LEFT JOIN submissions s ON s.team_id = t.id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).all();

    res.json({ success: true, data: teams });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/teams/:id — Single team with submission ────
router.get("/:id", (req, res) => {
  try {
    const team = db.prepare(`SELECT * FROM teams WHERE id = ?`)
      .get(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const submissions = db.prepare(`
      SELECT * FROM submissions WHERE team_id = ?
    `).all(team.id);

    res.json({ success: true, data: { ...team, submissions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/teams — Register a new team ───────────────
router.post("/", (req, res) => {
  const { name, members } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Team name is required" });
  }

  try {
    const result = db.prepare(`
      INSERT INTO teams (name, members) VALUES (?, ?)
    `).run(name.trim(), members || 1);

    const team = db.prepare(`SELECT * FROM teams WHERE id = ?`)
      .get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: team });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ success: false, message: "Team name already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/teams/:id — Update team ────────────────────
router.put("/:id", (req, res) => {
  const { name, members } = req.body;

  try {
    const existing = db.prepare(`SELECT * FROM teams WHERE id = ?`)
      .get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    db.prepare(`
      UPDATE teams SET name = ?, members = ? WHERE id = ?
    `).run(
      name    ?? existing.name,
      members ?? existing.members,
      req.params.id
    );

    const updated = db.prepare(`SELECT * FROM teams WHERE id = ?`)
      .get(req.params.id);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/teams/:id ────────────────────────────────
router.delete("/:id", (req, res) => {
  try {
    const result = db.prepare(`DELETE FROM teams WHERE id = ?`)
      .run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    res.json({ success: true, message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
