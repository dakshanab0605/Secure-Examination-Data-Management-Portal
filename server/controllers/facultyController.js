const db = require("../db/db");

// --- EXAM CREATION ---

exports.createExam = (req, res) => {
    const { title, description, duration } = req.body;
    const faculty_id = req.user.id;

    if (!title || !duration) {
        return res.status(400).json({ success: false, message: "Title and duration are required" });
    }

    const sql = "INSERT INTO exams (title, description, duration, faculty_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, duration, faculty_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "Exam created as draft", examId: result.insertId });
    });
};

exports.addQuestions = (req, res) => {
    const { exam_id, questions } = req.body; // questions is an array of objects

    if (!exam_id || !Array.isArray(questions)) {
        return res.status(400).json({ success: false, message: "Invalid request data" });
    }

    // Use a transaction or bulk insert? Simple loop for now
    let errors = 0;
    questions.forEach(q => {
        const sql = "INSERT INTO questions (exam_id, question_text, options, correct_answer) VALUES (?, ?, ?, ?)";
        db.query(sql, [exam_id, q.text, JSON.stringify(q.options), q.answer], (err) => {
            if (err) errors++;
        });
    });

    setTimeout(() => {
        if (errors > 0) return res.status(500).json({ success: false, message: `Completed with ${errors} errors` });
        res.json({ success: true, message: "Questions added successfully" });
    }, 1000);
};

// --- REPORTS ---

exports.getMyExams = (req, res) => {
    const faculty_id = req.user.id;
    const sql = "SELECT * FROM exams WHERE faculty_id = ?";
    db.query(sql, [faculty_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, exams: results });
    });
};

exports.getExamResults = (req, res) => {
    const { exam_id } = req.params;
    const sql = `
    SELECT r.*, u.name as student_name 
    FROM results r 
    JOIN users u ON r.student_id = u.id 
    WHERE r.exam_id = ?
  `;
    db.query(sql, [exam_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, results });
    });
};

// --- AI QUESTION GENERATION (Simulated) ---

exports.generateAIQuestions = (req, res) => {
    const { topic, count } = req.body;
    if (!topic) return res.status(400).json({ success: false, message: "Topic is required" });

    console.log(`Simulating AI generation for topic: ${topic}`);

    // Mocked AI Response
    const mockQuestions = [];
    for (let i = 1; i <= (count || 5); i++) {
        mockQuestions.push({
            text: `AI Generated Question ${i} about ${topic}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            answer: "Option A"
        });
    }

    res.json({
        success: true,
        message: `Generated ${mockQuestions.length} questions for ${topic}`,
        questions: mockQuestions
    });
};
