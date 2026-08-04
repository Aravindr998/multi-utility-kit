// ---------------------------------------------------------------------------
// Time-zone helpers shared by the World Clock and Time Zone Converter.
// All computation is local (Intl only) — no network, DST-aware via the IANA db.
// ---------------------------------------------------------------------------

const FALLBACK_ZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

/** Every IANA zone the browser knows, or a curated fallback. */
export function getTimeZones(): string[] {
  try {
    const sv = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] })
      .supportedValuesOf?.("timeZone");
    if (sv && sv.length) return sv;
  } catch {
    /* not supported — fall through */
  }
  return FALLBACK_ZONES;
}

/** The visitor's own time zone (e.g. "Asia/Kolkata"). */
export function localZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Human label: "Asia/Kolkata" → "Kolkata (Asia)". */
export function zoneLabel(tz: string): string {
  const parts = tz.split("/");
  const city = parts[parts.length - 1].replace(/_/g, " ");
  const region = parts.length > 1 ? parts[0].replace(/_/g, " ") : "";
  return region ? `${city} (${region})` : city;
}

/** Minutes that `tz` is ahead of UTC at the given instant (DST-aware). */
export function offsetMinutes(tz: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, number> = {};
  for (const p of dtf.formatToParts(date)) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUTC = Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second);
  return Math.round((asUTC - date.getTime()) / 60000);
}

/** "UTC+05:30" / "UTC-08:00" for `tz` at `date`. */
export function offsetLabel(tz: string, date: Date = new Date()): string {
  const mins = offsetMinutes(tz, date);
  const sign = mins >= 0 ? "+" : "-";
  const abs = Math.abs(mins);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${hh}:${mm}`;
}

/**
 * Interpret a naive wall-clock time as being in `tz` and return the UTC instant.
 * Uses the offset at the provisional instant — accurate except at the exact
 * DST changeover minute, which is an unavoidable ambiguity.
 */
export function zonedWallTimeToUTC(
  y: number,
  m: number,
  d: number,
  h: number,
  min: number,
  tz: string,
): number {
  const provisional = Date.UTC(y, m - 1, d, h, min);
  const off = offsetMinutes(tz, new Date(provisional));
  return provisional - off * 60000;
}

/** Format an instant in a specific zone. */
export function formatInZone(
  date: Date,
  tz: string,
  opts: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(undefined, { ...opts, timeZone: tz }).format(date);
}
