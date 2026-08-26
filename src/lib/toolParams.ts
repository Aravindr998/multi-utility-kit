// ---------------------------------------------------------------------------
// Deep-link params for command-bar prefill.
// Tools are rendered client-only (ssr:false), so reading window here is safe.
// The command bar navigates to /tools/<slug>?text=… (and friends); tools seed
// their initial state from these on first render.
// ---------------------------------------------------------------------------

/** Read a single query-string param, SSR-safe. Returns null when absent. */
export function readParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return new URLSearchParams(window.location.search).get(key);
  } catch {
    return null;
  }
}

/** Read a numeric param, or null if missing/invalid. */
export function readNumberParam(key: string): number | null {
  const raw = readParam(key);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
