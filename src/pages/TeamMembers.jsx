import { useState } from "react";
import { Search, UserMinus } from "lucide-react";

export default function TeamMembers() {

  const [search, setSearch] = useState("");

  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Rahul Kumar",
      role: "Frontend Developer",
      status: "Active",
      assigned: 12,
      completed: 10,
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "Backend Developer",
      status: "Active",
      assigned: 15,
      completed: 13,
    },
    {
      id: 3,
      name: "Arjun Patel",
      role: "QA Engineer",
      status: "On Leave",
      assigned: 8,
      completed: 6,
    },
  ]);

  // ================= SEARCH FILTER =================
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  // ================= REMOVE MEMBER =================
  const removeMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Team Members
      </h1>

      {/* ================= SEARCH BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow border mb-6 flex items-center gap-3">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search team member..."
          className="outline-none w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= MEMBER CARDS ================= */}
      <div className="grid grid-cols-3 gap-6">

        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white p-6 rounded-xl shadow border"
          >

            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold text-blue-600">
                {member.name.charAt(0)}
              </div>

              <div>
                <h2 className="font-semibold text-lg">
                  {member.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {member.role}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  member.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {member.status}
              </span>
            </div>

            {/* Task Stats */}
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>Assigned Tasks: {member.assigned}</p>
              <p>Completed Tasks: {member.completed}</p>
              <p>
                Completion Rate:{" "}
                {((member.completed / member.assigned) * 100).toFixed(1)}%
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeMember(member.id)}
              className="flex items-center gap-2 text-red-600 text-sm hover:underline"
            >
              <UserMinus size={16} />
              Remove Member
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}
