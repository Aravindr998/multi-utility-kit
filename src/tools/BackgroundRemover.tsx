"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { baseName } from "@/lib/image";
import { downloadBlob } from "@/lib/format";

// Checkerboard so transparency is obvious in the preview.
const CHECKER =
  "repeating-conic-gradient(#c8c8c8 0% 25%, #ffffff 0% 50%) 50% / 20px 20px";

type Phase = "idle" | "downloading" | "processing";

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setSrcUrl(null);
    setPhase("idle");
    setProgress(undefined);
    setResult(null);
    setError(null);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
    setSrcUrl(URL.createObjectURL(files[0]));
  };

  const run = async () => {
    if (!file) return;
    setError(null);
    setResult(null);
    setPhase("downloading");
    setProgress(undefined);
    try {
      // Lazy-load the multi-MB ML library only when the user actually asks for it.
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(file, {
        model: "isnet_fp16",
        output: { format: "image/png" },
        progress: (key, current, total) => {
          if (key.startsWith("fetch")) {
            setPhase("downloading");
            setProgress(total ? (current / total) * 100 : undefined);
          } else {
            setPhase("processing");
            setProgress(total ? (current / total) * 100 : undefined);
          }
        },
      });
      setResult({ blob, url: URL.createObjectURL(blob) });
      setPhase("idle");
    } catch (e) {
      setError(
        e instanceof Error
          ? `Background removal failed: ${e.message}`
          : "Background removal failed. Try a smaller image or a different browser.",
      );
      setPhase("idle");
    }
  };

  const download = () => {
    if (!result || !file) return;
    downloadBlob(result.blob, `${baseName(file)}-no-bg.png`);
  };

  const busy = phase !== "idle";
  const label = phase === "downloading" ? "Downloading AI model (first run only)…" : "Removing background…";

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🪄" label="Drop an image to remove its background" hint="Best with clear subjects — people, products, animals" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name}</p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          <div className="grid place-items-center rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
            {srcUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={srcUrl} alt="Source" className="max-h-72 max-w-full rounded object-contain" />
            )}
          </div>

          {!busy && !result && (
            <>
              <div
                className="mt-4 rounded-lg p-3 text-sm"
                style={{ background: "color-mix(in srgb, var(--brand) 10%, transparent)", border: "1px solid var(--border)" }}
                role="note"
              >
                <strong>⚠️ Heads up — this one is resource-intensive.</strong> Background removal runs an AI model
                entirely on your device. The first run downloads a model (~several MB) and processing can take
                anywhere from a few seconds to a minute depending on your device and the image size. Your image is
                never uploaded — only the model is fetched.
              </div>
              <button className="btn btn-primary mt-4" onClick={run}>Remove background</button>
            </>
          )}

          {busy && (
            <div className="mt-4">
              <ProgressIndicator value={progress} label={label} />
              <p className="mt-2 text-center text-xs text-[var(--muted)]">
                Please keep this tab open — everything is processing locally in your browser.
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && file && (
        <ResultCard
          title="Background removed"
          stats={[{ label: "Format", value: "PNG (transparent)" }, { label: "Size", value: `${(result.blob.size / 1024).toFixed(1)} KB` }]}
          onDownload={download}
          downloadLabel="Download PNG"
          onReset={reset}
          preview={
            <div className="grid place-items-center rounded-lg p-3" style={{ background: CHECKER }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Result with transparent background" className="max-h-64 max-w-full object-contain" />
            </div>
          }
        />
      )}
    </div>
  );
}
