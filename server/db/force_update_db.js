const bcrypt = require("bcrypt");
const db = require("./db"); // Import our db connection

async function forceUpdateDB() {
    console.log("Forcing update of DB users...");

    const defaultUsers = [
        { name: "admin", password: "adminpassword", role: "Admin" },
        { name: "faculty", password: "facultypassword", role: "Faculty" },
        { name: "student", password: "studentpassword", role: "Student" },
    ];

    for (const user of defaultUsers) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            const updateQuery = `
        INSERT INTO users (name, password, role) 
        VALUES (?, ?, ?) 
        ON DUPLICATE KEY UPDATE password=VALUES(password), role=VALUES(role)
      `;

            db.query(updateQuery, [user.name, hashedPassword, user.role], (err) => {
                if (err) {
                    console.error(`Error updating user ${user.name}:`, err);
                } else {
                    console.log(`Successfully updated/inserted: ${user.name} (${user.role})`);
                }
            });

        } catch (hashError) {
            console.error(`Error hashing password for ${user.name}:`, hashError);
        }
    }

    // Give queries time to complete before exiting
    setTimeout(() => {
        console.log("Forced update script finished.");
        process.exit(0);
    }, 2000);
}

forceUpdateDB();
