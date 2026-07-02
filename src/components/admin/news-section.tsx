"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch, formatJson, uploadImage } from "./admin-utils";
import type { NewsArticle } from "@/lib/types";

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
  const [articleJson, setArticleJson] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  async function loadList() {
    const data = await adminFetch<{
      index: { slug: string; title: string }[];
    }>("/api/admin/news");
    setItems(data.index);
  }

  useEffect(() => {
    loadList()
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function openArticle(slug: string) {
    const article = await adminFetch<NewsArticle>(
      `/api/admin/news?slug=${slug}`
    );
    setSelectedSlug(slug);
    setArticleJson(formatJson(article));
    setIsNew(false);
    setMessage("");
  }

  function startNew() {
    setSelectedSlug("__new__");
    setArticleJson(formatJson(emptyArticle()));
    setIsNew(true);
    setMessage("");
  }

  async function handleSave() {
    try {
      const article = JSON.parse(articleJson) as NewsArticle;
      if (!article.slug || !article.title) {
        throw new Error("Slug và tiêu đề không được để trống");
      }

      if (isNew) {
        await adminFetch("/api/admin/news", {
          method: "POST",
          body: JSON.stringify(article),
        });
      } else {
        await adminFetch("/api/admin/news", {
          method: "PUT",
          body: JSON.stringify({ article, oldSlug: selectedSlug }),
        });
      }

      await loadList();
      setMessage("Đã lưu bài viết.");
      setIsNew(false);
      setSelectedSlug(article.slug);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Lỗi");
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Xóa bài "${slug}"?`)) return;
    await adminFetch(`/api/admin/news?slug=${slug}`, { method: "DELETE" });
    await loadList();
    setSelectedSlug(null);
    setMessage("Đã xóa bài viết.");
  }

  async function handleUpload(file: File) {
    const path = await uploadImage(file, "images/news");
    const article = JSON.parse(articleJson) as NewsArticle;
    article.image = path;
    setArticleJson(formatJson(article));
    setMessage(`Đã upload: ${path}`);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Đang tải...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-2">
        <Button className="w-full" onClick={startNew}>
          + Thêm tin tức
        </Button>
        {items.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => openArticle(item.slug)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              selectedSlug === item.slug
                ? "border-honda-red bg-honda-red/5"
                : "hover:bg-muted"
            }`}
          >
            <p className="font-medium line-clamp-2">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </button>
        ))}
      </div>

      {selectedSlug ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload ảnh bài viết</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Nội dung bài (JSON — lưu vào data/news/)</Label>
            <Textarea
              rows={24}
              className="font-mono text-xs"
              value={articleJson}
              onChange={(e) => setArticleJson(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave}>Lưu bài viết</Button>
            {!isNew && selectedSlug && (
              <Button
                variant="outline"
                onClick={() => handleDelete(selectedSlug)}
              >
                Xóa
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Chọn bài viết bên trái hoặc thêm mới.
        </p>
      )}

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
