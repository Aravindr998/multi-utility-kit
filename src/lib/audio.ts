// Shared helpers for the Audio tools. Wraps the ffmpeg.wasm load/run/cleanup
// dance so each tool can just describe its command and get a Blob back.

import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { loadFfmpeg, toUint8 } from "./ffmpeg";

/** Shown while ffmpeg-core is fetched for the first time in a session. */
export const LOAD_HINT = "Loading audio engine (first run downloads ~32 MB)…";

function extOf(name: string): string {
  return name.match(/\.[a-z0-9]+$/i)?.[0] || "";
}

/** Attach a progress listener, returning a detach fn. Percent is 0–100. */
function attachProgress(ff: FFmpeg, cb: (percent: number) => void): () => void {
  const handler = ({ progress }: { progress: number }) =>
    cb(Math.min(100, Math.max(0, progress * 100)));
  ff.on("progress", handler);
  return () => ff.off("progress", handler);
}

/**
 * Run an ffmpeg command over one or more input files and return the output blob.
 * `buildArgs(inputs, output)` is given the virtual input filenames and the output
 * filename and returns the ffmpeg argument list. Temp files are always cleaned up.
 */
export async function runFfmpeg(
  files: File[],
  outName: string,
  mime: string,
  buildArgs: (inputs: string[], output: string) => string[],
  onProgress?: (percent: number) => void,
): Promise<Blob> {
  const ff = await loadFfmpeg();
  const detach = onProgress ? attachProgress(ff, onProgress) : () => {};
  const inputs = files.map((f, i) => `in${i}${extOf(f.name) || ".dat"}`);
  try {
    for (let i = 0; i < files.length; i++) {
      await ff.writeFile(inputs[i], await toUint8(files[i]));
    }
    await ff.exec(buildArgs(inputs, outName));
    const data = await ff.readFile(outName);
    const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(data as string);
    return new Blob([bytes as BlobPart], { type: mime });
  } finally {
    detach();
    for (const n of inputs) await ff.deleteFile(n).catch(() => {});
    await ff.deleteFile(outName).catch(() => {});
  }
}

/** Strip the extension from a filename, e.g. "song.wav" -> "song". */
export function baseName(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, "");
}

/**
 * Parse "ss", "mm:ss" or "hh:mm:ss" (with optional decimal seconds) to seconds.
 * Returns NaN for anything that doesn't parse.
 */
export function parseTime(input: string): number {
  const t = input.trim();
  if (!t) return NaN;
  const parts = t.split(":").map((p) => p.trim());
  if (parts.length > 3 || parts.some((p) => p === "" || isNaN(Number(p)) || Number(p) < 0)) {
    return NaN;
  }
  return parts.map(Number).reduce((acc, n) => acc * 60 + n, 0);
}

/** Format seconds as "m:ss" or "h:mm:ss". */
export function formatDuration(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}
