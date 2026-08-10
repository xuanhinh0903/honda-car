import "server-only";

import fs from "fs";
import os from "os";
import path from "path";

const IS_SERVERLESS = process.env.VERCEL === "1";
const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = IS_SERVERLESS
  ? path.join(os.tmpdir(), "honda-car-uploads")
  : PUBLIC_DIR;

function assertInside(base: string, target: string) {
  const resolved = path.resolve(target);
  if (!resolved.startsWith(path.resolve(base) + path.sep)) {
    throw new Error("Invalid path");
  }
  return resolved;
}

export async function saveUpload(
  buffer: Buffer,
  segments: string[],
  fileName: string
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(
        `uploads/${path.posix.join(...segments, fileName)}`,
        buffer,
        { access: "public" }
      );
      return blob.url;
    } catch (err) {
      console.error(
        "[upload] Vercel Blob thất bại, fallback về storage tạm:",
        err instanceof Error ? err.message : "unknown"
      );
    }
  }

  const filePath = assertInside(
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, ...segments, fileName)
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  return `/api/uploads/${path.posix.join(...segments, fileName)}`;
}

export function resolveUploadFile(segments: string[]): string | null {
  for (const base of [UPLOAD_DIR, PUBLIC_DIR]) {
    const filePath = assertInside(base, path.join(base, ...segments));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }
  return null;
}
