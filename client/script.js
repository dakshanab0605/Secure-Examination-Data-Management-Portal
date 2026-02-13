// -----------------------------
// ROLE FROM URL (auth.html)
// -----------------------------
window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");

    if (role) {
        localStorage.setItem("role", role);

        const title = document.getElementById("roleTitle");
        if (title) {
            title.innerText =
                "Login as " + role.charAt(0).toUpperCase() + role.slice(1);
        }
    }
};

// -----------------------------
// LOGIN FORM (auth.html)
// -----------------------------
const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const role = localStorage.getItem("role");
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "" || password === "") {
            alert("Enter username and password");
            return;
        }

        // Redirect based on role
        if (role === "admin") {
            window.location.href = "admin-dashboard.html";
        } else if (role === "faculty") {
            window.location.href = "faculty-dashboard.html";
        } else if (role === "student") {
            window.location.href = "student-dashboard.html";
        } else {
            alert("Role missing. Go back.");
            window.location.href = "index.html";
        }
    });
}
