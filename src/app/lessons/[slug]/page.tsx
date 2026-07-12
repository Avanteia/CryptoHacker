import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function LessonEntry({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: { chapters: { orderBy: { order: "asc" } } },
  });
  if (!lesson || lesson.chapters.length === 0) notFound();

  if (session?.user) {
    const progress = await prisma.chapterProgress.findMany({
      where: { userId: session.user.id, chapterId: { in: lesson.chapters.map((c) => c.id) }, completed: true },
      select: { chapterId: true },
    });
    const done = new Set(progress.map((p) => p.chapterId));
    const firstIncomplete = lesson.chapters.find((c) => !done.has(c.id));
    redirect(`/lessons/${lesson.slug}/${firstIncomplete?.order ?? lesson.chapters[0].order}`);
  }

  redirect(`/lessons/${lesson.slug}/${lesson.chapters[0].order}`);
}
