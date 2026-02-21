const express = require("express");
const router = express.Router();
const faculty = require("../controllers/facultyController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// All faculty routes are protected
router.use(verifyToken);
router.use(verifyRole(['faculty']));

router.post("/create-exam", faculty.createExam);
router.post("/add-questions", faculty.addQuestions);
router.post("/generate-ai-questions", faculty.generateAIQuestions);
router.get("/my-exams", faculty.getMyExams);
router.get("/results/:exam_id", faculty.getExamResults);

module.exports = router;
