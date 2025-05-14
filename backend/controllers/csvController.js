const Distribution = require("../models/Distribution");
const Agent = require("../models/Agent");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

// @desc    Upload and distribute CSV/Excel file
// @route   POST /api/csv/upload
// @access  Private
const uploadAndDistribute = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get file path and extension
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    let items = [];

    // Parse file based on its extension
    if (fileExt === ".csv") {
      // Parse CSV file
      items = await parseCSV(filePath);
    } else if ([".xlsx", ".xls"].includes(fileExt)) {
      // Parse Excel file
      items = parseExcel(filePath);
    } else {
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "Invalid file format. Only CSV, XLSX, and XLS are supported",
      });
    }

    // Validate that we have items and they have required fields
    if (items.length === 0) {
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "The file is empty or could not be parsed",
      });
    }

    // Check that all items have the required firstName and phone fields
    const hasInvalidItems = items.some(
      (item) => !item.firstName || !item.phone
    );
    if (hasInvalidItems) {
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message:
          "File contains rows missing required fields: FirstName and Phone",
      });
    }

    // Get active agents
    const agents = await Agent.find({ status: "active" });

    if (agents.length === 0) {
      // Clean up file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: "No active agents found to distribute tasks to",
      });
    }

    // Delete existing distributions
    await Distribution.deleteMany({});

    // Distribute items among agents
    const distributions = distributeItems(items, agents);

    // Save distributions to database
    const savedDistributions = {};
    for (const agentId in distributions) {
      const distribution = new Distribution({
        agent: agentId,
        items: distributions[agentId],
      });
      await distribution.save();
      savedDistributions[agentId] = distributions[agentId];
    }

    // Clean up file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(201).json({
      success: true,
      message: "File uploaded and distributed successfully",
      data: savedDistributions,
    });
  } catch (error) {
    console.error("Error processing file:", error);

    // Clean up file if exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Error processing file",
      error: error.message,
    });
  }
};

// @desc    Get distributions by agent
// @route   GET /api/csv/distributions
// @access  Private
const getDistributions = async (req, res) => {
  try {
    const distributions = await Distribution.find().populate(
      "agent",
      "name email"
    );

    const formattedDistributions = {};
    distributions.forEach((dist) => {
      formattedDistributions[dist.agent._id] = dist.items;
    });

    res.status(200).json({
      success: true,
      data: formattedDistributions,
    });
  } catch (error) {
    console.error("Error fetching distributions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching distributions",
      error: error.message,
    });
  }
};

// Helper function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Normalize column names - look for common variations
        const item = {
          firstName:
            data.FirstName ||
            data.firstName ||
            data.FIRSTNAME ||
            data.firstname ||
            data["First Name"] ||
            data["First name"] ||
            data["first name"] ||
            "",
          phone:
            data.Phone ||
            data.phone ||
            data.PHONE ||
            data.PhoneNumber ||
            data.phoneNumber ||
            data["Phone Number"] ||
            data["phone number"] ||
            "",
          notes:
            data.Notes ||
            data.notes ||
            data.NOTES ||
            data.note ||
            data.NOTE ||
            data.Comments ||
            data.comments ||
            "",
        };
        results.push(item);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

// Helper function to parse Excel file
const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  return data.map((row) => ({
    firstName:
      row.FirstName ||
      row.firstName ||
      row.FIRSTNAME ||
      row.firstname ||
      row["First Name"] ||
      row["First name"] ||
      row["first name"] ||
      "",
    phone:
      row.Phone ||
      row.phone ||
      row.PHONE ||
      row.PhoneNumber ||
      row.phoneNumber ||
      row["Phone Number"] ||
      row["phone number"] ||
      "",
    notes:
      row.Notes ||
      row.notes ||
      row.NOTES ||
      row.note ||
      row.NOTE ||
      row.Comments ||
      row.comments ||
      "",
  }));
};

// Helper function to distribute items among agents
const distributeItems = (items, agents) => {
  const distributions = {};
  agents.forEach((agent) => {
    distributions[agent._id] = [];
  });

  const agentIds = agents.map((agent) => agent._id);
  const numAgents = agentIds.length;

  // Distribute items evenly
  items.forEach((item, index) => {
    const agentIndex = index % numAgents;
    const agentId = agentIds[agentIndex];
    distributions[agentId].push(item);
  });

  return distributions;
};

module.exports = {
  uploadAndDistribute,
  getDistributions,
};
