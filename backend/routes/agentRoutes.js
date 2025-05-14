const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
  createAgent,
  getAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
} = require("../controllers/agentController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/agents
// @desc    Create an agent
// @access  Private
router.post(
  "/",
  [
    protect,
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("phone", "Phone number is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  createAgent
);

// @route   GET /api/agents
// @desc    Get all agents
// @access  Private
router.get("/", protect, getAgents);

// @route   GET /api/agents/:id
// @desc    Get agent by ID
// @access  Private
router.get("/:id", protect, getAgentById);

// @route   PUT /api/agents/:id
// @desc    Update agent
// @access  Private
router.put("/:id", protect, updateAgent);

// @route   DELETE /api/agents/:id
// @desc    Delete agent
// @access  Private
router.delete("/:id", protect, deleteAgent);

module.exports = router;
