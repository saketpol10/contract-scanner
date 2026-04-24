"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface Props {
  onAnalyze: (text: string) => void;
  loading: boolean;
  error: string | null;
}

export default function ContractUpload({ onAnalyze, loading, error }: Props) {
  const [text, setText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-pdf", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setText(data.text);
        setFileName(file.name);
      }
    } else if (file.type === "text/plain") {
      const content = await file.text();
      setText(content);
      setFileName(file.name);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleSubmit() {
    if (text.trim().length > 0) onAnalyze(text);
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${dragging
            ? "border-blue-500 bg-blue-500/5"
            : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
          }
        `}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={handleFileInput}
        />
        <div className="text-4xl mb-3">📄</div>
        {fileName ? (
          <p className="text-blue-400 font-medium">{fileName} loaded</p>
        ) : (
          <>
            <p className="text-gray-300 font-medium">Drop your offer letter here</p>
            <p className="text-gray-500 text-sm mt-1">PDF or TXT — or click to browse</p>
          </>
        )}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-gray-600 text-sm">or paste text</span>
        <div className="flex-1 h-px bg-gray-800" />
      </div>

      {/* Text area */}
      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setFileName(null); }}
        placeholder="Paste your offer letter or employment contract here..."
        rows={10}
        className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500 transition-colors text-sm font-mono"
      />

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading || text.trim().length < 100}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing contract...
          </span>
        ) : (
          "Analyze Contract →"
        )}
      </button>

      <p className="text-center text-gray-600 text-xs">
        Your contract is never stored. Analyzed and discarded immediately.
      </p>
    </div>
  );
}
