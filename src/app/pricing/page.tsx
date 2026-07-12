import TerminalWindow from "@/components/ui/TerminalWindow";
import CheckoutButton from "@/components/billing/CheckoutButton";

const FEATURES_FREE = [
  "Crypto Fundamentals track",
  "Solidity Basics track",
  "Solidity Advanced I track",
  "Leaderboard & badges",
];

const FEATURES_PRO = [
  "Everything in Free",
  "Advanced Solidity (modifiers, gas optimization)",
  "ERC-20 & ERC-721 token building",
  "Security & Ethical Hacking exploits",
  "Web3.js / Ethers.js frontend integration",
  "Capstone testnet deployment",
  "Exclusive Pro badges",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-2 text-center text-2xl font-bold text-term-green text-glow">$ cat ./pricing.json</h1>
      <p className="mb-12 text-center text-term-muted">Free forever for the fundamentals. Upgrade for the full exploit chain.</p>

      <div className="grid gap-6 md:grid-cols-3">
        <TerminalWindow title="free_tier.sol">
          <h2 className="text-lg font-bold text-term-green">Script Kiddie</h2>
          <p className="mt-1 text-2xl font-bold text-term-muted">₹0</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-term-muted">
            {FEATURES_FREE.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
        </TerminalWindow>

        <TerminalWindow title="pro_monthly.sol" className="border-term-green">
          <h2 className="text-lg font-bold text-term-green">Pro Monthly</h2>
          <p className="mt-1 text-2xl font-bold text-term-green">₹499<span className="text-sm text-term-muted">/mo</span></p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-term-muted">
            {FEATURES_PRO.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <CheckoutButton plan="PRO_MONTHLY" label="Pro Monthly" />
        </TerminalWindow>

        <TerminalWindow title="pro_yearly.sol" className="border-term-cyan">
          <h2 className="text-lg font-bold text-term-cyan">Pro Yearly</h2>
          <p className="mt-1 text-2xl font-bold text-term-cyan">₹4,999<span className="text-sm text-term-muted">/yr</span></p>
          <p className="text-xs text-term-amber">save ~17% vs monthly</p>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-term-muted">
            {FEATURES_PRO.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <CheckoutButton plan="PRO_YEARLY" label="Pro Yearly" />
        </TerminalWindow>
      </div>
    </div>
  );
}
