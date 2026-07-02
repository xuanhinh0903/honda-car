"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminFetch, formatJson, uploadImage } from "./admin-utils";
import type { Car, CarIndexItem } from "@/lib/types";

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

export function CarsSection() {
  const [items, setItems] = useState<CarIndexItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [carJson, setCarJson] = useState("");
  const [indexItem, setIndexItem] = useState<CarIndexItem | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);

  async function loadList() {
    const data = await adminFetch<{ index: CarIndexItem[] }>("/api/admin/cars");
    setItems(data.index);
  }

  useEffect(() => {
    loadList()
      .catch((err: Error) => setMessage(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function openCar(slug: string) {
    const car = await adminFetch<Car>(`/api/admin/cars?slug=${slug}`);
    const index = items.find((item) => item.slug === slug) ?? null;
    setSelectedSlug(slug);
    setIndexItem(index);
    setCarJson(formatJson(car));
    setIsNew(false);
    setMessage("");
  }

  function startNew() {
    const car = emptyCar();
    setSelectedSlug("__new__");
    setIndexItem({
      slug: "",
      name: "",
      priceFrom: 0,
      category: "Sedan",
      featured: false,
    });
    setCarJson(formatJson(car));
    setIsNew(true);
    setMessage("");
  }

  async function handleSave() {
    try {
      const car = JSON.parse(carJson) as Car;
      const item: CarIndexItem = {
        slug: indexItem?.slug || car.slug,
        name: indexItem?.name || car.name,
        priceFrom: indexItem?.priceFrom ?? car.priceFrom,
        category: indexItem?.category || car.category,
        featured: indexItem?.featured ?? false,
      };

      if (!car.slug || !item.slug) {
        throw new Error("Slug không được để trống");
      }

      car.slug = item.slug;

      if (isNew) {
        await adminFetch("/api/admin/cars", {
          method: "POST",
          body: JSON.stringify({ car, indexItem: item }),
        });
      } else {
        await adminFetch("/api/admin/cars", {
          method: "PUT",
          body: JSON.stringify({
            car,
            indexItem: item,
            oldSlug: selectedSlug,
          }),
        });
      }

      await loadList();
      setMessage("Đã lưu xe.");
      setIsNew(false);
      setSelectedSlug(car.slug);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Lỗi JSON hoặc lưu thất bại");
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Xóa xe "${slug}"?`)) return;
    await adminFetch(`/api/admin/cars?slug=${slug}`, { method: "DELETE" });
    await loadList();
    setSelectedSlug(null);
    setMessage("Đã xóa xe.");
  }

  async function handleUpload(file: File, field: "heroImage" | "thumbnail") {
    const path = await uploadImage(file, "images/cars");
    const car = JSON.parse(carJson) as Car;
    car[field] = path;
    setCarJson(formatJson(car));
    setMessage(`Đã upload: ${path}`);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Đang tải...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="space-y-2">
        <Button className="w-full" onClick={startNew}>
          + Thêm xe
        </Button>
        {items.map((item) => (
          <button
            key={item.slug}
            type="button"
            onClick={() => openCar(item.slug)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              selectedSlug === item.slug
                ? "border-honda-red bg-honda-red/5"
                : "hover:bg-muted"
            }`}
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </button>
        ))}
      </div>

      {selectedSlug ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={indexItem?.slug ?? ""}
                onChange={(e) =>
                  setIndexItem((prev) =>
                    prev ? { ...prev, slug: e.target.value } : prev
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tên hiển thị (danh sách)</Label>
              <Input
                value={indexItem?.name ?? ""}
                onChange={(e) =>
                  setIndexItem((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Giá từ</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Input
                value={indexItem?.category ?? ""}
                onChange={(e) =>
                  setIndexItem((prev) =>
                    prev ? { ...prev, category: e.target.value } : prev
                  )
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={indexItem?.featured ?? false}
                onChange={(e) =>
                  setIndexItem((prev) =>
                    prev ? { ...prev, featured: e.target.checked } : prev
                  )
                }
              />
              Hiển thị trang chủ (featured)
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Label className="w-full">Upload ảnh</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file, "heroImage");
              }}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file, "thumbnail");
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Chi tiết xe (JSON — lưu vào data/cars/)</Label>
            <Textarea
              rows={22}
              className="font-mono text-xs"
              value={carJson}
              onChange={(e) => setCarJson(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleSave}>Lưu xe</Button>
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
          Chọn xe bên trái hoặc thêm mới.
        </p>
      )}

      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}
