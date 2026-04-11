const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  logo: String,
  lc: String,
  lb: String,
  type: { type: String, enum: ['full', 'intern'], required: true },
  cat: String,
  tags: [String],
  salary: String,
  period: String,
  loc: String,
  date: String,
  featured: Boolean
});

module.exports = mongoose.model("Job", jobSchema);