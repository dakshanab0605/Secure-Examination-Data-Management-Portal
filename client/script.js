window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");

    if (role) {
        const title = document.getElementById("roleTitle");
        if (title) {
            title.innerText =
                "Login as " + role.charAt(0).toUpperCase() + role.slice(1);
        }
    }
};

const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const params = new URLSearchParams(window.location.search);
        const role = params.get("role");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password, role })
            });

            const data = await response.json();
            console.log("Backend returned role:", data.role);
            if (data.success) {

                // ✅ Store backend role securely
                localStorage.setItem("role", data.role);
                localStorage.setItem("token", data.token);

                const lowerRole = data.role.toLowerCase();
                if (lowerRole === "admin") {
                    window.location.href = "admin-dashboard.html";
                }
                else if (lowerRole === "faculty") {
                    window.location.href = "faculty-dashboard.html";
                }
                else if (lowerRole === "student") {
                    window.location.href = "student-dashboard.html";
                }

            } else {
                alert(data.message || "Invalid username or password");
            }

        } catch (error) {
            alert("Server not reachable");
            console.error(error);
        }
    });
}

function goToAuth(role) {
    window.location.href = "auth.html?role=" + role;
}
