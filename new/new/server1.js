const express = require("express");
const path = require("path");

const app = express();
const PORT = 5500;

// Middleware for parsing form data (login, etc.)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Landing Page
app.use("/", express.static(path.join(__dirname, "walmart-home/walmart")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "walmart-home/walmart/index.html"));
});

// ✅ Crisis Simulator (updated path)
app.use("/crisis", express.static(path.join(__dirname, "new/walmart-crisis-simulator/frontend")));
app.get("/crisis", (req, res) => {
  res.sendFile(path.join(__dirname, "new/walmart-crisis-simulator/frontend/index.html"));
});

// ✅ Live Orchestration
app.use("/orchestration", express.static(path.join(__dirname, "BrainDev/LiveOrchestrationPage")));
app.get("/orchestration/orchestrator.html", (req, res) => {
  res.sendFile(path.join(__dirname, "BrainDev/LiveOrchestrationPage/orchestrator.html"));
});

// ✅ Agent Control Center
app.use("/agent-control", express.static(path.join(__dirname, "Walmart_feat/Walmart_feat/agent-control-frontend")));
app.get("/agent-control", (req, res) => {
  res.sendFile(path.join(__dirname, "Walmart_feat/Walmart_feat/agent-control-frontend/index2.html"));
});

// ✅ Login Page
app.use("/login", express.static(path.join(__dirname, "walmart project/backend/public/login")));
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "walmart project/backend/public/login/login.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
