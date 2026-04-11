const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  loc: { type: String, required: true },
  median: { type: Number, required: true },
  low: { type: Number, required: true },
  high: { type: Number, required: true }
});

module.exports = mongoose.model("Salary", salarySchema);