import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/access";
import TerminalWindow from "@/components/ui/TerminalWindow";

export default async function LessonsPage() {
  const session = await getServerSession(authOptions);
  const tracks = await prisma.track.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" }, include: { chapters: true } } },
  });

  const isPro = session?.user ? await hasProAccess(session.user.id) : false;

  let completedChapterIds = new Set<string>();
  if (session?.user) {
    const progress = await prisma.chapterProgress.findMany({
      where: { userId: session.user.id, completed: true },
      select: { chapterId: true },
    });
    completedChapterIds = new Set(progress.map((p) => p.chapterId));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-term-green text-glow">$ ls -la ./curriculum</h1>
      <p className="mb-10 text-term-muted">Work through each track top to bottom. Free tracks unlock immediately.</p>

      {tracks.map((track) => (
        <div key={track.id} className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-term-cyan">
            {track.title}{" "}
            {track.isPremium && <span className="ml-2 text-xs text-term-amber">PRO TRACK</span>}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {track.lessons.map((lesson) => {
              const totalChapters = lesson.chapters.length;
              const doneChapters = lesson.chapters.filter((c) => completedChapterIds.has(c.id)).length;
              const locked = lesson.isPremium && !isPro;
              const pct = totalChapters ? Math.round((doneChapters / totalChapters) * 100) : 0;

              return (
                <TerminalWindow key={lesson.id} title={`${lesson.slug}.sol`}>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-term-green">{lesson.title}</h3>
                    <span className="text-xs text-term-muted">{lesson.badgeGlyph}</span>
                  </div>
                  <p className="mt-2 text-sm text-term-muted">{lesson.summary}</p>

                  {locked ? (
                    <p className="mt-4 rounded border border-term-red/50 px-3 py-2 text-xs text-term-red">
                      ROOT ACCESS REQUIRED — upgrade to Pro
                    </p>
                  ) : (
                    <div className="mt-4">
                      <div className="h-1.5 w-full rounded bg-term-border">
                        <div
                          className="h-1.5 rounded bg-term-green transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-term-muted">
                        {doneChapters}/{totalChapters} chapters
                      </p>
                    </div>
                  )}

                  <Link
                    href={locked ? "/pricing" : `/lessons/${lesson.slug}`}
                    className="mt-4 inline-block rounded border border-term-border px-4 py-2 text-sm text-term-green hover:border-term-green"
                  >
                    {locked ? "./unlock" : pct === 100 ? "./review" : pct > 0 ? "./continue" : "./start"}
                  </Link>
                </TerminalWindow>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
