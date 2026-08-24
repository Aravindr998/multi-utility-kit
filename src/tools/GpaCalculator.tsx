"use client";

import { useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// GPA Calculator — credit-weighted grade point average on the US 4.0 scale.
// ---------------------------------------------------------------------------

const GRADES: { label: string; points: number }[] = [
  { label: "A", points: 4.0 },
  { label: "A−", points: 3.7 },
  { label: "B+", points: 3.3 },
  { label: "B", points: 3.0 },
  { label: "B−", points: 2.7 },
  { label: "C+", points: 2.3 },
  { label: "C", points: 2.0 },
  { label: "C−", points: 1.7 },
  { label: "D+", points: 1.3 },
  { label: "D", points: 1.0 },
  { label: "F", points: 0.0 },
];

type Course = { id: string; name: string; grade: string; credits: string };

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function blankCourse(): Course {
  return { id: newId(), name: "", grade: "A", credits: "3" };
}

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>(() => [
    blankCourse(),
    blankCourse(),
    blankCourse(),
  ]);

  const update = (id: string, patch: Partial<Course>) =>
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const addCourse = () => setCourses((prev) => [...prev, blankCourse()]);

  const removeCourse = (id: string) =>
    setCourses((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));

  const { gpa, totalCredits, counted } = useMemo(() => {
    let qualityPoints = 0;
    let credits = 0;
    let counted = 0;
    for (const c of courses) {
      const cr = parseFloat(c.credits);
      if (!isFinite(cr) || cr <= 0) continue;
      const g = GRADES.find((x) => x.label === c.grade);
      if (!g) continue;
      qualityPoints += g.points * cr;
      credits += cr;
      counted += 1;
    }
    return {
      gpa: credits > 0 ? qualityPoints / credits : null,
      totalCredits: credits,
      counted,
    };
  }, [courses]);

  return (
    <div className="space-y-4">
      {/* Result */}
      <div className="card p-6 text-center">
        <div className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Your GPA
        </div>
        <div className="mt-1 font-mono text-6xl font-bold tabular-nums">
          {gpa == null ? "—" : gpa.toFixed(2)}
        </div>
        <div className="mt-2 text-sm text-[var(--muted)]">
          {gpa == null
            ? "Add a grade and credit hours to see your GPA."
            : `${counted} course${counted === 1 ? "" : "s"} · ${totalCredits} credit${totalCredits === 1 ? "" : "s"} · 4.0 scale`}
        </div>
      </div>

      {/* Course rows */}
      <div className="card p-4 sm:p-5">
        <div className="hidden gap-3 px-1 pb-2 text-xs font-medium text-[var(--muted)] sm:grid sm:grid-cols-[1fr_7rem_6rem_2rem]">
          <span>Course (optional)</span>
          <span>Grade</span>
          <span>Credits</span>
          <span />
        </div>
        <div className="space-y-3">
          {courses.map((c, i) => (
            <div
              key={c.id}
              className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_7rem_6rem_2rem] sm:items-center"
            >
              <input
                className="input col-span-2 sm:col-span-1"
                placeholder={`Course ${i + 1}`}
                value={c.name}
                onChange={(e) => update(c.id, { name: e.target.value })}
                aria-label={`Course ${i + 1} name`}
              />
              <select
                className="input"
                value={c.grade}
                onChange={(e) => update(c.id, { grade: e.target.value })}
                aria-label={`Course ${i + 1} grade`}
              >
                {GRADES.map((g) => (
                  <option key={g.label} value={g.label}>
                    {g.label} ({g.points.toFixed(1)})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                step="0.5"
                className="input"
                value={c.credits}
                onChange={(e) => update(c.id, { credits: e.target.value })}
                aria-label={`Course ${i + 1} credits`}
              />
              <button
                type="button"
                onClick={() => removeCourse(c.id)}
                disabled={courses.length === 1}
                title="Remove course"
                aria-label="Remove course"
                className="justify-self-end rounded-md px-2 py-1 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-30"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-secondary" onClick={addCourse}>
            ＋ Add course
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setCourses([blankCourse(), blankCourse(), blankCourse()])}
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-xs text-[var(--muted)]">
        Uses the common US 4.0 scale with plus/minus grades. GPA = Σ(grade points ×
        credits) ÷ total credits. For an unweighted average, give every course the
        same credit value.
      </p>
    </div>
  );
}
