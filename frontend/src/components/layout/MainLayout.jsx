import { Sidebar } from "./Sidebar";

export function MainLayout({ children }) {
    return (
        <div className="min-h-screen flex w-full">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
