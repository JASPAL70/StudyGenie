const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser

// ✅ Route: Proxy to FastAPI
app.post("/generate-plan", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:7000/generate-plan", req.body);
    res.json(response.data);
  } catch (error) {
    console.error("❌ ML Service Error:", error.message);
    res.status(500).json({ error: "ML service not responding." });
  }
});

// ✅ Optional: Health check
app.get("/", (req, res) => {
  res.send("StudyGenie Node Proxy is running!");
});

// ✅ Start server
app.listen(5000, () => {
  console.log("🚀 Node.js backend running at http://localhost:5000");
});
