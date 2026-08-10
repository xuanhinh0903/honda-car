export interface Lead {
  id: string;
  type: "test-drive" | "quote" | "contact";
  name: string;
  phone: string;
  email?: string;
  car?: string;
  date?: string;
  subject?: string;
  message?: string;
  createdAt: string;
}

export const LEAD_TYPE_LABELS: Record<Lead["type"], string> = {
  "test-drive": "Đăng ký lái thử",
  quote: "Yêu cầu báo giá",
  contact: "Liên hệ",
};
