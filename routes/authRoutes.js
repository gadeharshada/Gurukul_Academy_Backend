const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, category } = req.body;

    // Check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      category,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT Token
    const token = jwt.sign(
  {
    id: user._id,
    role: user.role,
    name: user.name,
    category: user.category || ""
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        category: user.category,
      },
    });
    

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
