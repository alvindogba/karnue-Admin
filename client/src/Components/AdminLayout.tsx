import { type ReactNode } from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <DashboardHeader />

      {/* Content Shell - Sidebar on left, main content takes full screen */}
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
