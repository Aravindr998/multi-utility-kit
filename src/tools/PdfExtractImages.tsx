"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";
import { getPdfjs } from "@/lib/pdfjs";

type Extracted = { name: string; blob: Blob; url: string; w: number; h: number };

// pdf.js ImageKind values.
const GRAYSCALE_1BPP = 1;
const RGB_24BPP = 2;
const RGBA_32BPP = 3;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCanvas(obj: any): HTMLCanvasElement | null {
  const w = obj?.width;
  const h = obj?.height;
  if (!w || !h) return null;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return null;

  if (obj.bitmap) {
    ctx.drawImage(obj.bitmap, 0, 0);
    return c;
  }
  const src: Uint8ClampedArray | undefined = obj.data;
  if (!src) return null;

  const out = new Uint8ClampedArray(w * h * 4);
  if (obj.kind === RGBA_32BPP) {
    out.set(src.subarray(0, w * h * 4));
  } else if (obj.kind === RGB_24BPP) {
    for (let i = 0, j = 0; i < w * h; i++) {
      out[j++] = src[i * 3];
      out[j++] = src[i * 3 + 1];
      out[j++] = src[i * 3 + 2];
      out[j++] = 255;
    }
  } else if (obj.kind === GRAYSCALE_1BPP) {
    const rowBytes = (w + 7) >> 3;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const bit = (src[y * rowBytes + (x >> 3)] >> (7 - (x & 7))) & 1;
        const v = bit ? 255 : 0;
        const j = (y * w + x) * 4;
        out[j] = out[j + 1] = out[j + 2] = v;
        out[j + 3] = 255;
      }
    }
  } else {
    return null;
  }
  ctx.putImageData(new ImageData(out, w, h), 0, 0);
  return c;
}

function getFromObjs(objs: { get: (name: string, cb: (o: unknown) => void) => void }, name: string): Promise<unknown> {
  return new Promise((resolve) => {
    try {
      objs.get(name, resolve);
    } catch {
      resolve(null);
    }
  });
}

export default function PdfExtractImages() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [images, setImages] = useState<Extracted[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    images.forEach((im) => URL.revokeObjectURL(im.url));
    setFile(null);
    setImages([]);
    setDone(false);
    setError(null);
    setProgress(0);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setImages([]);
    setDone(false);
    setProgress(0);
    try {
      const pdfjs = await getPdfjs();
      const OPS = pdfjs.OPS;
      const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
      const found: Extracted[] = [];

      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        // Render off-screen first so image objects are decoded into page.objs.
        const viewport = page.getViewport({ scale: 1 });
        const rc = document.createElement("canvas");
        rc.width = Math.max(1, Math.floor(viewport.width));
        rc.height = Math.max(1, Math.floor(viewport.height));
        const rctx = rc.getContext("2d")!;
        await page.render({ canvas: rc, canvasContext: rctx, viewport }).promise;

        const opList = await page.getOperatorList();
        const seen = new Set<string>();
        for (let i = 0; i < opList.fnArray.length; i++) {
          const fn = opList.fnArray[i];
          if (fn !== OPS.paintImageXObject && fn !== OPS.paintImageXObjectRepeat) continue;
          const name = opList.argsArray[i][0];
          if (typeof name !== "string" || seen.has(name)) continue;
          seen.add(name);
          const obj = await getFromObjs(page.objs, name);
          const canvas = toCanvas(obj);
          if (!canvas) continue;
          const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), "image/png"));
          if (!blob) continue;
          found.push({
            name: `p${n}-img${found.length + 1}.png`,
            blob,
            url: URL.createObjectURL(blob),
            w: canvas.width,
            h: canvas.height,
          });
        }
        page.cleanup();
        setProgress((n / doc.numPages) * 100);
      }

      if (found.length === 0) {
        setError("No embedded images were found in this PDF. (A scanned PDF where each page is one big image will still return that page image.)");
      }
      setImages(found);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not extract images from this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    images.forEach((im) => zip.file(im.name, im.blob));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, (file?.name.replace(/\.pdf$/i, "") || "pdf") + "-images.zip");
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="🖼️" label="Drop a PDF to extract its images" hint="Pulls out embedded photos & graphics" />
      )}

      {file && !done && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <PdfThumbnail file={file} width={48} />
              <p className="truncate font-medium">{file.name}</p>
            </div>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>
          {busy ? <ProgressIndicator value={progress} label="Scanning pages for images…" /> : <button className="btn btn-primary" onClick={run}>Extract images</button>}
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {done && images.length > 0 && (
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">{images.length} image{images.length > 1 ? "s" : ""} extracted</h3>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={downloadZip}>⬇ Download all (ZIP)</button>
              <button className="btn btn-secondary" onClick={reset}>Start over</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((im) => (
              <div key={im.name} className="overflow-hidden rounded-lg" style={{ border: "1px solid var(--border)" }}>
                <div className="grid place-items-center p-2" style={{ background: "var(--surface-2)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url} alt={im.name} className="max-h-28 max-w-full object-contain" />
                </div>
                <div className="flex items-center justify-between gap-2 p-2 text-xs">
                  <span className="text-[var(--muted)]">{im.w}×{im.h}</span>
                  <button className="font-medium text-[var(--brand)] hover:underline" onClick={() => downloadBlob(im.blob, im.name)}>Save</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">Total: {formatBytes(images.reduce((s, im) => s + im.blob.size, 0))}</p>
        </div>
      )}
    </div>
  );
}
