const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Any logged-in user
router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Profile accessed successfully ✅",
      user: req.user,
    });
  }
);

// Only Teacher
router.get(
  "/teacher",
  authMiddleware,
  roleMiddleware(["teacher"]),
  (req, res) => {
    res.json({ message: "Teacher dashboard access ✅" });
  }
);

// Only Student
router.get(
  "/student",
  authMiddleware,
  roleMiddleware(["student"]),
  (req, res) => {
    res.json({ message: "Student dashboard access ✅" });
  }
);

module.exports = router;
