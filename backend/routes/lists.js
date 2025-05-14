const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Load models
const List = require("../models/List");
const Agent = require("../models/Agent");

// @route   POST api/lists/upload
// @desc    Upload and distribute a new list
// @access  Private
router.post("/upload", auth, async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ msg: "No file was uploaded" });
    }

    const listFile = req.files.file;
    const listName = req.body.name;

    if (!listName) {
      return res.status(400).json({ msg: "List name is required" });
    }

    // Get file extension
    const fileExt = path.extname(listFile.name).toLowerCase();

    // Check file type
    if (![".csv", ".xlsx", ".xls"].includes(fileExt)) {
      return res
        .status(400)
        .json({ msg: "Only CSV and Excel files are allowed" });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}${fileExt}`;
    const uploadPath = path.join(uploadDir, uniqueFilename);

    // Save the file
    await listFile.mv(uploadPath);

    // Parse the file based on its type
    let records = [];

    if (fileExt === ".csv") {
      // Parse CSV
      records = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(uploadPath)
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", (error) => reject(error));
      });
    } else {
      // Parse Excel
      const workbook = xlsx.readFile(uploadPath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      records = xlsx.utils.sheet_to_json(worksheet);
    }

    // Validate required fields
    const requiredFields = ["FirstName", "Phone", "Notes"];
    const hasRequiredFields = requiredFields.every((field) =>
      Object.keys(records[0]).includes(field)
    );

    if (!hasRequiredFields) {
      // Clean up the file
      fs.unlinkSync(uploadPath);
      return res.status(400).json({
        msg: "File must contain FirstName, Phone, and Notes columns",
      });
    }

    // Get active agents
    const agents = await Agent.find({ status: "active" });

    if (agents.length === 0) {
      // Clean up the file
      fs.unlinkSync(uploadPath);
      return res.status(400).json({
        msg: "No active agents found to distribute the list",
      });
    }

    // Distribute records among agents
    const distribution = distributeRecords(records, agents);

    // Create list record
    const list = new List({
      name: listName,
      filePath: uploadPath,
      totalRecords: records.length,
      distributedTo: distribution.map((dist) => ({
        agent: dist.agent._id,
        recordCount: dist.records.length,
      })),
    });

    await list.save();

    res.json({
      msg: "List uploaded and distributed successfully",
      listId: list._id,
      distribution: distribution.map((dist) => ({
        agentName: dist.agent.name,
        recordCount: dist.records.length,
      })),
    });
  } catch (err) {
    console.error("Error uploading list:", err);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lists
// @desc    Get all distributed lists
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const lists = await List.find().sort({ createdAt: -1 });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/lists/:id
// @desc    Get list by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ msg: "List not found" });
    }

    res.json(list);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "List not found" });
    }
    res.status(500).send("Server error");
  }
});

// Function to distribute records among agents
function distributeRecords(records, agents) {
  const distribution = agents.map((agent) => ({
    agent,
    records: [],
  }));

  // Distribute records equally
  records.forEach((record, index) => {
    const agentIndex = index % agents.length;
    distribution[agentIndex].records.push(record);
  });

  return distribution;
}

module.exports = router;
