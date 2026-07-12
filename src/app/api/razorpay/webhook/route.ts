import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { SubscriptionStatus } from "@prisma/client";

const STATUS_MAP: Record<string, SubscriptionStatus> = {
  "subscription.activated": "ACTIVE",
  "subscription.charged": "ACTIVE",
  "subscription.completed": "COMPLETED",
  "subscription.cancelled": "CANCELLED",
  "subscription.halted": "HALTED",
  "subscription.pending": "PENDING",
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (!signature || signature !== expected) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const eventType: string = payload.event;
  const eventId: string =
    req.headers.get("x-razorpay-event-id") ??
    crypto.createHash("sha256").update(rawBody).digest("hex");

  const alreadyProcessed = await prisma.webhookEvent.findUnique({ where: { eventId } });
  if (alreadyProcessed) return NextResponse.json({ ok: true, deduped: true });

  await prisma.webhookEvent.create({
    data: { eventId, eventType, payload },
  });

  const subEntity = payload.payload?.subscription?.entity;
  const newStatus = STATUS_MAP[eventType];

  if (subEntity && newStatus) {
    const existing = await prisma.subscription.findUnique({
      where: { razorpaySubscriptionId: subEntity.id },
    });
    if (existing) {
      await prisma.subscription.update({
        where: { razorpaySubscriptionId: subEntity.id },
        data: {
          status: newStatus,
          currentStart: subEntity.current_start ? new Date(subEntity.current_start * 1000) : existing.currentStart,
          currentEnd: subEntity.current_end ? new Date(subEntity.current_end * 1000) : existing.currentEnd,
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}
