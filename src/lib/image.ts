// Shared helpers for the in-browser image tools.

/** Decode a File into an HTMLImageElement, transparently converting HEIC/HEIF. */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  let src: Blob = file;
  const isHeic = /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  if (isHeic) {
    const heic2any = (await import("heic2any")).default;
    src = (await heic2any({ blob: file, toType: "image/png" })) as Blob;
  }
  const url = URL.createObjectURL(src);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}

export type OutType = "image/jpeg" | "image/png" | "image/webp";

/** Pick a sensible output MIME type: keep PNG/WebP, otherwise JPEG.
 *  Pass forceAlpha when the result needs transparency (rotation, etc.). */
export function outputTypeFor(file: File | null, opts?: { forceAlpha?: boolean }): OutType {
  if (opts?.forceAlpha) return "image/png";
  if (file?.type === "image/png") return "image/png";
  if (file?.type === "image/webp") return "image/webp";
  return "image/jpeg";
}

export function extFor(type: string): string {
  return type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
}

export function baseName(file: File): string {
  const dot = file.name.lastIndexOf(".");
  return dot > 0 ? file.name.slice(0, dot) : file.name;
}

/** Promisified canvas.toBlob. */
export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Image export failed."))), type, quality),
  );
}
