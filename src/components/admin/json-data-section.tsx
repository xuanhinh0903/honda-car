"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch, formatJson } from "./admin-utils";
import type { AdminDataKey } from "@/lib/data-server";

const SECTION_META: Record<
  Exclude<AdminDataKey, "dealership" | "cars" | "news">,
  { title: string; hint: string }
> = {
  navigation: {
    title: "Menu điều hướng",
    hint: "Mảng NavItem[] — lưu vào data/navigation.json",
  },
  pricing: {
    title: "Bảng giá",
    hint: "Object pricing — lưu vào data/pricing.json",
  },
  delivery: {
    title: "Bàn giao xe",
    hint: "Ảnh + caption — lưu vào data/delivery.json",
  },
  process: {
    title: "Quy trình mua xe",
    hint: "Các bước — lưu vào data/process.json",
  },
  promotions: {
    title: "Khuyến mại",
    hint: "Mảng promotions — lưu vào data/promotions.json",
  },
};

export function JsonDataSection({
  dataKey,
}: {
  dataKey: Exclude<AdminDataKey, "dealership" | "cars" | "news">;
}) {
  const [json, setJson] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const meta = SECTION_META[dataKey];

  useEffect(() => {
    adminFetch<unknown>(`/api/admin/data?key=${dataKey}`)
      .then((data) => setJson(formatJson(data)))
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, [dataKey]);

  async function handleSave() {
    try {
      const parsed = JSON.parse(json);
      await adminFetch("/api/admin/data", {
        method: "PUT",
        body: JSON.stringify({ key: dataKey, data: parsed }),
      });
      setMessage("Đã lưu.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "JSON không hợp lệ");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Đang tải...</p>;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">{meta.title}</h3>
        <p className="text-sm text-muted-foreground">{meta.hint}</p>
      </div>
      <div className="space-y-2">
        <Label>JSON</Label>
        <Textarea
          rows={24}
          className="font-mono text-xs"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Lưu thay đổi</Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
