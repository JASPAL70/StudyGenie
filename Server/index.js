const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route to forward plan request to FastAPI ML service
app.post("/generate-plan", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:7000/ml/generate-plan", req.body);
    res.json(response.data);
  } catch (error) {
    console.error("🔴 Error communicating with ML service:", error.message);
    res.status(500).json({
      error: "Failed to generate plan. ML service might be down.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend API running at http://localhost:${PORT}`);
});
