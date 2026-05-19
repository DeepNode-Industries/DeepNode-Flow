"use client";

import { create } from "zustand";
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from "@xyflow/react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { Workflow, ExecutionLog, WorkflowNode, WorkflowEdge, NodeConfig } from "@/lib/types";
import {
  getWorkflows,
  saveWorkflow,
  deleteWorkflow,
  duplicateWorkflow,
} from "@/lib/storage";
import { executeWorkflow, buildEmptyWorkflow } from "@/lib/workflow-engine";

// Convert our WorkflowNode to React Flow Node
function toRFNode(n: WorkflowNode): Node {
  return {
    id: n.id,
    type: n.type,
    position: n.position,
    data: {
      label: n.label,
      description: n.description,
      icon: n.icon,
      color: n.color,
      category: n.category,
      config: n.config,
      status: n.status,
      nodeType: n.type,
    },
  };
}

// Convert our WorkflowEdge to React Flow Edge
function toRFEdge(e: WorkflowEdge): Edge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    sourceHandle: e.sourceHandle ?? null,
    targetHandle: e.targetHandle ?? null,
    animated: true,
    style: { stroke: "#7c3aed", strokeWidth: 2 },
  };
}

// Convert React Flow Node back to WorkflowNode
function fromRFNode(rfNode: Node, existing?: WorkflowNode): WorkflowNode {
  const data = rfNode.data as Record<string, unknown>;
  return {
    id: rfNode.id,
    type: rfNode.type ?? (data?.nodeType as string) ?? "manual-trigger",
    category: (data?.category as WorkflowNode["category"]) ?? existing?.category ?? "trigger",
    label: (data?.label as string) ?? existing?.label ?? "Node",
    description: (data?.description as string) ?? existing?.description ?? "",
    icon: (data?.icon as string) ?? existing?.icon ?? "Play",
    color: (data?.color as string) ?? existing?.color ?? "#7c3aed",
    position: rfNode.position,
    config: (data?.config as NodeConfig) ?? existing?.config ?? {},
    status: data?.status as WorkflowNode["status"],
  };
}

// Convert React Flow Edge back to WorkflowEdge
function fromRFEdge(rfEdge: Edge): WorkflowEdge {
  return {
    id: rfEdge.id,
    source: rfEdge.source,
    target: rfEdge.target,
    sourceHandle: rfEdge.sourceHandle,
    targetHandle: rfEdge.targetHandle,
  };
}

interface FlowState {
  // Active workflow in the builder
  activeWorkflow: Workflow | null;
  rfNodes: Node[];
  rfEdges: Edge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
  executionLog: ExecutionLog | null;
  showLogs: boolean;

  // Workflows list
  workflows: Workflow[];

  // Actions
  loadWorkflows: () => void;
  setActiveWorkflow: (workflow: Workflow | null) => void;
  loadWorkflowIntoBuilder: (workflow: Workflow) => void;
  createNewWorkflow: (name?: string) => Workflow;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;

  addNode: (node: WorkflowNode) => void;
  removeNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;

  saveActiveWorkflow: (name?: string) => void;
  deleteWorkflowById: (id: string) => void;
  duplicateWorkflowById: (id: string) => Workflow | null;

  runWorkflow: () => Promise<void>;
  toggleLogs: () => void;
  clearLogs: () => void;

  exportWorkflowJSON: () => string;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  activeWorkflow: null,
  rfNodes: [],
  rfEdges: [],
  selectedNodeId: null,
  isExecuting: false,
  executionLog: null,
  showLogs: false,
  workflows: [],

  loadWorkflows: () => {
    const workflows = getWorkflows();
    set({ workflows });
  },

  setActiveWorkflow: (workflow) => {
    set({ activeWorkflow: workflow });
  },

  loadWorkflowIntoBuilder: (workflow) => {
    const rfNodes = workflow.nodes.map(toRFNode);
    const rfEdges = workflow.edges.map(toRFEdge);
    set({ activeWorkflow: workflow, rfNodes, rfEdges, selectedNodeId: null, executionLog: null });
  },

  createNewWorkflow: (name) => {
    const workflow = buildEmptyWorkflow(name);
    set({ activeWorkflow: workflow, rfNodes: [], rfEdges: [], selectedNodeId: null, executionLog: null });
    return workflow;
  },

