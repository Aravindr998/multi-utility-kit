"use client";

import { useState } from "react";
import { load, dump } from "js-yaml";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Mode = "tidy" | "to-json" | "from-json";

const SAMPLE = "name: UtilityHub\ntools:\n  - json\n  - yaml\nnested:\n  ok: true\n";

export default function YamlFormatter() {
  const [mode, setMode] = useState<Mode>("tidy");

  const transform = (s: string) => {
    if (!s.trim()) return "";
    try {
      if (mode === "from-json") {
        const obj = JSON.parse(s);
        return dump(obj, { indent: 2, lineWidth: -1 });
      }
      const obj = load(s);
      if (mode === "to-json") return JSON.stringify(obj, null, 2);
      return dump(obj, { indent: 2, lineWidth: -1 });
    } catch (e) {
      return `❌ ${e instanceof Error ? e.message : "Invalid input"}`;
    }
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      initial={SAMPLE}
      inputPlaceholder="Paste YAML here…"
      outputLabel={mode === "to-json" ? "JSON" : "YAML"}
      downloadName={mode === "to-json" ? "output.json" : "output.yaml"}
      controls={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-sm font-semibold">Mode</span>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: "tidy", label: "Tidy YAML" },
              { value: "to-json", label: "YAML → JSON" },
              { value: "from-json", label: "JSON → YAML" },
            ]}
          />
        </div>
      }
    />
  );
}
