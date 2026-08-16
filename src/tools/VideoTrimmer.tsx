"use client";

import { useEffect, useRef, useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, baseName, parseTime, formatDuration } from "@/lib/audio";

const LOAD_HINT = "Loading video engine (first run downloads ~32 MB)…";

function extOf(name: string): string {
  return name.match(/\.[a-z0-9]+$/i)?.[0] || ".mp4";
}

export default function VideoTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState("0:00");
  const [end, setEnd] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState("");
  const [progress, setProgress] = useState<number | undefined>(undefined);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const reset = () => {
    setFile(null);
    if (url) URL.revokeObjectURL(url);
    setUrl(null);
    setDuration(0);
    setStart("0:00");
    setEnd("");
    setResult(null);
    setError(null);
    setProgress(undefined);
    setStage("");
  };

  const onFiles = (files: File[]) => {
    if (url) URL.revokeObjectURL(url);
    setFile(files[0]);
    setUrl(URL.createObjectURL(files[0]));
    setDuration(0);
    setStart("0:00");
    setEnd("");
    setResult(null);
    setError(null);
  };

  const trim = async () => {
    if (!file) return;
    const s = parseTime(start);
    const e = parseTime(end);
    if (isNaN(s) || isNaN(e)) {
      setError("Enter valid times like 0:15 or 1:05.");
      return;
    }
    if (e <= s) {
      setError("The end time must be after the start time.");
      return;
    }
    if (duration && e > duration + 0.5) {
      setError(`The end time can't be past the clip length (${formatDuration(duration)}).`);
      return;
    }

    setBusy(true);
    setError(null);
    setResult(null);
    setProgress(undefined);
    const ext = extOf(file.name);
    try {
      setStage(LOAD_HINT);
      const blob = await runFfmpeg(
        [file],
        `output${ext}`,
        file.type || "video/mp4",
        (inputs, output) => [
          "-ss", String(s),
          "-i", inputs[0],
          "-t", String(e - s),
          "-c", "copy",
          output,
        ],
        (p) => {
          setStage("Trimming…");
          setProgress(p);
        },
      );
      setResult({ blob, name: `${baseName(file.name)}-trimmed${ext}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trimming failed. Please try another file.");
    } finally {
      setBusy(false);
      setStage("");
    }
  };

  const setStartToPlayhead = () => {
    if (videoRef.current) setStart(formatDuration(videoRef.current.currentTime));
  };
  const setEndToPlayhead = () => {
    if (videoRef.current) setEnd(formatDuration(videoRef.current.currentTime));
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="video/*" onFiles={onFiles} icon="✂️" label="Drop a video to trim" hint="MP4, WebM, MOV · processed locally" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-medium">{file.name} <span className="text-[var(--muted)]">· {formatBytes(file.size)}</span></p>
            <button className="btn btn-secondary" onClick={reset} disabled={busy}>Change</button>
          </div>

          {url && (
            <video
              ref={videoRef}
              src={url}
              controls
              className="mb-4 max-h-80 w-full rounded-lg bg-black"
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (isFinite(d)) {
                  setDuration(d);
                  setEnd(formatDuration(d));
                }
              }}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Start time</label>
              <div className="flex gap-2">
                <input className="input flex-1" value={start} onChange={(e) => setStart(e.target.value)} placeholder="0:00" disabled={busy} />
                <button className="btn btn-secondary" onClick={setStartToPlayhead} disabled={busy} title="Use current playback position">Set</button>
              </div>
            </div>
            <div>
              <label className="label">End time</label>
              <div className="flex gap-2">
                <input className="input flex-1" value={end} onChange={(e) => setEnd(e.target.value)} placeholder={duration ? formatDuration(duration) : "1:00"} disabled={busy} />
                <button className="btn btn-secondary" onClick={setEndToPlayhead} disabled={busy} title="Use current playback position">Set</button>
              </div>
            </div>
          </div>
          {duration > 0 && (
            <p className="mt-2 text-xs text-[var(--muted)]">
              Clip length: {formatDuration(duration)}. Tip: play the video, then use “Set” to capture the current position.
            </p>
          )}

          <div className="mt-4">
            {busy ? <ProgressIndicator value={progress} label={stage || "Working…"} /> : <button className="btn btn-primary" onClick={trim}>Trim video</button>}
          </div>
        </div>
      )}

      {error && <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>}

      {result && (
        <ResultCard
          title="Trimmed video"
          stats={[
            { label: "Length", value: formatDuration(parseTime(end) - parseTime(start)) },
            { label: "Size", value: formatBytes(result.blob.size) },
          ]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download clip"
          onReset={reset}
        />
      )}
    </div>
  );
}
