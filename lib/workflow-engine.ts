import type { Workflow, ExecutionLog, ExecutionStep, NodeStatus, NodeConfig } from "./types";
import { saveExecutionLog, saveWorkflow, getWorkflow } from "./storage";

/* ── Server config cache (fetched once per session) ─────────────── */
interface ServerConfig {
  telegram: boolean;
  openai: boolean;
  openrouter: boolean;
  grok: boolean;
  whatsapp: boolean;
  email: boolean;
  stripe: boolean;
}

let _serverConfig: ServerConfig | null = null;

async function getServerConfig(): Promise<ServerConfig> {
  if (_serverConfig) return _serverConfig;
  try {
    const res = await fetch("/api/config");
    if (res.ok) {
      _serverConfig = (await res.json()) as ServerConfig;
      return _serverConfig;
    }
  } catch {
    // ignore — fall back to all-false
  }
  return {
    telegram: false, openai: false, openrouter: false,
    grok: false, whatsapp: false, email: false, stripe: false,
  };
}

/** Call this after saving new env vars to force a refresh */
export function invalidateServerConfig() {
  _serverConfig = null;
}

// ─── Shared result type ───────────────────────────────────────────────────

interface NodeExecutionResult {
  success: boolean;
  output: Record<string, unknown>;
  log: string;
}

function simulateGrokChat(prompt: string): NodeExecutionResult {
  const excerpt = prompt.substring(0, 40);
  return {
    success: true,
    output: {
      response: `[Grok Demo] Respuesta simulada para: "${excerpt}..."`,
      tokens: 64,
    },
    log: "[Grok AI Demo] Respuesta simulada (64 tokens)",
  };
}

// ─── Telegram executor (production) ──────────────────────────────────────

async function executeTelegramNode(config: NodeConfig): Promise<NodeExecutionResult> {
  const chatId       = String(config.chatId ?? "");
  const message      = String(config.message ?? "Mensaje desde DeepNode Flow");
  const parseMode    = String(config.parseMode ?? "HTML");
  const disablePreview = config.disablePreview === "true";

  if (!chatId) {
    return {
      success: false,
      output: { error: "Chat ID no configurado" },
      log: "[Telegram] Error: Chat ID requerido",
    };
  }

  const res = await fetch("/api/send-telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message, parseMode, disablePreview }),
  });

  interface TelegramResult { ok?: boolean; messageId?: number; error?: string }
  const data = (await res.json()) as TelegramResult;

  if (!res.ok || !data.ok) {
    return {
      success: false,
      output: { error: data.error },
      log: `[Telegram] Error: ${data.error ?? "Fallo al enviar"}`,
    };
  }

  return {
    success: true,
    output: { messageId: data.messageId, chatId },
    log: `[Telegram] ✓ Mensaje enviado al chat ${chatId} (ID: ${data.messageId})`,
  };
}

// ─── Unified AI node executor (production) ────────────────────────────────

async function executeAINode(
  nodeType: string,
  config: NodeConfig
): Promise<NodeExecutionResult> {
  const provider = String(config.provider ?? "grok");
  const model = String(config.model ?? "grok-3-mini");
  const prompt = String(config.prompt ?? config.systemPrompt ?? "");
  const maxTokens = Number(config.maxTokens ?? 500);
  const temperature = Number(config.temperature ?? 0.7);
  const systemPrompt =
    nodeType === "grok-chat"
      ? String(config.systemPrompt ?? "Eres un asistente útil dentro de DeepNode Flow.")
      : "Eres un asistente empresarial.";

  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      provider,
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      maxTokens,
      temperature,
    }),
  });

  interface AIResponse { response?: string; tokens?: number; error?: string }
  const data = (await res.json()) as AIResponse;

  if (!res.ok || data.error) {
    return { success: false, output: { error: data.error }, log: `[Grok AI] Error: ${data.error}` };
  }

  return {
    success: true,
    output: { response: data.response ?? "", tokens: data.tokens ?? 0 },
    log: `[Grok AI] Respuesta generada (${data.tokens ?? 0} tokens)`,
  };
}

