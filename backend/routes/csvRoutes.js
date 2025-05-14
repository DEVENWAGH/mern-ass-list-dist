const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadAndDistribute,
  getDistributions,
} = require("../controllers/csvController");

// Create uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow only specific file extensions
  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only CSV, XLSX, and XLS are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    fileFilter(req, file, cb);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Routes
router.post("/upload", protect, upload.single("csvFile"), uploadAndDistribute);
router.get("/distributions", protect, getDistributions);

module.exports = router;
