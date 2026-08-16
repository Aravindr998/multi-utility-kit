// JWT helpers: base64url, decode, and HS256/384/512 sign & verify via Web Crypto.
// Only HMAC (shared-secret) algorithms are supported — all local, no libraries.

export type HsAlg = "HS256" | "HS384" | "HS512";
const SHA: Record<HsAlg, string> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };

export function b64urlEncodeBytes(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function b64urlEncodeString(s: string): string {
  return b64urlEncodeBytes(new TextEncoder().encode(s));
}

export function b64urlDecodeToString(seg: string): string {
  let x = seg.replace(/-/g, "+").replace(/_/g, "/");
  while (x.length % 4) x += "=";
  const bin = atob(x);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export type DecodedJwt = {
  header: unknown;
  payload: unknown;
  signature: string;
  headerRaw: string;
  payloadRaw: string;
};

/** Split & decode a JWT. Throws if it isn't three dot-separated segments of valid JSON. */
export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("A JWT must have three parts separated by dots.");
  let header: unknown, payload: unknown;
  try { header = JSON.parse(b64urlDecodeToString(parts[0])); }
  catch { throw new Error("The header is not valid Base64URL-encoded JSON."); }
  try { payload = JSON.parse(b64urlDecodeToString(parts[1])); }
  catch { throw new Error("The payload is not valid Base64URL-encoded JSON."); }
  return { header, payload, signature: parts[2], headerRaw: parts[0], payloadRaw: parts[1] };
}

async function hmacKey(secret: string, alg: HsAlg): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: SHA[alg] }, false, ["sign", "verify"]);
}

export async function signJwt(alg: HsAlg, payloadObj: unknown, secret: string, extraHeader: Record<string, unknown> = {}): Promise<string> {
  const header = { alg, typ: "JWT", ...extraHeader };
  const headB64 = b64urlEncodeString(JSON.stringify(header));
  const payB64 = b64urlEncodeString(JSON.stringify(payloadObj));
  const data = `${headB64}.${payB64}`;
  const key = await hmacKey(secret, alg);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return `${data}.${b64urlEncodeBytes(new Uint8Array(sig))}`;
}

/** Verify an HS* token's signature with a secret. Returns false for non-HMAC algs. */
export async function verifyJwt(token: string, secret: string): Promise<boolean> {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return false;
  let alg: string;
  try { alg = (JSON.parse(b64urlDecodeToString(parts[0])) as { alg?: string }).alg ?? ""; }
  catch { return false; }
  if (!(alg in SHA)) return false;
  const key = await hmacKey(secret, alg as HsAlg);
  let sigBin: string;
  try {
    let x = parts[2].replace(/-/g, "+").replace(/_/g, "/");
    while (x.length % 4) x += "=";
    sigBin = atob(x);
  } catch { return false; }
  const sigBytes = Uint8Array.from(sigBin, (c) => c.charCodeAt(0));
  return crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
}

/** Format a numeric-date claim (seconds since epoch) plus a relative hint. */
export function formatClaimTime(sec: number): { iso: string; rel: string } {
  const d = new Date(sec * 1000);
  const diff = sec * 1000 - Date.now();
  const abs = Math.abs(diff);
  const units: [number, string][] = [[86400000, "day"], [3600000, "hour"], [60000, "minute"], [1000, "second"]];
  let rel = "just now";
  for (const [ms, name] of units) {
    if (abs >= ms) { const n = Math.floor(abs / ms); rel = `${n} ${name}${n === 1 ? "" : "s"} ${diff >= 0 ? "from now" : "ago"}`; break; }
  }
  return { iso: isNaN(d.getTime()) ? "invalid date" : d.toISOString(), rel };
}
