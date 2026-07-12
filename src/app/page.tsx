import Link from "next/link";
import MatrixRain from "@/components/ui/MatrixRain";
import TerminalWindow from "@/components/ui/TerminalWindow";

const CURRICULUM = [
  { id: "01", title: "Crypto Fundamentals", desc: "Blockchain, wallets, keys, gas — the concepts, quiz-style.", free: true },
  { id: "02", title: "Solidity Basics", desc: "Build the HackerFactory contract: state, structs, arrays, mappings.", free: true },
  { id: "03", title: "Solidity Advanced I", desc: "msg.sender, require, inheritance, interfaces — HackerFeeding.", free: true },
  { id: "04", title: "Advanced Solidity", desc: "Modifiers, Ownable, gas optimization, time units.", free: false },
  { id: "05", title: "ERC-20 & ERC-721", desc: "Build your own token and NFT from scratch.", free: false },
  { id: "06", title: "Security & Ethical Hacking", desc: "Reentrancy, overflow, and the exploits that broke DeFi.", free: false },
  { id: "07", title: "Web3.js / Ethers.js", desc: "Wire your contract up to a real frontend.", free: false },
  { id: "08", title: "Capstone: Testnet Deploy", desc: "Ship your contract to a live testnet.", free: false },
];

const TESTIMONIALS = [
  { name: "0xx_rae", rank: "Elite Hacker", quote: "Went from never touching Solidity to shipping an ERC-20 in a weekend. The exploit challenges made security actually click." },
  { name: "kernel_panic", rank: "Bounty Hunter", quote: "The ACCESS DENIED hints are weirdly motivating. I fixed my first reentrancy bug because it told me exactly which line was wrong." },
  { name: "null_ptr", rank: "White Hat", quote: "Terminal theme is not just a skin — the whole thing feels like a hacking sim, not a course." },
];

export default function Home() {
  return (
    <div>
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden border-b border-term-border">
        <div className="absolute inset-0 opacity-40">
          <MatrixRain />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-term-bg/40 via-term-bg/70 to-term-bg" />
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4 text-center">
          <p className="mb-3 text-sm text-term-cyan">[boot sequence complete]</p>
          <h1 className="text-4xl font-bold text-term-green text-glow sm:text-6xl">
            root@cryptohacker:~$ become_elite.sh
          </h1>
          <p className="mt-6 max-w-2xl text-term-muted sm:text-lg">
            Learn Solidity by writing real smart contracts, chapter by chapter, right in
            your browser. No zombies here — you&apos;re a rookie hacker grinding XP from{" "}
            <span className="text-term-green">Script Kiddie</span> to{" "}
            <span className="text-term-green">Elite Hacker</span>.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/lessons"
              className="rounded border border-term-green bg-term-green px-6 py-3 font-bold text-term-bg transition-transform hover:scale-105"
            >
              ./start_hacking
            </Link>
            <Link
              href="/pricing"
              className="rounded border border-term-border px-6 py-3 text-term-muted hover:border-term-cyan hover:text-term-cyan"
            >
              view_pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold text-term-green">$ ls ./curriculum</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CURRICULUM.map((c) => (
            <TerminalWindow key={c.id} title={`lesson_${c.id}.sol`}>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-term-green">{c.title}</h3>
                {!c.free && <span className="text-xs text-term-amber">PRO</span>}
              </div>
              <p className="mt-2 text-sm text-term-muted">{c.desc}</p>
            </TerminalWindow>
          ))}
        </div>
      </section>

      <section className="border-y border-term-border bg-term-panel/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-term-green">$ cat ./testimonials.log</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TerminalWindow key={t.name} title={`~/${t.name}`}>
                <p className="text-sm text-term-muted">&quot;{t.quote}&quot;</p>
                <p className="mt-3 text-xs text-term-cyan">
                  {t.name} · {t.rank}
                </p>
              </TerminalWindow>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-term-green">$ sudo upgrade --to pro</h2>
        <p className="mt-3 text-term-muted">
          Unlock advanced Solidity, token standards, security exploits, frontend
          integration, and the testnet capstone.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded border border-term-green px-6 py-3 font-bold text-term-green hover:bg-term-green hover:text-term-bg"
        >
          ./view_plans
        </Link>
      </section>
    </div>
  );
}
