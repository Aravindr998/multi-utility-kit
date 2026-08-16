"use client";

import TextToolShell from "@/components/TextToolShell";

const SAMPLE = "/* card */\n.card {\n  padding: 1rem;\n  color: #333;\n  border: 1px solid #ddd;\n}\n\n.card:hover {\n  color: #000;\n}";

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")
    .replace(/;}/g, "}")
    .replace(/\s*!\s*important/g, "!important")
    .trim();
}

export default function MinifyCss() {
  return (
    <TextToolShell
      transform={(s) => (s.trim() ? minifyCss(s) : "")}
      monospace
      initial={SAMPLE}
      inputPlaceholder="Paste CSS here…"
      outputLabel="Minified CSS"
      downloadName="styles.min.css"
    />
  );
}
