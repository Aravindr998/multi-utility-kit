"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName } from "@/lib/audio";

const LOAD_HINT = "Loading audio engine (first run downloads ~32 MB)…";

type Fmt = "mp3" | "wav" | "aac" | "m4a";
const FMT: Record<Fmt, { mime: string; codec: (o: string) => string[] }> = {
  mp3: { mime: "audio/mpeg", codec: (o) => ["-c:a", "libmp3lame", "-q:a", "2", o] },
  wav: { mime: "audio/wav", codec: (o) => [o] },
  aac: { mime: "audio/aac", codec: (o) => ["-c:a", "aac", "-b:a", "192k", o] },
  m4a: { mime: "audio/mp4", codec: (o) => ["-c:a", "aac", "-b:a", "192k", o] },
};

export default function VideoAudioExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Fmt>("mp3");
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

  const extract = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    try {
      setStage(LOAD_HINT);
      const blob = await runFfmpeg(
        [file],
        `output.${format}`,
        FMT[format].mime,
        (inputs, output) => ["-i", inputs[0], "-vn", ...FMT[format].codec(output)],
        (p) => {
          setStage("Extracting audio…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}.${format}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Extraction failed. Please try another file.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="🎵" label="Drop a video to extract its audio" hint="MP4, WebM, MOV · processed locally" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <label className="label">Audio format</label>
          <div className="flex flex-wrap gap-2">
            {(["mp3", "wav", "aac", "m4a"] as Fmt[]).map((f) => (
              <button key={f} onClick={() => setFormat(f)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold uppercase"
                style={{ background: format === f ? "var(--brand)" : "var(--surface-2)", color: format === f ? "var(--on-brand)" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {f}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={extract}>Extract audio</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && (
        <ResultCard
          title="Extracted audio"
          stats={[{ label: "Format", value: format.toUpperCase() }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel={`Download ${format.toUpperCase()}`}
          onReset={reset}
        />
      )}
    </div>
  );
}
