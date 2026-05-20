/**
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for managing subscriptions.
 *
 * Body: { customerId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

interface PortalBody {
  customerId: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe no configurado" },
      { status: 501 }
    );
  }

  let body: PortalBody;
  try {
    body = (await req.json()) as PortalBody;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { customerId } = body;
  if (!customerId) {
    return NextResponse.json({ error: "customerId requerido" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/settings?section=billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 });
  }
}
