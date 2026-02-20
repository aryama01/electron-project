import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export default function TimesheetApproval() {

  const [filter, setFilter] = useState("All");

  const [timesheets, setTimesheets] = useState([
    {
      id: 1,
      employee: "Rahul Kumar",
      date: "16/02/2026",
      totalHours: 8,
      status: "Pending",
      tasks: [
        { task: "UI Design", hours: 4 },
        { task: "Bug Fixing", hours: 4 },
      ],
      comment: "",
    },
    {
      id: 2,
      employee: "Priya Sharma",
      date: "16/02/2026",
      totalHours: 9,
      status: "Approved",
      tasks: [
        { task: "API Integration", hours: 5 },
        { task: "Testing", hours: 4 },
      ],
      comment: "Good work",
    },
  ]);

  const [selectedSheet, setSelectedSheet] = useState(null);

  // ================= FILTER =================
  const filteredSheets =
    filter === "All"
      ? timesheets
      : timesheets.filter((sheet) => sheet.status === filter);

  // ================= APPROVE / REJECT =================
  const updateStatus = (id, newStatus) => {
    setTimesheets(
      timesheets.map((sheet) =>
        sheet.id === id
          ? { ...sheet, status: newStatus }
          : sheet
      )
    );
  };

  const addComment = (id, comment) => {
    setTimesheets(
      timesheets.map((sheet) =>
        sheet.id === id
          ? { ...sheet, comment }
          : sheet
      )
    );
  };

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Timesheet Approvals
      </h1>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="flex gap-3 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ================= TIMESHEET TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow border">

        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="text-left py-2">Employee</th>
              <th>Date</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredSheets.map((sheet) => (
              <tr key={sheet.id} className="border-t text-center">

                <td className="py-3 text-left">
                  {sheet.employee}
                </td>

                <td>{sheet.date}</td>
                <td>{sheet.totalHours} hrs</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      sheet.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : sheet.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {sheet.status}
                  </span>
                </td>

                <td className="space-x-2">

                  <button
                    onClick={() => setSelectedSheet(sheet)}
                    className="text-blue-600"
                  >
                    <Eye size={16} />
                  </button>

                  {sheet.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(sheet.id, "Approved")}
                        className="text-green-600"
                      >
                        <CheckCircle size={16} />
                      </button>

                      <button
                        onClick={() => updateStatus(sheet.id, "Rejected")}
                        className="text-red-600"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* ================= DETAILS MODAL ================= */}
      {selectedSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="font-semibold mb-4">
              {selectedSheet.employee} - {selectedSheet.date}
            </h2>

            <ul className="mb-4">
              {selectedSheet.tasks.map((task, index) => (
                <li key={index} className="text-sm mb-1">
                  {task.task} — {task.hours} hrs
                </li>
              ))}
            </ul>

            <textarea
              placeholder="Add comment..."
              className="border p-2 w-full rounded mb-4"
              value={selectedSheet.comment}
              onChange={(e) =>
                addComment(selectedSheet.id, e.target.value)
              }
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedSheet(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
