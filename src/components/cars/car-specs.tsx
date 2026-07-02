import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CarSpecs, CarVariant } from "@/lib/types";
import { formatVND } from "@/lib/format";

interface CarSpecsPanelProps {
  specs: CarSpecs;
  variants: CarVariant[];
  highlights: string[];
}

export function CarSpecsPanel({
  specs,
  variants,
  highlights,
}: CarSpecsPanelProps) {
  const specEntries = [
    { label: "Động cơ", value: specs.engine },
    { label: "Công suất", value: specs.power },
    { label: "Mô-men xoắn", value: specs.torque },
    { label: "Hộp số", value: specs.transmission },
    { label: "Tiêu thụ NL", value: specs.fuelConsumption },
    { label: "Số chỗ", value: `${specs.seats} chỗ` },
    { label: "Dài x Rộng x Cao", value: `${specs.length} x ${specs.width} x ${specs.height}` },
  ];

  return (
    <Tabs defaultValue="specs" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="specs" className="flex-1">
          Thông số
        </TabsTrigger>
        <TabsTrigger value="variants" className="flex-1">
          Phiên bản & Giá
        </TabsTrigger>
        <TabsTrigger value="highlights" className="flex-1">
          Điểm nổi bật
        </TabsTrigger>
      </TabsList>

      <TabsContent value="specs" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specEntries.map((entry) => (
            <div
              key={entry.label}
              className="flex justify-between p-3 bg-muted/50 rounded-lg"
            >
              <span className="text-muted-foreground text-sm">{entry.label}</span>
              <span className="font-medium text-sm text-right">{entry.value}</span>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="variants" className="mt-4">
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.name}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div>
                <p className="font-bold">{variant.name}</p>
                <p className="text-sm text-muted-foreground">
                  {variant.engine} · {variant.transmission}
                </p>
              </div>
              <p className="font-bold text-honda-red">{formatVND(variant.price)}</p>
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="highlights" className="mt-4">
        <ul className="space-y-2">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
            >
              <span className="w-2 h-2 bg-honda-red rounded-full shrink-0" />
              <span className="text-sm">{highlight}</span>
            </li>
          ))}
        </ul>
      </TabsContent>
    </Tabs>
  );
}
