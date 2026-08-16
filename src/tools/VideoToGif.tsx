"use client";

import { useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName, parseTime, formatDuration } from "@/lib/audio";

const LOAD_HINT = "Loading video engine (first run downloads ~32 MB)…";

const FPS = [10, 15, 20, 25] as const;
const WIDTHS = [320, 480, 640] as const;

export default function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState("0:00");
  const [length, setLength] = useState("5");
  const [fps, setFps] = useState<number>(15);
  const [width, setWidth] = useState<number>(480);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; name: string; preview: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.preview); }, [result]);

  const reset = () => {
    setFile(null);
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setDuration(0);
    setStart("0:00");
    setLength("5");
    if (result) URL.revokeObjectURL(result.preview);
    setResult(null);
    setError(null);
    setProgress(undefined);
    setStage("");
  };

  const onFiles = (files: File[]) => {
    if (url) URL.revokeObjectURL(url);
    setFile(files[0]);
    setUrl(URL.createObjectURL(files[0]));
    setDuration(0);
    setStart("0:00");
    setLength("5");
    setResult(null);
    setError(null);
  };

  const make = async () => {
    if (!file) return;
    const s = parseTime(start);
    const len = Number(length);
    if (isNaN(s) || s < 0) {
      setError("Enter a valid start time like 0:03.");
      return;
    }
    if (!isFinite(len) || len <= 0) {
      setError("Enter a valid duration in seconds.");
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    try {
      setStage(LOAD_HINT);
      const filters = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5`;
      const blob = await runFfmpeg(
        [file],
        "output.gif",
        "image/gif",
        (inputs, output) => [
          "-ss", String(s),
          "-t", String(len),
          "-i", inputs[0],
          "-vf", filters,
          "-loop", "0",
          output,
        ],
        (p) => {
          setStage("Rendering GIF…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}.gif`, preview: URL.createObjectURL(blob) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "GIF creation failed. Try a shorter clip or smaller size.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  const setStartToPlayhead = () => {
    if (videoRef.current) setStart(formatDuration(videoRef.current.currentTime));
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="🎞️" label="Drop a video to turn into a GIF" hint="MP4, WebM, MOV · processed locally · short clips work best" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          {url && (
            <video
              ref={videoRef}
              src={url}
              controls
              className="mb-4 max-h-80 w-full rounded-lg bg-black"
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (isFinite(d)) setDuration(d);
              }}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Start time</label>
              <div className="flex gap-2">
                <input className="input flex-1" value={start} onChange={(e) => setStart(e.target.value)} placeholder="0:00" disabled={busy} />
                <button className="btn btn-secondary" onClick={setStartToPlayhead} disabled={busy} title="Use current playback position">Set</button>
              </div>
            </div>
            <div>
              <label className="label">Duration (seconds)</label>
              <input className="input" type="number" min={0.5} step={0.5} value={length} onChange={(e) => setLength(e.target.value)} placeholder="5" disabled={busy} />
            </div>
          </div>

          <label className="label mt-4">Frames per second</label>
          <div className="flex flex-wrap gap-2">
            {FPS.map((f) => (
              <button key={f} onClick={() => setFps(f)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: fps === f ? "var(--brand)" : "var(--surface-2)", color: fps === f ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {f} fps
              </button>
            ))}
          </div>

          <label className="label mt-4">Width</label>
          <div className="flex flex-wrap gap-2">
            {WIDTHS.map((w) => (
              <button key={w} onClick={() => setWidth(w)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: width === w ? "var(--brand)" : "var(--surface-2)", color: width === w ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {w}px
              </button>
            ))}
          </div>
          {duration > 0 && <p className="mt-3 text-xs text-[var(--muted)]">Source length: {formatDuration(duration)}. Higher fps and width make a smoother but larger GIF.</p>}

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={make}>Create GIF</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && (
        <ResultCard
          title="Your GIF"
          preview={<img src={result.preview} alt="GIF preview" className="mx-auto max-h-80 rounded-lg" />}
          stats={[{ label: "Size", value: formatBytes(result.blob.size) }, { label: "Frame rate", value: `${fps} fps` }, { label: "Width", value: `${width}px` }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download GIF"
          onReset={reset}
        />
      )}
    </div>
  );
}
