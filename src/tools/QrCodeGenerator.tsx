"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { downloadBlob } from "@/lib/format";

type Mode = "url" | "text" | "wifi" | "vcard";
type DotStyle = "square" | "rounded" | "dots" | "classy";
type EyeStyle = "square" | "rounded" | "circle";

const DOT_STYLES: { id: DotStyle; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "dots", label: "Dots" },
  { id: "classy", label: "Classy" },
];
const EYE_STYLES: { id: EyeStyle; label: string }[] = [
  { id: "square", label: "Square" },
  { id: "rounded", label: "Rounded" },
  { id: "circle", label: "Circle" },
];

function escapeWifi(s: string) {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

// Round to 2 decimals to keep generated path strings compact.
const n = (v: number) => Math.round(v * 100) / 100;

function rectPath(x: number, y: number, w: number, h: number) {
  return `M${n(x)},${n(y)}h${n(w)}v${n(h)}h${n(-w)}z`;
}

function circlePath(cx: number, cy: number, r: number) {
  return `M${n(cx - r)},${n(cy)}a${n(r)},${n(r)} 0 1 0 ${n(r * 2)},0a${n(r)},${n(r)} 0 1 0 ${n(-r * 2)},0z`;
}

function roundRectPath(x: number, y: number, w: number, h: number, r: number) {
  r = Math.min(r, w / 2, h / 2);
  return (
    `M${n(x + r)},${n(y)}h${n(w - 2 * r)}a${n(r)},${n(r)} 0 0 1 ${n(r)},${n(r)}` +
    `v${n(h - 2 * r)}a${n(r)},${n(r)} 0 0 1 ${n(-r)},${n(r)}` +
    `h${n(-(w - 2 * r))}a${n(r)},${n(r)} 0 0 1 ${n(-r)},${n(-r)}` +
    `v${n(-(h - 2 * r))}a${n(r)},${n(r)} 0 0 1 ${n(r)},${n(-r)}z`
  );
}

// Per-corner rounded rect (radii clockwise from top-left) for neighbor-aware modules.
function cornerRectPath(x: number, y: number, s: number, tl: number, tr: number, br: number, bl: number) {
  return (
    `M${n(x + tl)},${n(y)}` +
    `h${n(s - tl - tr)}${tr ? `a${n(tr)},${n(tr)} 0 0 1 ${n(tr)},${n(tr)}` : ""}` +
    `v${n(s - tr - br)}${br ? `a${n(br)},${n(br)} 0 0 1 ${n(-br)},${n(br)}` : ""}` +
    `h${n(-(s - br - bl))}${bl ? `a${n(bl)},${n(bl)} 0 0 1 ${n(-bl)},${n(-bl)}` : ""}` +
    `v${n(-(s - bl - tl))}${tl ? `a${n(tl)},${n(tl)} 0 0 1 ${n(tl)},${n(-tl)}` : ""}z`
  );
}

function isFinder(row: number, col: number, size: number) {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

type Matrix = { size: number; get: (r: number, c: number) => number };

// Build fill path (data modules + eye pips, nonzero) and frame path (eye rings, evenodd).
function buildPaths(m: Matrix, opts: { ppm: number; off: number; dotStyle: DotStyle; eyeStyle: EyeStyle }) {
  const { ppm, off, dotStyle, eyeStyle } = opts;
  const { size, get } = m;
  const on = (r: number, c: number) => (r < 0 || c < 0 || r >= size || c >= size ? 0 : get(r, c));

  let fill = "";
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!get(row, col) || isFinder(row, col, size)) continue;
      const x = off + col * ppm;
      const y = off + row * ppm;
      if (dotStyle === "square") {
        fill += rectPath(x, y, ppm, ppm);
      } else if (dotStyle === "dots") {
        fill += circlePath(x + ppm / 2, y + ppm / 2, ppm * 0.45);
      } else if (dotStyle === "classy") {
        const g = ppm * 0.1;
        fill += roundRectPath(x + g, y + g, ppm - 2 * g, ppm - 2 * g, (ppm - 2 * g) * 0.35);
      } else {
        // rounded: round a corner only when both adjacent neighbours are empty.
        const r = ppm * 0.5;
        const tl = !on(row - 1, col) && !on(row, col - 1) ? r : 0;
        const tr = !on(row - 1, col) && !on(row, col + 1) ? r : 0;
        const br = !on(row + 1, col) && !on(row, col + 1) ? r : 0;
        const bl = !on(row + 1, col) && !on(row, col - 1) ? r : 0;
        fill += cornerRectPath(x, y, ppm, tl, tr, br, bl);
      }
    }
  }

  let frame = "";
  const eyes: [number, number][] = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
  for (const [fr, fc] of eyes) {
    const x = off + fc * ppm;
    const y = off + fr * ppm;
    const u = ppm;
    if (eyeStyle === "circle") {
      const cx = x + 3.5 * u;
      const cy = y + 3.5 * u;
      frame += circlePath(cx, cy, 3.5 * u) + circlePath(cx, cy, 2.5 * u);
      fill += circlePath(cx, cy, 1.5 * u);
    } else if (eyeStyle === "rounded") {
      frame += roundRectPath(x, y, 7 * u, 7 * u, 1.75 * u) + roundRectPath(x + u, y + u, 5 * u, 5 * u, 1.1 * u);
      fill += roundRectPath(x + 2 * u, y + 2 * u, 3 * u, 3 * u, 0.7 * u);
    } else {
      frame += rectPath(x, y, 7 * u, 7 * u) + rectPath(x + u, y + u, 5 * u, 5 * u);
      fill += rectPath(x + 2 * u, y + 2 * u, 3 * u, 3 * u);
    }
  }

  return { fill, frame };
}

