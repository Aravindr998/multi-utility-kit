"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { decodeJwt, formatClaimTime } from "@/lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const TIME_CLAIMS = new Set(["exp", "iat", "nbf", "auth_time", "updated_at"]);

export function ClaimBlock({ title, value, raw }: { title: string; value: unknown; raw?: string }) {
  const json = JSON.stringify(value, null, 2);
  return (
    <div className="card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <CopyButton value={json} />
      </div>
      <pre className="scroll-thin overflow-auto rounded-lg p-3 font-mono text-sm" style={{ background: "var(--surface-2)" }}>{json}</pre>
      {value !== null && typeof value === "object" && (
        <div className="mt-2 space-y-1">
          {Object.entries(value as Record<string, unknown>)
            .filter(([k, v]) => TIME_CLAIMS.has(k) && typeof v === "number")
            .map(([k, v]) => {
              const t = formatClaimTime(v as number);
              return <p key={k} className="text-xs text-[var(--muted)]"><span className="font-mono">{k}</span> → {t.iso} ({t.rel})</p>;
            })}
        </div>
      )}
      {raw && <p className="mt-2 break-all font-mono text-xs text-[var(--muted)]">{raw}</p>}
    </div>
  );
}

export default function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE);
  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try { return { ok: true as const, ...decodeJwt(token) }; }
    catch (e) { return { ok: false as const, error: e instanceof Error ? e.message : "Invalid token" }; }
  }, [token]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">JWT</label>
        <textarea className="input scroll-thin min-h-[120px] w-full resize-y break-all font-mono text-sm" value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} placeholder="Paste a JSON Web Token…" />
        <p className="mt-2 text-xs text-[var(--muted)]">Decoded entirely in your browser — the token is never sent anywhere.</p>
      </div>

      {decoded?.ok ? (
        <>
          <ClaimBlock title="Header" value={decoded.header} />
          <ClaimBlock title="Payload" value={decoded.payload} />
          <ClaimBlock title="Signature" value={decoded.signature} />
        </>
      ) : decoded && !decoded.ok ? (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {decoded.error}</p>
      ) : null}
    </div>
  );
}
