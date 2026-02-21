import React, { useState, useMemo } from "react";
import { Users, Plus, MoreVertical, UserPlus } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../components/ui/dialog";
import "../components/styles/TeamDetails.css";

// Dummy teams and employees
const teamsData = [
  { id: "t1", name: "Engineering", lead: "Rahul Sharma", color: "bg-blue-500" },
  { id: "t2", name: "Design", lead: "Sara Khan", color: "bg-purple-500" },
];

const employeesData = [
  {
    id: 1, name: "Rahul Sharma", role: "Frontend Lead", team: "Engineering", status: "Active", hours: "6h 20m", tasks: 5, img: "rahul",
    reports: [
      { date: "Oct 25", hrs: "8", task: "Dashboard Implementation", status: "Completed" },
      { date: "Oct 24", hrs: "7.5", task: "Bug Fixes", status: "Completed" },
    ],
  },
  {
    id: 2, name: "Priya Patel", role: "QA Engineer", team: "Engineering", status: "Idle", hours: "4h 10m", tasks: 2, img: "priya",
    reports: [
      { date: "Oct 25", hrs: "4", task: "Testing Module A", status: "In Progress" },
    ],
  },
  {
    id: 3, name: "Sara Khan", role: "Product Designer", team: "Design", status: "Active", hours: "8h 00m", tasks: 3, img: "sara",
    reports: [
      { date: "Oct 25", hrs: "8", task: "Wireframing", status: "Completed" },
    ],
  },
];

export default function Teams() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const openTeam = (team) => setSelectedTeam(team);
  const backToTeams = () => setSelectedTeam(null);
  const openReport = (emp) => setSelectedEmp(emp);
  const closeReport = () => setSelectedEmp(null);

  const { totalHrsStr, totalTasks } = useMemo(() => {
    if (!selectedEmp || !Array.isArray(selectedEmp.reports)) return { totalHrsStr: "0h", totalTasks: 0 };
    const sum = selectedEmp.reports.reduce((acc, log) => acc + parseFloat(log.hrs || 0), 0);
    const totalHrsStr = Number.isInteger(sum) ? `${sum}h` : `${sum.toFixed(2)}h`;
    return { totalHrsStr, totalTasks: selectedEmp.reports.length };
  }, [selectedEmp]);

  return (
      <div className="space-y-8 p-6 animate-fade-in">
        {/* Header + Create Team */}
        {!selectedTeam && (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> Create Team
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader>
                      <DialogTitle>Create New Team</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="teamName">Team Name</Label>
                        <Input id="teamName" placeholder="Enter team name..." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teamLead">Team Lead</Label>
                        <Input id="teamLead" placeholder="Enter lead name..." />
                      </div>
                      <Button className="w-full">Create Team</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Teams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {teamsData.map((team, idx) => (
                    <div
                        key={team.id}
                        className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-lg transition-shadow cursor-pointer"
                        style={{ animationDelay: `${idx * 50}ms` }}
                        onClick={() => openTeam(team)}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${team.color} mb-4`}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">{team.name}</h3>
                      <p className="text-muted-foreground mt-1">Lead: {team.lead}</p>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">View Team</Button>
                        <Button variant="outline" size="sm"><UserPlus className="w-4 h-4" /></Button>
                      </div>
                    </div>
                ))}
              </div>
            </>
        )}

        {/* Selected Team - Employees */}
        {selectedTeam && (
            <>
              <Button variant="ghost" className="mb-4" onClick={backToTeams}>← Back to Teams</Button>
              <h2 className="text-2xl font-bold text-foreground">{selectedTeam.name}</h2>
              <p className="text-muted-foreground mb-6">Lead: {selectedTeam.lead}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employeesData.filter(e => e.team === selectedTeam.name).map((emp, idx) => (
                    <div
                        key={emp.id}
                        className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <img src={`https://picsum.photos/seed/${emp.img}/48/48`} alt={emp.name} />
                        </div>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                      <h3 className="text-lg font-semibold text-card-foreground">{emp.name}</h3>
                      <p className="text-muted-foreground">{emp.role}</p>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Status:</span> <span>{emp.status}</span></div>
                        <div className="flex justify-between"><span>Today's Hours:</span> <span>{emp.hours}</span></div>
                        <div className="flex justify-between"><span>Tasks:</span> <span>{emp.tasks}</span></div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full" onClick={() => openReport(emp)}>
                        View Report
                      </Button>
                    </div>
                ))}
              </div>
            </>
        )}

        {/* Report Dialog */}
        <Dialog open={!!selectedEmp} onOpenChange={(open) => { if (!open) closeReport(); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEmp ? `Daily Report: ${selectedEmp.name}` : "Daily Report"}</DialogTitle>
            </DialogHeader>

            {selectedEmp && (
                <div className="space-y-4">
                  <p>Total Hours: <strong>{totalHrsStr}</strong></p>
                  <p>Total Tasks: <strong>{totalTasks}</strong></p>

                  <div className="space-y-2">
                    {selectedEmp.reports.map((log, idx) => (
                        <div key={idx} className="p-2 rounded-md bg-muted/20 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{log.task}</p>
                            <p className="text-sm text-muted-foreground">{log.date}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p>{log.status}</p>
                            <p className="text-muted">{log.hrs}h</p>
                          </div>
                        </div>
                    ))}
                  </div>

                  <DialogClose asChild>
                    <Button variant="ghost" className="w-full">Close</Button>
                  </DialogClose>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
