"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Toggle } from "@/components/textControls";

export default function TrimWhitespace() {
  const [trimLines, setTrimLines] = useState(true);
  const [collapse, setCollapse] = useState(true);
  const [tabsToSpaces, setTabsToSpaces] = useState(false);
  const [trimEnds, setTrimEnds] = useState(false);

  const transform = (s: string) => {
    let lines = s.split("\n").map((l) => {
      let x = l;
      if (tabsToSpaces) x = x.replace(/\t/g, " ");
      if (collapse) x = x.replace(/ {2,}/g, " ");
      if (trimLines) x = x.trim();
      return x;
    });
    let out = lines.join("\n");
    if (trimEnds) out = out.replace(/^\n+/, "").replace(/\n+$/, "");
    return out;
  };

  return (
    <TextToolShell
      transform={transform}
      outputLabel="Cleaned text"
      downloadName="trimmed.txt"
      controls={
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Toggle checked={trimLines} onChange={setTrimLines} label="Trim each line" />
          <Toggle checked={collapse} onChange={setCollapse} label="Collapse multiple spaces" />
          <Toggle checked={tabsToSpaces} onChange={setTabsToSpaces} label="Tabs → spaces" />
          <Toggle checked={trimEnds} onChange={setTrimEnds} label="Remove leading/trailing blank lines" />
        </div>
      }
    />
  );
}
