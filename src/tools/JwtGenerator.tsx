"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import { signJwt, type HsAlg } from "@/lib/jwt";

const DEFAULT_PAYLOAD = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "admin": true\n}';

export default function JwtGenerator() {
  const [alg, setAlg] = useState<HsAlg>("HS256");
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [expMins, setExpMins] = useState("60");
  const [addIat, setAddIat] = useState(true);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setError(null);
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(payloadText);
      if (typeof payload !== "object" || payload === null || Array.isArray(payload)) throw new Error();
    } catch {
      setError("Payload must be a valid JSON object.");
      return;
    }
    const nowSec = Math.floor(Date.now() / 1000);
    if (addIat) payload.iat = nowSec;
    const mins = Number(expMins);
    if (expMins.trim() && isFinite(mins) && mins > 0) payload.exp = nowSec + Math.round(mins * 60);
    try {
      setToken(await signJwt(alg, payload, secret));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not sign the token.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">Algorithm</label>
        <div className="flex flex-wrap gap-2">
          {(["HS256", "HS384", "HS512"] as HsAlg[]).map((a) => (
            <button key={a} onClick={() => setAlg(a)}
              className="rounded-md px-3 py-1.5 text-sm font-semibold"
              style={{ background: alg === a ? "var(--brand)" : "var(--surface-2)", color: alg === a ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
              {a}
            </button>
          ))}
        </div>

        <label className="label mt-4">Payload (JSON)</label>
        <textarea className="input scroll-thin min-h-[160px] w-full resize-y font-mono text-sm leading-relaxed" value={payloadText} onChange={(e) => setPayloadText(e.target.value)} spellCheck={false} />

        <div className="mt-4 flex flex-wrap items-end gap-x-5 gap-y-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
            <input type="checkbox" checked={addIat} onChange={(e) => setAddIat(e.target.checked)} className="accent-[var(--brand)]" />
            Add issued-at (iat)
          </label>
          <div>
            <label className="label">Expires in (minutes)</label>
            <input className="input w-32" value={expMins} onChange={(e) => setExpMins(e.target.value)} placeholder="blank = none" />
          </div>
        </div>

        <label className="label mt-4">Secret</label>
        <input className="input font-mono" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="HMAC shared secret" />

        <button className="btn btn-primary mt-4" onClick={generate}>Generate token</button>
      </div>

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {error}</p>}

      {token && (
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Signed JWT</span>
            <CopyButton value={token} />
          </div>
          <p className="scroll-thin max-h-52 overflow-auto break-all rounded-lg p-3 font-mono text-sm" style={{ background: "var(--surface-2)" }}>{token}</p>
          <p className="mt-2 text-xs text-[var(--muted)]">Signed locally with Web Crypto. Never paste production secrets into any online tool.</p>
        </div>
      )}
    </div>
  );
}
