import { NextRequest, NextResponse } from "next/server";

const TELEGRAM_API = "https://api.telegram.org";

interface SendTelegramBody {
  chatId: string;
  message: string;
  parseMode?: "HTML" | "Markdown" | "None";
  disablePreview?: boolean;
  /** Override the bot token from env (for per-request keys) */
  botToken?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SendTelegramBody;
    const { chatId, message, parseMode = "HTML", disablePreview = false, botToken } = body;

    if (!chatId || !message) {
      return NextResponse.json(
        { error: "chatId y message son requeridos" },
        { status: 400 }
      );
    }

    const token = botToken ?? process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "TELEGRAM_BOT_TOKEN no configurado. Agrega tu Bot Token en Configuración." },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text: message,
      disable_web_page_preview: disablePreview,
    };

    if (parseMode !== "None") {
      payload.parse_mode = parseMode;
    }

    const res = await fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    interface TelegramResponse {
      ok: boolean;
      result?: { message_id: number; date: number };
      description?: string;
      error_code?: number;
    }

    const data = (await res.json()) as TelegramResponse;

    if (!data.ok) {
      return NextResponse.json(
        {
          error: data.description ?? "Error enviando mensaje a Telegram",
          errorCode: data.error_code,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      messageId: data.result?.message_id,
      sentAt: new Date(((data.result?.date ?? 0)) * 1000).toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
