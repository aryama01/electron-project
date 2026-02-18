import { Toaster } from "./components/ui/toaster";
import { Toaster as Sooner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";

import Index from "./pages/Index";
import Teams from "./pages/Teams";
import Tasks from "./pages/Tasks";
import WorkMonitoring from "./pages/WorkMonitoring";
import Payroll from "./pages/Payroll";
import MailCenter from "./pages/MailCenter";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Worksheet from "./pages/Worksheet";
import AddEmployee from "./pages/AddEmployee.jsx";
import ChatPage from "./pages/chatpage";

const queryClient = new QueryClient();

const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sooner />

          <Routes>
            {/* Layout Route */}
            <Route element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="teams" element={<Teams />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="monitoring" element={<WorkMonitoring />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="mail" element={<MailCenter />} />
              <Route path="settings" element={<Settings />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="worksheet" element={<Worksheet />} />
                <Route path="add-employee" element={<AddEmployee />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>

        </TooltipProvider>
      </QueryClientProvider>
  );
};

export default App;
