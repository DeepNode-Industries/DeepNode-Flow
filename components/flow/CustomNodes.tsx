"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Play, Globe, Clock, FileText,
  Sparkles, Tags, AlignLeft, Braces, Bot,
  Zap, Mail, MessageSquare, Users, Table, Database, Bell, Send,
  GitBranch, Timer, RefreshCw, Shuffle,
  CheckCircle2, XCircle, Loader2, Circle,
} from "lucide-react";
import type { NodeStatus } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Play, Globe, Clock, FileText,
  Sparkles, Tags, AlignLeft, Braces, Bot,
  Zap, Mail, MessageSquare, Users, Table, Database, Bell, Send,
  GitBranch, Timer, RefreshCw, Shuffle,
};

const CATEGORY_BORDER: Record<string, string> = {
  trigger: "border-purple-500/40",
  ai: "border-violet-500/40",
  action: "border-blue-500/40",
  logic: "border-red-500/40",
};

const CATEGORY_GLOW: Record<string, string> = {
  trigger: "shadow-purple-500/20",
  ai: "shadow-violet-500/20",
  action: "shadow-blue-500/20",
  logic: "shadow-red-500/20",
};

function StatusIcon({ status }: { status?: NodeStatus }) {
  if (!status || status === "pending") return null;
  if (status === "running") return <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />;
  if (status === "success") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === "error") return <XCircle className="w-3.5 h-3.5 text-red-400" />;
  if (status === "skipped") return <Circle className="w-3.5 h-3.5 text-slate-500" />;
  return null;
}

function statusBorderOverride(status?: NodeStatus): string {
  if (status === "running") return "border-blue-500/60 shadow-blue-500/30";
  if (status === "success") return "border-emerald-500/60 shadow-emerald-500/20";
  if (status === "error") return "border-red-500/60 shadow-red-500/30";
  return "";
}

function BaseNode({ data }: NodeProps) {
  const nodeData = data as {
    label?: string;
    description?: string;
    icon?: string;
    color?: string;
    category?: string;
    status?: NodeStatus;
    nodeType?: string;
  };

  const Icon = ICON_MAP[nodeData.icon ?? "Zap"] ?? Zap;
  const category = nodeData.category ?? "action";
  const statusOverride = statusBorderOverride(nodeData.status);
  const borderClass = statusOverride || CATEGORY_BORDER[category] || "border-slate-700/40";
  const glowClass = statusOverride ? "" : (CATEGORY_GLOW[category] || "");
  const isTrigger = category === "trigger";
  const isLogic = category === "logic";

  return (
    <div
      className={`relative group min-w-[160px] max-w-[200px] rounded-2xl border bg-[#0e0e1c]/95 backdrop-blur-sm shadow-lg ${borderClass} ${glowClass} transition-all duration-200 hover:scale-[1.02]`}
      style={{
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 0 0 transparent`,
      }}
    >
      {/* Top color bar */}
      <div
        className="h-1 rounded-t-2xl"
        style={{ background: nodeData.color ?? "#7c3aed" }}
      />

      <div className="px-3 py-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `${nodeData.color ?? "#7c3aed"}20`,
              border: `1px solid ${nodeData.color ?? "#7c3aed"}40`,
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: nodeData.color ?? "#7c3aed" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate leading-tight font-[family-name:var(--font-space-grotesk)]">
              {nodeData.label}
            </div>
            <div className="text-[10px] text-slate-600 capitalize">{category}</div>
          </div>
          <StatusIcon status={nodeData.status} />
        </div>

        {/* Description */}
        {nodeData.description && (
          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
            {nodeData.description}
          </p>
        )}
      </div>

      {/* Handles */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-purple-600 !border-2 !border-[#0e0e1c] hover:!bg-cyan-400 transition-colors"
        />
      )}
      {!isLogic || nodeData.nodeType === "if-condition" ? (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-purple-600 !border-2 !border-[#0e0e1c] hover:!bg-cyan-400 transition-colors"
        />
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-purple-600 !border-2 !border-[#0e0e1c] hover:!bg-cyan-400 transition-colors"
        />
      )}
    </div>
  );
}

export const NODE_TYPES = {
  // Triggers
  "manual-trigger": memo(BaseNode),
  "webhook": memo(BaseNode),
  "schedule": memo(BaseNode),
  "form-submission": memo(BaseNode),
  // AI
  "ai-text-generator": memo(BaseNode),
  "ai-classifier": memo(BaseNode),
  "ai-summarizer": memo(BaseNode),
  "ai-json-extractor": memo(BaseNode),
  "ai-agent": memo(BaseNode),
  "grok-chat": memo(BaseNode),
  // Actions
  "http-request": memo(BaseNode),
  "send-email": memo(BaseNode),
  "send-whatsapp": memo(BaseNode),
  "save-to-crm": memo(BaseNode),
  "save-to-sheets": memo(BaseNode),
  "database-query": memo(BaseNode),
  "notification": memo(BaseNode),
  "send-telegram": memo(BaseNode),
  // Logic
  "if-condition": memo(BaseNode),
  "delay": memo(BaseNode),
  "loop": memo(BaseNode),
  "transform-data": memo(BaseNode),
};
