import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Activity,
  Wallet,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

const navGroups = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/app" },
    ],
  },
  {
    label: "Work Management",
    items: [
      { icon: ClipboardList, label: "Tasks", path: "/app/tasks" },
      { icon: ClipboardList, label: "Worksheet", path: "/app/worksheet" },
      { icon: Users, label: "Teams", path: "/app/teams" },
      { icon: Activity, label: "Monitoring", path: "/app/monitoring" },
    ],
  },
  {
    label: "HR & Finance",
    items: [
      { icon: Wallet, label: "Payroll", path: "/app/payroll" },
      { icon: Mail, label: "Mail Center", path: "/app/mail" },
      { icon: Settings, label: "Settings", path: "/app/settings" },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth data if needed
    localStorage.removeItem("manager:checkedIn");
    localStorage.removeItem("manager:lastCheckIn");
    localStorage.removeItem("manager:lastCheckOut");
    // Navigate to login (root)
    navigate("/");
  };

  return (
      <aside
          className={cn(
              "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
              collapsed ? "w-20" : "w-64"
          )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
              <h1 className="text-xl font-bold text-sidebar-primary-foreground">
                Manager<span className="text-sidebar-primary">Portal</span>
              </h1>
          )}
          <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-4 overflow-y-auto">
          {navGroups.map((group, idx) => (
              <div key={idx}>
                {group.label && (
                    <div className="text-xs font-semibold text-muted-foreground px-3 mb-1 uppercase">
                      {group.label}
                    </div>
                )}
                <div className="flex flex-col space-y-1">
                  {group.items.map((item) => (
                      <NavLink
                          key={item.path}
                          to={item.path}
                          className={({ isActive }) =>
                              cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent",
                                  isActive
                                      ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                                      : "text-sidebar-foreground"
                              )
                          }
                      >
                        <item.icon size={18} />
                        {!collapsed && <span>{item.label}</span>}
                      </NavLink>
                  ))}
                </div>
              </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <button 
            onClick={handleLogout}
            className="sidebar-item w-full flex items-center gap-3 text-destructive hover:text-destructive"
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
  );
}