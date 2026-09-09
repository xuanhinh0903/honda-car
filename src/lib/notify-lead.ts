import "server-only";

import { LEAD_TYPE_LABELS, type Lead } from "./leads-shared";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatLeadText(lead: Lead) {
  const lines = [
    `Loại: ${LEAD_TYPE_LABELS[lead.type]}`,
    `Họ tên: ${lead.name}`,
    `Số điện thoại: ${lead.phone}`,
  ];
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.car) lines.push(`Dòng xe: ${lead.car}`);
  if (lead.date) lines.push(`Ngày hẹn: ${lead.date}`);
  if (lead.subject) lines.push(`Chủ đề: ${lead.subject}`);
  if (lead.message) lines.push(`Nội dung: ${lead.message}`);
  lines.push(`Thời gian: ${new Date(lead.createdAt).toLocaleString("vi-VN")}`);
  return lines.join("\n");
}

function formatLeadHtml(lead: Lead) {
  const rows: Array<[string, string]> = [
    ["Loại", LEAD_TYPE_LABELS[lead.type]],
    ["Họ tên", lead.name],
    ["Số điện thoại", lead.phone],
  ];
  if (lead.email) rows.push(["Email", lead.email]);
  if (lead.car) rows.push(["Dòng xe", lead.car]);
  if (lead.date) rows.push(["Ngày hẹn", lead.date]);
  if (lead.subject) rows.push(["Chủ đề", lead.subject]);
  if (lead.message) rows.push(["Nội dung", lead.message]);
  rows.push([
    "Thời gian",
    new Date(lead.createdAt).toLocaleString("vi-VN"),
  ]);

  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;background:#f9fafb">${escapeHtml(label)}</td><td style="padding:8px 12px;border:1px solid #e5e7eb">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#111">
      <h2 style="margin:0 0 12px;color:#cc0000">Honda Tiến Đạt — Lead mới</h2>
      <p style="margin:0 0 16px">Có khách vừa gửi biểu mẫu trên website.</p>
      <table style="border-collapse:collapse;width:100%">${body}</table>
    </div>
  `;
}

/** Fire-and-forget email via Resend free tier. Never throws to caller. */
export async function notifyLeadByEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.LEAD_NOTIFY_EMAIL?.trim();

  if (!apiKey || !to) {
    console.warn(
      "[notify-lead] Bỏ qua gửi email: thiếu RESEND_API_KEY hoặc LEAD_NOTIFY_EMAIL (cần thêm trên Vercel → Settings → Environment Variables)"
    );
    return;
  }

  const from =
    process.env.LEAD_NOTIFY_FROM?.trim() ||
    "Honda Tiến Đạt <onboarding@resend.dev>";
  const subject = `[Honda Tiến Đạt] ${LEAD_TYPE_LABELS[lead.type]} — ${lead.name}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: formatLeadText(lead),
        html: formatLeadHtml(lead),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[notify-lead] Resend error:", res.status, detail);
    }
  } catch (error) {
    console.error("[notify-lead] Failed to send email:", error);
  }
}
