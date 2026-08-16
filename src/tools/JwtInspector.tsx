"use client";

import { useEffect, useMemo, useState } from "react";
import { ClaimBlock } from "./JwtDecoder";
import { decodeJwt, verifyJwt, formatClaimTime } from "@/lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

type Check = { label: string; ok: boolean | null; detail: string };

function claimChecks(payload: unknown): Check[] {
  const checks: Check[] = [];
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    const now = Date.now() / 1000;
    if (typeof p.exp === "number") checks.push({ label: "Expiration (exp)", ok: p.exp > now, detail: `${formatClaimTime(p.exp).iso} — ${p.exp > now ? "not expired" : "expired"}` });
    if (typeof p.nbf === "number") checks.push({ label: "Not before (nbf)", ok: p.nbf <= now, detail: `${formatClaimTime(p.nbf).iso} — ${p.nbf <= now ? "active" : "not yet valid"}` });
    if (typeof p.iat === "number") checks.push({ label: "Issued at (iat)", ok: p.iat <= now + 60, detail: `${formatClaimTime(p.iat).iso}` });
  }
  return checks;
}

export default function JwtInspector() {
  const [token, setToken] = useState(SAMPLE);
  const [secret, setSecret] = useState("");
  const [sigValid, setSigValid] = useState<boolean | null>(null);

  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try { return { ok: true as const, ...decodeJwt(token) }; }
    catch (e) { return { ok: false as const, error: e instanceof Error ? e.message : "Invalid token" }; }
  }, [token]);

  useEffect(() => {
    let cancelled = false;
    if (!secret || !decoded?.ok) { setSigValid(null); return; }
    verifyJwt(token, secret).then((v) => { if (!cancelled) setSigValid(v); }).catch(() => { if (!cancelled) setSigValid(false); });
    return () => { cancelled = true; };
  }, [token, secret, decoded]);

  const checks = decoded?.ok ? claimChecks(decoded.payload) : [];
  const alg = decoded?.ok && decoded.header && typeof decoded.header === "object" ? (decoded.header as { alg?: string }).alg : undefined;

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">JWT</label>
        <textarea className="input scroll-thin min-h-[120px] w-full resize-y break-all font-mono text-sm" value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} placeholder="Paste a JSON Web Token…" />
      </div>

      {decoded?.ok && (
        <>
          <div className="card p-4">
            <label className="label">Verify signature (HMAC secret)</label>
            <input className="input font-mono" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder={alg?.startsWith("HS") ? "Enter the shared secret…" : "Only HS256/384/512 can be verified here"} disabled={!alg?.startsWith("HS")} />
            {secret && (
              <p className="mt-2 text-sm font-semibold" style={{ color: sigValid ? "var(--success)" : "var(--danger)" }}>
                {sigValid === null ? "Checking…" : sigValid ? "✓ Signature verified" : "✗ Signature does not match"}
              </p>
            )}
          </div>

          {checks.length > 0 && (
            <div className="card p-4">
              <p className="mb-3 text-sm font-semibold">Standard claims</p>
              <div className="space-y-2">
                {checks.map((c) => (
                  <div key={c.label} className="flex items-start justify-between gap-3 rounded-md px-3 py-2" style={{ background: "var(--surface-2)" }}>
                    <span className="text-sm font-medium">{c.label}</span>
                    <span className="text-right text-sm" style={{ color: c.ok ? "var(--success)" : "var(--danger)" }}>{c.ok ? "✓" : "✗"} <span className="text-[var(--muted)]">{c.detail}</span></span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <ClaimBlock title="Header" value={decoded.header} />
          <ClaimBlock title="Payload" value={decoded.payload} />
        </>
      )}
      {decoded && !decoded.ok && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {decoded.error}</p>
      )}
    </div>
  );
}
