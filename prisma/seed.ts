import { PrismaClient, LessonKind } from "@prisma/client";

const prisma = new PrismaClient();

type ChapterSeed = {
  order: number;
  title: string;
  kind: LessonKind;
  instructions: string;
  starterCode?: string;
  solutionCode?: string;
  hint?: string;
  validationRules?: unknown[];
  quizOptions?: string[];
  quizAnswer?: string;
  xp?: number;
};

type LessonSeed = {
  slug: string;
  title: string;
  summary: string;
  order: number;
  isPremium: boolean;
  badgeName: string;
  badgeGlyph: string;
  xpReward: number;
  chapters: ChapterSeed[];
};

type TrackSeed = {
  slug: string;
  title: string;
  description: string;
  order: number;
  isPremium: boolean;
  lessons: LessonSeed[];
};

const TRACKS: TrackSeed[] = [
  {
    slug: "fundamentals",
    title: "Free Track — Crypto Fundamentals",
    description: "The concepts every hacker needs before writing a line of Solidity.",
    order: 1,
    isPremium: false,
    lessons: [
      {
        slug: "crypto-fundamentals",
        title: "Crypto Fundamentals",
        summary: "Blockchain, wallets, keys, transactions, and gas — no code, just concepts.",
        order: 1,
        isPremium: false,
        badgeName: "First Boot",
        badgeGlyph: "[>_]",
        xpReward: 100,
        chapters: [
          {
            order: 1,
            title: "What is a blockchain?",
            kind: "QUIZ",
            instructions: `## root@network:~$ whoami

Welcome, rookie. Before you write a single exploit, you need to understand the machine you're hacking into.

A **blockchain** is a database that is:

- **Distributed** — copied across thousands of independent computers ("nodes") instead of living on one server.
- **Append-only** — new data is added in **blocks** that link to the previous block via a cryptographic hash, forming a **chain**. You can't quietly edit block #4,201 without every node noticing the chain broke.
- **Consensus-driven** — nodes agree on the *one* valid version of the chain using a protocol (Proof of Work, Proof of Stake, etc.), so no single party can rewrite history alone.

This is why blockchains are described as "trustless" — you don't have to trust a company, you trust math and game theory.

**Question:** What makes it computationally impractical to secretly alter a transaction from many blocks ago?`,
            quizOptions: [
              "The government would notice and shut down the network",
              "Every later block's hash depends on it, so changing it breaks the hash chain across all nodes",
              "Blockchains automatically delete old transactions",
              "Only banks are allowed to write to the chain",
            ],
            quizAnswer: "Every later block's hash depends on it, so changing it breaks the hash chain across all nodes",
            xp: 20,
          },
          {
            order: 2,
            title: "Wallets and keys",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat wallet.md

A crypto **wallet** doesn't actually "hold" coins — it holds **keys**.

- **Private key** — a secret number. Whoever controls it can sign transactions and move funds. Never expose this. Ever.
- **Public key** — derived mathematically from the private key.
- **Address** — a shortened, hashed form of the public key (e.g. \`0x71C7...976F\` on Ethereum) — safe to share, like a username.

Signing a transaction with your private key proves you authorized it, without ever revealing the key itself — that's the magic of **asymmetric cryptography** (specifically, elliptic curve signatures on Ethereum).

**Question:** If someone gains access to your private key, what can they do?`,
            quizOptions: [
              "Nothing, as long as they don't know your address",
              "Only view your balance, not move funds",
              "Fully control the wallet — sign any transaction as if they were you",
              "Freeze the wallet until you reset your password",
            ],
            quizAnswer: "Fully control the wallet — sign any transaction as if they were you",
            xp: 20,
          },
          {
            order: 3,
            title: "Transactions",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat transaction.md

A transaction is a signed instruction: "move X, or run this contract function, from my account." Once broadcast, it sits in the **mempool** until a validator includes it in a block.

Key transaction fields on Ethereum:

- \`from\` — the sender's address (derived from the signature).
- \`to\` — recipient address, or a contract address if calling a function.
- \`value\` — amount of ETH to send.
- \`data\` — encoded function call + arguments, if calling a contract.
- \`nonce\` — a per-account counter that prevents replaying the same transaction twice.

**Question:** Why does every transaction include a nonce?`,
            quizOptions: [
              "To prove the sender's identity",
              "To pay the validator directly",
              "To ensure each transaction from an account is processed exactly once and in order, preventing replay attacks",
              "It's just a random number for fun",
            ],
            quizAnswer: "To ensure each transaction from an account is processed exactly once and in order, preventing replay attacks",
            xp: 20,
          },
          {
            order: 4,
            title: "Gas",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat gas.md

Every operation on Ethereum (storage write, arithmetic, contract call) costs **gas** — a unit measuring computational effort. You pay for gas in ETH:

\`\`\`
transaction fee = gas used × gas price
\`\`\`

Why gas exists:

1. It stops infinite loops / spam from freezing the network (a runaway loop just runs out of gas and reverts).
2. It prices computation fairly — writing to storage is far more expensive than simple math, and gas costs reflect that.

If you set a **gas limit** too low, your transaction runs out of gas mid-execution, **reverts**, and you still pay for the gas already consumed.

**Question:** What happens if a transaction runs out of gas partway through?`,
            quizOptions: [
              "It pauses and resumes once you add more gas",
              "All state changes are rolled back (reverted), but the gas spent up to that point is not refunded",
              "It completes successfully but slower",
              "The network refunds the gas automatically",
            ],
            quizAnswer: "All state changes are rolled back (reverted), but the gas spent up to that point is not refunded",
            xp: 20,
          },
          {
            order: 5,
            title: "Smart contracts",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat contracts.md

A **smart contract** is just code deployed to a blockchain address. It has its own storage, its own balance, and functions anyone can call (subject to the rules you write).

Unlike a normal server, a deployed contract's code is **immutable by default** — you can't just SSH in and patch a bug. That's why security is the whole game: once it's live, mistakes are expensive and public.

This is also why we're building **CryptoHacker** around Solidity: it's the dominant language for writing these contracts on Ethereum and EVM-compatible chains. Time to open the editor.

**Question:** Why is smart contract security especially high-stakes compared to typical web app security?`,
            quizOptions: [
              "It isn't — contracts can be patched like any server",
              "Deployed contract code is generally immutable, and bugs can be exploited publicly with real, often irreversible financial loss",
              "Because contracts run slower than websites",
              "Because only governments can deploy contracts",
            ],
            quizAnswer: "Deployed contract code is generally immutable, and bugs can be exploited publicly with real, often irreversible financial loss",
            xp: 20,
          },
          {
            order: 6,
            title: "Consensus: Proof of Work vs Proof of Stake",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat consensus.md

Nodes need to agree on which chain is the "real" one when multiple valid-looking chains could exist. Two dominant mechanisms:

- **Proof of Work (PoW)** — validators ("miners") compete to solve a computationally expensive puzzle. Whoever solves it first proposes the next block. Expensive hardware + electricity cost is the security: rewriting history means re-doing that work faster than everyone else combined (a "51% attack"), which gets prohibitively expensive as the network grows. Bitcoin uses this.

- **Proof of Stake (PoS)** — validators lock up ("stake") the network's own coin as collateral. The protocol pseudo-randomly selects a validator to propose each block, weighted by stake size. Acting maliciously gets your stake **slashed** (partially destroyed) — security comes from economic risk instead of energy cost. Ethereum switched from PoW to PoS in "The Merge" (2022).

**Question:** In Proof of Stake, what actually discourages a validator from proposing a fraudulent block?`,
            quizOptions: [
              "Nothing — PoS has no penalty mechanism",
              "The computational cost of solving a puzzle",
              "Their staked collateral can be partially or fully destroyed (\"slashed\") if they're caught acting maliciously",
              "They get banned from the internet",
            ],
            quizAnswer: "Their staked collateral can be partially or fully destroyed (\"slashed\") if they're caught acting maliciously",
            xp: 20,
          },
          {
            order: 7,
            title: "Forks: soft vs hard",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat forks.md

When a blockchain's rules change, nodes need to upgrade — but not everyone upgrades at once, which creates a **fork**:

- **Soft fork** — a backwards-compatible rule *tightening*. Old (non-upgraded) nodes still accept blocks produced under the new rules, because the new rules are a subset of what old nodes already allow. The chain stays unified.
- **Hard fork** — a backwards-*incompatible* change. Old nodes reject blocks that follow the new rules (or vice versa), permanently splitting the network into two separate chains if not everyone upgrades. Ethereum's split into Ethereum and Ethereum Classic (after the 2016 DAO hack was reversed via a hard fork) is the canonical example.

**Question:** Why does a hard fork risk permanently splitting a blockchain into two separate networks, while a soft fork doesn't?`,
            quizOptions: [
              "Hard forks always require a new cryptocurrency to be created",
              "Old, non-upgraded nodes reject the new rules as invalid, so if enough nodes don't upgrade, two mutually incompatible chains persist side by side",
              "Soft forks are reversible and hard forks are not",
              "There's no real difference, just terminology",
            ],
            quizAnswer: "Old, non-upgraded nodes reject the new rules as invalid, so if enough nodes don't upgrade, two mutually incompatible chains persist side by side",
            xp: 20,
          },
          {
            order: 8,
            title: "Layer 2 scaling",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat layer2.md

Ethereum mainnet ("Layer 1") can only process a limited number of transactions per second, and each one costs gas. **Layer 2** networks handle most transaction processing off the main chain, then post a compressed summary (or proof) back to Layer 1 for final security — cheaper and faster, while still inheriting Ethereum's security guarantees.

Two common approaches:

- **Optimistic rollups** (e.g. Arbitrum, Optimism) — assume transactions are valid by default, but allow a challenge window where anyone can submit fraud proofs if something's wrong.
- **ZK-rollups** (e.g. zkSync, Starknet) — bundle transactions and generate a cryptographic proof (a zero-knowledge proof) that they were executed correctly, verified on Layer 1 immediately, no challenge window needed.

**Question:** What's the fundamental difference in how optimistic rollups and ZK-rollups establish that off-chain transactions were valid?`,
            quizOptions: [
              "There is no difference, they're the same technology with different names",
              "Optimistic rollups assume validity and allow a challenge period for fraud proofs; ZK-rollups generate a cryptographic proof of correctness upfront, with no challenge period",
              "ZK-rollups are slower but cheaper",
              "Optimistic rollups don't use Layer 1 at all",
            ],
            quizAnswer: "Optimistic rollups assume validity and allow a challenge period for fraud proofs; ZK-rollups generate a cryptographic proof of correctness upfront, with no challenge period",
            xp: 25,
          },
          {
            order: 9,
            title: "Stablecoins",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat stablecoins.md

Most cryptocurrencies are volatile, which makes them awkward for everyday payments or as a unit of account in DeFi. **Stablecoins** aim to hold a steady value (usually pegged to $1 USD) via one of a few mechanisms:

- **Fiat-collateralized** — a company holds $1 in a bank account for every token issued (e.g. USDC, USDT). Requires trusting the issuer's audits/reserves.
- **Crypto-collateralized** — backed by *more* crypto value than the stablecoin issued (over-collateralized), to absorb price swings in the collateral (e.g. DAI, backed by ETH and other assets locked in smart contracts).
- **Algorithmic** — no direct collateral; the peg is maintained by algorithmically expanding/contracting supply based on market price. Historically the least reliable — TerraUSD's 2022 collapse (losing its peg entirely, wiping out ~$40B) is the canonical cautionary tale.

**Question:** Why are algorithmic stablecoins generally considered riskier than collateralized ones?`,
            quizOptions: [
              "They are illegal in most countries",
              "Their peg relies on market incentives and supply/demand mechanics rather than real collateral backing every token, so a loss of confidence can trigger a self-reinforcing collapse (a \"death spiral\")",
              "They can only be used on one blockchain",
              "They have higher transaction fees",
            ],
            quizAnswer: "Their peg relies on market incentives and supply/demand mechanics rather than real collateral backing every token, so a loss of confidence can trigger a self-reinforcing collapse (a \"death spiral\")",
            xp: 25,
          },
          {
            order: 10,
            title: "DeFi in one paragraph",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat defi.md

**DeFi** (Decentralized Finance) recreates financial services — lending, borrowing, trading, earning yield — as smart contracts instead of banks or brokerages. Nobody holds your funds on your behalf by default; you interact directly with code, and (ideally) that code's logic is fully auditable on-chain.

Core primitives you'll build later in this course:
- **AMMs** (Automated Market Makers) — let you swap tokens against a pool of liquidity instead of matching buyers/sellers directly.
- **Lending protocols** — let you deposit an asset to earn interest, or borrow against collateral you've deposited.
- **Staking** — lock up tokens to earn rewards, often tied to securing a network or providing liquidity.

The tradeoff for removing intermediaries: you take on smart contract risk directly. A bug in the code *is* the bank's vault door being left open — which is exactly why the Security track later in this course exists.

**Question:** What is the core tradeoff DeFi makes compared to traditional finance?`,
            quizOptions: [
              "DeFi is strictly safer because there's no company that can go bankrupt",
              "DeFi removes trusted intermediaries in favor of direct interaction with smart contract code, shifting risk from counterparty/institutional risk to smart contract correctness risk",
              "DeFi only works with stablecoins",
              "DeFi requires government approval to use",
            ],
            quizAnswer: "DeFi removes trusted intermediaries in favor of direct interaction with smart contract code, shifting risk from counterparty/institutional risk to smart contract correctness risk",
            xp: 20,
          },
          {
            order: 11,
            title: "DAOs",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat dao.md

A **DAO** (Decentralized Autonomous Organization) is an organization whose rules and treasury are governed by smart contracts and member voting instead of a traditional management hierarchy. Token holders typically propose changes and vote, with outcomes executed automatically on-chain if a proposal passes.

The name is aspirational more than literal in practice: most real DAOs still rely on off-chain discussion (forums, Discord) before an on-chain vote, and many have some multisig or admin key for emergency actions — full "autonomy" without any human intervention is rare and often risky (a purely automatic system can't respond to genuinely novel situations, like the 2016 DAO hack, which needed human judgment to resolve).

**Question:** Why do most real-world DAOs still retain some human/multisig control rather than being fully autonomous?`,
            quizOptions: [
              "Because DAOs are illegal without human oversight",
              "Fully automated systems can't exercise judgment in unforeseen situations (like responding to an active exploit), so a safety valve is usually kept for emergencies",
              "Smart contracts cannot hold funds without a human co-signer",
              "It's purely a marketing choice with no technical reason",
            ],
            quizAnswer: "Fully automated systems can't exercise judgment in unforeseen situations (like responding to an active exploit), so a safety valve is usually kept for emergencies",
            xp: 20,
          },
          {
            order: 12,
            title: "Oracles: getting real-world data on-chain",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat oracles.md

Smart contracts can only see data that's already on their own blockchain — they can't natively fetch a stock price, a sports score, or even the weather. An **oracle** is a service that brings external data on-chain, typically by having multiple independent parties report a value, aggregating them (e.g. taking a median) to resist any single reporter lying.

This matters enormously for security: if a lending protocol trusts a single, easily-manipulated price source, an attacker can artificially move that price (e.g. via a large trade in a low-liquidity pool) just long enough to drain the protocol — a class of exploit called **oracle manipulation**, responsible for tens of millions of dollars in DeFi losses.

**Question:** Why is relying on a single, easily-manipulated price source dangerous for a smart contract?`,
            quizOptions: [
              "It isn't — a single source is more reliable",
              "An attacker can artificially move that single price source (e.g. via a large trade) just long enough to trick the contract into a favorable exchange, then reverse it — a well-known oracle manipulation exploit",
              "Single-source oracles are always more accurate",
              "Smart contracts automatically detect fake prices",
            ],
            quizAnswer: "An attacker can artificially move that single price source (e.g. via a large trade) just long enough to trick the contract into a favorable exchange, then reverse it — a well-known oracle manipulation exploit",
            xp: 25,
          },
          {
            order: 13,
            title: "Rug pulls and common scams",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat scams.md

As a hacker, recognizing scam patterns matters as much as writing secure code. Common ones:

- **Rug pull** — developers hype a token/project, collect funds (often via a liquidity pool), then drain the liquidity and disappear, leaving holders with a worthless token.
- **Honeypot contract** — a token contract written so that buying works fine, but selling is silently blocked (e.g. via a hidden condition in \`transfer\`) — you can only lose money, never take profit.
- **Fake token approval phishing** — a malicious site tricks you into calling \`approve()\` granting it unlimited spending rights over your tokens, then drains your wallet whenever it chooses, without needing your private key at all.

**Question:** How does a phishing site drain a wallet through a fake "approve" transaction, without ever obtaining the victim's private key?`,
            quizOptions: [
              "It doesn't need approval at all — it just needs your public address",
              "By tricking the victim into signing an approve() transaction that grants the attacker's contract permission to move their tokens whenever it wants, no private key required afterward",
              "It exploits a bug in the blockchain itself",
              "It requires the victim to type their private key into a form",
            ],
            quizAnswer: "By tricking the victim into signing an approve() transaction that grants the attacker's contract permission to move their tokens whenever it wants, no private key required afterward",
            xp: 25,
          },
          {
            order: 14,
            title: "NFTs beyond profile pictures",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat nfts.md

An **NFT** (Non-Fungible Token) represents ownership of something unique — each token has its own ID and isn't interchangeable 1-for-1 with another, unlike a fungible token (one USDC is identical to any other USDC). "Non-fungible" just means "not mutually interchangeable," not "must be profile-picture art":

- **Digital ownership/provenance** — proving who owns a specific in-game item, ticket, or piece of art, and its full ownership history.
- **Access tokens** — holding a specific NFT can gate access to a community, event, or software feature.
- **Real-world asset representation** — tokenizing a deed, an invoice, or a share of a physical asset, with the NFT as the on-chain record of ownership.

Crucially: the NFT's metadata (image, name, description) is often stored **off-chain** (a URL, or on IPFS) with only a pointer stored on-chain — meaning if that off-chain storage disappears, the "NFT" itself still exists on-chain, but what it's supposed to represent visually may not.

**Question:** What's a key risk of an NFT whose metadata is hosted on a centralized, off-chain URL rather than something like IPFS?`,
            quizOptions: [
              "The NFT will stop being transferable",
              "If that URL goes down or the hosting company shuts down, the on-chain token still exists but the image/metadata it's supposed to represent may become permanently unavailable",
              "The blockchain will reject the transaction",
              "There is no risk, on-chain and off-chain storage are equivalent",
            ],
            quizAnswer: "If that URL goes down or the hosting company shuts down, the on-chain token still exists but the image/metadata it's supposed to represent may become permanently unavailable",
            xp: 20,
          },
          {
            order: 15,
            title: "Gas fees in practice",
            kind: "QUIZ",
            instructions: `## root@network:~$ cat gas-in-practice.md

Building on Chapter 4's gas basics: in practice, gas price fluctuates with network demand, similar to surge pricing. Ethereum uses a fee model (EIP-1559) with two parts:

- **Base fee** — algorithmically adjusts block-to-block based on how full the previous block was, and is **burned** (destroyed, not paid to anyone).
- **Priority fee ("tip")** — an optional extra amount you add to incentivize a validator to include your transaction sooner, paid directly to the validator.

This is why the same contract call can cost very different amounts at different times of day — it's not the contract getting more expensive, it's network demand changing the price of the same fixed amount of computation.

**Question:** Why does the same smart contract function call sometimes cost dramatically more ETH in gas fees at one time versus another?`,
            quizOptions: [
              "The contract's code changes automatically over time",
              "Gas price fluctuates with network demand (how full recent blocks are), so the same fixed amount of computational \"gas units\" costs a different amount of ETH depending on current demand",
              "Older contracts always cost more gas",
              "Gas fees are fixed and never change",
            ],
            quizAnswer: "Gas price fluctuates with network demand (how full recent blocks are), so the same fixed amount of computational \"gas units\" costs a different amount of ETH depending on current demand",
            xp: 20,
          },
        ],
      },
    ],
  },
  {
    slug: "solidity-basics",
    title: "Free Track — Solidity Basics",
    description: "Build the HackerFactory contract from scratch.",
    order: 2,
    isPremium: false,
    lessons: [
      {
        slug: "solidity-basics",
        title: "Solidity Basics",
        summary: "Contracts, state variables, functions, structs, arrays, mappings.",
        order: 1,
        isPremium: false,
        badgeName: "Code Runner Cert",
        badgeGlyph: "{ }",
        xpReward: 150,
        chapters: [
          {
            order: 1,
            title: "Contracts and the pragma",
            kind: "CODE",
            instructions: `## Chapter 1 — Your First Contract: Pragmas, Compilers, and the Anatomy of a Solidity File

### 1.1 Welcome to the other side of the terminal

Every course you've taken before this one probably started with "hello world." This one starts with a *machine that holds money*. That distinction matters more than it sounds like it should, and it's worth sitting with for a moment before you type a single character of Solidity.

When you write a function in Python, JavaScript, or Java, and that function has a bug, the cost of the bug is usually bounded: a crashed process, a bad API response, a support ticket. You redeploy, you patch, you move on. The blast radius is contained by the fact that your code runs on infrastructure *you* control, and you can change it whenever you want.

None of that is true here. Once a smart contract is deployed to a public blockchain like Ethereum, its bytecode is — by default — permanent. There is no SSH session into a live contract. There is no hotfix branch. If the contract holds funds and the code has a flaw, the flaw is now a public, standing invitation, visible to anyone with a block explorer and the patience to read bytecode, and it will not fix itself. This is why the entire second half of this course is dedicated to security: not as an afterthought bolted onto "real" programming, but as the central discipline of the craft.

This chapter is deliberately slow. We're going to write four lines of actual code by the end of it — a pragma statement and an empty contract declaration — and that might feel like an absurdly small amount of code for a chapter this long. But those four lines encode a surprising number of decisions, and understanding *why* each one exists will save you from a specific category of production incident that has genuinely cost real projects real money. We're not skipping ahead to "interesting" content and treating the boilerplate as filler. The boilerplate *is* the content, this chapter.

### 1.2 A short, opinionated history of why Solidity exists

Before Ethereum, Bitcoin already proved that a decentralized, trustless ledger was possible. Bitcoin's scripting language, however, is deliberately limited — non-Turing-complete, no loops, designed narrowly for validating that a transaction is allowed to spend a particular output. This was a conscious security tradeoff: a limited language has a much smaller space of things that can go catastrophically wrong.

Ethereum's founding insight (largely credited to Vitalik Buterin, first described in the Ethereum whitepaper in late 2013) was to generalize this: instead of a blockchain that could only move a native currency around according to fixed rules, why not a blockchain that could run *arbitrary programs*, with its own persistent storage, and let those programs hold and move value according to whatever logic their authors wrote? That arbitrary-program-execution environment is the **Ethereum Virtual Machine**, or **EVM** — a sandboxed, deterministic, gas-metered computer that every full node on the network runs identically, so that everyone agrees on the result of every computation.

Solidity, first proposed by Gavin Wood (also an Ethereum co-founder) in 2014 and developed further by Christian Reitwiessner, Alex Beregszaszi, and others, was designed as a high-level language that compiles down to EVM bytecode — the actual instructions the EVM executes. It deliberately borrows syntax from JavaScript, C++, and Python so that developers coming from mainstream languages would feel a sense of familiarity, while introducing concepts that have no real analog in traditional programming: gas costs for every operation, a strict distinction between where data lives (storage vs. memory vs. calldata — you'll meet this properly in Chapter 12), and a contract-oriented structure where "classes" (contracts) are also, simultaneously, live accounts with their own balance and address on a public ledger.

It's worth naming a few alternatives that exist in the same space, so you understand why Solidity remains the default choice for this course and for the overwhelming majority of production Ethereum-ecosystem contracts:

- **Vyper** — a Python-inspired language for the EVM, deliberately more restrictive than Solidity (no modifiers, no inheritance, no inline assembly) in the name of auditability. Some serious protocols use it specifically *because* it's harder to write certain classes of bugs in.
- **Move** (used by Aptos and Sui) — a newer language designed around a "resource" type system that makes it structurally difficult to accidentally duplicate or destroy a token, at the language level rather than via convention.
- **Rust** (used for Solana programs, and for ink! contracts on Substrate-based chains) — leverages Rust's existing memory-safety guarantees, applied to a different underlying execution model than the EVM entirely.

You'll likely encounter all three of these if you stay in this industry for any length of time. But Solidity's dominance on Ethereum and EVM-compatible chains (Polygon, Arbitrum, Optimism, BNB Chain, Avalanche's C-Chain, and dozens more) means it's the highest-leverage language to master first — the largest existing codebase to read, the largest set of tooling (Hardhat, Foundry, OpenZeppelin) built around it, and the largest number of both jobs and, frankly, historical exploits to learn from.

### 1.3 What a \`.sol\` file actually is, mechanically

A Solidity source file (conventionally given a \`.sol\` extension) is plain UTF-8 text. There's no special binary format, no IDE-specific project file required to make it valid — you could write one in Notepad and it would compile identically to one written in a fully-configured VSCode setup with the Solidity extension, linting, and autoformat-on-save. What differs between "a Solidity file someone wrote casually" and "a Solidity file a serious team ships to mainnet" isn't the mechanics of the file format — it's everything *around* it: the test suite, the static analysis tooling, the deployment scripts, the audit trail. We'll get to all of that. But it starts with understanding the plain text you're about to write.

A \`.sol\` file is compiled by the **Solidity compiler**, commonly called \`solc\` (its actual binary name, whether you invoke it directly, through Hardhat, through Foundry's \`forge build\`, or through the browser-based Remix IDE). The compiler's job, at a high level, is:

1. **Parse** the source text into an abstract syntax tree (AST) — a structured representation of what you wrote, independent of formatting/whitespace.
2. **Type-check** that tree — verifying that a \`uint\` is never silently treated as a \`string\`, that a function you're calling actually exists with that name and argument types, that visibility rules aren't violated, and dozens of other static checks.
3. **Generate EVM bytecode** — the actual sequence of low-level opcodes (\`PUSH1\`, \`SSTORE\`, \`CALL\`, and so on — there are about 140 of these) that will run on-chain.
4. **Generate the ABI** (Application Binary Interface) — a JSON description of every externally-callable function and event, used by anything that wants to interact with your contract without having your source code (a frontend, another contract, a block explorer).

You'll interact with steps 3 and 4 directly later in this course — the ABI in particular becomes essential once you build a frontend in the Web3 integration track. For now, the important thing to internalize is: **the code you write is not what runs**. What runs is bytecode, generated deterministically from your source by a specific version of the compiler. And that word — *specific version* — is exactly what brings us to the pragma.

### 1.4 The pragma statement: what it actually does (and, just as importantly, what it does *not* do)

Every Solidity file conventionally begins with a line like this:

\`\`\`solidity
pragma solidity >=0.5.0 <0.9.0;
\`\`\`

Let's take this apart piece by piece, because almost every word here is doing real work.

**\`pragma\`** is a keyword borrowed conceptually from C/C++, where \`#pragma\` directives give the compiler special, compiler-specific instructions that aren't part of the "normal" language grammar. In Solidity, \`pragma solidity\` is specifically a **version pragma** — it tells the compiler "only compile this file if your version number satisfies this constraint."

Here's the part that trips up almost every newcomer, so read this sentence twice: **the pragma does not select or download a compiler version. It does not change how your code behaves. It is purely a guard clause that causes compilation to fail loudly if the version of \`solc\` currently being invoked doesn't match what the code was written and audited against.**

Why does this guard clause exist at all, and why does it matter enough to be the very first line of every file? Because Solidity, especially in its early years (roughly 0.4.x through 0.7.x), made frequent **breaking changes** between versions — not just new features, but changes to the default behavior of existing syntax. Here are three real historical examples, because abstract warnings about "breaking changes" don't stick the way concrete ones do:

- **Automatic overflow/underflow checks.** Before Solidity 0.8.0 (released December 2020), arithmetic operations like \`a - b\` or \`a + b\` on unsigned integers would silently *wrap around* on overflow or underflow — subtracting 1 from a \`uint\` currently at 0 would not throw an error, it would silently become the maximum representable value (\`2^256 - 1\`). This was a genuinely dangerous default, and multiple real-world exploits (including a notable hack of the BeautyChain / BEC token in 2018, which lost the token essentially all its value) directly exploited this behavior. Solidity 0.8.0 flipped the default: arithmetic now reverts automatically on overflow/underflow, and the old wrap-around behavior requires explicitly opting in via an \`unchecked { ... }\` block. If you compiled the exact same source file with a pre-0.8.0 compiler versus a post-0.8.0 compiler, you would get contracts with **meaningfully different security properties**, despite identical source code. The pragma exists precisely so this kind of silent, catastrophic mismatch between "what I audited" and "what actually got deployed" cannot happen without at least a compiler error forcing you to look at it.

- **Constructor syntax.** Prior to Solidity 0.4.22, constructors were declared as a function with the *same name as the contract* — \`contract Foo { function Foo() public { ... } }\`. This turned out to be a real security hazard: if a developer renamed their contract (say, from \`Foo\` to \`FooV2\`) but forgot to rename the constructor function to match, the "constructor" silently became just a regular public function, callable by *anyone, at any time, not just at deployment* — including potentially re-initializing state or reassigning ownership after the contract was already live. This exact bug is what happened to the **Rubixi** contract in 2016: a rename left a function called \`Fibonacci\` (the contract's original, previous name) as a leftover public function that anyone could call to become the contract owner. Solidity 0.4.22 introduced the dedicated \`constructor(...)\` keyword specifically to make this class of bug structurally impossible — a constructor is no longer tied to a name that can be typo'd or left stale during a rename.

- **Explicit visibility requirements.** Early Solidity allowed you to omit a function's visibility specifier, in which case it defaulted to \`public\`. This meant a developer intending to write an internal helper function, but forgetting to type \`private\` or \`internal\`, would accidentally expose it to the entire world — callable by any address, with whatever side effects that entailed. Later versions made explicit visibility mandatory precisely to eliminate "I forgot to lock this down" as a possible bug category.

Notice the pattern across all three examples: each change was made specifically to **remove a way developers were routinely shooting themselves in the foot**, at the cost of breaking backward compatibility. This is the core tension the pragma is designed to manage: language safety improves over time, but improvements that change default behavior can silently alter a codebase's security properties if you're not paying attention to *which* compiler is actually being used.

### 1.5 Reading a version constraint like a sentence, not a magic incantation

Let's return to our example and actually parse it as English, not just as syntax to memorize:

\`\`\`solidity
pragma solidity >=0.5.0 <0.9.0;
\`\`\`

This reads as: "Compile this file only with a Solidity compiler whose version is **greater than or equal to 0.5.0**, **and** less than 0.9.0." It's a range, expressed with two comparison operators joined implicitly by "and."

Solidity version numbers follow (loosely) **semantic versioning** — \`MAJOR.MINOR.PATCH\`:

- A **patch** bump (e.g. \`0.8.19\` → \`0.8.20\`) is meant to be a bug fix to the compiler itself, with no intentional language changes.
- A **minor** bump (e.g. \`0.7.x\` → \`0.8.x\`) — and note that because Solidity hasn't yet reached \`1.0.0\`, what would normally be considered "major" changes are, by convention, expressed as minor version bumps — is where the breaking changes we just discussed happen.
- Solidity has never released a \`1.0.0\`. As of this writing, \`0.8.x\` is the actively maintained line, well over three years and dozens of patch releases into its life, and it's genuinely unclear if or when a \`1.0.0\` will happen — the language has stabilized enough in practice that the version number itself has stopped being the primary signal of maturity.

You'll see several common patterns for expressing pragma constraints in the wild, each expressing a slightly different intent:

\`\`\`solidity
pragma solidity 0.8.19;              // Locked to an exact version — no flexibility at all.
pragma solidity ^0.8.19;             // "Compatible with 0.8.19" — allows 0.8.20, 0.8.21, etc.,
                                      // but NOT 0.9.0 (the caret only allows patch/minor bumps
                                      // within the same leading non-zero digit after the first).
pragma solidity >=0.8.0 <0.9.0;      // Explicit range — functionally very similar to ^0.8.0,
                                      // but the intent is spelled out rather than implied.
pragma solidity >=0.5.0 <0.9.0;      // A wide range — our example. This tells the compiler
                                      // "I believe this code is safe across a broad span of
                                      // versions," which is a much stronger (and riskier) claim.
\`\`\`

Here's a genuinely important, easy-to-miss subtlety about the caret (\`^\`) operator specifically, because it's the one most tutorials wave past: \`^0.8.19\` does **not** mean "0.8.19 or later, forever." It means "0.8.19 or later, up to (but not including) the next MINOR version bump" — and because Solidity is still pre-1.0, the caret treats the *minor* version number the way most semver-based ecosystems treat the *major* number. So \`^0.8.19\` allows \`0.8.20\` through \`0.8.999...\` but explicitly excludes \`0.9.0\`. If Solidity were already past 1.0 (say, hypothetically at \`1.4.2\`), \`^1.4.2\` would allow anything up to but not including \`2.0.0\`. This inconsistency (pre-1.0 packages treating minor bumps as breaking) is actually standard semver behavior, not a Solidity-specific quirk — it shows up identically in npm's semver ranges — but it catches people off guard the first time they see it, because intuitively \`^0.8.19\` "looks like" it should behave the same way \`^1.8.19\` would.

### 1.6 So why did *we* choose \`>=0.5.0 <0.9.0\` for this course's examples?

You might reasonably ask: if narrow, pinned versions are safer, why does so much of this course's example code use a deliberately wide range?

The honest answer is pedagogical, not a production best practice: a wide range means the exact same starter code compiles whether you're running an older locally-cached compiler or the very latest one, which matters when hundreds of thousands of learners across different environments are running this code, and we don't want version-mismatch friction getting in the way of learning the actual concept a given chapter is teaching. **This is explicitly not what you should do in a real, production, audited codebase.** In professional work — and we will change our convention starting a few chapters from now once you're comfortable with the basics — you want either:

\`\`\`solidity
pragma solidity 0.8.24;   // exact pin — the audited version, full stop, nothing else compiles this
\`\`\`

or, more commonly in modern tooling-managed projects,

\`\`\`solidity
pragma solidity ^0.8.24;  // "this minor line, patches only" — a defensible middle ground
\`\`\`

Why does this matter enough to spend a paragraph on? Because an audit — the process where a security firm manually and automatically reviews your contract for vulnerabilities before mainnet deployment, which we'll cover properly in the Security track — is performed against a **specific compiler version producing specific bytecode**. If your pragma allows a wide range and your deployment pipeline happens to pick up a different compiler version than the one that was actually audited, you have, in a very real sense, deployed *unaudited* code, even though the source text is identical to what was reviewed. This has happened to real teams. The fix is cheap (pin your version, or narrow the range, once you're past the learning phase) and the cost of not doing it is not.

### 1.7 The anatomy of a \`contract\` declaration

With the pragma out of the way, let's look at the second piece of this chapter's code:

\`\`\`solidity
contract HackerFactory {

}
\`\`\`

The \`contract\` keyword introduces a new contract type — conceptually similar to a \`class\` in Java, C++, or Python, but with two properties that have no real analog in those languages:

1. **A deployed contract has its own Ethereum address**, distinct from any user's wallet address, generated deterministically from the deploying account's address and its transaction nonce (or, for a specific advanced deployment pattern called \`CREATE2\` which we'll meet in the upgradeable-proxies track much later in this course, from a hash of the contract's bytecode and a chosen salt value — allowing you to *predict* a contract's future address before deploying it).

2. **A deployed contract has its own balance**, in the network's native currency (ETH, on Ethereum mainnet), exactly like a wallet does. A contract can receive ETH (subject to having a payable function, \`receive()\`, or \`fallback()\`, which you'll implement properly in Chapter 11 of this track), hold it indefinitely, and send it elsewhere according to whatever logic its functions implement.

This is the conceptual leap that makes smart contracts fundamentally different from "a class that runs on a server somewhere": **the contract itself is a first-class economic actor on the network**, not just a passive piece of logic invoked by some other account. When we write \`HackerFactory\`'s logic over the coming chapters, we're not writing a service that manages hackers stored in a database somewhere — we're writing an autonomous, always-on entity that lives at a specific address, forever (or until explicitly self-destructed, a mechanism we'll examine critically — and mostly warn you away from — in the security track, since Ethereum's \`SELFDESTRUCT\` opcode has itself changed behavior significantly as of the Cancun/Dencun upgrade in 2024).

An empty contract body, as we have here, is completely valid Solidity. It compiles to a small amount of bytecode (mostly boilerplate for the EVM's own bookkeeping) and is deployable — you'd get a real contract address on a real network, holding zero state and offering zero callable functions, but genuinely, permanently existing as an on-chain entity. We're starting here specifically so that in the next chapter, when we add our first state variable, you can appreciate that we're adding it to something that was already a complete, valid, deployable unit — state and behavior get layered on top of a minimal, working foundation, one deliberate addition at a time, which is exactly the pedagogical arc this entire track follows.

### 1.8 Naming conventions, and why "HackerFactory" specifically

You'll notice we're using \`PascalCase\` (also called \`UpperCamelCase\`) for our contract name: \`HackerFactory\`, not \`hackerFactory\` or \`hacker_factory\`. This isn't arbitrary — it's the convention laid out in the **official Solidity Style Guide** (part of the language's own documentation, analogous to Python's PEP 8), and it's followed with near-total consistency across the ecosystem: OpenZeppelin's contracts (\`ERC20\`, \`Ownable\`, \`AccessControl\`), Uniswap's core contracts (\`UniswapV2Pair\`, \`UniswapV3Pool\`), and essentially every serious codebase you'll read follows this same convention for contract, library, and interface names. Function and variable names, by contrast, use \`camelCase\` (\`createRandomHacker\`, \`dnaModulus\`) — you'll see this distinction reinforced constantly across this course precisely so it becomes muscle memory before you're reading unfamiliar production code and need to instantly parse "is this a type name or a variable name" from casing alone, the way experienced developers in any language do without consciously thinking about it.

As for the "Factory" naming pattern specifically: a **factory** is a well-established software design pattern (not Solidity-specific — you'll find it in Java, C#, and plenty of other object-oriented languages) referring to a piece of code whose job is to *create instances of something else*, encapsulating the creation logic so callers don't need to know the details of how a new instance gets built. Our \`HackerFactory\` contract creates new \`Hacker\` entries (you'll define that struct in Chapter 4) — it's not managing one hacker, it's the machinery that produces many, which is exactly the semantic "Factory" is meant to communicate to anyone reading your code for the first time. Good naming in smart contract development matters more than in most software, precisely because the code is public and permanent — a well-named contract on a block explorer, even one you've never seen the source of before, tells a story about its purpose before you've read a single function.

### 1.9 A brief detour: what "compiling" your homework actually triggers, end to end

Since you'll be clicking "Check Answer" throughout this course, it's worth demystifying exactly what happens when you do, so the feedback you get feels like a real compiler talking to you rather than an opaque grading script:

1. Your code, along with a set of **validation rules** specific to this chapter, gets sent to our backend.
2. Rather than running a full Solidity compilation on every keystroke (which would be slow, and honestly unnecessary for verifying conceptual understanding at this stage of the course), early chapters check your code against structural rules — does it contain the right keywords, in the right order, matching the right patterns — verifying you've expressed the *specific concept* the chapter is teaching, the same way a human reviewer glancing at your code would check for the presence of a specific construct before diving deeper.
3. Later in this course, once you're working with fuller contracts, we introduce genuine compilation and even local test-network deployment, so you experience the exact same \`solc\` compiler, the exact same error messages, and the exact same gas cost feedback that you'd get running Hardhat or Foundry locally on your own machine — because that muscle memory of reading a real compiler error is something you need before you're working unsupervised.

For *this* chapter specifically, the validation is checking for two things: the presence of the pragma statement, and a \`contract HackerFactory { ... }\` declaration with that exact name. Get both right, and you'll see \`ACCESS GRANTED\`.

### 1.10 Common mistakes at this exact stage (and why each one happens)

Having taught this exact concept to a lot of newcomers, here are the mistakes that show up most often at this stage, and — more usefully than just "here's what not to do" — *why* each one tends to happen, so you can recognize the underlying instinct in yourself before it produces a bug:

- **Forgetting the semicolon after the pragma.** Solidity, like C-family languages, is not whitespace-sensitive but *is* semicolon-terminated for most statements. Coming from a language with more forgiving syntax (or from writing a lot of Markdown/prose, which this very page is full of!) makes this an extremely easy slip. The compiler error you'd get here is unambiguous (\`ParserError: Expected ';'\`), which is exactly the kind of fast, clear feedback loop that makes learning a strict language less painful than it sounds.

- **Misnaming the contract to not exactly match what a caller expects.** Solidity contract names are case-sensitive and must match exactly wherever they're referenced — in imports, in inheritance declarations (\`contract Foo is Bar\`), and, crucially for our purposes, in how tooling (and our own validator) identifies which contract in a file is the "main" one being deployed. A contract named \`Hackerfactory\` (lowercase \`f\`) is a *completely different, valid identifier* from \`HackerFactory\` — Solidity won't warn you, because as far as the compiler is concerned, you've simply chosen a different (also valid) name.

- **Wrapping the contract body in the wrong bracket style, or forgetting to close it.** This is more of a general programming hazard than something Solidity-specific, but it's worth naming because mismatched braces produce a *cascading* error in most compilers — the first error message you see is often not the actual location of your mistake, but somewhere much later in the file where the parser finally gave up trying to make sense of an already-malformed structure. When you get a confusing error message later in this course, and it doesn't seem to correspond to anything wrong on the line it's pointing at, checking your braces one scope up is a genuinely useful first debugging instinct.

- **Assuming the pragma "installs" or "selects" a compiler**, which we addressed directly in section 1.4, but it's worth restating because it's the single most common conceptual misunderstanding at this stage: nothing about the pragma line causes any software to be downloaded, installed, or configured. It is purely a compile-time assertion, checked against whatever compiler happens to actually be invoked by your tooling (Hardhat, Foundry, Remix, or — in this course — our backend's validator).

### 1.11 A note on reading Solidity code you didn't write

Starting in this very chapter, and continuing for the rest of your career if you stay in this field, you'll spend far more time *reading* Solidity than writing it from scratch — reviewing a colleague's pull request, auditing a third-party contract before integrating with it, or investigating why a mainnet contract is behaving unexpectedly by reading its verified source directly off a block explorer like Etherscan. A skill worth deliberately building from day one: whenever you look at any Solidity file, *before* reading a single function, glance at the top three things — the pragma (what compiler behavior can I assume), the contract's inheritance list if any (\`contract Foo is Bar, Baz\` — what behavior is this contract inheriting, and from where), and the list of state variables (what does this contract actually remember between transactions). Those three things, read in about ten seconds, will orient you far faster than diving straight into function bodies — a habit every experienced Solidity engineer has, usually without consciously noticing they're doing it.

### 1.12 What's next

In the next chapter, we give \`HackerFactory\` its first piece of memory: a **state variable**. Right now, our contract is a fully valid but entirely stateless shell — deployable, addressable, but with nothing to remember. State variables are where the real cost model of blockchain development starts to bite (writing to contract storage is, gas-wise, one of the most expensive things you can do in the EVM — dramatically more expensive than an equivalent local variable in memory), and understanding exactly what you're paying for, and why, is the subject of Chapter 2.

For now: write your pragma, declare your empty \`HackerFactory\` contract, and hit \`./check_answer\`. Welcome to the terminal.

---

**Your task:** the starter code already has the pragma. Declare an empty contract named exactly \`HackerFactory\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// Declare your contract below

`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {

}
`,
            hint: "Solidity contracts use the keyword `contract` followed by the name and a pair of curly braces: `contract Name { }`.",
            validationRules: [
              { type: "contains", pattern: "pragma solidity", message: "Missing the version pragma at the top of the file." },
              { type: "regex", pattern: "contract\\s+HackerFactory\\s*\\{", message: "Declare a contract named exactly `HackerFactory`." },
            ],
            xp: 15,
          },
          {
            order: 2,
            title: "State variables",
            kind: "CODE",
            instructions: `## Chapter 2 — State Variables: Giving Your Contract a Memory

### 2.1 Why this is the single most expensive thing you'll learn in this course

Of everything you'll write in Solidity, nothing costs more gas, line for line, than writing to contract **storage**. A single storage write from zero to a non-zero value currently costs 20,000 gas (per EIP-2929's post-Berlin-hardfork accounting, which we'll unpack below) — for comparison, a simple addition of two numbers in memory costs 3 gas. That's not a rounding difference; it's a difference of roughly four orders of magnitude. Almost every gas-optimization technique you'll learn later in this course — packing variables into shared slots, caching storage reads in memory, batching writes — exists entirely because of this one fact. So before we write our first state variable, it's worth understanding *why* storage is so disproportionately expensive, because that "why" will make every future optimization technique feel like common sense instead of an arbitrary trick.

### 2.2 What "storage" physically is

Every deployed contract has its own persistent key-value store, conceptually a giant array of **2^256 storage slots**, each slot holding exactly 32 bytes (256 bits). This is not stored the way a normal server's RAM or disk is — it's replicated identically across every single full node on the network. When you write to a storage slot, you're not writing to "a computer somewhere," you're asking **every node that will ever validate the Ethereum blockchain, forever, to store that value indefinitely**. That's the actual physical reality the gas cost is pricing: writing to storage is buying a permanent, globally-replicated commitment, and the fee schedule reflects that this is a fundamentally different (and vastly more expensive) resource than temporary computation.

This is why Solidity forces such an explicit distinction between **storage** (permanent, expensive, replicated everywhere) and **memory** (temporary, cheap, exists only during the current function call, and disappears the instant that call finishes) — a distinction that simply doesn't exist in most general-purpose languages, because most general-purpose languages don't ask you to pay a globally-metered fee for persisting a value.

### 2.3 Cold and warm storage access, and why your very first read of a slot costs more than the second

Since the Berlin hardfork (April 2021, via EIP-2929), gas accounting for storage access got more granular in a way that's worth understanding even at this early stage, because it directly explains a pattern you'll adopt almost immediately: reading the same storage variable multiple times in one function is wasteful, and you should read it once into a local memory variable instead.

- A **cold** storage slot access (the first time a given transaction touches that specific slot) costs 2,100 gas to *read*, and — as mentioned — 20,000 gas for a fresh (zero to non-zero) *write*, or 5,000 gas for an update to an already-non-zero value.
- A **warm** access (any subsequent access to that same slot, within the same transaction) costs only 100 gas.

The practical consequence: if a function reads the same state variable three times, you're paying for one cold read (2,100 gas) and two warm reads (100 gas each) if you access it directly each time — versus reading it once into a local variable (one cold read) and reusing that local copy for the rest of the function (each reuse costing only 3 gas, the cost of reading a memory-resident local variable). That's the difference between roughly 2,300 gas and roughly 2,106 gas for a trivial three-variable example — and the gap widens dramatically in loops, which we'll build in Chapter 10, where re-reading a storage variable on every iteration versus caching it once outside the loop can be the difference between a function that works and a function that runs out of gas entirely on a large enough input.

You don't need to memorize these exact numbers. What you need to internalize, permanently, starting right now: **every storage read or write is a metered, non-trivial operation, and minimizing redundant storage access is one of the highest-leverage gas optimizations available to you, in almost every contract you'll ever write.**

### 2.4 Declaring your first state variable

With that cost model in mind, here's the actual syntax:

\`\`\`solidity
uint dna;
\`\`\`

Breaking this down:

- \`uint\` is the **type** — an unsigned (non-negative) integer.
- \`dna\` is the **identifier** — the name you're giving this piece of permanent storage.
- The semicolon terminates the declaration, exactly as it did for the pragma statement in Chapter 1.

Any variable declared **directly inside a contract body, outside of any function**, is automatically a state variable — stored permanently in that contract's storage, at whatever slot the compiler assigns it (we'll get to how slots get assigned, and how you can influence that assignment for gas savings, once we reach struct packing later in this track). This is different from a **local variable**, which you'll meet properly in a few chapters — a local variable is declared *inside* a function body and lives only in memory for the duration of that single function call.

### 2.5 \`uint\` vs \`uint256\`: the same type, wearing two names

You'll frequently see both \`uint\` and \`uint256\` used interchangeably in Solidity code, including in this course's own examples. That's not a mistake or an inconsistency — \`uint\` is literally defined as an **alias** for \`uint256\` (a 256-bit, i.e. 32-byte, unsigned integer) directly in the Solidity language specification. Writing \`uint dna;\` and writing \`uint256 dna;\` produce byte-for-byte identical compiled bytecode. There is no performance difference, no gas difference, no behavioral difference whatsoever between the two spellings.

So why do both exist, and which should you use? This comes down to team convention more than any technical reason:

- Some style guides (including OpenZeppelin's own contracts, which you'll use extensively starting in the Tokens track) prefer the explicit \`uint256\`, on the reasoning that being explicit about the exact bit-width leaves zero ambiguity for a reader — especially once you start working with other sizes like \`uint8\`, \`uint32\`, or \`uint128\` (which you'll meet in the Advanced Solidity track, used specifically for gas-efficient storage packing), where the bit-width genuinely matters and being in the habit of always stating it removes any doubt.
- Other teams (and a lot of educational material, including most of this course, for brevity) use the shorter \`uint\`, on the reasoning that it's the overwhelmingly common default size and spelling it out every time is unnecessary noise.

Neither convention is "more correct" — but **consistency within a single codebase matters far more than which one you pick**. A file that randomly mixes \`uint\` and \`uint256\` for no particular reason reads as sloppy to an experienced reviewer, even though it's functionally identical. Pick one per project and stick to it; we'll be reasonably consistent with plain \`uint\` throughout the free tracks of this course, and start being more explicit with sized integer types once gas optimization becomes the focus, later on.

### 2.6 The other primitive value types you'll meet very soon (a preview)

You'll only need \`uint\` for this specific chapter, but since state variables are the topic, it's worth previewing the small handful of other primitive ("value") types you'll be introduced to properly over the next few chapters, so \`uint\` doesn't feel like it exists in isolation:

- **\`bool\`** — \`true\` or \`false\`. You'll use this properly in Chapter 9.
- **\`address\`** — a 20-byte Ethereum address (either an externally-owned wallet or a deployed contract). Central to almost everything you'll build from here on — you already saw a hint of it with \`msg.sender\` in the Solidity Advanced I track.
- **\`string\`** — UTF-8 encoded text, used (as you'll see two chapters from now) for things like a hacker's name.
- **\`bytes32\`** — a fixed 32-byte sequence, often used for hashes (you already saw \`keccak256\` return one of these, cast to \`uint\`, back in the original DNA-generation chapter).
- **Enums** — a way of defining a custom type with a fixed set of named values (e.g. \`enum Rank { ScriptKiddie, CodeRunner, WhiteHat, BountyHunter, EliteHacker }\`), which we'll use properly once we build out the gamification-adjacent parts of later contracts.

Each of these gets its own dedicated, hands-on treatment later — we're naming them now so that when you see them appear, they feel like the next entry in a family you were already introduced to, not an unexplained new concept dropped in without warning.

### 2.7 Default values: what \`dna\` actually equals before you ever set it

Unlike many languages where an uninitialized variable is undefined behavior, garbage memory, or throws an error if accessed before assignment, **every Solidity state variable has a well-defined default value** the moment a contract is deployed, without you writing any explicit initialization code:

- Every numeric type (\`uint\`, \`int\`, and all their sized variants) defaults to \`0\`.
- \`bool\` defaults to \`false\`.
- \`address\` defaults to the zero address, \`0x0000000000000000000000000000000000000000\` (you'll see this written as \`address(0)\` in code — you actually already used this exact check in the security-track reentrancy and minting chapters if you've gotten that far, or will, when you do).
- \`string\` and \`bytes\` default to an empty value.
- Arrays default to empty (length zero).
- Mappings (which you'll meet in Chapter 5 of the Advanced I track, and again shortly in this same track) default to every possible key mapping to that value type's own default — meaning a \`mapping(address => uint)\` returns \`0\` for literally any address you've never explicitly set, rather than throwing an error or returning something like \`undefined\`.

This matters mechanically and not just academically: it means \`hackers.length == 0\` (an empty array) and \`dna == 0\` (a freshly-declared, never-yet-assigned integer) are both true the instant your contract is deployed, with zero gas spent explicitly initializing them — the "zero" state is free, because it's simply what an all-zeros storage slot already represents before you've ever written to it. Writing an explicit \`= 0\` to a numeric state variable at declaration is legal but genuinely pointless — you'd be spending gas to set a slot to the value it already defaults to.

### 2.8 The \`public\` keyword you haven't used yet, and why we didn't need it in Chapter 1

You may notice that later versions of \`HackerFactory\` mark some state variables \`public\` — for example, you'll shortly see \`Hacker[] public hackers;\`. Marking a state variable \`public\` does something genuinely convenient: **the compiler automatically generates a getter function for it**, with the same name as the variable, letting any external caller read its current value without you writing that function by hand. \`uint public dna;\` effectively gives you a free \`function dna() external view returns (uint)\` for nothing — the compiler writes it for you.

We're **not** marking \`dna\` public in this exact chapter, deliberately — it stays implicitly \`internal\` (the default visibility for a state variable when none is specified, meaning readable from within this contract and any contract that inherits from it, but not from outside). We'll revisit the tradeoffs of public versus internal state in a dedicated chapter once you've built enough of the contract to see a concrete case where hiding a variable from external read access actually matters (hint: it rarely matters for pure data-privacy reasons on a public blockchain — everything in storage is technically readable by anyone willing to query it directly via an RPC node, public visibility or not — but it matters a great deal for *interface design*, deciding what your contract's public "menu" of readable data should look like to another developer building against it).

### 2.9 Instance variables in other languages: a useful (and slightly misleading) analogy

If you've written Java, C++, Python, or really any object-oriented language before, a Solidity state variable will feel immediately familiar to an **instance field** — a piece of data that belongs to a particular object and persists across method calls on that same object. That analogy will serve you well for about 80% of your intuition here, and it's worth using deliberately as a bridge while you're new to this.

But push on the analogy and it breaks in an instructive way: an instance field in Java lives in RAM, disappears the moment the process running it exits, and belongs to exactly one running instance of your program at a time. A Solidity state variable lives in globally-replicated, permanent, metered storage, belongs to a contract that has its own address and balance, and persists indefinitely regardless of whether any particular computer is "running" at the time — the Ethereum network as a whole is always "running," in a sense no single Java process ever is. Keep the analogy for the shape of the idea (data that persists across calls, tied to a particular deployed entity), but actively unlearn the assumption that it's cheap, private, or ephemeral the way an instance field usually is.

### 2.10 Common mistakes at this exact stage

- **Forgetting the type entirely and just writing \`dna;\`** — Solidity requires an explicit type for every declaration; there's no type inference for state variables the way there is in languages like TypeScript or modern C++ (\`auto\`/\`var\`). You'll get a clear parser error here, but it's worth knowing why the error exists: the compiler needs to know the exact byte-width of every state variable to correctly lay out your contract's storage slots.

- **Declaring the variable inside a function by mistake.** If you accidentally write \`uint dna;\` inside a function body instead of directly inside the contract body, it becomes a **local variable** instead of a state variable — it won't persist between transactions, and (for value types like \`uint\`) it must be explicitly assigned a value before being read, or the compiler will flag it as unused/uninitialized in a way that state variables never trigger, since state variables always have that well-defined zero default we covered in section 2.7.

- **Assuming \`uint\` can hold negative numbers.** It's unsigned — the "u" is doing real work in that name. Attempting to assign a negative literal to a \`uint\` is a compile-time type error, not a runtime one; the compiler catches this before your code ever reaches the chain. If you need negative numbers, you want the signed \`int\` (or \`int256\`) type instead — we won't need one in this contract, since DNA numbers, hacker levels, and XP are all naturally non-negative quantities, but it's worth knowing it exists for when you eventually do need it.

### 2.11 What's next

In the next chapter, we introduce **constants** — values fixed at compile time that never occupy a writable storage slot at all, sidestepping the entire cost model we just spent this whole chapter unpacking. You'll see \`dnaDigits\` and \`dnaModulus\` declared as \`constant\`, and understanding *why* a constant is fundamentally cheaper than a regular state variable — not just "a little cheaper," but **inlined directly into the bytecode, with zero storage slot consumed at all** — will make Chapter 3 click almost instantly, precisely because of everything you now understand about how expensive an ordinary state variable actually is.

**Your task:** add a \`uint\` state variable named \`dna\` inside the contract.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // declare dna here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
}
`,
            hint: "Inside the contract braces, write `uint dna;` — don't forget the semicolon.",
            validationRules: [
              { type: "regex", pattern: "uint(256)?\\s+dna\\s*;", message: "Declare a state variable: `uint dna;`" },
            ],
            xp: 15,
          },
          {
            order: 3,
            title: "Math operations & constants",
            kind: "CODE",
            instructions: `## Chapter 3 — Constants: Values That Cost Nothing to Store

### 3.1 The cheapest storage slot is the one you never allocate

Chapter 2 spent a lot of words convincing you that storage is expensive — a cold write costs 20,000 gas, and every subsequent read or write to that slot carries its own metered cost, forever, for as long as the contract exists. This chapter introduces the escape hatch for an entire category of values: ones that are **known at compile time and never change**. For those, Solidity gives you \`constant\`, and the gas savings aren't incremental — they're total. A constant occupies **zero storage slots**. Its value is baked directly into the contract's bytecode wherever it's referenced, the same way a literal number would be. Reading a constant costs the same tiny amount as reading any other inlined value in your code — nowhere near the 100-2,100 gas of even a *warm* storage read.

### 3.2 Why our DNA numbers need a digit limit at all

Hacker DNA, as introduced back in the original design of this contract, is meant to be a 16-digit number — enough entropy to make DNA values feel unique and "random-ish" for the purposes of this simulated game, without needing the full, enormous range of a 256-bit integer (which can represent numbers with **78 decimal digits** — vastly more than we need, and more than would even display sensibly in a UI). We enforce that 16-digit cap using modulo arithmetic: taking any generated hash and reducing it modulo 10^16 guarantees the result always falls between 0 and 9,999,999,999,999,999 — at most 16 digits, always.

### 3.3 Declaring the digit-count constant

\`\`\`solidity
uint constant dnaDigits = 16;
\`\`\`

Let's name every piece of this:

- \`uint\` — the type, exactly as you learned in Chapter 2.
- \`constant\` — a modifier keyword marking this value as fixed at compile time and never writable again, by anyone, including the contract's own functions. Attempting to assign a new value to \`dnaDigits\` anywhere in your contract (\`dnaDigits = 17;\`) is a **compile-time error**, not a runtime revert — the compiler won't even let you build a contract that tries to mutate a constant, because doing so is a logical contradiction with what \`constant\` means.
- \`dnaDigits\` — the identifier.
- \`= 16\` — constants **must** be assigned a value at the point of declaration. This is different from a regular state variable, which (as you saw in Chapter 2) is perfectly happy sitting at its type's default value until you explicitly assign it later in some function. A constant has no "later" — it has no storage slot for a future write to target, so its value has to be nailed down immediately, in the same line where it's declared.

### 3.4 Building the modulus: \`10 ** dnaDigits\`

\`\`\`solidity
uint constant dnaModulus = 10 ** dnaDigits;
\`\`\`

The \`**\` operator is Solidity's **exponentiation** operator — \`10 ** dnaDigits\` means "10 raised to the power of \`dnaDigits\`," i.e., 10^16. Because \`dnaDigits\` is itself a constant with a value fixed at compile time, the entire expression \`10 ** dnaDigits\` is also computable at compile time — the Solidity compiler evaluates it once, during compilation, and bakes the final numeric result (10,000,000,000,000,000) directly into the bytecode. There is no exponentiation happening on-chain, at runtime, ever, for this particular constant — you're not paying gas for a \`**\` operation each time a hacker is created; you're paying nothing at all, because the number was already computed before the contract was ever deployed.

This is a subtly important point that's easy to gloss over: **constant expressions built from other constants remain fully computable at compile time**, and the compiler is smart enough to fold them down into a single literal value, no matter how many constants are chained together in the expression. This lets you write self-documenting, derived constants (\`dnaModulus\` clearly means "10 to the power of however many DNA digits we've configured," rather than a bare magic number \`10000000000000000\` that a future reader would have to reverse-engineer) with zero runtime cost for that readability.

### 3.5 The modulo operator, and why it caps a number's digit count

We haven't formally introduced \`%\` yet outside of its brief appearance in the very first version of \`_generateRandomDna\`, so let's be precise about what it does here. The **modulo operator**, \`%\`, returns the *remainder* after division. \`17 % 5\` equals \`2\`, because 5 goes into 17 three times (15), leaving a remainder of 2.

Applied to our case: for any number \`n\`, \`n % dnaModulus\` (where \`dnaModulus\` is 10^16) always returns a value strictly less than \`dnaModulus\` itself — meaning at most 16 digits, by definition of what modulo does. This is exactly why the earlier \`_generateRandomDna\` function ends with \`return rand % dnaModulus;\` — no matter how enormous the raw \`keccak256\` hash is (and it's enormous — up to 78 digits, as a full 256-bit number), taking it modulo \`dnaModulus\` deterministically compresses it down into our desired 16-digit range, using the exact constant we're declaring in this chapter.

### 3.6 \`constant\` vs a plain state variable you simply "promise not to change"

A reasonable question at this point: why not just use a regular \`uint\` state variable for \`dnaDigits\`, and simply never write a function that changes it? Wouldn't the *behavior* be identical?

Behaviorally, close — but not identical, and the differences matter:

1. **Gas.** A regular state variable, even one you never intend to modify after deployment, still consumes a storage slot and still costs the full cold-read gas price (2,100 gas, per Chapter 2's breakdown) every single time any function reads it. A \`constant\` costs essentially nothing to read — it's inlined as a literal, the same as if you'd typed \`16\` directly in the code. Across potentially thousands or millions of calls to a popular contract over its lifetime, this genuinely adds up to meaningful real-world cost savings for your users.

2. **Compiler-enforced immutability, not developer discipline.** "I promise not to write a function that changes this" is a convention that depends entirely on every future contributor to your codebase (including yourself, six months from now, tired, mid-refactor) remembering and respecting that promise. \`constant\` makes it a compiler-enforced guarantee instead — nobody can accidentally introduce a setter for a value that was never meant to be mutable, because the compiler will simply refuse to build the contract if they try.

3. **Signal to readers.** When another developer (or an auditor, doing exactly the kind of security review we discussed as high-stakes back in the very first Crypto Fundamentals chapter of this course) sees \`uint constant dnaDigits = 16;\`, they immediately know, with total certainty and without needing to trace through every function in the contract, that this value is fixed forever. That's valuable information, conveyed instantly, that a regular state variable simply can't provide — a reader would have to manually verify no function anywhere in the (possibly very large) contract ever assigns to it.

### 3.7 A note on \`constant\` versus \`immutable\` (a preview)

You'll meet a close cousin of \`constant\` later in this course: the \`immutable\` keyword (introduced in Solidity 0.6.5), used for values that are fixed **once, at deployment time** (typically inside the constructor), rather than fixed at compile time. The distinction: \`constant\` values must be known when you *write* the code (like our \`16\`); \`immutable\` values can depend on something only known when the contract is *deployed* (like \`msg.sender\` inside a constructor, capturing "whoever deployed this specific instance" — a value that's different for every deployment, but never changes again after that one deployment completes). Both share the property of never being writable again after their one initialization point, and both avoid the ongoing storage-slot cost of a regular state variable. We're flagging \`immutable\` now, by name, purely so it doesn't feel like an unrelated surprise when it shows up — you'll get its full hands-on treatment once we reach a chapter where deployment-time-but-not-compile-time-known values actually come up.

### 3.8 Common mistakes at this exact stage

- **Forgetting the \`= value\` at declaration.** Since \`constant\` variables have no storage slot to be assigned later, omitting the initial value is a compile error, not a "starts at zero" situation the way an uninitialized regular state variable would behave. The compiler needs that value immediately, because there is no other point in the contract's lifecycle where it could ever be provided.

- **Trying to compute a constant from something only known at runtime.** \`uint constant deployTime = block.timestamp;\` will not compile — \`block.timestamp\` (the timestamp of whatever block eventually mines this contract's deployment transaction) isn't known until deployment actually happens, which is fundamentally *after* compilation, not before. This is exactly the kind of case \`immutable\`, mentioned above, exists to handle instead — we'll get there.

- **Assuming \`constant\` variables can be reassigned by owner-only functions "just this once."** No exception exists for this, by design, no matter how privileged the caller. If a value genuinely needs to be changeable under some governance or admin process later in a contract's life, it needs to be a regular (or specially-patterned, upgradeable) state variable from the start — retrofitting a \`constant\` into something mutable after the fact requires deploying an entirely new contract, since the old one's bytecode has that value permanently baked in.

### 3.9 What's next

With \`dnaDigits\` and \`dnaModulus\` in place, Chapter 4 introduces **structs** — a way to bundle multiple related pieces of data (a hacker's name *and* their DNA number, together) into one custom type, instead of tracking them as separate, easy-to-desynchronize variables. This is the first moment \`HackerFactory\` starts to feel like it's actually modeling something, rather than just holding a loose pile of individual numbers.

**Your task:** declare both \`dnaDigits\` and \`dnaModulus\` as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;

  // add dnaDigits and dnaModulus here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;
}
`,
            hint: "`uint constant dnaDigits = 16;` then `uint constant dnaModulus = 10 ** dnaDigits;`",
            validationRules: [
              { type: "regex", pattern: "uint\\s+constant\\s+dnaDigits\\s*=\\s*16\\s*;", message: "Declare `uint constant dnaDigits = 16;`" },
              { type: "regex", pattern: "uint\\s+constant\\s+dnaModulus\\s*=\\s*10\\s*\\*\\*\\s*dnaDigits\\s*;", message: "Declare `uint constant dnaModulus = 10 ** dnaDigits;`" },
            ],
            xp: 15,
          },
          {
            order: 4,
            title: "Structs",
            kind: "CODE",
            instructions: `## Chapter 4 — The Hacker struct

We need a data type to represent a hacker: a name and their DNA number. Solidity's \`struct\` lets us bundle multiple fields into one custom type.

\`\`\`solidity
struct Hacker {
  string name;
  uint dna;
}
\`\`\`

**Your task:** define a \`struct\` named \`Hacker\` with a \`string name\` field and a \`uint dna\` field, in that order.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  // define the Hacker struct here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }
}
`,
            hint: "`struct Hacker { string name; uint dna; }`",
            validationRules: [
              { type: "regex", pattern: "struct\\s+Hacker\\s*\\{[\\s\\S]*string\\s+name\\s*;[\\s\\S]*uint\\s+dna\\s*;[\\s\\S]*\\}", message: "Define `struct Hacker { string name; uint dna; }`." },
            ],
            xp: 20,
          },
          {
            order: 5,
            title: "Arrays",
            kind: "CODE",
            instructions: `## Chapter 5 — The roster array

We need somewhere to store every \`Hacker\` we create. A **dynamic array** grows as you push new entries — perfect for a public roster.

\`\`\`solidity
Hacker[] public hackers;
\`\`\`

Marking it \`public\` automatically generates a getter function, so anyone can read \`hackers(i)\` from outside the contract.

**Your task:** declare a public dynamic array of \`Hacker\` named \`hackers\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  // declare the hackers array here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;
}
`,
            hint: "`Hacker[] public hackers;`",
            validationRules: [
              { type: "regex", pattern: "Hacker\\[\\]\\s+public\\s+hackers\\s*;", message: "Declare `Hacker[] public hackers;`" },
            ],
            xp: 20,
          },
          {
            order: 6,
            title: "Function declarations & private keyword",
            kind: "CODE",
            instructions: `## Chapter 6 — createHacker

Time to write a function that creates a new hacker and pushes it into the array.

Solidity functions default to \`public\` and specify visibility explicitly. We'll make this one \`private\` — only callable from inside this contract — since we'll wrap it with a public-facing function later.

\`\`\`solidity
function _createHacker(string memory _name, uint _dna) private {
  hackers.push(Hacker(_name, _dna));
}
\`\`\`

Notes:
- Parameters starting with \`_\` is a Solidity naming convention for function arguments, to distinguish them from state variables.
- \`string memory\` — strings passed as arguments must specify a **data location**; \`memory\` means it's temporary, not persisted to storage.
- \`hackers.push(Hacker(_name, _dna))\` constructs a \`Hacker\` struct inline and appends it to the array.

**Your task:** write the \`_createHacker\` function exactly as shown above.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  // write _createHacker here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
  }
}
`,
            hint: "`function _createHacker(string memory _name, uint _dna) private { hackers.push(Hacker(_name, _dna)); }`",
            validationRules: [
              { type: "regex", pattern: "function\\s+_createHacker\\s*\\(\\s*string\\s+memory\\s+_name\\s*,\\s*uint\\s+_dna\\s*\\)\\s+private\\s*\\{", message: "Function signature must be `function _createHacker(string memory _name, uint _dna) private {`" },
              { type: "contains", pattern: "hackers.push(Hacker(_name, _dna));", message: "Push a new `Hacker(_name, _dna)` onto the `hackers` array." },
            ],
            xp: 25,
          },
          {
            order: 7,
            title: "Events",
            kind: "CODE",
            instructions: `## Chapter 7 — Emitting events

Contracts can't easily "return" data to a frontend listening in real time — instead they **emit events**, which get logged on the blockchain and picked up by anything watching (like a dApp UI).

Declare an event and fire it whenever a hacker is created:

\`\`\`solidity
event NewHacker(uint hackerId, string name, uint dna);
\`\`\`

Then, inside \`_createHacker\`, after pushing to the array, emit it with the new hacker's index and details. Array length minus 1 is the index we just pushed to.

**Your task:** declare \`event NewHacker(uint hackerId, string name, uint dna);\` and emit it at the end of \`_createHacker\` as \`emit NewHacker(hackers.length - 1, _name, _dna);\``,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  // declare the event here

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    // emit the event here
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    emit NewHacker(hackers.length - 1, _name, _dna);
  }
}
`,
            hint: "Declare the event above the function, and add `emit NewHacker(hackers.length - 1, _name, _dna);` as the last line of the function body.",
            validationRules: [
              { type: "regex", pattern: "event\\s+NewHacker\\s*\\(\\s*uint\\s+hackerId\\s*,\\s*string\\s+name\\s*,\\s*uint\\s+dna\\s*\\)\\s*;", message: "Declare `event NewHacker(uint hackerId, string name, uint dna);`" },
              { type: "contains", pattern: "emit NewHacker(hackers.length - 1, _name, _dna);", message: "Emit the event after pushing: `emit NewHacker(hackers.length - 1, _name, _dna);`" },
              { type: "order", before: "hackers.push(Hacker(_name, _dna));", after: "emit NewHacker(hackers.length - 1, _name, _dna);", message: "Emit the event *after* pushing the new hacker." },
            ],
            xp: 25,
          },
          {
            order: 8,
            title: "Keccak256 & typecasting",
            kind: "CODE",
            instructions: `## Chapter 8 — Generating random-ish DNA

We want to turn a hacker's chosen name into a pseudo-random 16-digit DNA number. Solidity has a built-in hash function, \`keccak256\`, which takes any input and returns a 256-bit hash.

\`\`\`solidity
function _generateRandomDna(string memory _str) private view returns (uint) {
  uint rand = uint(keccak256(abi.encodePacked(_str)));
  return rand % dnaModulus;
}
\`\`\`

Notes:
- \`abi.encodePacked(_str)\` packs the string into bytes for hashing.
- \`keccak256(...)\` returns \`bytes32\`; we \`uint(...)\` cast it to a number.
- \`% dnaModulus\` truncates it down to 16 digits.
- This is **view** because it reads state (\`dnaModulus\`) but doesn't modify it.

**Your task:** implement \`_generateRandomDna\` exactly as shown, taking a \`string memory _str\` and returning a \`uint\`.

⚠️ Note for later: on-chain "randomness" like this is actually predictable and exploitable — we'll cover that properly in the Security track.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    emit NewHacker(hackers.length - 1, _name, _dna);
  }

  // write _generateRandomDna here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    emit NewHacker(hackers.length - 1, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }
}
`,
            hint: "`uint rand = uint(keccak256(abi.encodePacked(_str)));` then `return rand % dnaModulus;`",
            validationRules: [
              { type: "regex", pattern: "function\\s+_generateRandomDna\\s*\\(\\s*string\\s+memory\\s+_str\\s*\\)\\s+private\\s+view\\s+returns\\s*\\(\\s*uint\\s*\\)", message: "Function signature must be `function _generateRandomDna(string memory _str) private view returns (uint)`." },
              { type: "contains", pattern: "keccak256(abi.encodePacked(_str))", message: "Hash the input with `keccak256(abi.encodePacked(_str))`." },
              { type: "contains", pattern: "% dnaModulus", message: "Truncate the hash to 16 digits with `% dnaModulus`." },
            ],
            xp: 30,
          },
          {
            order: 9,
            title: "Booleans and if/else",
            kind: "CODE",
            instructions: `## Chapter 9 — Rank gating with if/else

Solidity has a plain \`bool\` type and standard \`if\`/\`else\` control flow, exactly like most C-family languages.

Let's gate an action behind a hacker's level. Add a function that returns whether a hacker (by DNA-derived level, passed directly for simplicity here) is allowed to run an exploit:

\`\`\`solidity
function canRunExploit(uint _level) public pure returns (bool) {
  if (_level >= 5) {
    return true;
  } else {
    return false;
  }
}
\`\`\`

**Your task:** implement \`canRunExploit\` exactly as shown — a \`uint\` in, a \`bool\` out, using \`if\`/\`else\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // implement canRunExploit here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  function canRunExploit(uint _level) public pure returns (bool) {
    if (_level >= 5) {
      return true;
    } else {
      return false;
    }
  }
}
`,
            hint: "`function canRunExploit(uint _level) public pure returns (bool) { if (_level >= 5) { return true; } else { return false; } }`",
            validationRules: [
              { type: "regex", pattern: "function\\s+canRunExploit\\s*\\(\\s*uint\\s+_level\\s*\\)\\s+public\\s+pure\\s+returns\\s*\\(\\s*bool\\s*\\)", message: "Function signature must be `function canRunExploit(uint _level) public pure returns (bool)`." },
              { type: "contains", pattern: "if (_level >= 5)", message: "Check `if (_level >= 5)`." },
              { type: "contains", pattern: "return true;", message: "Return `true` in the `if` branch." },
              { type: "contains", pattern: "return false;", message: "Return `false` in the `else` branch." },
            ],
            xp: 20,
          },
          {
            order: 10,
            title: "for loops",
            kind: "CODE",
            instructions: `## Chapter 10 — Counting hackers by name prefix

Solidity supports standard \`for\` loops. They're common when iterating over arrays in storage or memory — though be careful with unbounded loops over storage arrays in production code, since gas cost scales with array length (we'll cover that risk properly in the security track).

Add a helper that counts how many hackers exist with DNA below a threshold, given an array passed in memory:

\`\`\`solidity
function countBelowDna(uint[] memory _dnas, uint _threshold) public pure returns (uint) {
  uint count = 0;
  for (uint i = 0; i < _dnas.length; i++) {
    if (_dnas[i] < _threshold) {
      count++;
    }
  }
  return count;
}
\`\`\`

**Your task:** implement \`countBelowDna\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // implement countBelowDna here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  function countBelowDna(uint[] memory _dnas, uint _threshold) public pure returns (uint) {
    uint count = 0;
    for (uint i = 0; i < _dnas.length; i++) {
      if (_dnas[i] < _threshold) {
        count++;
      }
    }
    return count;
  }
}
`,
            hint: "Loop with `for (uint i = 0; i < _dnas.length; i++)`, and inside, `if (_dnas[i] < _threshold) { count++; }`.",
            validationRules: [
              { type: "regex", pattern: "function\\s+countBelowDna\\s*\\(\\s*uint\\[\\]\\s+memory\\s+_dnas\\s*,\\s*uint\\s+_threshold\\s*\\)\\s+public\\s+pure\\s+returns\\s*\\(\\s*uint\\s*\\)", message: "Function signature must be `function countBelowDna(uint[] memory _dnas, uint _threshold) public pure returns (uint)`." },
              { type: "regex", pattern: "for\\s*\\(\\s*uint\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*_dnas\\.length\\s*;\\s*i\\+\\+\\s*\\)", message: "Loop with `for (uint i = 0; i < _dnas.length; i++)`." },
              { type: "contains", pattern: "if (_dnas[i] < _threshold)", message: "Check `if (_dnas[i] < _threshold)` inside the loop." },
              { type: "contains", pattern: "count++;", message: "Increment `count++;` when the condition matches." },
            ],
            xp: 20,
          },
          {
            order: 11,
            title: "while loops",
            kind: "CODE",
            instructions: `## Chapter 11 — while loops

\`while\` loops run as long as a condition holds — useful when the number of iterations isn't known ahead of time (unlike a \`for\` loop over a fixed-length array).

Write a function that keeps halving a number until it drops below 1, counting the steps — a rough "how many times can this DNA be split" utility:

\`\`\`solidity
function halvingSteps(uint _n) public pure returns (uint) {
  uint steps = 0;
  uint n = _n;
  while (n > 1) {
    n = n / 2;
    steps++;
  }
  return steps;
}
\`\`\`

**Your task:** implement \`halvingSteps\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // implement halvingSteps here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  function halvingSteps(uint _n) public pure returns (uint) {
    uint steps = 0;
    uint n = _n;
    while (n > 1) {
      n = n / 2;
      steps++;
    }
    return steps;
  }
}
`,
            hint: "`while (n > 1) { n = n / 2; steps++; }` — remember to copy `_n` into a local `n` first since you can't reassign a memory-passed value parameter... actually you can, but copying makes intent clearer.",
            validationRules: [
              { type: "regex", pattern: "function\\s+halvingSteps\\s*\\(\\s*uint\\s+_n\\s*\\)\\s+public\\s+pure\\s+returns\\s*\\(\\s*uint\\s*\\)", message: "Function signature must be `function halvingSteps(uint _n) public pure returns (uint)`." },
              { type: "contains", pattern: "while (n > 1)", message: "Loop with `while (n > 1)`." },
              { type: "contains", pattern: "n = n / 2;", message: "Halve `n` each iteration: `n = n / 2;`" },
              { type: "contains", pattern: "steps++;", message: "Increment `steps++;` each iteration." },
            ],
            xp: 20,
          },
          {
            order: 12,
            title: "Data locations: memory, storage, calldata",
            kind: "QUIZ",
            instructions: `## Chapter 12 — Where does data actually live?

Solidity requires you to be explicit about **where** complex types (arrays, structs, strings, mappings) live, because that determines cost and mutability:

- **storage** — permanent, on-chain, expensive to write. State variables are storage by default.
- **memory** — temporary, exists only during the function call, cheaper. Function parameters/locals for complex types must specify this (or calldata).
- **calldata** — like memory, but read-only and even cheaper — used for external function parameters that are never modified.

Assigning a \`storage\` reference to a local variable creates an **alias** — mutating it mutates the original state. Assigning a \`memory\` value copies it — mutating the copy does nothing to the original.

**Question:** If a function does \`Hacker storage h = hackers[0]; h.name = "neo";\`, what happens to \`hackers[0]\` in contract storage?`,
            quizOptions: [
              "Nothing — h is a separate copy",
              "hackers[0].name is permanently changed to \"neo\", since h is an alias to the same storage slot",
              "It throws a compile error",
              "It only changes for the duration of the transaction",
            ],
            quizAnswer: "hackers[0].name is permanently changed to \"neo\", since h is an alias to the same storage slot",
            xp: 25,
          },
          {
            order: 13,
            title: "Function visibility deep dive",
            kind: "QUIZ",
            instructions: `## Chapter 13 — public, external, internal, private

Four visibility levels control who can call a function:

- **public** — callable from anywhere: other functions in this contract, derived contracts, and external accounts/contracts.
- **external** — callable only from *outside* the contract (other contracts, transactions) — slightly cheaper for functions with large array/struct arguments since they read straight from calldata.
- **internal** — callable from this contract and contracts that inherit from it, but not from outside.
- **private** — callable only from within this exact contract, not even by child contracts.

We used \`private\` for \`_createHacker\` and \`_generateRandomDna\` specifically so nothing outside — not even a future subclass — could call them directly and bypass \`createRandomHacker\`'s validation.

**Question:** Why did we mark the DNA-generation and hacker-creation helpers \`private\` instead of \`public\`?`,
            quizOptions: [
              "private functions use less gas than public ones",
              "To force all hacker creation through createRandomHacker, so its require() guards (like the name-taken check) can't be bypassed by calling the helpers directly",
              "Solidity requires helper functions to be private",
              "private functions can't be tested",
            ],
            quizAnswer: "To force all hacker creation through createRandomHacker, so its require() guards (like the name-taken check) can't be bypassed by calling the helpers directly",
            xp: 20,
          },
          {
            order: 14,
            title: "Array operations: push, pop, delete",
            kind: "CODE",
            instructions: `## Chapter 14 — Retiring a hacker

Dynamic storage arrays support \`.push()\` (append), \`.pop()\` (remove the last element and shrink length), and \`delete arr[i]\` (reset that slot to its default value **without** shrinking the array or shifting later elements).

Add a function that "retires" the most recently created hacker by popping them off the roster:

\`\`\`solidity
function retireLastHacker() public {
  require(hackers.length > 0);
  hackers.pop();
}
\`\`\`

**Your task:** implement \`retireLastHacker\` exactly as shown, guarding against popping an empty array.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  struct Hacker { string name; uint dna; }
  Hacker[] public hackers;

  // implement retireLastHacker here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  struct Hacker { string name; uint dna; }
  Hacker[] public hackers;

  function retireLastHacker() public {
    require(hackers.length > 0);
    hackers.pop();
  }
}
`,
            hint: "`require(hackers.length > 0);` then `hackers.pop();`",
            validationRules: [
              { type: "regex", pattern: "function\\s+retireLastHacker\\s*\\(\\s*\\)\\s+public", message: "Function signature must be `function retireLastHacker() public`." },
              { type: "contains", pattern: "require(hackers.length > 0);", message: "Guard with `require(hackers.length > 0);` before popping." },
              { type: "contains", pattern: "hackers.pop();", message: "Remove the last hacker with `hackers.pop();`" },
              { type: "order", before: "require(hackers.length > 0);", after: "hackers.pop();", message: "Check the array isn't empty before popping." },
            ],
            xp: 20,
          },
          {
            order: 15,
            title: "Fixed-size vs dynamic arrays",
            kind: "QUIZ",
            instructions: `## Chapter 15 — uint[5] vs uint[]

Solidity has two array flavors:

- **Fixed-size**: \`uint[5] scores;\` — length baked in at compile time, can't grow or shrink, slightly cheaper gas since the size never needs to be tracked.
- **Dynamic**: \`uint[] scores;\` — length can change at runtime via \`push\`/\`pop\`, but the EVM needs to track that length alongside the data.

We used \`Hacker[] public hackers\` (dynamic) because we don't know ahead of time how many hackers will ever be created — a fixed-size array would cap the roster permanently at whatever size we chose.

**Question:** When would a fixed-size array be the better choice over a dynamic one?`,
            quizOptions: [
              "Never — dynamic arrays are strictly better",
              "When the number of elements is known and constant for the life of the contract (e.g. \"top 3 leaderboard slots\"), avoiding the overhead of length tracking",
              "Fixed-size arrays are required for structs",
              "Only when storing strings",
            ],
            quizAnswer: "When the number of elements is known and constant for the life of the contract (e.g. \"top 3 leaderboard slots\"), avoiding the overhead of length tracking",
            xp: 20,
          },
          {
            order: 16,
            title: "Nested mappings",
            kind: "CODE",
            instructions: `## Chapter 16 — Tracking exploits per hacker

Mappings can nest, letting you model relationships like "for each hacker, for each exploit ID, has it been used?"

\`\`\`solidity
mapping(uint => mapping(uint => bool)) public exploitUsed;

function useExploit(uint _hackerId, uint _exploitId) public {
  exploitUsed[_hackerId][_exploitId] = true;
}
\`\`\`

**Your task:** declare the nested mapping and implement \`useExploit\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // declare the nested mapping here

  // implement useExploit here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  mapping(uint => mapping(uint => bool)) public exploitUsed;

  function useExploit(uint _hackerId, uint _exploitId) public {
    exploitUsed[_hackerId][_exploitId] = true;
  }
}
`,
            hint: "`mapping(uint => mapping(uint => bool)) public exploitUsed;` then `exploitUsed[_hackerId][_exploitId] = true;`",
            validationRules: [
              { type: "regex", pattern: "mapping\\s*\\(\\s*uint\\s*=>\\s*mapping\\s*\\(\\s*uint\\s*=>\\s*bool\\s*\\)\\s*\\)\\s+public\\s+exploitUsed\\s*;", message: "Declare `mapping(uint => mapping(uint => bool)) public exploitUsed;`" },
              { type: "contains", pattern: "exploitUsed[_hackerId][_exploitId] = true;", message: "Set `exploitUsed[_hackerId][_exploitId] = true;`" },
            ],
            xp: 25,
          },
        ],
      },
    ],
  },
  {
    slug: "solidity-advanced-1",
    title: "Free Track — Solidity Advanced I",
    description: "msg.sender, require, inheritance, and interfaces.",
    order: 3,
    isPremium: false,
    lessons: [
      {
        slug: "solidity-advanced-1",
        title: "Solidity Advanced I",
        summary: "Public-facing functions, ownership via msg.sender, inheritance, and interfaces.",
        order: 1,
        isPremium: false,
        badgeName: "White Hat Cert",
        badgeGlyph: "<#>",
        xpReward: 200,
        chapters: [
          {
            order: 1,
            title: "The public createRandomHacker function",
            kind: "CODE",
            instructions: `## Chapter 1 — Public entry point

We've built \`_createHacker\` (private) and \`_generateRandomDna\` (private). Now let's expose a public function users actually call:

\`\`\`solidity
function createRandomHacker(string memory _name) public {
  uint randDna = _generateRandomDna(_name);
  _createHacker(_name, randDna);
}
\`\`\`

**Your task:** add this exact function to the contract (below the two private functions, which are assumed to already exist for validation purposes — write only this function).`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    emit NewHacker(hackers.length - 1, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  // add createRandomHacker here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint dna;
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    emit NewHacker(hackers.length - 1, _name, _dna);
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createRandomHacker(string memory _name) public {
    uint randDna = _generateRandomDna(_name);
    _createHacker(_name, randDna);
  }
}
`,
            hint: "`function createRandomHacker(string memory _name) public { uint randDna = _generateRandomDna(_name); _createHacker(_name, randDna); }`",
            validationRules: [
              { type: "regex", pattern: "function\\s+createRandomHacker\\s*\\(\\s*string\\s+memory\\s+_name\\s*\\)\\s+public", message: "Function signature must be `function createRandomHacker(string memory _name) public`." },
              { type: "contains", pattern: "_generateRandomDna(_name)", message: "Call `_generateRandomDna(_name)` to get the DNA." },
              { type: "contains", pattern: "_createHacker(_name, randDna);", message: "Call `_createHacker(_name, randDna);` to persist the hacker." },
            ],
            xp: 20,
          },
          {
            order: 2,
            title: "msg.sender",
            kind: "CODE",
            instructions: `## Chapter 2 — Who's calling?

Every call into a contract carries \`msg.sender\` — the address of whoever (or whatever contract) invoked the current function. It's the Solidity equivalent of "who is this."

Let's track ownership: add a mapping from hacker index to owner address, and record it whenever a hacker is created.

\`\`\`solidity
mapping(uint => address) public hackerToOwner;
\`\`\`

Then inside \`_createHacker\`, after pushing, record: \`hackerToOwner[hackers.length - 1] = msg.sender;\`

**Your task:** add the mapping and the assignment.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  // add the mapping here

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    // record ownership here
    emit NewHacker(hackers.length - 1, _name, _dna);
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker {
    string name;
    uint dna;
  }

  Hacker[] public hackers;

  mapping(uint => address) public hackerToOwner;

  event NewHacker(uint hackerId, string name, uint dna);

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
    hackerToOwner[hackers.length - 1] = msg.sender;
    emit NewHacker(hackers.length - 1, _name, _dna);
  }
}
`,
            hint: "`mapping(uint => address) public hackerToOwner;` and `hackerToOwner[hackers.length - 1] = msg.sender;`",
            validationRules: [
              { type: "regex", pattern: "mapping\\s*\\(\\s*uint\\s*=>\\s*address\\s*\\)\\s+public\\s+hackerToOwner\\s*;", message: "Declare `mapping(uint => address) public hackerToOwner;`" },
              { type: "contains", pattern: "hackerToOwner[hackers.length - 1] = msg.sender;", message: "Assign ownership: `hackerToOwner[hackers.length - 1] = msg.sender;`" },
            ],
            xp: 25,
          },
          {
            order: 3,
            title: "require()",
            kind: "CODE",
            instructions: `## Chapter 3 — Guard clauses with require

\`require()\` checks a condition and reverts the whole transaction (refunding remaining gas) if it's false. It's your first line of defense against invalid input or unauthorized calls.

Let's stop hackers from registering the same name twice. Add a mapping tracking whether a name is taken, and require it isn't, at the top of \`createRandomHacker\`:

\`\`\`solidity
mapping(string => bool) nameTaken;

function createRandomHacker(string memory _name) public {
  require(!nameTaken[_name]);
  nameTaken[_name] = true;
  uint randDna = _generateRandomDna(_name);
  _createHacker(_name, randDna);
}
\`\`\`

**Your task:** add the \`nameTaken\` mapping and the \`require\` guard as shown, keeping the rest of \`createRandomHacker\` intact.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker { string name; uint dna; }
  Hacker[] public hackers;

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    return uint(keccak256(abi.encodePacked(_str))) % dnaModulus;
  }

  // add nameTaken mapping here

  function createRandomHacker(string memory _name) public {
    // add the require guard here
    uint randDna = _generateRandomDna(_name);
    _createHacker(_name, randDna);
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  uint constant dnaDigits = 16;
  uint constant dnaModulus = 10 ** dnaDigits;

  struct Hacker { string name; uint dna; }
  Hacker[] public hackers;

  function _createHacker(string memory _name, uint _dna) private {
    hackers.push(Hacker(_name, _dna));
  }

  function _generateRandomDna(string memory _str) private view returns (uint) {
    return uint(keccak256(abi.encodePacked(_str))) % dnaModulus;
  }

  mapping(string => bool) nameTaken;

  function createRandomHacker(string memory _name) public {
    require(!nameTaken[_name]);
    nameTaken[_name] = true;
    uint randDna = _generateRandomDna(_name);
    _createHacker(_name, randDna);
  }
}
`,
            hint: "`mapping(string => bool) nameTaken;` then inside the function: `require(!nameTaken[_name]); nameTaken[_name] = true;` before generating DNA.",
            validationRules: [
              { type: "regex", pattern: "mapping\\s*\\(\\s*string\\s*=>\\s*bool\\s*\\)\\s+nameTaken\\s*;", message: "Declare `mapping(string => bool) nameTaken;`" },
              { type: "contains", pattern: "require(!nameTaken[_name]);", message: "Guard the function with `require(!nameTaken[_name]);`" },
              { type: "contains", pattern: "nameTaken[_name] = true;", message: "Mark the name as taken: `nameTaken[_name] = true;`" },
              { type: "order", before: "require(!nameTaken[_name]);", after: "_generateRandomDna(_name)", message: "The `require` guard must run before generating DNA." },
            ],
            xp: 25,
          },
          {
            order: 4,
            title: "Inheritance",
            kind: "CODE",
            instructions: `## Chapter 4 — Splitting into Ownable

As contracts grow, we split responsibilities across multiple contracts and use **inheritance** to combine them, just like OOP classes.

Create a simple \`Ownable\` base contract that tracks an owner address:

\`\`\`solidity
contract Ownable {
  address owner;

  constructor() {
    owner = msg.sender;
  }
}
\`\`\`

Then make \`HackerFactory\` inherit from it using \`is\`:

\`\`\`solidity
contract HackerFactory is Ownable {
  // ...
}
\`\`\`

**Your task:** write both contracts — \`Ownable\` with a constructor setting \`owner = msg.sender;\`, and \`HackerFactory\` declared with \`is Ownable\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// define Ownable here

contract HackerFactory /* inherit here */ {
  Hacker[] public hackers;
  struct Hacker { string name; uint dna; }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Ownable {
  address owner;

  constructor() {
    owner = msg.sender;
  }
}

contract HackerFactory is Ownable {
  Hacker[] public hackers;
  struct Hacker { string name; uint dna; }
}
`,
            hint: "Define `contract Ownable { address owner; constructor() { owner = msg.sender; } }` above, then declare `contract HackerFactory is Ownable { ... }`.",
            validationRules: [
              { type: "regex", pattern: "contract\\s+Ownable\\s*\\{[\\s\\S]*address\\s+owner\\s*;[\\s\\S]*constructor\\s*\\(\\s*\\)\\s*\\{[\\s\\S]*owner\\s*=\\s*msg\\.sender\\s*;", message: "Define `Ownable` with an `address owner;` and a constructor setting `owner = msg.sender;`." },
              { type: "regex", pattern: "contract\\s+HackerFactory\\s+is\\s+Ownable\\s*\\{", message: "Declare `contract HackerFactory is Ownable {`." },
            ],
            xp: 25,
          },
          {
            order: 5,
            title: "Interfaces",
            kind: "CODE",
            instructions: `## Chapter 5 — Talking to contracts you don't own

Sometimes you need to call a function on another deployed contract without having its full source — just its function signatures. That's an **interface**.

\`\`\`solidity
interface ExploitRegistry {
  function isKnownExploit(uint code) external view returns (bool);
}
\`\`\`

An interface has no implementation — only function signatures marked \`external\`. Any contract that matches this shape can be called through it, given its address.

**Your task:** declare exactly this interface, named \`ExploitRegistry\`, with the single function \`isKnownExploit(uint code) external view returns (bool)\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// declare the ExploitRegistry interface here
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

interface ExploitRegistry {
  function isKnownExploit(uint code) external view returns (bool);
}
`,
            hint: "`interface ExploitRegistry { function isKnownExploit(uint code) external view returns (bool); }`",
            validationRules: [
              { type: "regex", pattern: "interface\\s+ExploitRegistry\\s*\\{", message: "Declare `interface ExploitRegistry {`." },
              { type: "regex", pattern: "function\\s+isKnownExploit\\s*\\(\\s*uint\\s+code\\s*\\)\\s+external\\s+view\\s+returns\\s*\\(\\s*bool\\s*\\)\\s*;", message: "Declare `function isKnownExploit(uint code) external view returns (bool);` inside the interface." },
            ],
            xp: 25,
          },
          {
            order: 6,
            title: "Import statements",
            kind: "CODE",
            instructions: `## Chapter 6 — Splitting files with import

Real projects split contracts across files. To use \`Ownable\` from a separate file \`ownable.sol\` inside \`hackerfactory.sol\`, you'd write:

\`\`\`solidity
import "./ownable.sol";
\`\`\`

This keeps each file focused and reusable — exactly how OpenZeppelin's battle-tested contracts (which you'll use in later lessons) are structured.

**Your task:** on the first line after the pragma, add \`import "./ownable.sol";\` — treat this as the top of \`hackerfactory.sol\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// import ownable.sol here

contract HackerFactory is Ownable {
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

import "./ownable.sol";

contract HackerFactory is Ownable {
}
`,
            hint: `Add the line: import "./ownable.sol";`,
            validationRules: [
              { type: "contains", pattern: `import "./ownable.sol";`, message: `Add \`import "./ownable.sol";\` below the pragma.` },
            ],
            xp: 20,
          },
          {
            order: 7,
            title: "Abstract contracts",
            kind: "CODE",
            instructions: `## Chapter 7 — Defining a shape without an implementation

An **abstract** contract declares at least one function without a body — it can't be deployed on its own, only inherited from. It's the middle ground between a full interface (no implementation at all) and a normal contract (everything implemented).

\`\`\`solidity
abstract contract ExploitBase {
  function severity() public view virtual returns (uint);

  function isCritical() public view returns (bool) {
    return severity() >= 9;
  }
}
\`\`\`

Notice \`isCritical\` **is** implemented and calls the not-yet-implemented \`severity()\` — child contracts only need to fill in \`severity\`, and get \`isCritical\` for free.

**Your task:** declare \`abstract contract ExploitBase\` exactly as shown, with both functions.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// declare ExploitBase here
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

abstract contract ExploitBase {
  function severity() public view virtual returns (uint);

  function isCritical() public view returns (bool) {
    return severity() >= 9;
  }
}
`,
            hint: "`abstract contract ExploitBase { function severity() public view virtual returns (uint); function isCritical() public view returns (bool) { return severity() >= 9; } }`",
            validationRules: [
              { type: "regex", pattern: "abstract\\s+contract\\s+ExploitBase\\s*\\{", message: "Declare `abstract contract ExploitBase {`." },
              { type: "regex", pattern: "function\\s+severity\\s*\\(\\s*\\)\\s+public\\s+view\\s+virtual\\s+returns\\s*\\(\\s*uint\\s*\\)\\s*;", message: "Declare the unimplemented `function severity() public view virtual returns (uint);`." },
              { type: "contains", pattern: "return severity() >= 9;", message: "Implement `isCritical` returning `severity() >= 9`." },
            ],
            xp: 30,
          },
          {
            order: 8,
            title: "Overriding inherited functions",
            kind: "CODE",
            instructions: `## Chapter 8 — override

To fill in a \`virtual\` function from a parent (or abstract) contract, a child marks its version \`override\`:

\`\`\`solidity
contract BufferOverflowExploit is ExploitBase {
  function severity() public view override returns (uint) {
    return 10;
  }
}
\`\`\`

Both \`virtual\` (on the parent) and \`override\` (on the child) are required — Solidity won't let you silently shadow a function by accident.

**Your task:** declare \`contract BufferOverflowExploit is ExploitBase\` and override \`severity\` to return \`10\`, exactly as shown. Assume \`ExploitBase\` (from the previous chapter) already exists.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// declare BufferOverflowExploit here
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract BufferOverflowExploit is ExploitBase {
  function severity() public view override returns (uint) {
    return 10;
  }
}
`,
            hint: "`contract BufferOverflowExploit is ExploitBase { function severity() public view override returns (uint) { return 10; } }`",
            validationRules: [
              { type: "regex", pattern: "contract\\s+BufferOverflowExploit\\s+is\\s+ExploitBase\\s*\\{", message: "Declare `contract BufferOverflowExploit is ExploitBase {`." },
              { type: "regex", pattern: "function\\s+severity\\s*\\(\\s*\\)\\s+public\\s+view\\s+override\\s+returns\\s*\\(\\s*uint\\s*\\)", message: "Override with `function severity() public view override returns (uint)`." },
              { type: "contains", pattern: "return 10;", message: "Return `10`." },
            ],
            xp: 30,
          },
          {
            order: 9,
            title: "Custom errors",
            kind: "CODE",
            instructions: `## Chapter 9 — Cheaper, richer reverts

\`require(condition)\` with no message reverts with no useful info; \`require(condition, "some string")\` is more helpful but string reverts are surprisingly gas-expensive to store in bytecode. Since Solidity 0.8.4, **custom errors** give you named, parameterized reverts at a fraction of the gas cost:

\`\`\`solidity
error NotAuthorized(address caller, address expected);

function restrictedAction(address expected) external view {
  if (msg.sender != expected) {
    revert NotAuthorized(msg.sender, expected);
  }
}
\`\`\`

Callers (and block explorers) can decode \`NotAuthorized\` and see exactly which two addresses mismatched — far more useful than a bare string.

**Your task:** declare \`error NotAuthorized(address caller, address expected);\` and implement \`restrictedAction\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract AccessControlled {
  // declare the error here

  // implement restrictedAction here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract AccessControlled {
  error NotAuthorized(address caller, address expected);

  function restrictedAction(address expected) external view {
    if (msg.sender != expected) {
      revert NotAuthorized(msg.sender, expected);
    }
  }
}
`,
            hint: "`error NotAuthorized(address caller, address expected);` then `if (msg.sender != expected) { revert NotAuthorized(msg.sender, expected); }`",
            validationRules: [
              { type: "regex", pattern: "error\\s+NotAuthorized\\s*\\(\\s*address\\s+caller\\s*,\\s*address\\s+expected\\s*\\)\\s*;", message: "Declare `error NotAuthorized(address caller, address expected);`" },
              { type: "contains", pattern: "if (msg.sender != expected)", message: "Check `if (msg.sender != expected)`." },
              { type: "contains", pattern: "revert NotAuthorized(msg.sender, expected);", message: "Revert with `revert NotAuthorized(msg.sender, expected);`" },
            ],
            xp: 30,
          },
          {
            order: 10,
            title: "try/catch on external calls",
            kind: "CODE",
            instructions: `## Chapter 10 — Handling a call that might revert

Calling another contract's function can fail (it might revert). Normally that failure bubbles up and reverts your transaction too — but \`try\`/\`catch\` lets you handle it gracefully instead, which matters when you don't want one bad external dependency to break your whole flow.

\`\`\`solidity
interface Oracle {
  function getPrice() external view returns (uint);
}

function safeGetPrice(address oracleAddr) public view returns (uint, bool) {
  try Oracle(oracleAddr).getPrice() returns (uint price) {
    return (price, true);
  } catch {
    return (0, false);
  }
}
\`\`\`

Note: \`try\`/\`catch\` only wraps **external** calls (contract calls or contract creation) — it cannot catch a plain \`require\` failure inside the current function.

**Your task:** declare the \`Oracle\` interface (at file scope, above the contract — interfaces can't be nested inside a contract body) and implement \`safeGetPrice\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

// declare the Oracle interface here

contract PriceConsumer {
  // implement safeGetPrice here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

interface Oracle {
  function getPrice() external view returns (uint);
}

contract PriceConsumer {
  function safeGetPrice(address oracleAddr) public view returns (uint, bool) {
    try Oracle(oracleAddr).getPrice() returns (uint price) {
      return (price, true);
    } catch {
      return (0, false);
    }
  }
}
`,
            hint: "Declare `interface Oracle { function getPrice() external view returns (uint); }` above the contract, then inside `safeGetPrice`: `try Oracle(oracleAddr).getPrice() returns (uint price) { return (price, true); } catch { return (0, false); }`",
            validationRules: [
              { type: "regex", pattern: "interface\\s+Oracle\\s*\\{[\\s\\S]*function\\s+getPrice\\s*\\(\\s*\\)\\s+external\\s+view\\s+returns\\s*\\(\\s*uint\\s*\\)\\s*;", message: "Declare the `Oracle` interface with `getPrice() external view returns (uint)`." },
              { type: "contains", pattern: "try Oracle(oracleAddr).getPrice() returns (uint price) {", message: "Wrap the call in `try Oracle(oracleAddr).getPrice() returns (uint price) {`." },
              { type: "contains", pattern: "return (price, true);", message: "On success, `return (price, true);`" },
              { type: "contains", pattern: "} catch {", message: "Add a `catch` block." },
              { type: "contains", pattern: "return (0, false);", message: "On failure, `return (0, false);`" },
            ],
            xp: 35,
          },
          {
            order: 11,
            title: "receive() and fallback()",
            kind: "CODE",
            instructions: `## Chapter 11 — Accepting plain ETH transfers

A contract needs a special function to accept plain ETH sent with no function call data:

- \`receive() external payable { ... }\` — runs when ETH is sent with empty calldata.
- \`fallback() external payable { ... }\` — runs when calldata doesn't match any function (and there's no \`receive\`, or calldata is non-empty).

Without either, a plain \`address(contract).transfer(...)\` to your contract simply reverts.

\`\`\`solidity
event Deposit(address sender, uint amount);

receive() external payable {
  emit Deposit(msg.sender, msg.value);
}
\`\`\`

**Your task:** declare the \`Deposit\` event and the \`receive()\` function exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract Vault {
  // declare the Deposit event here

  // implement receive() here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Vault {
  event Deposit(address sender, uint amount);

  receive() external payable {
    emit Deposit(msg.sender, msg.value);
  }
}
`,
            hint: "`event Deposit(address sender, uint amount);` then `receive() external payable { emit Deposit(msg.sender, msg.value); }`",
            validationRules: [
              { type: "regex", pattern: "event\\s+Deposit\\s*\\(\\s*address\\s+sender\\s*,\\s*uint\\s+amount\\s*\\)\\s*;", message: "Declare `event Deposit(address sender, uint amount);`" },
              { type: "regex", pattern: "receive\\s*\\(\\s*\\)\\s+external\\s+payable\\s*\\{", message: "Declare `receive() external payable {`." },
              { type: "contains", pattern: "emit Deposit(msg.sender, msg.value);", message: "Emit `Deposit(msg.sender, msg.value);` inside `receive()`." },
            ],
            xp: 25,
          },
          {
            order: 12,
            title: "transfer vs send vs call for sending ETH",
            kind: "QUIZ",
            instructions: `## Chapter 12 — Three ways to send ETH, one right answer

Solidity gives you three ways to send ETH from a contract:

- \`payable(to).transfer(amount)\` — sends, forwards a fixed 2300 gas stipend, **reverts automatically** on failure. Used to be the default recommendation.
- \`payable(to).send(amount)\` — same 2300 gas stipend, but returns a \`bool\` instead of reverting — easy to forget to check, silently losing funds if ignored.
- \`(bool sent, ) = payable(to).call{value: amount}("")\` — forwards **all remaining gas**, returns a \`bool\` you must check, and is now the **recommended** approach.

Why the shift away from \`transfer\`/\`send\`? Their fixed 2300 gas stipend assumes the recipient is a simple wallet. If the recipient is a contract with a \`receive()\` function that does *any* meaningful work (even emitting an event), 2300 gas isn't enough and the transfer fails — breaking your contract's interaction with other contracts unpredictably as gas costs for EVM opcodes change over time.

**Question:** Why is \`.call{value: amount}("")\` now recommended over \`.transfer()\` for sending ETH?`,
            quizOptions: [
              "call() is cheaper in absolute gas cost",
              "transfer()'s fixed 2300 gas stipend can be insufficient for contract recipients doing real work in receive(), causing unexpected failures — call() forwards all available gas instead",
              "transfer() was removed from Solidity",
              "call() automatically retries on failure",
            ],
            quizAnswer: "transfer()'s fixed 2300 gas stipend can be insufficient for contract recipients doing real work in receive(), causing unexpected failures — call() forwards all available gas instead",
            xp: 25,
          },
        ],
      },
    ],
  },
  {
    slug: "advanced-solidity",
    title: "Pro Track — Advanced Solidity",
    description: "Modifiers, Ownable patterns, gas optimization, time units.",
    order: 4,
    isPremium: true,
    lessons: [
      {
        slug: "advanced-solidity",
        title: "Advanced Solidity",
        summary: "Modifiers, onlyOwner access control, gas-efficient types, time units.",
        order: 1,
        isPremium: true,
        badgeName: "Bounty Hunter Cert",
        badgeGlyph: "[$]",
        xpReward: 250,
        chapters: [
          {
            order: 1,
            title: "Function modifiers",
            kind: "CODE",
            instructions: `## Chapter 1 — onlyOwner

A **modifier** wraps a function with reusable pre/post logic. The classic use case: restrict a function to the contract owner.

\`\`\`solidity
modifier onlyOwner() {
  require(msg.sender == owner);
  _;
}
\`\`\`

The \`_;\` is where the modified function's body gets inserted. Apply it to a function like:

\`\`\`solidity
function withdraw() external onlyOwner {
  // ...
}
\`\`\`

**Your task:** inside \`Ownable\`, add the \`onlyOwner\` modifier exactly as shown, and apply it to the \`setOwner\` function already declared.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract Ownable {
  address owner;

  constructor() {
    owner = msg.sender;
  }

  // add the onlyOwner modifier here

  function setOwner(address _new) external /* apply modifier here */ {
    owner = _new;
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Ownable {
  address owner;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function setOwner(address _new) external onlyOwner {
    owner = _new;
  }
}
`,
            hint: "`modifier onlyOwner() { require(msg.sender == owner); _; }` then append `onlyOwner` after `external` on `setOwner`.",
            validationRules: [
              { type: "regex", pattern: "modifier\\s+onlyOwner\\s*\\(\\s*\\)\\s*\\{[\\s\\S]*require\\s*\\(\\s*msg\\.sender\\s*==\\s*owner\\s*\\)\\s*;[\\s\\S]*_;", message: "Define `modifier onlyOwner() { require(msg.sender == owner); _; }`." },
              { type: "regex", pattern: "function\\s+setOwner[\\s\\S]*?external\\s+onlyOwner", message: "Apply `onlyOwner` to `setOwner`." },
            ],
            xp: 30,
          },
          {
            order: 2,
            title: "Gas-efficient uint sizes",
            kind: "CODE",
            instructions: `## Chapter 2 — Packing structs

By default we use \`uint\` (256 bits) everywhere, but that wastes gas when smaller ranges suffice. Solidity can **pack** multiple sub-256-bit fields into a single 32-byte storage slot, cutting storage costs.

Update the \`Hacker\` struct so \`level\` and \`rank\` use smaller types that pack together:

\`\`\`solidity
struct Hacker {
  string name;
  uint dna;
  uint32 level;
  uint8 rank;
}
\`\`\`

\`level\` (uint32, up to ~4 billion) and \`rank\` (uint8, 0–255) sit next to each other and the EVM packs them into shared slots automatically.

**Your task:** update the struct to add \`uint32 level;\` and \`uint8 rank;\` after \`dna\`, in that order.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  struct Hacker {
    string name;
    uint dna;
    // add level and rank here
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  struct Hacker {
    string name;
    uint dna;
    uint32 level;
    uint8 rank;
  }
}
`,
            hint: "Add `uint32 level;` then `uint8 rank;` right after the `uint dna;` line inside the struct.",
            validationRules: [
              { type: "regex", pattern: "uint\\s+dna\\s*;[\\s\\S]*uint32\\s+level\\s*;[\\s\\S]*uint8\\s+rank\\s*;", message: "Add `uint32 level;` then `uint8 rank;` after `dna` in the struct, in that order." },
            ],
            xp: 25,
          },
          {
            order: 3,
            title: "Time units",
            kind: "CODE",
            instructions: `## Chapter 3 — Cooldowns with block.timestamp

Solidity has built-in time literals: \`1 seconds\`, \`1 minutes\`, \`1 hours\`, \`1 days\`, \`1 weeks\` — each just a plain \`uint\` number of seconds, for readability.

Let's add an exploit cooldown: a hacker can only run an exploit once per day. Store the last-run timestamp, and add a modifier checking it:

\`\`\`solidity
mapping(uint => uint) public exploitCooldown;

modifier aboveCooldown(uint _hackerId) {
  require(exploitCooldown[_hackerId] <= block.timestamp);
  _;
}
\`\`\`

Then, whenever a hacker runs an exploit, reset it: \`exploitCooldown[_hackerId] = block.timestamp + 1 days;\`

**Your task:** add the mapping, the \`aboveCooldown\` modifier, and inside a function \`runExploit(uint _hackerId)\` (already stubbed) apply the modifier and set the new cooldown as the function's last line.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // add exploitCooldown mapping here

  // add aboveCooldown modifier here

  function runExploit(uint _hackerId) external /* apply modifier */ {
    // set the new cooldown here
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  mapping(uint => uint) public exploitCooldown;

  modifier aboveCooldown(uint _hackerId) {
    require(exploitCooldown[_hackerId] <= block.timestamp);
    _;
  }

  function runExploit(uint _hackerId) external aboveCooldown(_hackerId) {
    exploitCooldown[_hackerId] = block.timestamp + 1 days;
  }
}
`,
            hint: "Declare the mapping and modifier as shown, apply `aboveCooldown(_hackerId)` to `runExploit`, and set `exploitCooldown[_hackerId] = block.timestamp + 1 days;` inside it.",
            validationRules: [
              { type: "regex", pattern: "mapping\\s*\\(\\s*uint\\s*=>\\s*uint\\s*\\)\\s+public\\s+exploitCooldown\\s*;", message: "Declare `mapping(uint => uint) public exploitCooldown;`" },
              { type: "regex", pattern: "modifier\\s+aboveCooldown\\s*\\(\\s*uint\\s+_hackerId\\s*\\)\\s*\\{[\\s\\S]*require\\s*\\(\\s*exploitCooldown\\[_hackerId\\]\\s*<=\\s*block\\.timestamp\\s*\\)\\s*;", message: "Define the `aboveCooldown` modifier checking `exploitCooldown[_hackerId] <= block.timestamp`." },
              { type: "contains", pattern: "aboveCooldown(_hackerId)", message: "Apply `aboveCooldown(_hackerId)` to `runExploit`." },
              { type: "contains", pattern: "exploitCooldown[_hackerId] = block.timestamp + 1 days;", message: "Reset the cooldown with `exploitCooldown[_hackerId] = block.timestamp + 1 days;`" },
            ],
            xp: 30,
          },
          {
            order: 4,
            title: "View & pure functions",
            kind: "CODE",
            instructions: `## Chapter 4 — view vs pure

- \`view\` — reads contract state but doesn't modify it. Free to call off-chain (no gas, no transaction).
- \`pure\` — doesn't even read state; it's a pure function of its inputs.

Add a \`pure\` helper that computes a hacker's power score from level and rank without touching storage:

\`\`\`solidity
function powerScore(uint32 _level, uint8 _rank) external pure returns (uint) {
  return uint(_level) * (uint(_rank) + 1);
}
\`\`\`

**Your task:** implement \`powerScore\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  // implement powerScore here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {
  function powerScore(uint32 _level, uint8 _rank) external pure returns (uint) {
    return uint(_level) * (uint(_rank) + 1);
  }
}
`,
            hint: "`function powerScore(uint32 _level, uint8 _rank) external pure returns (uint) { return uint(_level) * (uint(_rank) + 1); }`",
            validationRules: [
              { type: "regex", pattern: "function\\s+powerScore\\s*\\(\\s*uint32\\s+_level\\s*,\\s*uint8\\s+_rank\\s*\\)\\s+external\\s+pure\\s+returns\\s*\\(\\s*uint\\s*\\)", message: "Function signature must be `function powerScore(uint32 _level, uint8 _rank) external pure returns (uint)`." },
              { type: "contains", pattern: "uint(_level) * (uint(_rank) + 1)", message: "Return `uint(_level) * (uint(_rank) + 1)`." },
            ],
            xp: 25,
          },
        ],
      },
    ],
  },
  {
    slug: "tokens",
    title: "Pro Track — ERC-20 & ERC-721",
    description: "Build your own fungible and non-fungible tokens.",
    order: 5,
    isPremium: true,
    lessons: [
      {
        slug: "tokens",
        title: "ERC-20 & ERC-721 Tokens",
        summary: "Implement the core of a fungible token and a non-fungible badge token.",
        order: 1,
        isPremium: true,
        badgeName: "Token Forger",
        badgeGlyph: "(¤)",
        xpReward: 250,
        chapters: [
          {
            order: 1,
            title: "The ERC-20 balance mapping",
            kind: "CODE",
            instructions: `## Chapter 1 — Fungible token storage

ERC-20 is the standard interface for fungible tokens (interchangeable units, like currency). Its core piece of state is simple: a mapping from address to balance.

\`\`\`solidity
mapping(address => uint256) private _balances;
uint256 private _totalSupply;

function balanceOf(address account) public view returns (uint256) {
  return _balances[account];
}
\`\`\`

**Your task:** declare \`_balances\` and \`_totalSupply\` as shown, and implement \`balanceOf\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerToken {
  // declare _balances and _totalSupply here

  // implement balanceOf here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerToken {
  mapping(address => uint256) private _balances;
  uint256 private _totalSupply;

  function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
  }
}
`,
            hint: "`mapping(address => uint256) private _balances;` + `uint256 private _totalSupply;`, then `function balanceOf(address account) public view returns (uint256) { return _balances[account]; }`",
            validationRules: [
              { type: "regex", pattern: "mapping\\s*\\(\\s*address\\s*=>\\s*uint256\\s*\\)\\s+private\\s+_balances\\s*;", message: "Declare `mapping(address => uint256) private _balances;`" },
              { type: "regex", pattern: "uint256\\s+private\\s+_totalSupply\\s*;", message: "Declare `uint256 private _totalSupply;`" },
              { type: "regex", pattern: "function\\s+balanceOf\\s*\\(\\s*address\\s+account\\s*\\)\\s+public\\s+view\\s+returns\\s*\\(\\s*uint256\\s*\\)\\s*\\{[\\s\\S]*return\\s+_balances\\[account\\]\\s*;", message: "Implement `balanceOf` returning `_balances[account]`." },
            ],
            xp: 30,
          },
          {
            order: 2,
            title: "transfer() and the Transfer event",
            kind: "CODE",
            instructions: `## Chapter 2 — Moving tokens

The heart of ERC-20: moving a balance from sender to recipient, and emitting the standard \`Transfer\` event so wallets and explorers can track it.

\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint256 value);

function transfer(address to, uint256 amount) public returns (bool) {
  require(_balances[msg.sender] >= amount);
  _balances[msg.sender] -= amount;
  _balances[to] += amount;
  emit Transfer(msg.sender, to, amount);
  return true;
}
\`\`\`

\`indexed\` parameters are stored so logs can be efficiently filtered/searched by that field (e.g. "all transfers to address X").

**Your task:** declare the \`Transfer\` event and implement \`transfer\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerToken {
  mapping(address => uint256) private _balances;

  // declare the Transfer event here

  // implement transfer here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerToken {
  mapping(address => uint256) private _balances;

  event Transfer(address indexed from, address indexed to, uint256 value);

  function transfer(address to, uint256 amount) public returns (bool) {
    require(_balances[msg.sender] >= amount);
    _balances[msg.sender] -= amount;
    _balances[to] += amount;
    emit Transfer(msg.sender, to, amount);
    return true;
  }
}
`,
            hint: "Declare `event Transfer(address indexed from, address indexed to, uint256 value);` then implement `transfer` with the require/debit/credit/emit pattern shown.",
            validationRules: [
              { type: "regex", pattern: "event\\s+Transfer\\s*\\(\\s*address\\s+indexed\\s+from\\s*,\\s*address\\s+indexed\\s+to\\s*,\\s*uint256\\s+value\\s*\\)\\s*;", message: "Declare `event Transfer(address indexed from, address indexed to, uint256 value);`" },
              { type: "contains", pattern: "require(_balances[msg.sender] >= amount);", message: "Guard with `require(_balances[msg.sender] >= amount);`" },
              { type: "contains", pattern: "_balances[msg.sender] -= amount;", message: "Debit the sender: `_balances[msg.sender] -= amount;`" },
              { type: "contains", pattern: "_balances[to] += amount;", message: "Credit the recipient: `_balances[to] += amount;`" },
              { type: "contains", pattern: "emit Transfer(msg.sender, to, amount);", message: "Emit `Transfer(msg.sender, to, amount);`" },
            ],
            xp: 35,
          },
          {
            order: 3,
            title: "ERC-721 ownerOf",
            kind: "CODE",
            instructions: `## Chapter 3 — Non-fungible ownership

ERC-721 tokens are **unique** — each has its own ID and one owner at a time (perfect for our badge NFTs). Core state: a mapping from token ID to owner.

\`\`\`solidity
mapping(uint256 => address) private _owners;

function ownerOf(uint256 tokenId) public view returns (address) {
  address owner = _owners[tokenId];
  require(owner != address(0));
  return owner;
}
\`\`\`

\`address(0)\` is the zero address — the default/empty value — so this guards against querying a token that was never minted.

**Your task:** declare \`_owners\` and implement \`ownerOf\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerBadge {
  // declare _owners here

  // implement ownerOf here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerBadge {
  mapping(uint256 => address) private _owners;

  function ownerOf(uint256 tokenId) public view returns (address) {
    address owner = _owners[tokenId];
    require(owner != address(0));
    return owner;
  }
}
`,
            hint: "`mapping(uint256 => address) private _owners;` then `function ownerOf(uint256 tokenId) public view returns (address) { address owner = _owners[tokenId]; require(owner != address(0)); return owner; }`",
            validationRules: [
              { type: "regex", pattern: "mapping\\s*\\(\\s*uint256\\s*=>\\s*address\\s*\\)\\s+private\\s+_owners\\s*;", message: "Declare `mapping(uint256 => address) private _owners;`" },
              { type: "contains", pattern: "require(owner != address(0));", message: "Guard with `require(owner != address(0));`" },
              { type: "contains", pattern: "return owner;", message: "Return the resolved `owner`." },
            ],
            xp: 30,
          },
          {
            order: 4,
            title: "Minting a badge",
            kind: "CODE",
            instructions: `## Chapter 4 — _mint

Minting creates a brand new token and assigns it to an owner — the NFT equivalent of \`_createHacker\`.

\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

function _mint(address to, uint256 tokenId) internal {
  require(to != address(0));
  require(_owners[tokenId] == address(0));
  _owners[tokenId] = to;
  emit Transfer(address(0), to, tokenId);
}
\`\`\`

Minting emits \`Transfer\` **from the zero address**, by convention — that's how indexers recognize "this token was just created" versus a normal transfer.

**Your task:** declare the event and implement \`_mint\` exactly as shown.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerBadge {
  mapping(uint256 => address) private _owners;

  // declare the Transfer event here

  // implement _mint here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract HackerBadge {
  mapping(uint256 => address) private _owners;

  event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

  function _mint(address to, uint256 tokenId) internal {
    require(to != address(0));
    require(_owners[tokenId] == address(0));
    _owners[tokenId] = to;
    emit Transfer(address(0), to, tokenId);
  }
}
`,
            hint: "Event: `event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);`. Function must check `to != address(0)`, check the token isn't already minted, assign `_owners[tokenId] = to;`, then emit from `address(0)`.",
            validationRules: [
              { type: "regex", pattern: "event\\s+Transfer\\s*\\(\\s*address\\s+indexed\\s+from\\s*,\\s*address\\s+indexed\\s+to\\s*,\\s*uint256\\s+indexed\\s+tokenId\\s*\\)\\s*;", message: "Declare the indexed `Transfer` event with `tokenId` also indexed." },
              { type: "contains", pattern: "require(to != address(0));", message: "Guard against minting to the zero address." },
              { type: "contains", pattern: "require(_owners[tokenId] == address(0));", message: "Guard against re-minting an existing token." },
              { type: "contains", pattern: "_owners[tokenId] = to;", message: "Assign the new owner: `_owners[tokenId] = to;`" },
              { type: "contains", pattern: "emit Transfer(address(0), to, tokenId);", message: "Emit `Transfer(address(0), to, tokenId);`" },
            ],
            xp: 35,
          },
        ],
      },
    ],
  },
  {
    slug: "security",
    title: "Pro Track — Security & Ethical Hacking",
    description: "Reentrancy, overflow, and the exploits that broke real protocols.",
    order: 6,
    isPremium: true,
    lessons: [
      {
        slug: "security",
        title: "Security & Ethical Hacking",
        summary: "Learn the exploits by fixing them: reentrancy, overflow, access control, tx.origin.",
        order: 1,
        isPremium: true,
        badgeName: "Ghost in the Shell",
        badgeGlyph: "[!]",
        xpReward: 300,
        chapters: [
          {
            order: 1,
            title: "The reentrancy attack",
            kind: "CODE",
            instructions: `## Chapter 1 — Checks-Effects-Interactions

**Reentrancy** is the exploit behind the 2016 DAO hack (~$60M drained). It happens when a contract sends ETH to an external address *before* updating its own state — a malicious recipient's fallback function can call back in and withdraw again before the balance is zeroed.

**Vulnerable pattern:**
\`\`\`solidity
function withdraw() external {
  uint amount = balances[msg.sender];
  (bool sent, ) = msg.sender.call{value: amount}("");
  require(sent);
  balances[msg.sender] = 0; // too late!
}
\`\`\`

**Fixed with Checks-Effects-Interactions** — update state *before* the external call:

\`\`\`solidity
function withdraw() external {
  uint amount = balances[msg.sender];
  balances[msg.sender] = 0;
  (bool sent, ) = msg.sender.call{value: amount}("");
  require(sent);
}
\`\`\`

**Your task:** fix the vulnerable \`withdraw\` function below by moving the state update (\`balances[msg.sender] = 0;\`) to before the external call.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract Vault {
  mapping(address => uint) public balances;

  function withdraw() external {
    uint amount = balances[msg.sender];
    (bool sent, ) = msg.sender.call{value: amount}("");
    require(sent);
    balances[msg.sender] = 0;
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Vault {
  mapping(address => uint) public balances;

  function withdraw() external {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;
    (bool sent, ) = msg.sender.call{value: amount}("");
    require(sent);
  }
}
`,
            hint: "Move `balances[msg.sender] = 0;` so it happens right after reading `amount`, before the `.call{value: amount}(\"\")`.",
            validationRules: [
              { type: "order", before: "balances[msg.sender] = 0;", after: "msg.sender.call{value: amount}(\"\");", message: "State must be zeroed *before* the external call, not after (checks-effects-interactions)." },
            ],
            xp: 40,
          },
          {
            order: 2,
            title: "Integer overflow / underflow",
            kind: "CODE",
            instructions: `## Chapter 2 — Overflow before Solidity 0.8

Before Solidity 0.8, arithmetic silently **wrapped around** on overflow/underflow — a \`uint8\` at 255 + 1 became 0; a \`uint\` balance at 0 minus 1 became a gigantic number. Attackers exploited this to mint themselves absurd token balances.

Solidity ≥0.8.0 reverts automatically on overflow/underflow. For older code (or explicit control), use **OpenZeppelin's SafeMath** or explicit checks:

\`\`\`solidity
function safeSub(uint a, uint b) internal pure returns (uint) {
  require(b <= a);
  return a - b;
}
\`\`\`

**Your task:** implement \`safeSub\` exactly as shown, guarding against underflow before subtracting.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract Arithmetic {
  // implement safeSub here
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Arithmetic {
  function safeSub(uint a, uint b) internal pure returns (uint) {
    require(b <= a);
    return a - b;
  }
}
`,
            hint: "`function safeSub(uint a, uint b) internal pure returns (uint) { require(b <= a); return a - b; }`",
            validationRules: [
              { type: "regex", pattern: "function\\s+safeSub\\s*\\(\\s*uint\\s+a\\s*,\\s*uint\\s+b\\s*\\)\\s+internal\\s+pure\\s+returns\\s*\\(\\s*uint\\s*\\)", message: "Function signature must be `function safeSub(uint a, uint b) internal pure returns (uint)`." },
              { type: "contains", pattern: "require(b <= a);", message: "Guard against underflow with `require(b <= a);` before subtracting." },
              { type: "order", before: "require(b <= a);", after: "return a - b;", message: "Check `b <= a` before returning `a - b`." },
            ],
            xp: 30,
          },
          {
            order: 3,
            title: "tx.origin vs msg.sender",
            kind: "CODE",
            instructions: `## Chapter 3 — The phishing vector

\`tx.origin\` is the address that started the entire transaction chain; \`msg.sender\` is whoever called *this specific* function (could be a user, or another contract). Using \`tx.origin\` for authorization is dangerous: a malicious contract can trick a victim into calling it, then have it call your contract — \`tx.origin\` will still be the victim, granting access it shouldn't have.

**Vulnerable:**
\`\`\`solidity
function withdrawAll() external {
  require(tx.origin == owner);
  payable(owner).transfer(address(this).balance);
}
\`\`\`

**Fixed:** always authorize with \`msg.sender\`:
\`\`\`solidity
function withdrawAll() external {
  require(msg.sender == owner);
  payable(owner).transfer(address(this).balance);
}
\`\`\`

**Your task:** fix \`withdrawAll\` below by replacing the \`tx.origin\` check with \`msg.sender\`.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract Wallet {
  address owner;

  function withdrawAll() external {
    require(tx.origin == owner);
    payable(owner).transfer(address(this).balance);
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Wallet {
  address owner;

  function withdrawAll() external {
    require(msg.sender == owner);
    payable(owner).transfer(address(this).balance);
  }
}
`,
            hint: "Replace `require(tx.origin == owner);` with `require(msg.sender == owner);`",
            validationRules: [
              { type: "contains", pattern: "require(msg.sender == owner);", message: "Authorize with `require(msg.sender == owner);`, not `tx.origin`." },
              { type: "not_contains", pattern: "tx.origin == owner", message: "Remove the unsafe `tx.origin == owner` check entirely." },
            ],
            xp: 30,
          },
          {
            order: 4,
            title: "Unprotected selfdestruct",
            kind: "CODE",
            instructions: `## Chapter 4 — Access control on destructive functions

\`selfdestruct(address)\` deletes the contract's code and sends all its ETH to the given address. Several real contracts have been destroyed (bricking dependent contracts) because this was left callable by anyone.

**Vulnerable:**
\`\`\`solidity
function destroy() external {
  selfdestruct(payable(msg.sender));
}
\`\`\`

**Fixed:** gate it behind an owner check:
\`\`\`solidity
function destroy() external {
  require(msg.sender == owner);
  selfdestruct(payable(msg.sender));
}
\`\`\`

**Your task:** add the missing \`require(msg.sender == owner);\` guard before the \`selfdestruct\` call.`,
            starterCode: `pragma solidity >=0.5.0 <0.9.0;

contract Fragile {
  address owner;

  function destroy() external {
    selfdestruct(payable(msg.sender));
  }
}
`,
            solutionCode: `pragma solidity >=0.5.0 <0.9.0;

contract Fragile {
  address owner;

  function destroy() external {
    require(msg.sender == owner);
    selfdestruct(payable(msg.sender));
  }
}
`,
            hint: "Add `require(msg.sender == owner);` as the first line of `destroy`, before `selfdestruct`.",
            validationRules: [
              { type: "contains", pattern: "require(msg.sender == owner);", message: "Guard `destroy` with `require(msg.sender == owner);`" },
              { type: "order", before: "require(msg.sender == owner);", after: "selfdestruct(payable(msg.sender));", message: "The owner check must happen before `selfdestruct` runs." },
            ],
            xp: 30,
          },
          {
            order: 5,
            title: "Front-running & commit-reveal",
            kind: "QUIZ",
            instructions: `## Chapter 5 — Front-running

Because pending transactions sit in the public mempool before being mined, anyone watching can see your transaction's contents (e.g. "buy at price X") and pay a higher gas fee to get their own transaction mined first — profiting off knowledge of your intent. This is **front-running**.

A common defense is the **commit-reveal scheme**: first submit a hash commitment of your action (e.g. \`keccak256(abi.encodePacked(secret, guess))\`), then later reveal the actual values. Observers can't act on a hash they can't reverse.

**Question:** Why does committing a hash first, then revealing later, prevent front-running of the revealed action?`,
            quizOptions: [
              "Because hashes take too long to compute for attackers to keep up",
              "Because the commitment hides the actual action until reveal, so there's nothing meaningful for an attacker to front-run during the commit phase",
              "Because the blockchain hides all pending transactions from everyone",
              "Because gas fees are automatically higher for attackers",
            ],
            quizAnswer: "Because the commitment hides the actual action until reveal, so there's nothing meaningful for an attacker to front-run during the commit phase",
            xp: 25,
          },
        ],
      },
    ],
  },
  {
    slug: "frontend",
    title: "Pro Track — Web3 Frontend Integration",
    description: "Wire your contract up to a real frontend with Ethers.js.",
    order: 7,
    isPremium: true,
    lessons: [
      {
        slug: "frontend",
        title: "Web3.js / Ethers.js Integration",
        summary: "Connect a wallet, read contract state, and send transactions from the browser.",
        order: 1,
        isPremium: true,
        badgeName: "Signal Runner",
        badgeGlyph: "(::)",
        xpReward: 200,
        chapters: [
          {
            order: 1,
            title: "Connecting a wallet",
            kind: "QUIZ",
            instructions: `## Chapter 1 — window.ethereum

Browser wallets like MetaMask inject a provider object at \`window.ethereum\`. With Ethers.js:

\`\`\`js
const provider = new ethers.BrowserProvider(window.ethereum);
const [address] = await provider.send("eth_requestAccounts", []);
const signer = await provider.getSigner();
\`\`\`

\`eth_requestAccounts\` triggers the wallet's connect popup and returns the accounts the user approves. The **signer** is what lets you send transactions on the user's behalf (with their approval each time).

**Question:** What is the purpose of calling \`eth_requestAccounts\`?`,
            quizOptions: [
              "It deploys a new contract",
              "It prompts the user's wallet to connect and share which account(s) they authorize the site to see",
              "It sends ETH automatically to the site",
              "It reads the contract's source code",
            ],
            quizAnswer: "It prompts the user's wallet to connect and share which account(s) they authorize the site to see",
            xp: 20,
          },
          {
            order: 2,
            title: "Reading contract state",
            kind: "QUIZ",
            instructions: `## Chapter 2 — Contract instances

To call functions on a deployed contract from JS, you need its **address** and its **ABI** (Application Binary Interface — a JSON description of its functions/events):

\`\`\`js
const contract = new ethers.Contract(address, abi, provider);
const hackers = await contract.hackers(0);
\`\`\`

Because \`provider\` (not a signer) is read-only, this call is free — it's just querying node state, not sending a transaction. Reading data never costs gas.

**Question:** Why does calling a \`view\` function through a read-only provider not cost any gas?`,
            quizOptions: [
              "Because view functions are cached forever",
              "Because it's a local computation against existing state, not a transaction that changes state on-chain",
              "Because MetaMask pays the gas for you",
              "It does cost gas, just less than a normal call",
            ],
            quizAnswer: "Because it's a local computation against existing state, not a transaction that changes state on-chain",
            xp: 20,
          },
          {
            order: 3,
            title: "Sending a transaction",
            kind: "QUIZ",
            instructions: `## Chapter 3 — Writing to the chain

To call a state-changing function, connect the contract to a **signer** instead of a plain provider:

\`\`\`js
const contract = new ethers.Contract(address, abi, signer);
const tx = await contract.createRandomHacker("neo");
await tx.wait(); // waits for the transaction to be mined
\`\`\`

\`tx\` is returned the moment the transaction is *submitted*, not confirmed. \`tx.wait()\` pauses until it's actually mined into a block (and reverts if it fails).

**Question:** Why is it important to call \`await tx.wait()\` before assuming a transaction succeeded?`,
            quizOptions: [
              "It isn't necessary — submission always means success",
              "Because submission just means the transaction entered the mempool; it can still fail or be reverted before being mined",
              "It cancels the transaction if called",
              "It refunds gas automatically",
            ],
            quizAnswer: "Because submission just means the transaction entered the mempool; it can still fail or be reverted before being mined",
            xp: 20,
          },
        ],
      },
    ],
  },
  {
    slug: "capstone",
    title: "Pro Track — Capstone",
    description: "Deploy your contract to a live testnet.",
    order: 8,
    isPremium: true,
    lessons: [
      {
        slug: "capstone",
        title: "Capstone: Testnet Deploy",
        summary: "Take everything you've built and ship it to a real, public testnet.",
        order: 1,
        isPremium: true,
        badgeName: "Elite Hacker Cert",
        badgeGlyph: "[E]",
        xpReward: 400,
        chapters: [
          {
            order: 1,
            title: "Preparing for deployment",
            kind: "QUIZ",
            instructions: `## Chapter 1 — Testnets

Before risking real funds on Ethereum mainnet, you deploy to a **testnet** — a separate network with worthless "test ETH" you get free from a faucet, that behaves identically to mainnet for testing purposes (e.g. Sepolia).

A typical deploy pipeline: compile with Hardhat/Foundry → get testnet ETH from a faucet → run a deploy script pointing at the testnet RPC URL, signed by a throwaway private key stored in an environment variable (never hardcoded, never committed to git).

**Question:** Why should the deployer's private key be loaded from an environment variable instead of hardcoded in the deploy script?`,
            quizOptions: [
              "Hardcoding is fine as long as the repo is private",
              "Environment variables run faster",
              "Hardcoding a private key risks it being committed to source control and permanently exposed, even if later removed",
              "Environment variables are required by the Solidity compiler",
            ],
            quizAnswer: "Hardcoding a private key risks it being committed to source control and permanently exposed, even if later removed",
            xp: 30,
          },
          {
            order: 2,
            title: "Verifying and sharing your contract",
            kind: "QUIZ",
            instructions: `## Chapter 2 — Verification

After deploying, you should **verify** the contract's source code on a block explorer (e.g. Etherscan). This uploads and matches your Solidity source against the deployed bytecode, so anyone can read the exact code running at that address instead of trusting an opaque binary.

Once verified, others can interact with your contract directly through the explorer's UI, and your dApp's frontend can confidently point at a known, auditable address.

Congratulations, hacker — completing this chapter marks you **Elite Hacker**. You've gone from reading about blockchains to shipping a verified, security-conscious smart contract on a public network.

**Question:** What does "verifying" a contract on a block explorer actually accomplish?`,
            quizOptions: [
              "It makes the contract immutable (it already was)",
              "It matches your public Solidity source to the deployed bytecode, letting anyone audit the exact code running on-chain",
              "It transfers ownership of the contract to the explorer",
              "It reduces the gas cost of future calls",
            ],
            quizAnswer: "It matches your public Solidity source to the deployed bytecode, letting anyone audit the exact code running on-chain",
            xp: 30,
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("Seeding CryptoHacker curriculum...");

  for (const track of TRACKS) {
    const t = await prisma.track.upsert({
      where: { slug: track.slug },
      update: {
        title: track.title,
        description: track.description,
        order: track.order,
        isPremium: track.isPremium,
      },
      create: {
        slug: track.slug,
        title: track.title,
        description: track.description,
        order: track.order,
        isPremium: track.isPremium,
      },
    });

    for (const lesson of track.lessons) {
      const l = await prisma.lesson.upsert({
        where: { slug: lesson.slug },
        update: {
          title: lesson.title,
          summary: lesson.summary,
          order: lesson.order,
          isPremium: lesson.isPremium,
          badgeName: lesson.badgeName,
          badgeGlyph: lesson.badgeGlyph,
          xpReward: lesson.xpReward,
          trackId: t.id,
        },
        create: {
          slug: lesson.slug,
          title: lesson.title,
          summary: lesson.summary,
          order: lesson.order,
          isPremium: lesson.isPremium,
          badgeName: lesson.badgeName,
          badgeGlyph: lesson.badgeGlyph,
          xpReward: lesson.xpReward,
          trackId: t.id,
        },
      });

      for (const chapter of lesson.chapters) {
        await prisma.chapter.upsert({
          where: { lessonId_order: { lessonId: l.id, order: chapter.order } },
          update: {
            title: chapter.title,
            kind: chapter.kind,
            instructions: chapter.instructions,
            starterCode: chapter.starterCode ?? "",
            solutionCode: chapter.solutionCode ?? "",
            hint: chapter.hint ?? "",
            validationRules: (chapter.validationRules ?? []) as object,
            quizOptions: (chapter.quizOptions ?? null) as object | undefined,
            quizAnswer: chapter.quizAnswer ?? null,
            xp: chapter.xp ?? 20,
          },
          create: {
            lessonId: l.id,
            order: chapter.order,
            title: chapter.title,
            kind: chapter.kind,
            instructions: chapter.instructions,
            starterCode: chapter.starterCode ?? "",
            solutionCode: chapter.solutionCode ?? "",
            hint: chapter.hint ?? "",
            validationRules: (chapter.validationRules ?? []) as object,
            quizOptions: (chapter.quizOptions ?? null) as object | undefined,
            quizAnswer: chapter.quizAnswer ?? null,
            xp: chapter.xp ?? 20,
          },
        });
      }
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@cryptohacker.dev";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        username: "admin",
        name: "Admin",
        role: "ADMIN",
        subscription: { create: { plan: "PRO_YEARLY", status: "ACTIVE" } },
      },
    });
    console.log(`Created admin placeholder user: ${adminEmail} (no password set — use Google OAuth or set one manually).`);
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
