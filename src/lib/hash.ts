// Hashing helpers used by the hash-generator tools.
// SHA-1/256/384/512 come from the Web Crypto API; MD5 is implemented here
// because SubtleCrypto deliberately omits it. Everything runs in-browser.

export type HashAlgo = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function subtle(algo: Exclude<HashAlgo, "MD5">, bytes: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest(algo, bytes as BufferSource);
  return toHex(buf);
}

export async function hashText(algo: HashAlgo, text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  return algo === "MD5" ? md5(bytes) : subtle(algo, bytes);
}

export async function hashBytes(algo: HashAlgo, bytes: Uint8Array): Promise<string> {
  return algo === "MD5" ? md5(bytes) : subtle(algo, bytes);
}

// ---------------------------------------------------------------------------
// MD5 (RFC 1321), operating on a byte array. Compact but standards-correct.
// ---------------------------------------------------------------------------

function md5(bytes: Uint8Array): string {
  const add = (a: number, b: number) => (a + b) & 0xffffffff;
  const rol = (n: number, c: number) => (n << c) | (n >>> (32 - c));

  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0;

  const originalLenBits = bytes.length * 8;
  // Pad: append 0x80, then zeros, until length ≡ 56 (mod 64), then 64-bit length.
  const withPadLen = (((bytes.length + 8) >> 6) + 1) << 6;
  const m = new Uint8Array(withPadLen);
  m.set(bytes);
  m[bytes.length] = 0x80;
  const lenLo = originalLenBits >>> 0;
  const lenHi = Math.floor(originalLenBits / 2 ** 32) >>> 0;
  for (let i = 0; i < 4; i++) m[withPadLen - 8 + i] = (lenLo >>> (i * 8)) & 0xff;
  for (let i = 0; i < 4; i++) m[withPadLen - 4 + i] = (lenHi >>> (i * 8)) & 0xff;

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let off = 0; off < withPadLen; off += 64) {
    const M = new Int32Array(16);
    for (let i = 0; i < 16; i++) {
      M[i] = m[off + i * 4] | (m[off + i * 4 + 1] << 8) | (m[off + i * 4 + 2] << 16) | (m[off + i * 4 + 3] << 24);
    }
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = add(add(add(F, A), K[i]), M[g]);
      A = D; D = C; C = B;
      B = add(B, rol(F, S[i]));
    }
    a0 = add(a0, A); b0 = add(b0, B); c0 = add(c0, C); d0 = add(d0, D);
  }

  const out = (n: number) =>
    [0, 1, 2, 3].map((i) => ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0")).join("");
  return out(a0) + out(b0) + out(c0) + out(d0);
}
