import "server-only";

import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IS_VERCEL = process.env.VERCEL === "1";

export class UploadStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadStorageError";
  }
}

function assertInside(base: string, target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(base) + path.sep)) {
    throw new Error("Invalid path");
  }
  return resolved;
}

function uniqueFileName(fileName: string) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext) || "image";
  return `${base}-${Date.now()}${ext}`;
}

function contentTypeFor(fileName: string) {
  const ext = path.extname(fileName).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".avif":
      return "image/avif";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

/**
 * Persist an upload and return a publicly reachable URL/path.
 * On Vercel, Vercel Blob is required — filesystem/tmp is ephemeral and will not display.
 */
export async function saveUpload(
  buffer: Buffer,
  segments: string[],
  fileName: string
): Promise<string> {
  const name = uniqueFileName(fileName);
  const blobPath = `uploads/${path.posix.join(...segments, name)}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(blobPath, buffer, {
        access: "public",
        addRandomSuffix: false,
        contentType: contentTypeFor(name),
      });
      return blob.url;
    } catch (err) {
      console.error(
        "[upload] Vercel Blob thất bại:",
        err instanceof Error ? err.message : "unknown"
      );
      if (IS_VERCEL) {
        throw new UploadStorageError(
          "Upload Blob thất bại. Kiểm tra BLOB_READ_WRITE_TOKEN trên Vercel."
        );
      }
      // Local: fall through to filesystem so admin still works without Blob
    }
  }

  if (IS_VERCEL) {
    throw new UploadStorageError(
      "Trên Vercel cần cấu hình BLOB_READ_WRITE_TOKEN (Vercel Blob). File hệ thống tạm không tồn tại giữa các request — ảnh sẽ không hiển thị."
    );
  }

  const filePath = assertInside(
    PUBLIC_DIR,
    path.join(PUBLIC_DIR, ...segments, name)
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return `/api/uploads/${path.posix.join(...segments, name)}`;
}

export function resolveUploadFile(segments: string[]): string | null {
  try {
    const filePath = assertInside(
      PUBLIC_DIR,
      path.join(PUBLIC_DIR, ...segments)
    );
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  } catch {
    return null;
  }
  return null;
}
