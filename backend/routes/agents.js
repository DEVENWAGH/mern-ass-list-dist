const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// Load Agent model
const Agent = require("../models/Agent");

// @route   POST api/agents
// @desc    Create an agent
// @access  Private
router.post(
  "/",
  [
    auth,
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phone", "Phone number is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password, status } = req.body;

    try {
      // Check if agent exists
      let agent = await Agent.findOne({ email });
      if (agent) {
        return res.status(400).json({ msg: "Agent already exists" });
      }

      // Validate phone number format (must include country code)
      if (!phone.includes("+")) {
        return res
          .status(400)
          .json({ msg: "Phone number must include country code (e.g., +1)" });
      }

      // Create new agent
      agent = new Agent({
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

      res.json({
        msg: "Agent created successfully",
        agent: { id: agent.id, name, email, phone, status },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/agents
// @desc    Get all agents
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const agents = await Agent.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/agents/:id
// @desc    Get agent by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    res.json(agent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Agent not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT api/agents/:id
// @desc    Update agent
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, status, password } = req.body;

  // Build agent object
  const agentFields = {};
  if (name) agentFields.name = name;
  if (email) agentFields.email = email;
  if (phone) agentFields.phone = phone;
  if (status) agentFields.status = status;

  try {
    let agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
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

    res.json(agent);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/agents/:id
// @desc    Delete agent
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    await agent.deleteOne();

    res.json({ msg: "Agent removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Agent not found" });
    }
    res.status(500).send("Server error");
  }
});

module.exports = router;
