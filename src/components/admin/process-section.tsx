"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, AdminSaveBar } from "./admin-ui";
import { CollectionEditor } from "./collection-editor";
import type { ProcessStep } from "@/lib/types";

export function ProcessSection() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ title: string; steps: ProcessStep[] }>(
      "/api/admin/data?key=process"
    )
      .then((data) => {
        setTitle(data.title);
        setSteps(data.steps);
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
        body: JSON.stringify({ key: "process", data: { title, steps } }),
      });
      adminToast.success("Đã lưu quy trình mua xe");
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
      <AdminField label="Tiêu đề" hint="Hiển thị trên trang chủ">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10" />
      </AdminField>

      <div>
        <p className="mb-2 text-sm font-medium text-charcoal">
          Các bước mua xe
        </p>
        <CollectionEditor
          items={steps as unknown as Record<string, unknown>[]}
          fields={[
            {
              key: "step",
              label: "Số bước",
              type: "number",
            },
            {
              key: "title",
              label: "Tiêu đề bước",
              type: "text",
            },
            {
              key: "description",
              label: "Mô tả",
              type: "textarea",
            },
          ]}
          onChange={(next) =>
            setSteps(next as unknown as ProcessStep[])
          }
          newItem={() => ({
            step: steps.length + 1,
            title: "",
            description: "",
          })}
          itemLabel={(item) =>
            `${String(item.step ?? "?")}. ${String(item.title ?? "")}`
          }
          addLabel="Thêm bước"
        />
      </div>

      <AdminSaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}
