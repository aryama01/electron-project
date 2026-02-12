
import React, { useState, useEffect } from "react";
import { Users, ClipboardList, CheckCircle, AlertTriangle, Activity, Clock } from "lucide-react";
import { StatCard } from "../components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../components/styles/dashboard.css";

const taskData = [
  { name: "Mon", assigned: 24, completed: 20 },
  { name: "Tue", assigned: 30, completed: 28 },
  { name: "Wed", assigned: 20, completed: 18 },
  { name: "Thu", assigned: 27, completed: 25 },
  { name: "Fri", assigned: 35, completed: 30 },
  { name: "Sat", assigned: 15, completed: 14 },
  { name: "Sun", assigned: 10, completed: 10 },
];

const productivityData = [
  { name: "Week 1", productivity: 78 },
  { name: "Week 2", productivity: 82 },
  { name: "Week 3", productivity: 85 },
  { name: "Week 4", productivity: 88 },
];

const taskDistribution = [
  { name: "Completed", value: 65, color: "hsl(142, 76%, 36%)" },
  { name: "In Progress", value: 25, color: "hsl(221, 83%, 53%)" },
  { name: "Pending", value: 10, color: "hsl(38, 92%, 50%)" },
];

export default function Dashboard() {
  // Manager flag - toggle or derive from auth in real app
  const isManager = true;

  // Persisted check-in state
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("manager:checkedIn")) || false;
    } catch {
      return false;
    }
  });
  const [lastCheckIn, setLastCheckIn] = useState(() => localStorage.getItem("manager:lastCheckIn") || null);
  const [lastCheckOut, setLastCheckOut] = useState(() => localStorage.getItem("manager:lastCheckOut") || null);

  // timer (seconds) while checked in
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // break state
  const [onBreak, setOnBreak] = useState(false);

  // Recent activity list (includes manager actions)
  const initialActivities = [
    { action: "Task T103 completed by Rahul", time: "2 min ago", icon: CheckCircle },
    { action: "New team member added to QA", time: "15 min ago", icon: Users },
    { action: "Task deadline updated for T105", time: "1 hour ago", icon: Clock },
    { action: "Priya started working on T107", time: "2 hours ago", icon: Activity },
  ];
  const [activities, setActivities] = useState(initialActivities);

  useEffect(() => {
    localStorage.setItem("manager:checkedIn", JSON.stringify(isCheckedIn));
  }, [isCheckedIn]);

  useEffect(() => {
    if (lastCheckIn) localStorage.setItem("manager:lastCheckIn", lastCheckIn);
    if (lastCheckOut) localStorage.setItem("manager:lastCheckOut", lastCheckOut);
  }, [lastCheckIn, lastCheckOut]);

  // Update elapsed timer when checked in
  useEffect(() => {
    let id = null;
    if (isCheckedIn && lastCheckIn) {
      const start = new Date(lastCheckIn).getTime();
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      id = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [isCheckedIn, lastCheckIn]);

  function formatTimestamp(iso) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }

  function formatDuration(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (v) => String(v).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  function addActivity(action, icon = CheckCircle) {
    const time = new Date().toLocaleString();
    setActivities((prev) => [{ action, time, icon }, ...prev].slice(0, 10));
  }

  function handleCheckIn() {
    if (!isManager) return;
    if (isCheckedIn) return;
    const now = new Date().toISOString();
    setIsCheckedIn(true);
    setLastCheckIn(now);
    setLastCheckOut(null);
    setOnBreak(false);
    addActivity("Manager checked in", CheckCircle);
  }

  function handleCheckOut() {
    if (!isManager) return;
    if (!isCheckedIn) return;
    const now = new Date().toISOString();
    setIsCheckedIn(false);
    setLastCheckOut(now);
    setOnBreak(false);
    if (lastCheckIn) {
      const start = new Date(lastCheckIn).getTime();
      const end = new Date(now).getTime();
      const totalSeconds = Math.floor((end - start) / 1000);
      addActivity(`Manager checked out (worked ${formatDuration(totalSeconds)})`, Clock);
    } else {
      addActivity("Manager checked out", Clock);
    }
  }

  function handleBreakToggle() {
    if (!isCheckedIn) return; // only allow if checked in
    setOnBreak((prev) => {
      const next = !prev;
      addActivity(next ? "Manager started break" : "Manager ended break", Activity);
      return next;
    });
  }

  return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
              title="Total Teams"
              value={12}
              icon={Users}
              variant="primary"
              trend={{ value: 8, isPositive: true }}
          />
          <StatCard
              title="Total Employees"
              value={156}
              icon={Users}
              variant="info"
              trend={{ value: 12, isPositive: true }}
          />
          <StatCard
              title="Tasks Pending"
              value={34}
              icon={ClipboardList}
              variant="warning"
          />
          <StatCard
              title="Tasks Done Today"
              value={28}
              icon={CheckCircle}
              variant="success"
          />
          <StatCard
              title="Active Employees"
              value={142}
              icon={Activity}
              variant="info"
          />
          <StatCard
              title="Alerts"
              value={5}
              icon={AlertTriangle}
              variant="warning"
          />
        </div>

        {/* Manager Check-in / Check-out / Break */}
        {isManager && (
            <div className="mb-6">
              <div className="stat-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="timer-info" style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div>
                    <div className="timer-label">Work Session</div>
                    <div className="timer-display" id="work-timer">{isCheckedIn ? formatDuration(elapsedSeconds) : "00:00:00"}</div>
                  </div>

                  <div style={{ height: 40, width: 1, background: "var(--border)" }} />

                  <div>
                    <div className="timer-label">Status</div>
                    <div style={{ fontWeight: 600, color: "var(--muted-foreground)" }} id="work-status">
                      {isCheckedIn ? (onBreak ? "On Break" : "Checked in") : "Checked out"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                      onClick={handleCheckIn}
                      className="btn-check-in"
                      aria-label="Check in"
                      disabled={isCheckedIn}
                  >
                    <CheckCircle size={16} />
                    {isCheckedIn ? "Checked In" : "Check In"}
                  </button>

                  <button
                      onClick={handleCheckOut}
                      className="btn-check-out"
                      aria-label="Check out"
                      disabled={!isCheckedIn}
                  >
                    <Clock size={16} />
                    {isCheckedIn ? "Check Out" : "Checked Out"}
                  </button>

                  <button
                      onClick={handleBreakToggle}
                      className="btn-break"
                      aria-label="Break"
                      disabled={!isCheckedIn}
                  >
                    <Activity size={16} />
                    {onBreak ? "End Break" : "Start Break"}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tasks Chart */}
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Tasks Assigned vs Completed</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                />
                <Bar dataKey="assigned" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Productivity Chart */}
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Employee Productivity Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="stat-card">
            <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {taskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="stat-card lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
  );
}


