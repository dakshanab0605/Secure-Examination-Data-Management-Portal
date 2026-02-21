const fetch = require("node-fetch"); // Or use a simple http request

async function testLogin() {
    const payload = {
        username: "admin",
        password: "adminpassword",
        role: "admin"
    };

    console.log("Testing login with:", payload);

    try {
        // We'll use a local request to the server at localhost:3000
        // Since we can't easily use node-fetch if not installed, we'll use a direct DB check again but with the exact logic.
        const db = require("./db/db");
        const bcrypt = require("bcrypt");

        db.query("SELECT * FROM users WHERE name=? AND role=?", [payload.username, payload.role.toLowerCase()], async (err, result) => {
            if (result.length === 0) {
                console.log("FAILED: User not found with role lowercased");
                process.exit(1);
            }
            const user = result[0];
            const match = await bcrypt.compare(payload.password, user.password);
            console.log("SUCCESS: Password matches?", match);
            process.exit(match ? 0 : 1);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testLogin();
