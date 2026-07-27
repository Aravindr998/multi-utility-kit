"use client";

import { useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { loadFfmpeg, toUint8 } from "@/lib/ffmpeg";

type Fmt = "mp4" | "webm" | "gif";

const FMT: Record<Fmt, { mime: string; args: (input: string, output: string) => string[] }> = {
  mp4: { mime: "video/mp4", args: (i, o) => ["-i", i, "-c:v", "libx264", "-preset", "veryfast", "-crf", "26", "-c:a", "aac", o] },
  webm: { mime: "video/webm", args: (i, o) => ["-i", i, "-c:v", "libvpx-vp9", "-b:v", "1M", "-c:a", "libopus", o] },
  gif: { mime: "image/gif", args: (i, o) => ["-i", i, "-vf", "fps=10,scale=480:-1:flags=lanczos", "-loop", "0", o] },
};

export default function VideoConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Fmt>("mp4");
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
      const inName = "input" + (file.name.match(/\.[a-z0-9]+$/i)?.[0] || ".mp4");
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
      setError(e instanceof Error ? e.message : "Conversion failed. Try a shorter clip.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="🎥" label="Drop a video file" hint="Best for short clips · processed locally with ffmpeg" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <label className="label">Convert to</label>
          <div className="flex flex-wrap gap-2">
            {(["mp4", "webm", "gif"] as Fmt[]).map((f) => (
              <button key={f} onClick={() => setFormat(f)} disabled={busy}
                className="rounded-lg px-4 py-2 text-sm font-semibold uppercase"
                style={{ background: format === f ? "var(--brand)" : "var(--surface-2)", color: format === f ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}>
                {f}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={convert}>Convert video</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && file && (
        <ResultCard
          title="Converted video"
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
