require("dotenv").config();
const connectDB = require("./config/db");
const mongoose = require("mongoose");
const path = require("path");


connectDB();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();  
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://your-frontend.vercel.app",
  credentials: true
}));
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend working ✅" }); 
});

// Import routes
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const lectureRoutes = require("./routes/lectureRoutes");  
const notificationRoutes = require("./routes/notificationRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/lectures", lectureRoutes);
// app.use("/api/tests", testRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



