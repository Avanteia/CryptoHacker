"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import TerminalWindow from "@/components/ui/TerminalWindow";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password });
    setLoading(false);
    if (res?.error) {
      toast.error("ACCESS DENIED — invalid credentials");
      return;
    }
    toast.success("ACCESS GRANTED");
    router.push("/lessons");
    router.refresh();
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <TerminalWindow title="auth.sh — login">
        <h1 className="mb-6 text-xl font-bold text-term-green">$ ./login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            password
            <input
              type="password"
              required
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
            {loading ? "authenticating..." : "./authenticate"}
          </button>
        </form>
        <button
          onClick={() => signIn("google", { callbackUrl: "/lessons" })}
          className="mt-4 w-full rounded border border-term-border py-2 text-sm text-term-muted hover:border-term-cyan hover:text-term-cyan"
        >
          continue_with_google()
        </button>
        <p className="mt-6 text-center text-sm text-term-muted">
          no account?{" "}
          <Link href="/register" className="text-term-cyan hover:underline">
            ./register
          </Link>
        </p>
      </TerminalWindow>
    </div>
  );
}
