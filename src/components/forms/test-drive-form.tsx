"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CarIndexItem } from "@/lib/types";

export function TestDriveForm({ cars }: { cars: CarIndexItem[] }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    car: "",
    date: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Test drive form submitted:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-200">
        <p className="text-green-700 font-semibold text-lg mb-2">
          Đăng ký thành công!
        </p>
        <p className="text-muted-foreground">
          Chúng tôi sẽ liên hệ xác nhận lịch lái thử trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="td-name">Họ và tên *</Label>
          <Input
            id="td-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nguyễn Văn A"
          />
        </div>
        <div>
          <Label htmlFor="td-phone">Số điện thoại *</Label>
          <Input
            id="td-phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="0901234567"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="td-email">Email</Label>
        <Input
          id="td-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="email@example.com"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Dòng xe quan tâm *</Label>
          <Select
            value={form.car}
            onValueChange={(value) => setForm({ ...form, car: value ?? "" })}
          >
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
          <Label htmlFor="td-date">Ngày mong muốn</Label>
          <Input
            id="td-date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="td-note">Ghi chú</Label>
        <Textarea
          id="td-note"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Yêu cầu thêm (nếu có)..."
          rows={3}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-honda-red hover:bg-honda-red-hover text-white border-0"
      >
        Đăng ký lái thử
      </Button>
    </form>
  );
}
