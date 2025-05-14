const List = require("../models/List");
const ListItem = require("../models/ListItem");
const Agent = require("../models/Agent");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter allowed file types
const fileFilter = (req, file, cb) => {
  const filetypes = /csv|xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only CSV, XLSX and XLS files are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
}).single("file");

// @desc    Upload and distribute list
// @route   POST /api/lists/upload
// @access  Private
const uploadList = async (req, res) => {
  // Use multer to handle upload
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Multer error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    try {
      const filePath = req.file.path;
      const fileExt = path.extname(req.file.originalname).toLowerCase();
      let records = [];

      // Parse the file based on extension
      if (fileExt === ".csv") {
        // Parse CSV file
        const results = [];

        await new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", resolve)
            .on("error", reject);
        });

        records = results;
      } else if (fileExt === ".xlsx" || fileExt === ".xls") {
        // Parse Excel file
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        records = xlsx.utils.sheet_to_json(worksheet);
      }

      // Validate records
      const validRecords = records.filter((record) => {
        return record.firstName && record.phone;
      });

      if (validRecords.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "No valid records found in the file. Required fields: firstName, phone",
        });
      }

      // Get all active agents
      const agents = await Agent.find({ status: "active" });

      if (agents.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No active agents found to distribute the list",
        });
      }

      // Create a new list
      const list = new List({
        name: req.body.name || `List ${new Date().toLocaleDateString()}`,
        description: req.body.description || "Uploaded list",
        totalItems: validRecords.length,
        uploadedBy: req.user._id || req.user.id, // Handle both authMiddleware formats
      });

      await list.save();

      // Distribute records among agents
      const listItems = [];
      const agentCount = agents.length;

      validRecords.forEach((record, index) => {
        // Distribute records evenly among agents (round-robin)
        const agentIndex = index % agentCount;
        const agent = agents[agentIndex];

        listItems.push(
          new ListItem({
            firstName: record.firstName,
            phone: record.phone,
            notes: record.notes || "",
            assignedTo: agent._id,
          })
        );
      });

      // Save all list items
      await ListItem.insertMany(listItems);

      // Delete the uploaded file
      fs.unlinkSync(filePath);

      res.status(201).json({
        success: true,
        message: "List uploaded and distributed successfully",
        data: {
          listId: list._id,
          totalItems: validRecords.length,
          agentsDistributed: agentCount,
        },
      });
    } catch (error) {
      console.error("Error processing file:", error);
      return res.status(500).json({
        success: false,
        message: "Server error processing the file",
        error: error.message,
      });
    }
  });
};

// @desc    Get all lists
// @route   GET /api/lists
// @access  Private
const getLists = async (req, res) => {
  try {
    const lists = await List.find()
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email");

    res.status(200).json({
      success: true,
      count: lists.length,
      data: lists,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get list by ID with its items
// @route   GET /api/lists/:id
// @access  Private
const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate(
      "uploadedBy",
      "name email"
    );

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    // Get all items for this list
    const items = await ListItem.find({ listId: list._id }).populate(
      "assignedTo",
      "name email"
    );

    res.status(200).json({
      success: true,
      data: {
        list,
        items,
      },
    });
  } catch (err) {
    console.error(err);
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get agent's assigned list items
// @route   GET /api/lists/agent/:agentId
// @access  Private
const getAgentListItems = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const items = await ListItem.find({ assignedTo: agent._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    console.error(err);
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
  uploadList,
  getLists,
  getListById,
  getAgentListItems,
};
