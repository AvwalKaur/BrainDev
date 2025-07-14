const express = require("express");
const {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  updateAgentStatus,
  updateAgentConfig,
  addApiResponse,
} = require("../controllers/agentController");

const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, getAgents)
  .post(protect, authorize("admin", "ml"), createAgent);

router
  .route("/:id")
  .get(protect, getAgent)
  .put(protect, authorize("admin", "ml"), updateAgent)
  .delete(protect, authorize("admin"), deleteAgent);

router.route("/:id/status").put(protect, updateAgentStatus);

router
  .route("/:id/config")
  .put(protect, authorize("admin", "ml"), updateAgentConfig);

router.route("/:id/responses").post(protect, addApiResponse);

module.exports = router;
