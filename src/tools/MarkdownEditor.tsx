"use client";

import { useEffect, useRef, useState } from "react";
import { downloadBlob } from "@/lib/format";

// --- Minimal, dependency-free Markdown → HTML renderer -----------------------
// The entire input is HTML-escaped first, so any markup the user types is inert
// and the only tags in the output are the ones this renderer emits itself.

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const safeUrl = (u: string) => (/^\s*javascript:/i.test(u) ? "#" : u);

// Private-use sentinels wrap protected inline-code spans so later inline passes
// (bold/italic/links) can't touch their contents. Built from char codes so the
// source file stays pure ASCII. They never occur in user text.
const OPEN = String.fromCharCode(0xe000);
const CLOSE = String.fromCharCode(0xe001);
const CODE_RE = new RegExp(OPEN + "(\\d+)" + CLOSE, "g");

function renderInline(s: string): string {
  const codes: string[] = [];
  s = s.replace(/`([^`]+)`/g, (_m, c) => OPEN + (codes.push(c) - 1) + CLOSE);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_m, alt, url, title) => `<img src="${safeUrl(url)}" alt="${alt}"${title ? ` title="${title}"` : ""} />`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, (_m, txt, url, title) => `<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer"${title ? ` title="${title}"` : ""}>${txt}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  s = s.replace(CODE_RE, (_m, i) => `<code>${codes[Number(i)]}</code>`);
  return s;
}

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

