import { Toaster } from "./components/ui/toaster";
import { Toaster as Sooner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import Login from "./pages/login";
import Index from "./pages/Index";
import Teams from "./pages/Teams";
import Tasks from "./pages/Tasks";
import WorkMonitoring from "./pages/WorkMonitoring";
import Payroll from "./pages/Payroll";
import MailCenter from "./pages/MailCenter";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Worksheet from "./pages/Worksheet";

const queryClient = new QueryClient();

const App = () => {
  // Show Login at '/', app/dashboard under '/app'
  const router = createBrowserRouter(
    [
      { path: "/", element: <Login /> },
      {
        path: "/app",
        element: <MainLayout />,
        children: [
          { index: true, element: <Index /> },
          { path: "teams", element: <Teams /> },
          { path: "tasks", element: <Tasks /> },
          { path: "monitoring", element: <WorkMonitoring /> },
          { path: "payroll", element: <Payroll /> },
          { path: "mail", element: <MailCenter /> },
          { path: "settings", element: <Settings /> },
          { path: "worksheet", element: <Worksheet /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
    { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sooner />

        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;