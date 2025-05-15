const Agent = require("../models/Agent");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// @desc    Create agent
// @route   POST /api/agents
// @access  Private
const createAgent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, password, status } = req.body;

  try {
    // Check if agent exists for this user
    let agent = await Agent.findOne({ email, user: req.user.id });
    if (agent) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    // Validate phone number format (must include country code)
    if (!phone.includes("+")) {
      return res
        .status(400)
        .json({ message: "Phone number must include country code (e.g., +1)" });
    }

    // Create new agent with user reference
    agent = new Agent({
      user: req.user.id,
      name,
      email,
      phone,
      password,
      status: status || "active",
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    agent.password = await bcrypt.hash(password, salt);

    await agent.save();

    res.status(201).json({
      success: true,
      data: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        status: agent.status,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private
const getAgents = async (req, res) => {
  try {
    // Get only agents created by the logged-in user
    const agents = await Agent.find({ user: req.user.id })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get agent by ID
// @route   GET /api/agents/:id
// @access  Private
const getAgentById = async (req, res) => {
  try {
    // Make sure the agent belongs to this user
    const agent = await Agent.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select("-password");

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private
const updateAgent = async (req, res) => {
  const { name, email, phone, status, password } = req.body;

  // Build agent object
  const agentFields = {};
  if (name) agentFields.name = name;
  if (email) agentFields.email = email;
  if (phone) agentFields.phone = phone;
  if (status) agentFields.status = status;

  try {
    // Find agent and make sure it belongs to this user
    let agent = await Agent.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      agentFields.password = await bcrypt.hash(password, salt);
    }

    // Update agent
    agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { $set: agentFields },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private
const deleteAgent = async (req, res) => {
  try {
    // Find agent and make sure it belongs to this user
    const agent = await Agent.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    await agent.deleteOne();

    res.status(200).json({
      success: true,
      message: "Agent removed",
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
};
