import Link from "next/link";
import type { Tool } from "@/lib/tools";
import PinButton from "@/components/PinButton";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <div className="card group relative flex items-start gap-3.5 p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]">
      {/* Stretched link makes the whole card clickable without nesting the pin button inside an anchor */}
      <Link
        href={`/tools/${tool.slug}`}
        className="absolute inset-0 z-0 rounded-[inherit]"
        aria-label={tool.name}
      />
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-xl"
        style={{ background: "var(--brand-soft)" }}
        aria-hidden
      >
        {tool.icon}
      </span>
      <span className="min-w-0 flex-1 pr-7">
        <span className="block font-semibold">{tool.name}</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-[var(--muted)]">
          {tool.cardDescription}
        </span>
      </span>
      <PinButton slug={tool.slug} className="absolute right-2 top-2" />
    </div>
  );
}
