"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Workflow, Play, TrendingUp, Zap, CheckCircle2, XCircle,
  Clock, Plus, ArrowRight, Activity, Globe, Sparkles,
  MessageSquare, Database, Users, Mail,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/Badge";
import { useFlowStore } from "@/store/flow-store";
import { getExecutionLogs } from "@/lib/storage";
import type { ExecutionLog } from "@/lib/types";

const METRIC_CARDS = [
  {
    title: "Workflows Activos",
    value: "3",
    change: "+1 esta semana",
    icon: Workflow,
    color: "#7c3aed",
    trend: "up",
  },
  {
    title: "Ejecuciones Hoy",
    value: "247",
    change: "+18% vs ayer",
    icon: Play,
    color: "#06b6d4",
    trend: "up",
  },
  {
    title: "Tasa de Éxito",
    value: "96.4%",
    change: "+2.1% esta semana",
    icon: TrendingUp,
    color: "#10b981",
    trend: "up",
  },
  {
    title: "Tiempo Ahorrado",
    value: "18.4h",
    change: "esta semana",
    icon: Clock,
    color: "#f59e0b",
    trend: "up",
  },
];

const INTEGRATION_STATUS = [
  { name: "OpenAI", icon: Sparkles, status: "connected" as const, color: "#10b981" },
  { name: "WhatsApp", icon: MessageSquare, status: "connected" as const, color: "#25d366" },
  { name: "HubSpot", icon: Users, status: "connected" as const, color: "#ff7a59" },
  { name: "PostgreSQL", icon: Database, status: "connected" as const, color: "#336791" },
  { name: "Email SMTP", icon: Mail, status: "disconnected" as const, color: "#94a3b8" },
  { name: "Webhooks", icon: Globe, status: "connected" as const, color: "#7c3aed" },
];

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

export default function DashboardPage() {
  const { workflows, loadWorkflows } = useFlowStore();

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const recentLogs: ExecutionLog[] = getExecutionLogs().slice(0, 5);
  const activeWorkflows = workflows.filter((w) => w.status === "active");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bienvenido a DeepNode Flow — tus flujos están activos y corriendo
          </p>
        </div>
        <Link
          href="/builder"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4" />
          Nuevo Workflow
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRIC_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="dn-glass-bright rounded-2xl p-5 border border-[#1e1e35] hover:border-[#2a2a45] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: card.color }} />
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-full">↑</span>
              </div>
              <div className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)] mb-1">
                {card.value}
              </div>
              <div className="text-xs text-slate-500">{card.title}</div>
              <div className="text-[10px] text-emerald-400 mt-1">{card.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active workflows */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 font-[family-name:var(--font-space-grotesk)]">
              Workflows Activos
            </h2>
            <Link
              href="/workflows"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {activeWorkflows.length === 0 ? (
            <div className="dn-glass-bright rounded-2xl border border-[#1e1e35] p-12 text-center">
              <Workflow className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-600">No tienes workflows activos.</p>
              <Link href="/builder" className="text-xs text-purple-400 mt-2 inline-block">Crea uno →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeWorkflows.slice(0, 4).map((wf) => (
                <div
                  key={wf.id}
                  className="dn-glass-bright rounded-2xl border border-[#1e1e35] hover:border-[#2a2a45] p-4 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-200">{wf.name}</div>
                        <div className="text-[11px] text-slate-600">{wf.nodes.length} nodos · {wf.executionCount} ejecuciones</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={wf.status} />
                      <Link
                        href={`/builder?id=${wf.id}`}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#1e1e35] text-slate-500 hover:text-slate-300 transition-all"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <div className="flex gap-3">
                      {wf.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-[#1e1e35] text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span>Última ejecución: {formatRelative(wf.lastExecutedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent executions */}
          <div className="flex items-center justify-between mt-6">
            <h2 className="text-sm font-semibold text-slate-300 font-[family-name:var(--font-space-grotesk)]">
              Ejecuciones Recientes
            </h2>
          </div>
          <div className="dn-glass-bright rounded-2xl border border-[#1e1e35] overflow-hidden">
            <div className="divide-y divide-[#1e1e35]/50">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#0e0e1c]/50 transition-colors">
                  <div className="shrink-0">
                    {log.status === "success" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : log.status === "error" ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-300 truncate">{log.workflowName}</div>
                    <div className="text-[10px] text-slate-600">{log.steps.length} pasos</div>
                  </div>
                  <div className="text-[10px] text-slate-600 shrink-0">
                    {formatRelative(log.startedAt)}
                  </div>
                  {log.duration && (
                    <div className="text-[10px] text-slate-700 shrink-0">
                      {(log.duration / 1000).toFixed(1)}s
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div>
          <h2 className="text-sm font-semibold text-slate-300 font-[family-name:var(--font-space-grotesk)] mb-4">
            Integraciones
          </h2>
          <div className="dn-glass-bright rounded-2xl border border-[#1e1e35] p-4 space-y-2">
            {INTEGRATION_STATUS.map((int) => {
              const Icon = int.icon;
              return (
                <div key={int.name} className="flex items-center gap-3 py-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${int.color}20`, border: `1px solid ${int.color}30` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: int.color }} />
                  </div>
                  <span className="text-xs text-slate-400 flex-1">{int.name}</span>
                  <StatusBadge status={int.status} />
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <h2 className="text-sm font-semibold text-slate-300 font-[family-name:var(--font-space-grotesk)] mb-4 mt-6">
            Acciones Rápidas
          </h2>
          <div className="space-y-2">
            {[
              { label: "Crear workflow nuevo", href: "/builder", icon: Plus },
              { label: "Ver plantillas", href: "/templates", icon: Zap },
              { label: "Configurar integraciones", href: "/settings", icon: Globe },
            ].map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#1e1e35] hover:border-[#2a2a45] hover:bg-[#0e0e1c] text-slate-400 hover:text-slate-300 text-sm transition-all group"
              >
                <Icon className="w-4 h-4 text-purple-500 group-hover:text-purple-400 transition-colors" />
                {label}
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
