const { sentMails, drafts, notifications } = require("../data/mailData");

// Get all sent mails
const getSentMails = (req, res) => {
  res.json(sentMails);
};

// Get all drafts
const getDrafts = (req, res) => {
  res.json(drafts);
};

// Get all notifications
const getNotifications = (req, res) => {
  res.json(notifications);
};

// Send a new mail (add to sentMails)
const sendMail = (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newMail = {
    id: sentMails.length + 1,
    to,
    subject,
    message,
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  sentMails.push(newMail);
  res.status(201).json(newMail);
};

module.exports = { getSentMails, getDrafts, getNotifications, sendMail };
