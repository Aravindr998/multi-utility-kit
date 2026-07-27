"use client";

import { useState } from "react";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { isYoutubeUrl, parseTime, formatTime, YT_QUALITIES, type YtQuality } from "@/lib/youtube";

type Info = { id: string; title: string; uploader: string; duration: number | null; thumbnail: string | null };
type Mode = "full" | "clip";

const QUALITY_LABEL: Record<YtQuality, string> = {
  "1080": "MP4 · 1080p",
  "720": "MP4 · 720p",
  "480": "MP4 · 480p",
  "360": "MP4 · 360p",
  audio: "MP3 · audio only",
};

// The download backend runs as a separate service (it needs yt-dlp + ffmpeg).
// Set NEXT_PUBLIC_YT_API_BASE to its URL in production; defaults to the local
// backend at :4000 for development.
const API_BASE = process.env.NEXT_PUBLIC_YT_API_BASE || "http://localhost:4000";

export default function YoutubeDownloader() {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<Info | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [quality, setQuality] = useState<YtQuality>("720");
  const [mode, setMode] = useState<Mode>("full");
  const [startStr, setStartStr] = useState("");
  const [endStr, setEndStr] = useState("");

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const reset = () => {
    setInfo(null);
    setFetchError(null);
    setDownloadError(null);
    setDone(null);
    setMode("full");
    setStartStr("");
    setEndStr("");
  };

  const fetchInfo = async () => {
    setFetchError(null);
    setDownloadError(null);
    setDone(null);
    if (!isYoutubeUrl(url)) {
      setFetchError("Please enter a valid YouTube video URL.");
      return;
    }
    setFetching(true);
    setInfo(null);
    try {
      const res = await fetch(`${API_BASE}/api/youtube/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Could not fetch video info.");
      setInfo(data);
      if (data.duration) setEndStr(formatTime(Math.min(data.duration, 30)));
    } catch (e) {
      const msg =
        e instanceof TypeError
          ? "Couldn't reach the download service. Make sure it's running and NEXT_PUBLIC_YT_API_BASE points to it."
          : e instanceof Error
            ? e.message
            : "Could not fetch video info.";
      setFetchError(msg);
    } finally {
      setFetching(false);
    }
  };

  const start = parseTime(startStr);
  const end = parseTime(endStr);
  const clipValid =
    mode === "full" ||
    (start !== null &&
      end !== null &&
      start >= 0 &&
      end > start &&
      (!info?.duration || end <= info.duration + 0.5));
  const clipLen = mode === "clip" && start !== null && end !== null && end > start ? end - start : 0;

  const download = async () => {
    if (!info) return;
    setDownloading(true);
    setDownloadError(null);
    setDone(null);
    try {
      const res = await fetch(`${API_BASE}/api/youtube/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          quality,
          mode,
          title: info.title,
          start: mode === "clip" ? start : undefined,
          end: mode === "clip" ? end : undefined,
        }),
      });

      if (!res.ok || res.headers.get("Content-Type")?.includes("application/json")) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Download failed. Please try again.");
      }

      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i);
      const name = match ? decodeURIComponent(match[1] || match[2]) : `${info.title}.${quality === "audio" ? "mp3" : "mp4"}`;
      downloadBlob(blob, name);
      setDone(`Saved ${name} (${formatBytes(blob.size)})`);
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Legal reminder */}
      <div className="flex items-start gap-2 rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, #f59e0b 14%, transparent)" }}>
        <span aria-hidden>⚠️</span>
        <span>
          Only download videos you own or have the right to use (your own uploads, Creative Commons, or public domain).
          Downloading copyrighted content may violate YouTube&apos;s Terms of Service.
        </span>
      </div>

      {/* URL input */}
      <div className="card p-4">
        <label className="label" htmlFor="yt-url">YouTube video URL</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="yt-url"
            className="input"
            placeholder="https://www.youtube.com/watch?v=…"
            value={url}
            onChange={(e) => { setUrl(e.target.value); reset(); }}
            onKeyDown={(e) => e.key === "Enter" && fetchInfo()}
          />
          <button className="btn btn-primary shrink-0" onClick={fetchInfo} disabled={fetching || !url.trim()}>
            {fetching ? "Fetching…" : "Fetch"}
          </button>
        </div>
        {fetchError && <p className="mt-2 text-sm" style={{ color: "var(--danger)" }}>{fetchError}</p>}
      </div>

      {info && (
        <div className="card p-4">
          {/* Video preview */}
          <div className="flex gap-4">
            {info.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.thumbnail} alt="" className="hidden h-24 w-40 rounded-lg object-cover sm:block" />
            )}
            <div className="min-w-0">
              <p className="font-semibold leading-snug line-clamp-2">{info.title}</p>
              {info.uploader && <p className="mt-1 text-sm text-[var(--muted)]">{info.uploader}</p>}
              {info.duration != null && <p className="text-sm text-[var(--muted)]">Duration: {formatTime(info.duration)}</p>}
            </div>
          </div>

          {/* Quality */}
          <div className="mt-5">
            <label className="label">Quality / format</label>
            <div className="flex flex-wrap gap-2">
              {YT_QUALITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className="rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{ background: quality === q ? "var(--brand)" : "var(--surface-2)", color: quality === q ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
                >
                  {QUALITY_LABEL[q]}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div className="mt-5">
            <label className="label">What to download</label>
            <div className="flex gap-2">
              <button onClick={() => setMode("full")} className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: mode === "full" ? "var(--brand)" : "var(--surface-2)", color: mode === "full" ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}>
                Full video
              </button>
              <button onClick={() => setMode("clip")} className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: mode === "clip" ? "var(--brand)" : "var(--surface-2)", color: mode === "clip" ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}>
                Clip (start – end)
              </button>
            </div>
          </div>

          {mode === "clip" && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="start">Start (mm:ss)</label>
                <input id="start" className="input" placeholder="0:00" value={startStr} onChange={(e) => setStartStr(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="end">End (mm:ss)</label>
                <input id="end" className="input" placeholder="0:30" value={endStr} onChange={(e) => setEndStr(e.target.value)} />
              </div>
              <p className="col-span-2 text-xs text-[var(--muted)]">
                {clipValid && clipLen > 0
                  ? `Clip length: ${formatTime(clipLen)} — only this section is downloaded.`
                  : "Enter a start and end time (e.g. 1:30 and 2:15). End must be after start."}
              </p>
            </div>
          )}

          {/* Action */}
          <div className="mt-5">
            {downloading ? (
              <ProgressIndicator label="Fetching & processing on the server… long videos can take a while." />
            ) : (
              <button className="btn btn-primary" onClick={download} disabled={!clipValid}>
                ⬇ Download {mode === "clip" ? "clip" : quality === "audio" ? "audio" : "video"}
              </button>
            )}
          </div>

          {downloadError && <p className="mt-3 rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{downloadError}</p>}
          {done && <p className="mt-3 rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--success) 14%, transparent)", color: "var(--success)" }}>✓ {done}</p>}
        </div>
      )}
    </div>
  );
}
