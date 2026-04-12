require('dotenv').config();
console.log("SERVER FILE RUNNING 🚀");


console.log("Mongo URI:", process.env.MONGO_URI);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');

const app = express();

app.use(cors({ origin: "http://127.0.0.1:8080" }));
app.use(express.json());

/* ================= API ROUTES FIRST ================= */

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes.js");
const applicationRoutes = require("./routes/applicationRoutes.js");
const salaryRoutes = require("./routes/salary");

app.use("/api/users", userRoutes);
app.use("/api/jobs", (req, res, next) => {
  console.log("🔥 HIT /api/jobs PREFIX");
  next();
}, jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/salaries", salaryRoutes);

/* ================= FRONTEND AFTER ================= */

// Serve static frontend
app.use(express.static(path.join(__dirname, "../job-finder")));

// Fallback to index.html (VERY IMPORTANT for SPA behavior)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../job-finder/index.html"));
});

/* ================= DB ================= */
console.log("MONGO_URI:", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));

/* ================= SERVER ================= */

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});