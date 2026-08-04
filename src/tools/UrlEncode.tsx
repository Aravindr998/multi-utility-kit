"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Dir = "encode" | "decode";
type Scope = "component" | "uri";

export default function UrlEncode() {
  const [dir, setDir] = useState<Dir>("encode");
  const [scope, setScope] = useState<Scope>("component");

  const transform = (s: string) => {
    if (!s) return "";
    try {
      if (dir === "encode") {
        return scope === "component" ? encodeURIComponent(s) : encodeURI(s);
      }
      return scope === "component" ? decodeURIComponent(s) : decodeURI(s);
    } catch {
      return "Invalid input — this text is not valid percent-encoding.";
    }
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      outputLabel={dir === "encode" ? "Encoded" : "Decoded"}
      downloadName="url.txt"
      controls={
        <div className="space-y-3">
          <Segmented
            value={dir}
            onChange={setDir}
            options={[
              { value: "encode", label: "Encode" },
              { value: "decode", label: "Decode" },
            ]}
          />
          <div>
            <span className="label">Scope</span>
            <Segmented
              value={scope}
              onChange={setScope}
              options={[
                { value: "component", label: "Component (query value)" },
                { value: "uri", label: "Full URI" },
              ]}
            />
          </div>
        </div>
      }
    />
  );
}
