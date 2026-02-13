import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Separator } from "../components/ui/separator";
import { User, Bell, Shield, Palette, Save } from "lucide-react";
import {apiClient} from "../../utils/apiClient.js";

export default function Settings() {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const result = apiClient.getManagers()
        .then((data) => {
          if (data.success && data.data.length > 0) {
            setManager(data.data[0]); // first manager (demo purpose)
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching manager:", err);
          setLoading(false);
        });


  }, []);

  if (loading) {
    return <div className="p-6">Loading manager data...</div>;
  }

  if (!manager) {
    return <div className="p-6">No manager data found.</div>;
  }

  return (
      <div className="animate-fade-in max-w-3xl">
        <div className="page-header">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">
            Manage your account and application preferences.
          </p>
        </div>

        {/* Profile Settings */}
        <div className="form-section mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <User size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                  id="fullName"
                  value={`${manager.firstName} ${manager.lastName || ""}`}
                  readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={manager.email} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={manager.phone || ""} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={manager.designation || "Manager"} disabled />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="form-section mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email updates for important events
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="form-section mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield size={20} className="text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Security</h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" value={manager.employeeId || ""} readOnly />
          </div>
        </div>

        {/* Save Button */}
        <Button className="gap-2 mt-4">
          <Save size={16} />
          Save Changes
        </Button>
      </div>
  );
}
