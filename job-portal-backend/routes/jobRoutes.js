const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a job (optional, for admin)
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.json({ message: "Job added", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;