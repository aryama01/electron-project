// javascript
import React, { useState, useEffect } from "react";
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

// Data will be loaded from backend dummy endpoints

export default function MailCenter() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [sentMails, setSentMails] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const API_BASE = "http://localhost:5000";

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, dRes, nRes] = await Promise.all([
          fetch(`${API_BASE}/api/mail/sent`),
          fetch(`${API_BASE}/api/mail/drafts`),
          fetch(`${API_BASE}/api/mail/notifications`),
        ]);

        if (sRes.ok) setSentMails(await sRes.json());
        if (dRes.ok) setDrafts(await dRes.json());
        if (nRes.ok) setNotifications(await nRes.json());
      } catch (err) {
        console.error("Failed to load mail data:", err);
      }
    };

    load();
  }, []);

  const handleSend = async () => {
    if (!recipient || !subject || !message) {
      alert("Please fill To, Subject and Message.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/mail/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipient, subject, message }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Send failed");
      }

      const newMail = await res.json();
      setSentMails((prev) => [newMail, ...prev]);
      setRecipient("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to send mail");
    }
  };

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
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      rows={8}
                      className="resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <Button className="gap-2" onClick={handleSend}>
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
