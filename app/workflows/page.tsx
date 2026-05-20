"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Workflow, ArrowRight, Copy, Trash2,
  Play, Zap, Clock, MoreVertical,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/Badge";
import { useFlowStore } from "@/store/flow-store";

/* ── Helpers ────────────────────────────────────────────────────── */
function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "numeric", month: "short", year: "numeric",
  });
}

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

/* ── Decorative mini workflow preview ───────────────────────────── */
function MiniPreview({ nodeCount, status }: { nodeCount: number; status: string }) {
  const count = Math.min(nodeCount, 4);
  const accentColor =
    status === "active"   ? "#06b6d4"
    : status === "draft"  ? "#f59e0b"
    : "#4b5563";

  return (
    <div className="flex items-center gap-1">
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>
          <div
            className="w-5 h-5 rounded-full"
            style={{
              background: i === 0
                ? accentColor + "80"
                : i === count - 1
                ? "#a855f780"
                : "rgba(255,255,255,0.08)",
              border: `1px solid ${i === 0 ? accentColor + "50" : "rgba(255,255,255,0.1)"}`,
            }}
          />
          {i < count - 1 && (
            <div className="w-3 h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
          )}
        </React.Fragment>
      ))}
      {nodeCount > 4 && (
        <span className="text-[9px] text-white/30 ml-1">+{nodeCount - 4}</span>
      )}
    </div>
  );
}

/* ── Sort options ───────────────────────────────────────────────── */
type SortKey = "name" | "date" | "executions";

const SORT_LABELS: Record<SortKey, string> = {
  name:       "Nombre",
  date:       "Fecha",
  executions: "Ejecuciones",
};

