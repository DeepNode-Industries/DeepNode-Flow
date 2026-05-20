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
import { motion } from "framer-motion";
import type { NodeStatus } from "@/lib/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Play, Globe, Clock, FileText,
  Sparkles, Tags, AlignLeft, Braces, Bot,
  Zap, Mail, MessageSquare, Users, Table, Database, Bell, Send,
  GitBranch, Timer, RefreshCw, Shuffle,
};

const CATEGORY_BORDER: Record<string, string> = {
  trigger: "border-purple-500/40",
  ai:      "border-violet-500/40",
  action:  "border-blue-500/40",
  logic:   "border-red-500/40",
};

const CATEGORY_GLOW: Record<string, string> = {
  trigger: "shadow-purple-500/20",
  ai:      "shadow-violet-500/20",
  action:  "shadow-blue-500/20",
  logic:   "shadow-red-500/20",
};

function StatusIcon({ status }: { status?: NodeStatus }) {
  if (!status || status === "pending") return null;
  if (status === "running") {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-3.5 h-3.5 text-blue-400" />
      </motion.div>
    );
  }
  if (status === "success") {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
      </motion.div>
    );
  }
  if (status === "error") {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <XCircle className="w-3.5 h-3.5 text-red-400" />
      </motion.div>
    );
  }
  if (status === "skipped") return <Circle className="w-3.5 h-3.5 text-slate-500" />;
  return null;
}

function statusBoxShadow(status?: NodeStatus): string {
  if (status === "running") return "0 0 0 2px rgba(99,102,241,0.7), 0 0 24px rgba(99,102,241,0.35)";
  if (status === "success") return "0 0 0 2px rgba(16,185,129,0.5), 0 0 16px rgba(16,185,129,0.2)";
  if (status === "error")   return "0 0 0 2px rgba(239,68,68,0.5), 0 0 16px rgba(239,68,68,0.2)";
  return "0 4px 24px rgba(0,0,0,0.4)";
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
  const isTrigger = category === "trigger";
  const borderClass = CATEGORY_BORDER[category] ?? "border-slate-700/40";
  const glowClass   = CATEGORY_GLOW[category] ?? "";
  const status      = nodeData.status;

  return (
    <motion.div
      data-status={status ?? "pending"}
      className={`relative group min-w-[160px] max-w-[200px] rounded-2xl border bg-[#0e0e1c]/96 backdrop-blur-sm shadow-lg ${borderClass} ${glowClass}`}
      style={{ boxShadow: statusBoxShadow(status) }}
      whileHover={{
        scale: 1.03,
        boxShadow: status
          ? statusBoxShadow(status)
          : `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${nodeData.color ?? "#7c3aed"}30`,
        transition: { duration: 0.18 },
      }}
      animate={
        status === "running"
          ? {
              boxShadow: [
                "0 0 0 2px rgba(99,102,241,0.4), 0 0 16px rgba(99,102,241,0.15)",
                "0 0 0 3px rgba(99,102,241,0.9), 0 0 40px rgba(99,102,241,0.45)",
                "0 0 0 2px rgba(99,102,241,0.4), 0 0 16px rgba(99,102,241,0.15)",
              ],
            }
          : {}
      }
      transition={
        status === "running"
          ? { repeat: Infinity, duration: 1, ease: "easeInOut" }
          : {}
      }
      layout
    >
      {/* Top color bar */}
      <div
        className="h-1 rounded-t-2xl"
        style={{ background: nodeData.color ?? "#7c3aed" }}
      />

      <div className="px-3 py-2.5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <motion.div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `${nodeData.color ?? "#7c3aed"}20`,
              border: `1px solid ${nodeData.color ?? "#7c3aed"}40`,
            }}
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: nodeData.color ?? "#7c3aed" }} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate leading-tight">
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
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-600 !border-2 !border-[#0e0e1c] hover:!bg-cyan-400 transition-colors"
      />
    </motion.div>
  );
}

export const NODE_TYPES = {
  "manual-trigger":    memo(BaseNode),
  "webhook":           memo(BaseNode),
  "schedule":          memo(BaseNode),
  "form-submission":   memo(BaseNode),
  "ai-text-generator": memo(BaseNode),
  "ai-classifier":     memo(BaseNode),
  "ai-summarizer":     memo(BaseNode),
  "ai-json-extractor": memo(BaseNode),
  "ai-agent":          memo(BaseNode),
  "grok-chat":         memo(BaseNode),
  "http-request":      memo(BaseNode),
  "send-email":        memo(BaseNode),
  "send-whatsapp":     memo(BaseNode),
  "save-to-crm":       memo(BaseNode),
  "save-to-sheets":    memo(BaseNode),
  "database-query":    memo(BaseNode),
  "notification":      memo(BaseNode),
  "send-telegram":     memo(BaseNode),
  "if-condition":      memo(BaseNode),
  "delay":             memo(BaseNode),
  "loop":              memo(BaseNode),
  "transform-data":    memo(BaseNode),
};
