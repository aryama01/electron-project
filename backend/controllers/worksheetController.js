const Worksheet = require("../models/worksheetModel");

// CREATE WORKSHEET
exports.createWorksheet = async (req, res) => {
  try {
    const worksheetData = {
      ...req.body,
      history: [{
        action: "Task Created",
        details: `Task assigned to developer: ${req.body.developer}`
      }]
    };
    const worksheet = await Worksheet.create(worksheetData);
    res.status(201).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL WORKSHEETS
exports.getAllWorksheets = async (req, res) => {
  try {
    const worksheets = await Worksheet.find().sort({ createdAt: -1 });
    res.status(200).json(worksheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE WORKSHEET
exports.getWorksheetById = async (req, res) => {
  try {
    const worksheet = await Worksheet.findById(req.params.id);

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE WORKSHEET
exports.updateWorksheet = async (req, res) => {
  try {
    const updated = await Worksheet.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true, // 🔥 Important Fix
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE WORKSHEET
exports.deleteWorksheet = async (req, res) => {
  try {
    const deleted = await Worksheet.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json({ message: "Worksheet deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// MARK WORKSHEET AS COMPLETED
exports.markAsCompleted = async (req, res) => {
  try {
    // First get the current worksheet to know the developer
    const currentWorksheet = await Worksheet.findById(req.params.id);
    if (!currentWorksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        $push: {
          history: {
            action: "Task Completed",
            details: `Developer ${currentWorksheet.developer} marked the task as completed`
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ASSIGN TESTER
exports.assignTester = async (req, res) => {
  try {
    const { testerId } = req.body;

    if (!testerId) {
      return res.status(400).json({ message: "Tester ID is required" });
    }

    // Get current worksheet to know the developer
    const currentWorksheet = await Worksheet.findById(req.params.id);
    if (!currentWorksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      {
        tester: testerId,
        status: "testing",
        $push: {
          history: {
            action: "Assigned to Tester",
            details: `Task moved from developer ${currentWorksheet.developer} to tester ${testerId} for testing`
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// START TESTING
exports.startTesting = async (req, res) => {
  try {
    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      { status: "testing" },
      { new: true, runValidators: true }
    );

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// REPORT BUG
exports.reportBug = async (req, res) => {
  try {
    const { remarks } = req.body;
    console.log("Received remarks:", remarks);

    // Get current worksheet to know the tester
    const currentWorksheet = await Worksheet.findById(req.params.id);
    if (!currentWorksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      {
        status: "bug-found",
        $inc: { bugs: 1 }, // Increment bug count
        remarks: remarks || "", // Add remarks
        $push: {
          history: {
            action: "Bugs Found",
            details: `Tester ${currentWorksheet.tester} reported bugs. Task reassigned to developer ${currentWorksheet.developer} for fixes. Details: ${remarks || "No details provided"}`
          }
        }
      },
      { new: true, runValidators: true }
    );

    console.log("Updated worksheet remarks:", worksheet.remarks);

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// APPROVE WORKSHEET
exports.approveWorksheet = async (req, res) => {
  try {
    // Get current worksheet to know the tester
    const currentWorksheet = await Worksheet.findById(req.params.id);
    if (!currentWorksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
        $push: {
          history: {
            action: "Task Approved",
            details: `Tester ${currentWorksheet.tester} approved the task. No bugs found. Task completed successfully.`
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// REASSIGN TO DEVELOPER
exports.reassignToDeveloper = async (req, res) => {
  try {
    // Get current worksheet to know the developer and tester
    const currentWorksheet = await Worksheet.findById(req.params.id);
    if (!currentWorksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    const worksheet = await Worksheet.findByIdAndUpdate(
      req.params.id,
      {
        status: "in-progress",
        $push: {
          history: {
            action: "Reassigned to Developer",
            details: `Task sent back from tester ${currentWorksheet.tester} to developer ${currentWorksheet.developer} for bug fixes`
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!worksheet) {
      return res.status(404).json({ message: "Worksheet not found" });
    }

    res.status(200).json(worksheet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
