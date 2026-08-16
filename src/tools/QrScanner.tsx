"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import FileDropzone from "@/components/FileDropzone";
import CopyButton from "@/components/CopyButton";

function decodeImage(img: HTMLImageElement): string | null {
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return jsQR(data.data, canvas.width, canvas.height)?.data ?? null;
}

export default function QrScanner() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  };

  useEffect(() => () => stopCamera(), []);

  const onFiles = (files: File[]) => {
    setError(null);
    setResult(null);
    const url = URL.createObjectURL(files[0]);
    const img = new Image();
    img.onload = () => {
      const text = decodeImage(img);
      URL.revokeObjectURL(url);
      if (text) setResult(text);
      else setError("No QR code found in that image. Try a clearer or more zoomed-in photo.");
    };
    img.onerror = () => { URL.revokeObjectURL(url); setError("Couldn't read that image file."); };
    img.src = url;
  };

  const startCamera = async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setScanning(true);
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      const canvas = document.createElement("canvas");
      const tick = () => {
        if (!streamRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(video, 0, 0);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(data.data, canvas.width, canvas.height);
          if (code) { setResult(code.data); stopCamera(); return; }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Couldn't access the camera. Grant permission or use the image upload instead.");
      setScanning(false);
    }
  };

  const isUrl = result && /^https?:\/\//i.test(result);

  return (
    <div className="space-y-4">
      {!scanning && (
        <div className="card p-4">
          <FileDropzone accept="image/*" onFiles={onFiles} icon="📷" label="Drop a QR code image" hint="PNG, JPG, WebP · decoded locally in your browser" />
          <div className="mt-3 text-center">
            <button className="btn btn-secondary" onClick={startCamera}>Scan with camera</button>
          </div>
        </div>
      )}

      {scanning && (
        <div className="card p-4">
          <video ref={videoRef} className="mx-auto max-h-96 w-full rounded-lg bg-black" playsInline muted />
          <div className="mt-3 text-center">
            <button className="btn btn-secondary" onClick={stopCamera}>Stop camera</button>
            <p className="mt-2 text-xs text-[var(--muted)]">Point your camera at a QR code…</p>
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && (
        <div className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">Decoded content</span>
            <CopyButton value={result} />
          </div>
          <p className="break-all rounded-lg p-3 font-mono text-sm" style={{ background: "var(--surface-2)" }}>{result}</p>
          {isUrl && (
            <a href={result} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 inline-block text-sm text-[var(--brand)] underline">Open link ↗</a>
          )}
        </div>
      )}
    </div>
  );
}
