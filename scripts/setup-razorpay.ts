/**
 * One-time setup: creates the Pro Monthly / Pro Yearly plans on Razorpay
 * (if they don't already exist) and stores their plan IDs locally so
 * checkout can reference them. Run with `npm run setup:razorpay`.
 */
import { PrismaClient } from "@prisma/client";
import { getRazorpay, PLAN_CONFIG } from "../src/lib/razorpay";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env before running this script.");
    process.exit(1);
  }

  for (const [plan, config] of Object.entries(PLAN_CONFIG) as [keyof typeof PLAN_CONFIG, (typeof PLAN_CONFIG)[keyof typeof PLAN_CONFIG]][]) {
    const existing = await prisma.razorpayPlan.findUnique({ where: { plan } });
    if (existing) {
      console.log(`${plan} already set up (razorpayId=${existing.razorpayId})`);
      continue;
    }

    const created = await getRazorpay().plans.create({
      period: config.period,
      interval: config.intervalCount,
      item: {
        name: config.label,
        amount: config.amount,
        currency: "INR",
        description: `CryptoHacker ${config.label} subscription`,
      },
    });

    await prisma.razorpayPlan.create({
      data: {
        plan,
        razorpayId: created.id,
        amount: config.amount,
        interval: config.interval,
      },
    });

    console.log(`Created Razorpay plan for ${plan}: ${created.id}`);
  }

  console.log("Razorpay setup complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
