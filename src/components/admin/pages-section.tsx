"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, AdminSaveBar, ImageField } from "./admin-ui";
import { CollectionEditor } from "./collection-editor";
import type { PageContent } from "@/lib/types";

function TextField({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea" | "date";
  hint?: string;
}) {
  return (
    <AdminField label={label} hint={hint}>
      {type === "textarea" ? (
        <Textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10"
        />
      )}
    </AdminField>
  );
}

function CtaFields({
  label,
  value,
  onChange,
}: {
  label: string;
  value: { label: string; href: string };
  onChange: (value: { label: string; href: string }) => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
      <p className="text-sm font-medium text-charcoal">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Nhãn nút" value={value.label} onChange={(v) => onChange({ ...value, label: v })} />
        <TextField label="Đường dẫn" value={value.href} onChange={(v) => onChange({ ...value, href: v })} />
      </div>
    </div>
  );
}

export function PagesSection() {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<PageContent>("/api/admin/data?key=pages")
      .then(setContent)
      .catch((err: Error) =>
        adminToast.error("Không tải được dữ liệu", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  function update(path: string[], value: unknown) {
    setContent((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev) as unknown as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let node: any = next;
      for (let i = 0; i < path.length - 1; i++) {
        node = node[path[i]];
      }
      node[path[path.length - 1]] = value;
      return next as unknown as PageContent;
    });
  }

  function getValue(path: string[]) {
    if (!content) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let node: any = content;
    for (const key of path) {
      node = node?.[key];
    }
    return node;
  }

  function val(path: string[]) {
    const value = getValue(path);
    return typeof value === "string" ? value : "";
  }

  function ctaVal(path: string[]) {
    const value = getValue(path);
    return (value ?? { label: "", href: "" }) as {
      label: string;
      href: string;
    };
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    try {
      await adminFetch("/api/admin/data", {
        method: "PUT",
        body: JSON.stringify({ key: "pages", data: content }),
      });
      adminToast.success("Đã lưu nội dung trang", "Website sẽ cập nhật ngay.");
    } catch (err) {
      adminToast.error(
        "Lưu thất bại",
        err instanceof Error ? err.message : undefined
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !content) return <AdminLoading />;

  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList>
        <TabsTrigger value="home">Trang chủ</TabsTrigger>
        <TabsTrigger value="about">Giới thiệu</TabsTrigger>
        <TabsTrigger value="contact">Liên hệ</TabsTrigger>
        <TabsTrigger value="subpages">Trang con</TabsTrigger>
      </TabsList>

      <TabsContent value="home" className="pt-6">
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">Hero (banner đầu trang)</p>
            <AdminField
              label="Ảnh nền"
              hint="Upload ảnh nền banner đầu trang"
            >
              <ImageField
                value={val(["home", "hero", "image"])}
                onChange={(v) => update(["home", "hero", "image"], v)}
                uploadFolder="images/hero"
              />
            </AdminField>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Nhãn hotline"
                value={val(["home", "hero", "hotlineLabel"])}
                onChange={(v) => update(["home", "hero", "hotlineLabel"], v)}
              />
            </div>
            <TextField
              label="Mô tả hero"
              type="textarea"
              value={val(["home", "hero", "description"])}
              onChange={(v) => update(["home", "hero", "description"], v)}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <CtaFields
                label="Nút chính"
                value={ctaVal(["home", "hero", "primaryCta"])}
                onChange={(v) => update(["home", "hero", "primaryCta"], v)}
              />
              <CtaFields
                label="Nút phụ 1"
                value={ctaVal(["home", "hero", "secondaryCta"])}
                onChange={(v) => update(["home", "hero", "secondaryCta"], v)}
              />
              <CtaFields
                label="Nút phụ 2"
                value={ctaVal(["home", "hero", "tertiaryCta"])}
                onChange={(v) => update(["home", "hero", "tertiaryCta"], v)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">Tiêu đề các mục trên trang chủ</p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Giới thiệu — tiêu đề phụ"
                value={val(["home", "dealerIntro", "subtitle"])}
                onChange={(v) => update(["home", "dealerIntro", "subtitle"], v)}
              />
              <div />
              <TextField
                label="Sản phẩm — tiêu đề phụ"
                value={val(["home", "showcase", "subtitle"])}
                onChange={(v) => update(["home", "showcase", "subtitle"], v)}
              />
              <TextField
                label="Sản phẩm — tiêu đề"
                value={val(["home", "showcase", "title"])}
                onChange={(v) => update(["home", "showcase", "title"], v)}
              />
              <TextField
                label="Quy trình — tiêu đề phụ"
                value={val(["home", "process", "subtitle"])}
                onChange={(v) => update(["home", "process", "subtitle"], v)}
              />
              <TextField
                label="Quy trình — tiêu đề"
                value={val(["home", "process", "title"])}
                onChange={(v) => update(["home", "process", "title"], v)}
              />
              <TextField
                label="Tin tức — tiêu đề phụ"
                value={val(["home", "newsPreview", "subtitle"])}
                onChange={(v) => update(["home", "newsPreview", "subtitle"], v)}
              />
              <TextField
                label="Tin tức — tiêu đề"
                value={val(["home", "newsPreview", "title"])}
                onChange={(v) => update(["home", "newsPreview", "title"], v)}
              />
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">Video giới thiệu</p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Tiêu đề phụ"
                value={val(["home", "video", "subtitle"])}
                onChange={(v) => update(["home", "video", "subtitle"], v)}
              />
              <TextField
                label="Tiêu đề"
                value={val(["home", "video", "title"])}
                onChange={(v) => update(["home", "video", "title"], v)}
              />
            </div>
            <TextField
              label="ID video YouTube"
              hint="Lấy từ link video, ví dụ: dQw4w9WgXcQ"
              value={val(["home", "video", "youtubeId"])}
              onChange={(v) => update(["home", "video", "youtubeId"], v)}
            />
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">Banner cuối trang (CTA)</p>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Tiêu đề"
                value={val(["home", "cta", "title"])}
                onChange={(v) => update(["home", "cta", "title"], v)}
              />
              <TextField
                label="Mô tả"
                value={val(["home", "cta", "description"])}
                onChange={(v) => update(["home", "cta", "description"], v)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <CtaFields
                label="Nút chính"
                value={ctaVal(["home", "cta", "primaryCta"])}
                onChange={(v) => update(["home", "cta", "primaryCta"], v)}
              />
              <CtaFields
                label="Nút gọi"
                value={ctaVal(["home", "cta", "secondaryCta"])}
                onChange={(v) => update(["home", "cta", "secondaryCta"], v)}
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="about" className="pt-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Tiêu đề phụ"
              value={val(["about", "subtitle"])}
              onChange={(v) => update(["about", "subtitle"], v)}
            />
            <TextField
              label="Tiêu đề"
              value={val(["about", "title"])}
              onChange={(v) => update(["about", "title"], v)}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-charcoal">
              Các mục nổi bật (thêm / sửa / xóa)
            </p>
            <CollectionEditor
              items={content.about.features as unknown as Record<string, unknown>[]}
              fields={[
                { key: "title", label: "Tiêu đề", type: "text" },
                { key: "description", label: "Mô tả", type: "textarea" },
              ]}
              onChange={(next) =>
                update(
                  ["about", "features"],
                  next as unknown as PageContent["about"]["features"]
                )
              }
              newItem={() => ({ title: "", description: "" })}
              itemLabel={(item, index) =>
                String(item.title ?? "") || `Mục ${index + 1}`
              }
              addLabel="Thêm mục"
            />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="contact" className="pt-6">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Tiêu đề phụ"
              value={val(["contact", "subtitle"])}
              onChange={(v) => update(["contact", "subtitle"], v)}
            />
            <TextField
              label="Tiêu đề"
              value={val(["contact", "title"])}
              onChange={(v) => update(["contact", "title"], v)}
            />
          </div>
          <TextField
            label="Giờ làm việc"
            value={val(["contact", "workingHours"])}
            onChange={(v) => update(["contact", "workingHours"], v)}
          />
          <TextField
            label="Đường dẫn bản đồ nhúng"
            hint="Link iframe Google Maps"
            value={val(["contact", "mapEmbedUrl"])}
            onChange={(v) => update(["contact", "mapEmbedUrl"], v)}
          />
        </div>
      </TabsContent>

      <TabsContent value="subpages" className="pt-6">
        <div className="space-y-8">
          {(["products", "delivery", "news", "testDrive", "rollingCost"] as const).map(
            (key) => {
              const labels: Record<string, string> = {
                products: "Trang Sản phẩm",
                delivery: "Trang Bàn giao xe",
                news: "Trang Tin tức",
                testDrive: "Trang Đăng ký lái thử",
                rollingCost: "Trang Tính phí lăn bánh",
              };
              return (
                <div
                  key={key}
                  className="rounded-xl border border-border/60 p-5 space-y-4"
                >
                  <p className="text-sm font-semibold text-charcoal">
                    {labels[key]}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                      label="Tiêu đề phụ"
                      value={val([key, "subtitle"])}
                      onChange={(v) => update([key, "subtitle"], v)}
                    />
                    <TextField
                      label="Tiêu đề"
                      value={val([key, "title"])}
                      onChange={(v) => update([key, "title"], v)}
                    />
                  </div>
                  <TextField
                    label="Mô tả"
                    type="textarea"
                    value={val([key, "description"])}
                    onChange={(v) => update([key, "description"], v)}
                  />
                </div>
              );
            }
          )}
        </div>
      </TabsContent>

      <AdminSaveBar onSave={handleSave} saving={saving} />
    </Tabs>
  );
}
