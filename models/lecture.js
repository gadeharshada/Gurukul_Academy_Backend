const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  subject: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: ["10th", "11th", "12th", "JEE", "NEET", "MHTCET"],
    required: true
  },

  videoUrl: {
  type: String,
  required: true
},

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
  
});

module.exports = mongoose.model("Lecture", lectureSchema);