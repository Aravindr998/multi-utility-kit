"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented, Toggle } from "@/components/textControls";

type Sep = "-" | "_" | ".";

// Strip combining marks after NFKD (é -> e). \p{M} is pure-ASCII source.
const DIACRITICS = /\p{M}/gu;

export default function SlugGenerator() {
  const [sep, setSep] = useState<Sep>("-");
  const [lower, setLower] = useState(true);

  const transform = (s: string) => {
    return s
      .split("\n")
      .map((line) => {
        let x = line.normalize("NFKD").replace(DIACRITICS, ""); // strip accents
        if (lower) x = x.toLowerCase();
        x = x.replace(/[^a-zA-Z0-9\s_.-]+/g, ""); // drop non-alphanumerics
        x = x.trim().replace(/[\s._-]+/g, sep); // collapse separators
        while (x.startsWith(sep)) x = x.slice(1);
        while (x.endsWith(sep)) x = x.slice(0, -1);
        return x;
      })
      .join("\n");
  };

  return (
    <TextToolShell
      transform={transform}
      outputLabel="Slug"
      downloadName="slugs.txt"
      monospace
      inputPlaceholder="Paste a title, or one title per line…"
      controls={
        <div className="space-y-3">
          <div>
            <span className="label">Separator</span>
            <Segmented
              value={sep}
              onChange={setSep}
              options={[
                { value: "-", label: "Hyphen -" },
                { value: "_", label: "Underscore _" },
                { value: ".", label: "Dot ." },
              ]}
            />
          </div>
          <Toggle checked={lower} onChange={setLower} label="Force lowercase" />
        </div>
      }
    />
  );
}
