"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import TerminalWindow from "@/components/ui/TerminalWindow";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error === "EMAIL_TAKEN" ? "ACCESS DENIED — email already registered" : "INVALID INPUT");
      setLoading(false);
      return;
    }
    const signInRes = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (signInRes?.error) {
      toast.error("account created — please log in");
      router.push("/login");
      return;
    }
    toast.success("ACCOUNT CREATED — welcome, script kiddie");
    router.push("/lessons");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <TerminalWindow title="auth.sh — register">
        <h1 className="mb-6 text-xl font-bold text-term-green">$ ./create_account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm text-term-muted">
            handle
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-term-border bg-term-bg px-3 py-2 text-term-green outline-none focus:border-term-green"
            />
          </label>
          <label className="text-sm text-term-muted">
            email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-term-border bg-term-bg px-3 py-2 text-term-green outline-none focus:border-term-green"
            />
          </label>
          <label className="text-sm text-term-muted">
            password (min 8 chars)
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-term-border bg-term-bg px-3 py-2 text-term-green outline-none focus:border-term-green"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded border border-term-green py-2 font-bold text-term-green hover:bg-term-green hover:text-term-bg disabled:opacity-50"
          >
            {loading ? "provisioning..." : "./create_account"}
          </button>
        </form>
        <button
          onClick={() => signIn("google", { callbackUrl: "/lessons" })}
          className="mt-4 w-full rounded border border-term-border py-2 text-sm text-term-muted hover:border-term-cyan hover:text-term-cyan"
        >
          continue_with_google()
        </button>
        <p className="mt-6 text-center text-sm text-term-muted">
          already a hacker?{" "}
          <Link href="/login" className="text-term-cyan hover:underline">
            ./login
          </Link>
        </p>
      </TerminalWindow>
    </div>
  );
}
