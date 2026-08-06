"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import { downloadBlob, formatBytes } from "@/lib/format";

export default function PdfUnlock() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPassword("");
    setResult(null);
    setError(null);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const { PDFDocument } = await import("@cantoo/pdf-lib");
      // With a password we decrypt using it; without one we handle
      // owner-only (permissions) locks that open without a password.
      const doc = await PDFDocument.load(
        await file.arrayBuffer(),
        password ? { password } : { ignoreEncryption: true },
      );
      const saved = await doc.save();
      setResult({
        blob: new Blob([saved as BlobPart], { type: "application/pdf" }),
        name: file.name.replace(/\.pdf$/i, "") + "-unlocked.pdf",
      });
    } catch {
      setError(
        password
          ? "Incorrect password, or this PDF uses an encryption type we can't remove."
          : "This PDF needs a password to open. Enter it above and try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="🔓" label="Drop a password-protected PDF to unlock" hint="Removes the password so it opens freely" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 truncate font-medium">📄 {file.name}</p>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="pw">Password <span className="font-normal text-[var(--muted)]">(leave blank for permission-only locks)</span></label>
              <input id="pw" type={show ? "text" : "password"} className="input" value={password} onChange={(e) => { setPassword(e.target.value); setResult(null); }} placeholder="Current PDF password" autoComplete="off" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-[var(--brand)]" />
              Show password
            </label>
          </div>

          <p className="mt-3 rounded-lg p-3 text-xs text-[var(--muted)]" style={{ background: "var(--surface-2)" }}>
            🔐 Your file and password never leave your device. Only unlock PDFs you own or have permission to modify.
          </p>

          <div className="mt-4">
            {busy ? <ProgressIndicator label="Removing protection…" /> : <button className="btn btn-primary" onClick={run}>Unlock PDF</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="PDF unlocked"
          stats={[{ label: "Status", value: "No password" }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download unlocked PDF"
          onReset={reset}
        />
      )}
    </div>
  );
}
