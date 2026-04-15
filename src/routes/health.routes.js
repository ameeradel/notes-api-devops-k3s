const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.get("/ready", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "READY",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "NOT READY",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;