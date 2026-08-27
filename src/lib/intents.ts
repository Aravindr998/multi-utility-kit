// ---------------------------------------------------------------------------
// Command-bar intents.
// An intent recognises a natural-language instruction ("resize image to 1080p",
// "count words in …", "generate uuid", "make qr for …") and turns it into:
//   • a deep link that opens the matching tool pre-filled, and
//   • (optionally) an inline result computed right in the palette.
//
// Adding an intent = push one matcher onto INTENT_MATCHERS. Everything else
// (rendering, keyboard nav, inline compute) is generic.
// ---------------------------------------------------------------------------

import { parseCurrencyQuery, getRates, convertAmount } from "@/lib/currency";
import { parseUnitQuery } from "@/lib/units";
import { evalMath, looksLikeMath } from "@/lib/mathEval";
import { getTool } from "@/lib/tools";

export type Intent = {
  kind: "intent";
  id: string;
  icon: string;
  /** Primary line, e.g. "10 USD → INR" or "Generate UUID". */
  title: string;
  /** Secondary line — usually the tool being opened. */
  subtitle: string;
  /** Deep link opened when the tool is chosen (tool pre-filled via params). */
  href: string;
  /** Associated tool, surfaced as a companion "Open …" row for compute intents. */
  toolSlug?: string;
  /**
   * Optional inline result. Runs the tool's logic right in the palette so the
   * answer shows without navigating. May be async (e.g. live rates, hashing).
   * When present, the primary action on this row is COPY (not navigate).
   * Throwing / returning null renders as "—".
   */
  compute?: () => string | null | Promise<string | null>;
};

type Matcher = (q: string) => Intent | null;

const withText = (slug: string, text: string) =>
  `/tools/${slug}?text=${encodeURIComponent(text)}`;

/** Only surface an intent whose target tool is actually live. */
const toolLabel = (slug: string) => getTool(slug)?.name ?? slug;

