"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, ImageField } from "./admin-ui";
import { StringListEditor } from "./collection-editor";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/lib/types";

const CATEGORIES = [
  { value: "khuyen-mai", label: "Khuyến mãi" },
  { value: "ho-tro", label: "Hỗ trợ khách hàng" },
  { value: "su-kien", label: "Sự kiện" },
  { value: "kinh-nghiem", label: "Kinh nghiệm lái xe" },
  { value: "phan-tich", label: "Phân tích xe" },
];

const emptyArticle = (): NewsArticle => ({
  slug: "",
  title: "",
  excerpt: "",
  image: "",
  date: new Date().toISOString().slice(0, 10),
  category: "khuyen-mai",
  featured: false,
  author: "Honda Tiến Đạt",
  content: [""],
});

export function NewsSection() {
  const [items, setItems] = useState<{ slug: string; title: string }[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  async function loadList() {
    const data = await adminFetch<{
      index: { slug: string; title: string }[];
    }>("/api/admin/news");
    setItems(data.index);
  }

  useEffect(() => {
    loadList()
      .catch((err: Error) =>
        adminToast.error("Không tải được tin tức", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  async function openArticle(slug: string) {
    try {
      const data = await adminFetch<NewsArticle>(
        `/api/admin/news?slug=${slug}`
      );
      setSelectedSlug(slug);
      setArticle(data);
      setIsNew(false);
    } catch (err) {
      adminToast.error(
        "Không mở được bài viết",
        err instanceof Error ? err.message : undefined
      );
    }
  }

  function startNew() {
    setSelectedSlug("__new__");
    setArticle(emptyArticle());
    setIsNew(true);
  }

  function updateArticle(patch: Partial<NewsArticle>) {
    setArticle((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  async function handleSave() {
    if (!article) return;
    setSaving(true);
    try {
      if (!article.slug || !article.title) {
        throw new Error("Slug và tiêu đề không được để trống");
      }

      if (isNew) {
        await adminFetch("/api/admin/news", {
          method: "POST",
          body: JSON.stringify(article),
        });
        adminToast.success("Đã thêm bài viết", article.title);
      } else {
        await adminFetch("/api/admin/news", {
          method: "PUT",
          body: JSON.stringify({ article, oldSlug: selectedSlug }),
        });
        adminToast.success("Đã cập nhật bài viết", article.title);
      }

      await loadList();
      setIsNew(false);
      setSelectedSlug(article.slug);
    } catch (err) {
      adminToast.error(
        "Lưu thất bại",
        err instanceof Error ? err.message : "Vui lòng kiểm tra lại thông tin"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Xóa bài "${slug}"?`)) return;
    try {
      await adminFetch(`/api/admin/news?slug=${slug}`, { method: "DELETE" });
      await loadList();
      setSelectedSlug(null);
      setArticle(null);
      adminToast.success("Đã xóa bài viết");
    } catch (err) {
      adminToast.error(
        "Xóa thất bại",
        err instanceof Error ? err.message : undefined
      );
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <div className="space-y-3">
        <Button
          onClick={startNew}
          className="w-full bg-honda-red hover:bg-honda-red-hover"
        >
          <Plus className="h-4 w-4" />
          Thêm tin tức
        </Button>
        <div className="max-h-[calc(100vh-280px)] space-y-1 overflow-y-auto pr-1">
          {items.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => openArticle(item.slug)}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                selectedSlug === item.slug
                  ? "border-honda-red bg-honda-red/5 shadow-sm"
                  : "border-border/60 hover:border-border hover:bg-muted/50"
              )}
            >
              <p className="line-clamp-2 font-medium text-charcoal">
                {item.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {item.slug}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedSlug && article ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Thông tin bài viết
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Slug (URL)">
                <Input
                  value={article.slug}
                  onChange={(e) => updateArticle({ slug: e.target.value })}
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Tiêu đề">
                <Input
                  value={article.title}
                  onChange={(e) => updateArticle({ title: e.target.value })}
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Tác giả">
                <Input
                  value={article.author}
                  onChange={(e) => updateArticle({ author: e.target.value })}
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Danh mục">
                <Select
                  value={article.category}
                  onValueChange={(value) =>
                    updateArticle({ category: value ?? article.category })
                  }
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AdminField>
              <AdminField label="Ngày đăng">
                <Input
                  type="date"
                  value={article.date}
                  onChange={(e) => updateArticle({ date: e.target.value })}
                  className="h-10"
                />
              </AdminField>
            </div>

            <label className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={article.featured}
                onChange={(e) => updateArticle({ featured: e.target.checked })}
                className="accent-honda-red"
              />
              Hiển thị ở mục tin nổi bật (trang chủ)
            </label>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">Hình ảnh & tóm tắt</p>
            <AdminField label="Ảnh bài viết">
              <ImageField
                value={article.image}
                onChange={(v) => updateArticle({ image: v })}
                uploadFolder="images/news"
              />
            </AdminField>
            <AdminField label="Tóm tắt (hiển thị ở danh sách)">
              <Textarea
                rows={3}
                value={article.excerpt}
                onChange={(e) => updateArticle({ excerpt: e.target.value })}
              />
            </AdminField>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Nội dung bài viết (các đoạn văn)
            </p>
            <StringListEditor
              items={article.content}
              onChange={(content) => updateArticle({ content })}
              multiline
              addLabel="Thêm đoạn văn"
              placeholder="Nội dung đoạn văn..."
              emptyHint="Chưa có nội dung — bấm 'Thêm đoạn văn' để bắt đầu"
            />
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-honda-red hover:bg-honda-red-hover"
            >
              {saving ? "Đang lưu..." : "Lưu bài viết"}
            </Button>
            {!isNew && selectedSlug && (
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedSlug)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Xóa
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 py-20 text-center">
          <p className="text-sm font-medium text-charcoal">Chưa chọn bài viết</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn bài bên trái hoặc bấm &quot;Thêm tin tức&quot;
          </p>
        </div>
      )}
    </div>
  );
}
