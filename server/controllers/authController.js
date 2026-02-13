const db = require("../db/db");

exports.login = (req, res) => {
  const { username, password, role } = req.body;

  const sql =
    "SELECT * FROM users WHERE name=? AND password=? AND role=?";

  db.query(sql, [username, password, role], (err, result) => {
    if (err) return res.json({ success: false });

    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
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