function renderMarkdown(md: string): string {
  const lines = escapeHtml(md).split("\n");
  const out: string[] = [];
  let i = 0;

  const isTableSep = (l: string) => /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (/^\s*```/.test(line)) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++; // closing fence
      out.push(`<pre><code>${body.join("\n")}</code></pre>`);
      continue;
    }

    // Horizontal rule
    if (/^\s*([-*_])\s*(\1\s*){2,}$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    // Heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${renderInline(h[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = splitRow(line);
      const aligns = splitRow(lines[i + 1]).map((c) => (c.startsWith(":") && c.endsWith(":") ? "center" : c.endsWith(":") ? "right" : c.startsWith(":") ? "left" : ""));
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) rows.push(splitRow(lines[i++]));
      const th = header.map((c, k) => `<th${aligns[k] ? ` style="text-align:${aligns[k]}"` : ""}>${renderInline(c)}</th>`).join("");
      const body = rows.map((r) => `<tr>${r.map((c, k) => `<td${aligns[k] ? ` style="text-align:${aligns[k]}"` : ""}>${renderInline(c)}</td>`).join("")}</tr>`).join("");
      out.push(`<table><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`);
      continue;
    }

    // Blockquote — note ">" has already been HTML-escaped to "&gt;" above.
    if (/^\s*&gt;\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*&gt;\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*&gt;\s?/, ""));
      out.push(`<blockquote>${renderInline(buf.join(" "))}</blockquote>`);
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      out.push(`<ul>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      out.push(`<ol>${items.map((it) => `<li>${renderInline(it)}</li>`).join("")}</ol>`);
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph (consecutive non-blank, non-special lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^\s*```/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*&gt;\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*([-*_])\s*(\1\s*){2,}$/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    if (para.length) out.push(`<p>${renderInline(para.join("<br />"))}</p>`);
  }

  return out.join("\n");
}

const SAMPLE = [
  "# Markdown Editor",
  "",
  "Write **Markdown** on the left and see the _live preview_ on the right.",
  "",
  "## Features",
  "",
  "- Headings, **bold**, _italic_, ~~strikethrough~~",
  "- [Links](https://example.com) and `inline code`",
  "- Lists, quotes and tables",
  "",
  "> Tip: use the toolbar to insert formatting quickly.",
  "",
  "```js",
  "function hello() {",
  '  console.log("Hi!");',
  "}",
  "```",
  "",
  "| Feature | Supported |",
  "| --- | :---: |",
  "| Tables | yes |",
  "| Code | yes |",
  "",
].join("\n");

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE);
  const [copied, setCopied] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const html = renderMarkdown(markdown);

  // Let Escape leave the fullscreen preview.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  const flash = (which: string) => {
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 1500);
  };

  // Wrap the current selection, restoring the caret after React re-renders.
  const wrap = (before: string, after = before) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = markdown.slice(s, e);
    setMarkdown(markdown.slice(0, s) + before + sel + after + markdown.slice(e));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    }, 0);
  };

  const prefixLines = (prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const start = markdown.lastIndexOf("\n", s - 1) + 1;
    const block = markdown.slice(start, e);
    const replaced = block.replace(/^/gm, prefix);
    setMarkdown(markdown.slice(0, start) + replaced + markdown.slice(e));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start, e + (replaced.length - block.length));
    }, 0);
  };

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    flash("html");
  };
  const copyMd = async () => {
    await navigator.clipboard.writeText(markdown);
    flash("md");
  };
  const download = () => downloadBlob(new Blob([markdown], { type: "text/markdown" }), "document.md");

  return (
    <div className="space-y-3">
      <div className="card flex flex-wrap items-center gap-1 p-2">
        <TBtn label="H1" title="Heading" onClick={() => prefixLines("# ")} className="font-bold" />
        <TBtn label="B" title="Bold" onClick={() => wrap("**")} className="font-bold" />
        <TBtn label="I" title="Italic" onClick={() => wrap("_")} className="italic" />
        <TBtn label="S" title="Strikethrough" onClick={() => wrap("~~")} className="line-through" />
        <TBtn label={"< >"} title="Inline code" onClick={() => wrap("`")} />
        <TBtn label="Link" title="Link" onClick={() => wrap("[", "](https://)")} />
        <TBtn label="• List" title="Bulleted list" onClick={() => prefixLines("- ")} />
        <TBtn label="1. List" title="Numbered list" onClick={() => prefixLines("1. ")} />
        <TBtn label="Quote" title="Blockquote" onClick={() => prefixLines("> ")} />
        <span className="ml-auto flex gap-2">
          <button className="btn btn-secondary" onClick={copyMd}>{copied === "md" ? "Copied!" : "Copy MD"}</button>
          <button className="btn btn-secondary" onClick={copyHtml}>{copied === "html" ? "Copied!" : "Copy HTML"}</button>
          <button className="btn btn-secondary" onClick={download}>⬇ .md</button>
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="label">Markdown</label>
          <textarea
            ref={taRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={20}
            spellCheck={false}
            className="input scroll-thin font-mono text-sm"
            style={{ resize: "vertical" }}
            placeholder="# Type Markdown here…"
            aria-label="Markdown source"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label">Preview</label>
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              title="View preview fullscreen"
              className="mb-1 rounded-md px-2 py-0.5 text-xs font-semibold hover:bg-[var(--surface-2)]"
              style={{ border: "1px solid var(--border)" }}
            >
              ⛶ Fullscreen
            </button>
          </div>
          <div
            className="MdPreview card scroll-thin min-h-64 overflow-auto p-4"
            style={{ maxHeight: "40rem" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 overflow-auto" style={{ background: "var(--background)" }}>
          <div className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3" style={{ background: "var(--background)", borderColor: "var(--border)" }}>
            <span className="text-sm font-semibold">Markdown preview</span>
            <button className="btn btn-secondary" onClick={() => setFullscreen(false)}>✕ Exit fullscreen</button>
          </div>
          <div className="MdPreview mx-auto max-w-3xl p-6" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      )}

      <style>{`
        .MdPreview h1 { font-size: 1.75rem; font-weight: 800; margin: 0.6em 0 0.4em; }
        .MdPreview h2 { font-size: 1.4rem; font-weight: 700; margin: 0.6em 0 0.4em; }
        .MdPreview h3 { font-size: 1.2rem; font-weight: 700; margin: 0.5em 0 0.3em; }
        .MdPreview h4, .MdPreview h5, .MdPreview h6 { font-weight: 700; margin: 0.5em 0 0.3em; }
        .MdPreview p { margin: 0.6em 0; line-height: 1.6; }
        .MdPreview ul { list-style: disc; padding-left: 1.5rem; margin: 0.5em 0; }
        .MdPreview ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5em 0; }
        .MdPreview li { margin: 0.2em 0; }
        .MdPreview a { color: var(--brand); text-decoration: underline; }
        .MdPreview blockquote { border-left: 3px solid var(--brand); padding: 0.2em 0 0.2em 1rem; margin: 0.6em 0; color: var(--muted); }
        .MdPreview code { font-family: var(--font-mono); background: var(--surface-2); padding: 0.1em 0.35em; border-radius: 4px; font-size: 0.9em; }
        .MdPreview pre { background: var(--surface-2); padding: 0.9rem; border-radius: 8px; overflow-x: auto; margin: 0.6em 0; }
        .MdPreview pre code { background: none; padding: 0; }
        .MdPreview hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
        .MdPreview img { max-width: 100%; border-radius: 6px; }
        .MdPreview table { border-collapse: collapse; margin: 0.6em 0; width: 100%; }
        .MdPreview th, .MdPreview td { border: 1px solid var(--border); padding: 0.4em 0.6em; }
        .MdPreview th { background: var(--surface-2); }
        .MdPreview del { opacity: 0.7; }
      `}</style>
    </div>
  );
}

function TBtn({ label, onClick, title, className = "" }: { label: string; onClick: () => void; title: string; className?: string }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-sm hover:bg-[var(--surface-2)] ${className}`}
    >
      {label}
    </button>
  );
}
