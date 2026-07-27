import express from "express";
import cors from "cors";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdtemp, readdir, rm, stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  YT_QUALITIES,
  isYoutubeUrl,
  ffmpegTimestamp,
  sanitizeFilename,
  ytdlpErrorMessage,
  contentType,
} from "./youtube.js";

const pexec = promisify(execFile);

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const YTDLP_BIN = process.env.YTDLP_PATH || "yt-dlp";
const FFMPEG_LOCATION = process.env.FFMPEG_PATH || process.env.FFMPEG_LOCATION || "";

const app = express();
app.use(
  cors({
    origin: CORS_ORIGIN === "*" ? true : CORS_ORIGIN.split(",").map((o) => o.trim()),
    exposedHeaders: ["Content-Disposition"],
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// ------------------------------- /info -------------------------------
app.post("/api/youtube/info", async (req, res) => {
  const url = typeof req.body?.url === "string" ? req.body.url.trim() : "";
  if (!isYoutubeUrl(url)) return res.status(400).json({ error: "Please enter a valid YouTube video URL." });

  try {
    const { stdout } = await pexec(YTDLP_BIN, ["-J", "--no-playlist", "--no-warnings", url], {
      maxBuffer: 1024 * 1024 * 128,
      timeout: 30000,
    });
    const info = JSON.parse(stdout);
    res.json({
      id: info.id ?? "",
      title: info.title ?? "YouTube video",
      uploader: info.uploader ?? info.channel ?? "",
      duration: typeof info.duration === "number" ? info.duration : null,
      thumbnail: info.thumbnail ?? null,
    });
  } catch (e) {
    res.status(502).json({ error: ytdlpErrorMessage(e) });
  }
});

// ----------------------------- /download -----------------------------
app.post("/api/youtube/download", async (req, res) => {
  const b = req.body || {};
  const url = typeof b.url === "string" ? b.url.trim() : "";
  if (!isYoutubeUrl(url)) return res.status(400).json({ error: "Please enter a valid YouTube video URL." });

  const quality = YT_QUALITIES.includes(b.quality) ? b.quality : "720";
  const mode = b.mode === "clip" ? "clip" : "full";
  const title = sanitizeFilename(typeof b.title === "string" ? b.title : "youtube-video");

  const section = [];
  if (mode === "clip") {
    const start = Number(b.start);
    const end = Number(b.end);
    if (!isFinite(start) || !isFinite(end) || start < 0 || end <= start) {
      return res.status(400).json({ error: "Please set a valid start and end time (end must be after start)." });
    }
    section.push("--download-sections", `*${ffmpegTimestamp(start)}-${ffmpegTimestamp(end)}`, "--force-keyframes-at-cuts");
  }

  const dir = await mkdtemp(path.join(tmpdir(), "uh-yt-"));
  const outTemplate = path.join(dir, "out.%(ext)s");

  const args = ["--no-playlist", "--no-warnings", "--no-part", "-o", outTemplate];
  if (FFMPEG_LOCATION) args.push("--ffmpeg-location", FFMPEG_LOCATION);
  if (quality === "audio") {
    args.push("-x", "--audio-format", "mp3", "--audio-quality", "0");
  } else {
    args.push("-f", `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]/best`, "--merge-output-format", "mp4");
  }
  args.push(...section, url);

  try {
    await runYtdlp(args);
  } catch (e) {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
    return res.status(502).json({ error: ytdlpErrorMessage(e) });
  }

  let outName;
  try {
    const files = (await readdir(dir)).filter((f) => f.startsWith("out."));
    outName = files.sort((a, b2) => b2.length - a.length)[0];
  } catch {
    /* ignore */
  }
  if (!outName) {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
    return res.status(502).json({ error: "The download produced no file. Try a different quality." });
  }

  const filePath = path.join(dir, outName);
  const ext = path.extname(outName);
  const size = (await stat(filePath)).size;
  const downloadName = `${title}${ext}`;

  res.setHeader("Content-Type", contentType(ext));
  res.setHeader("Content-Length", String(size));
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${downloadName.replace(/"/g, "")}"; filename*=UTF-8''${encodeURIComponent(downloadName)}`,
  );
  res.setHeader("Cache-Control", "no-store");

  const stream = createReadStream(filePath);
  const cleanup = () => rm(dir, { recursive: true, force: true }).catch(() => {});
  stream.on("error", () => {
    cleanup();
    if (!res.headersSent) res.status(500).json({ error: "Failed to read the downloaded file." });
    else res.end();
  });
  res.on("close", cleanup);
  stream.pipe(res);
});

function runYtdlp(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(YTDLP_BIN, args, { windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (d) => {
      stderr += d.toString();
      if (stderr.length > 20000) stderr = stderr.slice(-20000);
    });
    child.on("error", (err) => reject(Object.assign(err, { stderr })));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(Object.assign(new Error(`yt-dlp exited with code ${code}`), { stderr, code: "YTDLP_FAILED" }));
    });
  });
}

app.listen(PORT, () => {
  console.log(`UtilityHub YouTube backend listening on :${PORT}`);
  console.log(`  yt-dlp: ${YTDLP_BIN}   ffmpeg: ${FFMPEG_LOCATION || "(PATH)"}   CORS: ${CORS_ORIGIN}`);
});
