"use client";

import { useState } from "react";
import { Segmented } from "@/components/textControls";

const WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );

const CLASSIC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";

type Unit = "paragraphs" | "sentences" | "words";

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function word() {
  return WORDS[rand(0, WORDS.length - 1)];
}
function sentence() {
  const n = rand(6, 14);
  const words = Array.from({ length: n }, word);
  let s = words.join(" ");
  // occasional comma
  if (n > 8) {
    const c = rand(3, n - 3);
    words[c] = words[c] + ",";
    s = words.join(" ");
  }
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
function paragraph() {
  return Array.from({ length: rand(3, 6) }, sentence).join(" ");
}

export default function LoremIpsum() {
  const [amount, setAmount] = useState(3);
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [classic, setClassic] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    const n = Math.min(500, Math.max(1, amount || 1));
    let result = "";
    if (unit === "words") {
      const words = Array.from({ length: n }, word);
      if (classic) words.splice(0, Math.min(n, 2), "lorem", "ipsum");
      result = words.join(" ");
      result = result.charAt(0).toUpperCase() + result.slice(1);
    } else if (unit === "sentences") {
      const arr = Array.from({ length: n }, sentence);
      if (classic) arr[0] = CLASSIC + ".";
      result = arr.join(" ");
    } else {
      const arr = Array.from({ length: n }, paragraph);
      if (classic) arr[0] = CLASSIC + ", " + arr[0].charAt(0).toLowerCase() + arr[0].slice(1);
      result = arr.join("\n\n");
    }
    setOutput(result);
  }

  function copy() {
    navigator.clipboard?.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
          <div>
            <label className="label" htmlFor="li-amount">Amount</label>
            <input id="li-amount" type="number" min={1} max={500} className="input w-28" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <span className="label">Unit</span>
            <Segmented
              value={unit}
              onChange={setUnit}
              options={[
                { value: "paragraphs", label: "Paragraphs" },
                { value: "sentences", label: "Sentences" },
                { value: "words", label: "Words" },
              ]}
            />
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} className="accent-[var(--brand)]" />
          Start with “Lorem ipsum dolor sit amet…”
        </label>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
      </div>

      {output && (
        <div className="card flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Output</span>
            <button onClick={copy} className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            spellCheck={false}
            className="input scroll-thin min-h-[240px] resize-y leading-relaxed"
            style={{ background: "var(--surface-2)" }}
          />
        </div>
      )}
    </div>
  );
}
