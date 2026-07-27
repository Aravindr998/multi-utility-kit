"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";
import { getPdfjs } from "@/lib/pdfjs";

type Dir = "pdf2word" | "word2pdf";

export default function PdfToWord() {
  const [dir, setDir] = useState<Dir>("pdf2word");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const switchDir = (d: Dir) => {
    setDir(d);
    reset();
  };

  const onFiles = (files: File[]) => {
    setResult(null);
    setError(null);
    setFile(files[0]);
  };

  // ---- PDF → Word: reconstruct headings, styles, alignment & paragraphs into a .docx ----
  const pdfToWord = async (f: File) => {
    const pdfjs = await getPdfjs();
    const docx = await import("docx");
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } = docx;
    type ParaOpts = Extract<ConstructorParameters<typeof Paragraph>[0], object>;
    const OPS = pdfjs.OPS as Record<string, number>;

    const doc = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;

    // A styled run of text; a cell is a run of runs; a line is one or more cells (>1 ⇒ table row candidate).
    type Run = { text: string; bold: boolean; italic: boolean; font?: string; size: number; color?: string };
    type Cell = { runs: Run[]; xStart: number; xEnd: number };
    type Line = { cells: Cell[]; y: number; size: number; align: "left" | "center" | "right"; newPage: boolean };
    const allLines: Line[] = [];

    // Strip subset prefix ("ABCDEE+") and weight/style suffixes to get a usable family name.
    const cleanFamily = (n: string): string | undefined => {
      if (!n) return undefined;
      const s = n
        .replace(/^[A-Z]{6}\+/, "")
        .replace(/[-_,]?(Bold|Italic|Oblique|Regular|Medium|Light|Black|Semibold|Demibold|Heavy|Thin|Book|Roman|MT|PS|Condensed)+/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      return s || undefined;
    };
    const mapGeneric = (fam?: string): string | undefined => {
      if (!fam) return undefined;
      const l = fam.toLowerCase();
      if (l.includes("mono")) return "Courier New";
      if (l.includes("serif") && !l.includes("sans")) return "Times New Roman";
      if (l.includes("sans")) return "Arial";
      return undefined;
    };

    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const pageWidth = page.getViewport({ scale: 1 }).width;
      // Walk the operator list to (a) load fonts for bold/italic detection and
      // (b) record the fill colour applied at each text-showing position.
      type ColorEvent = { x: number; y: number; color: string };
      const colorEvents: ColorEvent[] = [];
      try {
        const ops = await page.getOperatorList();
        const mul = (m: number[], n: number[]) => [
          m[0] * n[0] + m[2] * n[1],
          m[1] * n[0] + m[3] * n[1],
          m[0] * n[2] + m[2] * n[3],
          m[1] * n[2] + m[3] * n[3],
          m[0] * n[4] + m[2] * n[5] + m[4],
          m[1] * n[4] + m[3] * n[5] + m[5],
        ];
        // pdf.js may pass a matrix as [a,b,c,d,e,f] or as an object {0..5}.
        const toM = (v: unknown): number[] => {
          if (Array.isArray(v) && v.length >= 6 && typeof v[0] === "number") return v as number[];
          const o = (Array.isArray(v) ? v[0] : v) as Record<number, number>;
          return [o[0], o[1], o[2], o[3], o[4], o[5]];
        };
        const chan = (v: number) => Math.max(0, Math.min(255, Math.round(v <= 1 ? v * 255 : v)));
        const numHex = (r: number, g: number, b: number) => [r, g, b].map((v) => chan(v).toString(16).padStart(2, "0")).join("");
        // pdf.js v6 usually passes fill colours as CSS hex strings ("#rrggbb").
        const asHex = (v: unknown): string | null => (typeof v === "string" ? v.replace(/^#/, "").slice(0, 6).padStart(6, "0") : null);
        let ctm = [1, 0, 0, 1, 0, 0];
        const stack: number[][] = [];
        let tm = [1, 0, 0, 1, 0, 0];
        let tlm = [1, 0, 0, 1, 0, 0];
        let fontSize = 0;
        let leading = 0;
        let fill = "000000";
        const fn = ops.fnArray;
        const args = ops.argsArray as unknown[][];
        for (let k = 0; k < fn.length; k++) {
          const op = fn[k];
          const a = args[k] as (number & string & unknown[])[];
          if (op === OPS.save) stack.push(ctm.slice());
          else if (op === OPS.restore) ctm = stack.pop() || ctm;
          else if (op === OPS.transform) ctm = mul(ctm, toM(a));
          else if (op === OPS.beginText) { tm = [1, 0, 0, 1, 0, 0]; tlm = tm.slice(); }
          else if (op === OPS.setTextMatrix) { tm = toM(a); tlm = tm.slice(); }
          else if (op === OPS.setLeading) leading = a[0] as number;
          else if (op === OPS.setFont) fontSize = a[1] as number;
          else if (op === OPS.setLeadingMoveText) { leading = -(a[1] as number); tlm = mul(tlm, [1, 0, 0, 1, a[0] as number, a[1] as number]); tm = tlm.slice(); }
          else if (op === OPS.moveText) { tlm = mul(tlm, [1, 0, 0, 1, a[0] as number, a[1] as number]); tm = tlm.slice(); }
          else if (op === OPS.nextLine) { tlm = mul(tlm, [1, 0, 0, 1, 0, -leading]); tm = tlm.slice(); }
          else if (op === OPS.setFillRGBColor) fill = asHex(a[0]) ?? numHex(a[0] as number, a[1] as number, a[2] as number);
          else if (op === OPS.setFillGray) { const h = asHex(a[0]); const g = chan(a[0] as number); fill = h ?? numHex(g, g, g); }
          else if (op === OPS.setFillCMYKColor) {
            const h = asHex(a[0]);
            const [c, m, y, kk] = a as unknown as number[];
            fill = h ?? numHex(255 * (1 - c) * (1 - kk), 255 * (1 - m) * (1 - kk), 255 * (1 - y) * (1 - kk));
          } else if (op === OPS.showText || op === OPS.nextLineShowText || op === OPS.nextLineSetSpacingShowText) {
            if (op === OPS.nextLineShowText) { tlm = mul(tlm, [1, 0, 0, 1, 0, -leading]); tm = tlm.slice(); }
            if (op === OPS.nextLineSetSpacingShowText) { leading = -(a[1] as number); tlm = mul(tlm, [1, 0, 0, 1, 0, -leading]); tm = tlm.slice(); }
            const rm = mul(ctm, tm);
            colorEvents.push({ x: rm[4], y: rm[5], color: fill });
            const glyphs = (op === OPS.nextLineSetSpacingShowText ? a[2] : a[0]) as unknown;
            if (Array.isArray(glyphs)) {
              let adv = 0;
              for (const gl of glyphs) {
                if (typeof gl === "number") adv += (-gl / 1000) * fontSize;
                else if (gl && typeof (gl as { width?: number }).width === "number") adv += ((gl as { width: number }).width / 1000) * fontSize;
              }
              tm = mul(tm, [1, 0, 0, 1, adv, 0]);
            }
          }
        }
      } catch {
        /* non-fatal — we fall back to size-only formatting, no colour */
      }
      const colorAt = (x: number, y: number, size: number): string | undefined => {
        let best: ColorEvent | undefined;
        let bestX = -Infinity;
        for (const e of colorEvents) {
          if (Math.abs(e.y - y) <= Math.max(2, size * 0.6) && e.x <= x + 1 && e.x > bestX) { best = e; bestX = e.x; }
        }
        if (!best) for (const e of colorEvents) if (Math.abs(e.y - y) <= Math.max(2, size * 0.6)) { best = e; break; }
        const c = best?.color;
        return !c || c === "000000" ? undefined : c;
      };

      const content = await page.getTextContent();
      const styles = content.styles as Record<string, { fontFamily?: string }>;

      const fontCache = new Map<string, { bold: boolean; italic: boolean; family?: string }>();
      const fontInfo = (fontName: string) => {
        const hit = fontCache.get(fontName);
        if (hit) return hit;
        let name = "";
        try {
          if (page.commonObjs.has(fontName)) {
            const fo = page.commonObjs.get(fontName) as { name?: string; loadedName?: string } | null;
            name = fo?.name || fo?.loadedName || "";
          }
        } catch {
          /* font not resolved — ignore */
        }
        const family = styles?.[fontName]?.fontFamily;
        const probe = `${name} ${family || ""}`.toLowerCase();
        const info = {
          bold: /bold|black|heavy|semibold|demibold/.test(probe),
          italic: /italic|oblique/.test(probe),
          family: cleanFamily(name) || mapGeneric(family),
        };
        fontCache.set(fontName, info);
        return info;
      };

      type Glyph = { str: string; x: number; y: number; size: number; width: number; bold: boolean; italic: boolean; font?: string; color?: string };
      const glyphs: Glyph[] = [];
      for (const raw of content.items) {
        const it = raw as { str?: string; transform?: number[]; width?: number; height?: number; fontName?: string };
        if (typeof it.str !== "string" || it.str === "" || !it.transform) continue;
        const t = it.transform;
        const size = Math.hypot(t[2], t[3]) || it.height || 12;
        const fi = fontInfo(it.fontName || "");
        glyphs.push({ str: it.str, x: t[4], y: t[5], size, width: it.width || 0, bold: fi.bold, italic: fi.italic, font: fi.family, color: colorAt(t[4], t[5], size) });
      }
      if (glyphs.length === 0) {
        setProgress((n / doc.numPages) * 100);
        continue;
      }

      // Cluster glyphs into visual lines by their baseline (y), top → bottom.
      glyphs.sort((a, b) => b.y - a.y);
      const clusters: Glyph[][] = [];
      for (const g of glyphs) {
        const last = clusters[clusters.length - 1];
        if (last && Math.abs(last[0].y - g.y) <= Math.max(2, g.size * 0.5)) last.push(g);
        else clusters.push([g]);
      }

      // Build one cell from a group of glyphs (small gaps ⇒ spaces within the cell).
      const buildCell = (gs: Glyph[]): Cell => {
        const runs: Run[] = [];
        let prevEnd: number | null = null;
        for (const g of gs) {
          let text = g.str;
          if (prevEnd !== null && g.x - prevEnd > g.size * 0.25 && !text.startsWith(" ")) text = " " + text;
          const last = runs[runs.length - 1];
          if (last && last.bold === g.bold && last.italic === g.italic && last.font === g.font && last.color === g.color && Math.abs(last.size - g.size) < 0.5) {
            last.text += text;
          } else {
            runs.push({ text, bold: g.bold, italic: g.italic, font: g.font, color: g.color, size: g.size });
          }
          prevEnd = g.x + g.width;
        }
        return { runs, xStart: gs[0].x, xEnd: gs[gs.length - 1].x + gs[gs.length - 1].width };
      };

      clusters.forEach((cl, ci) => {
        cl.sort((a, b) => a.x - b.x);
        // Split the line into cells at column breaks. pdf.js represents a column
        // gap as a wide whitespace-only item, so those (and any raw x-gap) split.
        const cells: Cell[] = [];
        let group: Glyph[] = [];
        for (const g of cl) {
          const isSpace = g.str.trim() === "";
          if (isSpace) {
            if (g.width > g.size * 0.9 && group.length) { cells.push(buildCell(group)); group = []; }
            continue; // don't carry a column-gap space into cell text
          }
          if (group.length) {
            const prev = group[group.length - 1];
            if (g.x - (prev.x + prev.width) > g.size * 1.6) { cells.push(buildCell(group)); group = []; }
          }
          group.push(g);
        }
        if (group.length) cells.push(buildCell(group));
        if (!cells.some((c) => c.runs.some((r) => r.text.trim()))) return;

        const size = Math.max(...cl.map((g) => g.size));
        const xStart = cells[0].xStart;
        const xEnd = cells[cells.length - 1].xEnd;
        const mid = (xStart + xEnd) / 2;
        const leftM = xStart;
        const rightM = pageWidth - xEnd;
        let align: Line["align"] = "left";
        if (cells.length === 1) {
          if (Math.abs(mid - pageWidth / 2) < pageWidth * 0.06 && leftM > pageWidth * 0.12 && rightM > pageWidth * 0.12) align = "center";
          else if (rightM < pageWidth * 0.08 && leftM > pageWidth * 0.3) align = "right";
        }

        allLines.push({ cells, y: cl[0].y, size, align, newPage: n > 1 && ci === 0 });
      });

      setProgress((n / doc.numPages) * 100);
    }

    // Body font size = median line size; headings are sized relative to it.
    const sorted = allLines.map((l) => l.size).sort((a, b) => a - b);
    const bodySize = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 12;
    const halfPt = (pt: number) => Math.max(12, Math.min(160, Math.round(pt * 2)));
    const headingFor = (ratio: number): ParaOpts["heading"] =>
      ratio >= 1.8 ? HeadingLevel.HEADING_1 : ratio >= 1.4 ? HeadingLevel.HEADING_2 : ratio >= 1.2 ? HeadingLevel.HEADING_3 : undefined;
    const alignMap: Record<Line["align"], ParaOpts["alignment"]> = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
    };
    const toRuns = (runs: Run[], leadSpace = false) =>
      runs.map((r, ri) => new TextRun({
        text: (leadSpace && ri === 0 ? " " : "") + r.text,
        bold: r.bold || undefined,
        italics: r.italic || undefined,
        font: r.font,
        color: r.color,
        size: halfPt(r.size),
      }));

    const children: (InstanceType<typeof Paragraph> | InstanceType<typeof Table>)[] = [];

    // ---- Paragraph builder: merges wrapped lines, splits on gaps/headings/alignment ----
    const emitParagraphs = (lines: Line[]) => {
      let block: Line[] = [];
      let blockPageBreak = false;
      const flush = () => {
        if (block.length === 0) return;
        const first = block[0];
        const heading = headingFor(first.size / bodySize);
        const runs: InstanceType<typeof TextRun>[] = [];
        block.forEach((ln, li) => runs.push(...toRuns(ln.cells.flatMap((c) => c.runs), li > 0)));
        children.push(new Paragraph({
          children: runs,
          heading,
          alignment: alignMap[first.align],
          spacing: { after: heading ? 160 : 100 },
          pageBreakBefore: blockPageBreak || undefined,
        }));
        block = [];
      };
      for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];
        const prev = lines[i - 1];
        let brk = false;
        if (prev) {
          const gap = prev.y - ln.y;
          const headingish = ln.size / bodySize >= 1.2 || prev.size / bodySize >= 1.2;
          if (ln.newPage || gap < 0) brk = true;
          else if (gap > prev.size * 1.7) brk = true;
          else if (headingish && Math.abs(ln.size - prev.size) > 0.5) brk = true;
          else if (ln.align !== prev.align) brk = true;
        }
        if (brk) { flush(); blockPageBreak = ln.newPage; }
        block.push(ln);
      }
      flush();
    };

    // ---- Table builder: reconstructs aligned rows/columns into a Word table ----
    const border = { style: BorderStyle.SINGLE, size: 2, color: "BBBBBB" };
    const cellBorders = { top: border, bottom: border, left: border, right: border };
    const emitTable = (rows: Line[]) => {
      // Determine column positions by clustering cell start-x across all rows.
      const xs = rows.flatMap((r) => r.cells.map((c) => c.xStart)).sort((a, b) => a - b);
      const cols: number[] = [];
      for (const x of xs) {
        if (!cols.length || x - cols[cols.length - 1] > 18) cols.push(x);
        else cols[cols.length - 1] = (cols[cols.length - 1] + x) / 2;
      }
      const colOf = (x: number) => {
        let best = 0;
        for (let c = 1; c < cols.length; c++) if (Math.abs(x - cols[c]) < Math.abs(x - cols[best])) best = c;
        return best;
      };
      const tableRows = rows.map((r) => {
        const bucket: Run[][] = cols.map(() => []);
        for (const cell of r.cells) {
          const ci = colOf(cell.xStart);
          if (bucket[ci].length) bucket[ci].push({ text: " ", bold: false, italic: false, size: cell.runs[0]?.size ?? bodySize });
          bucket[ci].push(...cell.runs);
        }
        return new TableRow({
          children: bucket.map((runs) => new TableCell({
            borders: cellBorders,
            children: [new Paragraph({ children: runs.length ? toRuns(runs) : [new TextRun("")] })],
          })),
        });
      });
      children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }));
    };

    // Validate that candidate rows really form a grid (≥2 aligned columns).
    const isTable = (rows: Line[]) => {
      const xs = rows.flatMap((r) => r.cells.map((c) => c.xStart)).sort((a, b) => a - b);
      const cols: number[] = [];
      for (const x of xs) {
        if (!cols.length || x - cols[cols.length - 1] > 18) cols.push(x);
        else cols[cols.length - 1] = (cols[cols.length - 1] + x) / 2;
      }
      if (cols.length < 2 || cols.length > 12) return false;
      const clean = rows.filter((r) => {
        const used = new Set(r.cells.map((c) => {
          let best = 0;
          for (let k = 1; k < cols.length; k++) if (Math.abs(c.xStart - cols[k]) < Math.abs(c.xStart - cols[best])) best = k;
          return best;
        }));
        return used.size === r.cells.length; // no two cells collide into one column
      });
      return clean.length / rows.length >= 0.6;
    };

    // Walk lines, grouping consecutive multi-cell aligned rows into tables.
    let paraRun: Line[] = [];
    let i = 0;
    while (i < allLines.length) {
      if (allLines[i].cells.length >= 2) {
        let j = i + 1;
        while (j < allLines.length && allLines[j].cells.length >= 2) {
          const gap = allLines[j - 1].y - allLines[j].y;
          if (allLines[j].newPage || gap < 0 || gap > allLines[j - 1].size * 2.5) break;
          j++;
        }
        if (j - i >= 2 && isTable(allLines.slice(i, j))) {
          if (paraRun.length) { emitParagraphs(paraRun); paraRun = []; }
          emitTable(allLines.slice(i, j));
          i = j;
          continue;
        }
      }
      paraRun.push(allLines[i]);
      i++;
    }
    if (paraRun.length) emitParagraphs(paraRun);

    if (children.length === 0) {
      children.push(new Paragraph({ children: [new TextRun("(No extractable text found — this PDF may be scanned images.)")] }));
    }

    const out = new Document({
      sections: [
        {
          properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
          children,
        },
      ],
    });
    const blob = await Packer.toBlob(out);
    setResult({ blob, name: f.name.replace(/\.pdf$/i, "") + ".docx" });
  };

  // ---- Word → PDF: mammoth → HTML, render block elements with jsPDF text ----
  const wordToPdf = async (f: File) => {
    const mammoth = await import("mammoth");
    const { jsPDF } = await import("jspdf");
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await f.arrayBuffer() });

    const dom = new DOMParser().parseFromString(html, "text/html");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 56;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const write = (text: string, size: number, bold: boolean, indent = 0) => {
      if (!text.trim()) return;
      pdf.setFont("helvetica", bold ? "bold" : "normal");
      pdf.setFontSize(size);
      const lines = pdf.splitTextToSize(text, maxWidth - indent);
      for (const ln of lines) {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(ln, margin + indent, y);
        y += size * 1.4;
      }
      y += size * 0.5;
    };

    const blocks = dom.body.querySelectorAll("h1, h2, h3, h4, p, li");
    if (blocks.length === 0) write(dom.body.textContent || "", 12, false);
    blocks.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const text = (el.textContent || "").replace(/\s+/g, " ");
      if (tag === "h1") write(text, 20, true);
      else if (tag === "h2") write(text, 16, true);
      else if (tag === "h3" || tag === "h4") write(text, 13, true);
      else if (tag === "li") write("•  " + text, 12, false, 14);
      else write(text, 12, false);
    });

    const blob = pdf.output("blob");
    setResult({ blob, name: f.name.replace(/\.(docx?|rtf)$/i, "") + ".pdf" });
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      if (dir === "pdf2word") await pdfToWord(file);
      else await wordToPdf(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed. Please check the file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Tab active={dir === "pdf2word"} onClick={() => switchDir("pdf2word")} label="PDF → Word" />
        <Tab active={dir === "word2pdf"} onClick={() => switchDir("word2pdf")} label="Word → PDF" />
      </div>

      {!file && (
        <FileDropzone
          accept={dir === "pdf2word" ? "application/pdf" : ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
          onFiles={onFiles}
          icon="📝"
          label={dir === "pdf2word" ? "Drop a PDF" : "Drop a Word (.docx) file"}
          hint={dir === "pdf2word" ? "Text is extracted into an editable .docx" : "Converted to a PDF document"}
        />
      )}

      {file && (
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {file.type === "application/pdf" && <PdfThumbnail file={file} width={48} />}
              <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>
          {busy ? <ProgressIndicator value={dir === "pdf2word" ? progress : undefined} label="Converting…" /> : (
            <button className="btn btn-primary" onClick={run}>Convert to {dir === "pdf2word" ? "Word" : "PDF"}</button>
          )}
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && (
        <ResultCard
          title="Conversion complete"
          stats={[{ label: "Output", value: result.name.split(".").pop()?.toUpperCase() || "" }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel={`Download ${result.name.split(".").pop()?.toUpperCase()}`}
          onReset={reset}
        />
      )}
    </div>
  );
}

function Tab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm font-semibold"
      style={{ background: active ? "var(--brand)" : "var(--surface-2)", color: active ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
    >
      {label}
    </button>
  );
}
