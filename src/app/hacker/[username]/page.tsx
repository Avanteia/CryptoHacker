import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rankForXp, nextRank, progressToNextRank } from "@/lib/xp";
import TerminalWindow from "@/components/ui/TerminalWindow";

export default async function HackerProfile({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: { badges: { include: { badge: true }, orderBy: { earnedAt: "desc" } } },
  });
  if (!user) notFound();

  const completedChapters = await prisma.chapterProgress.count({
    where: { userId: user.id, completed: true },
  });

  const rank = rankForXp(user.xp);
  const next = nextRank(user.xp);
  const pct = Math.round(progressToNextRank(user.xp) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <TerminalWindow title={`~/${user.username}/profile.json`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-term-green text-glow">{user.username}</h1>
            <p className="text-term-cyan">{rank.name}</p>
          </div>
          <div className="text-right text-sm text-term-muted">
            <p>{user.xp} XP</p>
            <p>{completedChapters} chapters cleared</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs text-term-muted">
            <span>{rank.name}</span>
            <span>{next ? next.name : "max rank"}</span>
          </div>
          <div className="mt-1 h-2 w-full rounded bg-term-border">
            <div className="h-2 rounded bg-term-green transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded border border-term-border p-3">
            <p className="text-term-muted">current streak</p>
            <p className="text-lg text-term-amber">{user.currentStreak}d 🔥</p>
          </div>
          <div className="rounded border border-term-border p-3">
            <p className="text-term-muted">longest streak</p>
            <p className="text-lg text-term-amber">{user.longestStreak}d</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-term-green">$ ls ./badges</h2>
          {user.badges.length === 0 ? (
            <p className="text-sm text-term-muted">No badges earned yet — complete a lesson to unlock one.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {user.badges.map((ub) => (
                <div key={ub.id} className="rounded border border-term-border p-3 text-center">
                  <p className="text-2xl">{ub.badge.glyph}</p>
                  <p className="mt-1 text-xs text-term-green">{ub.badge.name}</p>
                  <p className="text-[10px] text-term-muted">{ub.badge.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
}
