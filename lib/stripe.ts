/**
 * DeepNode Flow — Stripe server-side singleton
 * Only imported in API routes (server-side), never in client components.
 */
import Stripe from "stripe";

// Singleton — avoids creating multiple Stripe instances in dev hot-reload
const globalForStripe = global as typeof global & { _stripe?: Stripe };

export const stripe: Stripe = globalForStripe._stripe ?? new Stripe(
  process.env.STRIPE_SECRET_KEY ?? "",
  {
    apiVersion: "2026-04-22.dahlia",
    typescript: true,
  }
);

if (process.env.NODE_ENV !== "production") {
  globalForStripe._stripe = stripe;
}

/** Resolve Stripe Price ID from plan + interval */
export function getStripePriceId(
  plan: "pro" | "business",
  interval: "monthly" | "annual"
): string | null {
  const map: Record<string, string | undefined> = {
    "pro_monthly":       process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    "pro_annual":        process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    "business_monthly":  process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    "business_annual":   process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID,
  };
  return map[`${plan}_${interval}`] ?? null;
}
