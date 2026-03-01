const express = require("express");
const Lecture = require("../models/lecture");
const authMiddleware = require("../middleware/authMiddleware");
const teacherOnly = require("../middleware/teacherOnly");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const fs = require("fs");

/*
========================================
  MULTER CONFIG
========================================
*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
});

/*
========================================
  POST - Teacher Upload Lecture (WITH VIDEO)
========================================
*/
router.post(
  "/",
  authMiddleware,
  upload.single("video"),  
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({ message: "Video file is required" });
      }
      if (!req.body.subject || !req.body.category) {
        return res.status(400).json({
        message: "Subject and category are required"
      });
}

      const newLecture = new Lecture({
        title: req.body.title,
        description: req.body.description,
        videoUrl: `/uploads/${req.file.filename}`,  // ✅ saved file path
        subject: req.body.subject,
        category: req.body.category,
        uploadedBy: req.user.id
      });

      const savedLecture = await newLecture.save();

      res.status(201).json(savedLecture);

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
);

/*
========================================
  DELETE - Teacher Delete Lecture
========================================
*/

router.delete(
  "/:id",
  authMiddleware,
  teacherOnly,
  async (req, res) => {
    try {
      const lectureId = req.params.id;

      const lecture = await Lecture.findById(lectureId);

      if (!lecture) {
        return res.status(404).json({
          message: "Lecture not found"
        });
      }

      // Remove video file from uploads folder
      if (lecture.videoUrl) {
        const filePath = path.join(
          __dirname,
          "..",
          lecture.videoUrl
        );

        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("File delete error:", err.message);
          }
        });
      }

      await Lecture.findByIdAndDelete(lectureId);

      res.json({
        message: "Lecture deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

/*
========================================
  GET - View Lectures
========================================
*/
router.get("/", authMiddleware, async (req, res) => {
  try {

    const role = (req.user.role || "").toLowerCase();
    const category = req.user.category;

    let lectures = [];

    if (role === "teacher") {
      lectures = await Lecture.find();
    } 
    else if (role === "student") {

      if (!category) {
        return res.status(400).json({
          message: "Student category missing"
        });
      }

      lectures = await Lecture.find({
        category: category
      });
    }

    res.json(lectures);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;