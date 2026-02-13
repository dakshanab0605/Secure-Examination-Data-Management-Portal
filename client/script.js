// Go to login with role
function goLogin(role) {
  localStorage.setItem("role", role);
  window.location.href = "login.html";
}

// Set title on login page
window.onload = function () {
  const role = localStorage.getItem("role");
  const title = document.getElementById("roleTitle");

  if (title && role) {
    title.innerText = role.toUpperCase() + " LOGIN";
  }
};

// Login submit
const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = localStorage.getItem("role");

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", username);

      if (role === "admin") {
        window.location.href = "admin.html";
      } else if (role === "faculty") {
        window.location.href = "faculty.html";
      } else {
        window.location.href = "student.html";
      }
    } else {
      alert("Invalid credentials");
    }
  });
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "dashboard.html";
}
