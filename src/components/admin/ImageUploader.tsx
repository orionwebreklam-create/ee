"use client";

import { useState, useRef } from "react";
import { Upload, X, Check, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  helperText?: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  aspectRatio?: "square" | "banner";
}

export default function ImageUploader({
  label,
  helperText = "PNG, JPG veya WEBP formatında görsel yükleyin",
  currentImageUrl,
  onImageUploaded,
  aspectRatio = "square"
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>(currentImageUrl || "");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Lütfen geçerli bir görsel dosyası seçin (JPG, PNG, WEBP).");
      return;
    }

    setError("");
    setIsUploading(true);

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setPreview(data.url);
        onImageUploaded(data.url);
      } else {
        setError(data.error || "Yükleme başarısız oldu.");
      }
    } catch (err) {
      console.error(err);
      setError("Görsel yüklenirken bir bağlantı hatası oluştu.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview("");
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold text-neutral-300">{label}</label>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            <span>Kaldır</span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Drop Zone / Preview Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 ${
          dragActive
            ? "border-amber-400 bg-amber-500/10"
            : "border-neutral-800 bg-neutral-950/80 hover:border-neutral-700 hover:bg-neutral-900/60"
        } ${aspectRatio === "banner" ? "min-h-[160px]" : "min-h-[140px]"}`}
      >
        {preview ? (
          <div className="relative w-full h-full flex flex-col items-center">
            {/* Image Preview */}
            <div className={`relative w-full rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center ${
              aspectRatio === "banner" ? "h-36 sm:h-44" : "h-32"
            }`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Yüklenen Görsel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-lg bg-neutral-900/90 text-white text-xs font-bold shadow-lg border border-neutral-700 flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Değiştirmek İçin Tıkla</span>
                </span>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
              <Check className="h-3.5 w-3.5" />
              <span>Görsel Yüklendi ve Hazır</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-amber-400 mb-2 border border-neutral-800">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <p className="text-xs font-bold text-white mb-0.5">
              {isUploading ? "Görsel Sunucuya Yükleniyor..." : "Görsel Seçin veya Buraya Sürükleyin"}
            </p>
            <p className="text-[10px] text-neutral-500">{helperText}</p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-amber-400 mb-2" />
            <span className="text-xs font-bold text-white">Yükleniyor...</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-red-400 font-semibold mt-1">{error}</p>
      )}
    </div>
  );
}
