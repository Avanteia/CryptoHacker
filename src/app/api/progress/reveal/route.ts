import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/access";

const ANSWER_COST_XP = 15;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const { chapterId, kind } = await req.json().catch(() => ({}));
  if (!chapterId || (kind !== "hint" && kind !== "answer")) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const chapter = await prisma.chapter.findUnique({ where: { id: chapterId }, include: { lesson: true } });
  if (!chapter) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (chapter.lesson.isPremium && !(await hasProAccess(session.user.id))) {
    return NextResponse.json({ error: "ROOT_ACCESS_REQUIRED" }, { status: 403 });
  }

  if (kind === "hint") {
    await prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId: session.user.id, chapterId } },
      update: { usedHint: true },
      create: { userId: session.user.id, chapterId, code: chapter.starterCode, usedHint: true },
    });
    return NextResponse.json({ hint: chapter.hint });
  }

  const existing = await prisma.chapterProgress.findUnique({
    where: { userId_chapterId: { userId: session.user.id, chapterId } },
  });

  let xpSpent = 0;
  if (!existing?.usedAnswer) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
    xpSpent = Math.min(ANSWER_COST_XP, user.xp);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { xp: { decrement: xpSpent } },
    });
    await prisma.chapterProgress.upsert({
      where: { userId_chapterId: { userId: session.user.id, chapterId } },
      update: { usedAnswer: true },
      create: { userId: session.user.id, chapterId, code: chapter.starterCode, usedAnswer: true },
    });
  }

  return NextResponse.json({ answer: chapter.solutionCode, xpSpent });
}
