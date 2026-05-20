"use client";

import React, { useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Save, Play, Download, ChevronLeft, Loader2,
  TerminalSquare, Pencil, Check, PanelLeftOpen, PanelLeftClose,
} from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { NodePanel } from "@/components/flow/NodePanel";
import { PropertiesPanel } from "@/components/flow/PropertiesPanel";
import { ExecutionLogs } from "@/components/flow/ExecutionLogs";
import { NODE_TYPES } from "@/components/flow/CustomNodes";
import { useFlowStore } from "@/store/flow-store";
import { getWorkflow } from "@/lib/storage";
import { NODE_DEFINITIONS } from "@/lib/node-definitions";
import type { WorkflowNode } from "@/lib/types";
import { AuthGuard } from "@/components/auth/AuthGuard";

/* ── Builder canvas (must live inside ReactFlowProvider) ──────────── */
function BuilderCanvas() {
  /* Granular selectors — each picks only what it needs */
  const rfNodes        = useFlowStore((s) => s.rfNodes);
  const rfEdges        = useFlowStore((s) => s.rfEdges);
  const selectedNodeId = useFlowStore((s) => s.selectedNodeId);
  const isExecuting    = useFlowStore((s) => s.isExecuting);
  const showLogs       = useFlowStore((s) => s.showLogs);

  /* Stable action references */
  const onNodesChange            = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange            = useFlowStore((s) => s.onEdgesChange);
  const onConnect                = useFlowStore((s) => s.onConnect);
  const selectNode               = useFlowStore((s) => s.selectNode);
  const saveActiveWorkflow       = useFlowStore((s) => s.saveActiveWorkflow);
  const runWorkflow              = useFlowStore((s) => s.runWorkflow);
  const toggleLogs               = useFlowStore((s) => s.toggleLogs);
  const exportWorkflowJSON       = useFlowStore((s) => s.exportWorkflowJSON);
  const loadWorkflowIntoBuilder  = useFlowStore((s) => s.loadWorkflowIntoBuilder);
  const createNewWorkflow        = useFlowStore((s) => s.createNewWorkflow);

  const { screenToFlowPosition } = useReactFlow();
  const searchParams = useSearchParams();
  const router       = useRouter();
  const workflowId   = searchParams.get("id");

  const [workflowName, setWorkflowName] = React.useState("Nuevo Workflow");
  const [editingName,  setEditingName]  = React.useState(false);
  const [saved,        setSaved]        = React.useState(false);
  const [nodePanelOpen, setNodePanelOpen] = React.useState(true);

  /* Initialization ref — prevents re-running when store state changes */
  const initRef = useRef<string | null>(undefined);

  useEffect(() => {
    const key = workflowId ?? "__new__";
    if (initRef.current === key) return;
    initRef.current = key;

    if (workflowId) {
      const wf = getWorkflow(workflowId);
      if (wf) {
        loadWorkflowIntoBuilder(wf);
        setWorkflowName(wf.name);
        return;
      }
    }

    const existing = useFlowStore.getState().activeWorkflow;
    if (!existing) {
      const newWf = createNewWorkflow();
      setWorkflowName(newWf.name);
    } else {
      setWorkflowName(existing.name);
    }
  }, [workflowId, loadWorkflowIntoBuilder, createNewWorkflow]);

  const handleSave = () => {
    saveActiveWorkflow(workflowName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const json = exportWorkflowJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${workflowName.replace(/\s+/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData("application/dn-node-type");
      if (!nodeType) return;

      const def = NODE_DEFINITIONS.find((d) => d.type === nodeType);
      if (!def) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });

      const node: WorkflowNode = {
        id:          `node-${Date.now()}`,
        type:        def.type,
        category:    def.category,
        label:       def.label,
        description: def.description,
        icon:        def.icon,
        color:       def.color,
        position,
        config:      { ...def.defaultConfig },
      };

      useFlowStore.getState().addNode(node);
    },
    [screenToFlowPosition]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    /* Full-height canvas area below the fixed TopBar */
    <div className="flex flex-col bg-[#080810]" style={{ height: "calc(100dvh - 56px)", paddingTop: "56px" }}>
      <div className="flex flex-1 min-h-0 relative">

        {/* ── Collapsible Node Panel ────────────────────────────────── */}
        {nodePanelOpen && <NodePanel />}

        {/* ── Toggle button ─────────────────────────────────────────── */}
        <button
          onClick={() => setNodePanelOpen((v) => !v)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-5 h-10 rounded-r-lg text-white/40 hover:text-white/80 transition-all"
          style={{
            background: "rgba(9,9,18,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderLeft: "none",
            left: nodePanelOpen ? "256px" : "0px",
          }}
          title={nodePanelOpen ? "Ocultar panel" : "Mostrar panel"}
        >
          {nodePanelOpen
            ? <PanelLeftClose className="w-3 h-3" />
            : <PanelLeftOpen  className="w-3 h-3" />
          }
        </button>

        {/* ── Canvas ───────────────────────────────────────────────── */}
        <div className="flex-1 relative">

          {/* ── Floating toolbar ───────────────────────────────────── */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1"
            style={{
              background: "rgba(9,9,18,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "16px",
              padding: "6px 10px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {/* Back */}
            <button
              onClick={() => router.push("/workflows")}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Volver a Workflows"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

            {/* Workflow name */}
            {editingName ? (
              <div className="flex items-center gap-1.5">
                <input
                  autoFocus
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") setEditingName(false);
                  }}
                  onBlur={() => setEditingName(false)}
                  className="text-sm font-semibold text-white bg-white/5 border border-indigo-500/40 rounded-lg px-2 py-1 focus:outline-none min-w-0 max-w-[180px]"
                />
                <button onClick={() => setEditingName(false)} className="text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg group hover:bg-white/5 transition-all"
              >
                <span className="text-sm font-semibold text-white/90 max-w-[140px] truncate">
                  {workflowName}
                </span>
                <Pencil className="w-3 h-3 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            <div className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

            {/* Stats */}
            <span className="text-[11px] text-white/30 hidden sm:block px-1">
              {rfNodes.length}N · {rfEdges.length}C
            </span>

            <div className="w-px h-4 mx-1 hidden sm:block" style={{ background: "rgba(255,255,255,0.08)" }} />

            {/* Logs */}
            <button
              onClick={toggleLogs}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showLogs
                  ? "text-indigo-300"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={showLogs ? {
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
              } : {}}
              title="Ver logs"
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              title="Exportar JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                saved
                  ? "text-emerald-400"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={saved ? {
                background: "rgba(16,185,129,0.1)",
                border: "1px solid rgba(16,185,129,0.3)",
              } : {}}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saved ? "Guardado" : "Guardar"}</span>
            </button>

            {/* Run */}
            <button
              onClick={runWorkflow}
              disabled={isExecuting || rfNodes.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                boxShadow: "0 2px 12px rgba(6,182,212,0.3)",
              }}
            >
              {isExecuting
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Play    className="w-3.5 h-3.5" />
              }
              <span className="hidden sm:inline">
                {isExecuting ? "Ejecutando..." : "Ejecutar"}
              </span>
            </button>
          </div>

          {/* ── React Flow canvas ──────────────────────────────────── */}
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            deleteKeyCode="Delete"
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e1e35" />
            <Controls />
            <MiniMap
              nodeColor={(node) => (node.data?.color as string) ?? "#7c3aed"}
              maskColor="rgba(8,8,16,0.7)"
            />
          </ReactFlow>

          {/* ── Canvas empty state ─────────────────────────────────── */}
          {rfNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                  }}
                >
                  <Play className="w-7 h-7 text-indigo-400" />
                </div>
                <p className="text-white/40 text-sm mb-1">Canvas vacío</p>
                <p className="text-white/20 text-xs">
                  Arrastra nodos desde el panel o haz click en ellos
                </p>
              </div>
            </div>
          )}

          {/* Execution logs overlay */}
          <ExecutionLogs />
        </div>

        {/* ── Properties panel (right) ─────────────────────────────── */}
        <PropertiesPanel key={selectedNodeId} />
      </div>
    </div>
  );
}

/* ── Page export ────────────────────────────────────────────────── */
export default function BuilderPage() {
  return (
    <AuthGuard>
      {/* TopBar rendered at root level so it's always above the canvas */}
      <div className="min-h-screen bg-[#080810]">
        <TopBar />
        <ReactFlowProvider>
          <Suspense
            fallback={
              <div
                className="flex items-center justify-center bg-[#080810]"
                style={{ height: "calc(100dvh - 56px)", marginTop: "56px" }}
              >
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            }
          >
            <BuilderCanvas />
          </Suspense>
        </ReactFlowProvider>
      </div>
    </AuthGuard>
  );
}
