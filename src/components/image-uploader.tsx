"use client";

import { useState, useRef, useCallback } from "react";

interface Props {
  name: string;
  label: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
}

export function ImageUploader({ name, label, defaultValue, accept = "image/*", placeholder }: Props) {
  const [value, setValue] = useState(defaultValue || "");
  const [preview, setPreview] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = (path: string) => /\.(mp4|mov|webm)$/i.test(path);

  const upload = useCallback(async (file: File) => {
    setError("");
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      setValue(data.path);
      setPreview(data.path);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }, [upload]);

  const handleClear = () => {
    setValue("");
    setPreview("");
    setError("");
  };

  return (
    <div className="adm__field adm__field--full">
      <label>{label}</label>
      <input type="hidden" name={name} value={value} />

      <div
        className="adm__dropzone"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "#6366f1" : error ? "#ef4444" : "#d1d5db"}`,
          borderRadius: 8,
          padding: preview ? 0 : "1.5rem 1rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragOver ? "rgba(99,102,241,0.04)" : "transparent",
          transition: "all 0.15s",
          position: "relative",
          overflow: "hidden",
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {uploading ? (
          <div style={{ color: "#6366f1", fontSize: "0.85rem" }}>
            <div style={{ marginBottom: 4 }}>Uploading...</div>
            <div style={{ width: 40, height: 40, border: "3px solid #e5e7eb", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />
          </div>
        ) : preview ? (
          <div style={{ position: "relative", width: "100%" }}>
            {isVideo(preview) ? (
              <video src={preview} style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6 }} />
            ) : (
              <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 6 }} />
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleClear(); }}
              style={{
                position: "absolute", top: 6, right: 6,
                width: 24, height: 24, borderRadius: "50%",
                background: "rgba(0,0,0,0.6)", color: "#fff",
                border: "none", cursor: "pointer", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "rgba(0,0,0,0.5)", color: "#fff",
              fontSize: "0.75rem", padding: "4px 8px",
              borderRadius: "0 0 6px 6px",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {value}
            </div>
          </div>
        ) : (
          <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: 4 }}>📁</div>
            <div>Drag & drop or <span style={{ color: "#6366f1", textDecoration: "underline" }}>browse</span></div>
            <div style={{ fontSize: "0.75rem", marginTop: 4, opacity: 0.7 }}>
              {placeholder || "JPEG, PNG, WebP, MP4"}
            </div>
          </div>
        )}
      </div>

      {error && <div style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: 4 }}>{error}</div>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
