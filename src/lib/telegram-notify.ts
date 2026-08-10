import "server-only";

import type { Lead } from "./leads-shared";

const TELEGRAM_API = "https://api.telegram.org";
const REQUEST_TIMEOUT_MS = 8000;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isTelegramConfigured(): boolean {
  return Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
  );
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN");
}

export function buildTelegramMessage(lead: Lead): string {
  const lines: string[] = [];

  lines.push("<b>🔔 KHÁCH HÀNG MỚI</b>");
  lines.push("");
  lines.push(`👤 Họ tên: ${escapeHtml(lead.name)}`);
  lines.push(`📞 Số điện thoại: ${escapeHtml(lead.phone)}`);

  if (lead.car) {
    lines.push(`🚗 Xe quan tâm: ${escapeHtml(lead.car)}`);
  }
  if (lead.email) {
    lines.push(`📧 Email: ${escapeHtml(lead.email)}`);
  }
  if (lead.date) {
    lines.push(`📅 Ngày hẹn: ${escapeHtml(lead.date)}`);
  }
  if (lead.subject) {
    lines.push(`🏷 Tiêu đề: ${escapeHtml(lead.subject)}`);
  }
  if (lead.message) {
    lines.push("");
    lines.push(`💬 Nội dung:`);
    lines.push(escapeHtml(lead.message));
  }

  lines.push("");
  lines.push(`⏰ Thời gian: ${formatTime(lead.createdAt)}`);

  return lines.join("\n");
}

export async function sendTelegramNotification(
  lead: Lead
): Promise<"sent" | "failed" | "skipped"> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return "skipped";

  const url = `${TELEGRAM_API}/bot${token}/sendMessage`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage(lead),
        parse_mode: "HTML",
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error(
        `[telegram] sendMessage HTTP ${res.status} (chat_id không được log)`
      );
      return "failed";
    }

    const data = (await res.json()) as { ok?: boolean };
    if (!data.ok) {
      console.error("[telegram] sendMessage trả về ok=false");
      return "failed";
    }

    return "sent";
  } catch (err) {
    console.error(
      "[telegram] sendMessage lỗi:",
      err instanceof Error ? err.message : "unknown"
    );
    return "failed";
  }
}
