require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// Import routes
const authRoutes = require("./routes/authRoutes");
const crisisRoutes = require("./routes/crisisRoutes");
const simulationRoutes = require("./routes/simulationRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
require("./config/db");

console.log("crisisRoutes =", crisisRoutes);
console.log("simulationRoutes =", simulationRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crisis", crisisRoutes);
app.use("/api/simulations", simulationRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
  });
}

// Error handling
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
