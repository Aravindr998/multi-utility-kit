"use client";

import { useMemo, useState } from "react";

const MAX = 1000;

const NOTES: Record<number, string> = {
  0x09: "Tab",
  0x0a: "Line feed",
  0x0d: "Carriage return",
  0x20: "Space",
  0xa0: "No-break space",
  0x200b: "Zero-width space",
  0x200c: "Zero-width non-joiner",
  0x200d: "Zero-width joiner",
  0x2060: "Word joiner",
  0xfeff: "Byte-order mark",
  0x2028: "Line separator",
  0x2029: "Paragraph separator",
};

function cpHex(cp: number) {
  return "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
}
function utf8Hex(ch: string) {
  return [...new TextEncoder().encode(ch)]
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}
function isInvisible(cp: number) {
  return cp < 0x20 || cp === 0x7f || NOTES[cp] !== undefined || (cp >= 0x2028 && cp <= 0x202f);
}

export default function UnicodeInspector() {
  const [text, setText] = useState("");

  const rows = useMemo(() => {
    const chars = [...text].slice(0, MAX);
    return chars.map((ch, i) => {
      const cp = ch.codePointAt(0)!;
      return {
        i,
        ch,
        cp,
        hex: cpHex(cp),
        dec: cp,
        utf8: utf8Hex(ch),
        note: NOTES[cp] ?? "",
        invisible: isInvisible(cp),
      };
    });
  }, [text]);

  const truncated = [...text].length > MAX;

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text to inspect each character…"
          spellCheck={false}
          className="input scroll-thin min-h-[120px] resize-y leading-relaxed"
        />
        <p className="mt-2 text-xs text-[var(--muted)]">
          {rows.length} character{rows.length === 1 ? "" : "s"}
          {truncated ? ` (showing first ${MAX})` : ""}
        </p>
      </div>

      {rows.length > 0 && (
        <div className="card overflow-hidden">
          <div className="scroll-thin max-h-[28rem] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0" style={{ background: "var(--surface-2)" }}>
                <tr className="text-left text-xs text-[var(--muted)]">
                  <th className="px-3 py-2 font-semibold">Char</th>
                  <th className="px-3 py-2 font-semibold">Code point</th>
                  <th className="px-3 py-2 font-semibold">Decimal</th>
                  <th className="px-3 py-2 font-semibold">UTF-8</th>
                  <th className="px-3 py-2 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.i} className="border-t">
                    <td className="px-3 py-1.5">
                      {r.invisible ? (
                        <span
                          className="inline-block rounded px-1.5 text-xs text-[var(--muted)]"
                          style={{ background: "var(--surface-2)" }}
                        >
                          {r.note || "invisible"}
                        </span>
                      ) : (
                        <span className="font-mono text-base">{r.ch}</span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 font-mono">{r.hex}</td>
                    <td className="px-3 py-1.5 font-mono">{r.dec}</td>
                    <td className="px-3 py-1.5 font-mono">{r.utf8}</td>
                    <td className="px-3 py-1.5 text-[var(--muted)]">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
