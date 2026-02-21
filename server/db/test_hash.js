const db = require("./db");
const bcrypt = require("bcrypt");

db.query("SELECT * FROM users WHERE name = 'admin'", async (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        console.log("Admin user not found in DB!");
        process.exit(1);
    }

    const user = result[0];
    console.log("DB User Hash:", user.password);

    const isMatch = await bcrypt.compare("adminpassword", user.password);
    console.log("Bcrypt compare result:", isMatch);

    process.exit(0);
});
