const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: String,
  title: String,
  employee: String,
  team: String,
  priority: String,
  deadline: Date,
  status: {
    type: String,
    default: "Pending",
  },
  completedOn: {
    type: Date,
    default: null,
  },
  description: String,
  assignedOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Task", taskSchema);