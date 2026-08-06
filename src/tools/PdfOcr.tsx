"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ProgressIndicator from "@/components/ProgressIndicator";
import { getPdfjs } from "@/lib/pdfjs";
import { downloadBlob } from "@/lib/format";

const LANGS: [string, string][] = [
  ["eng", "English"],
  ["spa", "Spanish"],
  ["fra", "French"],
  ["deu", "German"],
  ["ita", "Italian"],
  ["por", "Portuguese"],
];

export default function PdfOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState("eng");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setFile(null);
    setText(null);
    setError(null);
    setPhase("");
    setProgress(undefined);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  // Render every PDF page to a canvas for OCR input.
  const pdfToCanvases = async (f: File): Promise<HTMLCanvasElement[]> => {
    const pdfjs = await getPdfjs();
    const doc = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
    const canvases: HTMLCanvasElement[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      canvases.push(canvas);
      page.cleanup();
    }
    return canvases;
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setText(null);
    setPhase("Downloading OCR engine (first run only)…");
    setProgress(undefined);
    let worker: Awaited<ReturnType<typeof import("tesseract.js").createWorker>> | null = null;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setPhase("Recognising text…");
          else setPhase(m.status.charAt(0).toUpperCase() + m.status.slice(1) + "…");
          setProgress(m.progress * 100);
        },
      });

      const isPdf = file.type === "application/pdf";
      let combined = "";
      if (isPdf) {
        const canvases = await pdfToCanvases(file);
        for (let i = 0; i < canvases.length; i++) {
          setPhase(`Recognising text — page ${i + 1} of ${canvases.length}…`);
          const { data } = await worker.recognize(canvases[i]);
          combined += (canvases.length > 1 ? `\n\n───── Page ${i + 1} ─────\n\n` : "") + data.text.trim();
        }
      } else {
        const { data } = await worker.recognize(file);
        combined = data.text.trim();
      }
      setText(combined || "(No text was recognised in this file.)");
    } catch (e) {
      setError(e instanceof Error ? `OCR failed: ${e.message}` : "OCR failed. Try a clearer scan or a different language.");
    } finally {
      if (worker) await worker.terminate();
      setBusy(false);
      setPhase("");
    }
  };

  const copy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf,image/*" onFiles={onFiles} icon="🔎" label="Drop a scanned PDF or image to OCR" hint="Extracts selectable text from scans & photos" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 truncate font-medium">📄 {file.name}</p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          {!busy && text === null && (
            <>
              <label className="label" htmlFor="lang">Document language</label>
              <select id="lang" className="input mb-4 max-w-xs" value={lang} onChange={(e) => setLang(e.target.value)}>
                {LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>

              <div
                className="mb-4 rounded-lg p-3 text-sm"
                style={{ background: "color-mix(in srgb, var(--brand) 10%, transparent)", border: "1px solid var(--border)" }}
                role="note"
              >
                <strong>⚠️ Heads up — this one is resource-intensive.</strong> OCR runs an engine entirely on your
                device. The first run downloads the engine and language data (a few MB), and recognising a
                multi-page document can take a while. Your file is never uploaded — only the engine is fetched.
              </div>

              <button className="btn btn-primary" onClick={run}>Extract text</button>
            </>
          )}

          {busy && (
            <div>
              <ProgressIndicator value={progress} label={phase || "Working…"} />
              <p className="mt-2 text-center text-xs text-[var(--muted)]">Please keep this tab open — everything runs locally in your browser.</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {text !== null && (
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Extracted text</h3>
            <div className="flex gap-2">
              <button className="btn btn-secondary" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
              <button className="btn btn-primary" onClick={() => downloadBlob(new Blob([text], { type: "text/plain" }), (file?.name.replace(/\.[^.]+$/, "") || "ocr") + ".txt")}>⬇ Download .txt</button>
            </div>
          </div>
          <textarea readOnly value={text} className="input min-h-[300px] w-full font-mono text-sm" />
          <button className="btn btn-secondary mt-3" onClick={reset}>Start over</button>
        </div>
      )}
    </div>
  );
}
