const db = require("./db/db");
const bcrypt = require("bcrypt");

async function diagnose() {
    const username = "admin";
    const password = "adminpassword";
    const frontendRole = "admin"; // What script.js sends

    console.log("Checking DB records for name='admin'...");
    db.query("SELECT * FROM users WHERE name=?", [username], async (err, results) => {
        if (results.length === 0) {
            console.log("No user found with name 'admin'");
        } else {
            const user = results[0];
            console.log("Found user:", { name: user.name, role: user.role });

            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match result:", isMatch);

            console.log(`Checking query with role='${frontendRole}'...`);
            db.query("SELECT * FROM users WHERE name=? AND role=?", [username, frontendRole], (err2, results2) => {
                console.log("Results with lowercase role:", results2.length);

                const upperRole = frontendRole.charAt(0).toUpperCase() + frontendRole.slice(1);
                console.log(`Checking query with role='${upperRole}'...`);
                db.query("SELECT * FROM users WHERE name=? AND role=?", [username, upperRole], (err3, results3) => {
                    console.log("Results with uppercase role:", results3.length);
                    process.exit(0);
                });
            });
        }
    });
}

diagnose();
