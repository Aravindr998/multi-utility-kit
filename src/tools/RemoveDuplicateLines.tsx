"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Toggle } from "@/components/textControls";

export default function RemoveDuplicateLines() {
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trim, setTrim] = useState(false);

  const transform = (s: string) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of s.split("\n")) {
      let key = trim ? line.trim() : line;
      if (ignoreCase) key = key.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(line);
    }
    return out.join("\n");
  };

  return (
    <TextToolShell
      transform={transform}
      outputLabel="Unique lines"
      downloadName="unique-lines.txt"
      inputPlaceholder="Paste your list here — one item per line…"
      controls={
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Toggle checked={ignoreCase} onChange={setIgnoreCase} label="Ignore case" />
          <Toggle checked={trim} onChange={setTrim} label="Trim whitespace before comparing" />
        </div>
      }
    />
  );
}