  onNodesChange: (changes) => {
    set((state) => ({ rfNodes: applyNodeChanges(changes, state.rfNodes) }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({ rfEdges: applyEdgeChanges(changes, state.rfEdges) }));
  },

  onConnect: (connection) => {
    set((state) => ({
      rfEdges: addEdge(
        { ...connection, animated: true, style: { stroke: "#7c3aed", strokeWidth: 2 } },
        state.rfEdges
      ),
    }));
  },

  addNode: (node) => {
    const rfNode = toRFNode(node);
    set((state) => ({ rfNodes: [...state.rfNodes, rfNode] }));
  },

  removeNode: (id) => {
    set((state) => ({
      rfNodes: state.rfNodes.filter((n) => n.id !== id),
      rfEdges: state.rfEdges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  updateNodeConfig: (nodeId, config) => {
    set((state) => ({
      rfNodes: state.rfNodes.map((n) => {
        if (n.id !== nodeId) return n;
        const prevConfig = (n.data?.config as Record<string, unknown>) ?? {};
        return { ...n, data: { ...n.data, config: { ...prevConfig, ...config } } };
      }),
    }));
  },

  saveActiveWorkflow: (name) => {
    const { activeWorkflow, rfNodes, rfEdges } = get();
    if (!activeWorkflow) return;

    const updatedNodes: WorkflowNode[] = rfNodes.map((rfNode) => {
      const existing = activeWorkflow.nodes.find((n) => n.id === rfNode.id);
      return fromRFNode(rfNode, existing);
    });

    const updatedEdges: WorkflowEdge[] = rfEdges.map(fromRFEdge);

    const updated: Workflow = {
      ...activeWorkflow,
      name: name ?? activeWorkflow.name,
      nodes: updatedNodes,
      edges: updatedEdges,
      updatedAt: new Date().toISOString(),
    };

    saveWorkflow(updated);
    const workflows = getWorkflows();
    set({ activeWorkflow: updated, workflows });
  },

  deleteWorkflowById: (id) => {
    deleteWorkflow(id);
    const workflows = getWorkflows();
    set((state) => ({
      workflows,
      activeWorkflow: state.activeWorkflow?.id === id ? null : state.activeWorkflow,
    }));
  },

  duplicateWorkflowById: (id) => {
    const copy = duplicateWorkflow(id);
    if (copy) {
      const workflows = getWorkflows();
      set({ workflows });
    }
    return copy;
  },

  runWorkflow: async () => {
    const { activeWorkflow, rfNodes, rfEdges } = get();
    if (!activeWorkflow) return;

    // Save first
    get().saveActiveWorkflow();

    set({ isExecuting: true, showLogs: true, executionLog: null });

    // Reset node statuses
    set((state) => ({
      rfNodes: state.rfNodes.map((n) => ({
        ...n,
        data: { ...n.data, status: "pending" },
      })),
    }));

    try {
      await executeWorkflow(activeWorkflow.id, (log) => {
        set({ executionLog: { ...log } });

        // Update node statuses in canvas
        const stepMap = new Map(log.steps.map((s) => [s.nodeId, s.status]));
        set((state) => ({
          rfNodes: state.rfNodes.map((n) => {
            const stepStatus = stepMap.get(n.id);
            if (stepStatus) {
              return { ...n, data: { ...n.data, status: stepStatus } };
            }
            return n;
          }),
        }));
      });
    } catch (err) {
      console.error("Execution error:", err);
    } finally {
      const workflows = getWorkflows();
      set({ isExecuting: false, workflows });
    }

    // Keep rfNodes/rfEdges in sync - reload from store
    void rfNodes;
    void rfEdges;
  },

  toggleLogs: () => {
    set((state) => ({ showLogs: !state.showLogs }));
  },

  clearLogs: () => {
    set({ executionLog: null });
  },

  exportWorkflowJSON: () => {
    const { activeWorkflow, rfNodes, rfEdges } = get();
    if (!activeWorkflow) return "{}";

    const nodes: WorkflowNode[] = rfNodes.map((rfNode) => {
      const existing = activeWorkflow.nodes.find((n) => n.id === rfNode.id);
      return fromRFNode(rfNode, existing);
    });
    const edges: WorkflowEdge[] = rfEdges.map(fromRFEdge);

    return JSON.stringify({ ...activeWorkflow, nodes, edges }, null, 2);
  },
}));
