"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, AdminSaveBar } from "./admin-ui";
import { CollectionEditor } from "./collection-editor";
import type { PricingCar } from "@/lib/types";

export function PricingSection() {
  const [title, setTitle] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [cars, setCars] = useState<PricingCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ title: string; updatedAt: string; cars: PricingCar[] }>(
      "/api/admin/data?key=pricing"
    )
      .then((data) => {
        setTitle(data.title);
        setUpdatedAt(data.updatedAt);
        setCars(data.cars);
      })
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
        body: JSON.stringify({ key: "pricing", data: { title, updatedAt, cars } }),
      });
      adminToast.success("Đã lưu bảng giá");
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
      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Tiêu đề bảng giá">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10" />
        </AdminField>
        <AdminField label="Ngày cập nhật">
          <Input
            type="date"
            value={updatedAt}
            onChange={(e) => setUpdatedAt(e.target.value)}
            className="h-10"
          />
        </AdminField>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-charcoal">
          Dòng xe & phiên bản
        </p>
        <CollectionEditor
          items={cars as unknown as Record<string, unknown>[]}
          fields={[
            { key: "slug", label: "Slug", type: "text", placeholder: "city" },
            { key: "name", label: "Tên xe", type: "text" },
            {
              key: "variants",
              label: "Phiên bản & giá",
              type: "list",
              itemFields: [
                { key: "name", label: "Phiên bản", type: "text", placeholder: "G" },
                { key: "price", label: "Giá (VNĐ)", type: "number" },
              ],
              newItem: () => ({ name: "", price: 0 }),
              itemLabel: (item) =>
                `${String(item.name ?? "")} — ${Number(item.price ?? 0).toLocaleString("vi-VN")}`,
            },
          ]}
          onChange={(next) => setCars(next as unknown as PricingCar[])}
          newItem={() => ({ slug: "", name: "", variants: [] })}
          itemLabel={(item) => String(item.name ?? "")}
          addLabel="Thêm dòng xe"
        />
      </div>

      <AdminSaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}
