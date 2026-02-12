// javascript
import React, { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Send, Inbox, FileText, Bell, Mail, Clock } from "lucide-react";

const sentMails = [
  {
    id: 1,
    to: "Backend Team",
    subject: "Sprint Planning Meeting",
    date: "Feb 05, 2024",
    time: "10:30 AM",
  },
  {
    id: 2,
    to: "Rahul Kumar",
    subject: "Project Update Required",
    date: "Feb 04, 2024",
    time: "3:15 PM",
  },
  {
    id: 3,
    to: "All Teams",
    subject: "Holiday Notice - Republic Day",
    date: "Feb 03, 2024",
    time: "9:00 AM",
  },
];

const drafts = [
  {
    id: 1,
    to: "QA Team",
    subject: "Testing Guidelines Update",
    date: "Feb 05, 2024",
  },
  {
    id: 2,
    to: "Design Team",
    subject: "Brand Assets Review",
    date: "Feb 04, 2024",
  },
];

const notifications = [
  {
    id: 1,
    title: "New Task Assigned",
    message: "You have been assigned a new task by Rahul",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    title: "Task Completed",
    message: "Priya completed the UI review task",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    title: "Meeting Reminder",
    message: "Sprint planning meeting in 30 minutes",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 4,
    title: "Payslip Generated",
    message: "January 2024 payslips are now available",
    time: "1 day ago",
    read: true,
  },
];

export default function MailCenter() {
  const [recipient, setRecipient] = useState("");

  return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Mail Center</h1>
          <p className="page-subtitle">Send and manage communications with your team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compose Mail */}
          <div className="lg:col-span-2">
            <div className="form-section">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Mail size={20} />
                Compose Mail
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Select value={recipient} onValueChange={setRecipient}>
                    <SelectTrigger id="to">
                      <SelectValue placeholder="Select employee or team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Teams</SelectItem>
                      <SelectItem value="backend">Backend Team</SelectItem>
                      <SelectItem value="frontend">Frontend Team</SelectItem>
                      <SelectItem value="qa">QA Team</SelectItem>
                      <SelectItem value="design">Design Team</SelectItem>
                      <SelectItem value="rahul">Rahul Kumar</SelectItem>
                      <SelectItem value="priya">Priya Sharma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter email subject" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={8}
                      className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="gap-2">
                    <Send size={16} />
                    Send
                  </Button>
                  <Button variant="outline">Save as Draft</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="stat-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Send size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{sentMails.length}</p>
                    <p className="text-xs text-muted-foreground">Sent</p>
                  </div>
                </div>
              </div>
              <div className="stat-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <FileText size={16} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{drafts.length}</p>
                    <p className="text-xs text-muted-foreground">Drafts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="sent" className="form-section">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sent" className="gap-1">
                  <Inbox size={14} />
                  Sent
                </TabsTrigger>
                <TabsTrigger value="drafts" className="gap-1">
                  <FileText size={14} />
                  Drafts
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-1">
                  <Bell size={14} />
                  Alerts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sent" className="mt-4 space-y-3">
                {sentMails.map((mail) => (
                    <div
                        key={mail.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-sm">{mail.subject}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">To: {mail.to}</p>
                        <p className="text-xs text-muted-foreground">{mail.date}</p>
                      </div>
                    </div>
                ))}
              </TabsContent>

              <TabsContent value="drafts" className="mt-4 space-y-3">
                {drafts.map((draft) => (
                    <div
                        key={draft.id}
                        className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-sm">{draft.subject}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">To: {draft.to}</p>
                        <p className="text-xs text-muted-foreground">{draft.date}</p>
                      </div>
                    </div>
                ))}
              </TabsContent>

              <TabsContent value="notifications" className="mt-4 space-y-3">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`p-3 rounded-lg transition-colors cursor-pointer ${
                            notif.read ? "bg-muted/30" : "bg-primary/5 border-l-2 border-primary"
                        }`}
                    >
                      <p className="font-medium text-sm">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {notif.time}
                      </div>
                    </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  );
}
