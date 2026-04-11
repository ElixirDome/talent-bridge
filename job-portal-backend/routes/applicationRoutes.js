const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

console.log("Application routes loaded ✅");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Application route working ✅");
});

// APPLY
router.post("/apply", async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.json({ message: "Applied successfully", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL APPLICATIONS
router.get("/", async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("user", "name email")
      .populate("job", "title company");

    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;