"use client";

import { useState } from "react";
import { pick } from "@/lib/random";
import { Segmented } from "@/components/textControls";

type Mode = "list" | "yesno" | "8ball";

const YESNO = ["Yes", "No"];
const EIGHT = [
  "It is certain", "Without a doubt", "Yes, definitely", "You may rely on it",
  "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes",
  "Reply hazy, try again", "Ask again later", "Better not tell you now",
  "Cannot predict now", "Concentrate and ask again", "Don't count on it",
  "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful",
];

export default function DecisionMaker() {
  const [mode, setMode] = useState<Mode>("list");
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [key, setKey] = useState(0);

  function decide() {
    let r: string | null = null;
    if (mode === "yesno") r = pick(YESNO);
    else if (mode === "8ball") r = pick(EIGHT);
    else {
      const options = text.split("\n").map((o) => o.trim()).filter(Boolean);
      r = options.length ? pick(options) : null;
    }
    setResult(r);
    setKey((k) => k + 1);
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div>
          <span className="label">Mode</span>
          <Segmented
            value={mode}
            onChange={(m) => { setMode(m); setResult(null); }}
            options={[
              { value: "list", label: "Pick from list" },
              { value: "yesno", label: "Yes / No" },
              { value: "8ball", label: "Magic 8-Ball" },
            ]}
          />
        </div>
        {mode === "list" && (
          <div>
            <label className="label" htmlFor="dm-opts">Your options (one per line)</label>
            <textarea
              id="dm-opts"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Pizza\nSushi\nTacos\n…"}
              spellCheck={false}
              className="input scroll-thin min-h-[140px] resize-y leading-relaxed"
            />
          </div>
        )}
        <button className="btn btn-primary px-6" onClick={decide}>
          {mode === "8ball" ? "Ask the 8-Ball" : "Decide"}
        </button>
      </div>

      {result !== null && (
        <div key={key} className="card animate-fade-up p-8 text-center">
          <p className="text-sm text-[var(--muted)]">
            {mode === "8ball" ? "The 8-Ball says" : "The answer is"}
          </p>
          <p className="mt-2 text-3xl font-bold" style={{ color: "var(--brand)" }}>{result}</p>
        </div>
      )}

      {result === null && mode === "list" && (
        <p className="text-center text-sm text-[var(--muted)]">Add a few options, then let chance decide.</p>
      )}
    </div>
  );
}
