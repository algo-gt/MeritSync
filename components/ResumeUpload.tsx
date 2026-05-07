"use client";

import { useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";

const ACCEPTED_FILE_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const EXTENSIONS = ["pdf", "docx"];

export default function ResumeUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const handleFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!file.type || !ACCEPTED_FILE_TYPES.includes(file.type) || !extension || !EXTENSIONS.includes(extension)) {
      setStatus("Please upload a .pdf or .docx resume.");
      return;
    }
    setSelectedFile(file);
    setStatus(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setStatus("Choose a file before uploading.");
      return;
    }

    setBusy(true);
    setStatus("Scanning and uploading resume...");
    const formData = new FormData();
    formData.append("resume", selectedFile);
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setBusy(false);
      if (xhr.status === 200) {
        setStatus("Resume uploaded successfully. Processing started.");
      } else {
        setStatus("Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setBusy(false);
      setStatus("Upload failed due to a network error.");
    };

    xhr.open("POST", "/api/resume/upload");
    xhr.send(formData);
  };

  const progressLabel = useMemo(() => {
    if (!busy) return "Ready to upload";
    if (uploadProgress < 100) return `Uploading ${uploadProgress}%`;
    return "Finalizing scan...";
  }, [busy, uploadProgress]);

  return (
    <section className="rounded-[2rem] border border-slate-800/90 bg-slate-900/80 p-8">
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-slate-100">Resume ingestion</h2>
          <p className="text-sm leading-6 text-slate-400">
            Drop a PDF or DOCX resume to initialize your private storage upload and notify the AI parser.
          </p>
        </div>

        <div
          ref={dropRef}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          className="rounded-[1.75rem] border border-dashed border-slate-700/80 bg-slate-950/80 p-8 text-center transition hover:border-slate-500"
        >
          <p className="text-slate-300">Drag and drop your resume here, or use the file selector.</p>
          <input
            type="file"
            accept=".pdf,.docx"
            className="mt-4 w-full cursor-pointer text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {selectedFile ? (
          <div className="rounded-3xl border border-slate-800/90 bg-slate-950/80 p-4 text-sm text-slate-300">
            <strong>Selected file:</strong> {selectedFile.name}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleUpload}
            disabled={busy || !selectedFile}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upload resume
          </button>
          <span className="text-sm text-slate-400">{progressLabel}</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>

        {status ? <p className="text-sm text-slate-300">{status}</p> : null}
      </div>
    </section>
  );
}
