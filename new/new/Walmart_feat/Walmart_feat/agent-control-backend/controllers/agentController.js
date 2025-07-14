const Agent = require("../models/Agent");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all agents
// @route   GET /api/v1/agents
// @access  Private
exports.getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find();
    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single agent
// @route   GET /api/v1/agents/:id
// @access  Private
exports.getAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return next(
        new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new agent
// @route   POST /api/v1/agents
// @access  Private (Admin)
exports.createAgent = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.createdBy = req.user.id;

    const agent = await Agent.create(req.body);

    res.status(201).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update agent
// @route   PUT /api/v1/agents/:id
// @access  Private (Admin)
exports.updateAgent = async (req, res, next) => {
  try {
    let agent = await Agent.findById(req.params.id);

    if (!agent) {
      return next(
        new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is agent owner or admin
    if (
      agent.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this agent`,
          401
        )
      );
    }

    agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete agent
// @route   DELETE /api/v1/agents/:id
// @access  Private (Admin)
exports.deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return next(
        new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is agent owner or admin
    if (
      agent.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this agent`,
          401
        )
      );
    }

    await agent.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update agent status
// @route   PUT /api/v1/agents/:id/status
// @access  Private
exports.updateAgentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive", "degraded", "learning"].includes(status)) {
      return next(new ErrorResponse(`Invalid status: ${status}`, 400));
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: Date.now() },
      { new: true }
    );

    if (!agent) {
      return next(
        new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update agent configuration
// @route   PUT /api/v1/agents/:id/config
// @access  Private (Admin, ML)
exports.updateAgentConfig = async (req, res, next) => {
  try {
    const { configuration } = req.body;

    if (!configuration) {
      return next(
        new ErrorResponse(`Please provide a configuration object`, 400)
      );
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { configuration, lastUpdated: Date.now() },
      { new: true }
    );

    if (!agent) {
      return next(
        new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add API response to agent
// @route   POST /api/v1/agents/:id/responses
// @access  Private
exports.addApiResponse = async (req, res, next) => {
  try {
    const { data } = req.body;

    if (!data) {
      return next(new ErrorResponse(`Please provide response data`, 400));
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          apiResponses: {
            timestamp: Date.now(),
            data,
          },
        },
        lastUpdated: Date.now(),
      },
      { new: true }
    );

    if (!agent) {
      return next(
        new ErrorResponse(`Agent not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    next(err);
  }
};
