/**
 * DeepNode Flow — Stripe lazy singleton
 *
 * IMPORTANT: Stripe is initialized lazily (only when getStripe() is called
 * inside an API route handler). This prevents build-time crashes when
 * STRIPE_SECRET_KEY is not set in the environment.
 *
 * Never import `stripe` as a module-level constant — always call getStripe().
 */
import Stripe from "stripe";

const globalForStripe = global as typeof global & { _stripe?: Stripe };

/**
 * Returns the Stripe singleton. Throws a clear 501 error if the secret key
 * is not configured, so route handlers can return a proper response.
 */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new StripeNotConfiguredError(
      "STRIPE_SECRET_KEY no está configurado. Agrégalo en las variables de entorno."
    );
  }

  if (!globalForStripe._stripe) {
    globalForStripe._stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }

  return globalForStripe._stripe;
}

/** Sentinel error used by route handlers to return HTTP 501 */
export class StripeNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeNotConfiguredError";
  }
}

/** Resolve Stripe Price ID from plan + interval */
export function getStripePriceId(
  plan: "pro" | "business",
  interval: "monthly" | "annual"
): string | null {
  const map: Record<string, string | undefined> = {
    "pro_monthly":      process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    "pro_annual":       process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
    "business_monthly": process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
    "business_annual":  process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID,
  };
  return map[`${plan}_${interval}`] ?? null;
}
