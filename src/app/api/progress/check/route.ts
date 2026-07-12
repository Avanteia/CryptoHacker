import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/access";
import { validateCode, type ValidationRule } from "@/lib/validate";
import { completeChapter } from "@/lib/gamification";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const { chapterId, code } = await req.json().catch(() => ({}));
  if (!chapterId || typeof code !== "string") {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { lesson: true },
  });
  if (!chapter) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

  if (chapter.lesson.isPremium && !(await hasProAccess(session.user.id))) {
    return NextResponse.json({ error: "ROOT_ACCESS_REQUIRED" }, { status: 403 });
  }

  if (chapter.kind === "QUIZ") {
    const correct = code.trim() === chapter.quizAnswer;
    if (!correct) {
      return NextResponse.json({
        ok: false,
        message: "ACCESS DENIED — that answer doesn't match our records.",
      });
    }
    const result = await completeChapter(session.user.id, chapterId, code);
    return NextResponse.json({ ok: true, ...result });
  }

  const rules = chapter.validationRules as unknown as ValidationRule[];
  const result = validateCode(code, rules);

  if (!result.ok) {
    return NextResponse.json({
      ok: false,
      message: result.message,
      line: result.line,
    });
  }

  await prisma.chapterProgress.upsert({
    where: { userId_chapterId: { userId: session.user.id, chapterId } },
    update: { code },
    create: { userId: session.user.id, chapterId, code },
  });

  const completion = await completeChapter(session.user.id, chapterId, code);
  return NextResponse.json({ ok: true, ...completion });
}
