"use client";

import { useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob } from "@/lib/format";

type Frame = { time: number; url: string; blob: Blob };

export default function VideoFrameExtractor() {
  const [src, setSrc] = useState<string | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [interval, setInterval] = useState(1);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reset = () => {
    frames.forEach((f) => URL.revokeObjectURL(f.url));
    if (src) URL.revokeObjectURL(src);
    setSrc(null);
    setFrames([]);
    setError(null);
    setProgress(0);
  };

  const onFiles = (files: File[]) => {
    reset();
    setSrc(URL.createObjectURL(files[0]));
  };

  const grab = async (time: number): Promise<Frame | null> => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
    return { time, url: URL.createObjectURL(blob), blob };
  };

  const seekTo = (time: number): Promise<void> =>
    new Promise((resolve) => {
      const video = videoRef.current!;
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        resolve();
      };
      video.addEventListener("seeked", onSeeked);
      video.currentTime = Math.min(time, video.duration - 0.01);
    });

  const captureCurrent = async () => {
    const video = videoRef.current;
    if (!video) return;
    const f = await grab(video.currentTime);
    if (f) setFrames((prev) => [...prev, f].sort((a, b) => a.time - b.time));
  };

  const captureInterval = async () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    if (interval <= 0) return;
    setBusy(true);
    setError(null);
    try {
      const out: Frame[] = [];
      const wasPaused = video.paused;
      video.pause();
      const count = Math.floor(video.duration / interval) + 1;
      let done = 0;
      for (let t = 0; t < video.duration; t += interval) {
        await seekTo(t);
        const f = await grab(t);
        if (f) out.push(f);
        done++;
        setProgress((done / count) * 100);
        if (out.length > 500) break; // safety cap
      }
      setFrames(out);
      if (!wasPaused) video.play();
    } catch {
      setError("Could not extract frames from this video.");
    } finally {
      setBusy(false);
    }
  };

  const downloadAll = async () => {
    if (frames.length === 1) return downloadBlob(frames[0].blob, `frame-${frames[0].time.toFixed(2)}s.jpg`);
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    frames.forEach((f, i) => zip.file(`frame-${String(i + 1).padStart(3, "0")}-${f.time.toFixed(2)}s.jpg`, f.blob));
    downloadBlob(await zip.generateAsync({ type: "blob" }), "frames.zip");
  };

  return (
    <div className="space-y-4">
      {!src && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="🎞️" label="Drop a video file" hint="MP4, WebM, MOV — played locally in your browser" />
      )}

      {src && (
        <div className="card p-4">
          <video ref={videoRef} src={src} controls className="w-full rounded-lg" style={{ maxHeight: 360, background: "#000" }} />

          <div className="mt-4 flex flex-wrap items-end gap-3">
            <button className="btn btn-primary" onClick={captureCurrent} disabled={busy}>📸 Capture current frame</button>
            <div className="flex items-end gap-2">
              <div>
                <label className="label" htmlFor="int">Every (seconds)</label>
                <input id="int" type="number" min={0.1} step={0.1} className="input w-28" value={interval} onChange={(e) => setInterval(parseFloat(e.target.value) || 1)} />
              </div>
              <button className="btn btn-secondary" onClick={captureInterval} disabled={busy}>Extract at interval</button>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change video</button>
          </div>

          {busy && <div className="mt-4"><ProgressIndicator value={progress} label="Extracting frames…" /></div>}
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {frames.length > 0 && (
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">{frames.length} frame{frames.length === 1 ? "" : "s"} captured</p>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={downloadAll}>⬇ Download {frames.length > 1 ? "all (ZIP)" : "JPG"}</button>
              <button className="btn btn-secondary" onClick={() => { frames.forEach((f) => URL.revokeObjectURL(f.url)); setFrames([]); }}>Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {frames.map((f, i) => (
              <button key={i} onClick={() => downloadBlob(f.blob, `frame-${f.time.toFixed(2)}s.jpg`)} className="group relative overflow-hidden rounded-lg" title="Download this frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={`Frame at ${f.time.toFixed(2)}s`} className="aspect-video w-full object-cover" />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">{f.time.toFixed(2)}s</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
