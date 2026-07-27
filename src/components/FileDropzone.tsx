"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  /** e.g. "image/*" or "application/pdf" */
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
  icon?: string;
};

export default function FileDropzone({
  accept,
  multiple = false,
  onFiles,
  label = "Drop your file here",
  hint = "or click to browse",
  icon = "📁",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | null) => {
      if (!list || list.length === 0) return;
      const files = Array.from(list);
      onFiles(multiple ? files : [files[0]]);
    },
    [multiple, onFiles],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors"
      style={{
        borderColor: dragging ? "var(--brand)" : "var(--border)",
        background: dragging ? "var(--brand-soft)" : "var(--surface-2)",
      }}
    >
      <div className="mb-3 text-4xl" aria-hidden>
        {icon}
      </div>
      <p className="font-semibold">{label}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
