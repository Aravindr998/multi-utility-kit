"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";

type Fmt = "CODE128" | "CODE39" | "EAN13" | "EAN8" | "UPC" | "ITF14" | "MSI" | "codabar";

const FORMATS: { value: Fmt; label: string; hint: string }[] = [
  { value: "CODE128", label: "Code 128", hint: "Any ASCII text/numbers" },
  { value: "CODE39", label: "Code 39", hint: "Uppercase, digits, - . $ / + %" },
  { value: "EAN13", label: "EAN-13", hint: "Exactly 12–13 digits" },
  { value: "EAN8", label: "EAN-8", hint: "Exactly 7–8 digits" },
  { value: "UPC", label: "UPC-A", hint: "Exactly 11–12 digits" },
  { value: "ITF14", label: "ITF-14", hint: "Exactly 13–14 digits" },
  { value: "MSI", label: "MSI", hint: "Digits only" },
  { value: "codabar", label: "Codabar", hint: "Digits and - $ : / . +" },
];

export default function BarcodeGenerator() {
  const [format, setFormat] = useState<Fmt>("CODE128");
  const [value, setValue] = useState("UtilityHub-123");
  const [displayValue, setDisplayValue] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    setError(null);
    if (!value) { svgRef.current.innerHTML = ""; return; }
    try {
      JsBarcode(svgRef.current, value, {
        format,
        displayValue,
        lineColor: "#111827",
        background: "#ffffff",
        width: 2,
        height: 90,
        margin: 12,
        fontSize: 16,
      });
    } catch {
      svgRef.current.innerHTML = "";
      setError(`"${value}" isn't valid for ${format}. Expected: ${FORMATS.find((f) => f.value === format)!.hint}.`);
    }
  }, [format, value, displayValue]);

  const download = (type: "svg" | "png") => {
    const svg = svgRef.current;
    if (!svg || svg.childNodes.length === 0) return;
    const source = new XMLSerializer().serializeToString(svg);
    if (type === "svg") {
      triggerDownload(new Blob([source], { type: "image/svg+xml" }), `barcode.svg`);
      return;
    }
    const img = new Image();
    const svgUrl = URL.createObjectURL(new Blob([source], { type: "image/svg+xml" }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);
      canvas.toBlob((b) => b && triggerDownload(b, "barcode.png"));
    };
    img.src = svgUrl;
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <label className="label">Barcode type</label>
        <select className="input" value={format} onChange={(e) => setFormat(e.target.value as Fmt)}>
          {FORMATS.map((f) => <option key={f.value} value={f.value}>{f.label} — {f.hint}</option>)}
        </select>

        <label className="label mt-4">Value</label>
        <input className="input font-mono" value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} placeholder="Text or number to encode" />

        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" checked={displayValue} onChange={(e) => setDisplayValue(e.target.checked)} className="accent-[var(--brand)]" />
          Show value under the bars
        </label>
      </div>

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      <div className="card p-4">
        <div className="grid place-items-center overflow-x-auto rounded-lg p-4" style={{ background: "#ffffff" }}>
          <svg ref={svgRef} />
        </div>
        {!error && value && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={() => download("png")}>⬇ Download PNG</button>
            <button className="btn btn-secondary" onClick={() => download("svg")}>⬇ Download SVG</button>
          </div>
        )}
      </div>
    </div>
  );
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
