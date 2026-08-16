"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName } from "@/lib/audio";

const LOAD_HINT = "Loading video engine (first run downloads ~32 MB)…";

const SPEEDS = [0.25, 0.5, 0.75, 1.5, 2, 3, 4] as const;

/** ffmpeg's atempo filter only accepts 0.5–2.0, so chain factors for the rest. */
function atempoChain(f: number): string {
  const parts: number[] = [];
  let r = f;
  while (r > 2.0) { parts.push(2.0); r /= 2.0; }
  while (r < 0.5) { parts.push(0.5); r /= 0.5; }
  parts.push(Number(r.toFixed(6)));
  return parts.map((p) => `atempo=${p}`).join(",");
}

export default function VideoSpeedChanger() {
  const [file, setFile] = useState<File | null>(null);
  const [speed, setSpeed] = useState<number>(2);
  const [muted, setMuted] = useState(false);
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

  const change = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    try {
      setStage(LOAD_HINT);
      const audioArgs = muted ? ["-an"] : ["-af", atempoChain(speed), "-c:a", "aac", "-b:a", "128k"];
      const blob = await runFfmpeg(
        [file],
        "output.mp4",
        "video/mp4",
        (inputs, output) => [
          "-i", inputs[0],
          "-vf", `setpts=${(1 / speed).toFixed(6)}*PTS`,
          "-c:v", "libx264",
          "-preset", "veryfast",
          "-crf", "23",
          ...audioArgs,
          output,
        ],
        (p) => {
          setStage("Re-timing video…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}-${speed}x.mp4` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Speed change failed. If the video has no audio track, enable “Remove audio”.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="⏩" label="Drop a video to speed up or slow down" hint="MP4, WebM, MOV · processed locally" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <label className="label">Playback speed</label>
          <div className="flex flex-wrap gap-2">
            {SPEEDS.map((s) => (
              <button key={s} onClick={() => setSpeed(s)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{ background: speed === s ? "var(--brand)" : "var(--surface-2)", color: speed === s ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {s}×
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-[var(--muted)]">
            {speed > 1 ? `Plays ${speed}× faster` : speed < 1 ? `Plays ${speed}× slower` : "Original speed"} — a clip will end up about {(1 / speed).toFixed(2)}× its current length.
          </p>

          <label className="mt-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} disabled={busy} />
            Remove audio (use for silent clips or extreme speeds)
          </label>

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={change}>Change speed</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && file && (
        <ResultCard
          title="Re-timed video"
          stats={[{ label: "Speed", value: `${speed}×` }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download MP4"
          onReset={reset}
        />
      )}
    </div>
  );
}
