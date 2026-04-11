const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resume: {
    name: String,     // ✅ ADD THIS
    title: String,
    summary: String,
    skills: [String]
  }
});

module.exports = mongoose.model("User", userSchema);