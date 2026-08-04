"use client";

import { useMemo, useState } from "react";
import { sample } from "@/lib/random";

// [ISO 3166-1 alpha-2 code, capital]. Name + flag are derived at runtime.
const COUNTRIES: [string, string][] = [
  ["US", "Washington, D.C."], ["CA", "Ottawa"], ["MX", "Mexico City"], ["BR", "Brasilia"],
  ["AR", "Buenos Aires"], ["CL", "Santiago"], ["CO", "Bogota"], ["PE", "Lima"],
  ["GB", "London"], ["IE", "Dublin"], ["FR", "Paris"], ["ES", "Madrid"], ["PT", "Lisbon"],
  ["DE", "Berlin"], ["IT", "Rome"], ["NL", "Amsterdam"], ["BE", "Brussels"], ["CH", "Bern"],
  ["AT", "Vienna"], ["SE", "Stockholm"], ["NO", "Oslo"], ["DK", "Copenhagen"], ["FI", "Helsinki"],
  ["PL", "Warsaw"], ["CZ", "Prague"], ["HU", "Budapest"], ["GR", "Athens"], ["RO", "Bucharest"],
  ["UA", "Kyiv"], ["RU", "Moscow"], ["TR", "Ankara"], ["IS", "Reykjavik"], ["HR", "Zagreb"],
  ["EG", "Cairo"], ["ZA", "Pretoria"], ["NG", "Abuja"], ["KE", "Nairobi"], ["MA", "Rabat"],
  ["GH", "Accra"], ["ET", "Addis Ababa"], ["TZ", "Dodoma"], ["DZ", "Algiers"], ["SN", "Dakar"],
  ["CN", "Beijing"], ["JP", "Tokyo"], ["KR", "Seoul"], ["IN", "New Delhi"], ["PK", "Islamabad"],
  ["BD", "Dhaka"], ["ID", "Jakarta"], ["TH", "Bangkok"], ["VN", "Hanoi"], ["PH", "Manila"],
  ["MY", "Kuala Lumpur"], ["SG", "Singapore"], ["NP", "Kathmandu"], ["LK", "Colombo"],
  ["SA", "Riyadh"], ["AE", "Abu Dhabi"], ["IL", "Jerusalem"], ["IR", "Tehran"], ["IQ", "Baghdad"],
  ["QA", "Doha"], ["KW", "Kuwait City"], ["JO", "Amman"], ["AU", "Canberra"], ["NZ", "Wellington"],
  ["FJ", "Suva"], ["CU", "Havana"], ["JM", "Kingston"], ["CR", "San Jose"], ["PA", "Panama City"],
  ["UY", "Montevideo"], ["PY", "Asuncion"], ["BO", "La Paz"], ["EC", "Quito"], ["VE", "Caracas"],
  ["KZ", "Astana"], ["UZ", "Tashkent"], ["MN", "Ulaanbaatar"], ["MM", "Naypyidaw"],
];

function flagOf(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
}

export default function RandomCountry() {
  const [count, setCount] = useState(1);
  const [picked, setPicked] = useState<[string, string][]>([]);

  const names = useMemo(() => {
    try {
      return new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      return null;
    }
  }, []);
  const nameOf = (code: string) => names?.of(code) ?? code;

  function generate() {
    setPicked(sample(COUNTRIES, Math.max(1, Math.min(COUNTRIES.length, count || 1))));
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-end gap-3 p-5">
        <div>
          <label className="label" htmlFor="rc-count">How many</label>
          <input id="rc-count" type="number" min={1} max={COUNTRIES.length} className="input w-24" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
        </div>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      {picked.length === 1 && (
        <div key={picked[0][0]} className="card animate-fade-up p-8 text-center">
          <div className="text-7xl">{flagOf(picked[0][0])}</div>
          <p className="mt-3 text-2xl font-bold">{nameOf(picked[0][0])}</p>
          <p className="mt-1 text-[var(--muted)]">Capital: {picked[0][1]}</p>
        </div>
      )}

      {picked.length > 1 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {picked.map(([code, capital]) => (
            <div key={code} className="card flex items-center gap-3 p-4">
              <span className="text-4xl">{flagOf(code)}</span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{nameOf(code)}</span>
                <span className="block text-sm text-[var(--muted)]">{capital}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
