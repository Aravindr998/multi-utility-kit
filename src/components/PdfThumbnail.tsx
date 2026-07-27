"use client";

import { useEffect, useRef, useState } from "react";
import { getPdfjs } from "@/lib/pdfjs";

/**
 * Renders the first page of a PDF as a small thumbnail on a canvas.
 * All rendering happens locally in the browser via pdf.js.
 */
export default function PdfThumbnail({
  file,
  width = 44,
  className = "",
}: {
  file: File;
  /** Displayed width in CSS pixels; height follows the page aspect ratio. */
  width?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [state, setState] = useState<"loading" | "done" | "error">("loading");
  // A4-ish fallback ratio until the real page dimensions are known.
  const [ratio, setRatio] = useState(1.414);
  const isPdf = file.type === "application/pdf";

  useEffect(() => {
    if (!isPdf) return;

    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;
    let loadingTask: ReturnType<typeof import("pdfjs-dist").getDocument> | null = null;

    (async () => {
      setState("loading");
      try {
        const pdfjs = await getPdfjs();
        const data = new Uint8Array(await file.arrayBuffer());
        if (cancelled) return;
        loadingTask = pdfjs.getDocument({ data });
        const doc = await loadingTask.promise;
        const page = await doc.getPage(1);
        if (cancelled) return;

        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const base = page.getViewport({ scale: 1 });
        setRatio(base.height / base.width);
        const viewport = page.getViewport({ scale: (width * dpr) / base.width });

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({ canvas, canvasContext: ctx, viewport });
        await renderTask.promise;
        if (!cancelled) setState("done");
      } catch {
        if (!cancelled) setState("error");
      } finally {
        try {
          loadingTask?.destroy();
        } catch {
          /* ignore */
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel();
      } catch {
        /* ignore */
      }
    };
  }, [file, width, isPdf]);

  const boxStyle = { width, height: Math.round(width * ratio) };

  if (!isPdf || state === "error") {
    return (
      <div
        className={`grid shrink-0 place-items-center rounded ${className}`}
        style={{ ...boxStyle, background: "var(--surface-2)", border: "1px solid var(--border)" }}
        aria-hidden
      >
        <span style={{ fontSize: width * 0.5 }}>📄</span>
      </div>
    );
  }

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded ${className}`}
      style={{ ...boxStyle, border: "1px solid var(--border)", background: "var(--surface-2)" }}
    >
      {state === "loading" && <div className="absolute inset-0 animate-pulse" style={{ background: "var(--surface-2)" }} />}
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ opacity: state === "done" ? 1 : 0, transition: "opacity 0.2s" }}
        aria-label={`Preview of ${file.name}`}
      />
    </div>
  );
}
