import type { Workflow, ExecutionLog, Settings } from "./types";
import { MOCK_WORKFLOWS, MOCK_EXECUTION_LOGS } from "./mock-data";

const KEYS = {
  WORKFLOWS: "dn_workflows",
  LOGS: "dn_execution_logs",
  SETTINGS: "dn_settings",
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeGet<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

// Workflows
export function getWorkflows(): Workflow[] {
  const stored = safeGet<Workflow[] | null>(KEYS.WORKFLOWS, null);
  if (!stored || stored.length === 0) {
    safeSet(KEYS.WORKFLOWS, MOCK_WORKFLOWS);
    return MOCK_WORKFLOWS;
  }
  return stored;
}

export function getWorkflow(id: string): Workflow | undefined {
  return getWorkflows().find((w) => w.id === id);
}

export function saveWorkflow(workflow: Workflow): void {
  const workflows = getWorkflows();
  const idx = workflows.findIndex((w) => w.id === workflow.id);
  if (idx >= 0) {
    workflows[idx] = { ...workflow, updatedAt: new Date().toISOString() };
  } else {
    workflows.push(workflow);
  }
  safeSet(KEYS.WORKFLOWS, workflows);
}

export function deleteWorkflow(id: string): void {
  const workflows = getWorkflows().filter((w) => w.id !== id);
  safeSet(KEYS.WORKFLOWS, workflows);
}

export function duplicateWorkflow(id: string): Workflow | null {
  const original = getWorkflow(id);
  if (!original) return null;
  const copy: Workflow = {
    ...original,
    id: `wf-${Date.now()}`,
    name: `${original.name} (copia)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    executionCount: 0,
    lastExecutedAt: undefined,
    status: "draft",
  };
  saveWorkflow(copy);
  return copy;
}

// Execution Logs
export function getExecutionLogs(): ExecutionLog[] {
  const stored = safeGet<ExecutionLog[] | null>(KEYS.LOGS, null);
  if (!stored || stored.length === 0) {
    safeSet(KEYS.LOGS, MOCK_EXECUTION_LOGS);
    return MOCK_EXECUTION_LOGS;
  }
  return stored;
}

export function saveExecutionLog(log: ExecutionLog): void {
  const logs = getExecutionLogs();
  logs.unshift(log);
  const trimmed = logs.slice(0, 100);
  safeSet(KEYS.LOGS, trimmed);
}

// Settings
const DEFAULT_SETTINGS: Settings = {
  openaiKey: "",
  openrouterKey: "",
  whatsappToken: "",
  whatsappPhoneId: "",
  smtpHost: "",
  smtpPort: "587",
  smtpUser: "",
  smtpPass: "",
  webhookBaseUrl: "https://deepnode.app/webhooks",
  mode: "demo",
};

export function getSettings(): Settings {
  return safeGet<Settings>(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveSettings(settings: Settings): void {
  safeSet(KEYS.SETTINGS, settings);
}
