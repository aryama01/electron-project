import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { CalendarIcon, Plus, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { StatusBadge } from "../components/ui/status-badge";

const BASE_URL = "http://localhost:5000";

export default function Tasks() {

  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    employee: "",
    team: "",
    priority: "",
    description: "",
  });

  // ✅ FETCH TASKS FROM BACKEND
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/tasks`);
      const data = await res.json();

      // Convert backend format → your UI format
      const formattedTasks = data.map(task => ({
        id: task.taskId,
        employee: task.employee,
        team: task.team || "-",
        assignedOn: task.assignedOn
          ? format(new Date(task.assignedOn), "dd MMM")
          : "-",
        deadline: task.deadline
          ? format(new Date(task.deadline), "dd MMM")
          : "-",
        status: task.status?.toLowerCase() || "pending",
        completedOn: task.completedOn
          ? format(new Date(task.completedOn), "dd MMM")
          : "-"
      }));

      setTasks(formattedTasks);

    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle form change
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // ✅ HANDLE SUBMIT (Backend Connected)
  const handleSubmit = async () => {
    if (!formData.title || !formData.employee || !formData.priority || !date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await fetch(`${BASE_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          deadline: date,
          status: "Pending"
        })
      });

      // Refresh tasks
      fetchTasks();

      // Reset form
      setFormData({
        title: "",
        employee: "",
        team: "",
        priority: "",
        description: ""
      });

      setDate(null);

    } catch (err) {
      console.error("Error saving task", err);
    }
  };

  // Search filter
  const filteredTasks = tasks.filter(
    (task) =>
      task.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Task Management</h1>
        <p className="page-subtitle">Assign and track tasks across your teams.</p>
      </div>

      {/* Task Assignment Form */}
      <div className="form-section mb-8">
        <h2 className="text-lg font-semibold mb-6">Assign New Task</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select onValueChange={(value) => handleChange("employee", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee or team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rahul">Rahul - Dev Team</SelectItem>
                <SelectItem value="Priya">Priya - QA Team</SelectItem>
                <SelectItem value="Amit">Amit - Design Team</SelectItem>
                <SelectItem value="Sneha">Sneha - Dev Team</SelectItem>
                <SelectItem value="Karan">Karan - Backend Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="mt-6">
          <Button className="gap-2" onClick={handleSubmit}>
            <Plus size={16} />
            Assign Task
          </Button>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="form-section">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">All Tasks</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search tasks..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Task ID</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Assigned On</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completed On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className="table-row-hover">
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.employee}</TableCell>
                  <TableCell>{task.team}</TableCell>
                  <TableCell>{task.assignedOn}</TableCell>
                  <TableCell>{task.deadline}</TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>{task.completedOn}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
