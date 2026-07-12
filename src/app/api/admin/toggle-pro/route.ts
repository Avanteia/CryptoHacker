import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const { userId } = await req.json().catch(() => ({}));
  if (!userId) return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });

  const existing = await prisma.subscription.findUnique({ where: { userId } });
  const grantingPro = !existing || existing.status !== "ACTIVE";

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan: grantingPro ? "PRO_MONTHLY" : "FREE",
      status: grantingPro ? "ACTIVE" : "CANCELLED",
      currentEnd: grantingPro ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) : null,
    },
    create: {
      userId,
      plan: grantingPro ? "PRO_MONTHLY" : "FREE",
      status: grantingPro ? "ACTIVE" : "CANCELLED",
      currentEnd: grantingPro ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) : null,
    },
  });

  await prisma.adminAuditLog.create({
    data: {
      adminId: session.user.id,
      action: grantingPro ? "GRANT_PRO" : "REVOKE_PRO",
      target: userId,
    },
  });

  return NextResponse.json({ ok: true, grantedPro: grantingPro });
}
