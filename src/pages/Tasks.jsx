import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";

export default function Tasks() {

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design Dashboard UI",
      assignedTo: "Rahul",
      priority: "High",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Build API Integration",
      assignedTo: "Priya",
      priority: "Medium",
      status: "Pending",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    priority: "Medium",
  });

  const [filter, setFilter] = useState("All");

  // ================= ADD TASK =================
  const addTask = () => {
    if (!newTask.title || !newTask.assignedTo) return;

    const task = {
      id: Date.now(),
      ...newTask,
      status: "Pending",
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: "", assignedTo: "", priority: "Medium" });
  };

  // ================= DELETE TASK =================
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // ================= CHANGE STATUS =================
  const changeStatus = (id, status) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  // ================= FILTER =================
  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">
        Task Management
      </h1>

      {/* ================= ADD TASK FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow border mb-6">

        <h2 className="font-semibold mb-4">
          Create New Task
        </h2>

        <div className="grid grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Task Title"
            className="border p-2 rounded"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Assign To"
            className="border p-2 rounded"
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask({ ...newTask, assignedTo: e.target.value })
            }
          />

          <select
            className="border p-2 rounded"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-600 text-white rounded flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            Add Task
          </button>

        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="mb-4 flex gap-3">
        {["All", "Pending", "In Progress", "Completed"].map((status) => (
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

      {/* ================= TASK TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow border">

        <table className="w-full text-sm">
          <thead className="text-gray-500">
            <tr>
              <th className="text-left py-2">Title</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-t text-center">

                <td className="py-3 text-left">
                  {task.title}
                </td>

                <td>{task.assignedTo}</td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>

                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      changeStatus(task.id, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:underline flex items-center gap-1 justify-center"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}
