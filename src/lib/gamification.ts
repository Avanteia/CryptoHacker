import { prisma } from "@/lib/prisma";

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isYesterday(a: Date, b: Date) {
  const d = new Date(b);
  d.setDate(d.getDate() - 1);
  return isSameDay(a, d);
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const now = new Date();

  if (user.lastActiveDate && isSameDay(user.lastActiveDate, now)) {
    return { currentStreak: user.currentStreak, longestStreak: user.longestStreak };
  }

  const continued = user.lastActiveDate ? isYesterday(user.lastActiveDate, now) : false;
  const currentStreak = continued ? user.currentStreak + 1 : 1;
  const longestStreak = Math.max(currentStreak, user.longestStreak);

  await prisma.user.update({
    where: { id: userId },
    data: { currentStreak, longestStreak, lastActiveDate: now },
  });

  return { currentStreak, longestStreak };
}

export async function completeChapter(userId: string, chapterId: string, code: string) {
  const chapter = await prisma.chapter.findUniqueOrThrow({
    where: { id: chapterId },
    include: { lesson: { include: { chapters: true } } },
  });

  const existing = await prisma.chapterProgress.findUnique({
    where: { userId_chapterId: { userId, chapterId } },
  });
  const alreadyCompleted = existing?.completed ?? false;

  await prisma.chapterProgress.upsert({
    where: { userId_chapterId: { userId, chapterId } },
    update: { code, completed: true },
    create: { userId, chapterId, code, completed: true },
  });

  let xpAwarded = 0;
  if (!alreadyCompleted) {
    xpAwarded = chapter.xp;
    await prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: xpAwarded } },
    });
  }

  await updateStreak(userId);

  const allChapterIds = chapter.lesson.chapters.map((c) => c.id);
  const completedForLesson = await prisma.chapterProgress.count({
    where: { userId, chapterId: { in: allChapterIds }, completed: true },
  });
  const lessonJustCompleted = completedForLesson === allChapterIds.length;

  let newBadge = null;
  if (lessonJustCompleted) {
    const badge = await prisma.badge.upsert({
      where: { slug: chapter.lesson.slug },
      update: {},
      create: {
        slug: chapter.lesson.slug,
        name: chapter.lesson.badgeName,
        description: `Completed "${chapter.lesson.title}"`,
        glyph: chapter.lesson.badgeGlyph,
        rarity: chapter.lesson.isPremium ? "rare" : "common",
      },
    });
    const userBadge = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });
    if (!userBadge) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: chapter.lesson.xpReward } },
      });
      xpAwarded += chapter.lesson.xpReward;
      newBadge = badge;
    }
  }

  return { xpAwarded, lessonCompleted: lessonJustCompleted, newBadge };
}
