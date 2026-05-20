"use client";

import React from "react";
import { X, CheckCircle2, XCircle, Loader2, Circle, Clock, Terminal } from "lucide-react";
import { useFlowStore } from "@/store/flow-store";
import type { ExecutionStep } from "@/lib/types";

function StepRow({ step }: { step: ExecutionStep }) {
  const icons = {
    success: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />,
    running: <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0" />,
    pending: <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />,
    skipped: <Circle className="w-3.5 h-3.5 text-slate-700 shrink-0" />,
  };

  const textColors = {
    success: "text-slate-300",
    error: "text-red-300",
    running: "text-blue-300",
    pending: "text-slate-500",
    skipped: "text-slate-600",
  };

  const time = new Date(step.timestamp).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-start gap-2 py-1.5 border-b border-[#1e1e35]/50 last:border-0">
      <span className="mt-0.5">{icons[step.status] ?? icons.pending}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[11px] font-semibold text-slate-400">[{step.nodeLabel}]</span>
          <span className="text-[10px] text-slate-700 ml-auto shrink-0">{time}</span>
        </div>
        <p
          className={`text-[11px] leading-relaxed ${textColors[step.status] ?? textColors.pending}`}
          style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
        >
          {step.message}
        </p>
      </div>
    </div>
  );
}

export function ExecutionLogs() {
  const executionLog = useFlowStore((s) => s.executionLog);
  const isExecuting  = useFlowStore((s) => s.isExecuting);
  const showLogs     = useFlowStore((s) => s.showLogs);
  const toggleLogs   = useFlowStore((s) => s.toggleLogs);
  const clearLogs    = useFlowStore((s) => s.clearLogs);

  if (!showLogs) return null;

  const steps = executionLog?.steps ?? [];
  const overallStatus = executionLog?.status;
  const duration = executionLog?.duration;

  return (
    <div className="absolute bottom-4 left-[14rem] right-[16rem] z-50 dn-glass rounded-2xl border border-[#1e1e35] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e35] bg-[#0a0a16]">
        <Terminal className="w-4 h-4 text-purple-400" />
        <h4 className="text-xs font-semibold text-slate-300 flex-1" style={{ fontFamily: "var(--font-onest)" }}>
          Logs de Ejecución
        </h4>

        {isExecuting && (
          <span className="flex items-center gap-1.5 text-[10px] text-blue-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            Ejecutando...
          </span>
        )}

        {!isExecuting && overallStatus && (
          <span
            className={`flex items-center gap-1.5 text-[10px] ${
              overallStatus === "success" ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {overallStatus === "success" ? (
              <CheckCircle2 className="w-3 h-3" />
            ) : (
              <XCircle className="w-3 h-3" />
            )}
            {overallStatus === "success" ? "Completado" : "Error"}
            {duration && (
              <span className="flex items-center gap-1 text-slate-600 ml-1">
                <Clock className="w-2.5 h-2.5" />
                {(duration / 1000).toFixed(1)}s
              </span>
            )}
          </span>
        )}

        <button
          onClick={clearLogs}
          className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors px-2 py-0.5 rounded"
        >
          Limpiar
        </button>
        <button
          onClick={toggleLogs}
          className="p-1 rounded-md hover:bg-[#13131f] text-slate-600 hover:text-slate-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Logs */}
      <div className="max-h-48 overflow-y-auto p-3 bg-[#06060f]">
        {steps.length === 0 && !isExecuting ? (
          <p className="text-[11px] text-slate-700 text-center py-4">
            Los logs aparecerán aquí durante la ejecución
          </p>
        ) : (
          <div>
            {steps.map((step, i) => (
              <StepRow key={`${step.nodeId}-${i}`} step={step} />
            ))}
            {isExecuting && steps.length < 1 && (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                <span className="text-[11px] text-blue-400 font-mono">Iniciando ejecución...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
