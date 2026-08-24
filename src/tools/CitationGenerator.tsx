"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

// ---------------------------------------------------------------------------
// Citation Generator — APA 7, MLA 9 and Chicago (notes-bibliography) for
// websites, books and journal articles. Best-effort formatting from the
// fields the user provides; missing optional fields are omitted.
// ---------------------------------------------------------------------------

type Style = "apa" | "mla" | "chicago";
type SourceType = "website" | "book" | "journal";

const STYLES: { id: Style; label: string }[] = [
  { id: "apa", label: "APA 7" },
  { id: "mla", label: "MLA 9" },
  { id: "chicago", label: "Chicago" },
];

const SOURCES: { id: SourceType; label: string }[] = [
  { id: "website", label: "Website" },
  { id: "book", label: "Book" },
  { id: "journal", label: "Journal article" },
];

type Fields = {
  author: string;
  title: string;
  year: string;
  siteName: string; // website: site name / journal: journal name / book: publisher
  url: string;
  publisher: string;
  volume: string;
  issue: string;
  pages: string;
  accessed: string;
};

const EMPTY: Fields = {
  author: "",
  title: "",
  year: "",
  siteName: "",
  url: "",
  publisher: "",
  volume: "",
  issue: "",
  pages: "",
  accessed: "",
};

// --- author-name helpers ---------------------------------------------------
// Accepts "First Last" or "Last, First" and returns pieces for formatting.
function parseName(raw: string): { last: string; first: string } | null {
  const s = raw.trim();
  if (!s) return null;
  if (s.includes(",")) {
    const [last, first] = s.split(",").map((x) => x.trim());
    return { last, first: first || "" };
  }
  const parts = s.split(/\s+/);
  if (parts.length === 1) return { last: parts[0], first: "" };
  return { last: parts[parts.length - 1], first: parts.slice(0, -1).join(" ") };
}

function initials(first: string): string {
  return first
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + ".")
    .join(" ");
}

// APA: Last, F. M.
function authorApa(raw: string): string {
  const n = parseName(raw);
  if (!n) return "";
  return n.first ? `${n.last}, ${initials(n.first)}` : n.last;
}
// MLA / Chicago bibliography: Last, First
function authorLastFirst(raw: string): string {
  const n = parseName(raw);
  if (!n) return "";
  return n.first ? `${n.last}, ${n.first}` : n.last;
}

function withPeriod(s: string): string {
  const t = s.trim();
  if (!t) return "";
  return /[.!?]$/.test(t) ? t : t + ".";
}

