/**
 * DeepNode Flow — Unified AI Provider Route
 *
 * Single endpoint that handles all OpenAI-compatible providers:
 * OpenAI, OpenRouter, and Grok (xAI).
 *
 * POST /api/ai
 * Body: { provider, model, messages, maxTokens?, temperature?, stream? }
 */

import { NextRequest, NextResponse } from "next/server";
import type { AIProvider } from "@/lib/types";

interface ProviderConfig {
  baseUrl: string;
  envKey: string;
  models: Record<string, string>;
}

/** Map of supported providers → OpenAI-compatible config */
const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  openai: {
    baseUrl: "https://api.openai.com/v1",
    envKey: "OPENAI_API_KEY",
    models: {
      "gpt-4o-mini": "gpt-4o-mini",
      "gpt-4o": "gpt-4o",
      "gpt-4-turbo": "gpt-4-turbo",
    },
  },
  openrouter: {
    baseUrl: "https://openrouter.ai/api/v1",
    envKey: "OPENROUTER_API_KEY",
    models: {
      "llama-3.3-70b": "meta-llama/llama-3.3-70b-instruct",
      "claude-3-5-sonnet": "anthropic/claude-3.5-sonnet",
      "gemini-2-flash": "google/gemini-2.0-flash-exp:free",
      "mixtral-8x7b": "mistralai/mixtral-8x7b-instruct",
    },
  },
  grok: {
    baseUrl: "https://api.x.ai/v1",
    envKey: "XAI_API_KEY",
    models: {
      "grok-3-mini": "grok-3-mini",   // fast, free tier
      "grok-3": "grok-3",             // most capable
      "grok-vision": "grok-2-vision-1212", // multimodal
    },
  },
};

interface AIRequestBody {
  provider: AIProvider;
  model: string;
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  maxTokens?: number;
  temperature?: number;
}

export async function POST(req: NextRequest) {
  let body: AIRequestBody;

  try {
    body = (await req.json()) as AIRequestBody;
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición inválido" }, { status: 400 });
  }

  const { provider, model, messages, maxTokens = 500, temperature = 0.7 } = body;

  // Validate provider
  const providerConfig = PROVIDERS[provider];
  if (!providerConfig) {
    return NextResponse.json(
      { error: `Provider desconocido: "${provider}". Disponibles: ${Object.keys(PROVIDERS).join(", ")}` },
      { status: 400 }
    );
  }

  // Resolve API key from environment
  const apiKey = process.env[providerConfig.envKey];
  if (!apiKey) {
    return NextResponse.json(
      {
        error: `API key no configurada para provider "${provider}". Agrega ${providerConfig.envKey} en .env.local`,
        envKey: providerConfig.envKey,
      },
      { status: 401 }
    );
  }

  // Resolve model alias → actual model name
  const resolvedModel = providerConfig.models[model] ?? model;

  // Call the OpenAI-compatible endpoint
  let response: Response;
  try {
    response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // OpenRouter requires these headers for rate-limit tracking
        ...(provider === "openrouter"
          ? {
              "HTTP-Referer": "https://deepnode.app",
              "X-Title": "DeepNode Flow",
            }
          : {}),
      },
      body: JSON.stringify({
        model: resolvedModel,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error de red";
    return NextResponse.json({ error: `Error conectando con ${provider}: ${message}` }, { status: 502 });
  }

  if (!response.ok) {
    let errorDetail = `HTTP ${response.status}`;
    try {
      const errBody = (await response.json()) as { error?: { message?: string } };
      errorDetail = errBody.error?.message ?? errorDetail;
    } catch {
      // ignore parse error
    }
    return NextResponse.json(
      { error: `${provider} API error: ${errorDetail}` },
      { status: response.status }
    );
  }

  interface ChatCompletionResponse {
    choices: Array<{ message: { content: string } }>;
    usage?: { total_tokens?: number; completion_tokens?: number };
    model?: string;
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content ?? "";
  const tokens = data.usage?.total_tokens ?? data.usage?.completion_tokens ?? 0;

  return NextResponse.json({
    response: content,
    tokens,
    model: resolvedModel,
    provider,
  });
}
