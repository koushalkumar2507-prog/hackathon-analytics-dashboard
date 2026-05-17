<h1 align="center">Hackathon Analytics Dashboard</h1>

<p align="center">
  A full-stack <b>API-Based Analytics Dashboard</b> customized as a Hackathon Management System.
</p>

<hr>

<h2>📌 Project Topic</h2>

<p>
  This project is based on the topic <b>API-Based Analytics Dashboard</b>.
  It is developed as a <b>Hackathon Analytics Dashboard</b> where teams can submit projects,
  judges can give scores, and organizers can track leaderboard analytics.
</p>

<h2>🚀 Live Project Links</h2>

<ul>
  <li><b>Frontend:</b>[hackathon-analytics-dashboard.vercel.app](https://hackathon-analytics-dashboard.vercel.app/)</li>
  <li><b>Backend:</b> https://hackathon-dashboard-backend-pcp6.onrender.com</li>
  <li><b>GitHub Repository:</b>https://github.com/koushalkumar2507-prog/hackathon-analytics-dashboard.git</li>
</ul>

<h2>🔐 Demo Login</h2>

<table>
  <tr>
    <th>Email</th>
    <th>Password</th>
  </tr>
  <tr>
    <td>demo@hackboard.com</td>
    <td>demo123</td>
  </tr>
</table>

<h2>✨ Features</h2>

<ul>
  <li>User registration and login</li>
  <li>JWT authentication</li>
  <li>Password hashing using bcrypt</li>
  <li>Project submission form</li>
  <li>Dynamic leaderboard</li>
  <li>Judge scoring panel</li>
  <li>Update team score and status</li>
  <li>Delete invalid submissions</li>
  <li>Search and filter teams</li>
  <li>Analytics cards</li>
  <li>Chart.js performance graph</li>
  <li>Export leaderboard to Excel</li>
  <li>Frontend deployed on Vercel</li>
  <li>Backend deployed on Render</li>
  <li>Database hosted on Railway MySQL</li>
</ul>

<h2>🛠️ Tech Stack</h2>

<table>
  <tr>
    <th>Category</th>
    <th>Technology Used</th>
  </tr>
  <tr>
    <td>Frontend</td>
    <td>HTML, CSS, JavaScript</td>
  </tr>
  <tr>
    <td>Backend</td>
    <td>Node.js, Express.js</td>
  </tr>
  <tr>
    <td>Database</td>
    <td>MySQL</td>
  </tr>
  <tr>
    <td>Authentication</td>
    <td>JWT, bcrypt</td>
  </tr>
  <tr>
    <td>Charts</td>
    <td>Chart.js</td>
  </tr>
  <tr>
    <td>Excel Export</td>
    <td>SheetJS / XLSX</td>
  </tr>
  <tr>
    <td>Deployment</td>
    <td>Vercel, Render, Railway</td>
  </tr>
</table>

<h2>📂 Project Structure</h2>

<pre>
Hackathon Analytics Dashboard/
│
├── backend/
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── analytics.js
│   │   └── submissions.js
│   ├── server.js
│   └── package.json
│
├── index.html
├── login.html
├── judge.html
├── style.css
├── script.js
├── login.js
├── judge.js
└── README.md
</pre>

<h2>📊 Main Modules</h2>

<h3>1. Authentication Module</h3>
<p>
  Users can register and login securely. Passwords are hashed using bcrypt,
  and JWT tokens are used to protect dashboard and judge routes.
</p>

<h3>2. Dashboard Module</h3>
<p>
  The dashboard displays total teams, total submissions, average score,
  qualified teams, leaderboard, and graphical analytics.
</p>

<h3>3. Submission Module</h3>
<p>
  Participants can submit their project details including team name,
  project title, GitHub repository, demo link, and description.
</p>

<h3>4. Judge Panel</h3>
<p>
  Judges can view submissions, assign scores, update status, and delete
  invalid submissions.
</p>

<h3>5. Leaderboard Module</h3>
<p>
  The leaderboard ranks teams according to score and displays their status
  as Pending, Qualified, or Rejected.
</p>

<h3>6. Export Module</h3>
<p>
  The leaderboard can be exported to an Excel file for offline reporting.
</p>

<h2>🔗 API Endpoints</h2>

<table>
  <tr>
    <th>Method</th>
    <th>Endpoint</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/auth/register</td>
    <td>Register a new user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/auth/login</td>
    <td>Login user</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/submissions</td>
    <td>Fetch all submissions</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/submissions</td>
    <td>Create a new project submission</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/api/submissions/:id</td>
    <td>Delete a submission</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/analytics/leaderboard</td>
    <td>Fetch leaderboard data</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/api/analytics/score/:id</td>
    <td>Update score and status</td>
  </tr>
</table>

<h2>⚙️ How to Run Locally</h2>

<h3>1. Clone Repository</h3>

<pre>
git clone https://github.com/your-username/hackathon-analytics-dashboard.git
</pre>

<h3>2. Install Backend Dependencies</h3>

<pre>
cd backend
npm install
</pre>

<h3>3. Create .env File Inside Backend Folder</h3>

<pre>
PORT=5000
NODE_ENV=development
JWT_SECRET=mysecretkey

DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
</pre>

<h3>4. Run Backend</h3>

<pre>
npm run dev
</pre>

<h3>5. Open Frontend</h3>

<p>
  Open <b>login.html</b> using Live Server.
</p>

<h2>🗄️ Database Tables</h2>

<h3>Users Table</h3>

<pre>
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</pre>

<h3>Submissions Table</h3>

<pre>
CREATE TABLE submissions (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  team_name VARCHAR(100),
  project_title VARCHAR(200),
  github_link TEXT,
  demo_link TEXT,
  description TEXT,
  score INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
</pre>

<h2>👨‍💻 Developed By</h2>

<p>
  <b>Koushal Kumar</b><br>
  B.Tech CSE AIML<br>
  GitHub:
  <a href="https://github.com/koushalkumar2507-prog">
    koushalkumar2507-prog
  </a>
</p>

<h2>📄 License</h2>

<p>
  This project is created for educational and project submission purposes.
</p>
