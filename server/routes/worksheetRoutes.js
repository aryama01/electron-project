const express = require("express");
const router = express.Router();

const {
  createWorksheet,
  getAllWorksheets,
  getWorksheetById,
  updateWorksheet,
  deleteWorksheet,
  markAsCompleted,
  assignTester,
  startTesting,
  reportBug,
  approveWorksheet,
  reassignToDeveloper,
} = require("../controllers/worksheetController");

router.post("/", createWorksheet);
router.get("/", getAllWorksheets);
router.get("/:id", getWorksheetById);
router.put("/:id", updateWorksheet);
router.delete("/:id", deleteWorksheet);

// Workflow endpoints
router.patch("/:id/complete", markAsCompleted);
router.patch("/:id/assign-tester", assignTester);
router.patch("/:id/start-testing", startTesting);
router.patch("/:id/report-bug", reportBug);
router.patch("/:id/approve", approveWorksheet);
router.patch("/:id/reassign", reassignToDeveloper);

module.exports = router;
