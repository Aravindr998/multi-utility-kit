"use client";

import { useState } from "react";
import FileDropzone from "@/components/FileDropzone";
import ResultCard from "@/components/ResultCard";
import ProgressIndicator from "@/components/ProgressIndicator";
import PdfThumbnail from "@/components/PdfThumbnail";
import { downloadBlob, formatBytes } from "@/lib/format";

export default function PdfProtect() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setPassword("");
    setConfirm("");
    setResult(null);
    setError(null);
  };

  const onFiles = (files: File[]) => {
    reset();
    setFile(files[0]);
  };

  const run = async () => {
    if (!file) return;
    if (password.length < 1) { setError("Please enter a password."); return; }
    if (password !== confirm) { setError("The passwords don't match."); return; }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const { PDFDocument } = await import("@cantoo/pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer());
      doc.encrypt({ userPassword: password, ownerPassword: password });
      const saved = await doc.save();
      setResult({
        blob: new Blob([saved as BlobPart], { type: "application/pdf" }),
        name: file.name.replace(/\.pdf$/i, "") + "-protected.pdf",
      });
    } catch (e) {
      setError(e instanceof Error ? `Could not protect this PDF: ${e.message}` : "Could not protect this PDF. If it is already encrypted, unlock it first.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {!file && (
        <FileDropzone accept="application/pdf" onFiles={onFiles} icon="🔒" label="Drop a PDF to password-protect" hint="Encrypts the file so a password is needed to open it" />
      )}

      {file && (
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <PdfThumbnail file={file} width={48} />
              <p className="truncate font-medium">{file.name}</p>
            </div>
            <button className="btn btn-secondary" onClick={reset}>Change</button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="pw">Password</label>
              <input id="pw" type={show ? "text" : "password"} className="input" value={password} onChange={(e) => { setPassword(e.target.value); setResult(null); }} placeholder="Choose a password" autoComplete="new-password" />
            </div>
            <div>
              <label className="label" htmlFor="pw2">Confirm password</label>
              <input id="pw2" type={show ? "text" : "password"} className="input" value={confirm} onChange={(e) => { setConfirm(e.target.value); setResult(null); }} placeholder="Re-enter the password" autoComplete="new-password" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} className="accent-[var(--brand)]" />
              Show passwords
            </label>
          </div>

          <p className="mt-3 rounded-lg p-3 text-xs text-[var(--muted)]" style={{ background: "var(--surface-2)" }}>
            🔐 Everything runs in your browser — your file and password never leave your device. There is no way to recover a lost password, so store it somewhere safe.
          </p>

          <div className="mt-4">
            {busy ? <ProgressIndicator label="Encrypting…" /> : <button className="btn btn-primary" onClick={run}>Protect PDF</button>}
          </div>
        </div>
      )}

      {error && (
        <p className="rounded-lg p-3 text-sm" style={{ background: "color-mix(in srgb, var(--danger) 12%, transparent)", color: "var(--danger)" }}>{error}</p>
      )}

      {result && (
        <ResultCard
          title="PDF protected"
          stats={[{ label: "Status", value: "Password required" }, { label: "Size", value: formatBytes(result.blob.size) }]}
          onDownload={() => downloadBlob(result.blob, result.name)}
          downloadLabel="Download protected PDF"
          onReset={reset}
        />
      )}
    </div>
  );
}
