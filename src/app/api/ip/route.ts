import type { NextRequest } from "next/server";

// IP geolocation needs an external database, so this handler queries ipwho.is
// server-side. The looked-up IP is sent to that provider; nothing is stored here.
export const dynamic = "force-dynamic";

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6 = /^[0-9a-f:]+$/i;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let query = (searchParams.get("query") || "").trim();

  if (!query) {
    const xff = req.headers.get("x-forwarded-for");
    query = xff ? xff.split(",")[0].trim() : "";
  }
  if (query && !IPV4.test(query) && !IPV6.test(query)) {
    return Response.json({ error: "Enter a valid IPv4 or IPv6 address." }, { status: 400 });
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(query)}`, { signal: ctrl.signal });
    clearTimeout(timer);
    const data = await res.json();
    if (!data || data.success === false) {
      return Response.json({ error: (data && data.message) || "Could not locate that IP address." }, { status: 400 });
    }
    return Response.json({
      ip: data.ip,
      type: data.type,
      city: data.city,
      region: data.region,
      country: data.country,
      countryCode: data.country_code,
      continent: data.continent,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone?.id,
      isp: data.connection?.isp,
      org: data.connection?.org,
      asn: data.connection?.asn,
    });
  } catch {
    return Response.json({ error: "The IP lookup failed. Please try again." }, { status: 502 });
  }
}
