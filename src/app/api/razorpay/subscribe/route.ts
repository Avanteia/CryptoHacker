import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";
import type { Plan } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const { plan } = await req.json().catch(() => ({}));
  if (plan !== "PRO_MONTHLY" && plan !== "PRO_YEARLY") {
    return NextResponse.json({ error: "INVALID_PLAN" }, { status: 400 });
  }

  const razorpayPlan = await prisma.razorpayPlan.findUnique({ where: { plan: plan as Plan } });
  if (!razorpayPlan) {
    return NextResponse.json({ error: "PLAN_NOT_CONFIGURED" }, { status: 500 });
  }

  const rpSubscription = await getRazorpay().subscriptions.create({
    plan_id: razorpayPlan.razorpayId,
    customer_notify: 1,
    total_count: plan === "PRO_MONTHLY" ? 120 : 10,
    notes: { userId: session.user.id, plan },
  });

  await prisma.subscription.upsert({
    where: { userId: session.user.id },
    update: {
      plan: plan as Plan,
      status: "CREATED",
      razorpaySubscriptionId: rpSubscription.id,
    },
    create: {
      userId: session.user.id,
      plan: plan as Plan,
      status: "CREATED",
      razorpaySubscriptionId: rpSubscription.id,
    },
  });

  return NextResponse.json({
    subscriptionId: rpSubscription.id,
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });
}
