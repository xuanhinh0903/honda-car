import type { Lead } from "./leads-shared";
import { LEAD_TYPE_LABELS } from "./leads-shared";

export function isZaloConfigured(): boolean {
  return Boolean(process.env.ZALO_OA_ACCESS_TOKEN);
}

function buildLeadText(lead: Lead): string {
  const lines = [
    `📩 ${LEAD_TYPE_LABELS[lead.type]}`,
    `👤 Họ tên: ${lead.name}`,
    `📱 SĐT: ${lead.phone}`,
  ];
  if (lead.email) lines.push(`📧 Email: ${lead.email}`);
  if (lead.car) lines.push(`🚗 Xe quan tâm: ${lead.car}`);
  if (lead.date) lines.push(`📅 Ngày: ${lead.date}`);
  if (lead.subject) lines.push(`🏷 Tiêu đề: ${lead.subject}`);
  if (lead.message) lines.push(`📝 Nội dung: ${lead.message}`);
  lines.push(`🕒 Lúc: ${new Date(lead.createdAt).toLocaleString("vi-VN")}`);
  return lines.join("\n");
}

async function sendZnsNotification(lead: Lead): Promise<void> {
  const token = process.env.ZALO_OA_ACCESS_TOKEN!;
  const templateId = process.env.ZALO_ZNS_TEMPLATE_ID;
  const phone = process.env.ZALO_NOTIFY_PHONE;

  if (!templateId || !phone) {
    throw new Error(
      "Thiếu ZALO_ZNS_TEMPLATE_ID hoặc ZALO_NOTIFY_PHONE trong biến môi trường"
    );
  }

  const res = await fetch(
    "https://business.openapi.zalo.me/v3.0/zns/notification/template/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
      },
      body: JSON.stringify({
        phone,
        template_id: templateId,
        template_data: {
          type: LEAD_TYPE_LABELS[lead.type],
          name: lead.name,
          phone: lead.phone,
          car: lead.car ?? "",
          message: lead.message ?? "",
          time: new Date(lead.createdAt).toLocaleString("vi-VN"),
        },
      }),
    }
  );

  const data = await res.json();
  if (data.error !== 0) {
    throw new Error(`Zalo ZNS lỗi: ${data.message ?? res.status}`);
  }
}

async function sendTextMessage(lead: Lead): Promise<void> {
  const token = process.env.ZALO_OA_ACCESS_TOKEN!;
  const recipientUserId = process.env.ZALO_OA_RECIPIENT_USER_ID;

  if (!recipientUserId) {
    throw new Error("Thiếu ZALO_OA_RECIPIENT_USER_ID trong biến môi trường");
  }

  const res = await fetch(
    "https://openapi.zalo.me/v3.0/message/officialaccount/send/text",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: token,
      },
      body: JSON.stringify({
        recipient: { user_id: recipientUserId },
        message: { text: buildLeadText(lead) },
      }),
    }
  );

  const data = await res.json();
  if (data.error !== 0) {
    throw new Error(`Zalo lỗi: ${data.message ?? res.status}`);
  }
}

export async function notifyLead(
  lead: Lead
): Promise<"sent" | "failed" | "skipped"> {
  if (!isZaloConfigured()) return "skipped";
  try {
    if (process.env.ZALO_ZNS_TEMPLATE_ID) {
      await sendZnsNotification(lead);
    } else {
      await sendTextMessage(lead);
    }
    return "sent";
  } catch {
    return "failed";
  }
}
