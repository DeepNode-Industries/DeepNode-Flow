import { NextRequest, NextResponse } from "next/server";

// Meta verifica el webhook con un GET al registrarlo
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp Webhook] Verificado correctamente");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Meta envía los mensajes entrantes con POST
export async function POST(req: NextRequest) {
  const body = await req.json();

  const entry = body.entry?.[0]?.changes?.[0]?.value;
  const message = entry?.messages?.[0];

  if (!message) {
    return NextResponse.json({ status: "no_message" });
  }

  const from = message.from as string;       // número del remitente ej: "5215512345678"
  const type = message.type as string;       // "text" | "image" | "audio" etc.
  const text = type === "text" ? (message.text?.body as string) : "";

  console.log(`[WhatsApp IN] De: ${from} | Tipo: ${type} | Texto: ${text}`);

  // Aquí puedes disparar un workflow de DeepNode Flow
  // Por ejemplo, llamar a tu motor de ejecución con los datos del mensaje:
  // await triggerWorkflow({ trigger: "whatsapp", from, text })

  // Siempre responde 200 a Meta (si tardas más de 20s, reintenta)
  return NextResponse.json({ status: "received" });
}
