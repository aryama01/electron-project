import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

export default function Reports() {

  // ================= SAMPLE DATA =================

  const performanceData = [
    { name: "Rahul", completed: 22 },
    { name: "Priya", completed: 18 },
    { name: "Arjun", completed: 15 },
    { name: "Sneha", completed: 20 },
  ];

  const summary = {
    totalTasks: 75,
    completedTasks: 65,
    pendingTasks: 10,
    avgAttendance: 92,
    totalOvertime: 18,
  };

  const topPerformer = performanceData.reduce((max, member) =>
    member.completed > max.completed ? member : max
  );

  const completionRate =
    (summary.completedTasks / summary.totalTasks) * 100;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Team Reports
      </h1>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Tasks</p>
          <h2 className="text-xl font-bold">
            {summary.totalTasks}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Completion Rate</p>
          <h2 className="text-xl font-bold text-green-600">
            {completionRate.toFixed(1)}%
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Avg Attendance</p>
          <h2 className="text-xl font-bold text-blue-600">
            {summary.avgAttendance}%
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Overtime</p>
          <h2 className="text-xl font-bold text-purple-600">
            {summary.totalOvertime} hrs
          </h2>
        </div>

      </div>

      {/* ================= PRODUCTIVITY CHART ================= */}
      <div className="bg-white p-6 rounded-xl shadow border mb-6">
        <h2 className="font-semibold mb-4">
          Employee Task Completion
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= TOP PERFORMER ================= */}
      <div className="bg-green-50 p-6 rounded-xl border mb-6">
        <h2 className="font-semibold mb-2">
          🏆 Top Performer
        </h2>
        <p className="text-lg font-bold text-green-700">
          {topPerformer.name}
        </p>
        <p className="text-sm text-gray-600">
          Completed {topPerformer.completed} tasks this month
        </p>
      </div>

      {/* ================= EXPORT BUTTON ================= */}
      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Download size={18} />
        Export Report
      </button>

    </div>
  );
}
