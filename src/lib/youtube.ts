// Pure helpers shared by the YouTube tool's UI and API routes (no Node imports).

export const YT_QUALITIES = ["1080", "720", "480", "360", "audio"] as const;
export type YtQuality = (typeof YT_QUALITIES)[number];

export function isYoutubeUrl(input: string): boolean {
  try {
    const url = new URL(input.trim());
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const ok = ["youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"].includes(host);
    if (!ok) return false;
    if (host === "youtu.be") return url.pathname.length > 1;
    if (url.pathname === "/watch") return !!url.searchParams.get("v");
    return /^\/(shorts|embed|live|v)\//.test(url.pathname);
  } catch {
    return false;
  }
}

/** Parse "90", "1:30" or "1:02:03" -> seconds. Returns null if invalid. */
export function parseTime(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  if (/^\d+(\.\d+)?$/.test(v)) return parseFloat(v);
  const parts = v.split(":").map((p) => p.trim());
  if (parts.length < 2 || parts.length > 3 || parts.some((p) => !/^\d+(\.\d+)?$/.test(p))) return null;
  const nums = parts.map(Number);
  if (parts.length === 2) return nums[0] * 60 + nums[1];
  return nums[0] * 3600 + nums[1] * 60 + nums[2];
}

/** Seconds -> "M:SS" or "H:MM:SS". */
export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** Seconds -> "HH:MM:SS.mmm" timestamp for yt-dlp download sections. */
export function ffmpegTimestamp(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = (s % 60).toFixed(3);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${sec.padStart(6, "0")}`;
}

/** Keep letters, digits, spaces and hyphens; drop filesystem-illegal characters. */
export function sanitizeFilename(name: string, fallback = "youtube-video"): string {
  const BACKSLASH = String.fromCharCode(92);
  const illegal = new RegExp('[<>:"/|?*' + BACKSLASH + "]", "g");
  const clean = name.replace(illegal, "").replace(/\s+/g, " ").trim().slice(0, 120);
  return clean || fallback;
}
