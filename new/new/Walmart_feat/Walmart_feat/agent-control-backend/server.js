const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load env vars
require("dotenv").config();

// Connect to database
connectDB();

// Route files
const agents = require("./routes/agentRoutes");
const auth = require("./routes/authRoutes");

const app = express();

// Body parser
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use("/api/v1/agents", agents);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
