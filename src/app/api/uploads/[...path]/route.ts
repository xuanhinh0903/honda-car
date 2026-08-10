import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { resolveUploadFile } from "@/lib/uploads";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const segments = (await context.params).path;

  if (
    segments.some(
      (segment) =>
        !segment || segment === ".." || segment.includes("\\") || segment.includes("..")
    )
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  let filePath: string;
  try {
    const resolved = resolveUploadFile(segments);
    if (!resolved) {
      return new NextResponse("Not found", { status: 404 });
    }
    filePath = resolved;
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
