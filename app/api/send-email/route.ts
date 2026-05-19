import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { to, subject, body } = await req.json();

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ?? "587";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return NextResponse.json(
      { error: "SMTP no configurado. Agrega SMTP_HOST, SMTP_USER y SMTP_PASS en .env.local" },
      { status: 500 }
    );
  }

  // Para usar nodemailer, instala: npm install nodemailer @types/nodemailer
  // Luego descomenta este bloque:

  /*
  const nodemailer = await import("nodemailer");

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject,
    html: body,
  });
  */

  // Simulación hasta que instales nodemailer:
  console.log(`[EMAIL] Para: ${to} | Asunto: ${subject}`);
  void port;

  return NextResponse.json({ success: true, to, subject });
}
