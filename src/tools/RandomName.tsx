"use client";

import { useState } from "react";
import { pick } from "@/lib/random";
import { Segmented } from "@/components/textControls";

const FEMALE = ["Olivia", "Emma", "Ava", "Sophia", "Isabella", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn", "Abigail", "Emily", "Ella", "Grace", "Chloe", "Zoe", "Nora", "Lily", "Aria", "Layla", "Maya", "Aisha", "Priya", "Sofia", "Elena", "Hannah", "Ruby", "Leah", "Nina", "Clara"];
const MALE = ["Liam", "Noah", "Oliver", "Elijah", "James", "William", "Benjamin", "Lucas", "Henry", "Alexander", "Mason", "Ethan", "Daniel", "Jacob", "Logan", "Jackson", "Sebastian", "Jack", "Aiden", "Owen", "Samuel", "David", "Leo", "Adam", "Isaac", "Gabriel", "Julian", "Mateo", "Arjun", "Omar"];
const LAST = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Khan", "Patel", "Nguyen", "Kim", "Silva", "Rossi", "Muller", "Dubois", "Ivanov", "Okafor"];

type Gender = "any" | "female" | "male";

export default function RandomName() {
  const [gender, setGender] = useState<Gender>("any");
  const [count, setCount] = useState(5);
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const first = gender === "female" ? FEMALE : gender === "male" ? MALE : [...FEMALE, ...MALE];
    const n = Math.max(1, Math.min(200, count || 1));
    setNames(Array.from({ length: n }, () => `${pick(first)} ${pick(LAST)}`));
  }

  function copy() {
    navigator.clipboard?.writeText(names.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4 p-5">
        <div>
          <span className="label">Name style</span>
          <Segmented
            value={gender}
            onChange={setGender}
            options={[
              { value: "any", label: "Any" },
              { value: "female", label: "Feminine" },
              { value: "male", label: "Masculine" },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label" htmlFor="rname-count">How many</label>
            <input id="rname-count" type="number" min={1} max={200} className="input w-24" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
          </div>
          <button className="btn btn-primary" onClick={generate}>Generate</button>
        </div>
      </div>

      {names.length > 0 && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold">{names.length} name{names.length === 1 ? "" : "s"}</span>
            <button onClick={copy} className="rounded-md px-2 py-1 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]">
              {copied ? "Copied" : "Copy all"}
            </button>
          </div>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {names.map((n, i) => (
              <li key={i} className="rounded-md px-3 py-1.5 text-sm" style={{ background: "var(--surface-2)" }}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