export type ExecutionCallback = (log: ExecutionLog) => void;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId(): string {
  return `exec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

// Topology sort — returns node IDs in execution order
function getExecutionOrder(workflow: Workflow): string[] {
  const { nodes, edges } = workflow;
  const inDegree = new Map<string, number>();
  const adjacency = new Map<string, string[]>();

  for (const node of nodes) {
    inDegree.set(node.id, 0);
    adjacency.set(node.id, []);
  }
  for (const edge of edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    const adj = adjacency.get(edge.source) ?? [];
    adj.push(edge.target);
    adjacency.set(edge.source, adj);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree.entries()) {
    if (deg === 0) queue.push(id);
  }

  const order: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);
    for (const neighbor of adjacency.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  // Include any remaining (disconnected) nodes
  for (const node of nodes) {
    if (!order.includes(node.id)) order.push(node.id);
  }

  return order;
}

// Execute a single node — auto-detects real vs simulation from server config
async function simulateNode(
  nodeId: string,
  nodeType: string,
  nodeLabel: string,
  nodeConfig: NodeConfig,
  onStep: (step: ExecutionStep) => void
): Promise<ExecutionStep> {
  const delay = 400 + Math.random() * 800;
  await sleep(delay);

  // Fetch which services are configured server-side (env vars).
  // This is cached after the first call, so it's fast.
  const serverConfig = await getServerConfig();

  // ── Send Telegram ────────────────────────────────────────────────
  if (nodeType === "send-telegram") {
    let result: NodeExecutionResult;

    if (serverConfig.telegram) {
      // Real API call — TELEGRAM_BOT_TOKEN is set in env
      try {
        result = await executeTelegramNode(nodeConfig);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        result = { success: false, output: { error: msg }, log: `[Telegram] Error: ${msg}` };
      }
    } else {
      // No token configured → simulate
      const chatId = String(nodeConfig.chatId ?? "@mi_canal");
      result = {
        success: true,
        output: { messageId: Math.floor(Math.random() * 9000) + 1000, chatId },
        log: `[Telegram Demo] ✓ Mensaje simulado enviado a ${chatId}`,
      };
    }

    const step: ExecutionStep = {
      nodeId, nodeLabel,
      status: result.success ? "success" : "error",
      message: result.log,
      timestamp: nowISO(),
      output: result.success ? result.output : undefined,
    };
    onStep(step);
    return step;
  }

  // ── Grok / AI nodes ──────────────────────────────────────────────
  if (nodeType === "grok-chat") {
    const hasAI = serverConfig.grok || serverConfig.openai || serverConfig.openrouter;
    let result: NodeExecutionResult;

    if (hasAI) {
      try {
        result = await executeAINode(nodeType, nodeConfig);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        result = { success: false, output: { error: msg }, log: `[Grok AI] Error: ${msg}` };
      }
    } else {
      const prompt = String(nodeConfig.prompt ?? nodeConfig.systemPrompt ?? "");
      result = simulateGrokChat(prompt);
    }

    const step: ExecutionStep = {
      nodeId, nodeLabel,
      status: result.success ? "success" : "error",
      message: result.log,
      timestamp: nowISO(),
      output: result.success ? result.output : undefined,
    };
    onStep(step);
    return step;
  }

  // ── All other nodes: standard simulation ─────────────────────────
  const step = buildSimulatedStep(nodeId, nodeType, nodeLabel);
  onStep(step);
  return step;
}

function buildSimulatedStep(nodeId: string, nodeType: string, nodeLabel: string): ExecutionStep {
  const ts = nowISO();
  const successChance = 0.92;
  const isError = Math.random() > successChance;

  const messages: Record<string, string[]> = {
    "manual-trigger": ["Flujo iniciado manualmente", "Trigger activado por el usuario"],
    "webhook": ["Petición HTTP recibida correctamente", "Webhook activado — payload parseado"],
    "schedule": ["Cron ejecutado según programación", "Trigger de horario activado"],
    "form-submission": ["Formulario recibido y validado", "Datos del formulario procesados"],
    "ai-text-generator": ["Texto generado exitosamente con GPT-4o", "Respuesta IA generada en 1.4s"],
    "ai-classifier": [
      "Clasificado como lead_caliente (94% confianza)",
      "Texto clasificado: categoría premium",
      "Clasificación completada: interés_alto",
    ],
    "ai-summarizer": ["Texto resumido en 3 puntos clave", "Resumen generado (198 tokens)"],
    "ai-json-extractor": [
      "Datos extraídos: {nombre, email, teléfono}",
      "JSON extraído exitosamente del documento",
    ],
    "ai-agent": ["Agente ejecutó 3 pasos y generó respuesta", "AI Agent completó la tarea en 2.1s"],
    "grok-chat": [
      "[Grok AI] Respuesta generada (64 tokens)",
      "[Grok AI] grok-3-mini respondió en 0.8s",
      "[Grok AI] Conversación completada exitosamente",
    ],
    "http-request": ["HTTP 200 OK — Respuesta recibida de API externa", "API respondió en 340ms con datos"],
    "send-email": ["Email enviado a cliente@empresa.com", "Correo entregado correctamente"],
    "send-whatsapp": ["Mensaje WhatsApp enviado (+52 55 XXXX XXXX)", "WhatsApp entregado exitosamente"],
    "send-telegram": [
      "[Telegram Demo] ✓ Mensaje enviado al chat @mi_canal (ID: 4821)",
      "[Telegram Demo] ✓ Mensaje entregado en 0.3s",
      "[Telegram Demo] ✓ Bot envió notificación al grupo",
    ],
    "save-to-crm": ["Lead guardado en HubSpot (ID: hs_29847)", "Contacto creado/actualizado en CRM"],
    "save-to-sheets": ["Fila agregada a Google Sheets (row 142)", "Datos guardados en spreadsheet"],
    "database-query": ["Consulta ejecutada — 23 registros recuperados", "Query completada en 45ms"],
    "notification": ["Notificación push enviada al dispositivo", "Notificación entregada correctamente"],
    "if-condition": ["Condición evaluada: TRUE — rama Si activada", "Condición evaluada: FALSE — rama No activada"],
    "delay": ["Pausa de 5 segundos completada", "Delay finalizado"],
    "loop": ["Iteración sobre 8 elementos completada", "Loop completado — 8/8 elementos procesados"],
    "transform-data": ["Datos transformados y mapeados", "Transformación completada — 5 campos mapeados"],
  };

  const possibleMessages = messages[nodeType] ?? [`${nodeLabel} ejecutado correctamente`];
  const message = isError
    ? `Error en ${nodeLabel}: timeout de conexión (503)`
    : possibleMessages[Math.floor(Math.random() * possibleMessages.length)];

  return {
    nodeId,
    nodeLabel,
    status: isError ? "error" : "success",
    message,
    timestamp: ts,
    output: isError ? undefined : { nodeType, processed: true },
  };
}

export async function executeWorkflow(
  workflowId: string,
  onUpdate: ExecutionCallback
): Promise<ExecutionLog> {
  const workflow = getWorkflow(workflowId);
  if (!workflow) {
    throw new Error(`Workflow ${workflowId} no encontrado`);
  }

  const logId = generateId();
  const startedAt = nowISO();

  const log: ExecutionLog = {
    id: logId,
    workflowId,
    workflowName: workflow.name,
    startedAt,
    status: "running",
    steps: [],
  };

  onUpdate({ ...log });

  const order = getExecutionOrder(workflow);
  let hasError = false;

  for (const nodeId of order) {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    if (hasError) {
      const skipped: ExecutionStep = {
        nodeId,
        nodeLabel: node.label,
        status: "skipped",
        message: `${node.label} omitido por error previo`,
        timestamp: nowISO(),
      };
      log.steps.push(skipped);
      onUpdate({ ...log, steps: [...log.steps] });
      continue;
    }

    const step = await simulateNode(nodeId, node.type, node.label, node.config, (s) => {
      const updatedSteps = [...log.steps, s];
      onUpdate({ ...log, steps: updatedSteps });
    });

    log.steps.push(step);
    if (step.status === "error") hasError = true;
    onUpdate({ ...log, steps: [...log.steps] });
  }

  const finishedAt = nowISO();
  const duration = new Date(finishedAt).getTime() - new Date(startedAt).getTime();

  const finalLog: ExecutionLog = {
    ...log,
    finishedAt,
    status: hasError ? "error" : "success",
    duration,
  };

  // Update workflow stats
  const updatedWorkflow: Workflow = {
    ...workflow,
    lastExecutedAt: finishedAt,
    executionCount: workflow.executionCount + 1,
  };
  saveWorkflow(updatedWorkflow);
  saveExecutionLog(finalLog);

  return finalLog;
}

export function buildEmptyWorkflow(name = "Nuevo Workflow"): Workflow {
  const now = new Date().toISOString();
  return {
    id: `wf-${Date.now()}`,
    name,
    description: "",
    status: "draft",
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
    executionCount: 0,
    tags: [],
  };
}
