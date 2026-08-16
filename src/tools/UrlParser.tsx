"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

const SAMPLE = "https://user:pass@www.example.com:8443/path/to/page?q=hello&lang=en&page=2#section";

function parse(input: string) {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const u = new URL(raw);
    const params = Array.from(u.searchParams.entries());
    return {
      ok: true as const,
      parts: [
        { label: "Origin", value: u.origin },
        { label: "Protocol", value: u.protocol.replace(/:$/, "") },
        { label: "Hostname", value: u.hostname },
        { label: "Port", value: u.port || "(default)" },
        { label: "Path", value: u.pathname },
        { label: "Query", value: u.search || "(none)" },
        { label: "Fragment", value: u.hash.replace(/^#/, "") || "(none)" },
        { label: "Username", value: u.username || "(none)" },
        { label: "Password", value: u.password ? "•".repeat(u.password.length) : "(none)" },
      ],
      params,
    };
  } catch {
    return { ok: false as const };
  }
}

export default function UrlParser() {
  const [input, setInput] = useState(SAMPLE);
  const result = useMemo(() => parse(input), [input]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">URL</label>
        <input className="input font-mono" value={input} onChange={(e) => setInput(e.target.value)} spellCheck={false} placeholder="https://example.com/path?q=1" />
      </div>

      {result?.ok && (
        <>
          <div className="card p-4">
            <p className="mb-3 text-sm font-semibold">Components</p>
            <div className="space-y-2">
              {result.parts.map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-2 rounded-md px-3 py-2" style={{ background: "var(--surface-2)" }}>
                  <span className="w-24 shrink-0 text-xs font-semibold text-[var(--muted)]">{p.label}</span>
                  <span className="flex-1 truncate font-mono text-sm">{p.value}</span>
                  <CopyButton value={p.value} />
                </div>
              ))}
            </div>
          </div>

          {result.params.length > 0 && (
            <div className="card p-4">
              <p className="mb-3 text-sm font-semibold">Query parameters ({result.params.length})</p>
              <div className="scroll-thin overflow-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
                <table className="w-full text-left text-sm">
                  <thead style={{ background: "var(--surface-2)" }}>
                    <tr><th className="px-3 py-1.5 font-semibold">Key</th><th className="px-3 py-1.5 font-semibold">Value</th></tr>
                  </thead>
                  <tbody className="font-mono">
                    {result.params.map(([k, v], i) => (
                      <tr key={i} className="border-t" style={{ borderColor: "var(--border)" }}>
                        <td className="px-3 py-1.5">{k}</td>
                        <td className="px-3 py-1.5">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {result && !result.ok && input.trim() && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>
          ✗ Not a valid absolute URL. Include a scheme like <span className="font-mono">https://</span>.
        </p>
      )}
    </div>
  );
}
