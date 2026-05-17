let teams = [];
let filteredTeams = [];

async function fetchLeaderboard() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "login.html";
      return;
    }

    const response = await fetch(
      "https://hackathon-dashboard-backend-pcp6.onrender.com/api/analytics/leaderboard",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      teams = data;
    } else if (data.data) {
      teams = data.data;
    } else {
      teams = [];
    }

    filteredTeams = teams;

    renderLeaderboard();
    updateStats();
    renderChart();

  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}

function renderLeaderboard() {
  const tbody = document.getElementById("leaderboard-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (filteredTeams.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:20px;">
          No leaderboard data found
        </td>
      </tr>
    `;
    return;
  }

  filteredTeams.forEach((team, index) => {
    const tr = document.createElement("tr");

    const rank = index + 1;
    const teamName = team.team || team.team_name || "Unknown Team";
    const score = team.score || 0;
    const status = team.status || "Pending";

    const rankClass =
      rank === 1 ? "rank-1" :
      rank === 2 ? "rank-2" :
      rank === 3 ? "rank-3" : "";

    let badgeClass = "badge badge-pending";

    if (status === "Qualified") {
      badgeClass = "badge badge-qualified";
    } else if (status === "Rejected") {
      badgeClass = "badge badge-rejected";
    }

    tr.innerHTML = `
      <td class="rank-cell ${rankClass}">#${rank}</td>
      <td>${teamName}</td>
      <td><strong>${score}</strong></td>
      <td><span class="${badgeClass}">${status}</span></td>
    `;

    tbody.appendChild(tr);
  });
}

function filterLeaderboard() {
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");

  const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
  const statusValue = statusFilter ? statusFilter.value : "All";

  filteredTeams = teams.filter((team) => {
    const teamName = (team.team || team.team_name || "").toLowerCase();

    const matchesSearch = teamName.includes(searchValue);
    const matchesStatus =
      statusValue === "All" || team.status === statusValue;

    return matchesSearch && matchesStatus;
  });

  renderLeaderboard();
}

function updateStats() {
  document.getElementById("total-teams").textContent = teams.length;
  document.getElementById("total-submissions").textContent = teams.length;

  const totalScore = teams.reduce(
    (sum, team) => sum + Number(team.score || 0),
    0
  );

  const averageScore =
    teams.length > 0 ? (totalScore / teams.length).toFixed(1) : 0;

  const qualifiedCount = teams.filter(
    (team) => team.status === "Qualified"
  ).length;

  document.getElementById("average-score").textContent = averageScore;
  document.getElementById("qualified-count").textContent = qualifiedCount;
}

function renderChart() {
  const ctx = document.getElementById("analyticsChart");
  if (!ctx) return;

  if (window.analyticsChartInstance) {
    window.analyticsChartInstance.destroy();
  }

  const labels = teams.map((team) => team.team || team.team_name);
  const scores = teams.map((team) => Number(team.score || 0));

  window.analyticsChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Team Scores",
          data: scores,
          backgroundColor: [
            "#3b82f6",
            "#22c55e",
            "#f59e0b",
            "#8b5cf6",
            "#ef4444"
          ],
          borderRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

async function handleSubmit() {
  const teamName = document.getElementById("team-name").value.trim();
  const projectTitle = document.getElementById("project-title").value.trim();
  const githubLink = document.getElementById("github-link").value.trim();
  const demoLink = document.getElementById("demo-link").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!teamName || !projectTitle || !githubLink || !demoLink || !description) {
    shakeForm();
    alert("Please fill all fields.");
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.textContent = "Submitting...";
  btn.disabled = true;

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("https://hackathon-dashboard-backend-pcp6.onrender.com/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        team_name: teamName,
        project_title: projectTitle,
        github_link: githubLink,
        demo_link: demoLink,
        description: description
      })
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    await response.json();

    const msg = document.getElementById("success-msg");
    msg.classList.remove("hidden");

    document.getElementById("team-name").value = "";
    document.getElementById("project-title").value = "";
    document.getElementById("github-link").value = "";
    document.getElementById("demo-link").value = "";
    document.getElementById("description").value = "";

    fetchLeaderboard();

    setTimeout(() => {
      msg.classList.add("hidden");
    }, 4000);

  } catch (error) {
    console.error("Submission Error:", error);
    alert("Submission failed.");
  }

  btn.textContent = "Submit Project";
  btn.disabled = false;
}

function shakeForm() {
  const form = document.getElementById("submit-form");
  if (!form) return;

  form.style.animation = "none";
  form.offsetHeight;
  form.style.animation = "shake 0.4s ease";
}

const shakeStyle = document.createElement("style");

shakeStyle.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
`;

document.head.appendChild(shakeStyle);

function setupNav() {
  const navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
    });
  });
}
// ─────────────────────────────────────────────
// EXPORT LEADERBOARD TO EXCEL
// ─────────────────────────────────────────────
function exportExcel() {

  const exportData = teams.map((team) => ({

    Rank:
      team.rank,

    Team:
      team.team ||
      team.team_name,

    Project:
      team.project_title,

    Score:
      team.score,

    Status:
      team.status,

    GitHub:
      team.github_link,

    Demo:
      team.demo_link

  }));


  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Leaderboard"
  );

  XLSX.writeFile(
    workbook,
    "hackathon_leaderboard.xlsx"
  );

}
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchLeaderboard();
  setupNav();

  document
    .getElementById("search-input")
    ?.addEventListener("input", filterLeaderboard);

  document
    .getElementById("status-filter")
    ?.addEventListener("change", filterLeaderboard);
});