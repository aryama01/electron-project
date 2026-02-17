import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
    return (
        <div className="min-h-screen flex w-full">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                <Outlet />
            </main>
        </div>
    );
}