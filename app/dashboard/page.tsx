"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Workflow, Play, TrendingUp, Clock, Plus, ArrowRight,
  Activity, CheckCircle2, XCircle, Zap, Globe, Settings,
  LayoutTemplate,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/Badge";
import { useFlowStore } from "@/store/flow-store";
import { getExecutionLogs } from "@/lib/storage";
import { useAuthStore } from "@/store/auth-store";
import type { ExecutionLog } from "@/lib/types";

/* ── Decorative sparkline ───────────────────────────────────────── */
function Sparkline({ color }: { color: string }) {
  const bars = [3, 6, 4, 8, 5, 9, 7, 10, 6, 9];
  const max = 10;
  return (
    <div className="flex items-end gap-0.5 h-6">
      {bars.map((v, i) => (
        <div
          key={i}
          className="w-1 rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.5 + (i / bars.length) * 0.5 }}
        />
      ))}
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */
function formatRelative(dateStr?: string): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

/* ── Metric data ────────────────────────────────────────────────── */
const METRIC_CARDS = [
  {
    title: "Workflows Activos",
    value: "3",
    change: "+1 esta semana",
    icon: Workflow,
    color: "#a855f7",
    trend: "↑",
  },
  {
    title: "Ejecuciones Hoy",
    value: "247",
    change: "+18% vs ayer",
    icon: Play,
    color: "#06b6d4",
    trend: "↑",
  },
  {
    title: "Tasa de Éxito",
    value: "96.4%",
    change: "+2.1% esta semana",
    icon: TrendingUp,
    color: "#10b981",
    trend: "↑",
  },
  {
    title: "Tiempo Ahorrado",
    value: "18.4h",
    change: "esta semana",
    icon: Clock,
    color: "#f59e0b",
    trend: "↑",
  },
];

/* ── Activity icon helper ───────────────────────────────────────── */
function ActivityIcon({ status }: { status: ExecutionLog["status"] }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "error")   return <XCircle      className="w-4 h-4 text-red-400" />;
  return <Activity className="w-4 h-4 text-blue-400 animate-pulse" />;
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const workflows    = useFlowStore((s) => s.workflows);
  const loadWorkflows = useFlowStore((s) => s.loadWorkflows);
  const session       = useAuthStore((s) => s.session);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const recentLogs: ExecutionLog[] = getExecutionLogs().slice(0, 8);
  const activeWorkflows = workflows.filter((w) => w.status === "active");

  /* Greeting */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const today = new Date().toLocaleDateString("es-MX", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <DashboardLayout>
      {/* ── Header strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            {greeting}, {session?.name?.split(" ")[0] ?? "Usuario"} 👋
          </h1>
          <p className="text-sm text-white/40 mt-0.5 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Demo badge */}
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              color: "#fbbf24",
            }}
          >
            ⚡ Modo Demo
          </span>
          <Link
            href="/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #3b82f6, #a855f7)",
              boxShadow: "0 4px 20px rgba(6,182,212,0.25)",
            }}
          >
            <Plus className="w-4 h-4" />
            Nuevo Workflow
          </Link>
        </div>
      </div>

      {/* ── Metrics row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="dn-card rounded-2xl p-5 relative overflow-hidden group cursor-default"
            >
              {/* Subtle glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `radial-gradient(ellipse at 20% 20%, ${card.color}10, transparent 70%)` }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </div>
                  <span
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}
                  >
                    {card.trend}
                  </span>
                </div>

                <div
                  className="text-2xl font-bold mb-0.5 font-[family-name:var(--font-space-grotesk)]"
                  style={{ color: card.color }}
                >
                  {card.value}
                </div>
                <div className="text-xs text-white/50 mb-2">{card.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400">{card.change}</span>
                  <Sparkline color={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main 60/40 grid ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">

        {/* ── Left 60%: Recent Workflows ──────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/70 font-[family-name:var(--font-space-grotesk)]">
              Workflows Recientes
            </h2>
            <Link
              href="/workflows"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {activeWorkflows.length === 0 ? (
            <div
              className="dn-card rounded-2xl p-12 text-center"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <Workflow className="w-6 h-6 text-indigo-400" />
              </div>
              <p className="text-sm text-white/40 mb-1">Aún no tienes workflows activos</p>
              <p className="text-xs text-white/25 mb-6">Crea tu primer flujo de automatización</p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
              >
                <Plus className="w-4 h-4" />
                Crear ahora
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeWorkflows.slice(0, 5).map((wf) => (
                <div
                  key={wf.id}
                  className="dn-card rounded-2xl p-4 group relative overflow-hidden"
                >
                  {/* Left accent border */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
                    style={{ background: "linear-gradient(180deg, #06b6d4, #a855f7)" }}
                  />

                  <div className="flex items-center justify-between pl-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Mini node preview */}
                      <div className="hidden sm:flex items-center gap-1 shrink-0">
                        {[...Array(Math.min(wf.nodes.length, 3))].map((_, i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full border-2 border-[#090912]"
                            style={{
                              background: i === 0
                                ? "rgba(6,182,212,0.6)"
                                : i === 1
                                ? "rgba(99,102,241,0.6)"
                                : "rgba(168,85,247,0.6)",
                              marginLeft: i > 0 ? "-8px" : "0",
                            }}
                          />
                        ))}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{wf.name}</div>
                        <div className="text-[11px] text-white/35">
                          {wf.nodes.length} nodos · {wf.executionCount} ejecuciones · {formatRelative(wf.lastExecutedAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={wf.status} />
                      <Link
                        href={`/builder?id=${wf.id}`}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right 40%: Activity Feed ─────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/70 font-[family-name:var(--font-space-grotesk)]">
              Actividad Reciente
            </h2>
          </div>

          <div className="dn-card rounded-2xl overflow-hidden">
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="text-sm text-white/30">Sin actividad reciente</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {recentLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-white/2 transition-colors"
                    style={{ background: idx === 0 ? "rgba(255,255,255,0.02)" : undefined }}
                  >
                    {/* Icon + vertical timeline line */}
                    <div className="flex flex-col items-center shrink-0 mt-0.5">
                      <ActivityIcon status={log.status} />
                      {idx < recentLogs.length - 1 && (
                        <div className="w-px flex-1 mt-1" style={{ minHeight: "12px", background: "rgba(255,255,255,0.06)" }} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pb-1">
                      <div className="text-xs font-medium text-white/80 truncate">{log.workflowName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-white/30">{log.steps.length} pasos</span>
                        {log.duration && (
                          <span className="text-[10px] text-white/20">
                            {(log.duration / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[10px] text-white/25 shrink-0 mt-0.5">
                      {formatRelative(log.startedAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Actions strip ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            icon: Plus,
            label: "Crear Workflow",
            desc: "Empieza desde cero",
            href: "/builder",
            gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            shadow: "rgba(6,182,212,0.2)",
          },
          {
            icon: LayoutTemplate,
            label: "Ver Templates",
            desc: "Flujos prediseñados",
            href: "/templates",
            gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
            shadow: "rgba(168,85,247,0.2)",
          },
          {
            icon: Settings,
            label: "Configurar",
            desc: "API keys e integraciones",
            href: "/settings",
            gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
            shadow: "rgba(16,185,129,0.2)",
          },
        ].map(({ icon: Icon, label, desc, href, gradient, shadow }) => (
          <Link
            key={href}
            href={href}
            className="dn-card rounded-2xl p-5 flex items-center gap-4 group transition-all hover:scale-[1.02]"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: gradient, boxShadow: `0 8px 24px ${shadow}` }}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white group-hover:text-white/90">{label}</div>
              <div className="text-xs text-white/40">{desc}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto transition-all group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/20 pt-2 pb-4">
        <Zap className="w-3 h-3" />
        <span>DeepNode Industries © 2026. Todos los derechos reservados.</span>
      </div>
    </DashboardLayout>
  );
}
