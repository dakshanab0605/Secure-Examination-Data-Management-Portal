const bcrypt = require("bcrypt");
const db = require("./db"); // Import our db connection

async function initDB() {
    console.log("Starting DB Initialization...");

    db.query("DROP TABLE IF EXISTS users", (dropErr) => {
        if (dropErr) {
            console.error("Error dropping table:", dropErr);
        }
        console.log("Dropped existing users table (if any).");

        // 1. Create table if not exists using name instead of username
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Faculty', 'Student') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        db.query(createTableQuery, async (err) => {
            if (err) {
                console.error("Error creating users table:", err);
                process.exit(1);
            }
            console.log("Users table is ready.");

            // 2. Insert default users
            const defaultUsers = [
                { name: "admin", password: "adminpassword", role: "Admin" },
                { name: "faculty", password: "facultypassword", role: "Faculty" },
                { name: "student", password: "studentpassword", role: "Student" },
            ];

            for (const user of defaultUsers) {
                try {
                    const hashedPassword = await bcrypt.hash(user.password, 10);

                    // Check if user already exists
                    db.query("SELECT * FROM users WHERE name = ?", [user.name], (selectErr, results) => {
                        if (selectErr) {
                            console.error(`Error querying user ${user.name}:`, selectErr);
                            return;
                        }

                        if (results.length > 0) {
                            console.log(`User ${user.name} already exists. Skipping.`);
                            return;
                        }

                        // Insert new user
                        db.query("INSERT INTO users (name, password, role) VALUES (?, ?, ?)",
                            [user.name, hashedPassword, user.role],
                            (insertErr) => {
                                if (insertErr) {
                                    console.error(`Error inserting user ${user.name}:`, insertErr);
                                } else {
                                    console.log(`Inserted default user: ${user.name} (${user.role})`);
                                }
                            }
                        );
                    });

                } catch (hashError) {
                    console.error(`Error hashing password for ${user.name}:`, hashError);
                }
            }

            // Give queries time to complete before exiting
            setTimeout(() => {
                console.log("DB Initialization script finished.");
                process.exit(0);
            }, 2000);
        });
    });
}

initDB();
