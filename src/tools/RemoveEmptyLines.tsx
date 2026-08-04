"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented, Toggle } from "@/components/textControls";

type Mode = "remove" | "collapse";

export default function RemoveEmptyLines() {
  const [mode, setMode] = useState<Mode>("remove");
  const [wsAsEmpty, setWsAsEmpty] = useState(true);

  const transform = (s: string) => {
    const isBlank = (l: string) => (wsAsEmpty ? l.trim() === "" : l === "");
    const lines = s.split("\n");
    if (mode === "remove") return lines.filter((l) => !isBlank(l)).join("\n");
    const out: string[] = [];
    let prevBlank = false;
    for (const l of lines) {
      const b = isBlank(l);
      if (b && prevBlank) continue;
      out.push(l);
      prevBlank = b;
    }
    return out.join("\n");
  };

  return (
    <TextToolShell
      transform={transform}
      outputLabel="Cleaned text"
      downloadName="cleaned.txt"
      controls={
        <div className="space-y-3">
          <div>
            <span className="label">Action</span>
            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { value: "remove", label: "Remove all blank lines" },
                { value: "collapse", label: "Collapse to single blank" },
              ]}
            />
          </div>
          <Toggle checked={wsAsEmpty} onChange={setWsAsEmpty} label="Treat whitespace-only lines as empty" />
        </div>
      }
    />
  );
}
