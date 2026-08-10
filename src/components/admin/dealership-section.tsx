"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, AdminSaveBar } from "./admin-ui";
import type { DealershipInfo } from "@/lib/types";

export function DealershipSection() {
  const [data, setData] = useState<DealershipInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<DealershipInfo>("/api/admin/data?key=dealership")
      .then(setData)
      .catch((err: Error) =>
        adminToast.error("Không tải được dữ liệu", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await adminFetch("/api/admin/data", {
        method: "PUT",
        body: JSON.stringify({ key: "dealership", data }),
      });
      adminToast.success("Đã lưu thông tin đại lý", "Website sẽ cập nhật ngay.");
    } catch (err) {
      adminToast.error(
        "Lưu thất bại",
        err instanceof Error ? err.message : "Vui lòng thử lại"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !data) return <AdminLoading />;

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <AdminField label="Tên đại lý">
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="h-10"
          />
        </AdminField>
        <AdminField label="Slogan / Tagline">
          <Input
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
            className="h-10"
          />
        </AdminField>
        <AdminField label="Địa chỉ">
          <Input
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            className="h-10"
          />
        </AdminField>
        <AdminField label="Hotline (số)">
          <Input
            value={data.hotline}
            onChange={(e) => setData({ ...data, hotline: e.target.value })}
            className="h-10"
          />
        </AdminField>
        <AdminField label="Hotline hiển thị">
          <Input
            value={data.hotlineDisplay}
            onChange={(e) =>
              setData({ ...data, hotlineDisplay: e.target.value })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Email">
          <Input
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="h-10"
          />
        </AdminField>
        <AdminField label="Giám đốc / Tư vấn">
          <Input
            value={data.director}
            onChange={(e) => setData({ ...data, director: e.target.value })}
            className="h-10"
          />
        </AdminField>
        <AdminField label="Chức danh">
          <Input
            value={data.directorTitle}
            onChange={(e) =>
              setData({ ...data, directorTitle: e.target.value })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Facebook cá nhân">
          <Input
            value={data.social.facebook}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, facebook: e.target.value },
              })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Facebook Fanpage">
          <Input
            value={data.social.facebookPage}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, facebookPage: e.target.value },
              })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Zalo">
          <Input
            value={data.social.zalo}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, zalo: e.target.value },
              })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="YouTube">
          <Input
            value={data.social.youtube}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, youtube: e.target.value },
              })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Diện tích showroom">
          <Input
            value={data.stats.area}
            onChange={(e) =>
              setData({
                ...data,
                stats: { ...data.stats, area: e.target.value },
              })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Số tầng">
          <Input
            type="number"
            value={data.stats.floors}
            onChange={(e) =>
              setData({
                ...data,
                stats: { ...data.stats, floors: Number(e.target.value) },
              })
            }
            className="h-10"
          />
        </AdminField>
        <AdminField label="Nhân sự">
          <Input
            type="number"
            value={data.stats.staff}
            onChange={(e) =>
              setData({
                ...data,
                stats: { ...data.stats, staff: Number(e.target.value) },
              })
            }
            className="h-10"
          />
        </AdminField>
      </div>

      <AdminField label="Giới thiệu ngắn">
        <Textarea
          rows={3}
          value={data.intro}
          onChange={(e) => setData({ ...data, intro: e.target.value })}
        />
      </AdminField>
      <AdminField label="Giới thiệu mở rộng">
        <Textarea
          rows={4}
          value={data.introExtended}
          onChange={(e) =>
            setData({ ...data, introExtended: e.target.value })
          }
        />
      </AdminField>

      <AdminSaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}
