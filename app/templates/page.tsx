"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, BarChart2, Receipt, Headphones, Package, Zap,
  Search, X, ArrowRight, Tags,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MOCK_TEMPLATES } from "@/lib/mock-data";
import { saveWorkflow } from "@/lib/storage";
import type { Workflow, Template } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  UserPlus, BarChart2, Receipt, Headphones, Package, Zap,
};

const CATEGORIES = ["Todos", "IA", "Ventas", "Reportes", "Finanzas", "Soporte", "Operaciones", "Integraciones"];

/* ── Category colors ────────────────────────────────────────────── */
const CATEGORY_GRADIENT: Record<string, string> = {
  IA:           "linear-gradient(135deg, #6366f1, #a855f7)",
  Ventas:       "linear-gradient(135deg, #06b6d4, #3b82f6)",
  Reportes:     "linear-gradient(135deg, #10b981, #06b6d4)",
  Finanzas:     "linear-gradient(135deg, #f59e0b, #ef4444)",
  Soporte:      "linear-gradient(135deg, #8b5cf6, #6366f1)",
  Operaciones:  "linear-gradient(135deg, #14b8a6, #3b82f6)",
  Integraciones:"linear-gradient(135deg, #ec4899, #8b5cf6)",
};

/* ── Preview modal ──────────────────────────────────────────────── */
interface PreviewModalProps {
  template: Template | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

function PreviewModal({ template, onClose, onConfirm }: PreviewModalProps) {
  if (!template) return null;
  const Icon = ICON_MAP[template.icon] ?? Zap;
  const gradient = CATEGORY_GRADIENT[template.category] ?? "linear-gradient(135deg, #6366f1, #a855f7)";

  return (
    <AnimatePresence>
      {template && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-lg pointer-events-auto rounded-2xl overflow-hidden"
              style={{
                background: "rgba(9,9,18,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
              }}
            >
              {/* Modal header with gradient */}
              <div
                className="h-28 flex items-center justify-center relative"
                style={{ background: gradient }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6">
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mb-2"
                  style={{ background: `${template.color}15`, color: template.color, border: `1px solid ${template.color}25` }}
                >
                  {template.category}
                </span>
                <h2 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-space-grotesk)]">
                  {template.name}
                </h2>
                <p className="text-sm text-white/50 leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Node list */}
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="text-xs font-medium text-white/40 mb-2">
                    {template.nodeCount} nodos incluidos
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...Array(Math.min(template.nodeCount, 6))].map((_, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 rounded-lg text-[11px] text-white/50"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        Nodo {i + 1}
                      </div>
                    ))}
                    {template.nodeCount > 6 && (
                      <div
                        className="px-2 py-1 rounded-lg text-[11px] text-white/30"
                        style={{ background: "rgba(255,255,255,0.03)" }}
                      >
                        +{template.nodeCount - 6} más
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-[11px] text-white/30"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => onConfirm(template.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: gradient }}
                  >
                    Usar plantilla
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function TemplatesPage() {
  const router   = useRouter();
  const [search,          setSearch]          = useState("");
  const [category,        setCategory]        = useState("Todos");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const filtered = MOCK_TEMPLATES.filter((tpl) => {
    const matchSearch =
      !search ||
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.description.toLowerCase().includes(search.toLowerCase()) ||
      tpl.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCategory = category === "Todos" || tpl.category === category;
    return matchSearch && matchCategory;
  });

  const handleConfirm = (templateId: string) => {
    const template = MOCK_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    const now = new Date().toISOString();
    const workflow: Workflow = {
      ...template.workflow,
      id:             `wf-${Date.now()}`,
      name:           template.name,
      createdAt:      now,
      updatedAt:      now,
      executionCount: 0,
    };

    saveWorkflow(workflow);
    setPreviewTemplate(null);
    router.push(`/builder?id=${workflow.id}`);
  };

  return (
    <DashboardLayout>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
          style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}
        >
          <Zap className="w-3 h-3" />
          Plantillas listas para usar
        </div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-space-grotesk)] mb-2">
          Templates
        </h1>
        <p className="text-sm text-white/40">
          Inicia con flujos prediseñados por expertos. Solo personaliza y activa.
        </p>
      </div>

      {/* ── Search bar ──────────────────────────────────────────────── */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          placeholder="Buscar plantillas..."
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

      {/* ── Category chips (horizontal scroll) ──────────────────────── */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
              category === cat ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
            style={category === cat ? {
              background: CATEGORY_GRADIENT[cat] ?? "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 2px 12px rgba(99,102,241,0.3)",
            } : {
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Grid ────────────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Tags className="w-10 h-10 text-white/15 mb-3" />
          <p className="text-white/40 font-medium">No se encontraron plantillas</p>
          <p className="text-white/20 text-sm mt-1">Prueba con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((tpl) => {
            const Icon     = ICON_MAP[tpl.icon] ?? Zap;
            const gradient = CATEGORY_GRADIENT[tpl.category] ?? "linear-gradient(135deg, #6366f1, #a855f7)";

            return (
              <div
                key={tpl.id}
                className="dn-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => setPreviewTemplate(tpl)}
              >
                {/* Gradient header */}
                <div
                  className="h-24 flex items-center justify-center relative overflow-hidden"
                  style={{ background: gradient }}
                >
                  {/* Decorative blobs */}
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.2), transparent 60%)",
                    }}
                  />
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform"
                    style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `${tpl.color}15`,
                        color: tpl.color,
                        border: `1px solid ${tpl.color}25`,
                      }}
                    >
                      {tpl.category}
                    </span>
                    <span className="text-[11px] text-white/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {tpl.nodeCount} nodos
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-1.5 font-[family-name:var(--font-space-grotesk)]">
                    {tpl.name}
                  </h3>

                  <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">
                    {tpl.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tpl.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded text-[10px] text-white/25"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(tpl);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: gradient }}
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

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 text-xs text-white/20 pt-8 pb-2">
        <Zap className="w-3 h-3" />
        <span>DeepNode Industries © 2026. Todos los derechos reservados.</span>
      </div>

      {/* ── Preview modal ────────────────────────────────────────────── */}
      <PreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onConfirm={handleConfirm}
      />
    </DashboardLayout>
  );
}
