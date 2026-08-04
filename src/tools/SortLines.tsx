"use client";

import { useState } from "react";
import TextToolShell from "@/components/TextToolShell";
import { Segmented, Toggle } from "@/components/textControls";

type Order = "az" | "za" | "numeric" | "length" | "shuffle";

export default function SortLines() {
  const [order, setOrder] = useState<Order>("az");
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [removeDup, setRemoveDup] = useState(false);

  const transform = (s: string) => {
    let lines = s.split("\n");
    if (removeDup) lines = [...new Set(lines)];
    const collator = new Intl.Collator(undefined, {
      sensitivity: ignoreCase ? "base" : "variant",
    });
    const arr = [...lines];
    switch (order) {
      case "az":
        arr.sort(collator.compare);
        break;
      case "za":
        arr.sort((a, b) => collator.compare(b, a));
        break;
      case "numeric":
        arr.sort((a, b) => {
          const na = parseFloat(a);
          const nb = parseFloat(b);
          if (isNaN(na) && isNaN(nb)) return collator.compare(a, b);
          if (isNaN(na)) return 1;
          if (isNaN(nb)) return -1;
          return na - nb;
        });
        break;
      case "length":
        arr.sort((a, b) => a.length - b.length || collator.compare(a, b));
        break;
      case "shuffle":
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        break;
    }
    return arr.join("\n");
  };

  return (
    <TextToolShell
      transform={transform}
      outputLabel="Sorted lines"
      downloadName="sorted-lines.txt"
      inputPlaceholder="Paste your list here — one item per line…"
      controls={
        <div className="space-y-3">
          <div>
            <span className="label">Order</span>
            <Segmented
              value={order}
              onChange={setOrder}
              options={[
                { value: "az", label: "A → Z" },
                { value: "za", label: "Z → A" },
                { value: "numeric", label: "Numeric" },
                { value: "length", label: "Length" },
                { value: "shuffle", label: "Shuffle" },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Toggle checked={ignoreCase} onChange={setIgnoreCase} label="Ignore case" />
            <Toggle checked={removeDup} onChange={setRemoveDup} label="Remove duplicates" />
          </div>
        </div>
      }
    />
  );
}
