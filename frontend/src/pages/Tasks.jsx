import { useState } from "react";
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

const initialTasks = [
  { id: "T101", employee: "Rahul", team: "Dev", assignedOn: "01 Feb", deadline: "05 Feb", status: "completed", completedOn: "04 Feb" },
  { id: "T102", employee: "Priya", team: "QA", assignedOn: "02 Feb", deadline: "07 Feb", status: "pending", completedOn: "-" },
  { id: "T103", employee: "Amit", team: "Design", assignedOn: "03 Feb", deadline: "04 Feb", status: "overdue", completedOn: "-" },
  { id: "T104", employee: "Sneha", team: "Dev", assignedOn: "03 Feb", deadline: "10 Feb", status: "active", completedOn: "-" },
  { id: "T105", employee: "Karan", team: "Backend", assignedOn: "04 Feb", deadline: "08 Feb", status: "pending", completedOn: "-" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [date, setDate] = useState();
  const [searchTerm, setSearchTerm] = useState("");

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
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" placeholder="Enter task title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assign To</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select employee or team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rahul">Rahul - Dev Team</SelectItem>
                <SelectItem value="priya">Priya - QA Team</SelectItem>
                <SelectItem value="amit">Amit - Design Team</SelectItem>
                <SelectItem value="sneha">Sneha - Dev Team</SelectItem>
                <SelectItem value="karan">Karan - Backend Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter task description" rows={3} />
          </div>
        </div>

        <div className="mt-6">
          <Button className="gap-2">
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
