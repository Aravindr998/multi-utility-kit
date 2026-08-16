"use client";

import { useState } from "react";

type Geo = {
  ip: string; type: string; city: string; region: string; country: string; countryCode: string;
  continent: string; latitude: number; longitude: number; timezone: string; isp: string; org: string; asn: string;
};

export default function IpLookup() {
  const [query, setQuery] = useState("");
  const [geo, setGeo] = useState<Geo | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (q: string) => {
    setBusy(true);
    setError(null);
    setGeo(null);
    try {
      const res = await fetch(`/api/ip?query=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setGeo(data as Geo);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed.");
    } finally {
      setBusy(false);
    }
  };

  const rows = geo && [
    { label: "IP address", value: `${geo.ip} (${geo.type})` },
    { label: "City", value: geo.city || "—" },
    { label: "Region", value: geo.region || "—" },
    { label: "Country", value: geo.country ? `${geo.country} (${geo.countryCode})` : "—" },
    { label: "Continent", value: geo.continent || "—" },
    { label: "Coordinates", value: geo.latitude != null ? `${geo.latitude}, ${geo.longitude}` : "—" },
    { label: "Timezone", value: geo.timezone || "—" },
    { label: "ISP", value: geo.isp || "—" },
    { label: "Organization", value: geo.org || "—" },
    { label: "ASN", value: geo.asn || "—" },
  ];

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">IP address</label>
        <div className="flex gap-2">
          <input className="input flex-1 font-mono" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup(query)} placeholder="8.8.8.8 (or leave blank for your own)" spellCheck={false} />
          <button className="btn btn-primary" onClick={() => lookup(query)} disabled={busy}>{busy ? "…" : "Look up"}</button>
        </div>
        <button className="mt-2 text-sm text-[var(--brand)] underline" onClick={() => { setQuery(""); lookup(""); }} disabled={busy}>Look up my IP address</button>
      </div>

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>✗ {error}</p>}

      {rows && (
        <div className="card p-4">
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between gap-3 rounded-md px-3 py-2" style={{ background: "var(--surface-2)" }}>
                <span className="text-xs font-semibold text-[var(--muted)]">{r.label}</span>
                <span className="text-right font-mono text-sm">{r.value}</span>
              </div>
            ))}
          </div>
          {geo && geo.latitude != null && (
            <a className="mt-3 inline-block text-sm text-[var(--brand)] underline" href={`https://www.openstreetmap.org/?mlat=${geo.latitude}&mlon=${geo.longitude}&zoom=10`} target="_blank" rel="noopener noreferrer nofollow">View on map ↗</a>
          )}
        </div>
      )}
    </div>
  );
}
