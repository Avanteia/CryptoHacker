import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRazorpay } from "@/lib/razorpay";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } });
  if (!sub?.razorpaySubscriptionId) {
    return NextResponse.json({ error: "NO_SUBSCRIPTION" }, { status: 404 });
  }

  await getRazorpay().subscriptions.cancel(sub.razorpaySubscriptionId, true);

  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: { cancelAtPeriodEnd: true },
  });

  return NextResponse.json({ ok: true });
}
