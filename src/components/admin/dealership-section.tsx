"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "./admin-utils";
import type { DealershipInfo } from "@/lib/types";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function DealershipSection() {
  const [data, setData] = useState<DealershipInfo | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<DealershipInfo>("/api/admin/data?key=dealership")
      .then(setData)
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!data) return;
    setMessage("");
    try {
      await adminFetch("/api/admin/data", {
        method: "PUT",
        body: JSON.stringify({ key: "dealership", data }),
      });
      setMessage("Đã lưu thông tin đại lý.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Lỗi");
    }
  }

  if (loading || !data) {
    return <p className="text-sm text-muted-foreground">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Tên đại lý">
          <Input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
        </Field>
        <Field label="Slogan / Tagline">
          <Input
            value={data.tagline}
            onChange={(e) => setData({ ...data, tagline: e.target.value })}
          />
        </Field>
        <Field label="Địa chỉ">
          <Input
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
        </Field>
        <Field label="Hotline (số)">
          <Input
            value={data.hotline}
            onChange={(e) => setData({ ...data, hotline: e.target.value })}
          />
        </Field>
        <Field label="Hotline hiển thị">
          <Input
            value={data.hotlineDisplay}
            onChange={(e) =>
              setData({ ...data, hotlineDisplay: e.target.value })
            }
          />
        </Field>
        <Field label="Email">
          <Input
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </Field>
        <Field label="Giám đốc / Tư vấn">
          <Input
            value={data.director}
            onChange={(e) => setData({ ...data, director: e.target.value })}
          />
        </Field>
        <Field label="Chức danh">
          <Input
            value={data.directorTitle}
            onChange={(e) =>
              setData({ ...data, directorTitle: e.target.value })
            }
          />
        </Field>
        <Field label="Facebook cá nhân">
          <Input
            value={data.social.facebook}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, facebook: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Facebook Fanpage">
          <Input
            value={data.social.facebookPage}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, facebookPage: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Zalo">
          <Input
            value={data.social.zalo}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, zalo: e.target.value },
              })
            }
          />
        </Field>
        <Field label="YouTube">
          <Input
            value={data.social.youtube}
            onChange={(e) =>
              setData({
                ...data,
                social: { ...data.social, youtube: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Diện tích showroom">
          <Input
            value={data.stats.area}
            onChange={(e) =>
              setData({
                ...data,
                stats: { ...data.stats, area: e.target.value },
              })
            }
          />
        </Field>
        <Field label="Số tầng">
          <Input
            type="number"
            value={data.stats.floors}
            onChange={(e) =>
              setData({
                ...data,
                stats: { ...data.stats, floors: Number(e.target.value) },
              })
            }
          />
        </Field>
        <Field label="Nhân sự">
          <Input
            type="number"
            value={data.stats.staff}
            onChange={(e) =>
              setData({
                ...data,
                stats: { ...data.stats, staff: Number(e.target.value) },
              })
            }
          />
        </Field>
      </div>

      <Field label="Giới thiệu ngắn">
        <Textarea
          rows={3}
          value={data.intro}
          onChange={(e) => setData({ ...data, intro: e.target.value })}
        />
      </Field>
      <Field label="Giới thiệu mở rộng">
        <Textarea
          rows={4}
          value={data.introExtended}
          onChange={(e) =>
            setData({ ...data, introExtended: e.target.value })
          }
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave}>Lưu thay đổi</Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
