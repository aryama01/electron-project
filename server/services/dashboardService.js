// services/dashboardService.js

exports.getStats = () => {
  return {
    totalTeams: 14,
    totalEmployees: 158,
    tasksPending: 34,
    tasksDoneToday: 28,
    activeEmployees: 143,
    alerts: 5,
  };
};

exports.getTaskData = () => {
  return [
    { name: "Mon", assigned: 24, completed: 20 },
    { name: "Tue", assigned: 30, completed: 28 },
    { name: "Wed", assigned: 20, completed: 18 },
    { name: "Thu", assigned: 27, completed: 25 },
    { name: "Fri", assigned: 35, completed: 30 },
    { name: "Sat", assigned: 15, completed: 14 },
    { name: "Sun", assigned: 10, completed: 10 },
  ];
};

exports.getProductivityData = () => {
  return [
    { name: "Week 1", productivity: 78 },
    { name: "Week 2", productivity: 82 },
    { name: "Week 3", productivity: 85 },
    { name: "Week 4", productivity: 88 },
  ];
};

exports.getTaskDistribution = () => {
  return [
    { name: "Completed", value: 65 },
    { name: "In Progress", value: 25 },
    { name: "Pending", value: 10 },
  ];
};
