// Client-only lazy loader for a shared ffmpeg.wasm instance.
// Core files are self-hosted from /public/ffmpeg (no external CDN).

import type { FFmpeg } from "@ffmpeg/ffmpeg";

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export function isFfmpegLoaded() {
  return instance !== null;
}

export function loadFfmpeg(): Promise<FFmpeg> {
  if (instance) return Promise.resolve(instance);
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");
    const ff = new FFmpeg();
    const base = "/ffmpeg";
    await ff.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
    });
    instance = ff;
    return ff;
  })();

  return loadPromise;
}

/** Read a File/Blob into a Uint8Array for ffmpeg.writeFile. */
export async function toUint8(file: Blob): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}
