"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Mode = "2" | "4" | "tab" | "min";
const UNIT: Record<Mode, string> = { "2": "  ", "4": "    ", tab: "\t", min: "" };

const SAMPLE = '<note><to>Dev</to><from>UtilityHub</from><body>Format me!</body></note>';

/** Reject malformed XML using the browser's parser. Returns an error string or null. */
function xmlError(xml: string): string | null {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const err = doc.querySelector("parsererror");
  return err ? err.textContent?.replace(/\s+/g, " ").trim() || "Malformed XML" : null;
}

function formatXml(xml: string, tab: string): string {
  const collapsed = xml.replace(/>\s+</g, "><").replace(/(>)(<)(\/*)/g, "$1\n$2$3").trim();
  let pad = 0;
  return collapsed
    .split("\n")
    .map((node) => {
      let indent = 0;
      if (/^<\/\w/.test(node) && pad > 0) pad -= 1;
      else if (/^<\w[^>]*[^/]>.*$/.test(node) && !/<\/\w/.test(node)) indent = 1;
      const line = tab.repeat(pad) + node;
      pad += indent;
      return line;
    })
    .join("\n");
}

export default function XmlFormatter() {
  const [mode, setMode] = useState<Mode>("2");

  const transform = (s: string) => {
    if (!s.trim()) return "";
    const err = xmlError(s);
    if (err) return `❌ ${err}`;
    if (mode === "min") return s.replace(/>\s+</g, "><").trim();
    return formatXml(s, UNIT[mode]);
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      initial={SAMPLE}
      inputPlaceholder="Paste XML here…"
      outputLabel={mode === "min" ? "Minified XML" : "Formatted XML"}
      downloadName="formatted.xml"
      controls={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-sm font-semibold">Indent</span>
          <Segmented
            value={mode}
            onChange={setMode}
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
