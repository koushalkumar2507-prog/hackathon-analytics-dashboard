const express = require("express");
const router = express.Router();

const db = require("../database/db");


// ─────────────────────────────────────────────
// GET ALL SUBMISSIONS
// ─────────────────────────────────────────────
router.get("/", (req, res) => {

  const query = `
    SELECT *
    FROM submissions
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    return res.json(results);

  });

});


// ─────────────────────────────────────────────
// CREATE SUBMISSION
// ─────────────────────────────────────────────
router.post("/", (req, res) => {

  const {
    team_name,
    project_title,
    github_link,
    demo_link,
    description
  } = req.body;

  if (
    !team_name ||
    !project_title ||
    !github_link
  ) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing"
    });
  }

  const query = `
    INSERT INTO submissions
    (
      team_name,
      project_title,
      github_link,
      demo_link,
      description
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      team_name,
      project_title,
      github_link,
      demo_link,
      description
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          success: false,
          error: err.message
        });
      }

      return res.json({
        success: true,
        message: "Submission successful"
      });

    }
  );

});


// ─────────────────────────────────────────────
// DELETE SUBMISSION
// ─────────────────────────────────────────────
router.delete("/:id", (req, res) => {

  const query = `
    DELETE FROM submissions
    WHERE id = ?
  `;

  db.query(query, [req.params.id], (err, result) => {

    if (err) {

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }

    return res.json({
      success: true,
      message: "Submission deleted"
    });

  });

});

module.exports = router;