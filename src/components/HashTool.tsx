"use client";

import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import FileDropzone from "@/components/FileDropzone";
import { hashText, hashBytes, type HashAlgo } from "@/lib/hash";

export default function HashTool({ algos }: { algos: HashAlgo[] }) {
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mode === "text") {
        const entries = await Promise.all(algos.map(async (a) => [a, await hashText(a, text)] as const));
        if (!cancelled) setResults(Object.fromEntries(entries));
      } else if (fileBytes) {
        setBusy(true);
        const entries = await Promise.all(algos.map(async (a) => [a, await hashBytes(a, fileBytes)] as const));
        if (!cancelled) { setResults(Object.fromEntries(entries)); setBusy(false); }
      } else {
        setResults({});
      }
    })();
    return () => { cancelled = true; };
  }, [text, fileBytes, mode, algos]);

  const onFiles = async (files: File[]) => {
    const f = files[0];
    setFileName(f.name);
    setFileBytes(new Uint8Array(await f.arrayBuffer()));
  };

  const has = (mode === "text" && text) || (mode === "file" && fileBytes);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-3 flex gap-2">
          {(["text", "file"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className="rounded-md px-3 py-1.5 text-sm font-medium capitalize"
              style={{ background: mode === m ? "var(--brand)" : "var(--surface-2)", color: mode === m ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
              {m === "text" ? "Text" : "File"}
            </button>
          ))}
        </div>

        {mode === "text" ? (
          <textarea className="input scroll-thin min-h-[140px] w-full resize-y font-mono leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste text to hash…" spellCheck={false} />
        ) : (
          <FileDropzone onFiles={onFiles} icon="🔐" label={fileName ? fileName : "Drop a file to hash"} hint="Hashed locally — never uploaded" />
        )}
      </div>

      {has && (
        <div className="card p-4">
          {busy && <p className="mb-2 text-sm text-[var(--muted)]">Hashing…</p>}
          <div className="space-y-2">
            {algos.map((a) => (
              <div key={a} className="flex items-center justify-between gap-2 rounded-md px-3 py-2" style={{ background: "var(--surface-2)" }}>
                <span className="w-20 shrink-0 text-xs font-semibold text-[var(--muted)]">{a}</span>
                <span className="flex-1 break-all font-mono text-sm">{results[a] ?? "…"}</span>
                <CopyButton value={results[a] ?? ""} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
