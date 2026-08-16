import type { NextRequest } from "next/server";

// DNS lookups can't run in the browser, so this handler proxies the query to
// Cloudflare's DNS-over-HTTPS JSON resolver. Nothing is stored.
export const dynamic = "force-dynamic";

const TYPES = new Set(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SOA", "CAA", "SRV"]);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = (searchParams.get("name") || "").trim().toLowerCase();
  const type = (searchParams.get("type") || "A").toUpperCase();

  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(name)) {
    return Response.json({ error: "Enter a valid domain name (e.g. example.com)." }, { status: 400 });
  }
  if (!TYPES.has(type)) {
    return Response.json({ error: "Unsupported record type." }, { status: 400 });
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: "application/dns-json" },
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error("resolver error");
    const data = (await res.json()) as { Status: number; Answer?: { name: string; type: number; TTL: number; data: string }[] };
    return Response.json({ status: data.Status, answers: data.Answer ?? [] });
  } catch {
    return Response.json({ error: "The DNS lookup failed. Please try again." }, { status: 502 });
  }
}
