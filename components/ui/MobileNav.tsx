"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, LayoutDashboard, Workflow, Zap, LayoutTemplate,
  Settings, Plus, LogOut, Info,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const NAV_ITEMS = [
  { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard"      },
  { href: "/workflows",  icon: Workflow,         label: "Workflows"      },
  { href: "/builder",    icon: Zap,              label: "Builder"        },
  { href: "/templates",  icon: LayoutTemplate,   label: "Templates"      },
  { href: "/settings",   icon: Settings,         label: "Configuración"  },
  { href: "/about",      icon: Info,             label: "Acerca de"      },
];

const PLAN_COLORS: Record<string, string> = {
  starter:    "#7c3aed",
  business:   "#06b6d4",
  enterprise: "#a855f7",
};

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const session  = useAuthStore((s) => s.session);
  const logout   = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    onClose();
    router.push("/login");
  };

  const handleNavClick = () => {
    onClose();
  };

  const planColor = PLAN_COLORS[session?.plan ?? "starter"] ?? "#7c3aed";
  const planLabel =
    session?.plan === "enterprise" ? "Enterprise"
    : session?.plan === "business" ? "Business"
    : "Starter";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col"
            style={{
              background: "rgba(9,9,18,0.97)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Link href="/" onClick={handleNavClick} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-purple-500/20">
                  <Image src="/logo.png" alt="DeepNode" width={32} height={32} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white">DeepNode</span>
                  <span className="text-sm font-bold dn-gradient-text-primary">Flow</span>
                </div>
              </Link>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {/* Nuevo Workflow CTA */}
              <button
                onClick={() => { router.push("/builder"); onClose(); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-4 text-white text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6, #a855f7)",
                  boxShadow: "0 4px 20px rgba(6,182,212,0.25)",
                }}
              >
                <Plus className="w-4 h-4" />
                Nuevo Workflow
              </button>

              {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`}
                    style={isActive ? {
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.25)",
                    } : {}}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 ${isActive ? "text-cyan-400" : "text-white/30"}`}
                    />
                    {label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Footer: user + version */}
            <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {/* User card */}
              {session && (
                <div className="flex items-center gap-3 p-3 rounded-xl mb-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${planColor}cc, ${planColor}55)` }}
                  >
                    {session.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate">{session.name}</div>
                    <div className="text-xs font-medium truncate" style={{ color: planColor }}>
                      Plan {planLabel}
                    </div>
                  </div>
                </div>
              )}

              {/* Mode badge */}
              <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-xs text-white/40">Modo Demo</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>

              <div className="text-center mt-3 text-xs text-white/20">
                DeepNode Industries © 2026
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
