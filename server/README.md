# UtilityHub — YouTube backend

A small standalone service that powers the **YouTube Video & Clip Downloader** tool. It's split out from the main Next.js app so the main app can deploy as a cheap static/edge site, while this service (which needs the `yt-dlp` and `ffmpeg` binaries and a long-lived Node process) is deployed separately.

## Endpoints

- `GET  /health` → `{ ok: true }`
- `POST /api/youtube/info` — body `{ url }` → `{ id, title, uploader, duration, thumbnail }`
- `POST /api/youtube/download` — body `{ url, quality, mode, title, start?, end? }` → streams the file back (`Content-Disposition` attachment), then deletes the temp file.
  - `quality`: `1080` | `720` | `480` | `360` | `audio`
  - `mode`: `full` | `clip` (clip requires `start`/`end` in seconds)

## Requirements

- Node 18+
- [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) on `PATH` (or set `YTDLP_PATH`)
- `ffmpeg` on `PATH` (or set `FFMPEG_PATH`)

## Run locally

```bash
cd server
npm install
npm start          # listens on :4000
```

Then point the frontend at it by setting, in the **main app**:

```bash
NEXT_PUBLIC_YT_API_BASE=http://localhost:4000
```

## Deploy with Docker (recommended)

The included `Dockerfile` installs `ffmpeg` + `yt-dlp` for you.

```bash
cd server
docker build -t utilityhub-yt .
docker run -p 4000:4000 -e CORS_ORIGIN=https://your-frontend.com utilityhub-yt
```

Deploy that image to Railway / Render / Fly.io / any VPS. Set `CORS_ORIGIN` to your deployed frontend URL, and set `NEXT_PUBLIC_YT_API_BASE` (on the frontend) to this service's public URL.

## Config (env)

| Var | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | Listen port |
| `CORS_ORIGIN` | `*` | Comma-separated allowed origins. Lock to your frontend in prod. |
| `YTDLP_PATH` | `yt-dlp` | Path to yt-dlp if not on PATH |
| `FFMPEG_PATH` | (PATH) | Path to ffmpeg if not on PATH |

## Operational notes

- **Keep yt-dlp updated** — YouTube changes break it every few weeks (`yt-dlp -U`, or rebuild the image).
- **Cloud IP blocking** — datacenter IPs sometimes get "sign in to confirm you're not a bot." If you hit this, supply a cookies file (`--cookies`) or route through a residential proxy.
- **Resource limits** — long videos use CPU/memory and time; size your instance accordingly.
