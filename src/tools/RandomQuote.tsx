"use client";

import { useEffect, useState } from "react";
import { randInt } from "@/lib/random";

const QUOTES: [string, string][] = [
  ["The only way to do great work is to love what you do.", "Steve Jobs"],
  ["Success is not final, failure is not fatal: it is the courage to continue that counts.", "Winston Churchill"],
  ["In the middle of difficulty lies opportunity.", "Albert Einstein"],
  ["Believe you can and you're halfway there.", "Theodore Roosevelt"],
  ["It always seems impossible until it's done.", "Nelson Mandela"],
  ["The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt"],
  ["Do what you can, with what you have, where you are.", "Theodore Roosevelt"],
  ["Whether you think you can or you think you can't, you're right.", "Henry Ford"],
  ["The best way to predict the future is to invent it.", "Alan Kay"],
  ["Life is what happens when you're busy making other plans.", "John Lennon"],
  ["The journey of a thousand miles begins with one step.", "Lao Tzu"],
  ["That which does not kill us makes us stronger.", "Friedrich Nietzsche"],
  ["Happiness is not something ready made. It comes from your own actions.", "Dalai Lama"],
  ["The only limit to our realization of tomorrow is our doubts of today.", "Franklin D. Roosevelt"],
  ["It does not matter how slowly you go as long as you do not stop.", "Confucius"],
  ["Everything you can imagine is real.", "Pablo Picasso"],
  ["Simplicity is the ultimate sophistication.", "Leonardo da Vinci"],
  ["Well done is better than well said.", "Benjamin Franklin"],
  ["Quality is not an act, it is a habit.", "Aristotle"],
  ["Stay hungry, stay foolish.", "Steve Jobs"],
  ["What we think, we become.", "Buddha"],
  ["The mind is everything. What you think you become.", "Buddha"],
  ["An unexamined life is not worth living.", "Socrates"],
  ["Turn your wounds into wisdom.", "Oprah Winfrey"],
  ["The secret of getting ahead is getting started.", "Mark Twain"],
  ["Dream big and dare to fail.", "Norman Vaughan"],
  ["Act as if what you do makes a difference. It does.", "William James"],
  ["Courage is grace under pressure.", "Ernest Hemingway"],
  ["The best revenge is massive success.", "Frank Sinatra"],
  ["A room without books is like a body without a soul.", "Cicero"],
  ["You miss 100% of the shots you don't take.", "Wayne Gretzky"],
  ["If you want to lift yourself up, lift up someone else.", "Booker T. Washington"],
  ["Not all those who wander are lost.", "J.R.R. Tolkien"],
  ["Whatever you are, be a good one.", "Abraham Lincoln"],
  ["The way to get started is to quit talking and begin doing.", "Walt Disney"],
  ["Creativity is intelligence having fun.", "Albert Einstein"],
  ["Do one thing every day that scares you.", "Eleanor Roosevelt"],
  ["Little by little, one travels far.", "J.R.R. Tolkien"],
  ["The harder I work, the luckier I get.", "Samuel Goldwyn"],
  ["Fall seven times, stand up eight.", "Japanese Proverb"],
];

export default function RandomQuote() {
  const [idx, setIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIdx(randInt(0, QUOTES.length - 1));
  }, []);

  function next() {
    let n = randInt(0, QUOTES.length - 1);
    if (n === idx) n = (n + 1) % QUOTES.length;
    setIdx(n);
  }

  const [text, author] = QUOTES[idx];

  function copy() {
    navigator.clipboard?.writeText(`"${text}" — ${author}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <div className="space-y-4">
      <div key={idx} className="card animate-fade-up p-8 text-center">
        <p className="text-2xl font-semibold leading-snug">&ldquo;{text}&rdquo;</p>
        <p className="mt-4 text-[var(--muted)]">— {author}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary px-6" onClick={next}>New quote</button>
        <button className="btn btn-secondary" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      </div>
    </div>
  );
}
