"use client";

import { useEffect, useMemo, useState } from "react";

const POPULAR = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD", "CHF", "CNY", "AED"];

function currencyName(code: string): string {
  try {
    const dn = new Intl.DisplayNames(undefined, { type: "currency" });
    return dn.of(code) || code;
  } catch {
    return code;
  }
}

export default function CurrencyConverter() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [updated, setUpdated] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        if (!res.ok) throw new Error("network");
        const data = await res.json();
        if (cancelled) return;
        if (data?.rates) {
          setRates(data.rates);
          setUpdated(data.time_last_update_utc || "");
        } else {
          setError("Could not load exchange rates. Please try again later.");
        }
      } catch {
        if (!cancelled) setError("Could not load exchange rates. Check your connection and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const codes = useMemo(() => (rates ? Object.keys(rates).sort() : []), [rates]);

  const converted = useMemo(() => {
    const a = parseFloat(amount);
    if (!rates || isNaN(a) || !rates[from] || !rates[to]) return null;
    // rates are per 1 USD; cross-rate via USD.
    return (a / rates[from]) * rates[to];
  }, [amount, from, to, rates]);

  const unitRate = useMemo(() => {
    if (!rates || !rates[from] || !rates[to]) return null;
    return rates[to] / rates[from];
  }, [from, to, rates]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  if (loading) {
    return (
      <div className="card grid place-items-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }} aria-label="Loading rates" />
        <p className="mt-3 text-sm text-[var(--muted)]">Fetching latest exchange rates…</p>
      </div>
    );
  }

  if (error || !rates) {
    return <p className="rounded-lg p-4 text-center text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error || "Rates unavailable."}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="card grid gap-3 p-5 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label className="label">Amount</label>
          <input type="number" className="input mb-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <CurrencySelect value={from} onChange={setFrom} codes={codes} />
        </div>

        <button aria-label="Swap currencies" className="btn btn-secondary h-10 self-center sm:mb-1" onClick={swap}>⇄</button>

        <div>
          <label className="label">Converted to</label>
          <div className="input mb-2 flex items-center font-semibold" style={{ background: "var(--surface-2)" }}>
            {converted !== null ? converted.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "—"}
          </div>
          <CurrencySelect value={to} onChange={setTo} codes={codes} />
        </div>
      </div>

      {converted !== null && unitRate !== null && (
        <div className="text-center">
          <p className="text-lg font-semibold">
            {parseFloat(amount).toLocaleString()} {from} ={" "}
            <span style={{ color: "var(--brand)" }}>{converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}</span>
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">1 {from} = {unitRate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}</p>
          {updated && <p className="mt-1 text-xs text-[var(--muted)]">Rates updated: {updated}</p>}
        </div>
      )}
    </div>
  );
}

function CurrencySelect({ value, onChange, codes }: { value: string; onChange: (v: string) => void; codes: string[] }) {
  const popular = POPULAR.filter((c) => codes.includes(c));
  const rest = codes.filter((c) => !POPULAR.includes(c));
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Currency">
      <optgroup label="Popular">
        {popular.map((c) => (
          <option key={c} value={c}>{c} — {currencyName(c)}</option>
        ))}
      </optgroup>
      <optgroup label="All currencies">
        {rest.map((c) => (
          <option key={c} value={c}>{c} — {currencyName(c)}</option>
        ))}
      </optgroup>
    </select>
  );
}
