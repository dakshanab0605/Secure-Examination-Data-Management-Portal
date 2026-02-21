const db = require("./db");
const bcrypt = require("bcrypt");

const query = (sql, params) => new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
    });
});

async function run() {
    try {
        console.log("Dropping users table...");
        await query("DROP TABLE IF EXISTS users");

        console.log("Creating users table with VARCHAR(255)...");
        await query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('Admin', 'Faculty', 'Student') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        const defaultUsers = [
            { name: "admin", password: "adminpassword", role: "Admin" },
            { name: "faculty", password: "facultypassword", role: "Faculty" },
            { name: "student", password: "studentpassword", role: "Student" },
        ];

        for (const user of defaultUsers) {
            const hashed = await bcrypt.hash(user.password, 10);
            await query("INSERT INTO users (name, password, role) VALUES (?, ?, ?)", [user.name, hashed, user.role]);
            console.log(`Inserted ${user.name}`);
        }

        console.log("Verifying hash length in DB...");
        const rows = await query("SELECT * FROM users WHERE name = 'admin'");
        console.log("DB Hash length:", rows[0].password.length, "Hash:", rows[0].password);

        const match = await bcrypt.compare("adminpassword", rows[0].password);
        console.log("Bcrypt compare check:", match);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

run();
