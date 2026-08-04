"use client";

import { useState } from "react";
import { shuffle } from "@/lib/random";
import { Segmented } from "@/components/textControls";

type Mode = "teams" | "size";

export default function TeamGenerator() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("teams");
  const [value, setValue] = useState(2);
  const [teams, setTeams] = useState<string[][]>([]);

  function generate() {
    const names = shuffle(text.split("\n").map((n) => n.trim()).filter(Boolean));
    if (names.length === 0) {
      setTeams([]);
      return;
    }
    const v = Math.max(1, value || 1);
    const k = mode === "teams" ? Math.min(v, names.length) : Math.ceil(names.length / v);
    const out: string[][] = Array.from({ length: k }, () => []);
    names.forEach((name, i) => out[i % k].push(name));
    setTeams(out);
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div>
          <label className="label" htmlFor="tg-names">Names (one per line)</label>
          <textarea
            id="tg-names"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Alice\nBob\nCharlie\nDana\n…"}
            spellCheck={false}
            className="input scroll-thin min-h-[160px] resize-y leading-relaxed"
          />
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <span className="label">Split by</span>
            <Segmented
              value={mode}
              onChange={setMode}
              options={[
                { value: "teams", label: "Number of teams" },
                { value: "size", label: "Team size" },
              ]}
            />
          </div>
          <div>
            <label className="label" htmlFor="tg-value">{mode === "teams" ? "Teams" : "Per team"}</label>
            <input id="tg-value" type="number" min={1} className="input w-24" value={value} onChange={(e) => setValue(parseInt(e.target.value) || 1)} />
          </div>
          <button className="btn btn-primary" onClick={generate}>Generate teams</button>
        </div>
      </div>

      {teams.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, i) => (
            <div key={i} className="card p-4">
              <h3 className="mb-2 flex items-center justify-between font-semibold">
                Team {i + 1}
                <span className="text-xs font-normal text-[var(--muted)]">{team.length}</span>
              </h3>
              <ul className="space-y-1 text-sm">
                {team.map((n, j) => (
                  <li key={j} className="rounded px-2 py-1" style={{ background: "var(--surface-2)" }}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
