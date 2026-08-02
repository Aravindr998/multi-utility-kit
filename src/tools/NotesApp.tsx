"use client";

import { useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Notes App — rich-text notes persisted to localStorage.
// Features: checklists, bold/italic/underline, font size step, auto-linkified
// URLs (ctrl/cmd+click to open), auto-save with a "saved" timestamp per note.
// ---------------------------------------------------------------------------

type Note = {
  id: string;
  title: string;
  bodyHtml: string;
  createdAt: number;
  updatedAt: number;
};

type ViewMode = "list" | "small" | "large";

const STORAGE_KEY = "utilityhub:notes";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Note[];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    /* storage full or unavailable — nothing we can do */
  }
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const dateFmt = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

/** Plain-text preview from stored HTML (for the list cards). */
function previewOf(html: string): string {
  if (typeof document === "undefined") return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  // Represent checklist items with a bullet so previews read naturally.
  return div.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>(() =>
    typeof window === "undefined" ? [] : loadNotes()
  );
  const [view, setView] = useState<ViewMode>("large");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeNote = activeId ? notes.find((n) => n.id === activeId) ?? null : null;

  // Seed the editor imperatively whenever a note is opened, so React never
  // reconciles (and wipes) the user's edits on later re-renders.
  useEffect(() => {
    if (activeId && editorRef.current) {
      editorRef.current.innerHTML = activeNote?.bodyHtml || "<p><br></p>";
    }
    // Only re-seed on which note is open, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // ------------------------------- selection -------------------------------
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount && editorRef.current?.contains(sel.anchorNode)) {
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

  // --------------------------------- saving --------------------------------
  const persist = (id: string) => {
    const html = editorRef.current?.innerHTML ?? "";
    const now = Date.now();
    setNotes((prev) => {
      const next = prev.map((n) =>
        n.id === id ? { ...n, title: draftTitle, bodyHtml: html, updatedAt: now } : n
      );
      saveNotes(next);
      return next;
    });
    setSavedAt(now);
  };

  const scheduleSave = () => {
    if (!activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const id = activeId;
    saveTimer.current = setTimeout(() => persist(id), 500);
  };

  // Keep the draft title in a ref-free way: persist() reads draftTitle from
  // state, so flush on title change too.
  useEffect(() => {
    if (activeId) scheduleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftTitle]);

  // ------------------------------- note actions ----------------------------
  const openNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    setDraftTitle(note.title);
    setSavedAt(note.updatedAt);
    setActiveId(id);
  };

  const createNote = () => {
    const now = Date.now();
    const note: Note = {
      id: newId(),
      title: "",
      bodyHtml: "<p><br></p>",
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => {
      const next = [note, ...prev];
      saveNotes(next);
      return next;
    });
    setDraftTitle("");
    setSavedAt(now);
    setActiveId(note.id);
  };

  const closeNote = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (activeId) persist(activeId);
    setActiveId(null);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id);
      saveNotes(next);
      return next;
    });
    if (activeId === id) {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setActiveId(null);
    }
  };

  // Lock body scroll while the modal is open + wire Escape to close.
  useEffect(() => {
    if (!activeId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNote();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // ------------------------------- formatting ------------------------------
  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand(command, false, value);
    saveSelection();
    scheduleSave();
  };

  const stepFont = (dir: 1 | -1) => {
    editorRef.current?.focus();
    restoreSelection();
    // Use <font size> markup so queryCommandValue reports a 1–7 step we can
    // increment relative to the current selection / caret.
    document.execCommand("styleWithCSS", false, "false");
    const cur = parseInt(document.queryCommandValue("fontSize"), 10) || 3;
    const next = Math.min(7, Math.max(1, cur + dir));
    document.execCommand("fontSize", false, String(next));
    saveSelection();
    scheduleSave();
  };

  const closestUl = (): HTMLElement | null => {
    const sel = window.getSelection();
    let node = sel?.anchorNode as Node | null;
    while (node && node !== editorRef.current) {
      if (node instanceof HTMLElement && node.tagName === "UL") return node;
      node = node.parentNode;
    }
    return null;
  };

  const toggleChecklist = () => {
    editorRef.current?.focus();
    restoreSelection();
    const existing = closestUl();
    if (existing?.classList.contains("checklist")) {
      // Leaving the checklist: unwrap the list back to normal lines.
      document.execCommand("insertUnorderedList");
    } else {
      document.execCommand("insertUnorderedList");
      closestUl()?.classList.add("checklist");
    }
    saveSelection();
    scheduleSave();
  };

  // --------------------------- editor interactions -------------------------
  // Auto-linkify a URL sitting just before the caret when the user presses
  // Space or Enter.
  const linkifyBeforeCaret = () => {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;
    if ((node.parentElement as HTMLElement | null)?.closest("a")) return;
    const offset = range.startOffset;
    const before = node.textContent?.slice(0, offset) ?? "";
    const match = before.match(/(https?:\/\/[^\s]+|www\.[^\s]+)$/i);
    if (!match) return;
    const url = match[0];
    const start = offset - url.length;
    const r = document.createRange();
    r.setStart(node, start);
    r.setEnd(node, offset);
    const a = document.createElement("a");
    a.href = url.startsWith("http") ? url : "https://" + url;
    a.textContent = url;
    a.className = "note-link";
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
    r.deleteContents();
    r.insertNode(a);
    // Drop a caret into a fresh text node after the link so the space the user
    // is about to type lands outside the anchor.
    const after = document.createTextNode("");
    a.after(after);
    const nr = document.createRange();
    nr.setStart(after, 0);
    nr.collapse(true);
    sel.removeAllRanges();
    sel.addRange(nr);
  };

  const onEditorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") linkifyBeforeCaret();
  };

  const onEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Ctrl/Cmd + click opens links.
    const a = target.closest("a");
    if (a && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      window.open((a as HTMLAnchorElement).href, "_blank", "noopener,noreferrer");
      return;
    }
    // Toggle a checklist item when its checkbox (left gutter) is clicked.
    const li = target.closest("li");
    if (li && li.parentElement?.classList.contains("checklist")) {
      const rect = li.getBoundingClientRect();
      if (e.clientX - rect.left <= 28) {
        li.dataset.checked = li.dataset.checked === "true" ? "false" : "true";
        scheduleSave();
      }
    }
  };

  // --------------------------------- render --------------------------------
  const sorted = [...notes].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="space-y-4">
      {/* Toolbar: new note + view switch */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button className="btn btn-primary" onClick={createNote}>
          <span className="text-base leading-none">＋</span> New note
        </button>
        <div className="flex items-center gap-1 rounded-lg p-1" style={{ border: "1px solid var(--border)" }}>
          <ViewBtn active={view === "list"} onClick={() => setView("list")} title="List view" label="☰" />
          <ViewBtn active={view === "small"} onClick={() => setView("small")} title="Small icons" label="▦" />
          <ViewBtn active={view === "large"} onClick={() => setView("large")} title="Large icons" label="◻" />
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card grid place-items-center gap-2 p-12 text-center">
          <div className="text-4xl">🗒️</div>
          <p className="font-semibold">No notes yet</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Click <b>New note</b> to create your first note. Everything is saved privately in your browser.
          </p>
        </div>
      ) : view === "list" ? (
        <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
          {sorted.map((n) => (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => openNote(n.id)}
              onKeyDown={(e) => (e.key === "Enter" ? openNote(n.id) : undefined)}
              className="flex cursor-pointer items-start gap-3 p-3 hover:bg-[var(--surface-2)]"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="mt-0.5 text-xl">🗒️</div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{n.title || "Untitled note"}</div>
                <div className="truncate text-sm" style={{ color: "var(--muted)" }}>
                  {previewOf(n.bodyHtml) || "No additional text"}
                </div>
              </div>
              <div className="whitespace-nowrap text-xs" style={{ color: "var(--muted)" }}>
                {dateFmt.format(n.updatedAt)}
              </div>
              <DeleteBtn onDelete={() => deleteNote(n.id)} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={
            view === "small"
              ? "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {sorted.map((n) => (
            <div
              key={n.id}
              role="button"
              tabIndex={0}
              onClick={() => openNote(n.id)}
              onKeyDown={(e) => (e.key === "Enter" ? openNote(n.id) : undefined)}
              className="card group relative cursor-pointer p-4 hover:border-[var(--brand)]"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className={view === "small" ? "text-base" : "text-lg"}>🗒️</span>
                <span className="truncate font-semibold">{n.title || "Untitled note"}</span>
              </div>
              {view === "large" && (
                <p className="mb-2 line-clamp-4 text-sm" style={{ color: "var(--muted)" }}>
                  {previewOf(n.bodyHtml) || "No additional text"}
                </p>
              )}
              <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                {dateFmt.format(n.updatedAt)}
              </div>
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <DeleteBtn onDelete={() => deleteNote(n.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------- Editor modal ------------------------------- */}
      {activeId && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeNote();
          }}
        >
          <div className="card flex w-full max-w-2xl flex-col shadow-2xl" style={{ maxHeight: "90vh" }}>
            {/* Modal header */}
            <div className="flex items-center justify-between gap-2 border-b p-3" style={{ borderColor: "var(--border)" }}>
              <span className="text-sm" style={{ color: "var(--muted)" }}>
                {savedAt ? `Saved ${dateFmt.format(savedAt)}` : "New note"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="rounded-md px-2 py-1 text-sm hover:bg-[var(--surface-2)]"
                  style={{ color: "var(--danger)" }}
                  onClick={() => activeId && deleteNote(activeId)}
                  title="Delete note"
                >
                  🗑 Delete
                </button>
                <button
                  className="rounded-md px-2 py-1 text-sm hover:bg-[var(--surface-2)]"
                  onClick={closeNote}
                  title="Close (Esc)"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Formatting toolbar */}
            <div className="flex flex-wrap items-center gap-1 border-b p-2" style={{ borderColor: "var(--border)" }}>
              <TBtn label="B" onMouseDown={saveSelection} onClick={() => exec("bold")} title="Bold" className="font-bold" />
              <TBtn label="I" onMouseDown={saveSelection} onClick={() => exec("italic")} title="Italic" className="italic" />
              <TBtn label="U" onMouseDown={saveSelection} onClick={() => exec("underline")} title="Underline" className="underline" />
              <Divider />
              <TBtn label="A−" onMouseDown={saveSelection} onClick={() => stepFont(-1)} title="Decrease font size" />
              <TBtn label="A＋" onMouseDown={saveSelection} onClick={() => stepFont(1)} title="Increase font size" className="text-base" />
              <Divider />
              <TBtn label="☑ Checklist" onMouseDown={saveSelection} onClick={toggleChecklist} title="Toggle checklist" />
              <TBtn label="• List" onMouseDown={saveSelection} onClick={() => exec("insertUnorderedList")} title="Bulleted list" />
              <Divider />
              <TBtn label="Clear" onMouseDown={saveSelection} onClick={() => exec("removeFormat")} title="Clear formatting" />
            </div>

            {/* Title + body */}
            <div className="flex-1 overflow-y-auto p-4">
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Title"
                className="mb-3 w-full bg-transparent text-2xl font-bold focus:outline-none"
                style={{ color: "var(--foreground)" }}
                aria-label="Note title"
              />
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                spellCheck
                onInput={scheduleSave}
                onKeyDown={onEditorKeyDown}
                onKeyUp={saveSelection}
                onMouseUp={saveSelection}
                onClick={onEditorClick}
                className="NoteEditor min-h-64 leading-relaxed focus:outline-none"
                aria-label="Note body"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        .NoteEditor p { margin: 0.4em 0; }
        .NoteEditor ul { list-style: disc; padding-left: 1.5rem; margin: 0.4em 0; }
        .NoteEditor a.note-link, .NoteEditor a {
          color: var(--accent);
          text-decoration: underline;
          cursor: pointer;
        }
        .NoteEditor ul.checklist { list-style: none; padding-left: 0; margin: 0.4em 0; }
        .NoteEditor ul.checklist li {
          position: relative;
          padding-left: 1.9rem;
          margin: 0.2em 0;
          min-height: 1.4em;
        }
        .NoteEditor ul.checklist li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.15em;
          width: 1.15rem;
          height: 1.15rem;
          border: 2px solid var(--muted);
          border-radius: 5px;
          box-sizing: border-box;
          cursor: pointer;
        }
        .NoteEditor ul.checklist li[data-checked="true"]::before {
          background: var(--brand);
          border-color: var(--brand);
        }
        .NoteEditor ul.checklist li[data-checked="true"]::after {
          content: "✓";
          position: absolute;
          left: 0.16rem;
          top: -0.02em;
          font-size: 0.95rem;
          line-height: 1;
          color: var(--on-brand);
          font-weight: 700;
          pointer-events: none;
        }
        .NoteEditor ul.checklist li[data-checked="true"] {
          text-decoration: line-through;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}

// ------------------------------- small pieces -------------------------------

function ViewBtn({ active, onClick, title, label }: { active: boolean; onClick: () => void; title: string; label: string }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className="rounded-md px-2.5 py-1 text-sm"
      style={active ? { background: "var(--brand)", color: "var(--on-brand)" } : { color: "var(--muted)" }}
    >
      {label}
    </button>
  );
}

function TBtn({
  label,
  onClick,
  onMouseDown,
  title,
  className = "",
}: {
  label: string;
  onClick: () => void;
  onMouseDown?: () => void;
  title: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      // Save the editor selection before focus moves, and never steal focus.
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown?.();
      }}
      onClick={onClick}
      className={`rounded-md px-2 py-1 text-sm hover:bg-[var(--surface-2)] ${className}`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px" style={{ background: "var(--border)" }} />;
}

function DeleteBtn({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      type="button"
      title="Delete note"
      onClick={(e) => {
        e.stopPropagation();
        if (confirm("Delete this note? This can't be undone.")) onDelete();
      }}
      className="rounded-md px-1.5 py-0.5 text-sm hover:bg-[var(--surface-2)]"
      style={{ color: "var(--muted)" }}
    >
      🗑
    </button>
  );
}
