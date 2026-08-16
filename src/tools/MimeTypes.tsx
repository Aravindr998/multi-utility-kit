"use client";

import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

type Row = { ext: string; mime: string; name: string };

const TYPES: Row[] = [
  { ext: ".html", mime: "text/html", name: "HTML document" },
  { ext: ".css", mime: "text/css", name: "Cascading style sheet" },
  { ext: ".js", mime: "text/javascript", name: "JavaScript" },
  { ext: ".mjs", mime: "text/javascript", name: "ES module" },
  { ext: ".json", mime: "application/json", name: "JSON" },
  { ext: ".xml", mime: "application/xml", name: "XML" },
  { ext: ".csv", mime: "text/csv", name: "Comma-separated values" },
  { ext: ".txt", mime: "text/plain", name: "Plain text" },
  { ext: ".pdf", mime: "application/pdf", name: "PDF document" },
  { ext: ".zip", mime: "application/zip", name: "ZIP archive" },
  { ext: ".gz", mime: "application/gzip", name: "Gzip archive" },
  { ext: ".tar", mime: "application/x-tar", name: "Tar archive" },
  { ext: ".doc", mime: "application/msword", name: "Word (legacy)" },
  { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", name: "Word document" },
  { ext: ".xls", mime: "application/vnd.ms-excel", name: "Excel (legacy)" },
  { ext: ".xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name: "Excel spreadsheet" },
  { ext: ".ppt", mime: "application/vnd.ms-powerpoint", name: "PowerPoint (legacy)" },
  { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", name: "PowerPoint" },
  { ext: ".png", mime: "image/png", name: "PNG image" },
  { ext: ".jpg", mime: "image/jpeg", name: "JPEG image" },
  { ext: ".gif", mime: "image/gif", name: "GIF image" },
  { ext: ".webp", mime: "image/webp", name: "WebP image" },
  { ext: ".svg", mime: "image/svg+xml", name: "SVG vector image" },
  { ext: ".ico", mime: "image/vnd.microsoft.icon", name: "Icon" },
  { ext: ".avif", mime: "image/avif", name: "AVIF image" },
  { ext: ".heic", mime: "image/heic", name: "HEIC image" },
  { ext: ".mp3", mime: "audio/mpeg", name: "MP3 audio" },
  { ext: ".wav", mime: "audio/wav", name: "WAV audio" },
  { ext: ".ogg", mime: "audio/ogg", name: "Ogg audio" },
  { ext: ".mp4", mime: "video/mp4", name: "MP4 video" },
  { ext: ".webm", mime: "video/webm", name: "WebM video" },
  { ext: ".mov", mime: "video/quicktime", name: "QuickTime video" },
  { ext: ".woff", mime: "font/woff", name: "Web font" },
  { ext: ".woff2", mime: "font/woff2", name: "Web font 2" },
  { ext: ".ttf", mime: "font/ttf", name: "TrueType font" },
  { ext: ".wasm", mime: "application/wasm", name: "WebAssembly" },
  { ext: ".bin", mime: "application/octet-stream", name: "Arbitrary binary data" },
  { ext: ".form", mime: "application/x-www-form-urlencoded", name: "URL-encoded form" },
  { ext: ".multipart", mime: "multipart/form-data", name: "Multipart form" },
];

export default function MimeTypes() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return TYPES;
    return TYPES.filter((t) => t.ext.includes(query) || t.mime.toLowerCase().includes(query) || t.name.toLowerCase().includes(query));
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by extension, MIME type or name…" />
      </div>

      <div className="card p-0">
        <div className="scroll-thin max-h-[560px] overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0" style={{ background: "var(--surface-2)" }}>
              <tr>
                <th className="px-4 py-2 font-semibold">Extension</th>
                <th className="px-4 py-2 font-semibold">MIME type</th>
                <th className="px-4 py-2 font-semibold">Description</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.ext + t.mime} className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td className="px-4 py-2 font-mono">{t.ext}</td>
                  <td className="px-4 py-2 font-mono text-[var(--brand)]">{t.mime}</td>
                  <td className="px-4 py-2 text-[var(--muted)]">{t.name}</td>
                  <td className="px-2 py-2 text-right"><CopyButton value={t.mime} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="p-4 text-sm text-[var(--muted)]">No MIME types match “{q}”.</p>}
      </div>
    </div>
  );
}
