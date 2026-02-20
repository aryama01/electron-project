import { useState } from "react";

export default function Attendance() {

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const attendanceData = [
    {
      name: "Rahul Kumar",
      status: "Present",
      checkIn: "09:05 AM",
      checkOut: "06:00 PM",
      hours: 8,
    },
    {
      name: "Priya Sharma",
      status: "Present",
      checkIn: "09:15 AM",
      checkOut: "06:30 PM",
      hours: 9,
    },
    {
      name: "Arjun Patel",
      status: "Absent",
      checkIn: "-",
      checkOut: "-",
      hours: 0,
    },
    {
      name: "Sneha Reddy",
      status: "Leave",
      checkIn: "-",
      checkOut: "-",
      hours: 0,
    },
  ];

  const presentCount = attendanceData.filter(
    (emp) => emp.status === "Present"
  ).length;

  const absentCount = attendanceData.filter(
    (emp) => emp.status === "Absent"
  ).length;

  const leaveCount = attendanceData.filter(
    (emp) => emp.status === "Leave"
  ).length;

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Team Attendance
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor daily attendance of team members
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-3 gap-6">

        <div className="bg-green-50 p-6 rounded-2xl border">
          <p className="text-green-700 text-sm mb-2">
            Present
          </p>
          <h2 className="text-3xl font-bold text-green-700">
            {presentCount}
          </h2>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border">
          <p className="text-red-700 text-sm mb-2">
            Absent
          </p>
          <h2 className="text-3xl font-bold text-red-700">
            {absentCount}
          </h2>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl border">
          <p className="text-yellow-700 text-sm mb-2">
            On Leave
          </p>
          <h2 className="text-3xl font-bold text-yellow-700">
            {leaveCount}
          </h2>
        </div>

      </div>

      {/* ================= ATTENDANCE TABLE ================= */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border">

        <h2 className="text-lg font-semibold mb-6">
          Attendance Details
        </h2>

        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left py-3">Employee</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Hours</th>
            </tr>
          </thead>

          <tbody>
            {attendanceData.map((emp, index) => (
              <tr key={index} className="border-b text-center">

                <td className="text-left py-4 font-medium">
                  {emp.name}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      emp.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : emp.status === "Absent"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>

                <td>{emp.checkIn}</td>
                <td>{emp.checkOut}</td>
                <td>{emp.hours} hrs</td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}
