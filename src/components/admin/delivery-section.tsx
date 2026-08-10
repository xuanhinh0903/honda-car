"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, AdminSaveBar } from "./admin-ui";
import { CollectionEditor } from "./collection-editor";
import type { DeliveryImage } from "@/lib/types";

export function DeliverySection() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<DeliveryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ title: string; description: string; images: DeliveryImage[] }>(
      "/api/admin/data?key=delivery"
    )
      .then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setImages(data.images);
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
        body: JSON.stringify({ key: "delivery", data: { title, description, images } }),
      });
      adminToast.success("Đã lưu album bàn giao xe");
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
        <AdminField label="Tiêu đề">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10" />
        </AdminField>
        <AdminField label="Mô tả">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-10"
          />
        </AdminField>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-charcoal">
          Album ảnh bàn giao xe
        </p>
        <CollectionEditor
          items={images as unknown as Record<string, unknown>[]}
          fields={[
            {
              key: "src",
              label: "Ảnh",
              type: "image",
              uploadFolder: "images/delivery",
            },
            { key: "caption", label: "Chú thích", type: "text" },
          ]}
          onChange={(next) => setImages(next as unknown as DeliveryImage[])}
          newItem={() => ({ src: "", caption: "" })}
          itemLabel={(item, index) =>
            String(item.caption ?? "") || `Ảnh ${index + 1}`
          }
          addLabel="Thêm ảnh"
        />
      </div>

      <AdminSaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}
