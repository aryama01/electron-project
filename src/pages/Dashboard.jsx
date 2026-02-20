import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  // ================= SAMPLE DATA =================
  const summary = {
    totalMembers: 8,
    activeToday: 7,
    assigned: 42,
    completed: 35,
    pending: 7,
    pendingApprovals: 3,
  };

  const productivityData = [
    { week: "Week 1", tasks: 20 },
    { week: "Week 2", tasks: 25 },
    { week: "Week 3", tasks: 30 },
    { week: "Week 4", tasks: 28 },
  ];

  const activities = [
    { text: "Rahul completed Task T101", time: "5 min ago" },
    { text: "Priya submitted timesheet", time: "20 min ago" },
    { text: "Arjun started Task T108", time: "1 hour ago" },
    { text: "Sneha requested leave", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-10">

      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-3xl font-semibold">
          Team Lead Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of team performance and recent activities
        </p>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm mb-2">
            Total Members
          </p>
          <h2 className="text-3xl font-bold">
            {summary.totalMembers}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm mb-2">
            Active Today
          </p>
          <h2 className="text-3xl font-bold text-green-600">
            {summary.activeToday}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <p className="text-gray-500 text-sm mb-2">
            Pending Approvals
          </p>
          <h2 className="text-3xl font-bold text-red-600">
            {summary.pendingApprovals}
          </h2>
        </div>

      </div>

      {/* ================= TASK STATUS ================= */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-blue-50 p-6 rounded-2xl border">
          <p className="text-blue-700 text-sm mb-2">
            Tasks Assigned
          </p>
          <h2 className="text-2xl font-bold text-blue-700">
            {summary.assigned}
          </h2>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border">
          <p className="text-green-700 text-sm mb-2">
            Completed
          </p>
          <h2 className="text-2xl font-bold text-green-700">
            {summary.completed}
          </h2>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border">
          <p className="text-red-700 text-sm mb-2">
            Pending
          </p>
          <h2 className="text-2xl font-bold text-red-700">
            {summary.pending}
          </h2>
        </div>

      </div>

      {/* ================= CHART + ACTIVITY SECTION ================= */}
      <div className="grid grid-cols-3 gap-6">

        {/* PRODUCTIVITY CHART */}
        <div className="col-span-2 bg-white p-8 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6">
            Team Productivity (Monthly)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RECENT ACTIVITY TIMELINE */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-6">
            Recent Activity
          </h2>

          <div className="space-y-6">

            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">

                {/* Timeline Dot */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  {index !== activities.length - 1 && (
                    <div className="w-[2px] h-10 bg-gray-200"></div>
                  )}
                </div>

                {/* Activity Content */}
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {activity.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>

              </div>
            ))}

          </div>
        </div>

      </div>

    </div>
  );
}
