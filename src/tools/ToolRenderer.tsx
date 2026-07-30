"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

function Loading() {
  return (
    <div className="card grid place-items-center p-12">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: "var(--brand)", borderTopColor: "transparent" }}
        aria-label="Loading tool"
      />
    </div>
  );
}

// Client-only tool components (browser APIs: canvas, File, workers).
const COMPONENTS: Record<string, ComponentType> = {
  "image-compressor": dynamic(() => import("./ImageCompressor"), { ssr: false, loading: Loading }),
  "image-converter": dynamic(() => import("./ImageConverter"), { ssr: false, loading: Loading }),
  "image-resizer": dynamic(() => import("./ImageResizer"), { ssr: false, loading: Loading }),
  "pdf-merge": dynamic(() => import("./PdfMerge"), { ssr: false, loading: Loading }),
  "pdf-split": dynamic(() => import("./PdfSplit"), { ssr: false, loading: Loading }),
  "pdf-compressor": dynamic(() => import("./PdfCompressor"), { ssr: false, loading: Loading }),
  "word-counter": dynamic(() => import("./WordCounter"), { ssr: false, loading: Loading }),
  "case-converter": dynamic(() => import("./CaseConverter"), { ssr: false, loading: Loading }),
  "text-diff": dynamic(() => import("./TextDiff"), { ssr: false, loading: Loading }),
  "text-formatter": dynamic(() => import("./TextFormatter"), { ssr: false, loading: Loading }),
  "markdown-editor": dynamic(() => import("./MarkdownEditor"), { ssr: false, loading: Loading }),
  "notes": dynamic(() => import("./NotesApp"), { ssr: false, loading: Loading }),
  "qr-code-generator": dynamic(() => import("./QrCodeGenerator"), { ssr: false, loading: Loading }),
  "unit-converter": dynamic(() => import("./UnitConverter"), { ssr: false, loading: Loading }),
  "percentage-calculator": dynamic(() => import("./PercentageCalculator"), { ssr: false, loading: Loading }),
  "age-calculator": dynamic(() => import("./AgeCalculator"), { ssr: false, loading: Loading }),
  // Phase 2
  "loan-calculator": dynamic(() => import("./LoanCalculator"), { ssr: false, loading: Loading }),
  "gst-calculator": dynamic(() => import("./GstCalculator"), { ssr: false, loading: Loading }),
  "bmi-calculator": dynamic(() => import("./BmiCalculator"), { ssr: false, loading: Loading }),
  "currency-converter": dynamic(() => import("./CurrencyConverter"), { ssr: false, loading: Loading }),
  "pdf-to-jpg": dynamic(() => import("./PdfToJpg"), { ssr: false, loading: Loading }),
  "pdf-to-word": dynamic(() => import("./PdfToWord"), { ssr: false, loading: Loading }),
  "video-frame-extractor": dynamic(() => import("./VideoFrameExtractor"), { ssr: false, loading: Loading }),
  "video-converter": dynamic(() => import("./VideoConverter"), { ssr: false, loading: Loading }),
  "audio-converter": dynamic(() => import("./AudioConverter"), { ssr: false, loading: Loading }),
  "youtube-downloader": dynamic(() => import("./YoutubeDownloader"), { ssr: false, loading: Loading }),
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Component = COMPONENTS[slug];
  if (!Component) {
    return <p className="text-[var(--muted)]">This tool is coming soon.</p>;
  }
  return <Component />;
}
