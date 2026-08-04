"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Dir = "escape" | "unescape";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeHtml(s: string): string {
  const el = document.createElement("textarea");
  el.innerHTML = s;
  return el.value;
}

export default function HtmlEscape() {
  const [dir, setDir] = useState<Dir>("escape");

  const transform = (s: string) => (dir === "escape" ? escapeHtml(s) : unescapeHtml(s));

  return (
    <TextToolShell
      transform={transform}
      monospace
      outputLabel={dir === "escape" ? "Escaped HTML" : "Unescaped text"}
      downloadName="html.txt"
      controls={
        <Segmented
          value={dir}
          onChange={setDir}
          options={[
            { value: "escape", label: "Escape (chars → entities)" },
            { value: "unescape", label: "Unescape (entities → chars)" },
          ]}
        />
      }
    />
  );
}
