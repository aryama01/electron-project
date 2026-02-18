// backend/mailData.js

// Dummy data for sent mails
const sentMails = [
  {
    id: 1,
    to: "Backend Team",
    subject: "Sprint Planning Meeting",
    date: "Feb 05, 2024",
    time: "10:30 AM",
  },
  {
    id: 2,
    to: "Rahul Kumar",
    subject: "Project Update Required",
    date: "Feb 04, 2024",
    time: "3:15 PM",
  },
  {
    id: 3,
    to: "All Teams",
    subject: "Holiday Notice - Republic Day",
    date: "Feb 03, 2024",
    time: "9:00 AM",
  },
];

// Dummy data for drafts
const drafts = [
  {
    id: 1,
    to: "QA Team",
    subject: "Testing Guidelines Update",
    date: "Feb 05, 2024",
  },
  {
    id: 2,
    to: "Design Team",
    subject: "Brand Assets Review",
    date: "Feb 04, 2024",
  },
];

// Dummy data for notifications
const notifications = [
  {
    id: 1,
    title: "New Task Assigned",
    message: "You have been assigned a new task by Rahul",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Task Completed",
    message: "Priya completed the UI review task",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Meeting Reminder",
    message: "Sprint planning meeting in 30 minutes",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "Payslip Generated",
    message: "January 2024 payslips are now available",
    time: "1 day ago",
    read: true,
  },
];

module.exports = { sentMails, drafts, notifications };
