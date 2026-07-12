import { prisma } from "@/lib/prisma";

/**
 * Prisma can't run in Next.js edge middleware, so the paywall gate is enforced
 * here at the data-access layer (every API route / server component that
 * serves premium content calls this) rather than in middleware.ts.
 */
export async function hasProAccess(userId: string | undefined | null): Promise<boolean> {
  if (!userId) return false;
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub) return false;
  if (sub.status !== "ACTIVE" && sub.status !== "PENDING") return false;
  if (sub.currentEnd && sub.currentEnd.getTime() < Date.now()) return false;
  return true;
}
