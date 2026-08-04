"use client";

import { useMemo, useState, type ReactNode } from "react";

function counts(s: string) {
  return {
    chars: s.length,
    words: s.trim() ? s.trim().split(/\s+/).length : 0,
    lines: s === "" ? 0 : s.split("\n").length,
  };
}

type Props = {
  transform: (input: string) => string;
  /** Option controls rendered above the editor. */
  controls?: ReactNode;
  initial?: string;
  inputPlaceholder?: string;
  outputLabel?: string;
  /** Extra note under the output (e.g. match counts). */
  note?: ReactNode;
  monospace?: boolean;
  downloadName?: string;
};

export default function TextToolShell({
  transform,
  controls,
  initial = "",
  inputPlaceholder = "Type or paste your text here…",
  outputLabel = "Output",
  note,
  monospace = false,
  downloadName = "output.txt",
}: Props) {
  const [input, setInput] = useState(initial);
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    try {
      return transform(input);
    } catch {
      return "";
    }
  }, [input, transform]);

  const inCount = counts(input);
  const outCount = counts(output);
  const mono = monospace ? "font-mono" : "";

  function copy() {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }
  function download() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function paste() {
    try {
      const t = await navigator.clipboard.readText();
      setInput((v) => v + t);
    } catch {
      /* clipboard read blocked */
    }
  }

  return (
    <div className="space-y-4">
      {controls && <div className="card p-4">{controls}</div>}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Input */}
        <div className="card flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Input</span>
            <div className="flex gap-1.5">
              <MiniBtn onClick={paste}>Paste</MiniBtn>
              <MiniBtn onClick={() => setInput("")} disabled={!input}>Clear</MiniBtn>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            spellCheck={false}
            className={`input scroll-thin min-h-[240px] flex-1 resize-y leading-relaxed ${mono}`}
          />
          <p className="mt-2 text-xs text-[var(--muted)]">
            {inCount.chars.toLocaleString()} chars · {inCount.words.toLocaleString()} words · {inCount.lines.toLocaleString()} lines
          </p>
        </div>

        {/* Output */}
        <div className="card flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">{outputLabel}</span>
            <div className="flex gap-1.5">
              <MiniBtn onClick={copy} disabled={!output}>{copied ? "Copied" : "Copy"}</MiniBtn>
              <MiniBtn onClick={download} disabled={!output}>Download</MiniBtn>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Result appears here…"
            spellCheck={false}
            className={`input scroll-thin min-h-[240px] flex-1 resize-y leading-relaxed ${mono}`}
            style={{ background: "var(--surface-2)" }}
          />
          <p className="mt-2 text-xs text-[var(--muted)]">
            {note ?? (
              <>
                {outCount.chars.toLocaleString()} chars · {outCount.words.toLocaleString()} words · {outCount.lines.toLocaleString()} lines
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniBtn({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
