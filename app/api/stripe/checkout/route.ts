/**
 * POST /api/stripe/checkout
 * Creates a Stripe Checkout Session and returns the redirect URL.
 *
 * Body: { plan: "pro" | "business", interval: "monthly" | "annual", email?: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { getStripe, getStripePriceId, StripeNotConfiguredError } from "@/lib/stripe";

interface CheckoutBody {
  plan: "pro" | "business";
  interval: "monthly" | "annual";
  email?: string;
}

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = (await req.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const { plan, interval, email } = body;

  if (!["pro", "business"].includes(plan)) {
    return NextResponse.json({ error: "Plan inválido" }, { status: 400 });
  }

  const priceId = getStripePriceId(plan, interval);
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Price ID no configurado para ${plan}/${interval}. Agrega STRIPE_${plan.toUpperCase()}_${interval.toUpperCase()}_PRICE_ID en las variables de entorno.`,
      },
      { status: 501 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://deepnode-flow.vercel.app";

  try {
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(email ? { customer_email: email } : {}),
      success_url: `${baseUrl}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${baseUrl}/pricing?payment=canceled`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { plan, interval, source: "deepnode-flow" },
      },
      metadata: { plan, interval },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    if (err instanceof StripeNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: `Stripe error: ${message}` }, { status: 500 });
  }
}
