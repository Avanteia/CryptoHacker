"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#0d1117",
            color: "#00ff41",
            border: "1px solid #1f2a24",
            fontFamily: "monospace",
          },
        }}
      />
    </SessionProvider>
  );
}
