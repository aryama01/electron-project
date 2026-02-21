const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ assignedOn: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new task
router.post("/", async (req, res) => {
  try {
    const taskCount = await Task.countDocuments();
    const taskId = `T${100 + taskCount + 1}`;

    const newTask = new Task({
      ...req.body,
      taskId
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;