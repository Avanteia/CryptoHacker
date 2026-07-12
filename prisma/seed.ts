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
            instructions: `## Chapter 1 — Your first contract

Solidity source files start with a **version pragma**, declaring which compiler versions the code is safe to compile with.

Then, everything lives inside a **contract** block — think of it like a class in other languages.

\`\`\`solidity
pragma solidity >=0.5.0 <0.9.0;

contract HackerFactory {

}
\`\`\`

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
            instructions: `## Chapter 2 — State variables

**State variables** are permanently stored in contract storage — on the blockchain itself. Every hacker's identity in our system starts with a DNA number.

Declare an unsigned integer state variable called \`dna\` inside \`HackerFactory\`. Solidity's default \`uint\` is a 256-bit unsigned integer (alias for \`uint256\`).

\`\`\`solidity
uint dna;
\`\`\`

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
            instructions: `## Chapter 3 — Digit limits

Hacker DNA is a 16-digit number. We'll enforce that with a constant.

Add a state variable \`dnaDigits\` of type \`uint\`, set to \`16\`, and mark it \`constant\` (its value can never change and it doesn't use storage the way regular state vars do).

\`\`\`solidity
uint constant dnaDigits = 16;
\`\`\`

Then add a second constant, \`dnaModulus\`, equal to \`10 ** dnaDigits\` — this caps any DNA number to 16 digits via modulo.

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
