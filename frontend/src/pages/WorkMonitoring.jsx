import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Search, Monitor, Download, Eye, Camera } from "lucide-react";
import { StatusBadge } from "../components/ui/status-badge";

const employeeActivity = [
  { id: 1, name: "Rahul Kumar", loginTime: "9:05 AM", activeHours: "6h 20m", screenshots: 45, idleTime: "30m", status: "active" },
  { id: 2, name: "Priya Sharma", loginTime: "9:15 AM", activeHours: "5h 45m", screenshots: 38, idleTime: "45m", status: "active" },
  { id: 3, name: "Amit Singh", loginTime: "9:30 AM", activeHours: "4h 10m", screenshots: 28, idleTime: "1h 20m", status: "active" },
  { id: 4, name: "Sneha Patel", loginTime: "10:00 AM", activeHours: "3h 30m", screenshots: 22, idleTime: "50m", status: "active" },
  { id: 5, name: "Karan Mehta", loginTime: "-", activeHours: "-", screenshots: 0, idleTime: "-", status: "inactive" },
  { id: 6, name: "Ravi Verma", loginTime: "8:45 AM", activeHours: "7h 15m", screenshots: 52, idleTime: "25m", status: "active" },
];

export default function WorkMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = employeeActivity.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Work Monitoring</h1>
          <p className="page-subtitle">Track employee activity and productivity in real-time.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <Monitor size={20} className="text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Active Now</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Camera size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">185</p>
                <p className="text-sm text-muted-foreground">Screenshots Today</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-info/10">
                <Monitor size={20} className="text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">27h 00m</p>
                <p className="text-sm text-muted-foreground">Total Active Hours</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10">
                <Monitor size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">4h 30m</p>
                <p className="text-sm text-muted-foreground">Total Idle Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="form-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Employee Activity</h2>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                    placeholder="Search employees..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                Download Report
              </Button>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Employee</TableHead>
                  <TableHead>Login Time</TableHead>
                  <TableHead>Active Hours</TableHead>
                  <TableHead>Screenshots</TableHead>
                  <TableHead>Idle Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id} className="table-row-hover">
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.loginTime}</TableCell>
                      <TableCell>{employee.activeHours}</TableCell>
                      <TableCell>{employee.screenshots}</TableCell>
                      <TableCell>{employee.idleTime}</TableCell>
                      <TableCell>
                        <StatusBadge status={employee.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => setSelectedEmployee(employee)}
                              >
                                <Camera size={14} />
                                Screenshots
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Screenshots - {employee.name}</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-3 gap-4 py-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-video bg-muted rounded-lg flex items-center justify-center"
                                    >
                                      <Camera size={32} className="text-muted-foreground" />
                                    </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye size={14} />
                            Logs
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
  );
}
