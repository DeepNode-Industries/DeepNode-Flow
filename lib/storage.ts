import type { Workflow, ExecutionLog, Settings, User, AuthSession, UserPlan } from "./types";
import { MOCK_WORKFLOWS, MOCK_EXECUTION_LOGS } from "./mock-data";

const KEYS = {
  WORKFLOWS: "dn_workflows",
  LOGS: "dn_execution_logs",
  SETTINGS: "dn_settings",
  USERS: "dn_users",
  SESSION: "dn_session",
};

/* ── helpers ──────────────────────────────────────────────────────── */
function encodePassword(plain: string): string {
  if (typeof btoa !== "undefined") return btoa(unescape(encodeURIComponent(plain)));
  return Buffer.from(plain).toString("base64");
}

function checkPassword(plain: string, hash: string): boolean {
  return encodePassword(plain) === hash;
}

function makeInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ── Demo user (always available) ────────────────────────────────── */
const DEMO_USER: User = {
  id: "user-demo",
  name: "Usuario Demo",
  email: "demo@deepnode.app",
  passwordHash: encodePassword("demo123"),
  plan: "enterprise",
  createdAt: "2025-01-01T00:00:00.000Z",
  initials: "UD",
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

/* ── Auth ─────────────────────────────────────────────────────────── */

function getUsers(): User[] {
  const stored = safeGet<User[] | null>(KEYS.USERS, null);
  return stored ?? [];
}

function saveUsers(users: User[]): void {
  safeSet(KEYS.USERS, users);
}

export type RegisterResult =
  | { ok: true; user: User }
  | { ok: false; error: string };

export function registerUser(
  name: string,
  email: string,
  password: string,
  plan: UserPlan = "starter"
): RegisterResult {
  const trimEmail = email.trim().toLowerCase();

  if (!name.trim()) return { ok: false, error: "El nombre es requerido." };
  if (!trimEmail.includes("@")) return { ok: false, error: "Email inválido." };
  if (password.length < 6) return { ok: false, error: "La contraseña debe tener al menos 6 caracteres." };

  // Check demo user
  if (trimEmail === DEMO_USER.email) {
    return { ok: false, error: "Este email ya está registrado." };
  }

  const users = getUsers();
  if (users.some((u) => u.email === trimEmail)) {
    return { ok: false, error: "Este email ya está registrado." };
  }

  const user: User = {
    id: `user-${Date.now()}`,
    name: name.trim(),
    email: trimEmail,
    passwordHash: encodePassword(password),
    plan,
    createdAt: new Date().toISOString(),
    initials: makeInitials(name.trim()),
  };

  saveUsers([...users, user]);
  return { ok: true, user };
}

export function loginUser(email: string, password: string): User | null {
  const trimEmail = email.trim().toLowerCase();

  // Demo user shortcut
  if (trimEmail === DEMO_USER.email && checkPassword(password, DEMO_USER.passwordHash)) {
    return DEMO_USER;
  }

  const users = getUsers();
  const user = users.find((u) => u.email === trimEmail);
  if (!user) return null;
  if (!checkPassword(password, user.passwordHash)) return null;
  return user;
}

export function getSession(): AuthSession | null {
  return safeGet<AuthSession | null>(KEYS.SESSION, null);
}

export function saveSession(session: AuthSession): void {
  safeSet(KEYS.SESSION, session);
}

export function clearSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS.SESSION);
}

/* ── Settings ─────────────────────────────────────────────────────── */
const DEFAULT_SETTINGS: Settings = {
  openaiKey: "",
  openrouterKey: "",
  xaiKey: "",
  telegramToken: "",
  telegramChatId: "",
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
