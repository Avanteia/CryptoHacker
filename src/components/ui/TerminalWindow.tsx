import { ReactNode } from "react";

export default function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md border border-term-border bg-term-panel/90 border-glow ${className}`}>
      <div className="flex items-center gap-2 border-b border-term-border px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-term-red/80" />
        <span className="h-3 w-3 rounded-full bg-term-amber/80" />
        <span className="h-3 w-3 rounded-full bg-term-green/80" />
        <span className="ml-2 truncate text-xs text-term-muted">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
