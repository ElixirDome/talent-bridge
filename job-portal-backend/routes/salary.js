const express = require("express");
const router = express.Router();
const Salary = require("../models/Salary");

// GET all salaries or filtered by role/location
router.get("/", async (req, res) => {
  try {
    const { role, loc } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (loc) filter.loc = { $regex: loc, $options: "i" }; // case-insensitive search

    const salaries = await Salary.find(filter);
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new salary entry (admin use)
router.post("/", async (req, res) => {
  try {
    const { role, company, loc, median, low, high } = req.body;

    const salary = new Salary({ role, company, loc, median, low, high });
    await salary.save();

    res.json({ message: "Salary added ✅", salary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;