"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/lessons", label: "lessons" },
  { href: "/leaderboard", label: "leaderboard" },
  { href: "/pricing", label: "pricing" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-term-border bg-term-bg/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-term-green text-glow">
          {"~/"}CryptoHacker
        </Link>
        <div className="hidden gap-6 text-sm text-term-muted md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname?.startsWith(l.href)
                  ? "text-term-green"
                  : "hover:text-term-cyan transition-colors"
              }
            >
              ./{l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {session ? (
            <>
              <Link href={`/hacker/${session.user.username}`} className="text-term-cyan hover:underline">
                {session.user.username}
              </Link>
              <Link href="/billing" className="text-term-muted hover:text-term-green">
                billing
              </Link>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-term-amber hover:underline">
                  admin
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded border border-term-border px-2 py-1 text-term-red hover:border-term-red"
              >
                logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-term-muted hover:text-term-green">
                login
              </Link>
              <Link
                href="/register"
                className="rounded border border-term-green px-3 py-1 text-term-green hover:bg-term-green hover:text-term-bg transition-colors"
              >
                sign_up()
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
