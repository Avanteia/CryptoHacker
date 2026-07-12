"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CancelButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    if (!confirm("Cancel your subscription? You'll keep Pro access until the current period ends.")) return;
    setLoading(true);
    const res = await fetch("/api/razorpay/cancel", { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      toast.error("Couldn't cancel — try again.");
      return;
    }
    toast.success("Subscription will not renew.");
    router.refresh();
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="mt-2 self-start rounded border border-term-red px-4 py-2 text-sm text-term-red hover:bg-term-red hover:text-term-bg disabled:opacity-50"
    >
      {loading ? "cancelling..." : "./cancel_subscription"}
    </button>
  );
}
