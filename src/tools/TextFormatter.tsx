"use client";

import { useEffect, useRef, useState } from "react";
import { downloadBlob } from "@/lib/format";

const INITIAL_HTML = `<h1>Your Title</h1><h2>A subtitle goes here</h2><p>Start typing to format your text. Select some words and make them <b>bold</b>, <i>italic</i> or <u>underlined</u>. You can also add <span style="color:#e11d48">colour</span> and <span style="background-color:#fde047">highlights</span>.</p>`;

export default function TextFormatter() {
  const ref = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const initialised = useRef(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Seed the editor once, imperatively, so React never reconciles (and wipes)
  // the user's edits on later re-renders.
  useEffect(() => {
    if (ref.current && !initialised.current) {
      ref.current.innerHTML = INITIAL_HTML;
      initialised.current = true;
    }
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && ref.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const range = savedRange.current;
    if (!range) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const exec = (command: string, value?: string) => {
    ref.current?.focus();
    // styleWithCSS makes colours/highlights inline styles that survive copy/paste.
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
  };

  const applyColor = (command: string, value: string) => {
    ref.current?.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
    saveSelection();
  };

  const copyRich = async () => {
    const el = ref.current;
    if (!el) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([el.innerHTML], { type: "text/html" }),
          "text/plain": new Blob([el.innerText], { type: "text/plain" }),
        }),
      ]);
      flash("rich");
    } catch {
      await navigator.clipboard.writeText(el.innerText);
      flash("rich");
    }
  };

  const copyHtml = async () => {
    if (!ref.current) return;
    await navigator.clipboard.writeText(ref.current.innerHTML);
    flash("html");
  };

  const download = () => {
    if (!ref.current) return;
    const doc = `<!doctype html>\n<html><head><meta charset="utf-8"><title>Formatted text</title></head>\n<body>${ref.current.innerHTML}</body></html>`;
    downloadBlob(new Blob([doc], { type: "text/html" }), "formatted-text.html");
  };

  const clearAll = () => {
    if (ref.current) ref.current.innerHTML = "<p><br></p>";
    ref.current?.focus();
  };

  const flash = (which: string) => {
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 1500);
  };

  return (
    <div className="space-y-3">
      <div className="card flex flex-wrap items-center gap-1 p-2">
        <Group>
          <TBtn label="Title" onClick={() => exec("formatBlock", "H1")} title="Title (H1)" className="font-bold" />
          <TBtn label="Subtitle" onClick={() => exec("formatBlock", "H2")} title="Subtitle (H2)" className="font-semibold" />
          <TBtn label="Heading" onClick={() => exec("formatBlock", "H3")} title="Heading (H3)" />
          <TBtn label="Normal" onClick={() => exec("formatBlock", "P")} title="Body text" />
        </Group>
        <Divider />
        <Group>
          <TBtn label="B" onClick={() => exec("bold")} title="Bold" className="font-bold" />
          <TBtn label="I" onClick={() => exec("italic")} title="Italic" className="italic" />
          <TBtn label="U" onClick={() => exec("underline")} title="Underline" className="underline" />
          <TBtn label="S" onClick={() => exec("strikeThrough")} title="Strikethrough" className="line-through" />
        </Group>
        <Divider />
        <Group>
          <TBtn label="• List" onClick={() => exec("insertUnorderedList")} title="Bulleted list" />
          <TBtn label="1. List" onClick={() => exec("insertOrderedList")} title="Numbered list" />
          <TBtn label="❝" onClick={() => exec("formatBlock", "BLOCKQUOTE")} title="Quote" />
        </Group>
        <Divider />
        <Group>
          <TBtn label="⭰" onClick={() => exec("justifyLeft")} title="Align left" />
          <TBtn label="⭤" onClick={() => exec("justifyCenter")} title="Align center" />
          <TBtn label="⭲" onClick={() => exec("justifyRight")} title="Align right" />
        </Group>
        <Divider />
        <Group>
          <label className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold" style={{ border: "1px solid var(--border)" }} title="Text colour">
            <span style={{ color: "var(--brand)" }}>A</span>
            <input
              type="color"
              defaultValue="#e11d48"
              onMouseDown={saveSelection}
              onChange={(e) => applyColor("foreColor", e.target.value)}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold" style={{ border: "1px solid var(--border)" }} title="Highlight colour">
            <span>🖍</span>
            <input
              type="color"
              defaultValue="#fde047"
              onMouseDown={saveSelection}
              onChange={(e) => applyColor("hiliteColor", e.target.value)}
              className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
            />
          </label>
        </Group>
        <Divider />
        <Group>
          <TBtn label="Clear format" onClick={() => exec("removeFormat")} title="Remove formatting from selection" />
        </Group>
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        spellCheck
        className="card ProseEditor min-h-64 overflow-y-auto p-4 leading-relaxed focus:outline-none"
        style={{ resize: "vertical" }}
        aria-label="Rich text editor"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" onClick={copyRich}>{copied === "rich" ? "Copied!" : "Copy formatted"}</button>
        <button className="btn btn-secondary" onClick={copyHtml}>{copied === "html" ? "Copied!" : "Copy HTML"}</button>
        <button className="btn btn-secondary" onClick={download}>⬇ Download HTML</button>
        <button className="btn btn-secondary" onClick={clearAll}>Clear</button>
      </div>

      <style>{`
        .ProseEditor h1 { font-size: 1.875rem; font-weight: 800; margin: 0.4em 0 0.3em; }
        .ProseEditor h2 { font-size: 1.375rem; font-weight: 700; margin: 0.4em 0 0.3em; color: var(--muted); }
        .ProseEditor h3 { font-size: 1.125rem; font-weight: 700; margin: 0.4em 0 0.3em; }
        .ProseEditor p { margin: 0.5em 0; }
        .ProseEditor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5em 0; }
        .ProseEditor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5em 0; }
        .ProseEditor blockquote { border-left: 3px solid var(--border); padding-left: 1rem; margin: 0.5em 0; color: var(--muted); }
        .ProseEditor a { color: var(--brand); text-decoration: underline; }
      `}</style>
    </div>
  );
}

function TBtn({ label, onClick, title, className = "" }: { label: string; onClick: () => void; title: string; className?: string }) {
  return (
    <button
      type="button"
      title={title}
      // Keep the editor's selection: never let the button steal focus.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-sm hover:bg-[var(--surface-2)] ${className}`}
    >
      {label}
    </button>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Divider() {
  return <span className="mx-1 h-6 w-px" style={{ background: "var(--border)" }} />;
}
