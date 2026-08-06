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
  "blur-image": dynamic(() => import("./ImageBlur"), { ssr: false, loading: Loading }),
  "add-watermark": dynamic(() => import("./ImageWatermark"), { ssr: false, loading: Loading }),
  "rotate-image": dynamic(() => import("./ImageRotate"), { ssr: false, loading: Loading }),
  "flip-image": dynamic(() => import("./ImageFlip"), { ssr: false, loading: Loading }),
  "image-to-pdf": dynamic(() => import("./ImageToPdf"), { ssr: false, loading: Loading }),
  "color-picker": dynamic(() => import("./ColorPicker"), { ssr: false, loading: Loading }),
  "palette-generator": dynamic(() => import("./PaletteGenerator"), { ssr: false, loading: Loading }),
  "exif-viewer": dynamic(() => import("./ExifViewer"), { ssr: false, loading: Loading }),
  "remove-background": dynamic(() => import("./BackgroundRemover"), { ssr: false, loading: Loading }),
  "pdf-merge": dynamic(() => import("./PdfMerge"), { ssr: false, loading: Loading }),
  "pdf-split": dynamic(() => import("./PdfSplit"), { ssr: false, loading: Loading }),
  "pdf-compressor": dynamic(() => import("./PdfCompressor"), { ssr: false, loading: Loading }),
  "pdf-rotate": dynamic(() => import("./PdfRotate"), { ssr: false, loading: Loading }),
  "pdf-page-numbers": dynamic(() => import("./PdfPageNumbers"), { ssr: false, loading: Loading }),
  "pdf-protect": dynamic(() => import("./PdfProtect"), { ssr: false, loading: Loading }),
  "pdf-unlock": dynamic(() => import("./PdfUnlock"), { ssr: false, loading: Loading }),
  "pdf-extract-images": dynamic(() => import("./PdfExtractImages"), { ssr: false, loading: Loading }),
  "pdf-ocr": dynamic(() => import("./PdfOcr"), { ssr: false, loading: Loading }),
  "word-counter": dynamic(() => import("./WordCounter"), { ssr: false, loading: Loading }),
  "case-converter": dynamic(() => import("./CaseConverter"), { ssr: false, loading: Loading }),
  "text-diff": dynamic(() => import("./TextDiff"), { ssr: false, loading: Loading }),
  "text-formatter": dynamic(() => import("./TextFormatter"), { ssr: false, loading: Loading }),
  "markdown-editor": dynamic(() => import("./MarkdownEditor"), { ssr: false, loading: Loading }),
  "notes": dynamic(() => import("./NotesApp"), { ssr: false, loading: Loading }),
  "character-counter": dynamic(() => import("./CharacterCounter"), { ssr: false, loading: Loading }),
  "remove-duplicate-lines": dynamic(() => import("./RemoveDuplicateLines"), { ssr: false, loading: Loading }),
  "sort-lines": dynamic(() => import("./SortLines"), { ssr: false, loading: Loading }),
  "reverse-text": dynamic(() => import("./ReverseText"), { ssr: false, loading: Loading }),
  "random-text-generator": dynamic(() => import("./RandomTextGenerator"), { ssr: false, loading: Loading }),
  "lorem-ipsum": dynamic(() => import("./LoremIpsum"), { ssr: false, loading: Loading }),
  "remove-empty-lines": dynamic(() => import("./RemoveEmptyLines"), { ssr: false, loading: Loading }),
  "find-and-replace": dynamic(() => import("./FindReplace"), { ssr: false, loading: Loading }),
  "trim-whitespace": dynamic(() => import("./TrimWhitespace"), { ssr: false, loading: Loading }),
  "unicode-inspector": dynamic(() => import("./UnicodeInspector"), { ssr: false, loading: Loading }),
  "emoji-picker": dynamic(() => import("./EmojiPicker"), { ssr: false, loading: Loading }),
  "fancy-text-generator": dynamic(() => import("./FancyTextGenerator"), { ssr: false, loading: Loading }),
  "slug-generator": dynamic(() => import("./SlugGenerator"), { ssr: false, loading: Loading }),
  "html-escape": dynamic(() => import("./HtmlEscape"), { ssr: false, loading: Loading }),
  "url-encode": dynamic(() => import("./UrlEncode"), { ssr: false, loading: Loading }),
  "base64": dynamic(() => import("./Base64Tool"), { ssr: false, loading: Loading }),
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
  // Time
  "world-clock": dynamic(() => import("./WorldClock"), { ssr: false, loading: Loading }),
  "stopwatch": dynamic(() => import("./Stopwatch"), { ssr: false, loading: Loading }),
  "timer": dynamic(() => import("./Timer"), { ssr: false, loading: Loading }),
  "alarm": dynamic(() => import("./AlarmClock"), { ssr: false, loading: Loading }),
  "countdown": dynamic(() => import("./Countdown"), { ssr: false, loading: Loading }),
  "date-difference": dynamic(() => import("./DateDifference"), { ssr: false, loading: Loading }),
  "working-days-calculator": dynamic(() => import("./WorkingDays"), { ssr: false, loading: Loading }),
  "time-zone-converter": dynamic(() => import("./TimeZoneConverter"), { ssr: false, loading: Loading }),
  "unix-timestamp-converter": dynamic(() => import("./UnixTimestamp"), { ssr: false, loading: Loading }),
  // Random
  "random-number": dynamic(() => import("./RandomNumber"), { ssr: false, loading: Loading }),
  "random-password": dynamic(() => import("./PasswordGenerator"), { ssr: false, loading: Loading }),
  "random-name": dynamic(() => import("./RandomName"), { ssr: false, loading: Loading }),
  "dice": dynamic(() => import("./Dice"), { ssr: false, loading: Loading }),
  "coin-flip": dynamic(() => import("./CoinFlip"), { ssr: false, loading: Loading }),
  "spin-wheel": dynamic(() => import("./SpinWheel"), { ssr: false, loading: Loading }),
  "team-generator": dynamic(() => import("./TeamGenerator"), { ssr: false, loading: Loading }),
  "decision-maker": dynamic(() => import("./DecisionMaker"), { ssr: false, loading: Loading }),
  "random-color": dynamic(() => import("./RandomColor"), { ssr: false, loading: Loading }),
  "random-country": dynamic(() => import("./RandomCountry"), { ssr: false, loading: Loading }),
  "random-emoji": dynamic(() => import("./RandomEmoji"), { ssr: false, loading: Loading }),
  "random-quote": dynamic(() => import("./RandomQuote"), { ssr: false, loading: Loading }),
};

export default function ToolRenderer({ slug }: { slug: string }) {
  const Component = COMPONENTS[slug];
  if (!Component) {
    return <p className="text-[var(--muted)]">This tool is coming soon.</p>;
  }
  return <Component />;
}
