"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import { parseExif, type ExifResult } from "@/lib/exif";
import { formatBytes } from "@/lib/format";

type FileInfo = { name: string; size: number; type: string; width?: number; height?: number };

export default function ExifViewer() {
  const [info, setInfo] = useState<FileInfo | null>(null);
  const [exif, setExif] = useState<ExifResult | null>(null);
  const [hasExif, setHasExif] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFiles = async (files: File[]) => {
    const file = files[0];
    setError(null);
    setExif(null);
    setHasExif(false);
    const fi: FileInfo = { name: file.name, size: file.size, type: file.type || "unknown" };

    // Pixel dimensions straight from the decoder (works for any format).
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.src = url;
      await img.decode();
      fi.width = img.naturalWidth;
      fi.height = img.naturalHeight;
      URL.revokeObjectURL(url);
    } catch {
      /* non-decodable preview is fine; still show file info */
    }
    setInfo(fi);

    try {
      const result = parseExif(await file.arrayBuffer());
      if (result && Object.keys(result.tags).length > 0) {
        setExif(result);
        setHasExif(true);
      }
    } catch {
      setError("Could not parse metadata from this file.");
    }
  };

  const reset = () => {
    setInfo(null);
    setExif(null);
    setHasExif(false);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {!info && (
        <FileDropzone accept="image/*,.heic,.heif" onFiles={onFiles} icon="🔍" label="Drop a photo to inspect its metadata" hint="EXIF is read from JPEGs (from cameras & phones)" />
      )}

      {info && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{info.name}</p>
            <button className="btn btn-secondary" onClick={reset}>Inspect another</button>
          </div>

          <h3 className="mb-2 text-sm font-semibold text-[var(--muted)]">File</h3>
          <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Row label="Type" value={info.type} />
            <Row label="File size" value={formatBytes(info.size)} />
            {info.width && info.height && <Row label="Dimensions" value={`${info.width} × ${info.height}`} />}
          </dl>

          {hasExif && exif ? (
            <>
              <h3 className="mb-2 mt-5 text-sm font-semibold text-[var(--muted)]">EXIF metadata</h3>
              <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {Object.entries(exif.tags).map(([k, v]) => (
                  <Row key={k} label={k} value={v} />
                ))}
              </dl>
              {exif.gps && (
                <a
                  href={`https://www.openstreetmap.org/?mlat=${exif.gps.lat}&mlon=${exif.gps.lon}#map=15/${exif.gps.lat}/${exif.gps.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary mt-4 inline-flex"
                >
                  📍 View location on map
                </a>
              )}
            </>
          ) : (
            <p className="mt-5 rounded-lg p-3 text-sm text-[var(--muted)]" style={{ background: "var(--surface-2)" }}>
              No EXIF metadata found. This is normal for PNG, WebP, screenshots, and images that have been edited or exported by apps that strip metadata.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg p-3" style={{ background: "var(--surface-2)" }}>
      <dt className="text-xs text-[var(--muted)]">{label}</dt>
      <dd className="mt-0.5 break-words font-medium">{value}</dd>
    </div>
  );
}
