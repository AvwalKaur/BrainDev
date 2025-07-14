const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "degraded", "learning"],
    default: "active",
  },
  uptime: {
    type: Number,
    default: 99.9,
  },
  responseTime: {
    type: Number,
    default: 100,
  },
  accuracy: {
    type: Number,
    default: 95.0,
  },
  configuration: {
    type: Object,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  apiResponses: [
    {
      timestamp: Date,
      data: Object,
    },
  ],
  dependencies: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Agent", AgentSchema);
