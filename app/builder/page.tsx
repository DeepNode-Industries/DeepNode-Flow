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
  Save, Play, Download, ChevronLeft, MoreHorizontal,
  Loader2, TerminalSquare, Pencil, Check,
} from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { NodePanel } from "@/components/flow/NodePanel";
import { PropertiesPanel } from "@/components/flow/PropertiesPanel";
import { ExecutionLogs } from "@/components/flow/ExecutionLogs";
import { NODE_TYPES } from "@/components/flow/CustomNodes";
import { useFlowStore } from "@/store/flow-store";
import { getWorkflow } from "@/lib/storage";
import { NODE_DEFINITIONS } from "@/lib/node-definitions";
import type { WorkflowNode } from "@/lib/types";

function BuilderCanvas() {
  // ── Granular selectors: each picks only what it needs ──────────────────
  // This prevents the component re-rendering on every unrelated store change.
  const rfNodes         = useFlowStore((s) => s.rfNodes);
  const rfEdges         = useFlowStore((s) => s.rfEdges);
  const selectedNodeId  = useFlowStore((s) => s.selectedNodeId);
  const isExecuting     = useFlowStore((s) => s.isExecuting);
  const showLogs        = useFlowStore((s) => s.showLogs);

  // Stable action references — Zustand guarantees these never change identity
  const onNodesChange         = useFlowStore((s) => s.onNodesChange);
  const onEdgesChange         = useFlowStore((s) => s.onEdgesChange);
  const onConnect             = useFlowStore((s) => s.onConnect);
  const selectNode            = useFlowStore((s) => s.selectNode);
  const saveActiveWorkflow    = useFlowStore((s) => s.saveActiveWorkflow);
  const runWorkflow           = useFlowStore((s) => s.runWorkflow);
  const toggleLogs            = useFlowStore((s) => s.toggleLogs);
  const exportWorkflowJSON    = useFlowStore((s) => s.exportWorkflowJSON);
  const loadWorkflowIntoBuilder = useFlowStore((s) => s.loadWorkflowIntoBuilder);
  const createNewWorkflow     = useFlowStore((s) => s.createNewWorkflow);

  const { screenToFlowPosition } = useReactFlow();
  const searchParams = useSearchParams();
  const router = useRouter();
  const workflowId = searchParams.get("id");

  const [workflowName, setWorkflowName] = React.useState("Nuevo Workflow");
  const [editingName, setEditingName] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // Initialization ref — prevents re-running when store state changes
  const initRef = useRef<string | null>(undefined);

  useEffect(() => {
    // Only re-initialize when the workflowId URL param changes
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

    // No id or workflow not found → check store state without subscribing
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
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
        id: `node-${Date.now()}`,
        type: def.type,
        category: def.category,
        label: def.label,
        description: def.description,
        icon: def.icon,
        color: def.color,
        position,
        config: { ...def.defaultConfig },
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
    <div className="flex min-h-screen bg-[#080810]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e1e35] bg-[#0a0a16] z-10">
          <button
            onClick={() => router.push("/workflows")}
            className="p-1.5 rounded-lg hover:bg-[#13131f] text-slate-500 hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Workflow name */}
          <div className="flex items-center gap-2 flex-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
                  onBlur={() => setEditingName(false)}
                  className="text-sm font-semibold text-white bg-[#13131f] border border-purple-500/30 rounded-lg px-2 py-1 focus:outline-none min-w-0 max-w-xs"
                />
                <button onClick={() => setEditingName(false)} className="text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
              >
                <span className="text-sm font-semibold text-slate-200">{workflowName}</span>
                <Pencil className="w-3 h-3 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600 hidden sm:block">
              {rfNodes.length} nodos · {rfEdges.length} conexiones
            </span>

            <button
              onClick={toggleLogs}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showLogs
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "hover:bg-[#13131f] text-slate-500 hover:text-slate-300"
              }`}
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logs</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#13131f] text-slate-500 hover:text-slate-300 text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar</span>
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                saved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-[#13131f] hover:bg-[#1e1e35] text-slate-300 border border-[#1e1e35]"
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saved ? "Guardado" : "Guardar"}</span>
            </button>

            <button
              onClick={runWorkflow}
              disabled={isExecuting || rfNodes.length === 0}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-all shadow-md shadow-purple-500/20"
            >
              {isExecuting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{isExecuting ? "Ejecutando..." : "Ejecutar"}</span>
            </button>

            <button className="p-1.5 rounded-lg hover:bg-[#13131f] text-slate-600 hover:text-slate-400 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main builder area */}
        <div className="flex flex-1 min-h-0 relative">
          <NodePanel />

          {/* Canvas */}
          <div className="flex-1 relative">
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
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="#1e1e35"
              />
              <Controls />
              <MiniMap
                nodeColor={(node) => {
                  const color = (node.data?.color as string) ?? "#7c3aed";
                  return color;
                }}
                maskColor="rgba(8, 8, 16, 0.7)"
              />
            </ReactFlow>

            {/* Empty state */}
            {rfNodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <Play className="w-7 h-7 text-purple-400" />
                  </div>
                  <p className="text-slate-500 text-sm mb-1">Canvas vacío</p>
                  <p className="text-slate-700 text-xs">
                    Haz click en un nodo del panel izquierdo o arrástralo aquí
                  </p>
                </div>
              </div>
            )}

            {/* Execution logs overlay */}
            <ExecutionLogs />
          </div>

          <PropertiesPanel key={selectedNodeId} />
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <ReactFlowProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-[#080810] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      }>
        <BuilderCanvas />
      </Suspense>
    </ReactFlowProvider>
  );
}
