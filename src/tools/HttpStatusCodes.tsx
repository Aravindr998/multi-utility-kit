"use client";

import { useMemo, useState } from "react";

type Code = { code: number; name: string; desc: string };

const CODES: Code[] = [
  { code: 100, name: "Continue", desc: "The client should continue with its request." },
  { code: 101, name: "Switching Protocols", desc: "The server is switching protocols as requested." },
  { code: 103, name: "Early Hints", desc: "Return some response headers before the final response." },
  { code: 200, name: "OK", desc: "The request succeeded." },
  { code: 201, name: "Created", desc: "The request succeeded and a new resource was created." },
  { code: 202, name: "Accepted", desc: "The request was accepted but not yet processed." },
  { code: 204, name: "No Content", desc: "Success, but there is no content to return." },
  { code: 206, name: "Partial Content", desc: "The server delivered part of the resource (range request)." },
  { code: 301, name: "Moved Permanently", desc: "The resource has permanently moved to a new URL." },
  { code: 302, name: "Found", desc: "The resource temporarily resides at a different URL." },
  { code: 304, name: "Not Modified", desc: "The cached version is still valid; no need to re-send." },
  { code: 307, name: "Temporary Redirect", desc: "Repeat the request to another URL, keeping the method." },
  { code: 308, name: "Permanent Redirect", desc: "The resource permanently moved; keep the method." },
  { code: 400, name: "Bad Request", desc: "The server could not understand the request." },
  { code: 401, name: "Unauthorized", desc: "Authentication is required and has failed or not been provided." },
  { code: 403, name: "Forbidden", desc: "The client does not have access rights to the content." },
  { code: 404, name: "Not Found", desc: "The server cannot find the requested resource." },
  { code: 405, name: "Method Not Allowed", desc: "The request method is not supported for this resource." },
  { code: 408, name: "Request Timeout", desc: "The server timed out waiting for the request." },
  { code: 409, name: "Conflict", desc: "The request conflicts with the current state of the server." },
  { code: 410, name: "Gone", desc: "The resource is permanently gone." },
  { code: 413, name: "Payload Too Large", desc: "The request body is larger than the server will accept." },
  { code: 415, name: "Unsupported Media Type", desc: "The media format is not supported." },
  { code: 418, name: "I'm a teapot", desc: "The server refuses to brew coffee with a teapot." },
  { code: 422, name: "Unprocessable Entity", desc: "The request was well-formed but semantically invalid." },
  { code: 429, name: "Too Many Requests", desc: "The user has sent too many requests (rate limiting)." },
  { code: 500, name: "Internal Server Error", desc: "The server encountered an unexpected condition." },
  { code: 501, name: "Not Implemented", desc: "The server does not support the functionality required." },
  { code: 502, name: "Bad Gateway", desc: "An upstream server sent an invalid response." },
  { code: 503, name: "Service Unavailable", desc: "The server is not ready to handle the request." },
  { code: 504, name: "Gateway Timeout", desc: "An upstream server did not respond in time." },
  { code: 505, name: "HTTP Version Not Supported", desc: "The HTTP version is not supported by the server." },
];

const CLASSES: Record<number, { label: string; color: string }> = {
  1: { label: "Informational", color: "#6366f1" },
  2: { label: "Success", color: "#16a34a" },
  3: { label: "Redirection", color: "#0891b2" },
  4: { label: "Client Error", color: "#d97706" },
  5: { label: "Server Error", color: "#dc2626" },
};

export default function HttpStatusCodes() {
  const [q, setQ] = useState("");
  const [cls, setCls] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return CODES.filter((c) => {
      if (cls && Math.floor(c.code / 100) !== cls) return false;
      if (!query) return true;
      return String(c.code).includes(query) || c.name.toLowerCase().includes(query) || c.desc.toLowerCase().includes(query);
    });
  }, [q, cls]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by code, name or meaning…" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={cls === null} onClick={() => setCls(null)} label="All" />
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} active={cls === n} onClick={() => setCls(n)} label={`${n}xx ${CLASSES[n].label}`} color={CLASSES[n].color} />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((c) => {
          const klass = CLASSES[Math.floor(c.code / 100)];
          return (
            <div key={c.code} className="card flex items-start gap-3 p-3">
              <span className="shrink-0 rounded-md px-2.5 py-1 font-mono text-sm font-bold text-white" style={{ background: klass.color }}>{c.code}</span>
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-[var(--muted)]">{c.desc}</div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p className="text-sm text-[var(--muted)]">No status codes match “{q}”.</p>}
      </div>
    </div>
  );
}

function Chip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color?: string }) {
  return (
    <button onClick={onClick} className="rounded-full px-3 py-1 text-sm font-medium"
      style={{ background: active ? (color ?? "var(--brand)") : "var(--surface-2)", color: active ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}>
      {label}
    </button>
  );
}
