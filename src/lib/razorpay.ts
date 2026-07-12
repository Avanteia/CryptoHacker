import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? "",
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
});

export const PLAN_CONFIG = {
  PRO_MONTHLY: { amount: 49900, interval: "monthly", period: "monthly" as const, intervalCount: 1, label: "Pro Monthly", priceLabel: "₹499/mo" },
  PRO_YEARLY: { amount: 499900, interval: "yearly", period: "yearly" as const, intervalCount: 1, label: "Pro Yearly", priceLabel: "₹4,999/yr" },
} as const;

export type PaidPlan = keyof typeof PLAN_CONFIG;
