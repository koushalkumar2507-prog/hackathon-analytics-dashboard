const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../database/db");


// ─────────────────────────────────────────────
// REGISTER USER
// ─────────────────────────────────────────────
router.post("/register", async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;


  // Validation
  if (!name || !email || !password) {

    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }


  try {

    // Check existing user
    const checkQuery =
      "SELECT * FROM users WHERE email = ?";

    db.query(
      checkQuery,
      [email],
      async (checkErr, checkResult) => {

        if (checkErr) {

          return res.status(500).json({
            success: false,
            error: checkErr.message
          });
        }

        // User already exists
        if (checkResult.length > 0) {

          return res.status(409).json({
            success: false,
            message: "User already exists"
          });
        }


        // Hash password
        const hashedPassword =
          await bcrypt.hash(password, 10);


        // Insert user
        const insertQuery = `
          INSERT INTO users
          (name, email, password)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertQuery,
          [
            name,
            email,
            hashedPassword
          ],
          (insertErr, insertResult) => {

            if (insertErr) {

              return res.status(500).json({
                success: false,
                error: insertErr.message
              });
            }

            return res.json({
              success: true,
              message: "User registered successfully"
            });

          }
        );

      }
    );

  } catch (error) {

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }

});


// ─────────────────────────────────────────────
// LOGIN USER
// ─────────────────────────────────────────────
router.post("/login", (req, res) => {

  const {
    email,
    password
  } = req.body;


  if (!email || !password) {

    return res.status(400).json({
      success: false,
      message: "Email and password required"
    });
  }


  const query =
    "SELECT * FROM users WHERE email = ?";


  db.query(query, [email], async (err, results) => {

    if (err) {

      return res.status(500).json({
        success: false,
        error: err.message
      });
    }


    // User not found
    if (results.length === 0) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    const user = results[0];


    // Compare password
    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!validPassword) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }


    // Create JWT token
    const token = jwt.sign(

      {
        id: user.id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }
    );


    return res.json({

      success: true,

      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }

    });

  });

});


module.exports = router;