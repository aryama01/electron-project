import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { User, Bell, Shield, Save } from "lucide-react";
import { apiClient } from "../../utils/apiClient.js";

export default function Settings() {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const data = await apiClient.getManagers();
        if (data.success && data.data.length > 0) {
          setManager(data.data[0]); // use first manager for demo
        }
      } catch (err) {
        console.error("Error fetching manager:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManager();
  }, []);

  if (loading) return <div className="p-6">Loading manager data...</div>;
  if (!manager) return <div className="p-6">No manager data found.</div>;

  return (
      <div className="animate-fade-in max-w-3xl p-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences.
          </p>
        </div>

        {/* Profile */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User size={20} /> Profile Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                  id="fullName"
                  value={`${manager.firstName || ""} ${manager.lastName || ""}`}
                  readOnly
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={manager.email || ""} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={manager.phone || ""} readOnly />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={manager.designation || "Manager"} readOnly />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Bell size={20} /> Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive email updates for important events
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </section>

        {/* Security */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Shield size={20} /> Security
          </h2>
          <div>
            <Label htmlFor="employeeId">Employee ID</Label>
            <Input id="employeeId" value={manager.employeeId || ""} readOnly />
          </div>
        </section>

        {/* Save Button */}
        <Button className="gap-2 mt-4" disabled>
          <Save size={16} /> Save Changes
        </Button>
      </div>
  );
}
