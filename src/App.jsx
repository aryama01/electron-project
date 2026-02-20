import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeamMembers from "./pages/TeamMembers";
import Tasks from "./pages/Tasks";
import TimesheetApproval from "./pages/TimesheetApproval";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Attendance from "./pages/Attendance";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <Header />
                  <div className="p-6 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/team" element={<TeamMembers />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/timesheets" element={<TimesheetApproval />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/attendance" element={<Attendance />} />

                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
