const db = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "super_secret_key_123"; // In production, use env variables

exports.login = (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const sql = "SELECT * FROM users WHERE name=? AND role=?";

  db.query(sql, [username, role.toLowerCase()], async (err, result) => {
    if (err) {
      console.error("Login Query Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials or incorrect role" });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Generate JWT Token
        const token = jwt.sign(
          { id: user.id, username: user.name, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            username: user.name,
            role: user.role
          },
          role: user.role // Keep this for existing frontend behavior
        });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Compare Error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });
};

exports.getUsers = (req, res) => {
  const sql = "SELECT id, name, role FROM users";

  db.query(sql, (err, result) => {
    if (err) return res.json([]);
    res.json(result);
  });
};
