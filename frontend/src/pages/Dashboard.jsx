// Dashboard.jsx
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
import "../components/styles/dashboard.css"; // your team lead CSS

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [productivity, setProductivity] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [error, setError] = useState(null);

  // Manager flag
  const isManager = true;

  // Check-in state
  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("manager:checkedIn")) || false;
    } catch {
      return false;
    }
  });
  const [lastCheckIn, setLastCheckIn] = useState(() => localStorage.getItem("manager:lastCheckIn") || null);
  const [lastCheckOut, setLastCheckOut] = useState(() => localStorage.getItem("manager:lastCheckOut") || null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [onBreak, setOnBreak] = useState(false);

  const [activities, setActivities] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch("/api/dashboard/stats");
        const tasksRes = await fetch("/api/dashboard/tasks");
        const productivityRes = await fetch("/api/dashboard/productivity");
        const distributionRes = await fetch("/api/dashboard/distribution");

        if (!statsRes.ok || !tasksRes.ok || !productivityRes.ok || !distributionRes.ok) {
          throw new Error("One of the API calls failed");
        }

        const statsData = await statsRes.json();
        const tasksData = await tasksRes.json();
        const productivityData = await productivityRes.json();
        const distributionData = await distributionRes.json();

        setStats(statsData);
        setTasks(tasksData);
        setProductivity(productivityData);
        setDistribution(distributionData);
      } catch (err) {
        console.error("Backend connection error:", err);
        setError("Failed to load dashboard data. Make sure backend is running.");
      }
    };
    fetchDashboardData();
  }, []);

  // Persist check-in/out
  useEffect(() => {
    localStorage.setItem("manager:checkedIn", JSON.stringify(isCheckedIn));
    if (lastCheckIn) localStorage.setItem("manager:lastCheckIn", lastCheckIn);
    if (lastCheckOut) localStorage.setItem("manager:lastCheckOut", lastCheckOut);
  }, [isCheckedIn, lastCheckIn, lastCheckOut]);

  // Timer
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
    return () => id && clearInterval(id);
  }, [isCheckedIn, lastCheckIn]);

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

  // Check-in/out handlers
  function handleCheckIn() {
    if (!isManager || isCheckedIn) return;
    const now = new Date().toISOString();
    setIsCheckedIn(true);
    setLastCheckIn(now);
    setLastCheckOut(null);
    setOnBreak(false);
    addActivity("Manager checked in", CheckCircle);
  }

  function handleCheckOut() {
    if (!isManager || !isCheckedIn) return;
    const now = new Date().toISOString();
    setIsCheckedIn(false);
    setLastCheckOut(now);
    setOnBreak(false);
    if (lastCheckIn) {
      const totalSeconds = Math.floor((new Date(now).getTime() - new Date(lastCheckIn).getTime()) / 1000);
      addActivity(`Manager checked out (worked ${formatDuration(totalSeconds)})`, Clock);
    } else addActivity("Manager checked out", Clock);
  }

  function handleBreakToggle() {
    if (!isCheckedIn) return;
    setOnBreak((prev) => {
      const next = !prev;
      addActivity(next ? "Manager started break" : "Manager ended break", Activity);
      return next;
    });
  }

  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
  if (!stats) return <h2>Loading dashboard from backend...</h2>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Total Teams" value={stats.totalTeams} icon={Users} variant="primary" trend={{ value: 8, isPositive: true }} />
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={Users} variant="info" trend={{ value: 12, isPositive: true }} />
        <StatCard title="Tasks Pending" value={stats.tasksPending} icon={ClipboardList} variant="warning" />
        <StatCard title="Tasks Done Today" value={stats.tasksDoneToday} icon={CheckCircle} variant="success" />
        <StatCard title="Active Employees" value={stats.activeEmployees} icon={Activity} variant="info" />
        <StatCard title="Alerts" value={stats.alerts} icon={AlertTriangle} variant="warning" />
      </div>

      {/* Manager check-in/out/break */}
      {isManager && (
        <div className="mb-6">
          <div className="stat-card p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="timer-info flex gap-4 items-center">
              <div>
                <div className="timer-label">Work Session</div>
                <div className="timer-display">{isCheckedIn ? formatDuration(elapsedSeconds) : "00:00:00"}</div>
              </div>
              <div className="divider" />
              <div>
                <div className="timer-label">Status</div>
                <div className="status-text">{isCheckedIn ? (onBreak ? "On Break" : "Checked in") : "Checked out"}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleCheckIn} disabled={isCheckedIn} className="btn-check-in"><CheckCircle size={16} /> {isCheckedIn ? "Checked In" : "Check In"}</button>
              <button onClick={handleCheckOut} disabled={!isCheckedIn} className="btn-check-out"><Clock size={16} /> {isCheckedIn ? "Check Out" : "Checked Out"}</button>
              <button onClick={handleBreakToggle} disabled={!isCheckedIn} className="btn-break"><Activity size={16} /> {onBreak ? "End Break" : "Start Break"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <h3 className="chart-title">Tasks Assigned vs Completed</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasks}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="assigned" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="chart-title">Employee Productivity Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Line type="monotone" dataKey="productivity" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="stat-card">
          <h3 className="chart-title">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || getColor(index)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="stat-card lg:col-span-2">
          <h3 className="chart-title">Recent Activity</h3>
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

// Pie chart fallback colors
function getColor(index) {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];
  return colors[index % colors.length];
}
