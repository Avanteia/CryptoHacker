import Razorpay from "razorpay";

let cached: Razorpay | null = null;

/**
 * Lazily constructed: the Razorpay SDK throws in its constructor if key_id
 * is empty, and Next.js imports every route module during the build's
 * "collecting page data" step — so an eager instance at module scope
 * crashes the production build whenever Razorpay env vars aren't set yet.
 */
export function getRazorpay(): Razorpay {
  if (!cached) {
    cached = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID ?? "",
      key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
    });
  }
  return cached;
}

export const PLAN_CONFIG = {
  PRO_MONTHLY: { amount: 49900, interval: "monthly", period: "monthly" as const, intervalCount: 1, label: "Pro Monthly", priceLabel: "₹499/mo" },
  PRO_YEARLY: { amount: 499900, interval: "yearly", period: "yearly" as const, intervalCount: 1, label: "Pro Yearly", priceLabel: "₹4,999/yr" },
} as const;

export type PaidPlan = keyof typeof PLAN_CONFIG;
