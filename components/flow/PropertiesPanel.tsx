"use client";

import React from "react";
import { X, Trash2, Settings2 } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import { getNodeDefinition } from "@/lib/node-definitions";
import type { ConfigField } from "@/lib/types";

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ConfigField;
  value: string | number | boolean | string[];
  onChange: (v: string) => void;
}) {
  const strVal = String(value ?? "");

  if (field.type === "textarea") {
    return (
      <textarea
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className="w-full px-3 py-2 bg-[#0e0e1c] border border-[#1e1e35] rounded-lg text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 resize-none transition-colors font-mono"
      />
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <select
        value={strVal}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#0e0e1c] border border-[#1e1e35] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-purple-500/50 transition-colors"
      >
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={strVal}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      className="w-full px-3 py-2 bg-[#0e0e1c] border border-[#1e1e35] rounded-lg text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
    />
  );
}

export function PropertiesPanel() {
  const selectedNodeId  = useFlowStore((s) => s.selectedNodeId);
  const rfNodes         = useFlowStore((s) => s.rfNodes);
  const updateNodeConfig = useFlowStore((s) => s.updateNodeConfig);
  const removeNode      = useFlowStore((s) => s.removeNode);
  const selectNode      = useFlowStore((s) => s.selectNode);

  const selectedNode = rfNodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="w-64 shrink-0 h-full flex flex-col border-l border-[#1e1e35] bg-[#0a0a16]">
        <div className="p-4 border-b border-[#1e1e35]">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
            Propiedades
          </h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Settings2 className="w-10 h-10 text-slate-700 mb-3" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Selecciona un nodo en el canvas para editar sus propiedades
          </p>
        </div>
      </div>
    );
  }

  const nodeType = selectedNode.type ?? (selectedNode.data?.nodeType as string) ?? "";
  const def = getNodeDefinition(nodeType);
  const config = (selectedNode.data?.config as Record<string, string | number | boolean | string[]>) ?? {};

  const handleConfigChange = (key: string, value: string) => {
    updateNodeConfig(selectedNode.id, { [key]: value });
  };

  return (
    <div className="w-64 shrink-0 h-full flex flex-col border-l border-[#1e1e35] bg-[#0a0a16] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e35]">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-[family-name:var(--font-space-grotesk)]">
          Propiedades
        </h3>
        <button
          onClick={() => selectNode(null)}
          className="p-1 rounded-md hover:bg-[#13131f] text-slate-600 hover:text-slate-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Node info */}
        <div className="p-4 border-b border-[#1e1e35]">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: selectedNode.data?.color as string ?? "#7c3aed" }}
            />
            <span className="text-sm font-semibold text-slate-200 font-[family-name:var(--font-space-grotesk)]">
              {String(selectedNode.data?.label ?? "Nodo")}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">{def?.description ?? "Configura este nodo"}</p>
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border"
              style={{
                background: `${selectedNode.data?.color as string ?? "#7c3aed"}15`,
                borderColor: `${selectedNode.data?.color as string ?? "#7c3aed"}30`,
                color: selectedNode.data?.color as string ?? "#a855f7",
              }}
            >
              {String(selectedNode.data?.category ?? "action")}
            </span>
          </div>
        </div>

        {/* Config fields */}
        {def?.configFields && def.configFields.length > 0 ? (
          <div className="p-4 space-y-4">
            {def.configFields.map((field) => (
              <div key={field.key}>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                <FieldInput
                  field={field}
                  value={config[field.key] ?? ""}
                  onChange={(v) => handleConfigChange(field.key, v)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <p className="text-[11px] text-slate-600 text-center py-4">
              Este nodo no requiere configuración adicional
            </p>
          </div>
        )}
      </div>

      {/* Delete button */}
      <div className="p-3 border-t border-[#1e1e35]">
        <button
          onClick={() => removeNode(selectedNode.id)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Eliminar nodo
        </button>
      </div>
    </div>
  );
}
