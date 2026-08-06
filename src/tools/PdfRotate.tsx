"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";

/** Parse "1-3, 5, 8-10" into a 0-based, de-duplicated page index list. */
function parseRanges(input: string, pageCount: number): number[] {
  const result: number[] = [];
  const seen = new Set<number>();
  for (const part of input.split(",")) {
    const token = part.trim();
    if (!token) continue;
    const m = token.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      let a = parseInt(m[1]);
      let b = parseInt(m[2]);
      if (a > b) [a, b] = [b, a];
      for (let p = a; p <= b; p++) if (p >= 1 && p <= pageCount && !seen.has(p)) { seen.add(p); result.push(p - 1); }
    } else if (/^\d+$/.test(token)) {
      const p = parseInt(token);
      if (p >= 1 && p <= pageCount && !seen.has(p)) { seen.add(p); result.push(p - 1); }
    }
  }
  return result;
}

export default function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotation, setRotation] = useState(90);
  const [scope, setScope] = useState<"all" | "range">("all");
  const [ranges, setRanges] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRanges("");
    setScope("all");
    setResult(null);
    setError(null);
  };

  const onFiles = async (files: File[]) => {
    reset();
    const f = files[0];
    setFile(f);
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      setRanges(`1-${doc.getPageCount()}`);
    } catch {
      setError("Could not read this PDF. It may be password-protected — unlock it first.");
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const pages = doc.getPages();
      const targets = scope === "all" ? pages.map((_, i) => i) : parseRanges(ranges, pageCount);
      if (targets.length === 0) throw new Error("No valid pages in that range.");
      for (const i of targets) {
        const page = pages[i];
        const current = page.getRotation().angle;
        page.setRotation(degrees((current + rotation) % 360));
      }
      const saved = await doc.save();
      setResult({
        blob: new Blob([saved as BlobPart], { type: "application/pdf" }),
        name: file.name.replace(/\.pdf$/i, "") + "-rotated.pdf",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not rotate this PDF.");
    } finally {
      setBusy(false);
    }
  };

  const chip = (active: boolean) => ({
    background: active ? "var(--brand)" : "var(--surface-2)",
    color: active ? "var(--on-brand)" : "var(--foreground)",
    border: "1px solid var(--border)",
  });

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="🔄" label="Drop a PDF to rotate" hint="Rotate all pages or a selection" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <PdfThumbnail file={file} width={48} />
              <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {pageCount} pages</span></p>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <label className="label">Rotation</label>
          <div className="mb-4 flex flex-wrap gap-2">
            {([[90, "↻ 90° right"], [270, "↺ 90° left"], [180, "180°"]] as [number, string][]).map(([v, l]) => (
              <button key={v} onClick={() => { setRotation(v); setResult(null); }} className="rounded-lg px-4 py-2 text-sm font-semibold" style={chip(rotation === v)}>{l}</button>
            ))}
          </div>

          <label className="label">Apply to</label>
          <div className="mb-3 flex flex-wrap gap-2">
            <button onClick={() => { setScope("all"); setResult(null); }} className="rounded-lg px-3 py-1.5 text-sm font-semibold" style={chip(scope === "all")}>All pages</button>
            <button onClick={() => { setScope("range"); setResult(null); }} className="rounded-lg px-3 py-1.5 text-sm font-semibold" style={chip(scope === "range")}>Specific pages</button>
          </div>

          {scope === "range" && (
            <div className="mb-2">
              <input className="input" value={ranges} onChange={(e) => { setRanges(e.target.value); setResult(null); }} placeholder="e.g. 1-3, 5, 8-10" />
              <p className="mt-1 text-xs text-[var(--muted)]">Comma-separated pages and ranges. This PDF has {pageCount} pages.</p>
            </div>
          )}

          <div className="mt-4">
            {busy ? <ProgressIndicator label="Rotating…" /> : <button className="btn btn-primary" onClick={run}>Rotate PDF</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="Rotation complete"
          stats={[{ label: "Rotation", value: `${rotation}°` }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download PDF"
          onReset={reset}
        />
      )}
    </div>
  );
}
