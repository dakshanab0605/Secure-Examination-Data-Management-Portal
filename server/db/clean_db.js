const bcrypt = require("bcrypt");
const db = require("./db"); // Import our db connection

async function cleanDB() {
    console.log("Cleaning DB...");

    db.query("DELETE FROM users", async (err) => {
        if (err) {
            console.error("Error deleting rows:", err);
            process.exit(1);
        }
        console.log("Deleted all rows from users.");

        // Insert default users
        const defaultUsers = [
            { name: "admin", password: "adminpassword", role: "Admin" },
            { name: "faculty", password: "facultypassword", role: "Faculty" },
            { name: "student", password: "studentpassword", role: "Student" },
        ];

        for (const user of defaultUsers) {
            try {
                const hashedPassword = await bcrypt.hash(user.password, 10);

                db.query("INSERT INTO users (name, password, role) VALUES (?, ?, ?)",
                    [user.name, hashedPassword, user.role],
                    (insertErr) => {
                        if (insertErr) {
                            console.error(`Error inserting user ${user.name}:`, insertErr);
                        } else {
                            console.log(`Inserted clean user: ${user.name} (${user.role})`);
                        }
                    }
                );
            } catch (hashError) {
                console.error(`Error hashing password for ${user.name}:`, hashError);
            }
        }

        // Give queries time to complete before exiting
        setTimeout(() => {
            console.log("DB Clean script finished.");
            process.exit(0);
        }, 2000);
    });
}

cleanDB();
