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

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// File filter function for validation
const fileFilter = (req, file, cb) => {
  // Accept csv, xlsx, xls files only
  const filetypes = /csv|xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only CSV, XLSX, and XLS files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Routes
router.post("/upload", protect, upload.single("csvFile"), uploadAndDistribute);

router.get("/distributions", protect, getDistributions);

module.exports = router;
