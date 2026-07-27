import Link from "next/link";
import type { Tool } from "@/lib/tools";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card group flex items-start gap-3 p-4 transition-shadow hover:shadow-md"
      style={{ transition: "border-color .15s, box-shadow .15s" }}
    >
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-xl"
        style={{ background: "var(--brand-soft)" }}
        aria-hidden
      >
        {tool.icon}
      </span>
      <span className="min-w-0">
        <span className="block font-semibold group-hover:text-[var(--brand)]">{tool.name}</span>
        <span className="mt-0.5 block text-sm text-[var(--muted)]">{tool.cardDescription}</span>
      </span>
    </Link>
  );
}
