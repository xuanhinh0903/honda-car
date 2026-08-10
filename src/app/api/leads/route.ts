import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { addLead, deleteLead, getLeads } from "@/lib/leads";
import type { Lead } from "@/lib/leads-shared";

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;
  return NextResponse.json({ leads: await getLeads() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<Lead>;

  const type = body.type;
  const name = body.name?.trim() ?? "";
  const phone = body.phone?.trim() ?? "";

  if (type !== "test-drive" && type !== "quote" && type !== "contact") {
    return NextResponse.json({ error: "Loại đăng ký không hợp lệ" }, { status: 400 });
  }
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Vui lòng nhập họ tên và số điện thoại" },
      { status: 400 }
    );
  }

  await addLead({
    type,
    name,
    phone,
    email: body.email?.trim() || undefined,
    car: body.car?.trim() || undefined,
    date: body.date || undefined,
    subject: body.subject?.trim() || undefined,
    message: body.message?.trim() || undefined,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
