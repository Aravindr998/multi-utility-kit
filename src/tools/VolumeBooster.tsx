"use client";

import { useEffect, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName, LOAD_HINT } from "@/lib/audio";

function extOf(name: string): string {
  return name.match(/\.[a-z0-9]+$/i)?.[0] || ".mp3";
}

export default function VolumeBooster() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  // Percent of original volume: 100% = unchanged.
  const [percent, setPercent] = useState(150);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const reset = () => {
    setFile(null);
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setPercent(150);
    setResult(null);
    setError(null);
    setProgress(undefined);
    setStage("");
  };

  const onFiles = (files: File[]) => {
    if (url) URL.revokeObjectURL(url);
    setFile(files[0]);
    setUrl(URL.createObjectURL(files[0]));
    setResult(null);
    setError(null);
  };

  const apply = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    const ext = extOf(file.name);
    const factor = percent / 100;
    try {
      setStage(LOAD_HINT);
      const blob = await runFfmpeg(
        [file],
        `output${ext}`,
        file.type || "audio/mpeg",
        (inputs, output) => [
          "-i", inputs[0],
          "-vn",
          "-af", `volume=${factor.toFixed(2)}`,
          output,
        ],
        (p) => {
          setStage(percent >= 100 ? "Boosting volume…" : "Adjusting volume…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}-volume${ext}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed. Please try another file.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  const db = (20 * Math.log10(percent / 100));
  const dbLabel = `${db >= 0 ? "+" : ""}${db.toFixed(1)} dB`;

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone
          accept="audio/*"
          onFiles={onFiles}
          icon="🔊"
          label="Drop an audio file"
          hint="MP3, WAV, M4A, AAC, OGG · processed locally"
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

          {url && <audio src={url} controls className="mb-4 w-full" />}

          <div className="flex items-center justify-between">
            <label className="label mb-0">Volume</label>
            <span className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
              {percent}% <span className="text-[var(--muted)]">({dbLabel})</span>
            </span>
          </div>
          <input
            type="range"
            min={20}
            max={400}
            step={5}
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            disabled={busy}
            className="mt-2 w-full"
            style={{ accentColor: "var(--brand)" }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {[100, 150, 200, 300].map((p) => (
              <button
                key={p}
                onClick={() => setPercent(p)}
                disabled={busy}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{
                  background: percent === p ? "var(--brand)" : "var(--surface-2)",
                  color: percent === p ? "var(--on-brand)" : "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {p === 100 ? "Original" : `${p}%`}
              </button>
            ))}
          </div>
          {percent > 200 && (
            <p className="mt-2 text-xs" style={{ color: "var(--warning, var(--muted))" }}>
              Large boosts can cause clipping (distortion) if the track is already loud.
            </p>
          )}

          <div className="mt-4">
            {busy ? (
              <ProgressIndicator value={progress} label={stage || "Working…"} />
            ) : (
              <button className="btn btn-primary" onClick={apply}>Apply volume</button>
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
          title="Adjusted audio"
          stats={[
            { label: "Volume", value: `${percent}%` },
            { label: "Change", value: dbLabel },
            { label: "Size", value: formatBytes(result.blob.size) },
          ]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download audio"
          onReset={reset}
        />
      )}
    </div>
  );
}
