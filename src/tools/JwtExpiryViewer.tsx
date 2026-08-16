"use client";

import { useEffect, useMemo, useState } from "react";
import { decodeJwt, formatClaimTime } from "@/lib/jwt";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function fmtDuration(ms: number): string {
  const s = Math.floor(Math.abs(ms) / 1000);
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const parts = [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${sec}s`].filter(Boolean);
  return parts.join(" ");
}

export default function JwtExpiryViewer() {
  const [token, setToken] = useState(SAMPLE);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const info = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const { payload } = decodeJwt(token);
      const p = (payload && typeof payload === "object" ? payload : {}) as Record<string, unknown>;
      return { ok: true as const, exp: typeof p.exp === "number" ? p.exp : null, iat: typeof p.iat === "number" ? p.iat : null, nbf: typeof p.nbf === "number" ? p.nbf : null };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid token" };
    }
  }, [token]);

  let status: { text: string; color: string; sub: string } | null = null;
  if (info?.ok) {
    if (info.exp === null) status = { text: "No expiry", color: "var(--muted)", sub: "This token has no exp claim — it does not expire on its own." };
    else {
      const diff = info.exp * 1000 - now;
      status = diff > 0
        ? { text: "Active", color: "var(--success)", sub: `Expires in ${fmtDuration(diff)}` }
        : { text: "Expired", color: "var(--danger)", sub: `Expired ${fmtDuration(diff)} ago` };
    }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">JWT</label>
        <textarea className="input scroll-thin min-h-[110px] w-full resize-y break-all font-mono text-sm" value={token} onChange={(e) => setToken(e.target.value)} spellCheck={false} placeholder="Paste a JSON Web Token…" />
      </div>

      {info?.ok && status && (
        <div className="card p-5 text-center">
          <div className="text-3xl font-bold" style={{ color: status.color }}>{status.text}</div>
          <p className="mt-1 text-sm text-[var(--muted)]">{status.sub}</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TimeCell label="Issued (iat)" sec={info.iat} />
            <TimeCell label="Not before (nbf)" sec={info.nbf} />
            <TimeCell label="Expires (exp)" sec={info.exp} />
          </div>
        </div>
      )}
      {info && !info.ok && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {info.error}</p>
      )}
    </div>
  );
}

function TimeCell({ label, sec }: { label: string; sec: number | null }) {
  const t = sec !== null ? formatClaimTime(sec) : null;
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
      <div className="text-xs text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{t ? t.iso.replace("T", " ").replace(/\.\d+Z$/, " UTC") : "—"}</div>
      {t && <div className="text-xs text-[var(--muted)]">{t.rel}</div>}
    </div>
  );
}
