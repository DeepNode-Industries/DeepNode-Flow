/**
 * Telegram Bot Webhook receiver
 *
 * Register this URL with Telegram via:
 *   https://api.telegram.org/bot{TOKEN}/setWebhook?url=https://tudominio.com/api/webhooks/telegram
 *
 * Telegram will POST updates here whenever your bot receives a message.
 */

import { NextRequest, NextResponse } from "next/server";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
}

interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string;
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  channel_post?: TelegramMessage;
}

export async function POST(req: NextRequest) {
  try {
    const update = (await req.json()) as TelegramUpdate;

    const message = update.message ?? update.channel_post;

    if (message) {
      const chatId  = message.chat.id;
      const text    = message.text ?? "";
      const from    = message.from?.first_name ?? "Unknown";
      const userId  = message.from?.id;

      console.log(`[Telegram Webhook] Message from ${from} (${userId}) in chat ${chatId}: ${text}`);

      // ── Handle commands ─────────────────────────────────────────
      if (text.startsWith("/start")) {
        await sendReply(chatId, [
          "👋 <b>¡Hola!</b> Soy el bot de <b>DeepNode Flow</b>.",
          "",
          "🤖 Estoy conectado a tus workflows de automatización.",
          "",
          `📋 Tu <b>Chat ID</b> es: <code>${chatId}</code>`,
          "Copia este ID y pégalo en el nodo <b>Send Telegram</b> de tu workflow.",
        ].join("\n"));
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/id") || text.toLowerCase().includes("chat id")) {
        await sendReply(chatId, `🆔 Tu Chat ID es: <code>${chatId}</code>`);
        return NextResponse.json({ ok: true });
      }

      if (text.startsWith("/help")) {
        await sendReply(chatId, [
          "📚 <b>Comandos disponibles:</b>",
          "",
          "/start — Bienvenida y tu Chat ID",
          "/id    — Obtener tu Chat ID",
          "/help  — Esta ayuda",
          "",
          "🔗 <b>DeepNode Flow</b> — Plataforma de automatización con IA",
        ].join("\n"));
        return NextResponse.json({ ok: true });
      }
    }

    // Always return 200 to Telegram (avoid retries)
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Telegram Webhook] Error:", err);
    // Still return 200 to avoid Telegram retry storms
    return NextResponse.json({ ok: true });
  }
}

async function sendReply(chatId: number, text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    }),
  });
}

/** GET: quick verification endpoint */
export async function GET() {
  return NextResponse.json({
    status: "DeepNode Flow Telegram Webhook activo",
    timestamp: new Date().toISOString(),
  });
}
