"use client";

// ---------------------------------------------------------------------------
// Pinned tools — a tiny localStorage-backed store shared across the app.
// No login: each browser keeps its own list of pinned tool slugs.
// Built on useSyncExternalStore so every ToolCard, the dashboard and other
// tabs stay in sync, with an SSR-safe (empty) server snapshot.
// ---------------------------------------------------------------------------

import { useCallback, useSyncExternalStore } from "react";

const KEY = "utilityhub:pinned:v1";
const EMPTY: string[] = [];

let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): string[] {
  if (cache === null) cache = read();
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: string[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage may be unavailable (private mode / quota) — keep in-memory only
  }
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function usePinnedTools() {
  const pinned = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isPinned = useCallback(
    (slug: string) => pinned.includes(slug),
    [pinned],
  );

  const toggle = useCallback((slug: string) => {
    const current = getSnapshot();
    commit(
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    );
  }, []);

  const unpin = useCallback((slug: string) => {
    const current = getSnapshot();
    if (current.includes(slug)) commit(current.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => commit([]), []);

  return { pinned, isPinned, toggle, unpin, clear };
}
