const express = require("express");
const { getSentMails, getDrafts, getNotifications, sendMail } = require("../controllers/mailController");

const router = express.Router();

// Mail routes
router.get("/sent", getSentMails);
router.get("/drafts", getDrafts);
router.get("/notifications", getNotifications);
router.post("/send", sendMail);

module.exports = router;
