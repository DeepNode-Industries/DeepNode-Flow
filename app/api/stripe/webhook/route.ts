/**
 * POST /api/stripe/webhook
 * Receives Stripe events and updates subscription state.
 *
 * Required env: STRIPE_WEBHOOK_SECRET
 */
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

// In Next.js App Router, request body is NOT auto-parsed in route handlers.
// We read raw bytes manually via req.arrayBuffer() below.

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET no configurado");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  const rawBody = await req.arrayBuffer();

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      signature,
      WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("[Stripe Webhook] Signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Event received: ${event.type}`);

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = session.metadata?.plan ?? "pro";
      const interval = session.metadata?.interval ?? "monthly";
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      console.log(`[Stripe] ✓ Checkout completado — Plan: ${plan}, Customer: ${customerId}`);

      // In a real app with a database, update the user's subscription here.
      // Since we use localStorage client-side, we rely on the success redirect URL
      // and the client reading query params to update the subscription state.
      // The metadata is passed via success_url: ?plan=pro

      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const plan = (sub.metadata?.plan ?? "pro") as string;
      console.log(`[Stripe] Subscription updated — Plan: ${plan}, Status: ${sub.status}`);
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
      console.log(`[Stripe] Payment succeeded — Customer: ${invoice.customer}, Amount: ${invoice.amount_paid / 100}`);
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
