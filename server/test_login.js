async function testLogin() {
    try {
        console.log("Testing POST /api/auth/login with Admin credentials...");
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "admin",
                password: "adminpassword",
                role: "Admin"
            })
        });

        const data = await response.json();
        console.log("Response Status:", response.status);
        console.log("Response Body:", data);

        if (data.success && data.token) {
            console.log("SUCCESS! JWT Token received.");
        } else {
            console.log("FAILED to get JWT token.");
        }
    } catch (err) {
        console.error("Error during fetch:", err.message);
    }
}

testLogin();
