import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import TerminalWindow from "@/components/ui/TerminalWindow";
import CancelButton from "@/components/billing/CancelButton";
import Link from "next/link";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } });

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <TerminalWindow title="billing.sh">
        <h1 className="mb-6 text-xl font-bold text-term-green">$ ./billing_status</h1>

        {!sub || sub.plan === "FREE" ? (
          <div>
            <p className="text-term-muted">You&apos;re on the free tier.</p>
            <Link
              href="/pricing"
              className="mt-4 inline-block rounded border border-term-green px-4 py-2 text-sm text-term-green hover:bg-term-green hover:text-term-bg"
            >
              ./upgrade
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-sm">
            <p>
              <span className="text-term-muted">plan: </span>
              <span className="text-term-green">{sub.plan}</span>
            </p>
            <p>
              <span className="text-term-muted">status: </span>
              <span className="text-term-cyan">{sub.status}</span>
            </p>
            {sub.currentEnd && (
              <p>
                <span className="text-term-muted">renews / expires: </span>
                {sub.currentEnd.toDateString()}
              </p>
            )}
            {sub.cancelAtPeriodEnd && (
              <p className="text-term-amber">Cancellation scheduled — access continues until period end.</p>
            )}
            {sub.status === "ACTIVE" && !sub.cancelAtPeriodEnd && <CancelButton />}
          </div>
        )}
      </TerminalWindow>
    </div>
  );
}
