import { NextResponse } from "next/server";
import {
  addLead,
  updateLeadNotification,
  updateLeadTelegram,
} from "@/lib/leads";
import { sendTelegramNotification } from "@/lib/telegram-notify";
import { notifyLead } from "@/lib/zalo-notify";

const MAX_LENGTHS = {
  name: 100,
  phone: 20,
  email: 100,
  car: 200,
  date: 20,
  subject: 200,
  message: 2000,
};

// TODO: project chưa có cơ chế rate limit. Nếu cần chống spam, thêm rate limit
// (VD: giới hạn IP theo phút) trước khi deploy công khai — không tự thêm dependency lớn.

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Dữ liệu gửi lên không hợp lệ" },
      { status: 400 }
    );
  }

  const name = asString(body.name);
  const phone = asString(body.phone);
  // Hỗ trợ cả "vehicle" (theo spec) và "car" (tên field hiện có của form)
  const car = asString(body.vehicle) || asString(body.car);
  const message = asString(body.message);
  const email = asString(body.email);
  const date = asString(body.date);
  const subject = asString(body.subject);
  const rawType = asString(body.type);

  if (!name || !phone) {
    return NextResponse.json(
      { success: false, message: "Vui lòng nhập họ tên và số điện thoại" },
      { status: 400 }
    );
  }

  const overLimit = Object.entries({
    name,
    phone,
    car,
    message,
    email,
    date,
    subject,
  }).some(([key, value]) => value.length > MAX_LENGTHS[key as keyof typeof MAX_LENGTHS]);

  if (overLimit) {
    return NextResponse.json(
      { success: false, message: "Thông tin vượt quá độ dài cho phép" },
      { status: 400 }
    );
  }

  const type =
    rawType === "test-drive" || rawType === "quote" ? rawType : "contact";

  const lead = addLead({
    type,
    name,
    phone,
    email: email || undefined,
    car: car || undefined,
    date: date || undefined,
    subject: subject || undefined,
    message: message || undefined,
  });

  // Telegram notification — chạy server-side, thất bại không làm hỏng đăng ký
  const telegramStatus = await sendTelegramNotification(lead);
  updateLeadTelegram(lead.id, telegramStatus);

  // Giữ nguyên kênh Zalo hiện có
  const zaloStatus = await notifyLead(lead);
  updateLeadNotification(lead.id, zaloStatus);

  if (telegramStatus === "failed" || zaloStatus === "failed") {
    console.error(
      `[leads] notification thất bại — lead ${lead.id} (telegram: ${telegramStatus}, zalo: ${zaloStatus})`
    );
  }

  // Đăng ký đã lưu thành công; notification không phải điều kiện bắt buộc
  return NextResponse.json({ success: true, notification: telegramStatus });
}
