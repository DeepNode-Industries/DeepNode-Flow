/**
 * POST /api/stripe/portal
 * Creates a Stripe Customer Portal session for managing subscriptions.
 *
 * Body: { customerId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { getStripe, StripeNotConfiguredError } from "@/lib/stripe";

interface PortalBody {
  customerId: string;
}

export async function POST(req: NextRequest) {
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepnode-flow.vercel.app";

  try {
    const stripe = getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/settings?section=billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    if (err instanceof StripeNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 });
  }
}
