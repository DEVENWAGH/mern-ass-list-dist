const Distribution = require("../models/Distribution");
const Agent = require("../models/Agent");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const { Readable } = require("stream");

// @desc    Upload and distribute CSV
// @route   POST /api/csv/upload
// @access  Private
const uploadAndDistribute = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    // Get all active agents
    const agents = await Agent.find({ status: "active" });

    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active agents found to distribute tasks to",
      });
    }

    let items = [];
    const fileExt = req.file.originalname.split(".").pop().toLowerCase();

    // Parse the file based on its extension
    if (fileExt === "csv") {
      // Parse CSV
      items = await parseCSV(req.file.path);
    } else if (fileExt === "xlsx" || fileExt === "xls") {
      // Parse Excel
      items = parseExcel(req.file.path);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid file format. Only CSV, XLSX, and XLS are supported",
      });
    }

    // Validate that the parsed items have the required fields
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "The file is empty or could not be parsed",
      });
    }

    for (const item of items) {
      if (!item.firstName || !item.phone) {
        return res.status(400).json({
          success: false,
          message: "File missing required columns: FirstName and Phone",
        });
      }
    }

    // Delete existing distributions first
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

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: "CSV uploaded and distributed successfully",
      data: savedDistributions,
    });
  } catch (error) {
    console.error("Error processing file:", error);

    // Clean up temp file if exists
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
        // Normalize column names
        const item = {
          firstName: data.FirstName || data.firstname || data.FIRSTNAME || "",
          phone: data.Phone || data.phone || data.PHONE || "",
          notes: data.Notes || data.notes || data.NOTES || "",
        };
        results.push(item);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", reject);
  });
};

// Helper function to parse Excel file
const parseExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  return data.map((row) => ({
    firstName: row.FirstName || row.firstName || row.FIRSTNAME || "",
    phone: row.Phone || row.phone || row.PHONE || "",
    notes: row.Notes || row.notes || row.NOTES || "",
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
