"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const SAMPLE = '<!DOCTYPE html><html><head><title>Hi</title></head><body><div class="wrap"><h1>Hello</h1><p>World</p><br><img src="x.png"></div></body></html>';

type Mode = "2" | "4" | "tab" | "min";
const UNIT: Record<Mode, string> = { "2": "  ", "4": "    ", tab: "\t", min: "" };

function beautify(html: string, indent: string): string {
  const tokens = html
    .replace(/\r/g, "")
    .replace(/>\s+</g, "><")
    .split(/(<[^>]+>)/g)
    .filter((t) => t.trim() !== "");
  let depth = 0;
  const lines: string[] = [];
  for (const tok of tokens) {
    if (/^<\//.test(tok)) {
      depth = Math.max(0, depth - 1);
      lines.push(indent.repeat(depth) + tok);
    } else if (/^<[!?]/.test(tok) || /\/>$/.test(tok)) {
      lines.push(indent.repeat(depth) + tok);
    } else if (/^<[a-zA-Z]/.test(tok)) {
      const tag = tok.match(/^<\s*([a-zA-Z0-9-]+)/)?.[1]?.toLowerCase();
      lines.push(indent.repeat(depth) + tok);
      if (tag && !VOID.has(tag)) depth++;
    } else {
      lines.push(indent.repeat(depth) + tok.trim());
    }
  }
  return lines.join("\n");
}

export default function BeautifyHtml() {
  const [mode, setMode] = useState<Mode>("2");
  const transform = (s: string) => {
    if (!s.trim()) return "";
    if (mode === "min") return s.replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim();
    return beautify(s, UNIT[mode]);
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      initial={SAMPLE}
      inputPlaceholder="Paste HTML here…"
      outputLabel={mode === "min" ? "Minified HTML" : "Beautified HTML"}
      downloadName={mode === "min" ? "page.min.html" : "page.html"}
      controls={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-sm font-semibold">Indent</span>
          <Segmented value={mode} onChange={setMode} options={[
            { value: "2", label: "2 spaces" }, { value: "4", label: "4 spaces" }, { value: "tab", label: "Tabs" }, { value: "min", label: "Minify" },
          ]} />
        </div>
      }
    />
  );
}
