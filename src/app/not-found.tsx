import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
      <div className="text-6xl" aria-hidden>🔍</div>
      <h1 className="mt-4 text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-[var(--muted)]">
        We couldn&apos;t find that tool or page. It may have moved, or the link may be incorrect.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn btn-primary">Go home</Link>
        <Link href="/#all-tools" className="btn btn-secondary">Browse tools</Link>
      </div>
    </div>
  );
}
