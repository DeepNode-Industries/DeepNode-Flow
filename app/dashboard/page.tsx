"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus, ArrowRight, Workflow, Play, CheckCircle2, XCircle,
  Zap, LayoutTemplate, Settings, Activity, Sparkles, Clock,
  TrendingUp, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useFlowStore } from "@/store/flow-store";
import { getExecutionLogs, saveSubscription } from "@/lib/storage";
import { useAuthStore } from "@/store/auth-store";
import type { ExecutionLog, UserPlan } from "@/lib/types";

/* ── Payment success toast ──────────────────────────────────────── */
function PaymentSuccessToast() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = React.useState(false);
  const [plan, setPlan] = React.useState("");

  useEffect(() => {
    const payment = searchParams.get("payment");
    const planParam = searchParams.get("plan") ?? "pro";
    if (payment === "success") {
      setShow(true);
      setPlan(planParam);
      saveSubscription({ plan: planParam as UserPlan, interval: "monthly", status: "active" });
      router.replace("/dashboard");
      setTimeout(() => setShow(false), 6000);
    }
  }, [searchParams, router]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.95 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm"
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(6,182,212,0.9))",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 16px 48px rgba(16,185,129,0.3)",
            }}
          >
            <Sparkles className="w-5 h-5 text-white shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">¡Suscripción activada!</p>
              <p className="text-xs text-white/80">Bienvenido al plan <span className="font-bold capitalize">{plan}</span> 🎉</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Helpers ────────────────────────────────────────────────────── */
function formatRelative(dateStr?: string): string {
  if (!dateStr) return "Nunca";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  return `hace ${Math.floor(hours / 24)}d`;
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const workflows     = useFlowStore((s) => s.workflows);
  const loadWorkflows = useFlowStore((s) => s.loadWorkflows);
  const session       = useAuthStore((s) => s.session);

  useEffect(() => { loadWorkflows(); }, [loadWorkflows]);

  const recentLogs    = getExecutionLogs().slice(0, 5);
  const totalWf       = workflows.length;
  const activeWf      = workflows.filter((w) => w.status === "active").length;
  const totalExec     = workflows.reduce((s, w) => s + w.executionCount, 0);
  const successLogs   = recentLogs.filter((l) => l.status === "success").length;
  const successRate   = recentLogs.length ? Math.round((successLogs / recentLogs.length) * 100) : 100;
  const recentWf      = [...workflows].sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
  const firstName = session?.name?.split(" ")[0] ?? "Usuario";

  return (
    <DashboardLayout>
      <Suspense><PaymentSuccessToast /></Suspense>

      {/* ── Welcome header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/builder"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-opacity hover:opacity-90 self-start sm:self-auto"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #6366f1)",
            boxShadow: "0 4px 20px rgba(6,182,212,0.25)",
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Workflow
        </Link>
      </div>

      {/* ── 4 stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Workflows",    value: totalWf,        sub: `${activeWf} activos`,     icon: Workflow,   color: "#6366f1" },
          { label: "Ejecuciones", value: totalExec,       sub: "en total",                icon: Play,       color: "#06b6d4" },
          { label: "Tasa éxito",  value: `${successRate}%`, sub: "últimas ejecuciones",   icon: TrendingUp, color: "#10b981" },
          { label: "Tiempo libre", value: "∞",            sub: "horas automatizadas",     icon: Clock,      color: "#a855f7" },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-5 relative overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: card.color, filter: "blur(24px)", transform: "translate(30%, -30%)" }}
              />
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}25` }}
                >
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-2xl font-black text-white mb-0.5">{card.value}</p>
              <p className="text-xs text-white/40">{card.label}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ── Main content: 2 columns ──────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">

        {/* ── Recent Workflows (2/3) ───────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Workflows recientes</h2>
            <Link href="/workflows" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
              Ver todos <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentWf.length === 0 ? (
            /* Empty state */
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Workflow className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm text-white/40 mb-1">Sin workflows aún</p>
              <p className="text-xs text-white/25 mb-5">Crea tu primer flujo de automatización</p>
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
              >
                <Plus className="w-3.5 h-3.5" /> Crear workflow
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentWf.map((wf, i) => (
                <motion.div
                  key={wf.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <Link
                    href={`/builder?id=${wf.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl group transition-all hover:bg-white/5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {/* Status dot */}
                    <div className="shrink-0">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: wf.status === "active" ? "#10b981"
                            : wf.status === "draft" ? "#6366f1" : "#6b7280",
                        }}
                      />
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{wf.name}</p>
                      <p className="text-xs text-white/35 mt-0.5">
                        {wf.nodes.length} nodos · {wf.executionCount} ejecuciones · {formatRelative(wf.lastExecutedAt)}
                      </p>
                    </div>

                    {/* Status chip */}
                    <span
                      className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium capitalize"
                      style={
                        wf.status === "active"
                          ? { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }
                          : wf.status === "draft"
                          ? { background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }
                          : { background: "rgba(107,114,128,0.12)", color: "#9ca3af", border: "1px solid rgba(107,114,128,0.2)" }
                      }
                    >
                      {wf.status}
                    </span>

                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Activity feed (1/3) ──────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Actividad</h2>
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {recentLogs.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="w-7 h-7 text-white/15 mx-auto mb-2" />
                <p className="text-xs text-white/30">Sin actividad</p>
              </div>
            ) : (
              <div>
                {recentLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-4 py-3"
                    style={{ borderBottom: idx < recentLogs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                  >
                    <div className="shrink-0 mt-0.5">
                      {log.status === "success"
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        : log.status === "error"
                        ? <XCircle className="w-3.5 h-3.5 text-red-400" />
                        : <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white/80 truncate">{log.workflowName}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        {log.steps.length} pasos · {formatRelative(log.startedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick actions ─────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Zap,           label: "Nuevo workflow",  sub: "Desde cero",        href: "/builder",   color: "#06b6d4" },
            { icon: LayoutTemplate, label: "Templates",      sub: "Usa un template",   href: "/templates", color: "#a855f7" },
            { icon: Workflow,      label: "Mis workflows",   sub: "Ver y gestionar",   href: "/workflows", color: "#6366f1" },
            { icon: Settings,      label: "Configuración",   sub: "API keys y más",    href: "/settings",  color: "#10b981" },
          ].map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-2xl group transition-all hover:bg-white/5"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{ background: `${action.color}15`, border: `1px solid ${action.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: action.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white leading-tight">{action.label}</p>
                    <p className="text-[10px] text-white/35">{action.sub}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 ml-auto transition-colors shrink-0" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
