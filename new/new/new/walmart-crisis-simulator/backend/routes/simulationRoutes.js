const express = require("express");
const router = express.Router();

// POST /api/simulations/trigger
router.post("/trigger", (req, res) => {
  const { type, severity, duration } = req.body;
  console.log("Triggering simulation:", { type, severity, duration });

  // Respond with fake data (you can replace with actual logic)
  res.json({
    success: true,
    message: "Simulation started",
    estimatedImpact: {
      delivery: 8,
      inventory: 5,
      financial: 12000,
      responseTime: 4,
    },
  });
});

module.exports = router;
