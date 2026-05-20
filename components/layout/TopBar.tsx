"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Workflow, Zap, LayoutTemplate, Settings,
  Plus, LogOut, Menu, Sparkles, Tag,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { MobileNav } from "@/components/ui/MobileNav";

const NAV_ITEMS = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"     },
  { href: "/workflows",  icon: Workflow,         label: "Workflows"     },
  { href: "/builder",    icon: Zap,              label: "Builder"       },
  { href: "/templates",  icon: LayoutTemplate,   label: "Templates"     },
  { href: "/pricing",    icon: Tag,              label: "Precios"       },
  { href: "/settings",   icon: Settings,         label: "Configuración" },
];

const PLAN_COLORS: Record<string, string> = {
  starter:    "#7c3aed",
  pro:        "#06b6d4",
  business:   "#a855f7",
  enterprise: "#f59e0b",
};

const PLAN_LABELS: Record<string, string> = {
  starter:    "Starter",
  pro:        "Pro",
  business:   "Business",
  enterprise: "Enterprise",
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
  const planLabel = PLAN_LABELS[session?.plan ?? "starter"] ?? "Starter";
  const isStarter = session?.plan === "starter";

  return (
    <>
      {/* ── Main topbar ──────────────────────────────────────────────── */}
      <motion.header
        className="dn-topbar fixed top-0 inset-x-0 z-30 h-14 flex items-center"
        style={{ height: "56px" }}
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full flex items-center gap-2 px-4 md:px-6">

          {/* ── Logo (left) ────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2 group">
            <motion.div
              className="w-7 h-7 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              style={{ boxShadow: `0 0 16px ${planColor}40` }}
            >
              <Image
                src="/logo.png"
                alt="DeepNode Industries"
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="hidden sm:flex items-baseline gap-px">
              <span className="text-sm font-bold text-white leading-none">DeepNode</span>
              <span className="text-sm font-bold dn-gradient-text-primary leading-none">Flow</span>
            </div>
          </Link>

          {/* ── Nav links (center, desktop only) ──────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5 mx-auto relative">
            {NAV_ITEMS.map(({ href, label }, i) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));

              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: "easeOut" }}
                >
                  <Link
                    href={href}
                    className={`relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    {/* Active pill */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: "rgba(99,102,241,0.15)",
                          border: "1px solid rgba(99,102,241,0.3)",
                          boxShadow: "0 0 12px rgba(99,102,241,0.15)",
                        }}
                        transition={{ type: "spring", damping: 28, stiffness: 320 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* ── Right side actions ────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto shrink-0">

            {/* Plan badge */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-default animate-glow-border"
                style={{
                  background: `${planColor}14`,
                  border: `1px solid ${planColor}30`,
                  color: planColor,
                }}
                title={`Plan ${planLabel}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: planColor }}
                />
                {planLabel}
              </motion.div>
            </AnimatePresence>

            {/* Upgrade CTA — only for starter */}
            {isStarter && (
              <motion.button
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push("/pricing")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold dn-btn-glow"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                }}
              >
                <Sparkles className="w-3 h-3" />
                Upgrade
              </motion.button>
            )}

            {/* Nuevo Workflow button */}
            <motion.button
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/builder")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold dn-btn-glow"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                boxShadow: "0 4px 16px rgba(6,182,212,0.25)",
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Nuevo
            </motion.button>

            {/* User avatar */}
            {session && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.35, type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.08 }}
                className="flex items-center gap-1.5"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-default select-none transition-shadow"
                  style={{
                    background: `linear-gradient(135deg, ${planColor}cc, ${planColor}55)`,
                    boxShadow: `0 0 0 2px ${planColor}25`,
                  }}
                  title={`${session.name} · Plan ${planLabel}`}
                >
                  {session.initials}
                </div>
              </motion.div>
            )}

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile drawer ────────────────────────────────────────────── */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
