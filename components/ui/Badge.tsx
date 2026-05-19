"use client";

import React from "react";

type BadgeVariant = "purple" | "cyan" | "blue" | "green" | "amber" | "red" | "gray";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANTS: Record<BadgeVariant, string> = {
  purple: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  blue: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  red: "bg-red-500/10 text-red-400 border border-red-500/20",
  gray: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
};

export function Badge({ variant = "gray", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface StatusDotProps {
  status: "active" | "inactive" | "draft" | "running" | "success" | "error" | "pending" | "connected" | "disconnected";
}

const STATUS_CONFIG: Record<StatusDotProps["status"], { color: string; label: string; variant: BadgeVariant }> = {
  active: { color: "bg-emerald-400", label: "Activo", variant: "green" },
  inactive: { color: "bg-slate-400", label: "Inactivo", variant: "gray" },
  draft: { color: "bg-amber-400", label: "Borrador", variant: "amber" },
  running: { color: "bg-blue-400 animate-pulse", label: "Ejecutando", variant: "blue" },
  success: { color: "bg-emerald-400", label: "Éxito", variant: "green" },
  error: { color: "bg-red-400", label: "Error", variant: "red" },
  pending: { color: "bg-slate-400", label: "Pendiente", variant: "gray" },
  connected: { color: "bg-emerald-400", label: "Conectado", variant: "green" },
  disconnected: { color: "bg-slate-400", label: "Desconectado", variant: "gray" },
};

export function StatusBadge({ status }: StatusDotProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.inactive;
  return (
    <Badge variant={cfg.variant}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
      {cfg.label}
    </Badge>
  );
}
