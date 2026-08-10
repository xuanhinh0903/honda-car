"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminLoading, AdminSaveBar } from "./admin-ui";
import { CollectionEditor } from "./collection-editor";
import type { NavItem } from "@/lib/types";

export function NavigationSection() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ items: NavItem[] }>("/api/admin/data?key=navigation")
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
        body: JSON.stringify({ key: "navigation", data: items }),
      });
      adminToast.success("Đã lưu menu điều hướng");
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
          { key: "label", label: "Nhãn menu", type: "text" },
          { key: "href", label: "Đường dẫn", type: "text", placeholder: "/san-pham" },
          {
            key: "children",
            label: "Mục con",
            type: "list",
            itemFields: [
              { key: "label", label: "Nhãn", type: "text" },
              { key: "href", label: "Đường dẫn", type: "text" },
            ],
            newItem: () => ({ label: "", href: "" }),
            itemLabel: (item) => String(item.label ?? ""),
          },
        ]}
        onChange={(next) => setItems(next as unknown as NavItem[])}
        newItem={() => ({ label: "", href: "" })}
        itemLabel={(item) => String(item.label ?? "")}
        addLabel="Thêm mục menu"
        emptyHint="Chưa có mục menu nào"
      />
      <AdminSaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}
