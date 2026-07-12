"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutButton({ plan, label }: { plan: "PRO_MONTHLY" | "PRO_YEARLY"; label: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!session?.user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      toast.error("Couldn't load payment gateway — check your connection.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/razorpay/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error("Couldn't start checkout. Try again shortly.");
      return;
    }

    const rzp = new window.Razorpay({
      key: data.keyId,
      subscription_id: data.subscriptionId,
      name: "CryptoHacker",
      description: label,
      theme: { color: "#00ff41" },
      handler: () => {
        toast.success("ROOT ACCESS GRANTED — welcome to Pro");
        router.push("/billing");
        router.refresh();
      },
    });
    rzp.open();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="mt-4 w-full rounded border border-term-green py-2 font-bold text-term-green hover:bg-term-green hover:text-term-bg disabled:opacity-50"
    >
      {loading ? "connecting..." : `./subscribe ${label}`}
    </button>
  );
}