const CANVAS_SIZE = 1024;
const QUIET = 4; // quiet-zone modules

export default function QrCodeGenerator() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("https://");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [vcard, setVcard] = useState({ name: "", phone: "", email: "", org: "" });
  const [fg, setFg] = useState("#0f172a");
  const [bg, setBg] = useState("#ffffff");
  const [dotStyle, setDotStyle] = useState<DotStyle>("square");
  const [eyeStyle, setEyeStyle] = useState<EyeStyle>("square");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoImg, setLogoImg] = useState<HTMLImageElement | null>(null);
  const [logoSize, setLogoSize] = useState(22); // percent of QR width
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const payload = useMemo(() => {
    switch (mode) {
      case "url":
        return url.trim();
      case "text":
        return text;
      case "wifi":
        return wifi.ssid
          ? `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};P:${escapeWifi(wifi.password)};${wifi.hidden ? "H:true;" : ""};`
          : "";
      case "vcard":
        return vcard.name || vcard.phone || vcard.email
          ? `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nORG:${vcard.org}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nEND:VCARD`
          : "";
    }
  }, [mode, url, text, wifi, vcard]);

  // Build the matrix + shared paths. Logo present ⇒ high error correction so the
  // covered modules can be reconstructed. Derived inline so the React Compiler
  // memoizes it; `error`/`ready` fall out of the result with no extra state.
  const build = (() => {
    if (!payload) return null;
    try {
      const qr = QRCode.create(payload, { errorCorrectionLevel: logoImg ? "H" : "M" });
      const size = qr.modules.size;
      const ppm = CANVAS_SIZE / (size + QUIET * 2);
      const off = QUIET * ppm;
      const m: Matrix = { size, get: (r, c) => qr.modules.get(r, c) };
      return { ...buildPaths(m, { ppm, off, dotStyle, eyeStyle }), size };
    } catch {
      return "error" as const;
    }
  })();
  const error = build === "error" ? "This content is too long for a QR code." : null;
  const ready = !!build && build !== "error";

  // Draw preview / PNG source. Pure canvas (external DOM) sync — no React state.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!build || build === "error") {
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      return;
    }

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = fg;
    ctx.fill(new Path2D(build.fill));
    ctx.fill(new Path2D(build.frame), "evenodd");

    if (logoImg) {
      const box = (logoSize / 100) * CANVAS_SIZE;
      const pad = box * 0.12;
      const bx = (CANVAS_SIZE - box) / 2;
      const inner = box - pad * 2;
      const scale = Math.min(inner / logoImg.width, inner / logoImg.height);
      const iw = logoImg.width * scale;
      const ih = logoImg.height * scale;
      ctx.fillStyle = bg;
      const r = box * 0.18;
      ctx.fill(new Path2D(roundRectPath(bx, bx, box, box, r)));
      ctx.drawImage(logoImg, (CANVAS_SIZE - iw) / 2, (CANVAS_SIZE - ih) / 2, iw, ih);
    }
  }, [build, fg, bg, logoImg, logoSize]);

  const onLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Decode into an <img> before storing so the draw effect can use it.
      const img = new Image();
      img.onload = () => {
        setLogoUrl(dataUrl);
        setLogoImg(img);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removeLogo = () => {
    setLogoUrl("");
    setLogoImg(null);
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, "qr-code.png");
    }, "image/png");
  };

  const downloadSvg = () => {
    if (!build || build === "error") return;
    let logoMarkup = "";
    if (logoImg) {
      const box = (logoSize / 100) * CANVAS_SIZE;
      const pad = box * 0.12;
      const bx = (CANVAS_SIZE - box) / 2;
      const inner = box - pad * 2;
      const scale = Math.min(inner / logoImg.width, inner / logoImg.height);
      const iw = logoImg.width * scale;
      const ih = logoImg.height * scale;
      logoMarkup =
        `<path d="${roundRectPath(bx, bx, box, box, box * 0.18)}" fill="${bg}"/>` +
        `<image href="${logoUrl}" x="${n((CANVAS_SIZE - iw) / 2)}" y="${n((CANVAS_SIZE - ih) / 2)}" width="${n(iw)}" height="${n(ih)}"/>`;
    }
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}">` +
      `<rect width="${CANVAS_SIZE}" height="${CANVAS_SIZE}" fill="${bg}"/>` +
      `<path d="${build.fill}" fill="${fg}"/>` +
      `<path d="${build.frame}" fill="${fg}" fill-rule="evenodd"/>` +
      logoMarkup +
      `</svg>`;
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["url", "text", "wifi", "vcard"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="rounded-lg px-3 py-2 text-sm font-semibold uppercase"
              style={{ background: mode === m ? "var(--brand)" : "var(--surface-2)", color: mode === m ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
            >
              {m === "vcard" ? "vCard" : m}
            </button>
          ))}
        </div>

        {mode === "url" && (
          <div>
            <label className="label">Website URL</label>
            <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
        )}
        {mode === "text" && (
          <div>
            <label className="label">Text</label>
            <textarea className="input scroll-thin" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text to encode" />
          </div>
        )}
        {mode === "wifi" && (
          <div className="space-y-3">
            <div>
              <label className="label">Network name (SSID)</label>
              <input className="input" value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} />
            </div>
            <div>
              <label className="label">Security</label>
              <select className="input" value={wifi.encryption} onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={wifi.hidden} onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })} className="accent-[var(--brand)]" />
              Hidden network
            </label>
          </div>
        )}
        {mode === "vcard" && (
          <div className="space-y-3">
            <div><label className="label">Full name</label><input className="input" value={vcard.name} onChange={(e) => setVcard({ ...vcard, name: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} /></div>
            <div><label className="label">Organization</label><input className="input" value={vcard.org} onChange={(e) => setVcard({ ...vcard, org: e.target.value })} /></div>
          </div>
        )}

        <div>
          <label className="label">QR style</label>
          <div className="flex flex-wrap gap-2">
            {DOT_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setDotStyle(s.id)}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{ background: dotStyle === s.id ? "var(--brand)" : "var(--surface-2)", color: dotStyle === s.id ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Corner (eye) style</label>
          <div className="flex flex-wrap gap-2">
            {EYE_STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setEyeStyle(s.id)}
                className="rounded-lg px-3 py-2 text-sm font-medium"
                style={{ background: eyeStyle === s.id ? "var(--brand)" : "var(--surface-2)", color: eyeStyle === s.id ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Foreground</label>
            <input type="color" className="h-10 w-full rounded-lg" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
          <div>
            <label className="label">Background</label>
            <input type="color" className="h-10 w-full rounded-lg" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Center image (optional)</label>
          {logoUrl ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Logo preview" className="h-12 w-12 rounded-lg object-contain card p-1" />
                <button className="btn btn-secondary" onClick={removeLogo}>Remove image</button>
              </div>
              <div>
                <label className="label">Image size: {logoSize}%</label>
                <input
                  type="range"
                  min={10}
                  max={30}
                  value={logoSize}
                  onChange={(e) => setLogoSize(Number(e.target.value))}
                  className="w-full accent-[var(--brand)]"
                />
              </div>
            </div>
          ) : (
            <label className="btn btn-secondary inline-flex cursor-pointer">
              ⬆ Upload image
              <input type="file" accept="image/*" onChange={onLogoFile} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="grid aspect-square w-full max-w-xs place-items-center rounded-xl p-4 card">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="h-full w-full object-contain"
            style={{ display: ready ? "block" : "none" }}
          />
          {!ready && (
            <p className="text-center text-sm text-[var(--muted)]">{error || "Enter details to generate your QR code"}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={downloadPng} disabled={!ready}>⬇ PNG</button>
          <button className="btn btn-secondary" onClick={downloadSvg} disabled={!ready}>⬇ SVG</button>
        </div>
      </div>
    </div>
  );
}
