"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CarIndexItem } from "@/lib/types";

interface QuoteFormProps {
  compact?: boolean;
  cars: CarIndexItem[];
}

export function QuoteForm({ compact = false, cars }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    car: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/telegram/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quote",
          name: form.name,
          phone: form.phone,
          email: form.email,
          car: form.car,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Không gửi được yêu cầu");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <p className="text-green-600 font-semibold mb-2">
          Cảm ơn bạn đã gửi yêu cầu!
        </p>
        <p className="text-sm text-muted-foreground">
          Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label htmlFor="quote-name" className={compact ? "text-silver text-xs" : ""}>
          Họ và tên
        </Label>
        <Input
          id="quote-name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={compact ? "bg-white/10 border-white/20 text-white placeholder:text-white/40" : ""}
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <Label htmlFor="quote-phone" className={compact ? "text-silver text-xs" : ""}>
          Số điện thoại
        </Label>
        <Input
          id="quote-phone"
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={compact ? "bg-white/10 border-white/20 text-white placeholder:text-white/40" : ""}
          placeholder="0901234567"
        />
      </div>
      {!compact && (
        <div>
          <Label htmlFor="quote-email">Email</Label>
          <Input
            id="quote-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
      )}
      <div>
        <Label className={compact ? "text-silver text-xs" : ""}>Chọn dòng xe</Label>
        <Select
          value={form.car}
          onValueChange={(value) => setForm({ ...form, car: value ?? "" })}
        >
          <SelectTrigger className={compact ? "bg-white/10 border-white/20 text-white w-full" : "w-full"}>
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
      <Button
        type="submit"
        disabled={submitting}
        className={`w-full ${compact ? "bg-honda-red hover:bg-honda-red-hover text-white" : ""}`}
      >
        {submitting ? "Đang gửi..." : "Gửi yêu cầu"}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
