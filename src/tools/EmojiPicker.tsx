"use client";

import { useEffect, useMemo, useState } from "react";

type Emoji = { e: string; k: string };

const DATA: { cat: string; items: Emoji[] }[] = [
  {
    cat: "Smileys",
    items: [
      { e: "😀", k: "grin happy smile" }, { e: "😃", k: "happy smile" }, { e: "😄", k: "happy laugh" },
      { e: "😁", k: "grin beaming" }, { e: "😆", k: "laugh" }, { e: "😅", k: "sweat laugh" },
      { e: "🤣", k: "rofl laughing" }, { e: "😂", k: "joy tears laugh" }, { e: "🙂", k: "slight smile" },
      { e: "😉", k: "wink" }, { e: "😊", k: "blush smile" }, { e: "😇", k: "angel innocent" },
      { e: "🥰", k: "love hearts" }, { e: "😍", k: "heart eyes love" }, { e: "😘", k: "kiss" },
      { e: "😜", k: "wink tongue" }, { e: "🤪", k: "zany crazy" }, { e: "😎", k: "cool sunglasses" },
      { e: "🤩", k: "star struck" }, { e: "🥳", k: "party celebrate" }, { e: "😏", k: "smirk" },
      { e: "😢", k: "cry sad" }, { e: "😭", k: "sob crying" }, { e: "😤", k: "triumph steam" },
      { e: "😠", k: "angry" }, { e: "😡", k: "rage angry" }, { e: "🤔", k: "thinking" },
      { e: "🤨", k: "raised eyebrow" }, { e: "😴", k: "sleep" }, { e: "🤯", k: "mind blown" },
      { e: "😱", k: "scream shock" }, { e: "😬", k: "grimace" }, { e: "🙄", k: "eye roll" },
      { e: "😳", k: "flushed" }, { e: "🥺", k: "pleading puppy" }, { e: "😌", k: "relieved" },
    ],
  },
  {
    cat: "Gestures & People",
    items: [
      { e: "👍", k: "thumbs up like yes" }, { e: "👎", k: "thumbs down no" }, { e: "👏", k: "clap applause" },
      { e: "🙌", k: "raise hands praise" }, { e: "🙏", k: "pray thanks please" }, { e: "🤝", k: "handshake deal" },
      { e: "👋", k: "wave hello hi bye" }, { e: "✌️", k: "peace victory" }, { e: "🤞", k: "fingers crossed" },
      { e: "🤟", k: "love you" }, { e: "🤙", k: "call me" }, { e: "👌", k: "ok perfect" },
      { e: "👉", k: "point right" }, { e: "👈", k: "point left" }, { e: "☝️", k: "point up" },
      { e: "✋", k: "hand stop" }, { e: "💪", k: "muscle strong flex" }, { e: "🧠", k: "brain smart" },
      { e: "👀", k: "eyes look" }, { e: "❤️", k: "heart red love" }, { e: "🔥", k: "fire lit hot" },
      { e: "✨", k: "sparkles shine" }, { e: "⭐", k: "star" }, { e: "💯", k: "hundred perfect" },
    ],
  },
  {
    cat: "Animals & Nature",
    items: [
      { e: "🐶", k: "dog puppy" }, { e: "🐱", k: "cat" }, { e: "🦊", k: "fox" }, { e: "🐻", k: "bear" },
      { e: "🐼", k: "panda" }, { e: "🐨", k: "koala" }, { e: "🦁", k: "lion" }, { e: "🐯", k: "tiger" },
      { e: "🐮", k: "cow" }, { e: "🐷", k: "pig" }, { e: "🐸", k: "frog" }, { e: "🐵", k: "monkey" },
      { e: "🦄", k: "unicorn" }, { e: "🐝", k: "bee" }, { e: "🦋", k: "butterfly" }, { e: "🌸", k: "flower blossom" },
      { e: "🌹", k: "rose flower" }, { e: "🌻", k: "sunflower" }, { e: "🌈", k: "rainbow" }, { e: "🌙", k: "moon night" },
      { e: "☀️", k: "sun sunny" }, { e: "⛄", k: "snowman winter" }, { e: "🌊", k: "wave ocean water" }, { e: "🍀", k: "clover luck" },
    ],
  },
  {
    cat: "Food & Drink",
    items: [
      { e: "🍎", k: "apple" }, { e: "🍌", k: "banana" }, { e: "🍕", k: "pizza" }, { e: "🍔", k: "burger" },
      { e: "🍟", k: "fries" }, { e: "🌮", k: "taco" }, { e: "🍣", k: "sushi" }, { e: "🍦", k: "ice cream" },
      { e: "🍩", k: "donut" }, { e: "🍪", k: "cookie" }, { e: "🎂", k: "cake birthday" }, { e: "🍫", k: "chocolate" },
      { e: "🍿", k: "popcorn" }, { e: "☕", k: "coffee tea" }, { e: "🍺", k: "beer" }, { e: "🍷", k: "wine" },
      { e: "🥑", k: "avocado" }, { e: "🍓", k: "strawberry" },
    ],
  },
  {
    cat: "Activities & Travel",
    items: [
      { e: "⚽", k: "soccer football" }, { e: "🏀", k: "basketball" }, { e: "🎮", k: "game controller" },
      { e: "🎧", k: "headphones music" }, { e: "🎉", k: "party tada celebrate" }, { e: "🎁", k: "gift present" },
      { e: "🏆", k: "trophy win" }, { e: "🎯", k: "target bullseye" }, { e: "✈️", k: "plane travel flight" },
      { e: "🚗", k: "car" }, { e: "🚀", k: "rocket launch" }, { e: "🏠", k: "house home" }, { e: "🗺️", k: "map" },
      { e: "🎸", k: "guitar music" }, { e: "📷", k: "camera photo" },
    ],
  },
  {
    cat: "Objects & Symbols",
    items: [
      { e: "💻", k: "laptop computer" }, { e: "📱", k: "phone mobile" }, { e: "💡", k: "idea lightbulb" },
      { e: "📝", k: "note memo write" }, { e: "📌", k: "pin" }, { e: "📎", k: "paperclip" }, { e: "🔒", k: "lock secure" },
      { e: "🔑", k: "key" }, { e: "💰", k: "money bag" }, { e: "💳", k: "card payment" }, { e: "⏰", k: "alarm clock time" },
      { e: "📅", k: "calendar date" }, { e: "✅", k: "check done tick" }, { e: "❌", k: "cross no wrong" },
      { e: "⚠️", k: "warning caution" }, { e: "❓", k: "question" }, { e: "❗", k: "exclamation" }, { e: "➡️", k: "arrow right" },
      { e: "💬", k: "speech chat bubble" }, { e: "🔔", k: "bell notification" },
    ],
  },
];

