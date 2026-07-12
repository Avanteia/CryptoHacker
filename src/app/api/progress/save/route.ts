import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/access";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const { chapterId, code } = await req.json().catch(() => ({}));
  if (!chapterId || typeof code !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const chapter = await prisma.chapter.findUnique({
    include: { lesson: true },
    where: { id: chapterId },
  });
  if (!chapter) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (chapter.lesson.isPremium && !(await hasProAccess(session.user.id))) {
    return NextResponse.json({ error: "ROOT_ACCESS_REQUIRED" }, { status: 403 });
  }

  await prisma.chapterProgress.upsert({
    where: { userId_chapterId: { userId: session.user.id, chapterId } },
    update: { code },
    create: { userId: session.user.id, chapterId, code },
  });

  return NextResponse.json({ ok: true });
}
