"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import TerminalWindow from "@/components/ui/TerminalWindow";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type ChapterKind = "QUIZ" | "CODE";

interface Props {
  lessonSlug: string;
  lessonTitle: string;
  chapter: {
    id: string;
    title: string;
    kind: ChapterKind;
    instructions: string;
    starterCode: string;
    quizOptions: string[];
  };
  order: number;
  total: number;
  prevOrder: number | null;
  nextOrder: number | null;
  initiallyCompleted: boolean;
  isAuthenticated: boolean;
}

function matrixConfetti() {
  const colors = ["#00ff41", "#0a8a2e", "#28e0ff"];
  confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors, scalar: 0.8, shapes: ["square"] });
}

export default function ChapterPlayer({
  lessonSlug,
  lessonTitle,
  chapter,
  order,
  total,
  prevOrder,
  nextOrder,
  initiallyCompleted,
  isAuthenticated,
}: Props) {
  const [code, setCode] = useState(chapter.starterCode);
  const [quizChoice, setQuizChoice] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [completed, setCompleted] = useState(initiallyCompleted);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCode(chapter.starterCode);
    setResult(null);
    setHint(null);
    setAnswer(null);
    setQuizChoice(null);
    setCompleted(initiallyCompleted);
  }, [chapter.id, chapter.starterCode, initiallyCompleted]);

  const saveDraft = useCallback(
    (value: string) => {
      if (!isAuthenticated) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        fetch("/api/progress/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterId: chapter.id, code: value }),
        }).catch(() => {});
      }, 800);
    },
    [chapter.id, isAuthenticated]
  );

  function onCodeChange(value: string | undefined) {
    const v = value ?? "";
    setCode(v);
    saveDraft(v);
  }

  async function checkAnswer() {
    if (!isAuthenticated) {
      toast.error("log in to run checks");
      return;
    }
    setChecking(true);
    const payload = chapter.kind === "QUIZ" ? quizChoice ?? "" : code;
    const res = await fetch("/api/progress/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId: chapter.id, code: payload }),
    });
    const data = await res.json();
    setChecking(false);

    if (!res.ok) {
      toast.error(data.error === "ROOT_ACCESS_REQUIRED" ? "ROOT ACCESS REQUIRED — upgrade to Pro" : "error");
      return;
    }

    if (!data.ok) {
      setResult({ ok: false, message: data.message });
      return;
    }

    setResult({ ok: true });
    if (!completed) {
      setCompleted(true);
      matrixConfetti();
      if (data.xpAwarded > 0) toast.success(`ACCESS GRANTED — +${data.xpAwarded} XP`);
      if (data.newBadge) toast.success(`NEW BADGE UNLOCKED: ${data.newBadge.glyph} ${data.newBadge.name}`);
    }
  }

  async function reveal(kind: "hint" | "answer") {
    if (!isAuthenticated) {
      toast.error("log in first");
      return;
    }
    const res = await fetch("/api/progress/reveal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId: chapter.id, kind }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error === "ROOT_ACCESS_REQUIRED" ? "ROOT ACCESS REQUIRED — upgrade to Pro" : "error");
      return;
    }
    if (kind === "hint") setHint(data.hint);
    else {
      setAnswer(data.answer);
      if (data.xpSpent > 0) toast(`-${data.xpSpent} XP — answer revealed`, { icon: "⚠" });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-term-muted">
        <Link href={`/lessons`} className="hover:text-term-cyan">
          ← ./lessons
        </Link>
        <span>
          {lessonTitle} — chapter {order}/{total}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full rounded bg-term-border">
        <div
          className="h-1.5 rounded bg-term-green transition-all"
          style={{ width: `${(order / total) * 100}%` }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TerminalWindow title={`instructions.md — ${chapter.title}`}>
          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-term-green prose-code:text-term-cyan prose-strong:text-term-green">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{chapter.instructions}</ReactMarkdown>
          </div>

          {chapter.kind === "QUIZ" && (
            <div className="mt-6 flex flex-col gap-2">
              {chapter.quizOptions.map((opt) => (
                <label
                  key={opt}
                  className={`cursor-pointer rounded border px-3 py-2 text-sm ${
                    quizChoice === opt
                      ? "border-term-green text-term-green"
                      : "border-term-border text-term-muted hover:border-term-cyan"
                  }`}
                >
                  <input
                    type="radio"
                    name="quiz"
                    className="mr-2"
                    checked={quizChoice === opt}
                    onChange={() => setQuizChoice(opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={checkAnswer}
              disabled={checking || (chapter.kind === "QUIZ" && !quizChoice)}
              className="rounded border border-term-green px-4 py-2 text-sm font-bold text-term-green hover:bg-term-green hover:text-term-bg disabled:opacity-50"
            >
              {checking ? "verifying..." : "./check_answer"}
            </button>
            {chapter.kind === "CODE" && (
              <>
                <button
                  onClick={() => reveal("hint")}
                  className="rounded border border-term-border px-4 py-2 text-sm text-term-amber hover:border-term-amber"
                >
                  ./show_hint
                </button>
                <button
                  onClick={() => reveal("answer")}
                  className="rounded border border-term-border px-4 py-2 text-sm text-term-red hover:border-term-red"
                >
                  ./show_answer (-15 xp)
                </button>
              </>
            )}
          </div>

          {hint && (
            <p className="mt-4 rounded border border-term-amber/50 bg-term-amber/5 px-3 py-2 text-sm text-term-amber">
              HINT: {hint}
            </p>
          )}
          {answer && (
            <pre className="mt-4 overflow-x-auto rounded border border-term-red/50 bg-term-bg px-3 py-2 text-xs text-term-red">
              {answer}
            </pre>
          )}

          {result && !result.ok && (
            <p className="mt-4 rounded border border-term-red/50 bg-term-red/5 px-3 py-2 text-sm text-term-red">
              ACCESS DENIED ✘ — {result.message}
            </p>
          )}
          {result?.ok && (
            <p className="mt-4 rounded border border-term-green/50 bg-term-green/5 px-3 py-2 text-sm text-term-green">
              ACCESS GRANTED ✔ — chapter complete
            </p>
          )}

          <div className="mt-6 flex justify-between">
            {prevOrder ? (
              <Link href={`/lessons/${lessonSlug}/${prevOrder}`} className="text-sm text-term-muted hover:text-term-cyan">
                ← prev
              </Link>
            ) : (
              <span />
            )}
            {nextOrder ? (
              <Link href={`/lessons/${lessonSlug}/${nextOrder}`} className="text-sm text-term-cyan hover:underline">
                next →
              </Link>
            ) : (
              <Link href="/lessons" className="text-sm text-term-green hover:underline">
                finish lesson →
              </Link>
            )}
          </div>
        </TerminalWindow>

        {chapter.kind === "CODE" ? (
          <TerminalWindow title="HackerFactory.sol" className="min-h-[500px]">
            <MonacoEditor
              height="480px"
              language="sol"
              theme="vs-dark"
              value={code}
              onChange={onCodeChange}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                fontFamily: "JetBrains Mono, Fira Code, monospace",
                scrollBeyondLastLine: false,
              }}
            />
          </TerminalWindow>
        ) : (
          <TerminalWindow title="quiz_mode" className="flex min-h-[300px] items-center justify-center">
            <p className="text-center text-term-muted">
              No code this chapter — answer the question on the left to proceed.
            </p>
          </TerminalWindow>
        )}
      </div>
    </div>
  );
}
