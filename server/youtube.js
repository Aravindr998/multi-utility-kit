// Pure helpers for the YouTube download backend (kept in sync with the
// frontend copy at ../src/lib/youtube.ts).

export const YT_QUALITIES = ["1080", "720", "480", "360", "audio"];

export function isYoutubeUrl(input) {
  try {
    const url = new URL(String(input).trim());
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

/** Seconds -> "HH:MM:SS.mmm" timestamp for yt-dlp download sections. */
export function ffmpegTimestamp(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = (s % 60).toFixed(3);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${sec.padStart(6, "0")}`;
}

/** Keep letters, digits, spaces and hyphens; drop filesystem-illegal characters. */
export function sanitizeFilename(name, fallback = "youtube-video") {
  const BACKSLASH = String.fromCharCode(92);
  const illegal = new RegExp('[<>:"/|?*' + BACKSLASH + "]", "g");
  const clean = String(name).replace(illegal, "").replace(/\s+/g, " ").trim().slice(0, 120);
  return clean || fallback;
}

export function ytdlpErrorMessage(e) {
  const err = e || {};
  if (err.code === "ENOENT") {
    return "The download engine (yt-dlp) is not installed on the server. Install yt-dlp and ffmpeg to enable this tool.";
  }
  if (err.killed) return "The request took too long and was stopped. Try a shorter clip.";
  const stderr = String(err.stderr || "");
  if (/private video/i.test(stderr)) return "This video is private and cannot be downloaded.";
  if (/sign in to confirm|age.?restricted|inappropriate/i.test(stderr))
    return "This video is age-restricted or requires sign-in, so it can't be downloaded.";
  if (/video unavailable|removed|not available/i.test(stderr)) return "This video is unavailable.";
  if (/unsupported url|is not a valid url/i.test(stderr)) return "That doesn't look like a downloadable YouTube video.";
  if (/requested format.*not available/i.test(stderr)) return "The chosen quality isn't available for this video. Try another.";
  return "Could not process this video. Please check the link and try again.";
}

export function contentType(ext) {
  switch (String(ext).toLowerCase()) {
    case ".mp4": return "video/mp4";
    case ".webm": return "video/webm";
    case ".mkv": return "video/x-matroska";
    case ".mp3": return "audio/mpeg";
    case ".m4a": return "audio/mp4";
    default: return "application/octet-stream";
  }
}
