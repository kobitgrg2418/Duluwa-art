"use client";

import { useState, useRef, useCallback } from "react";

interface Props {
  name: string;
  label: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
}

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.75;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Videos can't be compressed client-side — just convert to base64
    if (file.type.startsWith("video/")) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = Math.round(width * (MAX_HEIGHT / height));
        height = MAX_HEIGHT;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", QUALITY);
      resolve(dataUrl);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Failed to load image")); };
    img.src = url;
  });
}

export function ImageUploader({ name, label, defaultValue, accept = "image/*", placeholder }: Props) {
  const [value, setValue] = useState(defaultValue || "");
  const [preview, setPreview] = useState(defaultValue || "");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isVideo = (path: string) => /\.(mp4|mov|webm)$/i.test(path) || path.startsWith("data:video/");

  const upload = useCallback(async (file: File) => {
    setError("");
    setUploading(true);

    try {
      const dataUrl = await compressImage(file);

      // Check compressed size (base64 is ~4/3 of original)
      const sizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);
      if (sizeKB > 800) {
        setError(`Image still too large after compression (${sizeKB}KB). Try a smaller image.`);
        return;
      }

      setValue(dataUrl);
      setPreview(dataUrl);
    } catch (err) {
      setError("Failed to process: " + (err instanceof Error ? err.message : "unknown error"));
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
            <div style={{ marginBottom: 4 }}>Processing...</div>
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
          </div>
        ) : (
          <div style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 4 }}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <div>Drag & drop or <span style={{ color: "#6366f1", textDecoration: "underline" }}>browse</span></div>
            <div style={{ fontSize: "0.75rem", marginTop: 4, opacity: 0.7 }}>
              {placeholder || "JPEG, PNG, WebP"}
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
