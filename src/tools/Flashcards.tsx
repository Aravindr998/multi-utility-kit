"use client";

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Flashcards — create decks of term/definition cards and study them with
// flip, shuffle and known/again tracking. Persisted to localStorage.
// ---------------------------------------------------------------------------

type Card = { id: string; front: string; back: string };
type Deck = { id: string; name: string; cards: Card[]; createdAt: number };

const STORAGE_KEY = "utilityhub:flashcards";

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadDecks(): Deck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Deck[]) : [];
  } catch {
    return [];
  }
}

function saveDecks(decks: Deck[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  } catch {
    /* storage full or unavailable */
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const [decks, setDecks] = useState<Deck[]>(() =>
    typeof window === "undefined" ? [] : loadDecks()
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [studying, setStudying] = useState(false);

  const commit = (next: Deck[]) => {
    setDecks(next);
    saveDecks(next);
  };

  const activeDeck = activeId ? decks.find((d) => d.id === activeId) ?? null : null;

  // ------------------------------- deck actions -------------------------------
  const createDeck = () => {
    const name = prompt("Name your deck:", "New deck")?.trim();
    if (!name) return;
    const deck: Deck = { id: newId(), name, cards: [], createdAt: Date.now() };
    commit([deck, ...decks]);
    setActiveId(deck.id);
    setStudying(false);
  };

  const deleteDeck = (id: string) => {
    if (!confirm("Delete this deck and all its cards? This can't be undone.")) return;
    commit(decks.filter((d) => d.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const updateDeck = (id: string, patch: Partial<Deck>) =>
    commit(decks.map((d) => (d.id === id ? { ...d, ...patch } : d)));

  if (activeDeck && studying) {
    return (
      <StudyMode
        deck={activeDeck}
        onExit={() => setStudying(false)}
      />
    );
  }

  if (activeDeck) {
    return (
      <DeckEditor
        deck={activeDeck}
        onBack={() => setActiveId(null)}
        onChange={(cards) => updateDeck(activeDeck.id, { cards })}
        onRename={(name) => updateDeck(activeDeck.id, { name })}
        onStudy={() => setStudying(true)}
      />
    );
  }

  // ------------------------------- deck list -------------------------------
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button className="btn btn-primary" onClick={createDeck}>
          ＋ New deck
        </button>
        <span className="text-sm text-[var(--muted)]">
          {decks.length} deck{decks.length === 1 ? "" : "s"}
        </span>
      </div>

      {decks.length === 0 ? (
        <div className="card grid place-items-center gap-2 p-12 text-center">
          <div className="text-4xl">🃏</div>
          <p className="font-semibold">No decks yet</p>
          <p className="text-sm text-[var(--muted)]">
            Create your first deck to start building flashcards. Everything is saved
            privately in your browser.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((d) => (
            <div key={d.id} className="card group relative p-4">
              <button
                className="block w-full text-left"
                onClick={() => {
                  setActiveId(d.id);
                  setStudying(false);
                }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-lg">🃏</span>
                  <span className="truncate font-semibold">{d.name}</span>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  {d.cards.length} card{d.cards.length === 1 ? "" : "s"}
                </p>
              </button>
              <div className="mt-3 flex gap-2">
                <button
                  className="btn btn-secondary flex-1 px-2 py-1 text-xs"
                  disabled={d.cards.length === 0}
                  onClick={() => {
                    setActiveId(d.id);
                    setStudying(true);
                  }}
                >
                  Study
                </button>
                <button
                  className="btn btn-secondary px-2 py-1 text-xs"
                  onClick={() => setActiveId(d.id)}
                >
                  Edit
                </button>
                <button
                  className="rounded-md px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--surface-2)]"
                  style={{ color: "var(--danger)" }}
                  onClick={() => deleteDeck(d.id)}
                  title="Delete deck"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--muted)]">
        Decks are stored in your browser&apos;s local storage. Clearing site data or
        using private browsing will remove them.
      </p>
    </div>
  );
}

// --------------------------------- editor ---------------------------------
function DeckEditor({
  deck,
  onBack,
  onChange,
  onRename,
  onStudy,
}: {
  deck: Deck;
  onBack: () => void;
  onChange: (cards: Card[]) => void;
  onRename: (name: string) => void;
  onStudy: () => void;
}) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const addCard = () => {
    if (!front.trim() && !back.trim()) return;
    onChange([...deck.cards, { id: newId(), front: front.trim(), back: back.trim() }]);
    setFront("");
    setBack("");
  };

  const removeCard = (id: string) => onChange(deck.cards.filter((c) => c.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button className="btn btn-secondary px-3 py-1.5 text-sm" onClick={onBack}>
          ← All decks
        </button>
        <button
          className="btn btn-primary px-4 py-1.5 text-sm"
          onClick={onStudy}
          disabled={deck.cards.length === 0}
        >
          Study ({deck.cards.length})
        </button>
      </div>

      <input
        className="input text-lg font-semibold"
        value={deck.name}
        onChange={(e) => onRename(e.target.value)}
        aria-label="Deck name"
      />

      {/* Add card */}
      <div className="card grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
        <label className="flex flex-col">
          <span className="label">Front (term / question)</span>
          <textarea
            className="input min-h-20 resize-y"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="e.g. What is the capital of France?"
          />
        </label>
        <label className="flex flex-col">
          <span className="label">Back (answer)</span>
          <textarea
            className="input min-h-20 resize-y"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="e.g. Paris"
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") addCard();
            }}
          />
        </label>
        <div className="sm:col-span-2">
          <button className="btn btn-primary" onClick={addCard} disabled={!front.trim() && !back.trim()}>
            ＋ Add card
          </button>
          <span className="ml-3 text-xs text-[var(--muted)]">Tip: Ctrl/⌘ + Enter to add</span>
        </div>
      </div>

      {/* Card list */}
      {deck.cards.length === 0 ? (
        <p className="text-center text-[var(--muted)]">
          No cards yet — add your first card above.
        </p>
      ) : (
        <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
          {deck.cards.map((c, i) => (
            <div key={c.id} className="flex items-start gap-3 p-3" style={{ borderColor: "var(--border)" }}>
              <span className="mt-0.5 w-6 shrink-0 text-sm text-[var(--muted)]">{i + 1}.</span>
              <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-2">
                <div className="truncate font-medium">{c.front || <em className="text-[var(--muted)]">(blank)</em>}</div>
                <div className="truncate text-[var(--muted)]">{c.back || <em>(blank)</em>}</div>
              </div>
              <button
                className="shrink-0 rounded-md px-1.5 py-0.5 text-sm text-[var(--muted)] hover:bg-[var(--surface-2)]"
                onClick={() => removeCard(c.id)}
                title="Delete card"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --------------------------------- study ----------------------------------
function StudyMode({ deck, onExit }: { deck: Deck; onExit: () => void }) {
  const [order, setOrder] = useState<Card[]>(() => deck.cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(() => new Set());

  const current = order[index];

  const reshuffle = () => {
    setOrder(shuffle(deck.cards));
    setIndex(0);
    setFlipped(false);
    setKnown(new Set());
  };

  const next = (markKnown?: boolean) => {
    if (current && markKnown !== undefined) {
      setKnown((prev) => {
        const s = new Set(prev);
        if (markKnown) s.add(current.id);
        else s.delete(current.id);
        return s;
      });
    }
    setFlipped(false);
    setIndex((i) => Math.min(order.length, i + 1));
  };

  const prev = () => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  };

  // Keyboard: space/enter flips, arrows navigate.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, index]);

  const done = index >= order.length;
  const progress = order.length > 0 ? Math.min(index, order.length) / order.length : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button className="btn btn-secondary px-3 py-1.5 text-sm" onClick={onExit}>
          ← Done
        </button>
        <span className="text-sm text-[var(--muted)]">{deck.name}</span>
        <button className="btn btn-secondary px-3 py-1.5 text-sm" onClick={reshuffle}>
          🔀 Shuffle
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress * 100}%`, background: "var(--brand)" }} />
      </div>

      {done ? (
        <div className="card grid place-items-center gap-3 p-10 text-center">
          <div className="text-4xl">🎉</div>
          <p className="text-lg font-semibold">Deck complete!</p>
          <p className="text-sm text-[var(--muted)]">
            You marked {known.size} of {order.length} card{order.length === 1 ? "" : "s"} as known.
          </p>
          <div className="mt-2 flex gap-2">
            <button className="btn btn-primary" onClick={reshuffle}>Study again</button>
            <button className="btn btn-secondary" onClick={onExit}>Back to deck</button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center text-sm text-[var(--muted)]">
            Card {index + 1} of {order.length}
          </div>

          {/* Flip card */}
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="card grid min-h-56 w-full place-items-center p-8 text-center transition-colors hover:border-[var(--brand)] sm:min-h-64"
            aria-label="Flip card"
          >
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-[var(--muted)]">
                {flipped ? "Answer" : "Term"}
              </div>
              <div className="whitespace-pre-wrap text-xl font-semibold sm:text-2xl">
                {flipped ? current.back || "—" : current.front || "—"}
              </div>
              <div className="mt-4 text-xs text-[var(--muted)]">Click or press Space to flip</div>
            </div>
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            <button className="btn btn-secondary px-4" onClick={prev} disabled={index === 0}>
              ← Prev
            </button>
            <button className="btn btn-secondary px-4" onClick={() => next(false)} style={{ color: "var(--warning)" }}>
              ↻ Again
            </button>
            <button className="btn btn-primary px-4" onClick={() => next(true)}>
              ✓ Known
            </button>
          </div>
        </>
      )}
    </div>
  );
}
