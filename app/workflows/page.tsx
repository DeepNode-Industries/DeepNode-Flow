"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Workflow, ArrowRight, Copy, Trash2,
  Play, Zap, MoreVertical, Clock,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/ui/Badge";
import { useFlowStore } from "@/store/flow-store";

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

export default function WorkflowsPage() {
  const { workflows, loadWorkflows, deleteWorkflowById, duplicateWorkflowById } = useFlowStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "draft">("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  const filtered = workflows.filter((wf) => {
    const matchSearch =
      !search ||
      wf.name.toLowerCase().includes(search.toLowerCase()) ||
      wf.description.toLowerCase().includes(search.toLowerCase()) ||
      wf.tags.some((t) => t.includes(search.toLowerCase()));
    const matchFilter = filter === "all" || wf.status === filter;
    return matchSearch && matchFilter;
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

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)]">
            Workflows
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {workflows.length} flujos · {workflows.filter((w) => w.status === "active").length} activos
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

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl">
          {(["all", "active", "inactive", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f
                  ? "bg-purple-500/20 text-purple-300"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f === "all" ? "Todos" : f === "active" ? "Activos" : f === "inactive" ? "Inactivos" : "Borradores"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
            <Workflow className="w-7 h-7 text-purple-400" />
          </div>
          <p className="text-slate-400 font-medium mb-2">
            {search ? "No se encontraron workflows" : "Aún no tienes workflows"}
          </p>
          <p className="text-slate-600 text-sm mb-6">
            {search ? "Prueba con otro término de búsqueda" : "Crea tu primer flujo de automatización"}
          </p>
          {!search && (
            <Link
              href="/builder"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" />
              Crear primer workflow
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((wf) => (
            <div
              key={wf.id}
              className="dn-glass-bright rounded-2xl border border-[#1e1e35] hover:border-[#2a2a45] transition-all group overflow-hidden relative"
              onClick={() => setOpenMenu(null)}
            >
              {/* Color bar */}
              <div
                className="h-1 w-full"
                style={{
                  background: wf.status === "active"
                    ? "linear-gradient(90deg, #7c3aed, #06b6d4)"
                    : wf.status === "draft"
                    ? "linear-gradient(90deg, #f59e0b, #7c3aed)"
                    : "#1e1e35",
                }}
              />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={wf.status} />
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === wf.id ? null : wf.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-[#1e1e35] text-slate-600 hover:text-slate-400 transition-colors"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                      {openMenu === wf.id && (
                        <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl shadow-xl overflow-hidden">
                          <Link
                            href={`/builder?id=${wf.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#13131f] transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                            Abrir en Builder
                          </Link>
                          <button
                            onClick={() => handleDuplicate(wf.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-[#13131f] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicar
                          </button>
                          <button
                            onClick={() => handleDelete(wf.id)}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-slate-200 mb-1 font-[family-name:var(--font-space-grotesk)]">
                  {wf.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {wf.description || "Sin descripción"}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-[11px] text-slate-600 mb-4">
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
                      className="px-1.5 py-0.5 rounded bg-[#1e1e35] text-slate-600 text-[10px]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Open button */}
                <Link
                  href={`/builder?id=${wf.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border border-[#1e1e35] hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-500 hover:text-purple-300 text-xs font-medium transition-all"
                >
                  Abrir en Builder
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="px-5 py-2.5 border-t border-[#1e1e35]/50 flex items-center justify-between text-[10px] text-slate-700">
                <span>Creado {formatDate(wf.createdAt)}</span>
                <span>Actualizado {formatDate(wf.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
