import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileCheck,
  BarChart3,
  LogOut,
  CalendarCheck,
   SettingsIcon ,
   MessageSquare,

} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass =
    "flex items-center gap-3 p-2 rounded hover:bg-slate-700";

  return (
    <div className="w-64 bg-slate-900 text-white p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-bold mb-6">Team Lead Portal</h1>

        <nav className="space-y-2">
          <NavLink to="/" className={linkClass}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink
  to="/attendance"
  className={linkClass}
>
  <CalendarCheck size={18} />
  Attendance
</NavLink>


          <NavLink to="/team" className={linkClass}>
            <Users size={18} /> Team Members
          </NavLink>

          <NavLink to="/tasks" className={linkClass}>
            <ClipboardList size={18} /> Tasks
          </NavLink>

          <NavLink to="/timesheets" className={linkClass}>
            <FileCheck size={18} /> Timesheets
          </NavLink>

          <NavLink to="/reports" className={linkClass}>
            <BarChart3 size={18} /> Reports
          </NavLink>

          <NavLink to="/chat" className={linkClass}>
  <MessageSquare size={18} /> Team Chat
</NavLink>


          <NavLink to="/settings" className={linkClass}>
  <SettingsIcon size={18} /> Settings
</NavLink>

        </nav>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-3 p-2 w-full rounded hover:bg-red-600"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
