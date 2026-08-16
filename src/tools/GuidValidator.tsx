"use client";

import { useMemo, useState } from "react";

const CANONICAL = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VARIANTS: Record<string, string> = {
  "0": "NCS (reserved)", "1": "NCS (reserved)", "2": "NCS (reserved)", "3": "NCS (reserved)",
  "4": "NCS (reserved)", "5": "NCS (reserved)", "6": "NCS (reserved)", "7": "NCS (reserved)",
  "8": "RFC 4122", "9": "RFC 4122", a: "RFC 4122", b: "RFC 4122",
  c: "Microsoft (reserved)", d: "Microsoft (reserved)", e: "Future (reserved)", f: "Future (reserved)",
};

const VERSIONS: Record<string, string> = {
  "1": "v1 — time-based", "2": "v2 — DCE security", "3": "v3 — MD5 name-based",
  "4": "v4 — random", "5": "v5 — SHA-1 name-based", "6": "v6 — reordered time", "7": "v7 — Unix-time", "8": "v8 — custom",
};

function analyse(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const stripped = trimmed.replace(/^[{(]|[})]$/g, "");
  const canonical = CANONICAL.test(stripped);
  const noHyphens = /^[0-9a-f]{32}$/i.test(stripped);
  const valid = canonical || noHyphens;
  if (!valid) {
    return { valid: false as const, reason: /[^0-9a-f{}()-]/i.test(trimmed) ? "Contains characters that aren't valid hex digits." : "Not a valid GUID/UUID shape (expected 32 hex digits)." };
  }
  const hex = stripped.replace(/-/g, "");
  const isNil = /^0{32}$/.test(hex);
  const versionChar = hex[12];
  const variantChar = hex[16].toLowerCase();
  return {
    valid: true as const,
    canonical,
    nil: isNil,
    version: isNil ? "Nil UUID" : VERSIONS[versionChar] ?? `Unknown (${versionChar})`,
    variant: isNil ? "—" : VARIANTS[variantChar] ?? "Unknown",
  };
}

export default function GuidValidator() {
  const [input, setInput] = useState("550e8400-e29b-41d4-a716-446655440000");
  const result = useMemo(() => analyse(input), [input]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">GUID / UUID</label>
        <input className="input font-mono" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000" />
        <p className="mt-2 text-xs text-[var(--muted)]">Accepts hyphenated, unhyphenated, and brace/parenthesis-wrapped forms.</p>
      </div>

      {result && (
        <div className="rounded-lg p-4" style={{ background: result.valid ? "color-mix(in srgb, var(--success) 12%, transparent)" : "color-mix(in srgb, var(--danger) 12%, transparent)", color: result.valid ? "var(--success)" : "var(--danger)" }}>
          {result.valid ? (
            <div>
              <p className="font-semibold">✓ Valid GUID/UUID</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-[var(--foreground)] sm:grid-cols-3">
                <Info label="Version" value={result.version} />
                <Info label="Variant" value={result.variant} />
                <Info label="Format" value={result.canonical ? "Canonical (hyphenated)" : "No hyphens"} />
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold">✗ Invalid</p>
              <p className="mt-1 text-sm">{result.reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 font-semibold">{value}</div>
    </div>
  );
}
