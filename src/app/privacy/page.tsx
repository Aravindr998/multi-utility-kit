import type { Metadata } from "next";
import { SITE } from "@/lib/tools";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE.name}`,
  description:
    "How UtilityHub handles your data. Most tools process files entirely in your browser — your files are never uploaded.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Last updated: 26 July 2026</p>

      <div className="prose mt-8 max-w-none space-y-6 leading-relaxed">
        <Section title="The short version">
          <p>
            {SITE.name} is built to be private by default. For the vast majority of our tools,
            your files and text are processed <strong>entirely inside your web browser</strong>.
            They are never uploaded to, stored on, or seen by our servers.
          </p>
        </Section>

        <Section title="Client-side processing">
          <p>
            Tools such as the Image Compressor, Image Converter, Image Resizer, PDF Merge, PDF
            Split, PDF Compressor, Word Counter, Case Converter, QR Code Generator, Unit
            Converter and our calculators run using JavaScript and WebAssembly on your own
            device. The file you select never leaves your computer or phone. If you disconnect
            from the internet after the page loads, these tools still work.
          </p>
        </Section>

        <Section title="Server-side tools">
          <p>
            A small number of future tools (for example AI-assisted text tools or heavy video
            transcoding) may require server processing. Where that is the case, it will be
            clearly stated on the tool page, uploaded files will be used only to perform the
            requested task, and they will be automatically deleted shortly after processing
            (within one hour).
          </p>
        </Section>

        <Section title="Analytics & cookies">
          <p>
            We use privacy-respecting, aggregate page-view measurement to understand which tools
            are useful. We do not sell your data, and we do not use invasive third-party tracking
            cookies. No account is required to use any core tool.
          </p>
        </Section>

        <Section title="Third-party links & ads">
          <p>
            Pages may display advertising to keep the service free. Ad partners may set their own
            cookies; you can control these through your browser settings and any consent controls
            shown to you.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy? Email{" "}
            <a href="mailto:privacy@utilityhub.example.com" className="font-medium text-[var(--brand)]">
              privacy@utilityhub.example.com
            </a>
            .
          </p>
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-2 text-[var(--foreground)]">{children}</div>
    </section>
  );
}
