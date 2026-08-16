"use client";

import { useEffect, useMemo, useState } from "react";
import { BigResult, Field, SplitBar, Stat } from "./finance/shared";
import { yearsLabel, yearsToReach } from "./savings/shared";
import { CITIES, HOUSEHOLDS, resolvePlace, type PlaceInput, type ResolvedPlace } from "./data/citiesCol";

/** Handful of well-known cities shown as one-tap chips (no typing needed). */
const POPULAR_IDS = [
  "new-york-us", "london-gb", "dubai-ae", "singapore-sg", "tokyo-jp", "sydney-au",
  "mumbai-in", "kochi-in", "bangalore-in", "toronto-ca", "berlin-de", "sao-paulo-br",
];

/** Currency-aware money formatter (whole units — emergency funds are big, round numbers). */
function fmt(amount: number, currency: string): string {
  if (!isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString()}`;
  }
}

function currencyName(code: string): string {
  try {
    return new Intl.DisplayNames(undefined, { type: "currency" }).of(code) || code;
  } catch {
    return code;
  }
}

function placeLabel(p: ResolvedPlace | PlaceInput): string {
  const name = "city" in p ? p.city : p.name;
  return [name, p.region, p.country].filter(Boolean).join(", ");
}

const START: ResolvedPlace = { ...CITIES.find((c) => c.id === "new-york-us")!, curated: true };

export default function CityEmergencyFund() {
  // --- live exchange rates (per 1 USD), fetched once like the Currency Converter ---
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [ratesUpdated, setRatesUpdated] = useState("");
  const [ratesError, setRatesError] = useState(false);

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
          setRatesUpdated(data.time_last_update_utc || "");
        } else setRatesError(true);
      } catch {
        if (!cancelled) setRatesError(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const [place, setPlace] = useState<ResolvedPlace>(START);
  const [currency, setCurrency] = useState(START.currency);
  const [household, setHousehold] = useState("single");
  const [months, setMonths] = useState("6");
  const [savings, setSavings] = useState("");
  const [contribution, setContribution] = useState("");
  const [override, setOverride] = useState("");

  // --- city search (Open-Meteo geocoding — free, no key) ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceInput[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchNote, setSearchNote] = useState<string | null>(null);

  const [locating, setLocating] = useState(false);
  const [locateMsg, setLocateMsg] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearchNote(null);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`
        );
        const data = await res.json();
        if (cancelled) return;
        const list: PlaceInput[] = (data?.results || []).map((r: Record<string, unknown>) => ({
          id: r.id as number,
          name: r.name as string,
          country: r.country as string,
          cc: r.country_code as string,
          population: r.population as number | undefined,
          region: r.admin1 as string | undefined,
        }));
        setResults(list);
        setSearchNote(list.length ? null : `No match for “${q}”. Try a nearby larger city.`);
      } catch {
        if (!cancelled) setSearchNote("Search is unavailable right now — try again in a moment.");
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query]);

  // Choosing a place sets currency in the handler (never an effect) — dodging the
  // React Compiler's set-state-in-effect rule.
  function choosePlace(input: PlaceInput, curatedFallback?: ResolvedPlace) {
    const rp = curatedFallback ?? resolvePlace(input);
    setPlace(rp);
    // Fall back to USD only if the feed has loaded and lacks this currency.
    const usable = !rates || rates[rp.currency] !== undefined;
    setCurrency(usable ? rp.currency : "USD");
    setOverride("");
    setQuery("");
    setResults([]);
    setSearchNote(null);
  }

  function detectLocation() {
    if (!("geolocation" in navigator)) {
      setLocateMsg("Location isn't available in this browser — search for your city instead.");
      return;
    }
    setLocating(true);
    setLocateMsg(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();
          const name = data?.city || data?.locality;
          if (name && data?.countryCode) {
            choosePlace({
              name,
              cc: data.countryCode,
              country: data.countryName,
              region: data.principalSubdivision,
            });
            setLocateMsg(`Detected ${name}, ${data.countryName}.`);
          } else {
            setLocateMsg("Couldn't pinpoint your city — please search for it below.");
          }
        } catch {
          setLocateMsg("Couldn't detect your city — please search for it below.");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setLocating(false);
        setLocateMsg("Location permission denied — search for your city below.");
      },
      { timeout: 10000 }
    );
  }

  const rate = rates ? rates[currency] : currency === "USD" ? 1 : undefined;

  const result = useMemo(() => {
    const mult = HOUSEHOLDS.find((h) => h.id === household)?.multiplier ?? 1;
    const m = parseFloat(months);
    if (!isFinite(m) || m <= 0 || rate === undefined) return null;

    const estimateLocal = place.monthlyUsd * mult * rate;
    const ov = parseFloat(override);
    const monthly = isFinite(ov) && ov > 0 ? ov : estimateLocal;

    const target = monthly * m;
    const cur = parseFloat(savings) || 0;
    const contrib = parseFloat(contribution) || 0;
    const gap = Math.max(0, target - cur);
    const time = gap === 0 ? 0 : contrib > 0 ? yearsToReach(cur, contrib, 0, target) : Infinity;
    const pctCovered = target > 0 ? Math.min(100, (cur / target) * 100) : 0;

    return { monthly, estimateLocal, target, cur, gap, time, pctCovered, covered: cur >= target };
  }, [place, household, months, savings, contribution, override, rate]);

  const popular = POPULAR_IDS.map((id) => CITIES.find((c) => c.id === id)).filter(Boolean) as typeof CITIES;
  const usingLiveRate = rates !== null && currency !== "USD";

  return (
    <div className="space-y-4">
      {/* Location + search */}
      <div className="card space-y-4 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-secondary" onClick={detectLocation} disabled={locating}>
            {locating ? "Locating…" : "📍 Use my location"}
          </button>
          {locateMsg && <span className="text-sm text-[var(--muted)]">{locateMsg}</span>}
        </div>

        <Field label="Search your city" htmlFor="ef-search" hint="type any city in the world">
          <div className="relative">
            <input
              id="ef-search"
              type="text"
              autoComplete="off"
              className="input"
              placeholder="e.g. Kochi, Nairobi, Lisbon…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {(results.length > 0 || searching || searchNote) && (
              <div
                className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border shadow-lg"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                {searching && <div className="px-3 py-2 text-sm text-[var(--muted)]">Searching…</div>}
                {!searching && searchNote && (
                  <div className="px-3 py-2 text-sm text-[var(--muted)]">{searchNote}</div>
                )}
                {results.map((r) => (
                  <button
                    key={String(r.id)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)]"
                    onClick={() => choosePlace(r)}
                  >
                    <span>{placeLabel(r)}</span>
                    {r.population ? (
                      <span className="shrink-0 text-xs text-[var(--faint)]">
                        {Intl.NumberFormat(undefined, { notation: "compact" }).format(r.population)}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        <div className="flex flex-wrap gap-2">
          {popular.map((c) => (
            <button
              key={c.id}
              className="rounded-full border px-3 py-1 text-sm hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--border)" }}
              onClick={() => choosePlace({ name: c.city, cc: c.cc, country: c.country }, { ...c, curated: true })}
            >
              {c.city}
            </button>
          ))}
        </div>

        {ratesError && (
          <p
            className="rounded-lg p-3 text-sm"
            style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}
          >
            Couldn&apos;t load live exchange rates, so amounts are shown in USD. The cost-of-living
            estimates still work.
          </p>
        )}
      </div>

      {/* Selected place + assumptions */}
      <div className="card space-y-4 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-lg font-semibold">{placeLabel(place)}</p>
            <p className="text-xs text-[var(--faint)]">
              {place.curated
                ? "Curated cost-of-living estimate"
                : "Estimated from country averages — adjust the monthly figure for accuracy"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Household" htmlFor="ef-house">
            <select id="ef-house" className="input" value={household} onChange={(e) => setHousehold(e.target.value)}>
              {HOUSEHOLDS.map((h) => (
                <option key={h.id} value={h.id}>{h.label}</option>
              ))}
            </select>
          </Field>

          <Field label="Months of cover" htmlFor="ef-months" hint="usually 3–12">
            <input id="ef-months" type="number" min={1} className="input" value={months} onChange={(e) => setMonths(e.target.value)} />
          </Field>

          <Field
            label="Show amounts in"
            htmlFor="ef-cur"
            hint={rate === undefined ? "not in the live rate feed" : undefined}
          >
            <select id="ef-cur" className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {(rates ? Object.keys(rates).sort() : [currency]).map((c) => (
                <option key={c} value={c}>{c} — {currencyName(c)}</option>
              ))}
            </select>
          </Field>

          <Field
            label="Monthly expenses"
            htmlFor="ef-override"
            hint={result ? `estimate: ${fmt(result.estimateLocal, currency)} — edit to override` : "leave blank to use the estimate"}
          >
            <input
              id="ef-override"
              type="number"
              className="input"
              placeholder={result ? String(Math.round(result.estimateLocal)) : ""}
              value={override}
              onChange={(e) => setOverride(e.target.value)}
            />
          </Field>

          <Field label={`Current savings (${currency})`} htmlFor="ef-savings">
            <input id="ef-savings" type="number" className="input" placeholder="0" value={savings} onChange={(e) => setSavings(e.target.value)} />
          </Field>

          <Field label={`Monthly contribution (${currency})`} htmlFor="ef-contrib">
            <input id="ef-contrib" type="number" className="input" placeholder="0" value={contribution} onChange={(e) => setContribution(e.target.value)} />
          </Field>
        </div>
      </div>

      {result && (
        <>
          <BigResult
            label={`Emergency fund target for ${place.city}`}
            value={fmt(result.target, currency)}
            sub={
              result.covered
                ? "You're fully covered 🎉"
                : `${fmt(result.gap, currency)} to go · ${result.pctCovered.toFixed(0)}% there`
            }
          />

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Monthly essentials" value={fmt(result.monthly, currency)} />
            <Stat label="Months of cover" value={months} />
            <Stat label="Still needed" value={fmt(result.gap, currency)} />
            <Stat label="Time to reach it" value={yearsLabel(result.time)} />
          </div>

          <div className="card p-5">
            <p className="mb-3 text-sm font-medium text-[var(--muted)]">Progress to target</p>
            <SplitBar invested={result.cur} gains={result.gap} investedLabel="Saved" gainsLabel="Remaining" />
          </div>

          <p className="text-center text-xs text-[var(--faint)]">
            Cost-of-living figures are estimates for a single person, scaled to your household
            {usingLiveRate && ratesUpdated ? ` · rates updated ${ratesUpdated}` : ""}. Adjust the
            monthly expenses to match your situation.
          </p>
        </>
      )}
    </div>
  );
}
