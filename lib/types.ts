export type NodeCategory = "trigger" | "ai" | "action" | "logic";

export type NodeStatus = "pending" | "running" | "success" | "error" | "skipped";

export type WorkflowStatus = "active" | "inactive" | "draft";

export interface NodeConfig {
  [key: string]: string | number | boolean | string[];
}

export interface WorkflowNode {
  id: string;
  type: string;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  position: { x: number; y: number };
  config: NodeConfig;
  status?: NodeStatus;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
  executionCount: number;
  tags: string[];
}

export interface ExecutionLog {
  id: string;
  workflowId: string;
  workflowName: string;
  startedAt: string;
  finishedAt?: string;
  status: "running" | "success" | "error";
  steps: ExecutionStep[];
  duration?: number;
}

export interface ExecutionStep {
  nodeId: string;
  nodeLabel: string;
  status: NodeStatus;
  message: string;
  timestamp: string;
  output?: Record<string, unknown>;
}

export interface NodeDefinition {
  type: string;
  category: NodeCategory;
  label: string;
  description: string;
  icon: string;
  color: string;
  accentColor: string;
  defaultConfig: NodeConfig;
  configFields: ConfigField[];
}

export interface ConfigField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "boolean" | "json";
  placeholder?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  status: "connected" | "disconnected" | "error";
  icon: string;
  color: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  nodeCount: number;
  icon: string;
  color: string;
  workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt" | "executionCount">;
}

/** AI provider identifier used across nodes and the unified AI route */
export type AIProvider = "openai" | "openrouter" | "grok";

/* ── Auth types ─────────────────────────────────────────────────── */

export type UserPlan = "starter" | "business" | "enterprise";

export interface User {
  id: string;
  name: string;
  email: string;
  /** base64-encoded password — client-side demo only, not for production */
  passwordHash: string;
  plan: UserPlan;
  createdAt: string;
  initials: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  email: string;
  plan: UserPlan;
  initials: string;
  loginAt: string;
}

export interface Settings {
  openaiKey: string;
  openrouterKey: string;
  /** xAI API key — used for Grok models (grok-3-mini, grok-3, grok-2-vision-1212) */
  xaiKey: string;
  /** Telegram Bot Token — from @BotFather (format: 123456789:ABCdef...) */
  telegramToken: string;
  /** Default Telegram Chat ID for nodes that don't specify one */
  telegramChatId: string;
  whatsappToken: string;
  whatsappPhoneId: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  webhookBaseUrl: string;
  mode: "demo" | "production";
}
