"use client";

import React, { useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus, ArrowRight, Workflow, Play, CheckCircle2, XCircle,
  Zap, LayoutTemplate, Settings, Activity, Sparkles, Clock,
  TrendingUp, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { WorkflowRowSkeleton } from "@/components/ui/Skeleton";
import { useFlowStore } from "@/store/flow-store";
import { getExecutionLogs, saveSubscription } from "@/lib/storage";
import { useAuthStore } from "@/store/auth-store";
import type { ExecutionLog, UserPlan } from "@/lib/types";

/* ── Animation variants ─────────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease } },
};
const itemX: Variants = {
  hidden: { opacity: 0, x: -12, filter: "blur(3px)" },
  show:   { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.4, ease } },
};

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
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm"
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.95), rgba(6,182,212,0.9))",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 20px 60px rgba(16,185,129,0.35)",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -10, 5, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 text-white shrink-0" />
            </motion.div>
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

      {/* ── Aurora background blobs ───────────────────────────────── */}
      <div className="relative">
        <AuroraBackground />

        {/* ── Welcome header ─────────────────────────────────────── */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting}, <span className="dn-gradient-text-primary">{firstName}</span> 👋
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              {new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold self-start sm:self-auto dn-btn-glow"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #6366f1)",
                boxShadow: "0 4px 24px rgba(6,182,212,0.3)",
              }}
            >
              <Plus className="w-4 h-4" />
              Nuevo Workflow
            </Link>
          </motion.div>
        </motion.div>

        {/* ── 4 stat cards ───────────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {[
            { label: "Workflows",     value: totalWf,     sub: `${activeWf} activos`,          icon: Workflow,   color: "#6366f1", numericDelay: 0.1 },
            { label: "Ejecuciones",   value: totalExec,   sub: "en total",                     icon: Play,       color: "#06b6d4", numericDelay: 0.2 },
            { label: "Tasa de éxito", value: successRate, sub: "últimas ejecuciones",           icon: TrendingUp, color: "#10b981", numericDelay: 0.3, suffix: "%" },
            { label: "Tiempo libre",  value: "∞",         sub: "horas automatizadas",           icon: Clock,      color: "#a855f7", numericDelay: 0 },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                variants={item}
                className="rounded-2xl p-5 relative overflow-hidden group dn-hover-lift cursor-default"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                whileHover={{
                  borderColor: `${card.color}35`,
                  transition: { duration: 0.2 },
                }}
              >
                {/* Ambient glow blob */}
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-25 transition-opacity duration-500"
                  style={{ background: card.color, filter: "blur(28px)", transform: "translate(35%, -35%)" }}
                />

                <div className="flex items-center justify-between mb-3">
                  <motion.div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${card.color}18`, border: `1px solid ${card.color}28` }}
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.color }} />
                  </motion.div>
                </div>

                <p className="text-2xl font-black text-white mb-0.5 font-[family-name:var(--font-onest)]">
                  {typeof card.value === "number" ? (
                    <>
                      <AnimatedNumber value={card.value} delay={card.numericDelay} duration={1.2} />
                      {card.suffix}
                    </>
                  ) : (
                    card.value
                  )}
                </p>
                <p className="text-xs text-white/40">{card.label}</p>
                <p className="text-[10px] text-white/25 mt-0.5">{card.sub}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Main content: 2 columns ─────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8 relative z-10">

          {/* ── Recent Workflows (2/3) ─────────────────────────── */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center justify-between mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <h2 className="text-sm font-semibold text-white">Workflows recientes</h2>
              <Link
                href="/workflows"
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors group"
              >
                Ver todos
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 1 }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </Link>
            </motion.div>

            {recentWf.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.4, ease: "easeOut" }}
                className="rounded-2xl p-10 text-center"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <motion.div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                >
                  <Workflow className="w-5 h-5 text-indigo-400" />
                </motion.div>
                <p className="text-sm text-white/40 mb-1">Sin workflows aún</p>
                <p className="text-xs text-white/25 mb-5">Crea tu primer flujo de automatización</p>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/builder"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity dn-btn-glow"
                    style={{ background: "linear-gradient(135deg, #06b6d4, #6366f1)" }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Crear workflow
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-2.5"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {recentWf.map((wf) => (
                  <motion.div key={wf.id} variants={itemX}>
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                      <Link
                        href={`/builder?id=${wf.id}`}
                        className="flex items-center gap-4 p-4 rounded-2xl group transition-all hover:bg-white/5"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {/* Pulsing status dot */}
                        <div className="shrink-0 relative">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: wf.status === "active" ? "#10b981"
                                : wf.status === "draft" ? "#6366f1" : "#6b7280",
                            }}
                          />
                          {wf.status === "active" && (
                            <div
                              className="absolute inset-0 rounded-full animate-pulse-dot"
                              style={{ background: "#10b981", opacity: 0.5 }}
                            />
                          )}
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

                        <motion.div
                          animate={{ x: 0 }}
                          className="shrink-0"
                          whileHover={{ x: 3 }}
                        >
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                        </motion.div>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* ── Activity feed (1/3) ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Actividad</h2>
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              />
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {recentLogs.length === 0 ? (
                <div className="p-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    <Activity className="w-7 h-7 text-white/15 mx-auto mb-2" />
                  </motion.div>
                  <p className="text-xs text-white/30">Sin actividad reciente</p>
                </div>
              ) : (
                <motion.div variants={container} initial="hidden" animate="show">
                  {recentLogs.map((log: ExecutionLog, idx: number) => (
                    <motion.div
                      key={log.id}
                      variants={itemX}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-white/3 transition-colors"
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
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Quick actions ──────────────────────────────────────── */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.45, ease: "easeOut" }}
        >
          <h2 className="text-sm font-semibold text-white mb-4">Acciones rápidas</h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {[
              { icon: Zap,            label: "Nuevo workflow", sub: "Desde cero",       href: "/builder",   color: "#06b6d4" },
              { icon: LayoutTemplate, label: "Templates",      sub: "Usa un template",  href: "/templates", color: "#a855f7" },
              { icon: Workflow,       label: "Mis workflows",  sub: "Ver y gestionar",  href: "/workflows", color: "#6366f1" },
              { icon: Settings,       label: "Configuración",  sub: "API keys y más",   href: "/settings",  color: "#10b981" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  variants={item}
                  className="dn-hover-lift"
                >
                  <Link
                    href={action.href}
                    className="flex items-center gap-3 p-4 rounded-2xl group transition-all hover:bg-white/5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <motion.div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${action.color}15`, border: `1px solid ${action.color}22` }}
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <Icon className="w-4 h-4" style={{ color: action.color }} />
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight">{action.label}</p>
                      <p className="text-[10px] text-white/35">{action.sub}</p>
                    </div>
                    <motion.div
                      className="ml-auto shrink-0"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: Math.random() * 1.5 }}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
