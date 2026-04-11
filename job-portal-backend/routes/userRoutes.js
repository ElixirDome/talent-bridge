const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password});
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
res.json({
  message: "Login successful",
  userId: user._id,
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/resume", async (req, res) => {
  try {
    const { userId, name, title, summary, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        resume: {
          name,       // ✅ ADD THIS
          title,
          summary,
          skills
        }
      },
      { new: true }
    );

    res.json({ message: "Resume saved ✅", user });

  } catch (err) {
   return res.status(400).json({ error: "Invalid credentials" });
  }
});

module.exports = router;