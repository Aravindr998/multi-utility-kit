import type { Metadata } from "next";
import Link from "next/link";
import { AVAILABLE_TOOLS, SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: `About | ${SITE.name}`,
  description:
    "UtilityHub is a growing suite of free, no-login, browser-based utilities built for speed and privacy.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">About {SITE.name}</h1>

      <div className="mt-8 space-y-6 leading-relaxed">
        <p>
          {SITE.name} is a collection of <strong>{AVAILABLE_TOOLS.length}+ free online tools</strong>{" "}
          that help you get small jobs done fast — compressing an image, merging PDFs, counting
          words, generating a QR code, converting units and more.
        </p>

        <div>
          <h2 className="text-xl font-bold">What makes it different</h2>
          <ul className="mt-3 space-y-2">
            <li>🔒 <strong>Private by design.</strong> Most tools run entirely in your browser, so your files never get uploaded.</li>
            <li>🆓 <strong>Free and open.</strong> No accounts, no paywalls, no watermarks on any core tool.</li>
            <li>⚡ <strong>Fast.</strong> Lightweight, mobile-first pages that load instantly.</li>
            <li>🎯 <strong>Focused.</strong> One tool per page — do the thing you came to do without clutter.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold">Built to grow</h2>
          <p className="mt-2">
            New tools are added regularly across images, PDFs, text, calculators, converters and
            developer utilities. Have a request?{" "}
            <a href="mailto:hello@utilityhub.example.com" className="font-medium text-[var(--brand)]">
              Let us know
            </a>
            .
          </p>
        </div>

        <div className="pt-2">
          <Link href="/#all-tools" className="btn btn-primary">Explore the tools →</Link>
        </div>
      </div>
    </article>
  );
}
