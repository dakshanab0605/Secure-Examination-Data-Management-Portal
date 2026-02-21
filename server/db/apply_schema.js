const db = require("./db");
const fs = require("fs");
const path = require("path");

async function applySchema() {
    console.log("Applying Portal Schema...");

    const schemaPath = path.join(__dirname, "portal_schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf8");

    // Split queries by semicolon (simple approach)
    const queries = sql.split(";").filter(q => q.trim() !== "");

    for (const query of queries) {
        try {
            await new Promise((resolve, reject) => {
                db.query(query, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log("Executed query successfully.");
        } catch (err) {
            console.error("Error executing query:", err.message);
        }
    }

    console.log("Schema application finished.");
    process.exit(0);
}

applySchema();
