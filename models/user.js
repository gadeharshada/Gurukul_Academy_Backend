const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, required: true, minlength: 6},

  role: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },

  category: {
  type: String,
  enum: ["10th", "11th", "12th", "JEE", "NEET", "MHTCET"],
  required: function () {
    return this.role === "student";
  }
}
});

module.exports = mongoose.model("User", userSchema);
