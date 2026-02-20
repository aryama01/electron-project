const express = require("express");
const router = express.Router();
const trackerController = require("../controllers/tracker.controller");

router.post("/status", trackerController.updateStatus);
router.post("/heartbeat", trackerController.heartbeat);
router.post(
    "/screenshot",
    trackerController.upload.single("screenshot"),
    trackerController.uploadScreenshot
);

module.exports = router;
