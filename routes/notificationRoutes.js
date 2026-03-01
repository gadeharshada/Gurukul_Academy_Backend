const express = require("express");
const router = express.Router();
const Notification = require("../models/notification");
const authMiddleware = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/teacherOnly");

// ===============================
// ✅ POST - Teacher sends notification
// ===============================
router.post("/", async (req, res) => {
  try {
    const { title, message, type, category} = req.body;

    const newNotification = new Notification({
      title,
      message,
      type,
      category
    });

    await newNotification.save();

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: newNotification
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/*
========================================
  DELETE - Teacher Delete Notification
========================================
*/
router.delete("/:id", authMiddleware, teacherOnly, async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ===============================
// ✅ GET - Students receive notification
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    let lectures;

    if (req.user.role === "teacher") {
      lectures = await Lecture.find();
    } else {
      lectures = await Lecture.find({
        category: req.user.category   // ✅ filter by category
      });
    }

    res.json(lectures);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;