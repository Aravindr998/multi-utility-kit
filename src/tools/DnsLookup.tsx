"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";

const TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA", "SRV"];
const TYPE_NAMES: Record<number, string> = { 1: "A", 2: "NS", 5: "CNAME", 6: "SOA", 12: "PTR", 15: "MX", 16: "TXT", 28: "AAAA", 33: "SRV", 257: "CAA" };

type Answer = { name: string; type: number; TTL: number; data: string };

export default function DnsLookup() {
  const [domain, setDomain] = useState("example.com");
  const [type, setType] = useState("A");
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async () => {
    setBusy(true);
    setError(null);
    setAnswers(null);
    try {
      const res = await fetch(`/api/dns?name=${encodeURIComponent(domain.trim())}&type=${type}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setAnswers(data.answers as Answer[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div>
            <label className="label">Domain</label>
            <input className="input font-mono" value={domain} onChange={(e) => setDomain(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} placeholder="example.com" spellCheck={false} />
          </div>
          <div>
            <label className="label">Record type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={lookup} disabled={busy || !domain.trim()}>{busy ? "Looking up…" : "Look up DNS"}</button>
      </div>

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {error}</p>}

      {answers && (
        <div className="card p-4">
          {answers.length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No {type} records found for {domain}.</p>
          ) : (
            <div className="scroll-thin overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-[var(--muted)]">
                  <tr><th className="py-1 pr-3">Type</th><th className="py-1 pr-3">TTL</th><th className="py-1 pr-3">Value</th><th className="py-1" /></tr>
                </thead>
                <tbody className="font-mono">
                  {answers.map((a, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                      <td className="py-1.5 pr-3">{TYPE_NAMES[a.type] ?? a.type}</td>
                      <td className="py-1.5 pr-3 text-[var(--muted)]">{a.TTL}s</td>
                      <td className="py-1.5 pr-3 break-all">{a.data}</td>
                      <td className="py-1.5"><CopyButton value={a.data} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
