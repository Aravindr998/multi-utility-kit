"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented, Toggle } from "@/components/textControls";

type Dir = "encode" | "decode";

function encode(s: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  let out = btoa(bin);
  if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

function decode(s: string, urlSafe: boolean): string {
  let x = s.trim().replace(/\s+/g, "");
  if (urlSafe) x = x.replace(/-/g, "+").replace(/_/g, "/");
  while (x.length % 4) x += "=";
  const bin = atob(x);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [dir, setDir] = useState<Dir>("encode");
  const [urlSafe, setUrlSafe] = useState(false);

  const transform = (s: string) => {
    if (!s) return "";
    try {
      return dir === "encode" ? encode(s, urlSafe) : decode(s, urlSafe);
    } catch {
      return "Invalid Base64 input — check the string and try again.";
    }
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      outputLabel={dir === "encode" ? "Base64" : "Decoded text"}
      downloadName="base64.txt"
      controls={
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Segmented
            value={dir}
            onChange={setDir}
            options={[
              { value: "encode", label: "Encode" },
              { value: "decode", label: "Decode" },
            ]}
          />
          <Toggle checked={urlSafe} onChange={setUrlSafe} label="URL-safe alphabet" />
        </div>
      }
    />
  );
}
