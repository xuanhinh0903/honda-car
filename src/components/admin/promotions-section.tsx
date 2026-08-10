"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminLoading, AdminSaveBar } from "./admin-ui";
import { CollectionEditor } from "./collection-editor";
import type { Promotion } from "@/lib/types";

export function PromotionsSection() {
  const [items, setItems] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ items: Promotion[] }>("/api/admin/data?key=promotions")
      .then((data) => setItems(data.items))
      .catch((err: Error) =>
        adminToast.error("Không tải được dữ liệu", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await adminFetch("/api/admin/data", {
        method: "PUT",
        body: JSON.stringify({ key: "promotions", data: items }),
      });
      adminToast.success("Đã lưu khuyến mại");
    } catch (err) {
      adminToast.error(
        "Lưu thất bại",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <CollectionEditor
        items={items as unknown as Record<string, unknown>[]}
        fields={[
          {
            key: "id",
            label: "Mã chương trình",
            type: "text",
            hint: "Ví dụ: promo-1",
          },
          { key: "title", label: "Tiêu đề", type: "text" },
          { key: "description", label: "Mô tả", type: "textarea" },
          { key: "badge", label: "Nhãn", type: "text", placeholder: "Hot, Mới..." },
          { key: "validUntil", label: "Hạn đến ngày", type: "text", placeholder: "2026-12-31" },
        ]}
        onChange={(next) => setItems(next as unknown as Promotion[])}
        newItem={() => ({
          id: `promo-${Date.now()}`,
          title: "",
          description: "",
          badge: "",
          validUntil: "",
        })}
        itemLabel={(item) => String(item.title ?? "")}
        addLabel="Thêm khuyến mại"
      />
      <AdminSaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}
