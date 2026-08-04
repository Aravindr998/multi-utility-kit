"use client";

import { useState } from "react";

const A = 65, Z = 90, la = 97, lz = 122, d0 = 48, d9 = 57;

type Cfg = {
  U?: number;
  L?: number;
  D?: number;
  ex?: Record<string, number>;
  upperForLower?: boolean;
  combine?: number;
};

function mapper(cfg: Cfg) {
  return (t: string) => {
    let out = "";
    for (const ch of t) {
      const cp = ch.codePointAt(0)!;
      let m = ch;
      if (cfg.ex && cfg.ex[ch] !== undefined) m = String.fromCodePoint(cfg.ex[ch]);
      else if (cp >= A && cp <= Z && cfg.U !== undefined) m = String.fromCodePoint(cfg.U + (cp - A));
      else if (cp >= la && cp <= lz) {
        if (cfg.L !== undefined) m = String.fromCodePoint(cfg.L + (cp - la));
        else if (cfg.upperForLower && cfg.U !== undefined) m = String.fromCodePoint(cfg.U + (cp - la));
      } else if (cp >= d0 && cp <= d9 && cfg.D !== undefined) {
        m = String.fromCodePoint(cfg.D + (cp - d0));
      }
      if (cfg.combine !== undefined) m = m + String.fromCodePoint(cfg.combine);
      out += m;
    }
    return out;
  };
}

const circledDigits: Record<string, number> = { "0": 0x24ea };
for (let i = 1; i <= 9; i++) circledDigits[String(i)] = 0x2460 + (i - 1);

const SMALL: Record<string, number> = {
  a: 0x1d00, b: 0x0299, c: 0x1d04, d: 0x1d05, e: 0x1d07, f: 0xa730, g: 0x0262, h: 0x029c,
  i: 0x026a, j: 0x1d0a, k: 0x1d0b, l: 0x029f, m: 0x1d0d, n: 0x0274, o: 0x1d0f, p: 0x1d18,
  r: 0x0280, s: 0xa731, t: 0x1d1b, u: 0x1d1c, v: 0x1d20, w: 0x1d21, y: 0x028f, z: 0x1d22,
};
function smallCaps(t: string) {
  let out = "";
  for (const ch of t) {
    const lo = ch.toLowerCase();
    out += SMALL[lo] !== undefined ? String.fromCodePoint(SMALL[lo]) : ch;
  }
  return out;
}

const FLIP: Record<string, number> = {
  a: 0x0250, b: 0x0071, c: 0x0254, d: 0x0070, e: 0x01dd, f: 0x025f, g: 0x0183, h: 0x0265,
  i: 0x1d09, j: 0x027e, k: 0x029e, l: 0x006c, m: 0x026f, n: 0x0075, o: 0x006f, p: 0x0064,
  q: 0x0062, r: 0x0279, s: 0x0073, t: 0x0287, u: 0x006e, v: 0x028c, w: 0x028d, x: 0x0078,
  y: 0x028e, z: 0x007a, "0": 0x0030, "1": 0x0196, "2": 0x1105, "3": 0x0190, "4": 0x3123,
  "5": 0x03db, "6": 0x0039, "7": 0x3125, "8": 0x0038, "9": 0x0036, ".": 0x02d9, ",": 0x0027,
  "?": 0x00bf, "!": 0x00a1, "'": 0x002c, "(": 0x0029, ")": 0x0028, "[": 0x005d, "]": 0x005b,
  "<": 0x003e, ">": 0x003c, "_": 0x203e, "&": 0x0026,
};
function upsideDown(t: string) {
  return [...t]
    .map((ch) => {
      const lo = ch.toLowerCase();
      return FLIP[lo] !== undefined ? String.fromCodePoint(FLIP[lo]) : ch;
    })
    .reverse()
    .join("");
}

const STYLES: { name: string; fn: (t: string) => string }[] = [
  { name: "Bold", fn: mapper({ U: 0x1d400, L: 0x1d41a, D: 0x1d7ce }) },
  { name: "Italic", fn: mapper({ U: 0x1d434, L: 0x1d44e, ex: { h: 0x210e } }) },
  { name: "Bold Italic", fn: mapper({ U: 0x1d468, L: 0x1d482 }) },
  { name: "Script", fn: mapper({ U: 0x1d4d0, L: 0x1d4ea }) },
  { name: "Fraktur", fn: mapper({ U: 0x1d56c, L: 0x1d586 }) },
  { name: "Monospace", fn: mapper({ U: 0x1d670, L: 0x1d68a, D: 0x1d7f6 }) },
  { name: "Sans Bold", fn: mapper({ U: 0x1d5d4, L: 0x1d5ee, D: 0x1d7ec }) },
  { name: "Fullwidth", fn: mapper({ U: 0xff21, L: 0xff41, D: 0xff10, ex: { " ": 0x3000 } }) },
  { name: "Bubbles", fn: mapper({ U: 0x24b6, L: 0x24d0, ex: circledDigits }) },
  { name: "Squares", fn: mapper({ U: 0x1f130, upperForLower: true }) },
  { name: "Small Caps", fn: smallCaps },
  { name: "Upside Down", fn: upsideDown },
  { name: "Strikethrough", fn: mapper({ combine: 0x0336 }) },
  { name: "Underline", fn: mapper({ combine: 0x0332 }) },
];

export default function FancyTextGenerator() {
  const [text, setText] = useState("Fancy text");
  const [copied, setCopied] = useState<string | null>(null);

  function copy(name: string, value: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(name);
      setTimeout(() => setCopied((c) => (c === name ? null : c)), 1000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your text…"
          spellCheck={false}
          className="input scroll-thin min-h-[90px] resize-y leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        {STYLES.map((s) => {
          const value = text ? s.fn(text) : "";
          return (
            <button
              key={s.name}
              onClick={() => value && copy(s.name, value)}
              className="card flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:border-[var(--border-strong)]"
              title="Click to copy"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] uppercase tracking-wider text-[var(--muted)]">{s.name}</span>
                <span className="block truncate text-lg">{value || "…"}</span>
              </span>
              <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                {copied === s.name ? "Copied" : "Copy"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
