"use client";

import { useState } from "react";
import { pick } from "@/lib/random";

const POOL = "😀 😃 😄 😁 😆 😅 🤣 😂 🙂 😉 😊 😇 🥰 😍 😘 😜 🤪 😎 🤩 🥳 🤔 🤗 🤭 😴 😌 😏 🙄 😬 🤯 😱 🥺 😢 😭 😤 😠 👍 👎 👏 🙌 🙏 🤝 👋 ✌️ 🤞 🤟 🤙 👌 💪 🧠 👀 ❤️ 🧡 💛 💚 💙 💜 🖤 🔥 ✨ ⭐ 🌟 💯 🎉 🎊 🎁 🎈 🏆 🥇 🎯 🚀 💡 💎 🔔 🎵 🎧 🎸 🎮 📷 💻 📱 ⏰ 📌 🔑 💰 🍕 🍔 🍟 🌮 🍣 🍩 🍪 🎂 🍫 🍿 ☕ 🍺 🍷 🥑 🍓 🍎 🍌 🐶 🐱 🦊 🐻 🐼 🐨 🦁 🐯 🦄 🐝 🦋 🌸 🌹 🌻 🌈 🌙 ☀️ 🌊 🍀 ⚽ 🏀 🎲 🎰 🗺️ ✈️ 🚗 🏠".split(" ").filter(Boolean);

export default function RandomEmoji() {
  const [count, setCount] = useState(1);
  const [emojis, setEmojis] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  function generate() {
    const n = Math.max(1, Math.min(100, count || 1));
    setEmojis(Array.from({ length: n }, () => pick(POOL)));
  }

  function copyOne(e: string) {
    navigator.clipboard?.writeText(e).then(() => {
      setCopied(e);
      setTimeout(() => setCopied((c) => (c === e ? null : c)), 1000);
    });
  }
  function copyAll() {
    navigator.clipboard?.writeText(emojis.join(" ")).then(() => {
      setCopied("__all__");
      setTimeout(() => setCopied((c) => (c === "__all__" ? null : c)), 1000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap items-end gap-3 p-5">
        <div>
          <label className="label" htmlFor="re-count">How many</label>
          <input id="re-count" type="number" min={1} max={100} className="input w-24" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} />
        </div>
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        {emojis.length > 1 && (
          <button className="btn btn-secondary" onClick={copyAll}>{copied === "__all__" ? "Copied" : "Copy all"}</button>
        )}
      </div>

      {emojis.length === 1 && (
        <div key={emojis[0] + Math.random()} className="card animate-fade-up p-10 text-center">
          <button onClick={() => copyOne(emojis[0])} className="text-8xl transition-transform hover:scale-110" title="Click to copy">
            {emojis[0]}
          </button>
          <p className="mt-3 text-sm text-[var(--muted)]">{copied === emojis[0] ? "Copied!" : "Click the emoji to copy"}</p>
        </div>
      )}

      {emojis.length > 1 && (
        <div className="card p-5">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
            {emojis.map((e, i) => (
              <button
                key={i}
                onClick={() => copyOne(e)}
                title="Click to copy"
                className="grid aspect-square place-items-center rounded-md text-3xl transition-colors hover:bg-[var(--surface-2)]"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