/* ── Page ───────────────────────────────────────────────────────── */
export default function WorkflowsPage() {
  const workflows           = useFlowStore((s) => s.workflows);
  const loadWorkflows       = useFlowStore((s) => s.loadWorkflows);
  const deleteWorkflowById  = useFlowStore((s) => s.deleteWorkflowById);
  const duplicateWorkflowById = useFlowStore((s) => s.duplicateWorkflowById);

  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState<"all" | "active" | "inactive" | "draft">("all");
  const [sortKey,   setSortKey]   = useState<SortKey>("date");
  const [openMenu,  setOpenMenu]  = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  /* Filter + sort */
  const filtered = workflows
    .filter((wf) => {
      const matchSearch =
        !search ||
        wf.name.toLowerCase().includes(search.toLowerCase()) ||
        wf.description.toLowerCase().includes(search.toLowerCase()) ||
        wf.tags.some((t) => t.includes(search.toLowerCase()));
      const matchFilter = filter === "all" || wf.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortKey === "name")       return a.name.localeCompare(b.name);
      if (sortKey === "executions") return b.executionCount - a.executionCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleDelete = (id: string) => {
    if (confirm("¿Seguro que quieres eliminar este workflow?")) {
      deleteWorkflowById(id);
    }
    setOpenMenu(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateWorkflowById(id);
    setOpenMenu(null);
  };

  const FILTER_LABELS: Record<typeof filter, string> = {
    all: `Todos (${workflows.length})`,
    active: `Activos (${workflows.filter((w) => w.status === "active").length})`,
    inactive: `Inactivos (${workflows.filter((w) => w.status === "inactive").length})`,
    draft: `Borradores (${workflows.filter((w) => w.status === "draft").length})`,
  };

  return (
    <DashboardLayout>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            Workflows
          </h1>
          <p className="text-sm text-white/40 mt-0.5">
            {workflows.length} flujos · {workflows.filter((w) => w.status === "active").length} activos
          </p>
        </div>
        <Link
          href="/builder"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold self-start sm:self-auto transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            boxShadow: "0 4px 16px rgba(6,182,212,0.2)",
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Workflow
        </Link>
      </div>

      {/* ── Filters & search ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            placeholder="Buscar workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(99,102,241,0.5)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          />
        </div>

        {/* Filter tabs */}
        <div
          className="flex items-center gap-0.5 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {(["all", "active", "inactive", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === f ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
              style={filter === f ? {
                background: "rgba(99,102,241,0.2)",
                border: "1px solid rgba(99,102,241,0.3)",
              } : {}}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-white/30 hidden sm:block">Ordenar:</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-xs rounded-lg px-2 py-1.5 text-white/60 focus:outline-none appearance-none cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
              <option key={k} value={k}>{SORT_LABELS[k]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Grid / empty state ──────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            <Workflow className="w-7 h-7 text-indigo-400" />
          </div>
          <p className="text-white/50 font-medium mb-2">
            {search ? "No se encontraron workflows" : "Aún no tienes workflows"}
          </p>
          <p className="text-white/25 text-sm mb-6">
            {search ? "Prueba con otro término de búsqueda" : "Crea tu primer flujo de automatización"}
          </p>
          {!search && (
            <Link
              href="/builder"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
            >
              <Plus className="w-4 h-4" />
              Crear primer workflow
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((wf) => (
            <div
              key={wf.id}
              className="dn-card rounded-2xl group relative overflow-hidden flex flex-col"
              onClick={() => setOpenMenu(null)}
            >
              {/* Left border accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl"
                style={{
                  background: wf.status === "active"
                    ? "linear-gradient(180deg, #06b6d4, #3b82f6)"
                    : wf.status === "draft"
                    ? "linear-gradient(180deg, #f59e0b, #f97316)"
                    : "rgba(255,255,255,0.08)",
                }}
              />

              <div className="p-5 pl-6 flex-1">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                      <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <MiniPreview nodeCount={wf.nodes.length} status={wf.status} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={wf.status} />
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === wf.id ? null : wf.id);
                        }}
                        className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-all"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {openMenu === wf.id && (
                        <div
                          className="absolute right-0 top-full mt-1 z-50 w-44 overflow-hidden rounded-xl shadow-xl"
                          style={{
                            background: "rgba(9,9,18,0.97)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            backdropFilter: "blur(16px)",
                          }}
                        >
                          <Link
                            href={`/builder?id=${wf.id}`}
                            className="flex items-center gap-2 px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Abrir en Builder
                          </Link>
                          <button
                            onClick={() => handleDuplicate(wf.id)}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicar
                          </button>
                          <button
                            onClick={() => handleDelete(wf.id)}
                            className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name + description */}
                <h3 className="text-sm font-semibold text-white mb-1 font-[family-name:var(--font-space-grotesk)]">
                  {wf.name}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed mb-4 line-clamp-2">
                  {wf.description || "Sin descripción"}
                </p>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-[11px] text-white/30 mb-3">
                  <span className="flex items-center gap-1">
                    <Workflow className="w-3 h-3" />
                    {wf.nodes.length} nodos
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3" />
                    {wf.executionCount} ejecuciones
                  </span>
                  {wf.lastExecutedAt && (
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock className="w-3 h-3" />
                      {formatRelative(wf.lastExecutedAt)}
                    </span>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {wf.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 rounded text-[10px] text-white/30"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Hover action buttons */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/builder?id=${wf.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Play className="w-3 h-3" />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDuplicate(wf.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <Copy className="w-3 h-3" />
                    Duplicar
                  </button>
                  <button
                    onClick={() => handleDelete(wf.id)}
                    className="p-2 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div
                className="px-6 py-2.5 flex items-center justify-between text-[10px] text-white/20"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span>Creado {formatDate(wf.createdAt)}</span>
                <Link
                  href={`/builder?id=${wf.id}`}
                  className="flex items-center gap-1 text-white/30 hover:text-cyan-400 transition-colors"
                >
                  Abrir <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/20 pt-8 pb-2">
        <Zap className="w-3 h-3" />
        <span>DeepNode Industries © 2026. Todos los derechos reservados.</span>
      </div>
    </DashboardLayout>
  );
}
