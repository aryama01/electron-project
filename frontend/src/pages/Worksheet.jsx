import React, { useState, useEffect, useRef } from "react";
import { Plus, MoreHorizontal, CheckCircle2, Circle, UserCheck, Bug, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

const API_URL = "http://localhost:5000/api/worksheets";

const bugReports = [];

const employees = [
    { id: 'E001', name: 'Priya Patel', team: 'QA' },
    { id: 'E002', name: 'Sneha Verma', team: 'QA' },
    { id: 'E003', name: 'Rahul Sharma', team: 'Dev' },
    { id: 'E004', name: 'Amit Kumar', team: 'Dev' },
];

// Worksheet Status Badge
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

// Priority Badge
const getPriorityBadge = (priority) => {
    switch(priority) {
        case 'high': return <Badge className="bg-red-500">High</Badge>;
        case 'medium': return <Badge className="bg-yellow-500">Medium</Badge>;
        case 'low': return <Badge className="bg-green-500">Low</Badge>;
        default: return <Badge>{priority}</Badge>;
    }
};

// Bug Severity Badge
const getBugSeverityBadge = (severity) => {
    switch(severity){
        case 'high': return <Badge className="bg-red-600">High</Badge>;
        case 'medium': return <Badge className="bg-yellow-600">Medium</Badge>;
        case 'low': return <Badge className="bg-green-600">Low</Badge>;
        default: return <Badge>{severity}</Badge>;
    }
};

// Bug Status Badge
const getBugStatusBadge = (status) => {
    switch(status){
        case 'open': return <Badge className="bg-red-500">Open</Badge>;
        case 'fixed': return <Badge className="bg-blue-500">Fixed</Badge>;
        case 'closed': return <Badge className="bg-green-500">Closed</Badge>;
        default: return <Badge>{status}</Badge>;
    }
};

export default function Worksheet() {

    const [worksheets, setWorksheets] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        developer: "",
        priority: "medium",
        deadline: ""
    });
    const [showToast, setShowToast] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showBugReportDialog, setShowBugReportDialog] = useState(false);
    const [bugReportRemarks, setBugReportRemarks] = useState("");
    const [selectedWorksheetId, setSelectedWorksheetId] = useState(null);
    const [showAllRows, setShowAllRows] = useState(false);
    const tableRef = useRef(null);

    const toggleShowAllRows = () => {
        setShowAllRows(prev => {
            const next = !prev;
            // scroll to table after it updates
            setTimeout(() => {
                try {
                    tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch (e) {
                    // ignore
                }
            }, 150);
            return next;
        });
    };

    const fetchWorksheets = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setWorksheets(data);
        } catch (error) {
            console.error("Error fetching worksheets:", error);
        }
    };

    // Build history entries when backend history missing
    const getHistoryEntries = (ws) => {
        if (ws.history && ws.history.length > 0) {
            return ws.history.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        // Fallback/inferred history from available fields
        const entries = [];
        if (ws.createdAt) {
            entries.push({ date: ws.createdAt, action: 'Task Created', details: `Assigned to developer: ${ws.developer}` });
        }

        // If developer completed at some point
        if (ws.status === 'completed' || ws.status === 'testing' || ws.status === 'bug-found' || ws.status === 'approved') {
            // Use updatedAt as best-effort timestamp for intermediate steps
            const ts = ws.updatedAt || ws.createdAt;
            if (ws.status !== 'in-progress') {
                // mark a generic completion step if no explicit history
                entries.push({ date: ts, action: 'Task Progressed', details: `Current status: ${ws.status}` });
            }
        }

        if (ws.tester) {
            entries.push({ date: ws.updatedAt || ws.createdAt, action: 'Assigned to Tester', details: `Assigned to tester: ${ws.tester}` });
        }

        if (ws.bugs && ws.bugs > 0) {
            entries.push({ date: ws.updatedAt || ws.createdAt, action: 'Bugs Found', details: ws.remarks || 'Bugs reported' });
        }

        if (ws.status === 'approved') {
            entries.push({ date: ws.updatedAt || ws.createdAt, action: 'Task Approved', details: `Approved. No bugs found.` });
        }

        // Ensure most-recent-first
        return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    useEffect(() => {
        fetchWorksheets();
    }, []);

    const handleCreate = async () => {
        try {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            fetchWorksheets();

            setFormData({
                title: "",
                description: "",
                developer: "",
                priority: "medium",
                deadline: ""
            });

            // Close dialog first, then show toast with message
            setShowAddDialog(false);
            setTimeout(() => {
                setToastMessage("✅ Worksheet created!");
                setToastType("success");
                setShowToast(true);
                setTimeout(() => setShowToast(false), 5000);
            }, 200);
        } catch (error) {
            console.error("Error creating worksheet:", error);
        }
    };

    // --- Workflow Handlers ---
    const handleMarkAsCompleted = async (id) => {
        setLoadingId(id);
        try {
            const res = await fetch(`${API_URL}/${id}/complete`, { method: "PATCH" });
            if (!res.ok) throw new Error("Failed to mark as completed");
            setToastMessage("✅ Worksheet marked as completed!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            fetchWorksheets();
        } catch (error) {
            console.error("Error:", error);
            setToastMessage("❌ Error marking worksheet as completed");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoadingId(null);
        }
    };

    const handleAssignTester = async (id, testerId) => {
        setLoadingId(id);
        try {
            const res = await fetch(`${API_URL}/${id}/assign-tester`, { 
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ testerId }) 
            });
            if (!res.ok) throw new Error("Failed to assign tester");
            setToastMessage("✅ Tester assigned successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            fetchWorksheets();
        } catch (error) {
            console.error("Error:", error);
            setToastMessage("❌ Error assigning tester");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoadingId(null);
        }
    };

    const handleStartTesting = async (id) => {
        await fetch(`${API_URL}/${id}/start-testing`, { method: "PATCH" });
        fetchWorksheets();
    };

    const handleReportBug = (id) => {
        setSelectedWorksheetId(id);
        setBugReportRemarks("");
        setShowBugReportDialog(true);
    };

    const handleSubmitBugReport = async () => {
        if (!selectedWorksheetId || !bugReportRemarks.trim()) {
            setToastMessage("❌ Please enter bug description");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        setLoadingId(selectedWorksheetId);
        try {
            const res = await fetch(`${API_URL}/${selectedWorksheetId}/report-bug`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ remarks: bugReportRemarks.trim() })
            });
            if (!res.ok) throw new Error("Failed to report bug");
            setToastMessage("🐛 Bug reported with description! Reassigning to developer...");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setShowBugReportDialog(false);
            setBugReportRemarks("");
            setSelectedWorksheetId(null);
            fetchWorksheets();
        } catch (error) {
            console.error("Error:", error);
            setToastMessage("❌ Error reporting bug");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoadingId(null);
        }
    };

    const handleApproveWorksheet = async (id) => {
        setLoadingId(id);
        try {
            const res = await fetch(`${API_URL}/${id}/approve`, { method: "PATCH" });
            if (!res.ok) throw new Error("Failed to approve worksheet");
            setToastMessage("✅ Worksheet approved successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            fetchWorksheets();
        } catch (error) {
            console.error("Error:", error);
            setToastMessage("❌ Error approving worksheet");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoadingId(null);
        }
    };

    const handleReassignToDeveloper = async (id) => {
        setLoadingId(id);
        try {
            const res = await fetch(`${API_URL}/${id}/reassign`, { method: "PATCH" });
            if (!res.ok) throw new Error("Failed to reassign to developer");
            setToastMessage("🔄 Worksheet reassigned to developer!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            fetchWorksheets();
        } catch (error) {
            console.error("Error:", error);
            setToastMessage("❌ Error reassigning to developer");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-8 p-6 animate-fade-in">

            {showToast && (
                <div className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg animate-fade-in-out z-50 ${
                    toastType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {toastMessage}
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Worksheets</h1>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() =>
                            window.open(
                                "http://localhost:5000/api/export/excel",
                                "_blank"
                            )
                        }
                    >
                        📊 Export Excel
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={toggleShowAllRows}
                    >
                        {showAllRows ? 'Show Less' : 'View All'}
                    </Button>

                    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Worksheet
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add New Worksheet</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Worksheet Title</Label>
                                    <Input
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({ ...formData, title: e.target.value })
                                        }
                                        placeholder="Enter worksheet title"
                                    />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e)=>setFormData({...formData,description:e.target.value})}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label>Assign Developer</Label>
                                    <Select onValueChange={(val)=>setFormData({...formData,developer:val})}>
                                        <SelectTrigger><SelectValue placeholder="Select developer"/></SelectTrigger>
                                        <SelectContent>
                                            {employees.filter(e=>e.team==="Dev").map(emp=>(
                                                <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Priority</Label>
                                    <Select onValueChange={(val)=>setFormData({...formData,priority:val})}>
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
                                    <Input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e)=>setFormData({...formData,deadline:e.target.value})}
                                    />
                                </div>
                                <Button className="w-full" onClick={handleCreate}>Create Worksheet</Button>
                            </div>
                        </DialogContent>
                        </Dialog>
                </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="p-4">
                    <CardDescription>Total Worksheets</CardDescription>
                    <CardTitle className="text-2xl">{worksheets.length}</CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>In Progress</CardDescription>
                    <CardTitle className="text-2xl text-yellow-600">
                        {worksheets.filter(w=>w.status==='in-progress').length}
                    </CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>Testing</CardDescription>
                    <CardTitle className="text-2xl text-purple-600">
                        {worksheets.filter(w=>w.status==='testing').length}
                    </CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>Bug Found</CardDescription>
                    <CardTitle className="text-2xl text-red-600">
                        {worksheets.filter(w=>w.status==='bug-found').length}
                    </CardTitle>
                </Card>
                <Card className="p-4">
                    <CardDescription>Approved</CardDescription>
                    <CardTitle className="text-2xl text-green-600">
                        {worksheets.filter(w=>w.status==='approved').length}
                    </CardTitle>
                </Card>
            </div>

            {/* Worksheet Table */}
            <Card>
                <CardHeader className="min-h-[56px]">
                    <CardTitle>All Worksheets</CardTitle>
                    <CardDescription>Developer-Tester workflow overview</CardDescription>
                    <div className="text-sm text-muted-foreground mt-2">
                        Showing {showAllRows ? worksheets.length : Math.min(10, worksheets.length)} of {worksheets.length} worksheets
                    </div>
                </CardHeader>
                <CardContent>
                    <div ref={tableRef}>
                        <ScrollArea className={showAllRows ? "max-h-none" : "max-h-[500px]"}>
                        <Table>
                            <TableHeader>
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
                                    <TableHead>Remarks</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {(showAllRows ? worksheets : worksheets.slice(0, 10)).map(ws => (
                                    <TableRow key={ws._id}>
                                        <TableCell>{ws._id.slice(-5)}</TableCell>
                                        <TableCell>{ws.title}</TableCell>
                                        <TableCell>{ws.description}</TableCell>
                                        <TableCell>{ws.developer}</TableCell>
                                        <TableCell>{ws.tester || '-'}</TableCell>
                                        <TableCell>{getPriorityBadge(ws.priority)}</TableCell>
                                        <TableCell>{new Date(ws.deadline).toLocaleDateString()}</TableCell>
                                        <TableCell>{getWorksheetStatusBadge(ws.status)}</TableCell>
                                        <TableCell>{ws.bugs || 0}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={ws.remarks || "-"}>
                                            {ws.remarks || "-"}
                                        </TableCell>
                                        <TableCell>{new Date(ws.updatedAt).toLocaleDateString()}</TableCell>
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

                                                        {/* --- Details Tab --- */}
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
                                                                    <div className="mt-1">{new Date(ws.deadline).toLocaleDateString()}</div>
                                                                </div>
                                                                <div>
                                                                    <Label>Bugs</Label>
                                                                    <div className="mt-1">{ws.bugs || 0}</div>
                                                                </div>
                                                                <div>
                                                                    <Label>Remarks</Label>
                                                                    <div className="mt-1 p-2 bg-muted rounded text-sm">{ws.remarks || "No remarks"}</div>
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
                                                                <div className="p-4 border rounded-lg bg-yellow-50">
                                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <Circle className="w-4 h-4 text-yellow-600" />
                                                                        Developer Actions
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        <Button
                                                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                                                                            onClick={() => handleMarkAsCompleted(ws._id)}
                                                                            disabled={ws.status !== 'in-progress' || loadingId === ws._id}
                                                                        >
                                                                            {loadingId === ws._id ? (
                                                                                <>
                                                                                    <span className="animate-spin mr-2">⏳</span>
                                                                                    Processing...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                                    Mark as Completed
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Click to mark developer work as completed. Status will change to "Completed".
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Tester Actions */}
                                                                <div className="p-4 border rounded-lg bg-green-50">
                                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <UserCheck className="w-4 h-4 text-green-600" />
                                                                        Tester Actions
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div className="space-y-2">
                                                                            <Label htmlFor={`tester-${ws._id}`}>Assign Tester</Label>
                                                                            <Select
                                                                                value={ws.tester || ""}
                                                                                onValueChange={(val) => handleAssignTester(ws._id, val)}
                                                                                disabled={ws.status !== 'completed' || loadingId === ws._id}
                                                                            >
                                                                                <SelectTrigger id={`tester-${ws._id}`}>
                                                                                    <SelectValue placeholder="Select a tester to start testing" />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    {employees.filter(e => e.team === 'QA').map((emp) => (
                                                                                        <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                                                                                    ))}
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Select a QA tester. Status will automatically change to "Testing".
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Bug Report Actions */}
                                                                <div className="p-4 border rounded-lg bg-purple-50">
                                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <Bug className="w-4 h-4 text-purple-600" />
                                                                        Bug Report Actions
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full justify-start"
                                                                            onClick={() => handleReportBug(ws._id)}
                                                                            disabled={ws.status !== 'testing' || loadingId === ws._id}
                                                                        >
                                                                            {loadingId === ws._id ? (
                                                                                <>
                                                                                    <span className="animate-spin mr-2">⏳</span>
                                                                                    Reporting Bug...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Bug className="w-4 h-4 mr-2" />
                                                                                    Report Bug (Assign back to Developer)
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full justify-start"
                                                                            onClick={() => handleApproveWorksheet(ws._id)}
                                                                            disabled={ws.status !== 'testing' || loadingId === ws._id}
                                                                        >
                                                                            {loadingId === ws._id ? (
                                                                                <>
                                                                                    <span className="animate-spin mr-2">⏳</span>
                                                                                    Approving...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                                                    Approve (No Bugs)
                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Select one of the options below based on testing results.
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {/* Reassign */}
                                                                <div className="p-4 border rounded-lg bg-orange-50">
                                                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                        <RefreshCw className="w-4 h-4 text-orange-600" />
                                                                        Reassign to Developer
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        <p className="text-sm text-muted-foreground">
                                                                            When bugs are found, worksheet is automatically reassigned to the developer
                                                                        </p>
                                                                        <Button
                                                                            variant="destructive"
                                                                            className="w-full"
                                                                            onClick={() => handleReassignToDeveloper(ws._id)}
                                                                            disabled={ws.status !== 'bug-found' || loadingId === ws._id}
                                                                        >
                                                                            {loadingId === ws._id ? (
                                                                                <>
                                                                                    <span className="animate-spin mr-2">⏳</span>
                                                                                    Reassigning...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <RefreshCw className="w-4 h-4 mr-2" />
                                                                                    Send Back to Developer
                                                                                </>
                                                                            )}
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
                                                                        {getHistoryEntries(ws).length > 0 ? (
                                                                            getHistoryEntries(ws).map((entry, index) => (
                                                                                <div key={index} className="flex gap-3 p-3 border rounded">
                                                                                    <div className="text-xs text-muted-foreground">
                                                                                        {entry.date ? new Date(entry.date).toLocaleDateString() : '—'}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <p className="font-medium">{entry.action}</p>
                                                                                        <p className="text-sm text-muted-foreground">{entry.details}</p>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="text-center text-muted-foreground py-8">
                                                                                <p>No history available</p>
                                                                            </div>
                                                                        )}
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
                    </div>
                </CardContent>
            </Card>

            {/* Bug Report Dialog */}
            <Dialog open={showBugReportDialog} onOpenChange={setShowBugReportDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Report Bug</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="bug-description">Bug Description</Label>
                            <Textarea
                                id="bug-description"
                                value={bugReportRemarks}
                                onChange={(e) => setBugReportRemarks(e.target.value)}
                                placeholder="Describe the bugs found during testing (e.g., areas affected, specific issues, steps to reproduce, etc.)"
                                rows={6}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowBugReportDialog(false);
                                    setBugReportRemarks("");
                                    setSelectedWorksheetId(null);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmitBugReport}
                                disabled={loadingId === selectedWorksheetId || !bugReportRemarks.trim()}
                            >
                                {loadingId === selectedWorksheetId ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Reporting...
                                    </>
                                ) : (
                                    <>
                                        <Bug className="w-4 h-4 mr-2" />
                                        Report Bug
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}