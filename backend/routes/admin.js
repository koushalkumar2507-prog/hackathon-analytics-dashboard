const express = require("express");
const router = express.Router();

const db = require("../database/db");


// ─────────────────────────────────────────────
// GET ALL SUBMISSIONS
// ─────────────────────────────────────────────
router.get("/submissions", (req, res) => {

  const query = `
    SELECT *
    FROM submissions
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {

    if (err) {

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    return res.json(results);

  });

});


// ─────────────────────────────────────────────
// UPDATE SCORE + STATUS
// ─────────────────────────────────────────────
router.put("/submissions/:id", (req, res) => {

  const { score, status } = req.body;

  const query = `
    UPDATE submissions
    SET score = ?, status = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      score,
      status,
      req.params.id
    ],
    (err, result) => {

      if (err) {

        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.json({
        success: true,
        message: "Submission updated"
      });

    }
  );

});

module.exports = router;