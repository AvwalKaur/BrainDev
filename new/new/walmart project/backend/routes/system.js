// routes/system.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// 📦 Load agents data
const agentsPath = path.join(__dirname, '..', 'data', 'agents.json');
const readinessPath = path.join(__dirname, '..', 'data', 'readiness.json');

// GET /system/overview
router.get('/overview', (req, res) => {
  const agentsData = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
  res.json({
    lastUpdated: new Date().toISOString(),
  agents: agentsData.agents
  });
});

// GET /system/readiness
router.get('/readiness', (req, res) => {
  const readinessData = JSON.parse(fs.readFileSync(readinessPath, 'utf-8'));
  res.json({
    readiness: readinessData.score
  });
});

// GET /system/explainability?component=xyz
router.get('/explainability', (req, res) => {
  const component = req.query.component || 'default';

  const explanations = {
    map: "The system map shows live geographic locations and statuses of operational AI agents.",
    readiness: "The readiness meter shows how prepared the system is for handling crises based on current agent health.",
    default: "This feature helps visualize key insights from your AI-driven system in real-time."
  };

  const message = explanations[component] || explanations.default;
  res.json({ message });
});

module.exports = router;
