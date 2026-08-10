"use client";

import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { useState } from "react";

export function AdminField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-charcoal">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AdminSectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="border-b border-border/60 pb-5">
      <h2 className="text-xl font-semibold tracking-tight text-charcoal">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Đang tải dữ liệu...</span>
    </div>
  );
}

export function AdminSaveBar({
  onSave,
  saving,
  label = "Lưu thay đổi",
}: {
  onSave: () => void;
  saving?: boolean;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 -mx-6 -mb-6 mt-8 flex items-center justify-end gap-3 border-t border-border/60 bg-white/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-honda-red px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-honda-red-hover disabled:opacity-60"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {saving ? "Đang lưu..." : label}
      </button>
    </div>
  );
}

export function ImageField({
  value,
  onChange,
  uploadFolder = "images",
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  uploadFolder?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const toastId = adminToast.loading("Đang upload ảnh...");
    try {
      const path = await uploadImage(file, uploadFolder);
      onChange(path);
      adminToast.dismiss(toastId);
      adminToast.success("Upload thành công");
    } catch (err) {
      adminToast.dismiss(toastId);
      adminToast.error(
        "Upload thất bại",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50">
        {uploading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-5 w-5 text-muted-foreground" />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          {uploading ? "Đang tải lên..." : "Bấm để chọn ảnh (tải lên máy chủ)"}
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
      </label>
      {value ? (
        <div className="flex items-center justify-center rounded-xl border border-border/60 bg-muted/40 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="max-h-48 w-auto max-w-full rounded-lg object-contain shadow-sm"
          />
        </div>
      ) : null}
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
