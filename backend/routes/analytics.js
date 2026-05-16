const express = require("express");
const router = express.Router();

const db = require("../database/db");

const verifyToken =
  require("../middleware/authMiddleware");


// ─────────────────────────────────────────────
// GET LEADERBOARD
// ─────────────────────────────────────────────
router.get("/leaderboard", verifyToken, (req, res) => {

  const query = `
    SELECT
      id,
      team_name AS team,
      project_title,
      score,
      status,
      github_link,
      demo_link
    FROM submissions
    ORDER BY score DESC
  `;

  db.query(query, (err, results) => {

    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    const rankedResults = results.map((team, index) => ({
      rank: index + 1,
      ...team
    }));

    return res.json(rankedResults);

  });

});


// ─────────────────────────────────────────────
// UPDATE TEAM SCORE
// ─────────────────────────────────────────────
router.put("/score/:id", verifyToken, (req, res) => {

  const { score, status } = req.body;

  const submissionId = req.params.id;

  const query = `
    UPDATE submissions
    SET score = ?, status = ?
    WHERE id = ?
  `;

  db.query(query, [score, status, submissionId], (err, result) => {

    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    return res.json({
      success: true,
      message: "Score updated successfully"
    });

  });

});


module.exports = router;