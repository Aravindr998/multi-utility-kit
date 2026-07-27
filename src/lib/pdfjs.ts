// Client-only loader for pdf.js with a bundled worker (no external CDN).
// Import lazily inside client components: `const pdfjs = await getPdfjs()`.

type PdfjsModule = typeof import("pdfjs-dist");

let cached: Promise<PdfjsModule> | null = null;

export function getPdfjs(): Promise<PdfjsModule> {
  if (cached) return cached;
  cached = (async () => {
    const pdfjs = await import("pdfjs-dist");
    // Resolve the worker from the package as a bundled asset URL (webpack/Turbopack).
    const worker = new Worker(
      new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
      { type: "module" },
    );
    pdfjs.GlobalWorkerOptions.workerPort = worker;
    return pdfjs;
  })();
  return cached;
}
