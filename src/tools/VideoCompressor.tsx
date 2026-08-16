"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName } from "@/lib/audio";

const LOAD_HINT = "Loading video engine (first run downloads ~32 MB)…";

type Level = "light" | "balanced" | "strong";
const LEVELS: Record<Level, { crf: number; label: string; hint: string }> = {
  light: { crf: 23, label: "Light", hint: "Best quality, modest savings" },
  balanced: { crf: 28, label: "Balanced", hint: "Good quality, big savings" },
  strong: { crf: 33, label: "Strong", hint: "Smallest file, softer detail" },
};

type Res = "original" | "1080" | "720" | "480";
const RES: Record<Res, string> = { original: "Original", "1080": "1080p", "720": "720p", "480": "480p" };

export default function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<Level>("balanced");
  const [res, setRes] = useState<Res>("original");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(undefined);
    setStage("");
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    try {
      setStage(LOAD_HINT);
      const scale = res === "original" ? [] : ["-vf", `scale=-2:${res}`];
      const blob = await runFfmpeg(
        [file],
        "output.mp4",
        "video/mp4",
        (inputs, output) => [
          "-i", inputs[0],
          ...scale,
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-crf", String(LEVELS[level].crf),
          "-c:a", "aac",
          "-b:a", "128k",
          "-movflags", "+faststart",
          output,
        ],
        (p) => {
          setStage("Compressing…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}-compressed.mp4` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed. Try a shorter clip.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="🗜️" label="Drop a video to compress" hint="MP4, WebM, MOV · processed locally with ffmpeg" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <label className="label">Compression level</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LEVELS) as Level[]).map((l) => (
              <button key={l} onClick={() => setLevel(l)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: level === l ? "var(--brand)" : "var(--surface-2)", color: level === l ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {LEVELS[l].label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[var(--muted)]">{LEVELS[level].hint}</p>

          <label className="label mt-4">Resolution</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(RES) as Res[]).map((r) => (
              <button key={r} onClick={() => setRes(r)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: res === r ? "var(--brand)" : "var(--surface-2)", color: res === r ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {RES[r]}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={compress}>Compress video</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && file && (
        <ResultCard
          title="Compressed video"
          beforeBytes={file.size}
          afterBytes={result.blob.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download MP4"
          onReset={reset}
        />
      )}
    </div>
  );
}
