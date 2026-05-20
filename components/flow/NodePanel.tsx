"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import {
  Play, Globe, Clock, FileText,
  Sparkles, Tags, AlignLeft, Braces, Bot,
  Zap, Mail, MessageSquare, Users, Table, Database, Bell, Send,
  GitBranch, Timer, RefreshCw, Shuffle,
} from "lucide-react";
import { NODE_DEFINITIONS, CATEGORY_LABELS } from "@/lib/node-definitions";
import type { NodeDefinition, NodeCategory } from "@/lib/types";
import { useFlowStore } from "@/store/flow-store";

const ICON_MAP: Record<string, React.ElementType> = {
  Play, Globe, Clock, FileText,
  Sparkles, Tags, AlignLeft, Braces, Bot,
  Zap, Mail, MessageSquare, Users, Table, Database, Bell, Send,
  GitBranch, Timer, RefreshCw, Shuffle,
};

function NodeItem({ def }: { def: NodeDefinition }) {
  const addNode = useFlowStore((s) => s.addNode);
  const Icon = ICON_MAP[def.icon] ?? Zap;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/dn-node-type", def.type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = () => {
    const id = `node-${Date.now()}`;
    addNode({
      id,
      type: def.type,
      category: def.category,
      label: def.label,
      description: def.description,
      icon: def.icon,
      color: def.color,
      position: {
        x: 200 + Math.random() * 300,
        y: 200 + Math.random() * 200,
      },
      config: { ...def.defaultConfig },
    });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="flex items-center gap-2.5 p-2 rounded-xl cursor-grab active:cursor-grabbing hover:bg-[#13131f] border border-transparent hover:border-[#1e1e35] transition-all group"
      title="Click para agregar, arrastra al canvas"
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: `${def.color}15`,
          border: `1px solid ${def.color}30`,
        }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: def.color }} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-300 truncate leading-tight group-hover:text-white transition-colors">
          {def.label}
        </div>
        <div className="text-[10px] text-slate-600 truncate leading-tight">{def.description}</div>
      </div>
    </div>
  );
}

const CATEGORIES: NodeCategory[] = ["trigger", "ai", "action", "logic"];

export function NodePanel() {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Set<NodeCategory>>(new Set());

  const toggleCategory = (cat: NodeCategory) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const filtered = NODE_DEFINITIONS.filter(
    (d) =>
      !search ||
      d.label.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-56 shrink-0 h-full flex flex-col border-r border-[#1e1e35] bg-[#0a0a16] overflow-hidden">
      <div className="p-3 border-b border-[#1e1e35]">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-[family-name:var(--font-space-grotesk)]">
          Nodos
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar nodo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#13131f] border border-[#1e1e35] rounded-lg text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {CATEGORIES.map((cat) => {
          const nodes = filtered.filter((d) => d.category === cat);
          if (nodes.length === 0) return null;
          const isCollapsed = collapsed.has(cat);

          return (
            <div key={cat}>
              <button
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1.5 w-full px-2 py-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-400 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
                {CATEGORY_LABELS[cat]}
                <span className="ml-auto text-slate-700">{nodes.length}</span>
              </button>
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {nodes.map((def) => (
                    <NodeItem key={def.type} def={def} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#1e1e35]">
        <p className="text-[10px] text-slate-700 text-center">
          Click o arrastra los nodos al canvas
        </p>
      </div>
    </div>
  );
}
