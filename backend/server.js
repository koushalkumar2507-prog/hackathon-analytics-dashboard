const authRoutes = require("./routes/auth");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const submissionRoutes = require("./routes/submissions");
const analyticsRoutes = require("./routes/analytics");
const adminRoutes = require("./routes/admin");

const app = express();


// ─────────────────────────────────────────────
// MIDDLEWARE
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());


// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────
app.use("/api/submissions", submissionRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ─────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {

  res.json({
    success: true,
    message: "Backend is running successfully"
  });

});


// ─────────────────────────────────────────────
// ROOT ROUTE
// ─────────────────────────────────────────────
app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Hackathon Analytics Backend Running"
  });

});


// ─────────────────────────────────────────────
// 404 ROUTE
// ─────────────────────────────────────────────
app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found"
  });

});


// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`
🚀  Hackathon Analytics Backend
   Running at  → http://localhost:${PORT}
   Health      → http://localhost:${PORT}/api/health
   Leaderboard → http://localhost:${PORT}/api/analytics/leaderboard
   Environment → ${process.env.NODE_ENV}
  `);

});