"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminField, AdminLoading, ImageField } from "./admin-ui";
import { CollectionEditor, StringListEditor } from "./collection-editor";
import { cn } from "@/lib/utils";
import type { Car, CarIndexItem, CarSpecs, CarVariant } from "@/lib/types";

const emptyCar = (): Car => ({
  slug: "",
  name: "",
  tagline: "",
  category: "Sedan",
  priceFrom: 0,
  heroImage: "",
  thumbnail: "",
  gallery: [],
  description: "",
  highlights: [],
  variants: [],
  specs: {
    engine: "",
    power: "",
    torque: "",
    transmission: "",
    fuelConsumption: "",
    seats: 5,
    length: "",
    width: "",
    height: "",
  },
});

const SPEC_FIELDS: { key: keyof CarSpecs; label: string; type?: string }[] = [
  { key: "engine", label: "Động cơ" },
  { key: "power", label: "Công suất" },
  { key: "torque", label: "Mô-men xoắn" },
  { key: "transmission", label: "Hộp số" },
  { key: "fuelConsumption", label: "Tiêu thụ nhiên liệu" },
  { key: "seats", label: "Số chỗ ngồi", type: "number" },
  { key: "length", label: "Dài (mm)" },
  { key: "width", label: "Rộng (mm)" },
  { key: "height", label: "Cao (mm)" },
];

