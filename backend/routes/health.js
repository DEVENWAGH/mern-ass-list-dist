const express = require("express");
const router = express.Router();

// Simple health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    message: "Server is running",
  });
});

module.exports = router;
