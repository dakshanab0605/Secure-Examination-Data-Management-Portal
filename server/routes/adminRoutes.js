const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// All admin routes are protected
router.use(verifyToken);
router.use(verifyRole(['admin']));

router.get("/users", admin.getAllUsers);
router.post("/users", admin.createUser);
router.delete("/users/:id", admin.deleteUser);

router.get("/exams", admin.getAllExams);
router.patch("/exams/:id", admin.updateExamStatus);

module.exports = router;
