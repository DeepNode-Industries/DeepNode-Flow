import React from "react";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export function DashboardLayout({ children, noPadding }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#080810]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className={`flex-1 ${noPadding ? "" : "p-6"}`}>{children}</main>
          <Footer />
        </div>
      </div>
    </AuthGuard>
  );
}
