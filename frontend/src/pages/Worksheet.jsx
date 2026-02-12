import React, { useState, useMemo } from "react";
import { Plus, MoreHorizontal, CheckCircle2, Circle, UserCheck, Bug, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../components/ui/dialog";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

// Mock Data
const worksheets = [
    { id: 'WS001', title: 'User Authentication Module', description: 'Implement login/signup with JWT', developer: 'Rahul Sharma', tester: 'Priya Patel', status: 'testing', priority: 'high', deadline: '10 Feb', bugs: 2, lastUpdated: '04 Feb 2025' },
    { id: 'WS002', title: 'Dashboard API', description: 'Create REST API endpoints for dashboard', developer: 'Amit Kumar', tester: '', status: 'completed', priority: 'medium', deadline: '08 Feb', bugs: 0, lastUpdated: '03 Feb 2025' },
    { id: 'WS003', title: 'Payment Gateway Integration', description: 'Integrate Stripe payment gateway', developer: 'Vikram Singh', tester: 'Sneha Verma', status: 'bug-found', priority: 'high', deadline: '12 Feb', bugs: 3, lastUpdated: '04 Feb 2025' },
    { id: 'WS004', title: 'Email Notification System', description: 'Implement email notifications', developer: 'Rahul Sharma', tester: '', status: 'in-progress', priority: 'medium', deadline: '15 Feb', bugs: 0, lastUpdated: '03 Feb 2025' },
    { id: 'WS005', title: 'User Profile Page', description: 'Create user profile management UI', developer: 'Amit Kumar', tester: 'Priya Patel', status: 'approved', priority: 'low', deadline: '05 Feb', bugs: 0, lastUpdated: '02 Feb 2025' },
];

const bugReports = [
    { id: 'BR001', title: 'Login fails with special characters', description: 'Users with special characters in username cannot login', severity: 'high', status: 'open', reportedBy: 'Priya Patel', assignedTo: 'Rahul Sharma', createdDate: '04 Feb 2025' },
    { id: 'BR002', title: 'Payment timeout error', description: 'Payment process times out after 30 seconds', severity: 'critical', status: 'in-progress', assignedTo: 'Vikram Singh', reportedBy: 'Sneha Verma', createdDate: '04 Feb 2025' },
    { id: 'BR003', title: 'Profile image not uploading', description: 'Profile image upload shows error on PNG files', severity: 'medium', status: 'open', reportedBy: 'Priya Patel', assignedTo: 'Rahul Sharma', createdDate: '04 Feb 2025' },
];

const getBugSeverityBadge = (severity) => {
    switch(severity) {
        case 'critical': return <Badge className="bg-red-700">Critical</Badge>;
        case 'high': return <Badge className="bg-red-500">High</Badge>;
        case 'medium': return <Badge className="bg-yellow-500">Medium</Badge>;
        case 'low': return <Badge className="bg-green-500">Low</Badge>;
        default: return <Badge>{severity}</Badge>;
    }
};

const getBugStatusBadge = (status) => {
    switch(status) {
        case 'open': return <Badge className="bg-blue-500">Open</Badge>;
        case 'in-progress': return <Badge className="bg-purple-500">In Progress</Badge>;
        case 'closed': return <Badge className="bg-green-500">Closed</Badge>;
        default: return <Badge>{status}</Badge>;
    }
};
const employees = [
    { id: 'E001', name: 'Priya Patel', team: 'QA' },
    { id: 'E002', name: 'Sneha Verma', team: 'QA' },
    { id: 'E003', name: 'Rahul Sharma', team: 'Dev' },
    { id: 'E004', name: 'Amit Kumar', team: 'Dev' },
];

// Badge Helpers
const getWorksheetStatusBadge = (status) => {
    switch (status) {
        case 'approved': return <Badge className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1"/> Approved</Badge>;
        case 'completed': return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1"/> Completed</Badge>;
        case 'testing': return <Badge className="bg-purple-500"><UserCheck className="w-3 h-3 mr-1"/> Testing</Badge>;
        case 'bug-found': return <Badge className="bg-red-500"><Bug className="w-3 h-3 mr-1"/> Bug Found</Badge>;
        case 'in-progress': return <Badge className="bg-yellow-500"><Circle className="w-3 h-3 mr-1"/> In Progress</Badge>;
        default: return <Badge>{status}</Badge>;
    }
};

const getPriorityBadge = (priority) => {
    switch(priority) {
        case 'high': return <Badge className="bg-red-500">High</Badge>;
        case 'medium': return <Badge className="bg-yellow-500">Medium</Badge>;
        case 'low': return <Badge className="bg-green-500">Low</Badge>;
        default: return <Badge>{priority}</Badge>;
    }
};

export default function Worksheet() {
    const [selectedWs, setSelectedWs] = useState(null);

    return (
        <div className="space-y-8 p-6 animate-fade-in">
            {/* Header + Add Worksheet */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Worksheets</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button><Plus className="w-4 h-4 mr-2"/> Add Worksheet</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Worksheet</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Worksheet Title</Label>
                                <Input placeholder="Enter worksheet title" />
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Textarea placeholder="Enter description" rows={3} />
                            </div>
                            <div>
                                <Label>Assign Developer</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select developer"/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Rahul Sharma</SelectItem>
                                        <SelectItem value="2">Amit Kumar</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Priority</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="Select priority"/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Deadline</Label>
                                <Input type="date" />
                            </div>
                            <Button className="w-full">Create Worksheet</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="p-4">
                    <CardDescription>Total Worksheets</CardDescription>
                    <CardTitle className="text-2xl">{worksheets.length}</CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>In Progress</CardDescription>
                    <CardTitle className="text-2xl text-yellow-600">{worksheets.filter(w=>w.status==='in-progress').length}</CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>Testing</CardDescription>
                    <CardTitle className="text-2xl text-purple-600">{worksheets.filter(w=>w.status==='testing').length}</CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>Bug Found</CardDescription>
                    <CardTitle className="text-2xl text-red-600">{worksheets.filter(w=>w.status==='bug-found').length}</CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>Approved</CardDescription>
                    <CardTitle className="text-2xl text-green-600">{worksheets.filter(w=>w.status==='approved').length}</CardTitle>
                </Card>
            </div>

            {/* Worksheet Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Worksheets</CardTitle>
                    <CardDescription>Developer-Tester workflow overview</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="max-h-[500px]">
                        <Table>
                            <TableHeader className="sticky top-0 bg-background">
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Developer</TableHead>
                                    <TableHead>Tester</TableHead>
                                    <TableHead>Priority</TableHead>
                                    <TableHead>Deadline</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Bugs</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {worksheets.map(ws => (
                                    <TableRow key={ws.id} className="hover:bg-muted/50">
                                        <TableCell>{ws.id}</TableCell>
                                        <TableCell>{ws.title}</TableCell>
                                        <TableCell>{ws.description}</TableCell>
                                        <TableCell>{ws.developer}</TableCell>
                                        <TableCell>{ws.tester || '-'}</TableCell>
                                        <TableCell>{getPriorityBadge(ws.priority)}</TableCell>
                                        <TableCell>{ws.deadline}</TableCell>
                                        <TableCell>{getWorksheetStatusBadge(ws.status)}</TableCell>
                                        <TableCell>{ws.bugs}</TableCell>
                                        <TableCell>{ws.lastUpdated}</TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline"><MoreHorizontal className="w-4 h-4"/></Button>
                                                </DialogTrigger>


                                                        <DialogContent className="max-w-4xl">
                                                            <DialogHeader>
                                                                <DialogTitle>{ws.title}</DialogTitle>
                                                            </DialogHeader>

                                                            <Tabs defaultValue="details" className="mt-4">
                                                                <TabsList className="grid grid-cols-4 w-full">
                                                                    <TabsTrigger value="details">Details</TabsTrigger>
                                                                    <TabsTrigger value="actions">Actions</TabsTrigger>
                                                                    <TabsTrigger value="bugs">Bugs</TabsTrigger>
                                                                    <TabsTrigger value="history">History</TabsTrigger>
                                                                </TabsList>

                                                                {/* Details Tab */}
                                                                <TabsContent value="details" className="space-y-4">
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <Label>Status</Label>
                                                                            <div className="mt-1">{getWorksheetStatusBadge(ws.status)}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Label>Priority</Label>
                                                                            <div className="mt-1">{getPriorityBadge(ws.priority)}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Label>Developer</Label>
                                                                            <div className="mt-1">{ws.developer}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Label>Tester</Label>
                                                                            <div className="mt-1">{ws.tester || "-"}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Label>Deadline</Label>
                                                                            <div className="mt-1">{ws.deadline}</div>
                                                                        </div>
                                                                        <div>
                                                                            <Label>Bugs</Label>
                                                                            <div className="mt-1">{ws.bugs}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <Label>Description</Label>
                                                                        <div className="mt-2 p-2 bg-muted rounded">{ws.description}</div>
                                                                    </div>
                                                                </TabsContent>

                                                                {/* Actions Tab */}
                                                                <TabsContent value="actions" className="space-y-4">
                                                                    <div className="space-y-3">
                                                                        {/* Developer Actions */}
                                                                        <div className="p-4 border rounded-lg">
                                                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                                <Circle className="w-4 h-4 text-yellow-500" />
                                                                                Developer Actions
                                                                            </h4>
                                                                            <div className="space-y-2">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    className="w-full justify-start"
                                                                                    disabled={ws.status !== 'in-progress'}
                                                                                >
                                                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                                    Mark as Completed
                                                                                </Button>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    Status must be "In Progress" to complete
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {/* Tester Actions */}
                                                                        <div className="p-4 border rounded-lg">
                                                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                                <UserCheck className="w-4 h-4 text-purple-500" />
                                                                                Tester Actions
                                                                            </h4>
                                                                            <div className="space-y-3">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    className="w-full justify-start"
                                                                                    disabled={ws.status !== 'completed'}
                                                                                >
                                                                                    <UserCheck className="w-4 h-4 mr-2" />
                                                                                    Start Testing
                                                                                </Button>
                                                                                <div className="space-y-2">
                                                                                    <Label>Assign Tester</Label>
                                                                                    <Select>
                                                                                        <SelectTrigger>
                                                                                            <SelectValue placeholder="Select tester" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            {employees.filter(e => e.team === 'QA').map((emp) => (
                                                                                                <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                                                                            ))}
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {/* Bug Report Actions */}
                                                                        <div className="p-4 border rounded-lg">
                                                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                                <Bug className="w-4 h-4 text-red-500" />
                                                                                Bug Report Actions
                                                                            </h4>
                                                                            <div className="space-y-3">
                                                                                <Button
                                                                                    variant="outline"
                                                                                    className="w-full justify-start"
                                                                                    disabled={ws.status !== 'testing'}
                                                                                >
                                                                                    <Bug className="w-4 h-4 mr-2" />
                                                                                    Report Bug (Assign back to Developer)
                                                                                </Button>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    className="w-full justify-start"
                                                                                    disabled={ws.status !== 'testing'}
                                                                                >
                                                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                                    Approve (No Bugs)
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                        {/* Reassign */}
                                                                        <div className="p-4 border rounded-lg">
                                                                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                                <RefreshCw className="w-4 h-4 text-blue-500" />
                                                                                Reassign to Developer
                                                                            </h4>
                                                                            <div className="space-y-2">
                                                                                <p className="text-sm text-muted-foreground">
                                                                                    When bugs are found, worksheet is automatically reassigned to the developer
                                                                                </p>
                                                                                <Button
                                                                                    variant="destructive"
                                                                                    className="w-full"
                                                                                    disabled={ws.status !== 'bug-found'}
                                                                                >
                                                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                                                    Send Back to Developer
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>

                                                                {/* Bugs Tab */}
                                                                <TabsContent value="bugs" className="space-y-4">
                                                                    <div className="flex justify-between items-center">
                                                                        <h4 className="font-semibold">Bug Reports</h4>
                                                                        <Button size="sm">
                                                                            <Plus className="w-3 h-3 mr-1" />
                                                                            Report Bug
                                                                        </Button>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {bugReports
                                                                            .filter(b => b.assignedTo === ws.developer || b.assignedTo === ws.tester || b.reportedBy === ws.developer || b.reportedBy === ws.tester)
                                                                            .map(bug => (
                                                                                <Card key={bug.id} className="p-4">
                                                                                    <div className="flex justify-between items-start mb-2">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="font-semibold">{bug.title}</span>
                                                                                            {getBugSeverityBadge(bug.severity)}
                                                                                            {getBugStatusBadge(bug.status)}
                                                                                        </div>
                                                                                        <Button size="sm" variant="ghost">
                                                                                            <MoreHorizontal className="w-4 h-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                    <p className="text-sm text-muted-foreground mb-2">{bug.description}</p>
                                                                                    <div className="flex justify-between text-xs text-muted-foreground">
                                                                                        <span>By: {bug.reportedBy}</span>
                                                                                        <span>Assigned: {bug.assignedTo}</span>
                                                                                        <span>{bug.createdDate}</span>
                                                                                    </div>
                                                                                </Card>
                                                                            ))}
                                                                        {bugReports.filter(b => b.assignedTo === ws.developer || b.assignedTo === ws.tester || b.reportedBy === ws.developer || b.reportedBy === ws.tester).length === 0 && (
                                                                            <div className="text-center text-muted-foreground py-8">
                                                                                <Bug className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                                                                <p>No bugs reported yet</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </TabsContent>

                                                                {/* History Tab */}
                                                                <TabsContent value="history" className="space-y-4">
                                                                    <div className="space-y-2">
                                                                        <div className="flex gap-3 p-3 border rounded">
                                                                            <div className="text-xs text-muted-foreground">04 Feb 2025</div>
                                                                            <div className="flex-1">
                                                                                <p className="font-medium">Status changed to Testing</p>
                                                                                <p className="text-sm text-muted-foreground">Assigned to tester: Priya Patel</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-3 p-3 border rounded">
                                                                            <div className="text-xs text-muted-foreground">03 Feb 2025</div>
                                                                            <div className="flex-1">
                                                                                <p className="font-medium">Status changed to Completed</p>
                                                                                <p className="text-sm text-muted-foreground">Developer marked work as completed</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-3 p-3 border rounded">
                                                                            <div className="text-xs text-muted-foreground">01 Feb 2025</div>
                                                                            <div className="flex-1">
                                                                                <p className="font-medium">Worksheet Created</p>
                                                                                <p className="text-sm text-muted-foreground">Assigned to developer: {ws.developer}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TabsContent>
                                                            </Tabs>
                                                        </DialogContent>


                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
