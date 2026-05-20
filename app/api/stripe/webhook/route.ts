/**
 * POST /api/stripe/webhook
 * Receives Stripe events and updates subscription state.
 *
 * Required env: STRIPE_WEBHOOK_SECRET
 */
import { NextRequest, NextResponse } from "next/server";
import { getStripe, StripeNotConfiguredError } from "@/lib/stripe";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!WEBHOOK_SECRET) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET no configurado");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  const rawBody = await req.arrayBuffer();

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      signature,
      WEBHOOK_SECRET
    );
  } catch (err) {
    if (err instanceof StripeNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 501 });
    }
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("[Stripe Webhook] Error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan ?? "pro";
      const customerId = session.customer as string;
      console.log(`[Stripe] ✓ Checkout completado — Plan: ${plan}, Customer: ${customerId}`);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription updated — Status: ${sub.status}`);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[Stripe] Subscription canceled — Customer: ${sub.customer}`);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn(`[Stripe] Payment failed — Customer: ${invoice.customer}`);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Stripe] Payment succeeded — Amount: ${(invoice.amount_paid / 100).toFixed(2)}`);
      break;
    }
    default:
      console.log(`[Stripe Webhook] Unhandled: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
