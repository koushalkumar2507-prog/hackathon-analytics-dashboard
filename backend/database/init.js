// database/init.js — Creates all tables and seeds sample data
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const DB_PATH = process.env.DB_PATH || "./database/hackathon.db";

// Ensure directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// ─── Enable WAL mode for better concurrency ─────────────
db.pragma("journal_mode = WAL");

// ─── Create Tables ───────────────────────────────────────
db.exec(`
  -- Teams table
  CREATE TABLE IF NOT EXISTS teams (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL UNIQUE,
    members    INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Submissions table
  CREATE TABLE IF NOT EXISTS submissions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id       INTEGER NOT NULL,
    project_title TEXT    NOT NULL,
    github_link   TEXT    NOT NULL,
    demo_link     TEXT,
    description   TEXT,
    score         REAL    DEFAULT NULL,
    status        TEXT    NOT NULL DEFAULT 'Pending'
                  CHECK(status IN ('Pending', 'Qualified', 'Rejected')),
    submitted_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
  );

  -- Judges table
  CREATE TABLE IF NOT EXISTS judges (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Scores table (one score per judge per submission)
  CREATE TABLE IF NOT EXISTS scores (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    judge_id      INTEGER NOT NULL,
    innovation    INTEGER NOT NULL CHECK(innovation BETWEEN 0 AND 10),
    technical     INTEGER NOT NULL CHECK(technical  BETWEEN 0 AND 10),
    presentation  INTEGER NOT NULL CHECK(presentation BETWEEN 0 AND 10),
    impact        INTEGER NOT NULL CHECK(impact     BETWEEN 0 AND 10),
    notes         TEXT,
    scored_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (judge_id)      REFERENCES judges(id)      ON DELETE CASCADE,
    UNIQUE(submission_id, judge_id)
  );
`);

// ─── Seed Sample Data ────────────────────────────────────
const seedTeams = db.prepare(
  `INSERT OR IGNORE INTO teams (name, members) VALUES (?, ?)`
);
const seedJudge = db.prepare(
  `INSERT OR IGNORE INTO judges (name, email) VALUES (?, ?)`
);
const seedSubmission = db.prepare(`
  INSERT OR IGNORE INTO submissions
    (team_id, project_title, github_link, demo_link, description, score, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
const seedScore = db.prepare(`
  INSERT OR IGNORE INTO scores
    (submission_id, judge_id, innovation, technical, presentation, impact, notes)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const teamsData = [
  ["ByteBlasters",  4],
  ["NullPointers",  3],
  ["AlphaStack",    5],
  ["DevDragons",    4],
  ["CloudChasers",  3],
  ["SyntaxError",   4],
  ["InfiniteLoop",  2],
  ["CodeCraft",     3],
];

const judgesData = [
  ["Alice Ramos",   "alice@hackboard.io"],
  ["Brian Chow",    "brian@hackboard.io"],
  ["Clara Singh",   "clara@hackboard.io"],
];

const seedAll = db.transaction(() => {
  // Insert teams
  teamsData.forEach(([name, members]) => seedTeams.run(name, members));

  // Insert judges
  judgesData.forEach(([name, email]) => seedJudge.run(name, email));

  // Insert submissions
  const submissionsData = [
    [1, "EcoTrack AI",      "https://github.com/byteblasters/ecotrack",   "https://ecotrack.demo.io",    "AI-powered carbon footprint tracker",              97, "Qualified"],
    [2, "MediLink",         "https://github.com/nullpointers/medilink",   "https://medilink.demo.io",    "Connecting rural patients with doctors via SMS",   94, "Qualified"],
    [3, "SafeRoute",        "https://github.com/alphastack/saferoute",    "https://saferoute.demo.io",   "Real-time crime-aware navigation",                 91, "Qualified"],
    [4, "SkillBridge",      "https://github.com/devdragons/skillbridge",  "https://skillbridge.demo.io", "Micro-credentialing for gig workers",              88, "Qualified"],
    [5, "AquaMonitor",      "https://github.com/cloudchasers/aquamon",    "https://aquamon.demo.io",     "IoT water quality monitoring dashboard",           85, "Qualified"],
    [6, "CodeMentor Bot",   "https://github.com/syntaxerror/codementor",  "https://codementor.demo.io",  "AI pair programmer for beginners",                 82, "Qualified"],
    [7, "FoodRescue",       "https://github.com/infiniteloop/foodrescue", "https://foodrescue.demo.io",  "Surplus food redistribution platform",             79, "Pending"],
    [8, "StudySync",        "https://github.com/codecraft/studysync",     "https://studysync.demo.io",   "Collaborative study room with Pomodoro tracking",  75, "Pending"],
  ];

  submissionsData.forEach((row) => seedSubmission.run(...row));

  // Insert scores for first 3 submissions, 3 judges each
  const scoreData = [
    // [sub_id, judge_id, innovation, technical, presentation, impact, notes]
    [1, 1, 10, 9, 10, 10, "Exceptional idea and execution"],
    [1, 2,  9,10,  9,  9, "Strong technical depth"],
    [1, 3, 10, 9,  9, 10, "Impressive impact potential"],

    [2, 1,  9, 9,  9,  9, "Great social relevance"],
    [2, 2,  9, 8, 10,  9, "Polished demo"],
    [2, 3,  9, 9,  9, 10, "Real-world applicability"],

    [3, 1,  9, 9,  9,  9, "Solid engineering"],
    [3, 2,  8,10,  9,  8, "Very reliable solution"],
    [3, 3,  9, 9,  9,  9, "Good market need"],
  ];

  scoreData.forEach((row) => seedScore.run(...row));
});

seedAll();

console.log("✅ Database initialized and seeded at:", DB_PATH);
db.close();
