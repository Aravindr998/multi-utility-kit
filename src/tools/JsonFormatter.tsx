"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Indent = "2" | "4" | "tab" | "min";
const UNIT: Record<Indent, string | number> = { "2": 2, "4": 4, tab: "\t", min: 0 };

const SAMPLE = '{"name":"UtilityHub","tools":42,"tags":["json","dev"],"nested":{"ok":true}}';

export default function JsonFormatter() {
  const [indent, setIndent] = useState<Indent>("2");

  const transform = (s: string) => {
    if (!s.trim()) return "";
    try {
      const obj = JSON.parse(s);
      return indent === "min" ? JSON.stringify(obj) : JSON.stringify(obj, null, UNIT[indent]);
    } catch (e) {
      return `❌ ${e instanceof Error ? e.message : "Invalid JSON"}`;
    }
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      initial={SAMPLE}
      inputPlaceholder='Paste JSON here, e.g. {"hello":"world"}'
      outputLabel={indent === "min" ? "Minified JSON" : "Formatted JSON"}
      downloadName="formatted.json"
      controls={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-sm font-semibold">Indent</span>
          <Segmented
            value={indent}
            onChange={setIndent}
            options={[
              { value: "2", label: "2 spaces" },
              { value: "4", label: "4 spaces" },
              { value: "tab", label: "Tabs" },
              { value: "min", label: "Minify" },
            ]}
          />
        </div>
      }
    />
  );
}
