"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Props {
  user: {
    id: string;
    username: string | null;
    email: string;
    xp: number;
    plan: string;
    status: string;
  };
}

export default function AdminUserRow({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isPro = user.status === "ACTIVE";

  async function togglePro() {
    setLoading(true);
    const res = await fetch("/api/admin/toggle-pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("Action failed");
      return;
    }
    toast.success("Updated");
    router.refresh();
  }

  return (
    <tr className="border-b border-term-border/50">
      <td className="py-2 pr-4 text-term-cyan">{user.username ?? "—"}</td>
      <td className="py-2 pr-4 text-term-muted">{user.email}</td>
      <td className="py-2 pr-4">{user.xp}</td>
      <td className="py-2 pr-4">{user.plan}</td>
      <td className="py-2 pr-4">{user.status}</td>
      <td className="py-2">
        <button
          onClick={togglePro}
          disabled={loading}
          className={`rounded border px-3 py-1 text-xs disabled:opacity-50 ${
            isPro ? "border-term-red text-term-red hover:bg-term-red hover:text-term-bg" : "border-term-green text-term-green hover:bg-term-green hover:text-term-bg"
          }`}
        >
          {isPro ? "revoke pro" : "grant pro"}
        </button>
      </td>
    </tr>
  );
}
