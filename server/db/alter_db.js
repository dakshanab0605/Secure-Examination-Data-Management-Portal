const db = require("./db"); // Import our db connection

console.log("Altering password column length...");

db.query("ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL", (err) => {
    if (err) {
        console.error("Error altering table:", err);
    } else {
        console.log("Successfully altered password column to VARCHAR(255).");
    }

    setTimeout(() => process.exit(0), 1000);
});
