// ---------------------------------------------------------------------------
// Currency helpers for the command bar (and the Currency Converter tool).
// Pure frontend: alias resolution, natural-language parsing, and a cached
// exchange-rate fetch shared across the app.
// ---------------------------------------------------------------------------

/** Word / symbol aliases → ISO 4217 code. Any bare 3-letter code also works. */
const CURRENCY_ALIASES: Record<string, string> = {
  // symbols
  $: "USD",
  "€": "EUR",
  "£": "GBP",
  "¥": "JPY",
  "₹": "INR",
  "₩": "KRW",
  "₽": "RUB",
  "฿": "THB",
  // common words
  dollar: "USD",
  dollars: "USD",
  buck: "USD",
  bucks: "USD",
  usd: "USD",
  euro: "EUR",
  euros: "EUR",
  eur: "EUR",
  pound: "GBP",
  pounds: "GBP",
  sterling: "GBP",
  quid: "GBP",
  gbp: "GBP",
  yen: "JPY",
  jpy: "JPY",
  rupee: "INR",
  rupees: "INR",
  rs: "INR",
  inr: "INR",
  yuan: "CNY",
  renminbi: "CNY",
  rmb: "CNY",
  cny: "CNY",
  won: "KRW",
  krw: "KRW",
  ruble: "RUB",
  rubles: "RUB",
  rouble: "RUB",
  rub: "RUB",
  dirham: "AED",
  dirhams: "AED",
  aed: "AED",
  franc: "CHF",
  francs: "CHF",
  chf: "CHF",
  baht: "THB",
  thb: "THB",
};

/**
 * Resolve a free-text token ("dollars", "$", "inr") to an ISO currency code.
 * Falls back to any bare 3-letter code (validated later against live rates).
 */
export function resolveCurrencyCode(raw: string): string | null {
  const token = raw.trim().toLowerCase();
  if (!token) return null;
  if (CURRENCY_ALIASES[token]) return CURRENCY_ALIASES[token];
  if (/^[a-z]{3}$/.test(token)) return token.toUpperCase();
  return null;
}

export type CurrencyQuery = { amount: number; from: string; to: string };

/**
 * Parse natural-language currency conversions, e.g.
 *   "convert 10 usd to inr", "10 usd to inr", "$10 in rupees",
 *   "1,500 eur into gbp", "convert 5 dollars to yen".
 * Returns null when the text isn't a currency conversion.
 */
export function parseCurrencyQuery(input: string): CurrencyQuery | null {
  let text = input.trim().toLowerCase();
  if (!text) return null;

  // Optional leading verb.
  text = text.replace(/^(convert|exchange|change)\s+/, "");

  // Split on the connector between source and target currency.
  const split = text.match(/^(.*?)\s+(?:to|into|in|as|->|→|=)\s+(.+)$/);
  if (!split) return null;

  const left = split[1].trim();
  const right = split[2].trim();

  // Left side: optional symbol, an amount, then an optional currency token.
  const leftMatch = left.match(
    /^([$€£¥₹₩₽฿]?)\s*([\d,]+(?:\.\d+)?)\s*(.*)$/
  );
  if (!leftMatch) return null;

  const symbol = leftMatch[1];
  const amount = parseFloat(leftMatch[2].replace(/,/g, ""));
  if (!isFinite(amount)) return null;

  const fromToken = leftMatch[3].trim() || symbol;
  const from = resolveCurrencyCode(fromToken);
  const to = resolveCurrencyCode(right);
  if (!from || !to || from === to) return null;

  return { amount, from, to };
}

// --- Live rates (cached module-wide so keystrokes don't refetch) -----------

const RATES_ENDPOINT = "https://open.er-api.com/v6/latest/USD";

export type Rates = {
  rates: Record<string, number>;
  updated: string;
};

let ratesPromise: Promise<Rates> | null = null;

/** Fetch USD-based rates once and reuse the resolved promise. */
export function getRates(): Promise<Rates> {
  if (!ratesPromise) {
    ratesPromise = (async () => {
      const res = await fetch(RATES_ENDPOINT);
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      if (!data?.rates) throw new Error("no-rates");
      return {
        rates: data.rates as Record<string, number>,
        updated: (data.time_last_update_utc as string) || "",
      };
    })().catch((err) => {
      // Let the next call retry instead of caching the failure.
      ratesPromise = null;
      throw err;
    });
  }
  return ratesPromise;
}

/** Cross-rate conversion via USD. Returns null if a code is unsupported. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number | null {
  if (!rates[from] || !rates[to]) return null;
  return (amount / rates[from]) * rates[to];
}