// --- Text helpers ----------------------------------------------------------

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const CASE_FNS: Record<string, (s: string) => string> = {
  uppercase: (s) => s.toUpperCase(),
  lowercase: (s) => s.toLowerCase(),
  "title case": (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
  "sentence case": (s) =>
    s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
};

function base64Encode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}
function base64Decode(s: string): string {
  const bin = atob(s.trim());
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

async function sha(algo: "SHA-1" | "SHA-256" | "SHA-512", text: string) {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomPassword(len: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (n) => chars[n % chars.length]).join("");
}

// Resolution presets for the image resizer (height-named video sizes + labels).
const RESIZE_PRESETS: Record<string, { w: number; h: number }> = {
  "4k": { w: 3840, h: 2160 },
  "2k": { w: 2560, h: 1440 },
  "1440p": { w: 2560, h: 1440 },
  "1080p": { w: 1920, h: 1080 },
  fullhd: { w: 1920, h: 1080 },
  "720p": { w: 1280, h: 720 },
  hd: { w: 1280, h: 720 },
  "480p": { w: 854, h: 480 },
  "360p": { w: 640, h: 360 },
};

function parseResize(spec: string): { w?: number; h?: number } | null {
  const s = spec.toLowerCase().trim().replace(/\s+/g, "");
  if (RESIZE_PRESETS[s]) return RESIZE_PRESETS[s];
  // WxH e.g. 800x600
  const wh = s.match(/^(\d+)[x×](\d+)(?:px)?$/);
  if (wh) return { w: +wh[1], h: +wh[2] };
  // single dimension e.g. "1024px", "1024wide" (treated as width)
  const one = s.match(/^(\d+)(?:px|wide|w)?$/);
  if (one) return { w: +one[1] };
  return null;
}

// --- Matchers --------------------------------------------------------------

const INTENT_MATCHERS: Matcher[] = [
  // Unit conversion — length, weight, temperature, speed, area, volume, data, time.
  (q) => {
    const u = parseUnitQuery(q);
    if (!u || !getTool("unit-converter")) return null;
    return {
      kind: "intent",
      id: `unit:${u.value}:${u.from}:${u.to}`,
      icon: "📏",
      title: `${u.value.toLocaleString()} ${u.from} → ${u.to}`,
      subtitle: `Open ${toolLabel("unit-converter")}`,
      href: "/tools/unit-converter",
      toolSlug: "unit-converter",
      compute: () => u.result,
    };
  },

  // Arithmetic — "2+2*3", "sqrt(144)", "(5+3)/2 ^ 2".
  (q) => {
    if (!looksLikeMath(q)) return null;
    const v = evalMath(q);
    if (v == null) return null;
    return {
      kind: "intent",
      id: `math:${q.trim()}`,
      icon: "🧮",
      title: q.trim(),
      subtitle: "Calculation",
      href: "/tools/percentage-calculator",
      compute: () => v.toLocaleString(undefined, { maximumFractionDigits: 10 }),
    };
  },

  // Currency — inline result from live rates.
  (q) => {
    const cur = parseCurrencyQuery(q);
    if (!cur || !getTool("currency-converter")) return null;
    return {
      kind: "intent",
      id: `currency:${cur.amount}:${cur.from}:${cur.to}`,
      icon: "💱",
      title: `${cur.amount.toLocaleString()} ${cur.from} → ${cur.to}`,
      subtitle: `Open ${toolLabel("currency-converter")}`,
      href: `/tools/currency-converter?amount=${cur.amount}&from=${cur.from}&to=${cur.to}`,
      toolSlug: "currency-converter",
      compute: async () => {
        const { rates } = await getRates();
        const v = convertAmount(cur.amount, cur.from, cur.to, rates);
        return v == null
          ? null
          : `${v.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${cur.to}`;
      },
    };
  },

  // UUID — generated inline.
  (q) => {
    if (!/^(?:generate|new|random|create)?\s*(?:a\s+)?(?:uuid|guid)(?:\s*v?4)?$/i.test(q.trim()))
      return null;
    if (!getTool("uuid-generator")) return null;
    return {
      kind: "intent",
      id: "uuid",
      icon: "🆔",
      title: "Generate UUID",
      subtitle: `Open ${toolLabel("uuid-generator")}`,
      href: "/tools/uuid-generator",
      toolSlug: "uuid-generator",
      compute: () => crypto.randomUUID(),
    };
  },

  // Password — generated inline. Optional length ("generate password 20").
  (q) => {
    const m = q.trim().match(/^(?:generate|random|create|make)?\s*(?:a\s+)?(?:secure\s+)?password(?:\s+(\d{1,3}))?$/i);
    if (!m || !getTool("random-password")) return null;
    const len = Math.min(Math.max(m[1] ? +m[1] : 16, 4), 128);
    return {
      kind: "intent",
      id: `password:${len}`,
      icon: "🔑",
      title: `Generate ${len}-character password`,
      subtitle: `Open ${toolLabel("random-password")}`,
      href: "/tools/random-password",
      toolSlug: "random-password",
      compute: () => randomPassword(len),
    };
  },

  // Word / character count — inline stats when text is given.
  (q) => {
    const m = q
      .trim()
      .match(/^(?:count\s+words?|word\s+count|count\s+characters?|character\s+count)(?:\s+(?:in|of|for)\s+([\s\S]+))?$/i);
    if (!m || !getTool("word-counter")) return null;
    const text = (m[1] ?? "").trim();
    return {
      kind: "intent",
      id: `wordcount:${text}`,
      icon: "🔢",
      title: text ? `Count words in “${truncate(text, 32)}”` : "Word Counter",
      subtitle: `Open ${toolLabel("word-counter")}`,
      href: text ? withText("word-counter", text) : "/tools/word-counter",
      toolSlug: "word-counter",
      compute: text
        ? () => {
            const words = text.split(/\s+/).filter(Boolean).length;
            return `${words} words · ${text.length} characters`;
          }
        : undefined,
    };
  },

  // QR code — pre-fill the generator with a URL or text payload.
  (q) => {
    const m = q
      .trim()
      .match(/^(?:make|generate|create|new)?\s*(?:a\s+)?qr(?:\s?code)?\s+(?:for|of|with|from)?\s*([\s\S]+)$/i);
    if (!m || !getTool("qr-code-generator")) return null;
    const payload = m[1].trim().replace(/^["']|["']$/g, "");
    if (!payload) return null;
    return {
      kind: "intent",
      id: `qr:${payload}`,
      icon: "🔳",
      title: `QR code for “${truncate(payload, 40)}”`,
      subtitle: `Open ${toolLabel("qr-code-generator")}`,
      href: withText("qr-code-generator", payload),
    };
  },

  // Base64 encode/decode — inline.
  (q) => {
    const m = q.trim().match(/^base\s?64\s+(encode|decode)\s+([\s\S]+)$/i);
    if (!m || !getTool("base64")) return null;
    const dir = m[1].toLowerCase() as "encode" | "decode";
    const text = m[2];
    return {
      kind: "intent",
      id: `base64:${dir}:${text}`,
      icon: "🔠",
      title: `Base64 ${dir} “${truncate(text, 32)}”`,
      subtitle: `Open ${toolLabel("base64")}`,
      href: withText("base64", text),
      toolSlug: "base64",
      compute: () => (dir === "encode" ? base64Encode(text) : base64Decode(text)),
    };
  },

  // URL encode/decode — inline.
  (q) => {
    const m = q.trim().match(/^url\s?(encode|decode)\s+([\s\S]+)$/i);
    if (!m || !getTool("url-encode")) return null;
    const dir = m[1].toLowerCase();
    const text = m[2];
    return {
      kind: "intent",
      id: `url:${dir}:${text}`,
      icon: "🔗",
      title: `URL ${dir} “${truncate(text, 32)}”`,
      subtitle: `Open ${toolLabel("url-encode")}`,
      href: withText("url-encode", text),
      toolSlug: "url-encode",
      compute: () =>
        dir === "encode" ? encodeURIComponent(text) : decodeURIComponent(text),
    };
  },

  // Slugify — inline.
  (q) => {
    const m = q.trim().match(/^(?:slug(?:ify)?|make\s+a\s+slug(?:\s+for)?)\s+([\s\S]+)$/i);
    if (!m || !getTool("slug-generator")) return null;
    const text = m[1];
    return {
      kind: "intent",
      id: `slug:${text}`,
      icon: "🔡",
      title: `Slugify “${truncate(text, 32)}”`,
      subtitle: `Open ${toolLabel("slug-generator")}`,
      href: withText("slug-generator", text),
      toolSlug: "slug-generator",
      compute: () => slugify(text) || null,
    };
  },

  // Change case — "uppercase foo" / "convert foo to title case".
  (q) => {
    const names = Object.keys(CASE_FNS).join("|");
    const re = new RegExp(
      `^(?:(?:convert|make)\\s+([\\s\\S]+?)\\s+(?:to|into)\\s+(${names})|(${names})\\s+([\\s\\S]+))$`,
      "i"
    );
    const m = q.trim().match(re);
    if (!m || !getTool("case-converter")) return null;
    const caseName = (m[2] ?? m[3]).toLowerCase();
    const text = (m[1] ?? m[4]).trim();
    const fn = CASE_FNS[caseName];
    if (!fn || !text) return null;
    return {
      kind: "intent",
      id: `case:${caseName}:${text}`,
      icon: "🔤",
      title: `${caseName} “${truncate(text, 28)}”`,
      subtitle: `Open ${toolLabel("case-converter")}`,
      href: withText("case-converter", text),
      toolSlug: "case-converter",
      compute: () => fn(text),
    };
  },

  // Hashes — SHA computed inline; MD5 opens the tool (no Web Crypto MD5).
  (q) => {
    const m = q.trim().match(/^(sha-?512|sha-?256|sha-?1|md5)\s+(?:of\s+)?([\s\S]+)$/i);
    if (!m) return null;
    const algoRaw = m[1].toLowerCase().replace("-", "");
    const text = m[2];
    const slug =
      algoRaw === "md5"
        ? "md5-hash-generator"
        : algoRaw === "sha512"
        ? "sha512-hash-generator"
        : algoRaw === "sha1"
        ? "hash-generator"
        : "sha256-hash-generator";
    if (!getTool(slug)) return null;
    const webAlgo =
      algoRaw === "sha1" ? "SHA-1" : algoRaw === "sha512" ? "SHA-512" : algoRaw === "sha256" ? "SHA-256" : null;
    return {
      kind: "intent",
      id: `hash:${algoRaw}:${text}`,
      icon: "#️⃣",
      title: `${algoRaw.toUpperCase()} of “${truncate(text, 28)}”`,
      subtitle: `Open ${toolLabel(slug)}`,
      href: withText(slug, text),
      toolSlug: slug,
      compute: webAlgo ? () => sha(webAlgo, text) : undefined,
    };
  },

  // Resize an image to a preset or explicit dimensions.
  (q) => {
    const m = q
      .trim()
      .match(/^resize\s+(?:image|photo|picture|img)?\s*(?:to\s+)?(.+)$/i);
    if (!m || !getTool("image-resizer")) return null;
    const dims = parseResize(m[1]);
    if (!dims) return null;
    const params = new URLSearchParams();
    if (dims.w) params.set("w", String(dims.w));
    if (dims.h) params.set("h", String(dims.h));
    const label = dims.w && dims.h ? `${dims.w}×${dims.h}` : `${dims.w ?? dims.h}px`;
    return {
      kind: "intent",
      id: `resize:${label}`,
      icon: "📐",
      title: `Resize image to ${label}`,
      subtitle: `Open ${toolLabel("image-resizer")} — drop an image to apply`,
      href: `/tools/image-resizer?${params.toString()}`,
    };
  },

  // Percentage — "20% of 150".
  (q) => {
    const m = q.trim().match(/^(?:what(?:'s| is)\s+)?([\d.]+)\s*(?:%|percent)\s+of\s+([\d.,]+)$/i);
    if (!m || !getTool("percentage-calculator")) return null;
    const p = parseFloat(m[1]);
    const n = parseFloat(m[2].replace(/,/g, ""));
    if (!isFinite(p) || !isFinite(n)) return null;
    return {
      kind: "intent",
      id: `pct:${p}:${n}`,
      icon: "％",
      title: `${p}% of ${n.toLocaleString()}`,
      subtitle: `Open ${toolLabel("percentage-calculator")}`,
      href: "/tools/percentage-calculator",
      toolSlug: "percentage-calculator",
      compute: () => ((p / 100) * n).toLocaleString(undefined, { maximumFractionDigits: 4 }),
    };
  },
];

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

/** Run every matcher and return the intents that fire (usually 0 or 1). */
export function matchIntents(query: string): Intent[] {
  const q = query.trim();
  if (!q) return [];
  const out: Intent[] = [];
  for (const m of INTENT_MATCHERS) {
    try {
      const r = m(q);
      if (r) out.push(r);
    } catch {
      /* a malformed matcher never breaks the palette */
    }
  }
  return out;
}
