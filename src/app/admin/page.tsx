import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TerminalWindow from "@/components/ui/TerminalWindow";
import AdminUserRow from "@/components/admin/AdminUserRow";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [userCount, proCount, completedChapters, users, auditLog] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
    prisma.chapterProgress.count({ where: { completed: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { subscription: true },
    }),
    prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { admin: { select: { username: true } } },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-term-green text-glow">$ sudo ./admin_panel</h1>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <TerminalWindow title="stats.users">
          <p className="text-sm text-term-muted">total hackers</p>
          <p className="text-3xl font-bold text-term-green">{userCount}</p>
        </TerminalWindow>
        <TerminalWindow title="stats.pro">
          <p className="text-sm text-term-muted">active pro subs</p>
          <p className="text-3xl font-bold text-term-cyan">{proCount}</p>
        </TerminalWindow>
        <TerminalWindow title="stats.progress">
          <p className="text-sm text-term-muted">chapters completed</p>
          <p className="text-3xl font-bold text-term-amber">{completedChapters}</p>
        </TerminalWindow>
      </div>

      <TerminalWindow title="users.db" className="mb-10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-term-border text-term-muted">
                <th className="py-2 pr-4">user</th>
                <th className="py-2 pr-4">email</th>
                <th className="py-2 pr-4">xp</th>
                <th className="py-2 pr-4">plan</th>
                <th className="py-2 pr-4">status</th>
                <th className="py-2">action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <AdminUserRow
                  key={u.id}
                  user={{
                    id: u.id,
                    username: u.username,
                    email: u.email,
                    xp: u.xp,
                    plan: u.subscription?.plan ?? "FREE",
                    status: u.subscription?.status ?? "NONE",
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </TerminalWindow>

      <TerminalWindow title="audit.log">
        <ul className="flex flex-col gap-2 text-sm">
          {auditLog.map((log) => (
            <li key={log.id} className="text-term-muted">
              <span className="text-term-cyan">{log.admin.username}</span> {log.action.toLowerCase()} on{" "}
              <span className="text-term-green">{log.target}</span> — {log.createdAt.toLocaleString()}
            </li>
          ))}
          {auditLog.length === 0 && <li className="text-term-muted">No admin actions yet.</li>}
        </ul>
      </TerminalWindow>
    </div>
  );
}