function buildCitation(style: Style, type: SourceType, f: Fields): string {
  const title = f.title.trim();
  const year = f.year.trim();
  const url = f.url.trim();
  const site = f.siteName.trim();

  if (style === "apa") {
    const parts: string[] = [];
    const a = authorApa(f.author);
    if (a) parts.push(withPeriod(a));
    parts.push(`(${year || "n.d."}).`);
    if (type === "book") {
      parts.push(withPeriod(`*${title}*`));
      if (f.publisher.trim()) parts.push(withPeriod(f.publisher.trim()));
    } else if (type === "journal") {
      parts.push(withPeriod(title));
      let jp = `*${site}*`;
      if (f.volume.trim()) jp += `, *${f.volume.trim()}*`;
      if (f.issue.trim()) jp += `(${f.issue.trim()})`;
      if (f.pages.trim()) jp += `, ${f.pages.trim()}`;
      parts.push(withPeriod(jp));
    } else {
      parts.push(withPeriod(`*${title}*`));
      if (site) parts.push(withPeriod(site));
    }
    if (url) parts.push(url);
    return parts.filter(Boolean).join(" ").trim();
  }

  if (style === "mla") {
    const parts: string[] = [];
    const a = authorLastFirst(f.author);
    if (a) parts.push(withPeriod(a));
    if (type === "book") {
      parts.push(withPeriod(`*${title}*`));
      if (f.publisher.trim()) parts.push(`${f.publisher.trim()},`);
      if (year) parts.push(withPeriod(year));
    } else if (type === "journal") {
      parts.push(withPeriod(`"${title}"`));
      let jp = `*${site}*`;
      if (f.volume.trim()) jp += `, vol. ${f.volume.trim()}`;
      if (f.issue.trim()) jp += `, no. ${f.issue.trim()}`;
      if (year) jp += `, ${year}`;
      if (f.pages.trim()) jp += `, pp. ${f.pages.trim()}`;
      parts.push(withPeriod(jp));
    } else {
      parts.push(withPeriod(`"${title}"`));
      if (site) parts.push(withPeriod(`*${site}*`));
      if (year) parts.push(withPeriod(year));
      if (url) parts.push(withPeriod(url.replace(/^https?:\/\//, "")));
      if (f.accessed.trim()) parts.push(withPeriod(`Accessed ${f.accessed.trim()}`));
    }
    return parts.filter(Boolean).join(" ").trim();
  }

  // Chicago (notes-bibliography, bibliography entry)
  const parts: string[] = [];
  const a = authorLastFirst(f.author);
  if (a) parts.push(withPeriod(a));
  if (type === "book") {
    parts.push(withPeriod(`*${title}*`));
    const pub: string[] = [];
    if (f.publisher.trim()) pub.push(f.publisher.trim());
    if (year) pub.push(year);
    if (pub.length) parts.push(withPeriod(pub.join(", ")));
  } else if (type === "journal") {
    parts.push(withPeriod(`"${title}"`));
    let jp = `*${site}*`;
    if (f.volume.trim()) jp += ` ${f.volume.trim()}`;
    if (f.issue.trim()) jp += `, no. ${f.issue.trim()}`;
    if (year) jp += ` (${year})`;
    if (f.pages.trim()) jp += `: ${f.pages.trim()}`;
    parts.push(withPeriod(jp));
  } else {
    parts.push(withPeriod(`"${title}"`));
    if (site) parts.push(withPeriod(site));
    if (year) parts.push(withPeriod(year));
    if (f.accessed.trim()) parts.push(withPeriod(`Accessed ${f.accessed.trim()}`));
    if (url) parts.push(withPeriod(url));
  }
  return parts.filter(Boolean).join(" ").trim();
}

/** Render a tiny subset of Markdown (*italics*) as HTML for the preview. */
function renderInline(md: string): string {
  const esc = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc.replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export default function CitationGenerator() {
  const [style, setStyle] = useState<Style>("apa");
  const [type, setType] = useState<SourceType>("website");
  const [f, setF] = useState<Fields>(EMPTY);

  const set = (patch: Partial<Fields>) => setF((prev) => ({ ...prev, ...patch }));

  const citation = useMemo(
    () => (f.title.trim() ? buildCitation(style, type, f) : ""),
    [style, type, f]
  );

  // Plain text (strip the * markers) for copying.
  const plain = citation.replace(/\*/g, "");

  const siteLabel =
    type === "journal" ? "Journal name" : type === "book" ? "Publisher" : "Website / site name";

  return (
    <div className="space-y-4">
      {/* Style + source pickers */}
      <div className="card space-y-3 p-4 sm:p-5">
        <div>
          <div className="label">Citation style</div>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <Pill key={s.id} active={style === s.id} onClick={() => setStyle(s.id)}>
                {s.label}
              </Pill>
            ))}
          </div>
        </div>
        <div>
          <div className="label">Source type</div>
          <div className="flex flex-wrap gap-2">
            {SOURCES.map((s) => (
              <Pill key={s.id} active={type === s.id} onClick={() => setType(s.id)}>
                {s.label}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="card grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        <Input label="Author (Last, First)" placeholder="e.g. Smith, Jane" value={f.author} onChange={(v) => set({ author: v })} />
        <Input label="Year" placeholder="e.g. 2024" value={f.year} onChange={(v) => set({ year: v })} />
        <Input label="Title" placeholder={type === "book" ? "Book title" : "Article / page title"} value={f.title} onChange={(v) => set({ title: v })} full />
        {type === "book" ? (
          <Input label="Publisher" placeholder="e.g. Oxford University Press" value={f.publisher} onChange={(v) => set({ publisher: v })} full />
        ) : (
          <Input label={siteLabel} placeholder={type === "journal" ? "e.g. Nature" : "e.g. BBC News"} value={f.siteName} onChange={(v) => set({ siteName: v })} full />
        )}
        {type === "journal" && (
          <>
            <Input label="Volume" placeholder="e.g. 12" value={f.volume} onChange={(v) => set({ volume: v })} />
            <Input label="Issue" placeholder="e.g. 3" value={f.issue} onChange={(v) => set({ issue: v })} />
            <Input label="Pages" placeholder="e.g. 45–58" value={f.pages} onChange={(v) => set({ pages: v })} />
          </>
        )}
        {type === "website" && (
          <>
            <Input label="URL" placeholder="https://…" value={f.url} onChange={(v) => set({ url: v })} full />
            <Input label="Date accessed (optional)" placeholder="e.g. 24 Aug 2026" value={f.accessed} onChange={(v) => set({ accessed: v })} full />
          </>
        )}
      </div>

      {/* Output */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">Citation</h3>
          <CopyButton value={plain} className="btn btn-secondary px-3 py-1.5 text-xs" />
        </div>
        {citation ? (
          <p
            className="leading-relaxed"
            style={{ textIndent: "-2rem", paddingLeft: "2rem" }}
            dangerouslySetInnerHTML={{ __html: renderInline(citation) }}
          />
        ) : (
          <p className="text-[var(--muted)]">Enter at least a title to generate a citation.</p>
        )}
      </div>

      <p className="text-xs text-[var(--muted)]">
        This produces a well-formatted starting point. Citation styles have many edge
        cases — always double-check against your assignment or the official style guide.
      </p>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-1.5 text-sm font-medium"
      style={
        active
          ? { background: "var(--brand)", color: "var(--on-brand)" }
          : { color: "var(--muted)", border: "1px solid var(--border)" }
      }
    >
      {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  full?: boolean;
}) {
  return (
    <label className={`flex flex-col ${full ? "sm:col-span-2" : ""}`}>
      <span className="label">{label}</span>
      <input
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
