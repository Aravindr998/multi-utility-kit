"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, LOAD_HINT } from "@/lib/audio";

export default function AudioJoiner() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(undefined);
    setStage("");
  };

  const onFiles = (added: File[]) => {
    setResult(null);
    setError(null);
    setFiles((prev) => [...prev, ...added]);
  };

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const removeAt = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const join = async () => {
    if (files.length < 2) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    try {
      setStage(LOAD_HINT);
      const n = files.length;
      const blob = await runFfmpeg(
        files,
        "joined.mp3",
        "audio/mpeg",
        (inputs, output) => {
          const args: string[] = [];
          for (const inp of inputs) args.push("-i", inp);
          const labels = inputs.map((_, i) => `[${i}:a]`).join("");
          args.push(
            "-filter_complex", `${labels}concat=n=${n}:v=0:a=1[out]`,
            "-map", "[out]",
            "-c:a", "libmp3lame",
            "-b:a", "192k",
            output,
          );
          return args;
        },
        (p) => {
          setStage("Joining audio…");
          setProgress(p);
        },
      );
      setResult({ blob, name: "joined.mp3" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Joining failed. Please try different files.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-4">
      <FileDropzone
        accept="audio/*"
        multiple
        onFiles={onFiles}
        icon="🔗"
        label={files.length ? "Add more audio files" : "Drop audio files to join"}
        hint="MP3, WAV, M4A, AAC, OGG · added in the order you drop them"
      />

      {files.length > 0 && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-medium">
              {files.length} file{files.length > 1 ? "s" : ""}{" "}
              <span className="text-[var(--muted)]">· {formatBytes(totalBytes)}</span>
            </p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Clear all</button>
          </div>

          <ol className="space-y-2">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center gap-2 rounded-lg p-2"
                style={{ background: "var(--surface-2)" }}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded text-xs font-semibold" style={{ background: "var(--brand-soft)" }}>
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {f.name} <span className="text-[var(--muted)]">· {formatBytes(f.size)}</span>
                </span>
                <button className="btn btn-secondary px-2 py-1 text-xs" onClick={() => move(i, -1)} disabled={busy || i === 0} aria-label="Move up">↑</button>
                <button className="btn btn-secondary px-2 py-1 text-xs" onClick={() => move(i, 1)} disabled={busy || i === files.length - 1} aria-label="Move down">↓</button>
                <button className="btn btn-secondary px-2 py-1 text-xs" onClick={() => removeAt(i)} disabled={busy} aria-label="Remove">✕</button>
              </li>
            ))}
          </ol>

          {files.length < 2 && (
            <p className="mt-3 text-xs text-[var(--muted)]">Add at least two files to join them.</p>
          )}

          <div className="mt-4">
            {busy ? (
              <ProgressIndicator value={progress} label={stage || "Working…"} />
            ) : (
              <button className="btn btn-primary" onClick={join} disabled={files.length < 2}>
                Join {files.length >= 2 ? `${files.length} files` : "audio"} → MP3
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Files are stitched end to end in the order above and exported as a single 192 kbps MP3.
          </p>
        </div>
      )}

      {error && (
        <p
          className="rounded-lg p-3 text-sm"
          style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}
        >
          {error}
        </p>
      )}

      {result && (
        <ResultCard
          title="Joined audio"
          stats={[
            { label: "Files joined", value: String(files.length) },
            { label: "Size", value: formatBytes(result.blob.size) },
          ]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download MP3"
          onReset={reset}
        />
      )}
    </div>
  );
}
