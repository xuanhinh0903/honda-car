import { NextResponse } from "next/server";
import path from "path";
import { requireAdmin } from "@/lib/admin-api";
import { saveUpload, UploadStorageError } from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string | null)?.trim() || "images";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const safeName = path.basename(file.name).replace(/[^a-zA-Z0-9._-]/g, "-");
  const buffer = Buffer.from(await file.arrayBuffer());
  const segments = folder.split("/").filter(Boolean);

  try {
    const uploadPath = await saveUpload(buffer, segments, safeName);
    return NextResponse.json({ ok: true, path: uploadPath });
  } catch (err) {
    if (err instanceof UploadStorageError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    console.error("[upload]", err);
    return NextResponse.json(
      { error: "Upload thất bại. Thử lại sau." },
      { status: 500 }
    );
  }
}
