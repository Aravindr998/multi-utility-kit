# UtilityHub

A suite of free, no-login, browser-based utility tools built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4** and **TypeScript**. Almost every tool runs **100% client-side** — files never leave the user's device.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (static + SSG)
npm run start    # serve the production build
npm run lint
```

## Architecture

| Path | Purpose |
| --- | --- |
| `src/lib/tools.ts` | **Tool Registry** — the single source of truth. Drives the homepage, category pages, search, sitemap and per-page SEO. Add a tool here + a component to ship it. |
| `src/tools/*.tsx` | Individual tool UIs (client components, one per tool). |
| `src/tools/ToolRenderer.tsx` | Maps a slug → its client component via `next/dynamic` (`ssr:false`). |
| `src/components/*` | Shared UI: `Header`, `Footer`, `FileDropzone`, `ToolPageLayout`, `ResultCard`, `ProgressIndicator`, `ToolCard`, `SearchableToolGrid`. |
| `src/app/tools/[slug]/page.tsx` | Dynamic tool route — SSG via `generateStaticParams`, per-tool `<title>`/meta, and FAQ + SoftwareApplication JSON-LD. |
| `src/app/category/[category]/page.tsx` | Category listing pages (SSG). |
| `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` | Auto-generated from the registry. |

### Adding a new tool

1. Add an entry to `TOOLS` in `src/lib/tools.ts` (`available: true`).
2. Create the component in `src/tools/YourTool.tsx`.
3. Register it in `src/tools/ToolRenderer.tsx`.

Everything else (homepage card, category page, sitemap entry, SEO metadata, FAQ schema, breadcrumb) is generated automatically.

## Live tools (22)

**Phase 1** — Image Compressor · Image Format Converter · Image Resizer & Cropper · PDF Merge · PDF Split · PDF Compressor · Word Counter · Case Converter · QR Code Generator · Unit Converter · Percentage Calculator · Age Calculator.

**Phase 2** — EMI/Loan Calculator · GST/Sales Tax Calculator · BMI Calculator · Currency Converter (live rates) · PDF ↔ JPG · PDF ↔ Word · Video Frame Extractor · Video Format Converter (ffmpeg) · Audio Format Converter (ffmpeg).

**Custom** — YouTube Video & Clip Downloader *(server-side — see requirements below)*.

Phases 3–5 (developer tools, AI-assisted tools, engagement drivers) are scoped in the original project spec and can be added incrementally using the registry pattern above.

## Architecture: split deploy

The app is a **hybrid** with a deliberately split deployment:

- **Main app (this repo root)** — 21 of the 22 tools run 100% in the browser. After building, every route is static/SSG with **no server functions**, so it deploys to any static/edge host (Vercel, Netlify, Cloudflare Pages, S3+CDN…). Cheap and fast.
- **YouTube backend (`./server`)** — the one tool that can't be client-side (browsers can't fetch YouTube's protected streams) lives in a **separate standalone Node service** that needs the `yt-dlp` + `ffmpeg` binaries. Deploy it as a container/VM (Railway, Render, Fly.io, a VPS). See [`server/README.md`](server/README.md).

The frontend calls the backend via the public env var **`NEXT_PUBLIC_YT_API_BASE`** (baked at build time). See [`.env.example`](.env.example).

### Local development (two terminals)

```bash
# Terminal 1 — the app
npm run dev                      # http://localhost:3000

# Terminal 2 — the download backend (needs yt-dlp + ffmpeg installed)
cd server && npm install && npm start   # http://localhost:4000
```

The 21 client-side tools work with just Terminal 1. The YouTube tool additionally needs Terminal 2 (and `yt-dlp`/`ffmpeg` installed locally).

### Production

1. Deploy `./server` (Docker image installs the binaries for you) and note its public URL.
2. Set `NEXT_PUBLIC_YT_API_BASE=https://<your-backend-url>` **before** building the main app.
3. Set the backend's `CORS_ORIGIN` to your deployed frontend URL.

> ⚠️ Downloading YouTube content generally violates YouTube's Terms of Service and most videos are copyrighted. The UI carries a visible notice; only download content you have the right to use.

## ⚠️ Before deploying

Set the real production domain in **`src/lib/tools.ts`** → `SITE.url` (currently the placeholder `https://utilityhub.example.com`). This value feeds canonical URLs, Open Graph tags, the sitemap and robots.txt.

## Libraries

- `browser-image-compression` — image compression
- `pdf-lib` — PDF create/merge/split/embed
- `pdfjs-dist` — PDF rasterization (compressor, PDF→JPG/Word)
- `heic2any` — HEIC decoding
- `qrcode` — QR generation
- `jszip` — bundling multi-file downloads (split pages, frames, images)
- `docx` / `mammoth` / `jspdf` — PDF ↔ Word conversion
- `@ffmpeg/ffmpeg` + `@ffmpeg/util` + `@ffmpeg/core` — video/audio conversion (self-hosted core in `public/ffmpeg/`, no CDN)

Deployment target: static-first (Vercel/Netlify-style). Most routes are prerendered.
