"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName, LOAD_HINT } from "@/lib/audio";

const BITRATES = [128, 192, 256, 320] as const;
type Bitrate = (typeof BITRATES)[number];

export default function Mp3Converter() {
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState<Bitrate>(192);
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

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    try {
      setStage(LOAD_HINT);
      const blob = await runFfmpeg(
        [file],
        "output.mp3",
        "audio/mpeg",
        (inputs, output) => [
          "-i", inputs[0],
          "-vn",
          "-c:a", "libmp3lame",
          "-b:a", `${bitrate}k`,
          output,
        ],
        (p) => {
          setStage("Converting to MP3…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}.mp3` });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed. Please try another file.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone
          accept="audio/*,video/*"
          onFiles={onFiles}
          icon="🎧"
          label="Drop an audio or video file"
          hint="MP3, WAV, M4A, AAC, OGG, MP4… · processed locally"
        />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">
              {file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span>
            </p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <label className="label">MP3 quality (bitrate)</label>
          <div className="flex flex-wrap gap-2">
            {BITRATES.map((b) => (
              <button
                key={b}
                onClick={() => setBitrate(b)}
                disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{
                  background: bitrate === b ? "var(--brand)" : "var(--surface-2)",
                  color: bitrate === b ? "var(--on-brand)" : "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {b} kbps
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Higher bitrate means better sound and a larger file. 192 kbps is a good all-round choice.
          </p>

          <div className="mt-4">
            {busy ? (
              <ProgressIndicator value={progress} label={stage || "Working…"} />
            ) : (
              <button className="btn btn-primary" onClick={convert}>Convert to MP3</button>
            )}
          </div>
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

      {result && file && (
        <ResultCard
          title="MP3 ready"
          beforeBytes={file.size}
          afterBytes={result.blob.size}
          stats={[{ label: "Bitrate", value: `${bitrate} kbps` }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download MP3"
          onReset={reset}
        />
      )}
    </div>
  );
}
