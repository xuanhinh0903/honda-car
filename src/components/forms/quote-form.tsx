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
import { getCars } from "@/lib/data";

const cars = getCars();

interface QuoteFormProps {
  compact?: boolean;
}

export function QuoteForm({ compact = false }: QuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    car: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Quote form submitted:", form);
    setSubmitted(true);
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
        className={`w-full ${compact ? "bg-honda-red hover:bg-honda-red-hover text-white" : ""}`}
      >
        Gửi yêu cầu
      </Button>
    </form>
  );
}
