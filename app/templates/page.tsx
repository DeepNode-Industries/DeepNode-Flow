"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus, BarChart2, Receipt, Headphones, Package, Zap,
  ArrowRight, Search, Tags,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MOCK_TEMPLATES } from "@/lib/mock-data";
import { saveWorkflow } from "@/lib/storage";
import type { Workflow } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  UserPlus, BarChart2, Receipt, Headphones, Package, Zap,
};

const CATEGORIES = ["Todos", "IA", "Ventas", "Reportes", "Finanzas", "Soporte", "Operaciones", "Integraciones"];

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filtered = MOCK_TEMPLATES.filter((tpl) => {
    const matchSearch =
      !search ||
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.description.toLowerCase().includes(search.toLowerCase()) ||
      tpl.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCategory = category === "Todos" || tpl.category === category;
    return matchSearch && matchCategory;
  });

  const handleUse = (templateId: string) => {
    const template = MOCK_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const now = new Date().toISOString();
    const workflow: Workflow = {
      ...template.workflow,
      id: `wf-${Date.now()}`,
      name: template.name,
      createdAt: now,
      updatedAt: now,
      executionCount: 0,
    };

    saveWorkflow(workflow);
    router.push(`/builder?id=${workflow.id}`);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs mb-4">
          <Zap className="w-3 h-3" />
          Plantillas listas para usar
        </div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
          Templates
        </h1>
        <p className="text-sm text-slate-500">
          Inicia con flujos prediseñados por expertos. Solo personaliza y activa.
        </p>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar plantillas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0e0e1c] border border-[#1e1e35] rounded-xl text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                category === cat
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-[#0e0e1c] border border-[#1e1e35] text-slate-500 hover:text-slate-300 hover:border-[#2a2a45]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Tags className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-slate-400 font-medium">No se encontraron plantillas</p>
          <p className="text-slate-600 text-sm mt-1">Prueba con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((tpl) => {
            const Icon = ICON_MAP[tpl.icon] ?? Zap;
            return (
              <div
                key={tpl.id}
                className="dn-glass-bright rounded-2xl border border-[#1e1e35] hover:border-[#2a2a45] transition-all group overflow-hidden flex flex-col"
              >
                {/* Top color accent */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${tpl.color}, transparent)` }}
                />

                <div className="p-5 flex-1">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: `${tpl.color}15`,
                        border: `1px solid ${tpl.color}30`,
                      }}
                    >
                      <Icon className="w-5.5 h-5.5" style={{ color: tpl.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium mb-1.5 inline-block"
                        style={{
                          background: `${tpl.color}15`,
                          color: tpl.color,
                          border: `1px solid ${tpl.color}25`,
                        }}
                      >
                        {tpl.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-200 font-[family-name:var(--font-space-grotesk)] leading-tight">
                        {tpl.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {tpl.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {tpl.nodeCount} nodos
                    </span>
                    <span className="text-slate-700">·</span>
                    <span>Listo para usar</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {tpl.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-[#1e1e35] text-slate-600 text-[10px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5">
                  <button
                    onClick={() => handleUse(tpl.id)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: `${tpl.color}15`,
                      border: `1px solid ${tpl.color}30`,
                      color: tpl.color,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${tpl.color}25`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = `${tpl.color}15`;
                    }}
                  >
                    Usar plantilla
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
