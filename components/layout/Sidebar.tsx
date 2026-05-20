"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Workflow, LayoutTemplate,
  Settings, Zap, Plus, ChevronRight, Info, LogOut,
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

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const session  = useAuthStore((s) => s.session);
  const logout   = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const planColor = PLAN_COLORS[session?.plan ?? "starter"] ?? "#7c3aed";
  const planLabel = session?.plan === "enterprise"
    ? "Enterprise"
    : session?.plan === "business"
    ? "Business"
    : "Starter";

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col border-r border-[#1e1e35] bg-[#0a0a16]">

      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="px-4 py-4 border-b border-[#1e1e35]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
            <Image
              src="/logo.png"
              alt="DeepNode Industries"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-[family-name:var(--font-space-grotesk)] leading-tight">
              DeepNode Flow
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">DeepNode Industries</div>
          </div>
        </Link>
      </div>

      {/* ── New workflow CTA ─────────────────────────────────────── */}
      <div className="p-3 border-b border-[#1e1e35]">
        <Link
          href="/builder"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium transition-all group"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Workflow</span>
          <ChevronRight className="w-3 h-3 ml-auto opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-purple-500/15 text-purple-300 border border-purple-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-[#13131f]"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-purple-400"
                    : "text-slate-600 group-hover:text-slate-400"
                }`}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User footer ──────────────────────────────────────────── */}
      <div className="p-3 border-t border-[#1e1e35] space-y-1.5">
        {/* User card */}
        <div className="dn-glass rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-md"
              style={{ background: `linear-gradient(135deg, ${planColor}cc, ${planColor}66)` }}
            >
              {session?.initials ?? "?"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-200 truncate leading-tight">
                {session?.name ?? "Usuario"}
              </div>
              <div
                className="text-[10px] font-medium truncate"
                style={{ color: planColor }}
              >
                Plan {planLabel}
              </div>
            </div>
          </div>
          {/* Email */}
          {session?.email && (
            <div className="text-[10px] text-slate-600 truncate mt-1.5 pl-[42px]">
              {session.email}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
