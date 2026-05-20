"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  LayoutTemplate,
  Settings,
  Zap,
  Plus,
  ChevronRight,
  Info,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/workflows", icon: Workflow, label: "Workflows" },
  { href: "/builder", icon: Zap, label: "Builder" },
  { href: "/templates", icon: LayoutTemplate, label: "Templates" },
  { href: "/settings", icon: Settings, label: "Configuración" },
  { href: "/about", icon: Info, label: "Acerca de" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col border-r border-[#1e1e35] bg-[#0a0a16]">
      {/* Logo */}
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

      {/* New workflow CTA */}
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

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
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
                  isActive ? "text-purple-400" : "text-slate-600 group-hover:text-slate-400"
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

      {/* Footer with logo */}
      <div className="p-4 border-t border-[#1e1e35]">
        <div className="dn-glass rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-md shadow-purple-500/20">
              <Image
                src="/logo.png"
                alt="DeepNode"
                width={28}
                height={28}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-300">Demo Account</div>
              <div className="text-[10px] text-slate-600">Plan Enterprise</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
