"use client";

import { useEffect, useRef, useState } from "react";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";
import { runFfmpeg, formatDuration, LOAD_HINT } from "@/lib/audio";

type Status = "idle" | "recording" | "paused";

function pickMimeType(): string {
  const candidates = ["audio/webm", "audio/ogg", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") return "";
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function extForMime(mime: string): string {
  if (mime.includes("webm")) return ".webm";
  if (mime.includes("ogg")) return ".ogg";
  if (mime.includes("mp4")) return ".m4a";
  return ".webm";
}

export default function VoiceRecorder() {
  const [status, setStatus] = useState<Status>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [recording, setRecording] = useState<{ blob: Blob; url: string; mime: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mp3Busy, setMp3Busy] = useState(false);
  const [mp3Stage, setMp3Stage] = useState("");
  const [mp3Progress, setMp3Progress] = useState<number | undefined>(undefined);
  const [mp3, setMp3] = useState<Blob | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseElapsedRef = useRef(0);
  const startedAtRef = useRef(0);
  const urlRef = useRef<string | null>(null);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  // Clean up hardware and object URLs if the user navigates away mid-recording.
  useEffect(() => {
    return () => {
      stopTimer();
      stopTracks();
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const startTicking = () => {
    startedAtRef.current = Date.now();
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsed(baseElapsedRef.current + (Date.now() - startedAtRef.current) / 1000);
    }, 200);
  };

  const start = async () => {
    setError(null);
    setMp3(null);
    if (recording) {
      URL.revokeObjectURL(recording.url);
      setRecording(null);
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Your browser doesn't support microphone recording.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = pickMimeType();
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const type = mr.mimeType || mime || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setRecording({ blob, url, mime: type });
      };
      recorderRef.current = mr;
      baseElapsedRef.current = 0;
      setElapsed(0);
      mr.start();
      startTicking();
      setStatus("recording");
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      if (name === "NotAllowedError") setError("Microphone access was blocked. Allow it in your browser to record.");
      else if (name === "NotFoundError") setError("No microphone was found on this device.");
      else setError(e instanceof Error ? e.message : "Couldn't start recording.");
      stopTracks();
    }
  };

  const pause = () => {
    const mr = recorderRef.current;
    if (mr && mr.state === "recording") {
      mr.pause();
      baseElapsedRef.current += (Date.now() - startedAtRef.current) / 1000;
      stopTimer();
      setStatus("paused");
    }
  };

  const resume = () => {
    const mr = recorderRef.current;
    if (mr && mr.state === "paused") {
      mr.resume();
      startTicking();
      setStatus("recording");
    }
  };

  const stop = () => {
    const mr = recorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    stopTimer();
    stopTracks();
    setStatus("idle");
  };

  const discard = () => {
    if (recording) URL.revokeObjectURL(recording.url);
    urlRef.current = null;
    setRecording(null);
    setMp3(null);
    setElapsed(0);
    setError(null);
  };

  const toMp3 = async () => {
    if (!recording) return;
    setMp3Busy(true);
    setMp3(null);
    setMp3Progress(undefined);
    try {
      setMp3Stage(LOAD_HINT);
      const input = new File([recording.blob], `recording${extForMime(recording.mime)}`, { type: recording.mime });
      const blob = await runFfmpeg(
        [input],
        "recording.mp3",
        "audio/mpeg",
        (inputs, output) => ["-i", inputs[0], "-vn", "-c:a", "libmp3lame", "-b:a", "192k", output],
        (p) => { setMp3Stage("Converting to MP3…"); setMp3Progress(p); },
      );
      setMp3(blob);
    } catch (e) {
      setError(e instanceof Error ? e.message : "MP3 conversion failed.");
    } finally {
      setMp3Busy(false);
      setMp3Stage("");
    }
  };

  const isBusy = status !== "idle";

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="flex flex-col items-center text-center">
          <div
            className="grid h-20 w-20 place-items-center rounded-full text-4xl"
            style={{
              background: status === "recording" ? "color-mix(in srgb, var(--danger) 18%, transparent)" : "var(--brand-soft)",
              animation: status === "recording" ? "pulse 1.4s ease-in-out infinite" : undefined,
            }}
            aria-hidden
          >
            🎙️
          </div>
          <p className="mt-4 font-mono text-3xl font-semibold tabular-nums">{formatDuration(elapsed)}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {status === "recording" ? "Recording…" : status === "paused" ? "Paused" : recording ? "Ready to save" : "Press record to start"}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {status === "idle" && (
              <button className="btn btn-primary" onClick={start}>
                {recording ? "Record again" : "● Record"}
              </button>
            )}
            {status === "recording" && (
              <>
                <button className="btn btn-secondary" onClick={pause}>Pause</button>
                <button className="btn btn-primary" onClick={stop}>■ Stop</button>
              </>
            )}
            {status === "paused" && (
              <>
                <button className="btn btn-secondary" onClick={resume}>Resume</button>
                <button className="btn btn-primary" onClick={stop}>■ Stop</button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p
          className="rounded-lg p-3 text-sm"
          style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}
        >
          {error}
        </p>
      )}

      {recording && !isBusy && (
        <ResultCard
          title="Your recording"
          stats={[
            { label: "Length", value: formatDuration(elapsed) },
            { label: "Size", value: formatBytes(recording.blob.size) },
          ]}
          preview={<audio src={recording.url} controls className="w-full" />}
          onDownload={() => downloadBlob(recording.blob, `recording${extForMime(recording.mime)}`)}
          downloadLabel={`Download ${extForMime(recording.mime).replace(".", "").toUpperCase()}`}
          onReset={discard}
        >
          <div className="mt-1">
            {mp3Busy ? (
              <ProgressIndicator value={mp3Progress} label={mp3Stage || "Working…"} />
            ) : mp3 ? (
              <button className="btn btn-secondary" onClick={() => downloadBlob(mp3, "recording.mp3")}>
                ⬇ Download MP3 ({formatBytes(mp3.size)})
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={toMp3}>Convert to MP3</button>
            )}
          </div>
        </ResultCard>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.55 } }`}</style>
    </div>
  );
}
