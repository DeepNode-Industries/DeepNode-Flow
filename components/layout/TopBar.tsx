"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Workflow, Zap, LayoutTemplate, Settings,
  Plus, LogOut, Menu,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { MobileNav } from "@/components/ui/MobileNav";

const NAV_ITEMS = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"     },
  { href: "/workflows",  icon: Workflow,         label: "Workflows"     },
  { href: "/builder",    icon: Zap,              label: "Builder"       },
  { href: "/templates",  icon: LayoutTemplate,   label: "Templates"     },
  { href: "/settings",   icon: Settings,         label: "Configuración" },
];

const PLAN_COLORS: Record<string, string> = {
  starter:    "#7c3aed",
  business:   "#06b6d4",
  enterprise: "#a855f7",
};

export function TopBar() {
  const pathname      = usePathname();
  const router        = useRouter();
  const session       = useAuthStore((s) => s.session);
  const logout        = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const planColor = PLAN_COLORS[session?.plan ?? "starter"] ?? "#7c3aed";
  const planLabel =
    session?.plan === "enterprise" ? "Enterprise"
    : session?.plan === "business" ? "Business"
    : "Starter";

  return (
    <>
      {/* ── Main topbar ──────────────────────────────────────────────── */}
      <header
        className="dn-topbar fixed top-0 inset-x-0 z-30 h-14 flex items-center"
        style={{ height: "56px" }}
      >
        <div className="w-full flex items-center gap-2 px-4 md:px-6">

          {/* ── Logo (left) ────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2 group">
            <div className="w-7 h-7 rounded-lg overflow-hidden shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="DeepNode Industries"
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex items-baseline gap-px">
              <span className="text-sm font-bold text-white leading-none">DeepNode</span>
              <span className="text-sm font-bold dn-gradient-text-primary leading-none">Flow</span>
            </div>
          </Link>

          {/* ── Nav links (center, desktop only) ──────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5 mx-auto relative">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));

              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}
                      transition={{ type: "spring", damping: 30, stiffness: 350 }}
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right side actions ────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto shrink-0">

            {/* Mode indicator */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-300">Demo</span>
            </div>

            {/* Nuevo Workflow button */}
            <button
              onClick={() => router.push("/builder")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                boxShadow: "0 4px 16px rgba(6,182,212,0.2)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo
            </button>

            {/* User avatar */}
            {session && (
              <div className="flex items-center gap-1.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-default select-none"
                  style={{ background: `linear-gradient(135deg, ${planColor}cc, ${planColor}55)` }}
                  title={`${session.name} · Plan ${planLabel}`}
                >
                  {session.initials}
                </div>
              </div>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
