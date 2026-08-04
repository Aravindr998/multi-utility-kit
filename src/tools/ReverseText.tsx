"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Mode = "chars" | "words" | "lines";

function reverseChars(s: string): string {
  try {
    const Seg = (Intl as unknown as { Segmenter?: typeof Intl.Segmenter }).Segmenter;
    if (Seg) {
      const seg = new Seg();
      return [...seg.segment(s)].map((x) => x.segment).reverse().join("");
    }
  } catch {
    /* fall back to code points */
  }
  return [...s].reverse().join("");
}

export default function ReverseText() {
  const [mode, setMode] = useState<Mode>("chars");

  const transform = (s: string) => {
    if (mode === "chars") return reverseChars(s);
    if (mode === "lines") return s.split("\n").reverse().join("\n");
    return s
      .split("\n")
      .map((line) => line.trim().split(/\s+/).filter(Boolean).reverse().join(" "))
      .join("\n");
  };

  return (
    <TextToolShell
      transform={transform}
      outputLabel="Reversed"
      downloadName="reversed.txt"
      controls={
        <div>
          <span className="label">Reverse by</span>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "chars", label: "Characters" },
              { value: "words", label: "Words" },
              { value: "lines", label: "Lines" },
            ]}
          />
        </div>
      }
    />
  );
}
