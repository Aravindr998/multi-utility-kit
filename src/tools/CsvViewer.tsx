"use client";

import { useMemo, useState } from "react";
import FileDropzone from "@/components/FileDropzone";

const SAMPLE = "id,name,role,active\n1,Ada Lovelace,Engineer,true\n2,\"Grace Hopper\",Admiral,true\n3,Alan Turing,Researcher,false";

/** Parse delimited text into rows, honouring RFC-4180 quoting. */
function parseCsv(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === delim) {
      row.push(field); field = "";
    } else if (c === "\n") {
      row.push(field); rows.push(row); row = []; field = "";
    } else if (c === "\r") {
      // ignore; handled by \n
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function detectDelim(text: string): string {
  const firstLine = text.split("\n")[0] || "";
  const counts: Record<string, number> = { ",": 0, ";": 0, "\t": 0, "|": 0 };
  for (const ch of firstLine) if (ch in counts) counts[ch]++;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export default function CsvViewer() {
  const [text, setText] = useState(SAMPLE);
  const [delim, setDelim] = useState<"auto" | "," | ";" | "\t" | "|">("auto");
  const [header, setHeader] = useState(true);

  const activeDelim = delim === "auto" ? detectDelim(text) : delim;
  const rows = useMemo(() => (text.trim() ? parseCsv(text, activeDelim) : []), [text, activeDelim]);

  const headerRow = header && rows.length ? rows[0] : null;
  const bodyRows = header ? rows.slice(1) : rows;
  const cols = rows.reduce((m, r) => Math.max(m, r.length), 0);

  const onFiles = (files: File[]) => files[0].text().then(setText);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Delimiter</span>
            <select className="input py-1.5" value={delim} onChange={(e) => setDelim(e.target.value as typeof delim)}>
              <option value="auto">Auto ({activeDelim === "\t" ? "Tab" : activeDelim})</option>
              <option value=",">Comma</option>
              <option value=";">Semicolon</option>
              <option value={"\t"}>Tab</option>
              <option value="|">Pipe</option>
            </select>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
            <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} className="accent-[var(--brand)]" />
            First row is a header
          </label>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste CSV data here…"
          spellCheck={false}
          className="input scroll-thin min-h-[140px] w-full resize-y font-mono text-sm leading-relaxed"
        />
        <div className="mt-3">
          <FileDropzone accept=".csv,.tsv,text/csv,text/plain" onFiles={onFiles} icon="📄" label="…or drop a CSV/TSV file" hint="Parsed locally in your browser" />
        </div>
      </div>

      {rows.length > 0 && (
        <div className="card p-4">
          <p className="mb-3 text-sm text-[var(--muted)]">
            {bodyRows.length.toLocaleString()} {bodyRows.length === 1 ? "row" : "rows"} · {cols} {cols === 1 ? "column" : "columns"}
          </p>
          <div className="scroll-thin max-h-[520px] overflow-auto rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <table className="w-full border-collapse text-sm">
              {headerRow && (
                <thead className="sticky top-0" style={{ background: "var(--surface-2)" }}>
                  <tr>
                    <th className="border px-2 py-1.5 text-left text-xs font-semibold text-[var(--muted)]" style={{ borderColor: "var(--border)" }}>#</th>
                    {Array.from({ length: cols }).map((_, c) => (
                      <th key={c} className="border px-3 py-1.5 text-left font-semibold" style={{ borderColor: "var(--border)" }}>
                        {headerRow[c] ?? ""}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {bodyRows.map((r, ri) => (
                  <tr key={ri} className="odd:bg-[var(--surface-2)]/40">
                    <td className="border px-2 py-1.5 text-xs text-[var(--muted)]" style={{ borderColor: "var(--border)" }}>{ri + 1}</td>
                    {Array.from({ length: cols }).map((_, c) => (
                      <td key={c} className="border px-3 py-1.5 font-mono" style={{ borderColor: "var(--border)" }}>{r[c] ?? ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
