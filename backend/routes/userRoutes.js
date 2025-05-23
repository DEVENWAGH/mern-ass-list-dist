const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post("/", registerUser);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", loginUser);

// @route   GET /api/users/me
// @desc    Get user profile
// @access  Private
router.get("/me", protect, getUserProfile);

module.exports = router;