export function CarsSection() {
  const [items, setItems] = useState<CarIndexItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [indexItem, setIndexItem] = useState<CarIndexItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  async function loadList() {
    const data = await adminFetch<{ index: CarIndexItem[] }>("/api/admin/cars");
    setItems(data.index);
  }

  useEffect(() => {
    loadList()
      .catch((err: Error) =>
        adminToast.error("Không tải được danh sách xe", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  async function openCar(slug: string) {
    try {
      const data = await adminFetch<Car>(`/api/admin/cars?slug=${slug}`);
      const index = items.find((item) => item.slug === slug) ?? null;
      setSelectedSlug(slug);
      setIndexItem(index);
      setCar(data);
      setIsNew(false);
    } catch (err) {
      adminToast.error(
        "Không mở được xe",
        err instanceof Error ? err.message : undefined
      );
    }
  }

  function startNew() {
    setSelectedSlug("__new__");
    setIndexItem({
      slug: "",
      name: "",
      priceFrom: 0,
      category: "Sedan",
      featured: false,
    });
    setCar(emptyCar());
    setIsNew(true);
  }

  function updateCar(patch: Partial<Car>) {
    setCar((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  function updateSpecs(patch: Partial<CarSpecs>) {
    setCar((prev) =>
      prev ? { ...prev, specs: { ...prev.specs, ...patch } } : prev
    );
  }

  async function handleSave() {
    if (!car || !indexItem) return;
    setSaving(true);
    try {
      const item: CarIndexItem = {
        slug: indexItem.slug || car.slug,
        name: indexItem.name || car.name,
        priceFrom: indexItem.priceFrom ?? car.priceFrom,
        category: indexItem.category || car.category,
        featured: indexItem.featured ?? false,
      };

      if (!car.slug || !item.slug) {
        throw new Error("Slug không được để trống");
      }

      updateCar({ slug: item.slug });

      if (isNew) {
        await adminFetch("/api/admin/cars", {
          method: "POST",
          body: JSON.stringify({ car: { ...car, slug: item.slug }, indexItem: item }),
        });
        adminToast.success("Đã thêm xe mới", item.name);
      } else {
        await adminFetch("/api/admin/cars", {
          method: "PUT",
          body: JSON.stringify({
            car: { ...car, slug: item.slug },
            indexItem: item,
            oldSlug: selectedSlug,
          }),
        });
        adminToast.success("Đã cập nhật xe", item.name);
      }

      await loadList();
      setIsNew(false);
      setSelectedSlug(car.slug);
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
    if (!confirm(`Xóa xe "${slug}"?`)) return;
    try {
      await adminFetch(`/api/admin/cars?slug=${slug}`, { method: "DELETE" });
      await loadList();
      setSelectedSlug(null);
      setCar(null);
      adminToast.success("Đã xóa xe");
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
          Thêm xe mới
        </Button>
        <div className="max-h-[calc(100vh-280px)] space-y-1 overflow-y-auto pr-1">
          {items.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => openCar(item.slug)}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                selectedSlug === item.slug
                  ? "border-honda-red bg-honda-red/5 shadow-sm"
                  : "border-border/60 hover:border-border hover:bg-muted/50"
              )}
            >
              <p className="font-medium text-charcoal">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.slug}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedSlug && car ? (
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Thông tin hiển thị trong danh sách
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Slug (URL)">
                <Input
                  value={indexItem?.slug ?? ""}
                  onChange={(e) =>
                    setIndexItem((prev) =>
                      prev ? { ...prev, slug: e.target.value } : prev
                    )
                  }
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Tên hiển thị">
                <Input
                  value={indexItem?.name ?? ""}
                  onChange={(e) =>
                    setIndexItem((prev) =>
                      prev ? { ...prev, name: e.target.value } : prev
                    )
                  }
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Giá từ (VND)">
                <Input
                  type="number"
                  value={indexItem?.priceFrom ?? 0}
                  onChange={(e) =>
                    setIndexItem((prev) =>
                      prev
                        ? { ...prev, priceFrom: Number(e.target.value) }
                        : prev
                    )
                  }
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Danh mục">
                <Input
                  value={indexItem?.category ?? ""}
                  onChange={(e) =>
                    setIndexItem((prev) =>
                      prev ? { ...prev, category: e.target.value } : prev
                    )
                  }
                  className="h-10"
                />
              </AdminField>
            </div>

            <label className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={indexItem?.featured ?? false}
                onChange={(e) =>
                  setIndexItem((prev) =>
                    prev ? { ...prev, featured: e.target.checked } : prev
                  )
                }
                className="accent-honda-red"
              />
              Hiển thị trên trang chủ (featured)
            </label>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Hình ảnh chính
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Ảnh hero" hint="Ảnh lớn ở đầu trang chi tiết">
                <ImageField
                  value={car.heroImage}
                  onChange={(v) => updateCar({ heroImage: v })}
                  uploadFolder="images/cars"
                />
              </AdminField>
              <AdminField label="Ảnh thumbnail" hint="Ảnh nhỏ trong danh sách">
                <ImageField
                  value={car.thumbnail}
                  onChange={(v) => updateCar({ thumbnail: v })}
                  uploadFolder="images/cars"
                />
              </AdminField>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Thông tin trang chi tiết
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Tên xe (trang chi tiết)">
                <Input
                  value={car.name}
                  onChange={(e) => updateCar({ name: e.target.value })}
                  className="h-10"
                />
              </AdminField>
              <AdminField label="Câu giới thiệu ngắn">
                <Input
                  value={car.tagline}
                  onChange={(e) => updateCar({ tagline: e.target.value })}
                  className="h-10"
                />
              </AdminField>
            </div>
            <AdminField label="Mô tả">
              <Textarea
                rows={4}
                value={car.description}
                onChange={(e) => updateCar({ description: e.target.value })}
              />
            </AdminField>
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Bộ sưu tập ảnh (album)
            </p>
            <StringListEditor
              items={car.gallery}
              onChange={(gallery) => updateCar({ gallery })}
              imageUploadFolder="images/cars"
              addLabel="Thêm ảnh"
              emptyHint="Chưa có ảnh nào trong album"
            />
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Điểm nổi bật
            </p>
            <StringListEditor
              items={car.highlights}
              onChange={(highlights) => updateCar({ highlights })}
              addLabel="Thêm điểm nổi bật"
              placeholder="Ví dụ: Màn hình giải trí 8 inch"
              emptyHint="Chưa có điểm nổi bật nào"
            />
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">
              Phiên bản & giá (trang chi tiết)
            </p>
            <CollectionEditor
              items={car.variants as unknown as Record<string, unknown>[]}
              fields={[
                { key: "name", label: "Tên phiên bản", type: "text", placeholder: "G, L, RS..." },
                { key: "price", label: "Giá (VNĐ)", type: "number" },
                { key: "engine", label: "Động cơ", type: "text" },
                { key: "transmission", label: "Hộp số", type: "text" },
              ]}
              onChange={(next) =>
                updateCar({ variants: next as unknown as CarVariant[] })
              }
              newItem={() => ({ name: "", price: 0, engine: "", transmission: "" })}
              itemLabel={(item) =>
                `${String(item.name ?? "")} — ${Number(item.price ?? 0).toLocaleString("vi-VN")}`
              }
              addLabel="Thêm phiên bản"
            />
          </div>

          <div className="rounded-xl border border-border/60 p-5 space-y-4">
            <p className="text-sm font-semibold text-charcoal">Thông số kỹ thuật</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {SPEC_FIELDS.map((field) => (
                <AdminField key={field.key} label={field.label}>
                  <Input
                    type={field.type ?? "text"}
                    value={String(car.specs[field.key] ?? "")}
                    onChange={(e) =>
                      updateSpecs({
                        [field.key]:
                          field.type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                      } as Partial<CarSpecs>)
                    }
                    className="h-10"
                  />
                </AdminField>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-honda-red hover:bg-honda-red-hover"
            >
              {saving ? "Đang lưu..." : "Lưu xe"}
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
          <p className="text-sm font-medium text-charcoal">Chưa chọn xe</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn xe bên trái hoặc bấm &quot;Thêm xe mới&quot;
          </p>
        </div>
      )}
    </div>
  );
}
