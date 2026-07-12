import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "CryptoHacker — Learn Solidity by Hacking",
  description:
    "Level up from Script Kiddie to Elite Hacker. Learn Solidity and smart-contract security in an interactive, terminal-themed coding dojo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-56px)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
