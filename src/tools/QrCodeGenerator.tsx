"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { downloadBlob } from "@/lib/format";

type Mode = "url" | "text" | "wifi" | "vcard";

function escapeWifi(s: string) {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

export default function QrCodeGenerator() {
  const [mode, setMode] = useState<Mode>("url");
  const [url, setUrl] = useState("https://");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [vcard, setVcard] = useState({ name: "", phone: "", email: "", org: "" });
  const [fg, setFg] = useState("#0f172a");
  const [bg, setBg] = useState("#ffffff");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(() => {
    switch (mode) {
      case "url":
        return url.trim();
      case "text":
        return text;
      case "wifi":
        return wifi.ssid
          ? `WIFI:T:${wifi.encryption};S:${escapeWifi(wifi.ssid)};P:${escapeWifi(wifi.password)};${wifi.hidden ? "H:true;" : ""};`
          : "";
      case "vcard":
        return vcard.name || vcard.phone || vcard.email
          ? `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nORG:${vcard.org}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nEND:VCARD`
          : "";
    }
  }, [mode, url, text, wifi, vcard]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!payload) {
        if (!cancelled) {
          setDataUrl("");
          setError(null);
        }
        return;
      }
      try {
        const d = await QRCode.toDataURL(payload, {
          errorCorrectionLevel: "M",
          margin: 2,
          width: 512,
          color: { dark: fg, light: bg },
        });
        if (!cancelled) {
          setDataUrl(d);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("This content is too long for a QR code.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [payload, fg, bg]);

  const downloadPng = async () => {
    if (!payload) return;
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, "qr-code.png");
  };

  const downloadSvg = async () => {
    if (!payload) return;
    const svg = await QRCode.toString(payload, { type: "svg", margin: 2, color: { dark: fg, light: bg } });
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "qr-code.svg");
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["url", "text", "wifi", "vcard"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="rounded-lg px-3 py-2 text-sm font-semibold uppercase"
              style={{ background: mode === m ? "var(--brand)" : "var(--surface-2)", color: mode === m ? "#fff" : "var(--foreground)", border: "1px solid var(--border)" }}
            >
              {m === "vcard" ? "vCard" : m}
            </button>
          ))}
        </div>

        {mode === "url" && (
          <div>
            <label className="label">Website URL</label>
            <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
        )}
        {mode === "text" && (
          <div>
            <label className="label">Text</label>
            <textarea className="input scroll-thin" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text to encode" />
          </div>
        )}
        {mode === "wifi" && (
          <div className="space-y-3">
            <div>
              <label className="label">Network name (SSID)</label>
              <input className="input" value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} />
            </div>
            <div>
              <label className="label">Security</label>
              <select className="input" value={wifi.encryption} onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={wifi.hidden} onChange={(e) => setWifi({ ...wifi, hidden: e.target.checked })} className="accent-[var(--brand)]" />
              Hidden network
            </label>
          </div>
        )}
        {mode === "vcard" && (
          <div className="space-y-3">
            <div><label className="label">Full name</label><input className="input" value={vcard.name} onChange={(e) => setVcard({ ...vcard, name: e.target.value })} /></div>
            <div><label className="label">Phone</label><input className="input" value={vcard.phone} onChange={(e) => setVcard({ ...vcard, phone: e.target.value })} /></div>
            <div><label className="label">Email</label><input className="input" value={vcard.email} onChange={(e) => setVcard({ ...vcard, email: e.target.value })} /></div>
            <div><label className="label">Organization</label><input className="input" value={vcard.org} onChange={(e) => setVcard({ ...vcard, org: e.target.value })} /></div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Foreground</label>
            <input type="color" className="h-10 w-full rounded-lg" value={fg} onChange={(e) => setFg(e.target.value)} />
          </div>
          <div>
            <label className="label">Background</label>
            <input type="color" className="h-10 w-full rounded-lg" value={bg} onChange={(e) => setBg(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="grid aspect-square w-full max-w-xs place-items-center rounded-xl p-4 card">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="Generated QR code" className="h-full w-full object-contain" />
          ) : (
            <p className="text-center text-sm text-[var(--muted)]">{error || "Enter details to generate your QR code"}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={downloadPng} disabled={!dataUrl}>⬇ PNG</button>
          <button className="btn btn-secondary" onClick={downloadSvg} disabled={!dataUrl}>⬇ SVG</button>
        </div>
      </div>
    </div>
  );
}
