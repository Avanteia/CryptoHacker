import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/access";
import ChapterPlayer from "@/components/lesson/ChapterPlayer";

export default async function ChapterPage({
  params,
}: {
  params: { slug: string; order: string };
}) {
  const session = await getServerSession(authOptions);
  const lesson = await prisma.lesson.findUnique({
    where: { slug: params.slug },
    include: { chapters: { orderBy: { order: "asc" } } },
  });
  if (!lesson) notFound();

  const orderNum = Number(params.order);
  const chapter = lesson.chapters.find((c) => c.order === orderNum);
  if (!chapter) notFound();

  if (lesson.isPremium) {
    if (!session?.user) redirect("/login");
    if (!(await hasProAccess(session.user.id))) redirect("/pricing");
  }

  let savedCode = chapter.starterCode;
  let completed = false;
  if (session?.user) {
    const progress = await prisma.chapterProgress.findUnique({
      where: { userId_chapterId: { userId: session.user.id, chapterId: chapter.id } },
    });
    if (progress) {
      savedCode = progress.code;
      completed = progress.completed;
    }
  }

  const total = lesson.chapters.length;
  const prevOrder = orderNum > 1 ? orderNum - 1 : null;
  const nextOrder = orderNum < total ? orderNum + 1 : null;

  return (
    <ChapterPlayer
      lessonSlug={lesson.slug}
      lessonTitle={lesson.title}
      chapter={{
        id: chapter.id,
        title: chapter.title,
        kind: chapter.kind,
        instructions: chapter.instructions,
        starterCode: savedCode,
        quizOptions: (chapter.quizOptions as string[] | null) ?? [],
      }}
      order={orderNum}
      total={total}
      prevOrder={prevOrder}
      nextOrder={nextOrder}
      initiallyCompleted={completed}
      isAuthenticated={!!session?.user}
    />
  );
}
