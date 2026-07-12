import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { rankForXp } from "@/lib/xp";
import TerminalWindow from "@/components/ui/TerminalWindow";

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    orderBy: { xp: "desc" },
    take: 50,
    where: { username: { not: null } },
    select: { id: true, username: true, xp: true, currentStreak: true, longestStreak: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-term-green text-glow">$ top --hackers --limit 50</h1>
      <p className="mb-8 text-term-muted">Ranked by total XP earned.</p>

      <TerminalWindow title="leaderboard.log">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-term-border text-term-muted">
              <th className="py-2 pr-4">#</th>
              <th className="py-2 pr-4">hacker</th>
              <th className="py-2 pr-4">rank</th>
              <th className="py-2 pr-4">xp</th>
              <th className="py-2">streak</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="border-b border-term-border/50 hover:bg-term-border/10">
                <td className="py-2 pr-4 text-term-muted">{i + 1}</td>
                <td className="py-2 pr-4">
                  <Link href={`/hacker/${u.username}`} className="text-term-cyan hover:underline">
                    {u.username}
                  </Link>
                </td>
                <td className="py-2 pr-4 text-term-green">{rankForXp(u.xp).name}</td>
                <td className="py-2 pr-4">{u.xp}</td>
                <td className="py-2 text-term-amber">
                  {u.currentStreak > 0 ? `${u.currentStreak}d 🔥` : "—"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-term-muted">
                  No hackers yet — be the first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TerminalWindow>
    </div>
  );
}
