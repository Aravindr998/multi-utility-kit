"use client";

import { useEffect, useMemo, useState } from "react";

type Info = { label: string; value: string }[];

function parseUA(ua: string): Info {
  const s = ua;
  // Browser (order matters: check niche brands before generic ones).
  let browser = "Unknown", version = "";
  const b: [RegExp, string][] = [
    [/Edg\/([\d.]+)/, "Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/SamsungBrowser\/([\d.]+)/, "Samsung Internet"],
    [/Firefox\/([\d.]+)/, "Firefox"],
    [/Chrome\/([\d.]+)/, "Chrome"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
    [/MSIE ([\d.]+)/, "Internet Explorer"],
    [/Trident.*rv:([\d.]+)/, "Internet Explorer"],
  ];
  for (const [re, name] of b) {
    const m = s.match(re);
    if (m) { browser = name; version = m[1]; break; }
  }

  // Engine
  let engine = "Unknown";
  if (/Gecko\/|Firefox/.test(s) && !/like Gecko/.test(s)) engine = "Gecko";
  else if (/AppleWebKit/.test(s)) engine = /Chrome|Edg|OPR/.test(s) ? "Blink" : "WebKit";
  else if (/Trident/.test(s)) engine = "Trident";

  // OS
  let os = "Unknown";
  if (/Windows NT 10/.test(s)) os = "Windows 10/11";
  else if (/Windows NT 6\.3/.test(s)) os = "Windows 8.1";
  else if (/Windows NT 6\.1/.test(s)) os = "Windows 7";
  else if (/Windows/.test(s)) os = "Windows";
  else if (/Android ([\d.]+)/.test(s)) os = `Android ${s.match(/Android ([\d.]+)/)![1]}`;
  else if (/iPhone OS ([\d_]+)/.test(s)) os = `iOS ${s.match(/iPhone OS ([\d_]+)/)![1].replace(/_/g, ".")}`;
  else if (/iPad.*OS ([\d_]+)/.test(s)) os = `iPadOS ${s.match(/OS ([\d_]+)/)![1].replace(/_/g, ".")}`;
  else if (/Mac OS X ([\d_]+)/.test(s)) os = `macOS ${s.match(/Mac OS X ([\d_]+)/)![1].replace(/_/g, ".")}`;
  else if (/CrOS/.test(s)) os = "ChromeOS";
  else if (/Linux/.test(s)) os = "Linux";

  // Device type
  let device = "Desktop";
  if (/Mobile|iPhone|Android.*Mobile/.test(s)) device = "Mobile";
  else if (/iPad|Tablet|Android(?!.*Mobile)/.test(s)) device = "Tablet";
  if (/bot|crawler|spider|slurp/i.test(s)) device = "Bot / crawler";

  return [
    { label: "Browser", value: version ? `${browser} ${version}` : browser },
    { label: "Engine", value: engine },
    { label: "Operating system", value: os },
    { label: "Device type", value: device },
  ];
}

export default function UserAgentParser() {
  const [ua, setUa] = useState("");

  useEffect(() => {
    if (typeof navigator !== "undefined") setUa(navigator.userAgent);
  }, []);

  const info = useMemo(() => (ua.trim() ? parseUA(ua) : null), [ua]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">User-Agent string</label>
          <button className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)]" onClick={() => setUa(navigator.userAgent)}>Use mine</button>
        </div>
        <textarea className="input scroll-thin min-h-[90px] w-full resize-y font-mono text-sm" value={ua} onChange={(e) => setUa(e.target.value)} spellCheck={false} placeholder="Paste a User-Agent string…" />
      </div>

      {info && (
        <div className="card p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {info.map((i) => (
              <div key={i.label} className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
                <div className="text-xs text-[var(--muted)]">{i.label}</div>
                <div className="mt-0.5 font-semibold">{i.value}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">Parsing is heuristic — modern browsers deliberately freeze or reduce UA details, so some values may be approximate.</p>
        </div>
      )}
    </div>
  );
}
