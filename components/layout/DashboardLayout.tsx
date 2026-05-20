import React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";
import { UpgradeBanner } from "@/components/ui/UpgradeBanner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  /** When true, removes horizontal padding so content can go edge-to-edge */
  noPadding?: boolean;
}

export function DashboardLayout({ children, noPadding }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#090912]">
        <TopBar />
        {/* pt-14 offsets the fixed 56px topbar */}
        <main
          className={`pt-14 min-h-[calc(100vh-56px)] ${
            noPadding ? "" : "px-4 md:px-6 py-6"
          }`}
        >
          {children}
        </main>
        <Footer />
        <UpgradeBanner />
      </div>
    </AuthGuard>
  );
}
