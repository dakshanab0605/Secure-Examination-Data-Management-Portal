const db = require("./db");

db.query("DESCRIBE users", (err, results) => {
    if (err) throw err;
    const pw = results.find(f => f.Field === 'password');
    console.log("Password column:", pw);
    process.exit(0);
});
