"use client";

import { useState } from "react";
import { format, type SqlLanguage } from "sql-formatter";
import TextToolShell from "@/components/TextToolShell";
import { Segmented } from "@/components/textControls";

type Dialect = SqlLanguage;

const SAMPLE =
  "select id, name, email from users u join orders o on o.user_id = u.id where u.active = 1 and o.total > 100 order by o.total desc;";

const DIALECTS: { value: Dialect; label: string }[] = [
  { value: "sql", label: "Standard" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "bigquery", label: "BigQuery" },
];

export default function SqlFormatter() {
  const [dialect, setDialect] = useState<Dialect>("sql");
  const [upper, setUpper] = useState(true);

  const transform = (s: string) => {
    if (!s.trim()) return "";
    try {
      return format(s, {
        language: dialect,
        keywordCase: upper ? "upper" : "preserve",
        tabWidth: 2,
      });
    } catch (e) {
      return `❌ ${e instanceof Error ? e.message : "Could not format SQL"}`;
    }
  };

  return (
    <TextToolShell
      transform={transform}
      monospace
      initial={SAMPLE}
      inputPlaceholder="Paste a SQL query here…"
      outputLabel="Formatted SQL"
      downloadName="query.sql"
      controls={
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <span className="text-sm font-semibold">Dialect</span>
            <Segmented value={dialect} onChange={setDialect} options={DIALECTS} />
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
            <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} className="accent-[var(--brand)]" />
            Uppercase keywords
          </label>
        </div>
      }
    />
  );
}
