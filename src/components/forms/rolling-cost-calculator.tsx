"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getCars, getDealership } from "@/lib/data";
import { formatVND } from "@/lib/format";

const cars = getCars();
const dealership = getDealership();

const REGISTRATION_FEE_RATE = 0.1;
const INSURANCE_RATE = 0.015;
const SERVICE_FEE = 5_000_000;

export function RollingCostCalculator() {
  const [carSlug, setCarSlug] = useState("");
  const [variantPrice, setVariantPrice] = useState(0);
  const [location, setLocation] = useState("hanoi");

  const selectedCar = cars.find((c) => c.slug === carSlug);

  const registrationFee = variantPrice * REGISTRATION_FEE_RATE;
  const insurance = variantPrice * INSURANCE_RATE;
  const plateFee = location === "hanoi" ? 20_000_000 : 1_000_000;
  const total = variantPrice + registrationFee + insurance + plateFee + SERVICE_FEE;

  const handleCarChange = (slug: string | null) => {
    const s = slug ?? "";
    setCarSlug(s);
    const car = cars.find((c) => c.slug === s);
    setVariantPrice(car?.priceFrom ?? 0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm space-y-4">
        <div>
          <Label>Chọn dòng xe</Label>
          <Select value={carSlug} onValueChange={handleCarChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn dòng xe" />
            </SelectTrigger>
            <SelectContent>
              {cars.map((car) => (
                <SelectItem key={car.slug} value={car.slug}>
                  Honda {car.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Giá xe (VNĐ)</Label>
          <Input
            id="price"
            type="number"
            value={variantPrice || ""}
            onChange={(e) => setVariantPrice(Number(e.target.value))}
            placeholder="Nhập giá xe"
          />
        </div>

        <div>
          <Label>Khu vực đăng ký</Label>
          <Select value={location} onValueChange={(v) => setLocation(v ?? "hanoi")}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hanoi">Hà Nội</SelectItem>
              <SelectItem value="other">Tỉnh khác</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {variantPrice > 0 && (
        <div className="mt-6 bg-charcoal rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-4">
            Ước tính chi phí lăn bánh
            {selectedCar && ` - Honda ${selectedCar.name}`}
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-silver">Giá xe</span>
              <span>{formatVND(variantPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Thuế trước bạ (10%)</span>
              <span>{formatVND(registrationFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Bảo hiểm (~1.5%)</span>
              <span>{formatVND(insurance)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Phí biển số</span>
              <span>{formatVND(plateFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-silver">Phí dịch vụ</span>
              <span>{formatVND(SERVICE_FEE)}</span>
            </div>
            <div className="border-t border-white/20 pt-3 flex justify-between font-bold text-lg">
              <span>Tổng ước tính</span>
              <span className="text-gold-accent">{formatVND(total)}</span>
            </div>
          </div>
          <p className="text-xs text-silver mt-4">
            * Chi phí thực tế có thể thay đổi. Liên hệ hotline để nhận báo giá chính xác.
          </p>
          <Button
            className="w-full mt-4 bg-honda-red hover:bg-honda-red-hover text-white border-0"
            onClick={() => (window.location.href = `tel:${dealership.hotline}`)}
          >
            Liên hệ tư vấn
          </Button>
        </div>
      )}
    </div>
  );
}
