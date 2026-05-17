let submissions = [];

async function loadSubmissions() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://hackathon-dashboard-backend-pcp6.onrender.com/api/submissions", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    submissions = Array.isArray(data) ? data : data.data || [];

    renderSubmissions();

  } catch (error) {
    console.error(error);
    alert("Failed to load submissions");
  }
}

function renderSubmissions() {
  const tbody = document.getElementById("judge-body");

  tbody.innerHTML = "";

  submissions.forEach((item) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.team_name}</td>

      <td>${item.project_title}</td>

      <td>
        <a href="${item.github_link}" target="_blank">
          View
        </a>
      </td>

      <td>
        <input
          type="number"
          id="score-${item.id}"
          value="${item.score || 0}"
          min="0"
          max="100"
        />
      </td>

      <td>
        <select id="status-${item.id}">
          <option value="Pending" ${item.status === "Pending" ? "selected" : ""}>
            Pending
          </option>

          <option value="Qualified" ${item.status === "Qualified" ? "selected" : ""}>
            Qualified
          </option>

          <option value="Rejected" ${item.status === "Rejected" ? "selected" : ""}>
            Rejected
          </option>
        </select>
      </td>

      <td>
        <button onclick="updateSubmission(${item.id})">
          Save
        </button>

        <button
          onclick="deleteSubmission(${item.id})"
          style="background:#dc2626; margin-left:6px;"
        >
          Delete
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function updateSubmission(id) {
  const token = localStorage.getItem("token");

  const score = document.getElementById(`score-${id}`).value;
  const status = document.getElementById(`status-${id}`).value;

  try {
    const response = await fetch(
      `https://hackathon-dashboard-backend-pcp6.onrender.com/api/analytics/score/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          score,
          status
        })
      }
    );

    const data = await response.json();

    alert(data.message || "Updated successfully");

    loadSubmissions();

  } catch (error) {
    console.error(error);
    alert("Update failed");
  }
}

async function deleteSubmission(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this submission?"
  );

  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `https://hackathon-dashboard-backend-pcp6.onrender.com/api/submissions/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    alert(data.message || "Submission deleted");

    loadSubmissions();

  } catch (error) {
    console.error(error);
    alert("Delete failed");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadSubmissions();
});