const RECENT_KEY = "utilityhub:emoji-recent:v1";

export default function EmojiPicker() {
  const [q, setQ] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem(RECENT_KEY);
      if (s) setRecent(JSON.parse(s));
    } catch {}
  }, []);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return DATA;
    return DATA.map((g) => ({
      cat: g.cat,
      items: g.items.filter((it) => it.k.includes(query) || it.e === q),
    })).filter((g) => g.items.length > 0);
  }, [query, q]);

  function pick(e: string) {
    navigator.clipboard?.writeText(e).then(() => {
      setCopied(e);
      setTimeout(() => setCopied((c) => (c === e ? null : c)), 1000);
    });
    setRecent((prev) => {
      const next = [e, ...prev.filter((x) => x !== e)].slice(0, 24);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search emojis (e.g. heart, fire, party)…"
        className="input"
        aria-label="Search emojis"
      />

      {copied && (
        <p className="text-sm" style={{ color: "var(--success)" }}>
          Copied {copied} to clipboard
        </p>
      )}

      {recent.length > 0 && !query && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Recently used</h3>
          <Grid items={recent.map((e) => ({ e, k: "" }))} onPick={pick} />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-[var(--muted)]">No emojis match “{q}”.</p>
      ) : (
        filtered.map((g) => (
          <div key={g.cat}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{g.cat}</h3>
            <Grid items={g.items} onPick={pick} />
          </div>
        ))
      )}
    </div>
  );
}

function Grid({ items, onPick }: { items: Emoji[]; onPick: (e: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-1 sm:grid-cols-12">
      {items.map((it, i) => (
        <button
          key={it.e + i}
          onClick={() => onPick(it.e)}
          title={it.k || "Copy"}
          className="grid aspect-square place-items-center rounded-md text-2xl transition-colors hover:bg-[var(--surface-2)]"
        >
          {it.e}
        </button>
      ))}
    </div>
  );
}
