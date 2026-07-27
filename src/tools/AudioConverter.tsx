"use client";

import { useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { loadFfmpeg, toUint8 } from "@/lib/ffmpeg";

type Fmt = "mp3" | "wav" | "aac" | "ogg" | "m4a";

const FMT: Record<Fmt, { mime: string; args: (i: string, o: string) => string[] }> = {
  mp3: { mime: "audio/mpeg", args: (i, o) => ["-i", i, "-c:a", "libmp3lame", "-q:a", "2", o] },
  wav: { mime: "audio/wav", args: (i, o) => ["-i", i, o] },
  aac: { mime: "audio/aac", args: (i, o) => ["-i", i, "-c:a", "aac", "-b:a", "192k", o] },
  ogg: { mime: "audio/ogg", args: (i, o) => ["-i", i, "-c:a", "libvorbis", "-q:a", "5", o] },
  m4a: { mime: "audio/mp4", args: (i, o) => ["-i", i, "-c:a", "aac", "-b:a", "192k", o] },
};

export default function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Fmt>("mp3");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const progressHandler = useRef<((e: { progress: number }) => void) | null>(null);

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
      setStage("Loading converter (first run downloads ~32 MB)…");
      const ff = await loadFfmpeg();

      if (progressHandler.current) ff.off("progress", progressHandler.current);
      progressHandler.current = ({ progress }: { progress: number }) => setProgress(Math.min(100, progress * 100));
      ff.on("progress", progressHandler.current);

      setStage("Converting…");
      setProgress(0);
      const inName = "input" + (file.name.match(/\.[a-z0-9]+$/i)?.[0] || ".mp3");
      const outName = `output.${format}`;
      await ff.writeFile(inName, await toUint8(file));
      await ff.exec(FMT[format].args(inName, outName));
      const data = await ff.readFile(outName);
      const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string);
      const blob = new Blob([bytes as BlobPart], { type: FMT[format].mime });
      setResult({ blob, name: file.name.replace(/\.[a-z0-9]+$/i, "") + "." + format });
      await ff.deleteFile(inName).catch(() => {});
      await ff.deleteFile(outName).catch(() => {});
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
        <FileDropzone accept="audio/*" onFiles={onFiles} icon="🎵" label="Drop an audio file" hint="MP3, WAV, AAC, OGG, M4A · processed locally" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <label className="label">Convert to</label>
          <div className="flex flex-wrap gap-2">
            {(["mp3", "wav", "aac", "ogg", "m4a"] as Fmt[]).map((f) => (
              <button key={f} onClick={() => setFormat(f)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold uppercase"
                style={{ background: format === f ? "var(--brand)" : "var(--surface-2)", color: format === f ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {f}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={convert}>Convert audio</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && file && (
        <ResultCard
          title="Converted audio"
          beforeBytes={file.size}
          afterBytes={result.blob.size}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel={`Download ${format.toUpperCase()}`}
          onReset={reset}
        />
      )}
    </div>
  );
}
