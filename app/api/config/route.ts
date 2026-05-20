/**
 * GET /api/config
 *
 * Returns which services are configured via environment variables.
 * NEVER exposes actual key values — only boolean flags.
 *
 * The client uses this to auto-detect production-ready services
 * without the user having to manually set keys in the Settings UI.
 */
import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    telegram:   !!process.env.TELEGRAM_BOT_TOKEN,
    openai:     !!process.env.OPENAI_API_KEY,
    openrouter: !!process.env.OPENROUTER_API_KEY,
    grok:       !!process.env.XAI_API_KEY,
    whatsapp:   !!(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_ID),
    email:      !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    stripe:     !!process.env.STRIPE_SECRET_KEY,
  };

  return NextResponse.json(config, {
    headers: {
      // Cache for 60s — env vars don't change at runtime
      "Cache-Control": "public, max-age=60, stale-while-revalidate=120",
    },
  });
}
