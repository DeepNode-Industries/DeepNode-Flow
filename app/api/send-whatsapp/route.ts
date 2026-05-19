import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { to, message } = await req.json();

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    return NextResponse.json(
      { error: "WhatsApp no configurado. Agrega WHATSAPP_TOKEN y WHATSAPP_PHONE_ID en .env.local" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${phoneId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ""), // solo dígitos
        type: "text",
        text: { body: message },
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.error?.message ?? "Error enviando WhatsApp" }, { status: 400 });
  }

  return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });
}
