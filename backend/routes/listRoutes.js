const express = require("express");
const router = express.Router();
const {
  uploadList,
  getLists,
  getListById,
  getAgentListItems,
} = require("../controllers/listController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/lists/upload
// @desc    Upload and distribute a list
// @access  Private
router.post("/upload", protect, uploadList);

// @route   GET /api/lists
// @desc    Get all lists
// @access  Private
router.get("/", protect, getLists);

// @route   GET /api/lists/:id
// @desc    Get list by ID
// @access  Private
router.get("/:id", protect, getListById);

// @route   GET /api/lists/agent/:agentId
// @desc    Get agent's list items
// @access  Private
router.get("/agent/:agentId", protect, getAgentListItems);

module.exports = router;
