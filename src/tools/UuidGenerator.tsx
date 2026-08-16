"use client";

import { useCallback, useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";

const NIL = "00000000-0000-0000-0000-000000000000";

function uuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

function decorate(id: string, upper: boolean, hyphens: boolean, braces: boolean): string {
  let s = id;
  if (!hyphens) s = s.replace(/-/g, "");
  if (upper) s = s.toUpperCase();
  if (braces) s = `{${s}}`;
  return s;
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [braces, setBraces] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  const generate = useCallback(() => {
    const n = Math.min(Math.max(1, count), 1000);
    setIds(Array.from({ length: n }, () => uuidV4()));
  }, [count]);

  useEffect(() => { generate(); }, [generate]);

  const decorated = ids.map((id) => decorate(id, upper, hyphens, braces));
  const nilShown = decorate(NIL, upper, hyphens, braces);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">
          <div>
            <label className="label">How many?</label>
            <input type="number" min={1} max={1000} value={count} onChange={(e) => setCount(Number(e.target.value))} className="input w-28" />
          </div>
          <button className="btn btn-primary" onClick={generate}>Generate</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]"><input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-[var(--brand)]" />Uppercase</label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]"><input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} className="accent-[var(--brand)]" />Hyphens</label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]"><input type="checkbox" checked={braces} onChange={(e) => setBraces(e.target.checked)} className="accent-[var(--brand)]" />Braces</label>
        </div>
        <p className="mt-3 text-xs text-[var(--muted)]">Version 4 (random) UUIDs, generated locally with your browser&apos;s crypto API. Nil UUID: <span className="font-mono">{nilShown}</span></p>
      </div>

      {decorated.length > 0 && (
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">{decorated.length} UUID{decorated.length === 1 ? "" : "s"}</span>
            <CopyButton value={decorated.join("\n")} label="Copy all" />
          </div>
          <div className="scroll-thin max-h-[420px] space-y-1 overflow-auto">
            {decorated.map((id, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-md px-3 py-1.5 font-mono text-sm" style={{ background: "var(--surface-2)" }}>
                <span className="truncate">{id}</span>
                <CopyButton value={id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
