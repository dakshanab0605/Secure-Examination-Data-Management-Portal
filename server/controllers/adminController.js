const db = require("../db/db");
const bcrypt = require("bcrypt");

// --- USER MANAGEMENT ---

exports.getAllUsers = (req, res) => {
    const sql = "SELECT id, name, role, created_at FROM users WHERE role != 'admin'";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, users: results });
    });
};

exports.createUser = async (req, res) => {
    const { name, password, role } = req.body;
    if (!name || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, password, role) VALUES (?, ?, ?)";
        db.query(sql, [name, hashedPassword, role.toLowerCase()], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: "User already exists" });
                return res.status(500).json({ success: false, message: "Database error" });
            }
            res.json({ success: true, message: "User created successfully", userId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Hashing error" });
    }
};

exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ? AND role != 'admin'";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "User not found or cannot delete admin" });
        res.json({ success: true, message: "User deleted successfully" });
    });
};

// --- EXAM MANAGEMENT ---

exports.getAllExams = (req, res) => {
    const sql = `
    SELECT e.*, u.name as faculty_name 
    FROM exams e 
    JOIN users u ON e.faculty_id = u.id
  `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, exams: results });
    });
};

exports.updateExamStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // draft, published, disabled
    const sql = "UPDATE exams SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Exam status updated" });
    });
};
